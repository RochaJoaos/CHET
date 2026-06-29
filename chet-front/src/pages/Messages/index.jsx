import { useEffect, useRef, useState } from "react";
import './style.css'
import { getMessagesPage, getUsers, createConversation, getConversations, getMessages, sendMessage} from "../../services/api";
import { connectSocket,  subscribeToConversation, subscribeToStatus} from "../../services/socket";
import ProfileSettings from "./components/ProfileSettings";

const API_BASE_URL = "http://localhost:8080";

const parseMessageContent = (msg) => {
    if (!msg) return { text: "", isEdited: false, replyTo: null, isDeleted: false };
    
    if (msg.content === "Mensagem apagada") {
        return { text: "Mensagem apagada", isEdited: false, replyTo: null, isDeleted: true };
    }
    
    try {
        const parsed = JSON.parse(msg.content);
        if (parsed && typeof parsed === 'object' && parsed.text) {
            return {
                text: parsed.text,
                isEdited: parsed.isEdited || false,
                replyTo: parsed.replyTo || null,
                isDeleted: false
            };
        }
    } catch (e) {}
    return { text: msg.content, isEdited: false, replyTo: null, isDeleted: false };
};

export default function ChatLayout() {
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [chatPreviews, setChatPreviews] = useState({});
  const [toast, setToast] = useState(null);
  
  const contatsRef = useRef(null);
  const chatRef = useRef(null);
  const dividerRef = useRef(null);
  const overlayRef = useRef(null);
  const mainRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [pageData, setPageData] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("conversas");
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  
  // Modal de criar grupo
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
  const [groupName, setGroupName] = useState("");

  // Modal de renomear grupo
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  // Modal de adicionar participante
  const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] = useState(false);
  const [addParticipantUserId, setAddParticipantUserId] = useState("");

  const selectedConvRef = useRef(selectedConversation);
  const pageDataRef = useRef(pageData);
  const activeSubscriptions = useRef(new Set());
  const toastTimerRef = useRef(null);

  useEffect(() => { selectedConvRef.current = selectedConversation; }, [selectedConversation]);
  useEffect(() => { pageDataRef.current = pageData; }, [pageData]);

  const getAuthToken = () => {
    let token = localStorage.getItem("token") || localStorage.getItem("jwt") || localStorage.getItem("access_token");
    if (token) return token.replace(/['\"]+/g, '');
    
    for (let i = 0; i < localStorage.length; i++) {
        let val = localStorage.getItem(localStorage.key(i));
        if (val && val.includes('eyJ')) {
            if (val.startsWith('{')) {
                try { let p = JSON.parse(val); if (p.token) return p.token; } catch(e){} 
            } else {
                return val.replace(/['\"]+/g, '');
            }
        }
    }
    return "";
  };

  // Separa conversas por tipo
  const privateConversations = conversations.filter(c => c.type === "PRIVATE");
  const groupConversations = conversations.filter(c => c.type === "GROUP");

  async function handleCreateConversation(userId) {
    try {
      await createConversation(userId);
    } catch (err) {}
  }

  const toggleUserSelection = (userId) => {
    setSelectedGroupUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedGroupUsers.length === 0) return alert("Preencha o nome e selecione usuários");
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name: groupName, userIds: selectedGroupUsers })
      });
      if (!response.ok) throw new Error("Erro ao criar grupo");
      const newGroup = await response.json();
      setConversations(prev => [...prev, newGroup]);
    } catch (err) {
      alert("Erro ao criar grupo: " + err.message);
    }
    setIsGroupModalOpen(false);
    setGroupName("");
    setSelectedGroupUsers([]);
  };

  const handleRenameGroup = async () => {
    if (!renameValue.trim() || !selectedConversation) return;
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/groups/${selectedConversation.id}/rename`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name: renameValue })
      });
      if (!response.ok) throw new Error("Erro ao renomear grupo");
      const updated = await response.json();
      setConversations(prev => prev.map(c => c.id === updated.id ? updated : c));
      setSelectedConversation(updated);
      setIsRenameModalOpen(false);
      setRenameValue("");
    } catch (err) {
      alert("Erro: " + err.message);
    }
  };

  const handleAddParticipant = async () => {
    if (!addParticipantUserId || !selectedConversation) return;
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/groups/${selectedConversation.id}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ userId: addParticipantUserId })
      });
      if (!response.ok) throw new Error("Erro ao adicionar participante");
      alert("Participante adicionado com sucesso!");
      setIsAddParticipantModalOpen(false);
      setAddParticipantUserId("");
    } catch (err) {
      alert("Erro: " + err.message);
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedConversation) return;
    if (!window.confirm(`Deseja excluir o grupo "${selectedConversation.name}"? Esta ação não pode ser desfeita.`)) return;
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/groups/${selectedConversation.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Erro ao excluir grupo");
      setConversations(prev => prev.filter(c => c.id !== selectedConversation.id));
      setSelectedConversation(null);
      setMessages([]);
    } catch (err) {
      alert("Erro: " + err.message);
    }
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }
  };

  useEffect(() => {
    connectSocket(() => {
      subscribeToStatus((status) => {
          setConversations((prev) =>
              prev.map((conversation) =>
                  conversation.otherUserId === status.userId
                      ? { ...conversation, status: status.status }
                      : conversation
              )
          );
      });
    });
  }, []);

  useEffect(() => {
    async function loadInitialData() {
        try {
            const dataPage = await getMessagesPage();
            setPageData(dataPage);
            
            const dataUsers = await getUsers();
            setUsers(dataUsers);
            
            const dataConv = await getConversations();
            setConversations(dataConv);
            
            const previews = {};
            for (let conv of dataConv) {
                try {
                    const msgs = await getMessages(conv.id);
                    if (msgs && msgs.length > 0) {
                        const lastMsg = msgs[msgs.length - 1];
                        const parsed = parseMessageContent(lastMsg);
                        previews[conv.id] = {
                            text: parsed.isDeleted ? "Mensagem apagada" : parsed.text,
                            unreadCount: 0
                        };
                    }
                } catch (e) {}
            }
            setChatPreviews(previews);
        } catch (err) {}
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    conversations.forEach(conv => {
        if (!activeSubscriptions.current.has(conv.id)) {
            activeSubscriptions.current.add(conv.id);
            subscribeToConversation(conv.id, (incomingMessage) => {
                const parsed = parseMessageContent(incomingMessage);
                const isMine = incomingMessage.senderName === pageDataRef.current?.name;
                const isSelected = selectedConvRef.current?.id === conv.id;

                setChatPreviews(prev => {
                    const currentCount = prev[conv.id]?.unreadCount || 0;
                    const newCount = (!isMine && !isSelected) ? currentCount + 1 : 0;
                    return {
                        ...prev,
                        [conv.id]: {
                            text: parsed.isDeleted ? "Mensagem apagada" : parsed.text,
                            unreadCount: newCount
                        }
                    };
                });

                if (!isMine && !parsed.isDeleted && !parsed.isEdited && !isSelected) {
                    if (document.hidden) {
                        if ("Notification" in window && Notification.permission === "granted") {
                            new Notification(`Nova mensagem de ${incomingMessage.senderName}`, {
                                body: parsed.text,
                                icon: "/vite.svg" 
                            });
                        }
                    } else {
                        setToast(`Mensagem de: ${incomingMessage.senderName}`);
                        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
                        toastTimerRef.current = setTimeout(() => setToast(null), 4000);
                    }
                }

                if (isSelected) {
                    setMessages((prev) => {
                        const exists = prev.find(m => m.id === incomingMessage.id);
                        if (exists) return prev.map(m => m.id === incomingMessage.id ? incomingMessage : m);
                        return [...prev, incomingMessage];
                    });
                }
            });
        }
    });
  }, [conversations]);

  useEffect(() => {
    if (selectedConversation) {
        setChatPreviews(prev => {
            if (prev[selectedConversation.id]) {
                return {
                    ...prev,
                    [selectedConversation.id]: {
                        ...prev[selectedConversation.id],
                        unreadCount: 0
                    }
                };
            }
            return prev;
        });

        async function loadConversationMessages() {
            try {
                const data = await getMessages(selectedConversation.id);
                setMessages(data);
            } catch (err) {}
        }
        loadConversationMessages();
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const contats = contatsRef.current;
    const divider = dividerRef.current;
    const overlay = overlayRef.current;
    const main = mainRef.current;

    const MIN_PX = 300;
    const MIN_CHAT_PX = 500;

    let dragging = false;
    let startX = 0;
    let startW = 0;

    function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

    function applyWidth(px) {
      if (!main || !divider || !contats) return;
      const maxW = main.clientWidth - divider.offsetWidth - MIN_CHAT_PX;
      const w = clamp(px, MIN_PX, maxW);
      contats.style.width = w + "px";
      contats.style.flexShrink = "0";
    }

    const mouseDown = (e) => {
      dragging = true; startX = e.clientX; startW = contats.getBoundingClientRect().width;
      if (divider) divider.classList.add("dragging");
      if (overlay) overlay.classList.add("active");
      e.preventDefault();
    };
    const mouseMove = (e) => { if (!dragging) return; applyWidth(startW + (e.clientX - startX)); };
    const mouseUp = () => {
      if (!dragging) return; dragging = false;
      if (divider) divider.classList.remove("dragging");
      if (overlay) overlay.classList.remove("active");
    };
    const touchStart = (e) => {
      dragging = true; startX = e.touches[0].clientX; startW = contats.getBoundingClientRect().width;
      if (divider) divider.classList.add("dragging"); e.preventDefault();
    };
    const touchMove = (e) => { if (!dragging) return; applyWidth(startW + (e.touches[0].clientX - startX)); };
    const touchEnd = () => { dragging = false; if (divider) divider.classList.remove("dragging"); };

    if (divider) {
        divider.addEventListener("mousedown", mouseDown);
        divider.addEventListener("touchstart", touchStart, { passive: false });
    }
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("touchmove", touchMove, { passive: false });
    document.addEventListener("touchend", touchEnd);

    return () => {
      if (divider) { divider.removeEventListener("mousedown", mouseDown); divider.removeEventListener("touchstart", touchStart); }
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
      document.removeEventListener("touchmove", touchMove);
      document.removeEventListener("touchend", touchEnd);
    };
  }, []);

  async function handleSendMessage() {
    if (!messageInput.trim()) return;
    if (!selectedConversation) return;

    try {
      const payload = { text: messageInput };
      if (replyingTo) {
          const parsedReply = parseMessageContent(replyingTo);
          payload.replyTo = { sender: replyingTo.senderName, text: parsedReply.text };
      }

      const novaMensagem = await sendMessage(selectedConversation.id, JSON.stringify(payload));
      setMessageInput("");
      setReplyingTo(null); 

      if (novaMensagem && novaMensagem.id) {
          setMessages((prev) => {
              if (prev.find(m => m.id === novaMensagem.id)) return prev;
              return [...prev, novaMensagem];
          });
      } else {
          const listaAtualizada = await getMessages(selectedConversation.id);
          setMessages(listaAtualizada);
      }

      setTimeout(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100);
    } catch (err) {
        console.error("Erro ao enviar:", err);
    }
  }

  const startEditing = (msg) => {
    setEditingMessageId(msg.id);
    setEditContent(parseMessageContent(msg).text); 
  };

  const handleSaveEdit = async (messageId) => {
    if (!editContent.trim()) return;
    try {
      const token = getAuthToken(); 
      const msg = messages.find(m => m.id === messageId);
      const parsedOld = parseMessageContent(msg);
      const payload = { text: editContent, isEdited: true, replyTo: parsedOld.replyTo };

      await fetch(`${API_BASE_URL}/messages/${messageId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ content: JSON.stringify(payload) }) 
      });
      setEditingMessageId(null);
    } catch (error) {}
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const token = getAuthToken(); 
      await fetch(`${API_BASE_URL}/messages/${messageId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {}
  };

  // Determina lista de conversas exibida conforme a aba ativa
  const visibleConversations = activeTab === "grupos" ? groupConversations : privateConversations;

  const isGroupSelected = selectedConversation?.type === "GROUP";

  return (
    <>
      <div className="nav">
        <div className="options">
          <a className={activeTab === "conversas" ? "nav-opt opt-selected" : "nav-opt"} onClick={() => setActiveTab("conversas")}>Mensagens</a>
          <a className={activeTab === "grupos" ? "nav-opt opt-selected" : "nav-opt"} onClick={() => setActiveTab("grupos")}>Grupos</a>
        </div>
        <div className="options">
          <a className="nav-account" onClick={(e) => { e.preventDefault(); setShowProfile(true); }}>
            {pageData ? pageData.name : "..."}
          </a>
        </div>
      </div>

      {/* Modal Criar Grupo */}
{isGroupModalOpen && (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center" }}>
    <div style={{ background: "#202124", padding: "20px", borderRadius: "10px", width: "350px", color: "white" }}>
      <h2>Criar Grupo</h2>
      <input type="text" placeholder="Nome do grupo" value={groupName} onChange={(e) => setGroupName(e.target.value)}
        style={{ width: "100%", padding: "10px", margin: "10px 0", background: "#374151", border: "none", color: "white", borderRadius: "5px", boxSizing: "border-box" }} />
      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        {users.map(u => (
          <div key={u.id} onClick={() => toggleUserSelection(u.id)}
            style={{ padding: "8px", background: selectedGroupUsers.includes(u.id) ? "#a855f7" : "#374151", margin: "2px 0", cursor: "pointer", borderRadius: "5px" }}>{u.name}</div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        <button onClick={() => { setIsGroupModalOpen(false); setGroupName(""); setSelectedGroupUsers([]); }}
          style={{ flex: 1, padding: "10px", background: "#6b7280", border: "none", color: "white", cursor: "pointer", borderRadius: "6px", fontWeight: "500", transition: "0.2s" }}
          onMouseOver={(e) => e.target.style.background = "#4b5563"}
          onMouseOut={(e) => e.target.style.background = "#6b7280"}>
          Cancelar
        </button>
        <button onClick={handleCreateGroup}
          style={{ flex: 1, padding: "10px", background: "#a855f7", border: "none", color: "white", cursor: "pointer", borderRadius: "6px", fontWeight: "500", transition: "0.2s" }}
          onMouseOver={(e) => e.target.style.background = "#9333ea"}
          onMouseOut={(e) => e.target.style.background = "#a855f7"}>
          Criar
        </button>
      </div>
    </div>
  </div>
)}

      {/* Modal Renomear Grupo */}
{isRenameModalOpen && (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center" }}>
    <div style={{ background: "#202124", padding: "20px", borderRadius: "10px", width: "350px", color: "white" }}>
      <h2>Renomear Grupo</h2>
      <input type="text" placeholder="Novo nome do grupo" value={renameValue} onChange={(e) => setRenameValue(e.target.value)}
        style={{ width: "100%", padding: "10px", margin: "10px 0", background: "#374151", border: "none", color: "white", borderRadius: "5px", boxSizing: "border-box" }} />
      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        <button onClick={() => { setIsRenameModalOpen(false); setRenameValue(""); }}
          style={{ flex: 1, padding: "10px", background: "#6b7280", border: "none", color: "white", cursor: "pointer", borderRadius: "6px", fontWeight: "500", transition: "0.2s" }}
          onMouseOver={(e) => e.target.style.background = "#4b5563"}
          onMouseOut={(e) => e.target.style.background = "#6b7280"}>
          Cancelar
        </button>
        <button onClick={handleRenameGroup}
          style={{ flex: 1, padding: "10px", background: "#a855f7", border: "none", color: "white", cursor: "pointer", borderRadius: "6px", fontWeight: "500", transition: "0.2s" }}
          onMouseOver={(e) => e.target.style.background = "#9333ea"}
          onMouseOut={(e) => e.target.style.background = "#a855f7"}>
          Salvar
        </button>
      </div>
    </div>
  </div>
)}

      {/* Modal Adicionar Participante */}
{isAddParticipantModalOpen && (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center" }}>
    <div style={{ background: "#202124", padding: "20px", borderRadius: "10px", width: "350px", color: "white" }}>
      <h2>Adicionar Participante</h2>
      <div style={{ maxHeight: "250px", overflowY: "auto", margin: "10px 0" }}>
        {users.map(u => (
          <div key={u.id} onClick={() => setAddParticipantUserId(u.id)}
            style={{ padding: "8px", background: addParticipantUserId === u.id ? "#a855f7" : "#374151", margin: "2px 0", cursor: "pointer", borderRadius: "5px" }}>{u.name}</div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        {/* Botão Cancelar */}
        <button 
          onClick={() => { setIsAddParticipantModalOpen(false); setAddParticipantUserId(""); }}
          style={{ flex: 1, padding: "10px", backgroundColor: "#6b7280", border: "none", color: "white", cursor: "pointer", borderRadius: "6px", fontWeight: "500" }}
        >
          Cancelar
        </button>
        
        {/* Botão Adicionar */}
        <button 
          onClick={handleAddParticipant} 
          disabled={!addParticipantUserId}
          style={{ 
            flex: 1, padding: "10px", 
            backgroundColor: addParticipantUserId ? "#10b981" : "#4b5563", 
            border: "none", color: "white", 
            cursor: addParticipantUserId ? "pointer" : "not-allowed", 
            borderRadius: "6px", fontWeight: "500", transition: "0.2s" 
          }}
          onMouseOver={(e) => addParticipantUserId && (e.target.style.backgroundColor = "#059669")}
          onMouseOut={(e) => addParticipantUserId && (e.target.style.backgroundColor = "#10b981")}
        >
          👤 Adicionar
        </button>
      </div>
    </div>
  </div>
)}

      <div className="main" ref={mainRef}>
        <div className="contats" ref={contatsRef}>
          <div className="contats-opt">
            <div className="message-or-contats">
              <button className={activeTab === "conversas" ? "contats-btn btn-on": "contats-btn"} onClick={() => setActiveTab("conversas")}>
                Conversas
              </button>
              <button className={activeTab === "contatos" ? "contats-btn btn-on": "contats-btn"} onClick={() => setActiveTab("contatos")}>
                Contatos
              </button>
            </div>
            <div>
              {activeTab === "grupos" ? (
                <button className="add-friend" onClick={() => setIsGroupModalOpen(true)}>Criar grupo +</button>
              ) : (
                <button className="add-friend" onClick={() => setActiveTab("contatos")}>Nova conversa +</button>
              )}
            </div>
          </div>
          <div className="messages-box">
             <div className="conversation-area">
                {/* Aba Mensagens: apenas conversas PRIVATE */}
                {activeTab === "conversas" && visibleConversations.map((conv) => (
                    <div key={conv.id}
                         className={selectedConversation?.id === conv.id ? "conversation-box active-conversation" : "conversation-box"}
                         onClick={() => { setSelectedConversation(conv); requestNotificationPermission(); }}>
                        <div className="photo-perfil">
                            <div className={conv.status === "ONLINE" ? "status online" : "status offline"}/>
                        </div>
                        <div className="info-box" style={{ position: 'relative', width: '100%', paddingRight: '35px' }}>
                            <h2 className="conversation-name">{conv.name}</h2>
                            <p className="conversation-desc" style={{
                                color: chatPreviews[conv.id]?.unreadCount > 0 ? '#a855f7' : '#9ca3af',
                                fontWeight: chatPreviews[conv.id]?.unreadCount > 0 ? 'bold' : 'normal',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px'
                            }}>
                                {chatPreviews[conv.id]?.text || "Sem mensagens"}
                            </p>
                            {chatPreviews[conv.id]?.unreadCount > 0 && (
                                <div style={{
                                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                                    minWidth: '20px', height: '20px', borderRadius: '10px', background: '#a855f7',
                                    color: 'white', fontSize: '12px', fontWeight: 'bold', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', padding: '0 6px'
                                }}>
                                    {chatPreviews[conv.id].unreadCount}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Aba Grupos: apenas conversas GROUP */}
                {activeTab === "grupos" && visibleConversations.map((conv) => (
                    <div key={conv.id}
                         className={selectedConversation?.id === conv.id ? "conversation-box active-conversation" : "conversation-box"}
                         onClick={() => { setSelectedConversation(conv); requestNotificationPermission(); }}>
                        <div className="photo-perfil">
                            <div className="status offline"/>
                        </div>
                        <div className="info-box" style={{ position: 'relative', width: '100%', paddingRight: '35px' }}>
                            <h2 className="conversation-name">{conv.name}</h2>
                            <p className="conversation-desc" style={{
                                color: chatPreviews[conv.id]?.unreadCount > 0 ? '#a855f7' : '#9ca3af',
                                fontWeight: chatPreviews[conv.id]?.unreadCount > 0 ? 'bold' : 'normal',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px'
                            }}>
                                {chatPreviews[conv.id]?.text || "Sem mensagens"}
                            </p>
                            {chatPreviews[conv.id]?.unreadCount > 0 && (
                                <div style={{
                                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                                    minWidth: '20px', height: '20px', borderRadius: '10px', background: '#a855f7',
                                    color: 'white', fontSize: '12px', fontWeight: 'bold', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', padding: '0 6px'
                                }}>
                                    {chatPreviews[conv.id].unreadCount}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {activeTab === "grupos" && visibleConversations.length === 0 && (
                    <div style={{ padding: "20px", color: "#9ca3af", textAlign: "center" }}>
                        <p>Nenhum grupo ainda.</p>
                        <p style={{ fontSize: "13px" }}>Clique em "Criar grupo +" para começar.</p>
                    </div>
                )}
                
                {activeTab === "contatos" && users.map((user) => (
                    <div key={user.id} className="conversation-box" onClick={() => handleCreateConversation(user.id)}>
                        <div className="photo-perfil">
                            <div className={"status offline"}/>
                        </div>
                        <div className="info-box">
                            <h2 className="conversation-name">{user.name}</h2>
                        </div>
                        <p className="add-icon">+</p>
                    </div>
                ))}
             </div>
          </div>
        </div>

        <div className="divider" ref={dividerRef}>
          <div className="divider-handle">
            <span></span><span></span><span></span>
          </div>
        </div>

        <div className="chat" ref={chatRef}>
          {!selectedConversation && (
            <div className="not-selected-message">
              <div className="item-not-selected-message">
                <img className="icon-not-selected-message" src="src/assets/imgs/not-messages-icon-frog.svg" alt="popo"/>
                <h1 className="title-not-selected-message">Comece uma conversa!</h1>
                <div>
                  <input type="button" value="Adicionar Amigo" className="btn-not-selected-message" onClick={() => setActiveTab("contatos")}/>
                  <input type="button" value="Criar grupo" className="btn-not-selected-message" onClick={() => { setActiveTab("grupos"); setIsGroupModalOpen(true); }}/>
                </div>
              </div>
            </div>
          )}
          
          {selectedConversation && (
            <>
              <div className="username-chat">
                <div className="user-area">
                  <div className="user-photo"></div>
                  <p>{selectedConversation.name}</p>
                </div>
                {/* Botões de gerenciamento do grupo */}
                {isGroupSelected && (
                  <div style={{ display: "flex", gap: "8px", marginLeft: "auto", paddingRight: "16px" }}>
                    <button
                      onClick={() => { setRenameValue(selectedConversation.name); setIsRenameModalOpen(true); }}
                      title="Renomear grupo"
                      style={{ padding: "6px 12px", background: "#374151", border: "none", color: "#e5e7eb", borderRadius: "6px", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                      ✏️ Renomear
                    </button>
                    <button
                      onClick={() => setIsAddParticipantModalOpen(true)}
                      title="Adicionar participante"
                      style={{ padding: "6px 12px", background: "#374151", border: "none", color: "#e5e7eb", borderRadius: "6px", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                      👤 Adicionar
                    </button>
                    <button
                      onClick={handleDeleteGroup}
                      title="Excluir grupo"
                      style={{ padding: "6px 12px", background: "#7f1d1d", border: "none", color: "#fca5a5", borderRadius: "6px", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                      🗑️ Excluir
                    </button>
                  </div>
                )}
              </div>
              
              <div className="messages-chat">
                {messages.map((message) => {
                  const { text, isEdited, replyTo, isDeleted } = parseMessageContent(message);

                  return (
                    <div key={message.id} className={message.senderName === pageData?.name ? "message-box mine" : "message-box"}>
                      <div className="message-img">
                        <div className="user-photo-messages"></div>
                      </div>

                      <div className="message-body">
                        <div className="message-header">
                          <h1 className="message-author">{message.senderName}</h1>
                          <h2 className="message-date">
                            {new Date(message.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </h2>
                        </div>
                        
                        {editingMessageId === message.id ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "5px" }}>
                            <input type="text" value={editContent} onChange={(e) => setEditContent(e.target.value)}
                              style={{ color: "black", padding: "8px", borderRadius: "5px", border: "1px solid #ccc", width: "100%" }} />
                            <div style={{ display: "flex", gap: "10px" }}>
                              <button onClick={() => handleSaveEdit(message.id)} style={{ background: "#22c55e", color: "white", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", border: "none" }}>Salvar</button>
                              <button onClick={() => setEditingMessageId(null)} style={{ background: "#6b7280", color: "white", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", border: "none" }}>Cancelar</button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {replyTo && !isDeleted && (
                                <div style={{
                                    background: message.senderName === pageData?.name ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.1)",
                                    padding: "8px", borderRadius: "6px", borderLeft: "4px solid #a855f7", marginBottom: "8px"
                                }}>
                                    <div style={{ color: "#a855f7", fontSize: "11px", fontWeight: "bold", marginBottom: "2px" }}>{replyTo.sender}</div>
                                    <div style={{ fontSize: "12px", opacity: 0.8 }}>{replyTo.text}</div>
                                </div>
                            )}

                            <p className="message-text">
                              {text}
                              {isEdited && !isDeleted && (
                                <span style={{ fontSize: '10px', marginLeft: '6px', color: '#9ca3af', fontStyle: 'italic' }}>(editado)</span>
                              )}
                            </p>
                            
                            {!isDeleted && (
                              <div style={{ display: "flex", gap: "12px", fontSize: "11px", marginTop: "8px", opacity: 0.7 }}>
                                <span style={{ cursor: "pointer", color: "#3b82f6", fontWeight: "bold" }} onClick={() => setReplyingTo(message)}>
                                  Responder ↩
                                </span>
                                {message.senderName === pageData?.name && (
                                  <>
                                    <span style={{ cursor: "pointer", color: "#a855f7", fontWeight: "bold" }} onClick={() => startEditing(message)}>Editar ✎</span>
                                    <span style={{ cursor: "pointer", color: "#ef4444", fontWeight: "bold" }} onClick={() => handleDeleteMessage(message.id)}>Apagar 🗑</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef}></div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'relative' }}>
                {replyingTo && (
                    <div style={{ 
                        background: '#374151', padding: '10px 15px', display: 'flex', justifyContent: 'space-between', 
                        alignItems: 'center', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', 
                        borderBottom: '1px solid #1f2937' 
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: '#a855f7', fontSize: '12px', fontWeight: 'bold' }}>Respondendo a {replyingTo.senderName}</span>
                            <span style={{ color: '#ccc', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                                {parseMessageContent(replyingTo).text}
                            </span>
                        </div>
                        <button onClick={() => setReplyingTo(null)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>✖</button>
                    </div>
                )}
                
                <div className="input-chat" style={{ borderTopLeftRadius: replyingTo ? '0' : undefined, borderTopRightRadius: replyingTo ? '0' : undefined }}>
                  <input type="text" id="input-message" placeholder="digite uma mensagem"
                    value={messageInput} onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
                  <button id="btn-message" onClick={handleSendMessage}>
                      <img src="src/assets/icon/send.svg" alt="send" id="icon-btn-message"/>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div id="drag-overlay" ref={overlayRef}></div>
      {showProfile && (
          <div style={{ position: "fixed", inset: 0, zIndex: 999 }}>
            <ProfileSettings onLogout={() => setShowProfile(false)} />
          </div>
      )}
      {toast && (
          <div style={{
              position: 'fixed', bottom: '30px', right: '30px',
              background: '#a855f7', color: 'white', padding: '15px 25px',
              borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              zIndex: 1000, fontWeight: 'bold', fontSize: '14px'
          }}>
              {toast}
          </div>
      )}
    </>
  );
}
