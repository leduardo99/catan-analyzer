# Catan Analyzer

Uma aplicação desktop que analisa jogos de Catan Universe em tempo real, fornecendo sugestões estratégicas e análise de probabilidades.

## Funcionalidades

- **Captura de Tela**: Captura automática da janela do Catan Universe
- **Análise de Tabuleiro**: Detecção de hexágonos, números e recursos usando OCR
- **Cálculo de Probabilidades**: Análise matemática de todas as posições possíveis
- **Sugestões Estratégicas**: Recomendações inteligentes baseadas no estado do jogo
- **Overlay Transparente**: Interface que fica por cima do jogo sem atrapalhar
- **Janela Arrastável**: Posicione onde quiser na tela

## Tecnologias

- **Electron**: Framework desktop
- **React + TypeScript**: Interface do usuário
- **Tesseract.js**: OCR para reconhecimento de números
- **screenshot-desktop**: Captura de tela nativa
- **Vite**: Build e desenvolvimento rápido

## Instalação

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm start

# Build para produção
npm run build

# Criar executável
npm run package
```

## Como Usar

1. Abra o Catan Universe no Steam
2. Inicie o Catan Analyzer
3. A janela de overlay aparecerá no canto superior direito
4. Clique no botão "🎲 Analyze Board" para analisar o estado atual
5. Veja as análises de posições e sugestões estratégicas

### Controles

- **👁️**: Toggle visibilidade do overlay
- **➖**: Minimizar janela
- **❌**: Fechar aplicação
- **Arraste pela barra superior**: Mover a janela

## Análise de Posições

O analisador calcula para cada posição:

- **Probabilidade**: Chance de receber recursos (baseado em números adjacentes)
- **Expected Value**: Valor esperado considerando tipo de recurso
- **Score**: Pontuação geral considerando probabilidade + diversidade
- **Recursos**: Tipos de recursos acessíveis

### Sistema de Probabilidades

Distribuição de dados do Catan:
- 2 ou 12: 2.78% (1/36)
- 3 ou 11: 5.56% (2/36)
- 4 ou 10: 8.33% (3/36)
- 5 ou 9: 11.11% (4/36)
- 6 ou 8: 13.89% (5/36)

### Valores de Recursos

Pesos relativos para cálculo:
- Minério: 1.2 (mais valioso)
- Trigo: 1.1
- Madeira: 1.0
- Tijolo: 1.0
- Ovelha: 0.9
- Deserto: 0

## Estratégias Sugeridas

O motor de estratégia recomenda:

1. **SETTLEMENT**: Melhores posições para novos assentamentos
2. **CITY**: Assentamentos que valem upgrade para cidade
3. **TRADE**: Recursos escassos para focar em trades
4. **DEVELOPMENT**: Quando comprar cartas de desenvolvimento

## Estrutura do Projeto

```
catan-ocr/
├── src/
│   ├── main/              # Processo principal Electron
│   │   ├── main.ts        # Configuração da janela
│   │   └── preload.ts     # Bridge seguro entre main/renderer
│   ├── renderer/          # React app
│   │   ├── App.tsx        # Componente principal
│   │   ├── App.css        # Estilos
│   │   └── main.tsx       # Entry point React
│   ├── services/          # Lógica de negócio
│   │   ├── ocrService.ts  # OCR com Tesseract
│   │   └── boardAnalyzer.ts # Análise do tabuleiro
│   ├── utils/             # Utilidades
│   │   ├── strategyEngine.ts # Motor de estratégia
│   │   └── imageProcessor.ts # Processamento de imagem
│   └── types/             # TypeScript types
│       ├── catan.ts       # Tipos do domínio Catan
│       └── electron.d.ts  # Tipos do Electron API
├── package.json
├── tsconfig.json
├── tsconfig.electron.json
└── vite.config.ts
```

## Melhorias Futuras

- [ ] Calibração automática de cores para diferentes temas
- [ ] Detecção de portos (2:1 e 3:1)
- [ ] Tracking de cartas de desenvolvimento dos oponentes
- [ ] Histórico de jogadas e estatísticas
- [ ] Machine learning para melhorar detecção
- [ ] Suporte para múltiplos monitores
- [ ] Integração com API do Catan Universe (se disponível)
- [ ] Modo de análise pós-jogo
- [ ] Exportar análises para CSV/JSON

## Desenvolvimento

### Arquitetura

A aplicação usa o modelo de processo do Electron:

- **Main Process**: Gerencia janelas, captura de tela, IPC
- **Renderer Process**: React app isolado com context bridge
- **Preload Script**: Expõe APIs seguras para o renderer

### Debug

```bash
# O DevTools abre automaticamente em modo desenvolvimento
npm start
```

### Build

```bash
# Compilar TypeScript + React
npm run build

# Criar executável para Windows
npm run package
```

## Limitações Conhecidas

- OCR pode ter dificuldade com baixa resolução ou zoom
- Cores podem variar dependendo do tema do Catan Universe
- Requer permissão de captura de tela no Windows
- Performance depende da resolução da tela

## Notas de Segurança

- A aplicação apenas lê a tela, não interage com o jogo
- Não modifica arquivos do jogo
- Não se conecta à internet (OCR local)
- Código 100% open source e auditável

## Licença

MIT License - Livre para uso pessoal e modificação

## Créditos

Desenvolvido para análise estratégica de Catan Universe.
Não afiliado com Catan Studio ou Catan GmbH.
