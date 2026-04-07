import * as ss from 'simple-statistics';

export interface EstatisticasDescritivas{
    moda: number;
    media: number;
    mediana: number;
    desvioPadrao: number;
    variancia: number;
    minimo?: number;
    maximo?: number;
    amplitudeTotal: number;
}

export function calcularEstatistica(dados: number[]): EstatisticasDescritivas | null{
    if(!dados || dados.length === 0) {
        return null;
    }

    const moda = ss.mode(dados);
    const media = ss.mean(dados);
    const mediana = ss.median(dados);
    const desvioPadrao = ss.standardDeviation(dados);
    const variancia = ss.variance(dados);
    const minimo = ss.min(dados);
    const maximo = ss.max(dados);
    const amplitudeTotal = maximo - minimo;

    return{
        moda,
        media,
        mediana,
        desvioPadrao,
        variancia,
        minimo,
        maximo,
        amplitudeTotal
    };
}