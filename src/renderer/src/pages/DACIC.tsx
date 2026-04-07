import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid, renderTextEditor, Column } from 'react-data-grid';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

import '../assets/global.css';
import '../assets/DACIC.css';
import 'react-data-grid/lib/styles.css';
import voltar from '../assets/frutiger/Aero Voltar.png';
import importButton from '../assets/frutiger/importButton.png'
import { versao } from '../utils/versao'

interface LinhaDACIC {
    id: number;
    minimo: string;
    maximo: string;
    frequencia: string;
}

function DACIC(): React.JSX.Element {
    const [linhas, setLinhas] = useState<LinhaDACIC[]>([
        { id: 1, minimo: '', maximo: '', frequencia: '' },
        { id: 2, minimo: '', maximo: '', frequencia: '' },
        { id: 3, minimo: '', maximo: '', frequencia: '' }
    ]);

    const [resultados, setResultados] = useState<{
        media: number; variancia: number; desvio: number;
        moda: number; mediana: number; amplitude: number;
    } | null>(null);

    const colunas: Column<LinhaDACIC>[] = [
        { key: 'minimo', name: 'Lim. Inferior', renderEditCell: renderTextEditor },
        { key: 'maximo', name: 'Lim. Superior', renderEditCell: renderTextEditor },
        { key: 'frequencia', name: 'Frequência (f)', renderEditCell: renderTextEditor },
    ];

    useEffect(() => {
        try {
            let linhasValidas = linhas
                .map(l => ({
                    min: parseFloat(l.minimo.replace(',', '.')),
                    max: parseFloat(l.maximo.replace(',', '.')),
                    freq: parseFloat(l.frequencia.replace(',', '.'))
                }))
                .filter(l => !isNaN(l.min) && !isNaN(l.max) && !isNaN(l.freq) && l.freq > 0);

            linhasValidas.sort((a, b) => a.min - b.min);

            if (linhasValidas.length > 0) {
                let N = 0;
                let somaXiFi = 0;
                let somaVariancia = 0;

                linhasValidas.forEach(linha => {
                    const xi = (linha.min + linha.max) / 2;
                    N += linha.freq;
                    somaXiFi += (xi * linha.freq);
                });

                const mediaCalculada = somaXiFi / N;

                linhasValidas.forEach(linha => {
                    const xi = (linha.min + linha.max) / 2;
                    somaVariancia += linha.freq * Math.pow(xi - mediaCalculada, 2);
                });

                const varianciaCalculada = somaVariancia / N;
                const desvioCalculado = Math.sqrt(varianciaCalculada);
                const amplitudeCalculada = linhasValidas[linhasValidas.length - 1].max - linhasValidas[0].min;

                const posicaoMediana = N / 2;
                let freqAcumulada = 0;
                let medianaCalculada = 0;

                for (let i = 0; i < linhasValidas.length; i++) {
                    const linhaAtual = linhasValidas[i];
                    const freqAcumuladaAnterior = freqAcumulada;
                    freqAcumulada += linhaAtual.freq;

                    if (freqAcumulada >= posicaoMediana) {
                        const h = linhaAtual.max - linhaAtual.min;
                        medianaCalculada = linhaAtual.min + ((posicaoMediana - freqAcumuladaAnterior) / linhaAtual.freq) * h;
                        break;
                    }
                }

                let indiceModal = 0;
                let maiorFreq = -1;
                linhasValidas.forEach((linha, index) => {
                    if (linha.freq > maiorFreq) {
                        maiorFreq = linha.freq;
                        indiceModal = index;
                    }
                });

                const classeModal = linhasValidas[indiceModal];
                const freqModal = classeModal.freq;
                const freqAnt = indiceModal > 0 ? linhasValidas[indiceModal - 1].freq : 0;
                const freqPost = indiceModal < linhasValidas.length - 1 ? linhasValidas[indiceModal + 1].freq : 0;

                const delta1 = freqModal - freqAnt;
                const delta2 = freqModal - freqPost;
                let modaCalculada = 0;

                if (delta1 + delta2 === 0) {
                    modaCalculada = (classeModal.min + classeModal.max) / 2;
                } else {
                    const hModal = classeModal.max - classeModal.min;
                    modaCalculada = classeModal.min + (delta1 / (delta1 + delta2)) * hModal;
                }

                setResultados({
                    media: mediaCalculada, variancia: varianciaCalculada, desvio: desvioCalculado,
                    moda: modaCalculada, mediana: medianaCalculada, amplitude: amplitudeCalculada
                });

            } else {
                setResultados(null);
            }
        } catch (error) {
            console.error("Erro no cálculo", error);
            setResultados(null);
        }
    }, [linhas]);

    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const ext = file.name.split('.').pop()?.toLowerCase();

        if (ext === 'csv') {
            Papa.parse<string[]>(file, {
                complete: (result) => {
                    const novasLinhas: LinhaDACIC[] = result.data
                        .filter(row => row.length >= 3 && row[0] !== '')
                        .map((row, i) => ({
                            id: Date.now() + i,
                            minimo: row[0] ?? '',
                            maximo: row[1] ?? '',
                            frequencia: row[2] ?? '',
                        }));
                    setLinhas(novasLinhas);
                },
                skipEmptyLines: true,
            });
        } else if (ext === 'xlsx' || ext === 'xls') {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const data = new Uint8Array(ev.target!.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                const novasLinhas: LinhaDACIC[] = rows
                    .filter(row => row.length >= 3 && row[0] !== undefined)
                    .map((row, i) => ({
                        id: Date.now() + i,
                        minimo: String(row[0] ?? ''),
                        maximo: String(row[1] ?? ''),
                        frequencia: String(row[2] ?? ''),
                    }));
                setLinhas(novasLinhas);
            };
            reader.readAsArrayBuffer(file);
        }
        e.target.value = '';
    };

    return (
        <section className="containerS">
            <div className="content">

                <header style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <Link to="/">
                        <img className="bnt-voltar" src={voltar} alt="Botão de voltar" style={{ cursor: 'pointer', height: '40px' }} />
                    </Link>
                    <h2 style={{ marginLeft: '15px', color: '#004a8d' }}>Dados Agrupados Com Intervalo de Classe (DACIC)</h2>
                </header>

                <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                    <div style={{ width: '500px' }} className="planilha-aero">
                        <DataGrid
                            columns={colunas} rows={linhas} onRowsChange={(rows) => setLinhas(rows)}
                            rowKeyGetter={(row) => row.id} style={{ height: '300px' }}
                        />
                        <button
                            className="btn-adicionar" style={{ margin: '10px', width: '100%', padding: '10px' }}
                            onClick={() => setLinhas([...linhas, { id: Date.now(), minimo: '', maximo: '', frequencia: '' }])}
                        >
                            + Adicionar Linha
                        </button>
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            style={{ display: 'none' }}
                            onChange={handleImport}
                        />

                        <img
                            className='importButton'
                            src={importButton} alt=""
                            onClick={() => inputRef.current?.click()}
                        />
                    </div>

                    <div className="resultados-painel" style={{ minWidth: '300px' }}>
                        <h3>Resultados da Amostra</h3>
                        <hr />
                        {resultados ? (
                            <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
                                <li><strong>Média (x̄):</strong> {resultados.media.toFixed(4)}</li>
                                <li><strong>Moda (Mo):</strong> {resultados.moda.toFixed(4)}</li>
                                <li><strong>Mediana (Md):</strong> {resultados.mediana.toFixed(4)}</li>
                                <hr style={{ opacity: 0.3, margin: '10px 0' }} />
                                <li><strong>Amplitude Total:</strong> {resultados.amplitude.toFixed(4)}</li>
                                <li><strong>Variância (s²):</strong> {resultados.variancia.toFixed(4)}</li>
                                <li><strong>Desvio Padrão (s):</strong> {resultados.desvio.toFixed(4)}</li>
                            </ul>
                        ) : (
                            <p style={{ opacity: 0.6 }}>Preencha a tabela para visualizar os cálculos.</p>
                        )}
                    </div>
                </div>
            </div>
            <footer>
                <ul>
                    <li>Grupo 8</li>
                    <li>Versão {versao}</li>
                </ul>
            </footer>
        </section>
    );
}

export default DACIC;