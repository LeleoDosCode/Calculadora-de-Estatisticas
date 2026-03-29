import { useEffect, useState } from "react";
import { calcularEstatistica, EstatisticasDescritivas } from "./utils/stats";
import './assets/app.css'

function App(): React.JSX.Element {
  const [inputValores, setInputValores] = useState<string>('');
  const [resultados, setResultados] = useState<EstatisticasDescritivas | null>(null);

  const handleImport = async () => {
    const conteudo = await window.api.importCSV();

    if(conteudo){
      const elementos = conteudo.split(/[\n ,;:]+/); // aceita ; , : newline

      const numerosValidos = elementos
      .map(item => item.trim())
      .filter(item => item !== '' && !isNaN(parseFloat(item)));

      const textoInputs = numerosValidos.join(', ');

      setInputValores(textoInputs);
    }
  }

  const handleSave = () => {
    const texto = `Resultados:
Média: ${resultados?.media.toFixed(2)}
Mediana: ${resultados?.mediana.toFixed(2)}
Desvio Padrão: ${resultados?.desvioPadrao.toFixed(2)}
Variância: ${resultados?.variancia.toFixed(2)}
Minimo: ${resultados?.minimo.toFixed(2)}
Maximo: ${resultados?.maximo.toFixed(2)}`

    window.api.saveText(texto);
  }

  useEffect(() => {
    const arrayNumber = inputValores
      .split(/[ ,;]+/)
      .map((item) => parseFloat(item.trim()))
      .filter((numero) => !isNaN(numero));

    const estatisticas = calcularEstatistica(arrayNumber);

    setResultados(estatisticas);
  }, [inputValores]);

  return (
    <section>
      <h1>Calculadora de estatísticas</h1>

      <div>
        <label>Digite os valores separados por virgula (ex: 10, 20.5, 30): </label>
        <textarea
          value={inputValores}
          onChange={(e) => setInputValores(e.target.value)}
          rows={4}
        />
      </div>

      {resultados && (
        <div className="resultados">
          <div className="lista">
            <ul>
              <li><strong>Média: </strong></li>
              <li>{resultados.media.toFixed(2)}</li>
              <li><strong>Mediana: </strong></li>
              <li>{resultados.mediana.toFixed(2)}</li>
              <li><strong>Desvio Padrão: </strong></li>
              <li>{resultados.desvioPadrao.toFixed(2)}</li>
            </ul>
            <ul>
              <li><strong>Variância: </strong></li>
              <li>{resultados.variancia.toFixed(2)}</li>
              <li><strong>Mínimo: </strong></li>
              <li>{resultados.minimo.toFixed(2)}</li>
              <li><strong>Máximo: </strong></li>
              <li>{resultados.maximo.toFixed(2)}</li>
            </ul>
          </div>
        </div>
      )}

      <button onClick={handleImport} className="btn-importar">
        CSV
      </button>

      <button
        onClick={handleSave}
      >
        Salvar
      </button>
    </section>
  )
}

export default App