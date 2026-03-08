import './style.css'

function Login() {
    return (
        <>
        <form action="">
            <h1>Entrar</h1>
            <div className='inpbox'>
                <label htmlFor="name">Email</label>
                <input className="input" type="email" name="email" id="input-email" required/>
            </div>
            <div className="inpbox">
                <label for="name">Senha</label>
                <input className="input" type="password" name="password" id="input-password" required/>
                <a href="..." target="_blank" rel="noopener noreferrer">Esqueceu sua senha?</a>
            </div>
            <input type='submit' value="Continuar" className="btn"/>
            <a href="..." target="_self" rel="noopener noreferrer" id='create-account'>Crie sua conta</a>
        </form>
        </>
    )
}

export default Login