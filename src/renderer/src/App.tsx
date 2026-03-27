import { useEffect, useState } from "react";
import { calcularEstatistica, EstatisticasDescritivas } from "./utils/stats";
import './assets/app.css'
import { text } from "stream/consumers";

function App(): React.JSX.Element {
  const [inputValores, setInputValores] = useState<string>('');
  const [resultados, setResultados] = useState<EstatisticasDescritivas | null>(null);

  const handleSave = () => {
    const texto = `
      Resultados\n
      Média: ${resultados?.media.toFixed(2)}\n
      Mediana: ${resultados?.mediana.toFixed(2)}\n
      Desvio Padrão: ${resultados?.desvioPadrao.toFixed(2)}\n
      Variância: ${resultados?.variancia.toFixed(2)}\n
      Minimo: ${resultados?.minimo.toFixed(2)}\n
      Maximo: ${resultados?.maximo.toFixed(2)}
    `

    window.api.saveText(texto);
  }

  useEffect(() => {
    const arrayNumber = inputValores
      .split(',')
      .map((item) => parseFloat(item.trim()))
      .filter((numero) => !isNaN(numero));

    const estatisticas = calcularEstatistica(arrayNumber);

    setResultados(estatisticas);
  })

  return (
    <section>
      <h1>Calculadora de estatisticas</h1>

      <div>
        <label>Digite os valores separados por virgula (ex: 10, 20.5, 30): </label>
        <input
          type="text"
          value={inputValores}
          onChange={(e) => setInputValores(e.target.value)}
        />
      </div>

      {resultados && (
        <div className="resultados">
          <h2>Resultados</h2>
          <div className="lista">
            <ul>
              <li><strong>Média: </strong>{resultados.media.toFixed(2)}</li>
              <li><strong>Mediana: </strong>{resultados.mediana.toFixed(2)}</li>
              <li><strong>Desvio Padrão: </strong>{resultados.desvioPadrao.toFixed(2)}</li>
            </ul>
            <ul>
              <li><strong>Variância: </strong>{resultados.variancia.toFixed(2)}</li>
              <li><strong>Mínimo: </strong>{resultados.minimo.toFixed(2)}</li>
              <li><strong>Máximo: </strong>{resultados.maximo.toFixed(2)}</li>
            </ul>
          </div>
        </div>
      )}
        <button
          onClick={handleSave}
        >
          Salvar
        </button>
    </section>
  )
}

export default App