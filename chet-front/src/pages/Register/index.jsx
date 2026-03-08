import './style.css'

function Register() {
    return (
        <>
            <form action="">
                <h1>Criar uma conta</h1>
                <div className='inpbox'>
                    <label htmlFor="email">Email</label>
                    <input className='input' type="email" name="email" id="input-email" />
                </div>
                <div className='inpbox'>
                    <label htmlFor="name">Nome</label>
                    <input className='input' type="text" name="name" id="input-name" />
                </div>
                <div className='inpbox'>
                    <label htmlFor="password">Senha</label>
                    <input className='input' type="password" name="password" id="password" />
                </div>
                <div className='inpbox'>
                    <label htmlFor="confirm">Confirma Senha</label>
                    <input className='input' type="password" name="confirm" id="confirm" />
                </div>
                <div className='inpbox'>
                    <label htmlFor="date">Data de Nascimento</label>
                    <input className='input' type="date" name="date" id="input-date" />
                </div>
                <div className='inpbox'>
                    <p className="terms">Ao cadastrar-se você concorda com os<a href="">Termos de serviço</a> e estará ciente do <a href="">Aviso de privacidade</a> da comunidade.</p>
                </div>
                <input type="submit" value="Cadastrar" className='btn'/>
                <a href="">Já tenho conta</a>
            </form>
        </>
    )
}

export default Register