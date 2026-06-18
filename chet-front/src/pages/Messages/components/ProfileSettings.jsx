import { useState, useRef } from "react";
import "./profile-edit.css";

const NAV_ITEMS = [
  { id: "profile", label: "Meu Perfil" },
  { id: "account", label: "Conta" },
  { id: "privacy", label: "Privacidade" },
];


export default function ProfileSettings({ onLogout }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [displayName, setDisplayName] = useState("Camarada-san");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("camaradasan");
  const [email, setEmail] = useState("camarada@example.com");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("Alterações salvas!");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [hoveredNav, setHoveredNav] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const fileRef = useRef();

  const toast = (msg = "Alterações salvas!") => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2800);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const inputClass = (id) =>
    `profile-input${focusedInput === id ? " focused" : ""}`;

  const textareaClass = (id) =>
    `profile-textarea${focusedInput === id ? " focused" : ""}`;

  return (
    <div className="profile-root" >
      <div className="profile-wrapper">
        <button className="profile-btn-logout" onClick={onLogout}> X </button>
        {/* Sidebar nav */}
        <nav className="profile-nav">
          <div className="profile-nav-section">
            <div className="profile-nav-label">Conta do usuário</div>
            {NAV_ITEMS.map((item) => (
              <div
                key={item.id}
                className={[
                  "profile-nav-item",
                  activeTab === item.id ? "active" : "",
                  hoveredNav === item.id && activeTab !== item.id ? "hovered" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setActiveTab(item.id)}
                onMouseEnter={() => setHoveredNav(item.id)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                {item.label}
              </div>
            ))}
          </div>

          <div className="profile-nav-divider" />

          <div
            className={`profile-nav-danger${hoveredNav === "delete" ? " hovered" : ""}`}
            onClick={() => setShowDeleteModal(true)}
            onMouseEnter={() => setHoveredNav("delete")}
            onMouseLeave={() => setHoveredNav(null)}
          >
            Excluir conta
          </div>
        </nav>

        {/* Main content */}
        <main className="profile-content">

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <>
              <div className="profile-section">
                <div className="profile-section-title">Perfil</div>
                <div className="profile-section-sub">Personalize como você aparece para os outros.</div>

                {/* Preview card */}
                <div className="profile-card">
                  <div className="profile-avatar-area">
                    <div className="profile-avatar-wrapper">
                      <div className="profile-avatar">
                        {avatar ? (
                          <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <span className="profile-avatar-initial">
                            {displayName[0]?.toUpperCase() || "?"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="profile-info">
                      <div className="profile-name">{displayName || "Sem nome"}</div>
                      <div className="profile-tag">{username}</div>
                    </div>
                  </div>
                </div>

                {/* Display name */}
                <div className="profile-field-group">
                  <label className="profile-label">Nome exibido</label>
                  <input
                    className={inputClass("displayName")}
                    value={displayName}
                    maxLength={32}
                    onChange={(e) => setDisplayName(e.target.value)}
                    onFocus={() => setFocusedInput("displayName")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Seu nome exibido"
                  />
                  <div className="profile-char-count">{displayName.length}/32</div>
                </div>

                {/* Avatar */}
                <div className="profile-field-group">
                  <label className="profile-label">Foto de perfil</label>
                  <div>
                    <button className="profile-btn-avatar" onClick={() => fileRef.current.click()}>
                      Mudar avatar
                    </button>
                    {avatar && (
                      <button className="profile-btn-remove" onClick={() => setAvatar(null)}>
                        Remover
                      </button>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <div className="profile-hint">Recomendado: 512×512px, PNG ou JPG.</div>
                </div>

                {/* Bio */}
                <div className="profile-field-group">
                  <label className="profile-label">Sobre mim</label>
                  <textarea
                    className={textareaClass("bio")}
                    value={bio}
                    maxLength={190}
                    onChange={(e) => setBio(e.target.value)}
                    onFocus={() => setFocusedInput("bio")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Conte um pouco sobre você…"
                    rows={4}
                  />
                  <div className="profile-char-count">{bio.length}/190</div>
                </div>

                <div className="profile-btn-row">
                  <button
                    className="profile-btn-primary"
                    onClick={() => toast("Perfil atualizado!")}
                  >
                    Salvar alterações
                  </button>
                  <button
                    className="profile-btn-secondary"
                    onClick={() => {
                      setDisplayName("Camarada-san");
                      setBio("");
                      setAvatar(null);
                    }}
                  >
                    Redefinir
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ACCOUNT TAB */}
          {activeTab === "account" && (
            <>
              <div className="profile-section">
                <div className="profile-section-title">Conta</div>
                <div className="profile-section-sub">Gerencie seu username, e-mail e senha.</div>

                <div className="profile-row">
                  <div className="profile-row-item">
                    <div className="profile-field-group">
                      <label className="profile-label">
                        Username <span className="profile-label-required">*</span>
                      </label>
                      <input
                        className={inputClass("username")}
                        value={username}
                        onChange={(e) =>
                          setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))
                        }
                        onFocus={() => setFocusedInput("username")}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="seunome"
                      />
                      <div className="profile-hint">Letras minúsculas, números e sublinhados.</div>
                    </div>
                  </div>
                  <div className="profile-row-item">
                    <div className="profile-field-group">
                      <label className="profile-label">
                        E-mail <span className="profile-label-required">*</span>
                      </label>
                      <input
                        className={inputClass("email")}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="voce@exemplo.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="profile-btn-row">
                  <button
                    className="profile-btn-primary"
                    onClick={() => toast("Dados da conta atualizados!")}
                  >
                    Salvar alterações
                  </button>
                </div>
              </div>

              <div className="profile-section-last">
                <div className="profile-section-title profile-section-title--sm">Alterar senha</div>
                <div className="profile-section-sub">Escolha uma senha forte e única.</div>

                <div className="profile-field-group">
                  <label className="profile-label">Senha atual</label>
                  <input
                    className={inputClass("password")}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="profile-field-group">
                  <label className="profile-label">Nova senha</label>
                  <input
                    className={inputClass("newPassword")}
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onFocus={() => setFocusedInput("newPassword")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Mínimo 8 caracteres"
                  />
                  {newPassword && newPassword.length < 8 && (
                    <div className="profile-hint profile-hint--danger">Use ao menos 8 caracteres.</div>
                  )}
                  {newPassword && newPassword.length >= 8 && (
                    <div className="profile-hint profile-hint--success">✓ Senha forte o suficiente.</div>
                  )}
                </div>

                <div className="profile-btn-row">
                  <button
                    className="profile-btn-primary"
                    onClick={() => {
                      if (!password) return toast("Informe sua senha atual.");
                      if (newPassword.length < 8) return toast("Nova senha muito curta.");
                      toast("Senha alterada com sucesso!");
                      setPassword("");
                      setNewPassword("");
                    }}
                  >
                    Alterar senha
                  </button>
                </div>
              </div>
            </>
          )}

          {/* PRIVACY TAB */}
          {activeTab === "privacy" && (
            <div className="profile-section">
              <div className="profile-section-title">Privacidade &amp; Segurança</div>
              <div className="profile-section-sub">Controle quem pode ver seu perfil e interagir com você.</div>
              <div className="profile-privacy-placeholder">
                Em breve — configurações de privacidade avançadas.
              </div>
            </div>
          )}

          {/* Danger zone — visível na aba conta */}
          {activeTab === "account" && (
            <div className="profile-danger-zone-wrapper">
              <div className="profile-danger-zone">
                <div className="profile-danger-text">
                  <div className="profile-danger-title">Excluir conta</div>
                  <div className="profile-danger-desc">
                    Isso é permanente. Todos os seus dados, servidores e mensagens serão removidos para sempre.
                  </div>
                </div>
                <button
                  className="profile-btn-danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Excluir conta
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div
          className="profile-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowDeleteModal(false)}
        >
          <div className="profile-modal">
            <div className="profile-modal-title">⚠️ Excluir conta</div>
            <div className="profile-modal-desc">
              Esta ação é <strong className="danger">irreversível</strong>. Todos os seus dados serão
              permanentemente removidos. Digite seu username{" "}
              <strong className="highlight">{username}</strong> para confirmar.
            </div>
            <div className="profile-field-group">
              <label className="profile-label">Confirme seu username</label>
              <input
                className={[
                  inputClass("deleteConfirm"),
                  deleteConfirm && deleteConfirm !== username ? "error" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                onFocus={() => setFocusedInput("deleteConfirm")}
                onBlur={() => setFocusedInput(null)}
                placeholder={username}
              />
            </div>
            <div className="profile-modal-actions">
              <button
                className="profile-btn-secondary"
                style={{ color: "var(--color-text-primary)" }}
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                }}
              >
                Cancelar
              </button>
              <button
                className="profile-btn-danger"
                disabled={deleteConfirm !== username}
                onClick={() => {
                  if (deleteConfirm === username) {
                    setShowDeleteModal(false);
                    setDeleteConfirm("");
                    toast("Conta excluída (simulação).");
                  }
                }}
              >
                Excluir permanentemente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`profile-toast${showToast ? " visible" : ""}`}>{toastMsg}</div>
    </div>
  );
}