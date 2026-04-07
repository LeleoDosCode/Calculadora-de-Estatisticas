import { useEffect, useState } from "react";
import { calcularEstatistica, EstatisticasDescritivas } from "../utils/stats";
import { salvarResultados } from "@renderer/utils/salvar";
import { Link } from "react-router-dom";
import '../assets/DNA.css'
import '../assets/global.css';
import voltar from '../assets/frutiger/Aero Voltar.png';
import importButton from "../assets/frutiger/importButton.png"
import saveButton from "../assets/frutiger/saveButton.png"
import { versao } from '../utils/versao'

function DNA(): React.JSX.Element {
  const [inputValores, setInputValores] = useState<string>('');
  const [resultados, setResultados] = useState<EstatisticasDescritivas | null>(null);

  const handleImport = async () => {
    const conteudo = await window.api.importCSV();

    if (conteudo) {
      const elementos = conteudo.split(/[\n ,;:]+/); // aceita ; , : newline

      const numerosValidos = elementos
        .map(item => item.trim())
        .filter(item => item !== '' && !isNaN(parseFloat(item)));

      const textoInputs = numerosValidos.join(', ');

      setInputValores(textoInputs);
    }
  }

  const handleSave = () => {
    if (!resultados) return;
    salvarResultados(resultados, 'Dados Não Agrupados (DNA)');
};

  useEffect(() => {
    const arrayNumber = inputValores
      .split(/[ ,;]+/)
      .map((item) => parseFloat(item.trim()))
      .filter((numero) => !isNaN(numero));

    const estatisticas = calcularEstatistica(arrayNumber);

    setResultados(estatisticas);
  }, [inputValores]);

  return (
    <section className="container">
      <div className="content">

        <Link to="/"><img className="bnt-voltar" src={voltar} alt="Botão de voltar" /></Link>

        <h1>Dados Não Agrupados</h1>

        <div className="contentDNA">
          <div className="paragrafoDNA">
            <label className="labelEnfase">Digite os valores separados por:&nbsp;<p className="enfase">,</p>&nbsp;ou&nbsp;<p className="enfase">␣</p>&nbsp;ou&nbsp;<p className="enfase">;</p> (ex: 10, 20 30; 40): </label>
          </div>
          <textarea
            className="areaTexto"
            value={inputValores}
            onChange={(e) => setInputValores(e.target.value)}
            rows={4}
          />
          {resultados && (
            <div className="resultados">
              <div className="lista">
                <ul style={{ justifyContent: 'center' }}>
                  <li><strong>Moda (Mo):</strong></li>
                  <li>{resultados.moda.toFixed(4)}</li>
                  <li><strong>Média (x̄):</strong></li>
                  <li>{resultados.media.toFixed(4)}</li>
                  <li><strong>Mediana (Md):</strong></li>
                  <li>{resultados.mediana.toFixed(4)}</li>
                </ul>
                <ul style={{ justifyContent: 'center' }}>
                  <li><strong>Amplitude Total:</strong></li>
                  <li>{resultados.amplitudeTotal.toFixed(4)}</li>
                  <li><strong>Desvio Padrão (s):</strong></li>
                  <li>{resultados.desvioPadrao.toFixed(4)}</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <img
          style={{ marginBottom: '5%' }}
          onClick={handleImport}
          className='importButton'
          src={importButton} alt=""
        />

        <img
          className='importButton'
          onClick={handleSave}
          src={saveButton} alt=""
        />
      </div>
      <footer>
        <ul>
          <li>Grupo 8</li>
          <li>Versão {versao}</li>
        </ul>
      </footer>
    </section>
  )
}

export default DNA