import './style.css'
import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { registerUser } from '../../services/api'

function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)

    try {
      const data = await registerUser({ email, name, password })
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
        <h1>Criar uma conta</h1>

        {error && <p className="error-msg">{error}</p>}

        <div className='inpbox'>
          <label htmlFor="input-email">Email</label>
          <input
            className='input'
            type="email"
            id="input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className='inpbox'>
          <label htmlFor="input-name">Nome</label>
          <input
            className='input'
            type="text"
            id="input-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className='inpbox'>
          <label htmlFor="password">Senha</label>
          <input
            className='input'
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className='inpbox'>
          <label htmlFor="confirm">Confirma Senha</label>
          <input
            className='input'
            type="password"
            id="confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        <div className='inpbox'>
          <p className="terms">
            Ao cadastrar-se você concorda com os{' '}
            <a href="">Termos de serviço</a> e estará ciente do{' '}
            <a href="">Aviso de privacidade</a> da comunidade.
          </p>
        </div>

        <button type="submit" className='btn' disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        <a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
          Já tenho conta
        </a>
      </form>
    </>
  )
}

export default Register