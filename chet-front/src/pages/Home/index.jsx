import './style.css'
import { useNavigate } from "react-router-dom";

function App() {

  const navigate = useNavigate();

  function btnEntrar(){
    navigate("/login")
  }

  function btnCadastrar(){
    navigate("/register")
  }

  return (
    <>
      <main>
        <section id='welcome'>
          <div className='box'>
                <h1>Bem-vindo ao CHET</h1>
                <input type="button" value="Entrar" className="log" onClick={btnEntrar}/>
                <input type="button" value="Cadastrar" className="log" onClick={btnCadastrar}/>          
          </div>
        </section>
      </main>
    </>
  )
}

export default App
