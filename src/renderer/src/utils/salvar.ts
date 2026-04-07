import { EstatisticasDescritivas } from "./stats";

export async function salvarResultados(
    resultados: EstatisticasDescritivas,
    titulo: string
): Promise<void> {
    const dados = `
${titulo}
========================
Moda:           ${resultados.moda.toFixed(4)}
Média:          ${resultados.media.toFixed(4)}
Mediana:        ${resultados.mediana.toFixed(4)}
========================
Amplitude:      ${resultados.amplitudeTotal.toFixed(4)}
Variância:      ${resultados.variancia.toFixed(4)}
Desvio Padrão:  ${resultados.desvioPadrao.toFixed(4)}
`.trim();

    await window.api.saveText(dados);
}