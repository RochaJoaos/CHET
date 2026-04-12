// Em desenvolvimento, o proxy do Vite redireciona /auth → http://localhost:8080/auth
// Em produção, defina VITE_API_URL no .env
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

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
