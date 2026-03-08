import { useEffect, useRef } from "react";
import './style.css'

export default function ChatLayout() {
  const contatsRef = useRef(null);
  const chatRef = useRef(null);
  const dividerRef = useRef(null);
  const overlayRef = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    const contats = contatsRef.current;
    const chat = chatRef.current;
    const divider = dividerRef.current;
    const overlay = overlayRef.current;
    const main = mainRef.current;

    const MIN_PX = 300;
    const MIN_CHAT_PX = 1000;

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
            @username
          </a>
        </div>
      </div>

      <div className="main" ref={mainRef}>
        <div className="contats" ref={contatsRef}>
          <div className="contats-opt">
            <div className="message-or-contats">
              <button className="contats-btn contats-btn-active">
                Conversas
              </button>
              <button className="contats-btn">Contatos</button>
            </div>
            <div>
              <button className="add-friend">Adicionar amigos+</button>
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
          {/* chat aqui */}
        </div>
      </div>

      <div id="drag-overlay" ref={overlayRef}></div>
    </>
  );
}