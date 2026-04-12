import './style.css'
import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { loginUser } from '../../services/api'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await loginUser({ email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.name)
      navigate('/messages')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>Entrar</h1>

        {error && <p className="error-msg">{error}</p>}

        <div className='inpbox'>
          <label htmlFor="input-email">Email</label>
          <input
            className="input"
            type="email"
            id="input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="inpbox">
          <label htmlFor="input-password">Senha</label>
          <input
            className="input"
            type="password"
            id="input-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a href="..." target="_blank" rel="noopener noreferrer">
            Esqueceu sua senha?
          </a>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Entrando...' : 'Continuar'}
        </button>

        <a
          id='create-account'
          onClick={() => navigate('/register')}
          style={{ cursor: 'pointer' }}
        >
          Crie sua conta
        </a>
      </form>
    </>
  )
}

export default Login