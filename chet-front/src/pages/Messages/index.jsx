import { useEffect, useRef, useState } from "react";
import './style.css'
import { getMessagesPage, getUsers, createConversation, getConversations, getMessages, sendMessage} from "../../services/api";
import { connectSocket,  subscribeToConversation, subscribeToStatus} from "../../services/socket";
import ProfileSettings from "./components/ProfileSettings";

export default function ChatLayout() {
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

  async function handleCreateConversation(userId) {
    try {
      const conversation =
        await createConversation(userId);

    } catch (err) {
      console.error(err);
    }
  }

useEffect(() => {

  connectSocket(() => {
    subscribeToStatus((status) => {
        console.log(status);
        setConversations((prev) =>
            prev.map((conversation) =>
                conversation.otherUserId === status.userId
                    ? {
                        ...conversation,
                        status: status.status
                    }
                    : conversation
            )
        );
    });
  });

}, []);
  
  useEffect(() => {
    if (!selectedConversation) return;

    subscribeToConversation(
      selectedConversation.id,

      (newMessage) => {
        setMessages((prev) => [
          ...prev,
          newMessage
        ]);
      }
    );

  }, [selectedConversation]);

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
        behavior: "smooth"
    });

  }, [messages]);

  useEffect(() => {

    async function loadPageData() {
      try {
        const data = await getMessagesPage();
        setPageData(data);
      } catch (error) {
        console.error(error);
      }
    } loadPageData();

    async function loadUsers() {

      try {
        const data = await getUsers();
        setUsers(data);

        } catch (err) {
          console.error(err);
        }
    } loadUsers();

    async function loadConversations() {
      try {
        const data = await getConversations();
        setConversations(data);

      } catch (err) {
        console.error(err);
      }
    } loadConversations();

    async function loadConversationMessages() {
      if (!selectedConversation) return;

      try {
        const data = await getMessages(
          selectedConversation.id
        );
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    } loadConversationMessages();

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

    /* ── Mouse ── */
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

    /* ── Touch ── */
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
  }, [selectedConversation]);

  async function handleSendMessage() {

    if (!messageInput.trim()) return;
    if (!selectedConversation) return;

    try {
      const newMessage =
        await sendMessage(

          selectedConversation.id,
          messageInput
        );
      setMessageInput("");

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div className="nav">
        <div className="options">
          <a className="nav-opt opt-selected" href="">
            Mensagens
          </a>
          <a className="nav-opt" href="">
            Configurações
          </a>
          <a className="nav-opt" href="">
            Suporte
          </a>
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
              <button className={activeTab === "contatos" ? "contats-btn btn-on": "contats-btn"}  onClick={() => setActiveTab("contatos")}>Contatos</button>
            </div>
            <div>
              <button className="add-friend">Criar conversa +</button>
            </div>
          </div>
          <div className="messages-box">
            <div className="conversation-area"  style={{display: activeTab === "conversas" ? "block" : "none"}}>
              {
                conversations.map((conversation) => {

                  return (
                    <div
                      className={
                        selectedConversation?.id === conversation.id
                          ? "conversation-box active-conversation"
                          : "conversation-box"
                      }

                      key={conversation.id}

                      onClick={() =>
                        setSelectedConversation(conversation)
                      }
                    >

                      <div className="photo-perfil">
                        <div
                          className={
                            conversation.status === "ONLINE"
                            ? "status online"
                            : "status offline"
                          }
                        />
                      </div>
                      <div className="info-box">
                        <h2 className="conversation-name">
                          {conversation.name}
                        </h2>

                        <p className="conversation-desc">
                          Sem Mensagem
                        </p>
                      </div>

                    </div>
                  );
                })
              }
            </div>
            <div className="contacts-area"  style={{display: activeTab === "contatos" ? "block" : "none"}}>
              {
                users.map((user) => (

                  <div
                    className="conversation-box"
                    key={user.id}
                    onClick={() => handleCreateConversation(user.id)}
                  >
                    <div className="photo-perfil">
                      <div
                        className={"status offline"}
                      />
                    </div>

                    <div className="info-box">
                      <h2 className="conversation-name">
                        {user.name}
                      </h2>
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
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="chat" ref={chatRef}>
          {!selectedConversation && (
            <div className="not-selected-message">
              <div className="item-not-selected-message">
                <img className="icon-not-selected-message" src="src/assets/imgs/not-messages-icon-frog.svg" alt="popo"/>
                <h1 className="title-not-selected-message">
                  Comece uma conversa!
                </h1>
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
              <p>
                {
                  selectedConversation
                    ? selectedConversation.name
                    : " "
                }
              </p>
            </div>
          </div>
          <div className="messages-chat">
            {
              messages.map((message) => (
                console.log(message),
                <div
                  key={message.id}

                  className={
                    message.senderName === pageData?.name
                      ? "message-box mine"
                      : "message-box"
                  }
                >
                  <div className="message-img">
                    <div className="user-photo-messages"></div>
                  </div>

                  <div className="message-body">
                    <div className="message-header">
                      <h1 className="message-author">{message.senderName}</h1>
                      <h2 className="message-date">
                        {
                          new Date(
                            message.createdAt
                          ).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit"
                            }
                          )
                        }
                      </h2>
                    </div>
                    <p className="message-text">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))
            }
            <div ref={messagesEndRef}></div>
          </div>
          <div className="input-chat">
            <input
              type="text"
              id="input-message"
              placeholder="digite uma mensagem"
              value={messageInput}
              onChange={(e) =>
                setMessageInput(e.target.value)
              }
            />
            <button id="btn-message" onClick={handleSendMessage}>
                <img src="src/assets/icon/send.svg" alt="send" id="icon-btn-message"/>
            </button>
          </div>
        </div>
      </div>
      <div id="drag-overlay" ref={overlayRef}></div>
      {/* perfil como overlay no final */}
        {showProfile && (
          <div style={{ position: "fixed", inset: 0, zIndex: 999 }}>
            <ProfileSettings onLogout={() => setShowProfile(false)} />
          </div>
      )}
    </>
  );
}