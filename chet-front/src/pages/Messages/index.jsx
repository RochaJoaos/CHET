import { useEffect, useRef, useState } from "react";
import './style.css'
import { getMessagesPage, getUsers, createConversation, getConversations, getMessages, sendMessage} from "../../services/api";
import { connectSocket,  subscribeToConversation, subscribeToStatus} from "../../services/socket";
import ProfileSettings from "./components/ProfileSettings";

const parseMessageContent = (msg) => {
    if (!msg) return { text: "", isEdited: false, replyTo: null, isDeleted: false };
    
    if (msg.content === "🚫 Mensagem apagada") {
        return { text: "🚫 Mensagem apagada", isEdited: false, replyTo: null, isDeleted: true };
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

  const selectedConvRef = useRef(selectedConversation);
  const pageDataRef = useRef(pageData);
  const activeSubscriptions = useRef(new Set());

  useEffect(() => { selectedConvRef.current = selectedConversation; }, [selectedConversation]);
  useEffect(() => { pageDataRef.current = pageData; }, [pageData]);

  const getAuthToken = () => {
    let token = localStorage.getItem("token") || localStorage.getItem("jwt") || localStorage.getItem("access_token");
    if (token) return token.replace(/['"]+/g, '');
    
    for (let i = 0; i < localStorage.length; i++) {
        let val = localStorage.getItem(localStorage.key(i));
        if (val && val.includes('eyJ')) {
            if (val.startsWith('{')) {
                try { let p = JSON.parse(val); if (p.token) return p.token; } catch(e){}
            } else {
                return val.replace(/['"]+/g, '');
            }
        }
    }
    return "";
  };

  async function handleCreateConversation(userId) {
    try {
      await createConversation(userId);
    } catch (err) {}
  }

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
                            text: parsed.isDeleted ? "🚫 Mensagem apagada" : parsed.text,
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
                            text: parsed.isDeleted ? "🚫 Mensagem apagada" : parsed.text,
                            unreadCount: newCount
                        }
                    };
                });

                if (!isMine && !parsed.isDeleted && !parsed.isEdited && !isSelected) {
                    setToast(`Você recebeu uma mensagem de: ${incomingMessage.senderName}`);
                    setTimeout(() => setToast(null), 4000);
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
    const chat = chatRef.current;
    const divider = dividerRef.current;
    const overlay = overlayRef.current;
    const main = mainRef.current;

    const MIN_PX = 300;
    const MIN_CHAT_PX = 500;

    let dragging = false;
    let startX = 0;
    let startW = 0;

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function applyWidth(px) {
      const maxW = main.clientWidth - divider.offsetWidth - MIN_CHAT_PX;
      const w = clamp(px, MIN_PX, maxW);
      contats.style.width = w + "px";
      contats.style.flexShrink = "0";
    }

    const mouseDown = (e) => {
      dragging = true;
      startX = e.clientX;
      startW = contats.getBoundingClientRect().width;
      divider.classList.add("dragging");
      overlay.classList.add("active");
      e.preventDefault();
    };

    const mouseMove = (e) => {
      if (!dragging) return;
      applyWidth(startW + (e.clientX - startX));
    };

    const mouseUp = () => {
      if (!dragging) return;
      dragging = false;
      divider.classList.remove("dragging");
      overlay.classList.remove("active");
    };

    const touchStart = (e) => {
      dragging = true;
      startX = e.touches[0].clientX;
      startW = contats.getBoundingClientRect().width;
      divider.classList.add("dragging");
      e.preventDefault();
    };

    const touchMove = (e) => {
      if (!dragging) return;
      applyWidth(startW + (e.touches[0].clientX - startX));
    };

    const touchEnd = () => {
      dragging = false;
      divider.classList.remove("dragging");
    };

    divider.addEventListener("mousedown", mouseDown);
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);

    divider.addEventListener("touchstart", touchStart, { passive: false });
    document.addEventListener("touchmove", touchMove, { passive: false });
    document.addEventListener("touchend", touchEnd);

    return () => {
      divider.removeEventListener("mousedown", mouseDown);
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
      divider.removeEventListener("touchstart", touchStart);
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
          payload.replyTo = {
              sender: replyingTo.senderName,
              text: parsedReply.text
          };
      }

      await sendMessage(selectedConversation.id, JSON.stringify(payload));
      
      setMessageInput("");
      setReplyingTo(null); 
    } catch (err) {}
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

      const payload = {
          text: editContent,
          isEdited: true,
          replyTo: parsedOld.replyTo 
      };

      await fetch(`http://localhost:8080/messages/${messageId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ content: JSON.stringify(payload) }) 
      });

      setEditingMessageId(null);
    } catch (error) {}
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const token = getAuthToken(); 
      await fetch(`http://localhost:8080/messages/${messageId}`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${token}`
          }
      });
    } catch (error) {}
  };

  return (
    <>
      <div className="nav">
        <div className="options">
          <a className="nav-opt opt-selected" href="">Mensagens</a>
          <a className="nav-opt" href="">Configurações</a>
          <a className="nav-opt" href="">Suporte</a>
        </div>
        <div className="options">
          <a className="nav-account" onClick={(e) => { e.preventDefault(); setShowProfile(true); }}>
            {pageData ? pageData.name : "..."}
          </a>
        </div>
      </div>
      <div className="main" ref={mainRef}>
        <div className="contats" ref={contatsRef}>
          <div className="contats-opt">
            <div className="message-or-contats">
              <button className={activeTab === "conversas" ? "contats-btn btn-on": "contats-btn"} onClick={() => setActiveTab("conversas")}>
                Conversas
              </button>
              <button className={activeTab === "contatos" ? "contats-btn btn-on": "contats-btn"}  onClick={() => setActiveTab("contatos")}>
                Contatos
              </button>
            </div>
            <div>
              <button className="add-friend">Criar conversa +</button>
            </div>
          </div>
          <div className="messages-box">
            <div className="conversation-area"  style={{display: activeTab === "conversas" ? "block" : "none"}}>
              {
                conversations.map((conversation) => (
                  <div
                    className={selectedConversation?.id === conversation.id ? "conversation-box active-conversation" : "conversation-box"}
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="photo-perfil">
                      <div className={conversation.status === "ONLINE" ? "status online" : "status offline"}/>
                    </div>
                    <div className="info-box" style={{ position: 'relative', width: '100%', paddingRight: '35px' }}>
                      <h2 className="conversation-name">{conversation.name}</h2>
                      <p className="conversation-desc" style={{
                          color: chatPreviews[conversation.id]?.unreadCount > 0 ? '#a855f7' : '#9ca3af',
                          fontWeight: chatPreviews[conversation.id]?.unreadCount > 0 ? 'bold' : 'normal',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px'
                      }}>
                          {chatPreviews[conversation.id]?.text || "Sem Mensagem"}
                      </p>
                      {chatPreviews[conversation.id]?.unreadCount > 0 && (
                          <div style={{
                              position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                              minWidth: '20px', height: '20px', borderRadius: '10px', background: '#a855f7',
                              color: 'white', fontSize: '12px', fontWeight: 'bold', display: 'flex',
                              alignItems: 'center', justifyContent: 'center', padding: '0 6px'
                          }}>
                              {chatPreviews[conversation.id].unreadCount}
                          </div>
                      )}
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="contacts-area"  style={{display: activeTab === "contatos" ? "block" : "none"}}>
              {
                users.map((user) => (
                  <div className="conversation-box" key={user.id} onClick={() => handleCreateConversation(user.id)}>
                    <div className="photo-perfil">
                      <div className={"status offline"}/>
                    </div>
                    <div className="info-box">
                      <h2 className="conversation-name">{user.name}</h2>
                    </div>
                    <p className="add-icon">+</p>
                  </div>
                ))
              }
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
                  <input type="button" value="Adicionar Amigo" className="btn-not-selected-message"/>
                  <input type="button" value="Criar grupo" className="btn-not-selected-message"/>
                </div>
              </div>
            </div>
          )}
          
          <div className="username-chat">
            <div className="user-area">
              <div className="user-photo"></div>
              <p>{selectedConversation ? selectedConversation.name : " "}</p>
            </div>
          </div>
          
          <div className="messages-chat">
            {
              messages.map((message) => {
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
                          <input
                            type="text"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            style={{ color: "black", padding: "8px", borderRadius: "5px", border: "1px solid #ccc", width: "100%" }}
                          />
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={() => handleSaveEdit(message.id)} style={{ background: "#22c55e", color: "white", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", border: "none" }}>
                              Salvar
                            </button>
                            <button onClick={() => setEditingMessageId(null)} style={{ background: "#6b7280", color: "white", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", border: "none" }}>
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {replyTo && !isDeleted && (
                              <div style={{
                                  background: message.senderName === pageData?.name ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.1)",
                                  padding: "8px",
                                  borderRadius: "6px",
                                  borderLeft: "4px solid #a855f7",
                                  marginBottom: "8px"
                              }}>
                                  <div style={{ color: "#a855f7", fontSize: "11px", fontWeight: "bold", marginBottom: "2px" }}>
                                      {replyTo.sender}
                                  </div>
                                  <div style={{ fontSize: "12px", opacity: 0.8 }}>
                                      {replyTo.text}
                                  </div>
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
                                  <span style={{ cursor: "pointer", color: "#a855f7", fontWeight: "bold" }} onClick={() => startEditing(message)}>
                                    Editar ✎
                                  </span>
                                  <span style={{ cursor: "pointer", color: "#ef4444", fontWeight: "bold" }} onClick={() => handleDeleteMessage(message.id)}>
                                    Apagar 🗑
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            }
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
              <input
                type="text"
                id="input-message"
                placeholder="digite uma mensagem"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button id="btn-message" onClick={handleSendMessage}>
                  <img src="src/assets/icon/send.svg" alt="send" id="icon-btn-message"/>
              </button>
            </div>
          </div>
          
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