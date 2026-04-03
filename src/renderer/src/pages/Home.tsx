import '../assets/global.css'
import '../assets/Home.css'
import { Link } from "react-router-dom";

function Home(): React.JSX.Element {


  return (
    <section>
      <div className="content">
        <h1>Calculadora Estatística</h1>
        <div className="selecao">
          <p>Tipagem de dados: </p>
          <div className="caixaBotoes">
            <Link className="botoes" to="/DNA"><button className="botoes">DNA</button></Link>
            <Link className="botoes" to="/DASIC"><button className="botoes">DASIC</button></Link>
            <Link className="botoes" to="/DACIC"><button className="botoes">DACIC</button></Link>
          </div>
        </div>
      </div>
      <footer>
        <ul>
          <li>Grupo 8</li>
          <li>Versão 1.1.3</li>
        </ul>
      </footer>
    </section>
  )
}

export default Home