# 📊 Calculadora de Estatísticas Descritivas

> **Projeto Acadêmico** desenvolvido para a disciplina de estatística.
> 
> *Nota: O requisito do trabalho consistia apenas no desenvolvimento de uma calculadora funcional. A decisão de utilizar a stack **Electron + React** foi uma escolha pessoal para explorar o desenvolvimento de aplicações desktop nativas e a integração com o sistema de arquivos.*

Este aplicativo realiza cálculos estatísticos descritivos a partir de conjuntos de dados numéricos e permite a exportação dos resultados para arquivos locais.

![GitHub repo size](https://img.shields.io/github/repo-size/LeleoDosCode/Calculadora-de-Estatisticas?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/LeleoDosCode/Calculadora-de-Estatisticas?style=for-the-badge)

## 🚀 Sobre o Projeto

O foco principal foi transformar uma lógica matemática de cálculo em uma ferramenta utilitária robusta. A aplicação vai além do cálculo em tela, permitindo que o usuário salve seus relatórios no computador, simulando um software real de produtividade.

### Funcionalidades
- **Cálculo de Métricas:** Média, Mediana, Desvio Padrão, Variância, Mínimo e Máximo.
- **Processamento Dinâmico:** Atualização dos resultados conforme a digitação (reatividade).
- **Exportação Nativa:** Integração com o sistema operacional para salvar arquivos `.txt` via `dialog` do Electron.
- **Entrada Inteligente:** Campo de texto otimizado com quebra de linha automática e tratamento de dados via Regex/filtros.

## 🎨 Identidade Visual: Frutiger Aero

Para fugir do visual padrão, a interface foi inspirada na estética **Frutiger Aero**, caracterizada por:
- Elementos vítreos (Glossy) e transparências.
- Ícones inspirados em bolhas e água.
- Uma atmosfera tecnológica "otimista" típica dos sistemas operacionais do meio dos anos 2000.

## 🛠️ Tecnologias de Escolha

Para este projeto, optei voluntariamente por uma stack moderna de desenvolvimento desktop:
- **Electron:** Para transformar a aplicação web em um software instalável.
- **React + TypeScript:** Para uma interface componentizada, segura e escalável.
- **Vite:** Para garantir um ambiente de desenvolvimento rápido.
- **Node.js (Módulo FS):** Para manipulação direta de arquivos no HD.

## 🏗️ Arquitetura de Comunicação (IPC)

O projeto serviu para aplicar conceitos de **IPC (Inter-Process Communication)**, garantindo que o Front-end não tenha acesso direto e perigoso ao hardware, passando sempre por uma ponte de segurança (Preload):

1.  **Camada de Visão (Renderer):** Solicita o salvamento.
2.  **Ponte de Segurança (Preload):** Valida e encaminha o pedido.
3.  **Processo Principal (Main):** Executa a abertura da janela do sistema e grava o arquivo.