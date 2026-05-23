import { useEffect, useRef, useState } from "react";
import './style.css'
import { getMessagesPage, getUsers } from "../../services/api";

export default function ChatLayout() {
  const contatsRef = useRef(null);
  const chatRef = useRef(null);
  const dividerRef = useRef(null);
  const overlayRef = useRef(null);
  const mainRef = useRef(null);

  const [pageData, setPageData] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("conversas");

  useEffect(() => {

    async function loadMessages() {
      try {
        const data = await getMessagesPage();
        setPageData(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadMessages();

      async function loadUsers() {

      try {

        const data = await getUsers();

        setUsers(data);

      } catch (err) {

        console.error(err);
      }
    }

  loadUsers();

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
  }, []);
  
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
          <a className="nav-account" href="">
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
              <div className="conversation-box">
                  <div className="photo-perfil">
                    <div className="status"></div>
                  </div>
                  <div className="info-box">
                    <h2 className="conversation-name">Username</h2>
                    <p className="conversation-desc">Última mensagem</p>
                  </div>
              </div>
            </div>
            <div className="contacts-area"  style={{display: activeTab === "contatos" ? "block" : "none"}}>
              {
                users.map((user) => (

                  <div
                    className="conversation-box"
                    key={user.id}
                  >

                    <div className="photo-perfil">
                      <div className="status"></div>
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
          <div className="username-chat">
            <div className="user-area">
              <div className="user-photo">
              </div>
              <p>Mensagem</p>
            </div>
          </div>
          <div className="messages-chat"></div>
          <div className="input-chat">
            <input type="text" name="" id="input-message" placeholder="digite uma mensagem"/>
            <button id="btn-message">
                <img src="src/assets/icon/send.svg" alt="send" id="icon-btn-message"/>
            </button>
          </div>
        </div>
      </div>
      <div id="drag-overlay" ref={overlayRef}></div>
    </>
  );
}