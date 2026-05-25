// Em desenvolvimento, o proxy do Vite redireciona /auth → http://localhost:8080/auth
// Em produção, defina VITE_API_URL no .env
const API_BASE_URL = "http://localhost:8080";

export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Email ou senha incorretos.");
    }
    throw new Error("Erro ao fazer login. Tente novamente.");
  }

  return response.json(); // { name, token }
}

export async function registerUser({ email, name, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, password }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Email já cadastrado.");
    }
    throw new Error("Erro ao criar conta. Tente novamente.");
  }

  return response.json(); // { name, token }
}

export async function getMessagesPage(params) {
  const token =  localStorage.getItem("token")

  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
  

  if(!response.ok){
    throw new Error("Erro ao carregar página de mensagens.")
  }

  return response.json()
}

export async function getUsers() {

  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:8080/users", {

    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar usuários");
  }

  return response.json();
}

export async function createConversation(userId) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/conversations/private/${userId}`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao criar conversa");
  }

  return response.json();
}

export async function getConversations() {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/conversations`,
    {
      method: "GET",

      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao carregar conversas");
  }

  return response.json();
}

export async function getMessages(
  conversationId
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/messages/${conversationId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao carregar mensagens"
    );
  }

  return response.json();
}

export async function sendMessage(
  conversationId,
  content
) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/messages/${conversationId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        content
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao enviar mensagem"
    );
  }

  return response.json();
}

export async function getUserStatus(userId) {

  const token =
      localStorage.getItem("token");

  const response = await fetch(
      `http://localhost:8080/status/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
  );

  return response.json();
}