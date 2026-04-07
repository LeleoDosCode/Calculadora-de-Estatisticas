import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid, renderTextEditor, Column } from 'react-data-grid';
import { salvarResultados } from '@renderer/utils/salvar';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

import '../assets/global.css';
import '../assets/DACIC.css';
import 'react-data-grid/lib/styles.css';
import voltar from '../assets/frutiger/Aero Voltar.png';
import importButton from '../assets/frutiger/importButton.png'
import saveButton from '../assets/frutiger/saveButton.png'
import { versao } from '../utils/versao'

interface LinhaDASIC {
    id: number;
    valor: string;
    frequencia: string;
}

function DASIC(): React.JSX.Element {
    const [linhas, setLinhas] = useState<LinhaDASIC[]>([
        { id: 1, valor: '', frequencia: '' },
        { id: 2, valor: '', frequencia: '' },
        { id: 3, valor: '', frequencia: '' }
    ]);

    const [resultados, setResultados] = useState<{
        media: number; variancia: number; desvioPadrao: number;
        moda: number; mediana: number; amplitudeTotal: number;
    } | null>(null);

    const colunas: Column<LinhaDASIC>[] = [
        { key: 'valor', name: 'Valor', renderEditCell: renderTextEditor },
        { key: 'frequencia', name: 'Frequência (f)', renderEditCell: renderTextEditor },
    ];

    const handleSave = () => {
        if (!resultados) return;
        salvarResultados(resultados, 'Dados Agrupados Sem Intervalo de Classe (DASIC)');
    };

    useEffect(() => {
        try {
            let linhasValidas = linhas
                .map(l => ({
                    val: parseFloat(l.valor.replace(',', '.')),
                    freq: parseFloat(l.frequencia.replace(',', '.'))
                }))
                .filter(l => !isNaN(l.val) && !isNaN(l.freq) && l.freq > 0);

            if (linhasValidas.length > 0) {
                let N = 0;
                let somaXiFi = 0;
                let somaVariancia = 0;

                linhasValidas.sort((a, b) => a.val - b.val);

                linhasValidas.forEach(linha => {
                    const xi = linha.val;
                    N += linha.freq;
                    somaXiFi += (xi * linha.freq);
                });

                const mediaCalculada = somaXiFi / N;

                linhasValidas.forEach(linha => {
                    const xi = linha.val;
                    somaVariancia += linha.freq * Math.pow(xi - mediaCalculada, 2);
                });

                const varianciaCalculada = somaVariancia / N;
                const desvioCalculado = Math.sqrt(varianciaCalculada);

                const amplitudeCalculada = linhasValidas[linhasValidas.length - 1].val - linhasValidas[0].val;

                const posicaoMediana = N / 2;
                let freqAcumulada = 0;
                let medianaCalculada = 0;

                for (let i = 0; i < linhasValidas.length; i++) {
                    const linhaAtual = linhasValidas[i]
                    freqAcumulada += linhaAtual.freq;

                    if (freqAcumulada >= posicaoMediana) {
                        medianaCalculada = linhaAtual.val;
                        break;
                    }
                }

                let maiorFreq = -1;
                let modaCalculada = 0;

                linhasValidas.forEach((linha) => {
                    if (linha.freq > maiorFreq) {
                        maiorFreq = linha.freq;
                        modaCalculada = linha.val; // ← isso estava faltando
                    }
                });

                setResultados({
                    media: mediaCalculada, variancia: varianciaCalculada, desvioPadrao: desvioCalculado,
                    moda: modaCalculada, mediana: medianaCalculada, amplitudeTotal: amplitudeCalculada
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
                    const novasLinhas: LinhaDASIC[] = result.data
                        .filter(row => row.length >= 2 && row[0] !== '')
                        .map((row, i) => ({
                            id: Date.now() + i,
                            valor: row[0] ?? '',
                            frequencia: row[1] ?? '',
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
                const novasLinhas: LinhaDASIC[] = rows
                    .filter(row => row.length >= 2 && row[0] !== undefined)
                    .map((row, i) => ({
                        id: Date.now() + i,
                        valor: String(row[0] ?? ''),
                        frequencia: String(row[1] ?? ''),
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
                    <h2 style={{ marginLeft: '15px', color: '#004a8d' }}>Dados Agrupados Sem Intervalo de Classe (DASIC)</h2>
                </header>

                <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                    <div style={{ width: '500px' }} className="planilha-aero">
                        <DataGrid
                            columns={colunas} rows={linhas} onRowsChange={(rows) => setLinhas(rows)}
                            rowKeyGetter={(row) => row.id} style={{ height: '300px' }}
                        />
                        <button
                            className="btn-adicionar" style={{ margin: '10px', width: '100%', padding: '10px' }}
                            onClick={() => setLinhas([...linhas, { id: Date.now(), valor: '', frequencia: '' }])}
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
                            style={{ marginBottom: '5%' }}
                            className='importButton'
                            src={importButton} alt=""
                            onClick={() => inputRef.current?.click()}
                        />

                        <img
                            className='importButton'
                            onClick={handleSave}
                            src={saveButton} alt=""
                        />
                    </div>

                    <div className="resultados-painel" style={{ minWidth: '300px' }}>
                        <h3>Resultados da Amostra</h3>
                        <hr />
                        {resultados ? (
                            <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
                                <li><strong>Moda (Mo):</strong> {resultados.moda.toFixed(4)}</li>
                                <li><strong>Média (x̄):</strong> {resultados.media.toFixed(4)}</li>
                                <li><strong>Mediana (Md):</strong> {resultados.mediana.toFixed(4)}</li>
                                <hr style={{ opacity: 0.3, margin: '10px 0' }} />
                                <li><strong>Amplitude Total:</strong> {resultados.amplitudeTotal.toFixed(4)}</li>
                                <li><strong>Desvio Padrão (s):</strong> {resultados.desvioPadrao.toFixed(4)}</li>
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
    )
}

export default DASIC