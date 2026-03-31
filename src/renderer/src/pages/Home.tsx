import '../assets/global.css'
import '../assets/Home.css'
import { Link } from "react-router-dom";

function Home(): React.JSX.Element {


  return (
    <section>
      <h1>Calculadora Estatística Grupo 8 versão 1.1.3</h1>
      <div className="selecao">
        <p>Tipagem de dados: </p>
        <div className="caixaBotoes">
          <Link to="/DNA"><button className="botoes">DNA</button></Link>
          <Link to="/DASIC"><button className="botoes">DASIC</button></Link>
          <Link to="/DACIC"><button className="botoes">DACIC</button></Link>
        </div>
      </div>
    </section>
  )
}

export default Home