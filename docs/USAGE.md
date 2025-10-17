# Guia de Uso - Catan Analyzer

## Início Rápido

### 1. Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd catan-ocr

# Instale as dependências
npm install
```

### 2. Executar

```bash
# Modo desenvolvimento
npm start
```

A aplicação irá:
1. Compilar o código TypeScript
2. Iniciar o servidor Vite na porta 5173
3. Abrir a janela Electron

## Interface

### Componentes Principais

#### Barra de Título (Arrastável)
- **Catan Analyzer**: Título da aplicação
- **👁️**: Toggle visibilidade (torna overlay transparente)
- **➖**: Minimizar janela
- **❌**: Fechar aplicação

#### Botão de Análise
- **🎲 Analyze Board**: Captura e analisa o estado atual do jogo

#### Seção de Posições
Mostra as 5 melhores posições para assentamentos:

```
🎯 Top Positions
┌─────────────────────────┐
│ #1                 85.3 │ ← Rank e Score
│ Probability: 27.8%      │ ← Chance de produzir
│ Expected: 3.45          │ ← Valor esperado
│ 🌲 🧱 🌾              │ ← Recursos adjacentes
└─────────────────────────┘
```

#### Seção de Estratégias
Lista recomendações ordenadas por prioridade:

```
💡 Strategy Suggestions
┌─────────────────────────┐
│ 🟢 SETTLEMENT           │ ← Tipo (cor = prioridade)
│ Build at position...    │ ← Descrição
│ Expected value: 3.45... │ ← Raciocínio
└─────────────────────────┘
```

## Como Funciona

### 1. Captura de Tela

```typescript
// Quando você clica "Analyze Board":
const screenshot = await window.electronAPI.captureScreenshot();
```

Captura a tela inteira em formato PNG base64.

### 2. Processamento OCR

```typescript
// OCR detecta números nos hexágonos:
const numbers = await ocrService.recognizeNumbers(screenshot);
// Retorna: ['6', '8', '5', '10', '9', '4', ...]
```

### 3. Análise do Tabuleiro

```typescript
// Cria estado do tabuleiro:
const boardState = {
  tiles: [
    { id: '1', resource: 'WOOD', number: 11, position: {x, y} },
    { id: '2', resource: 'BRICK', number: 5, position: {x, y} },
    // ...
  ],
  settlements: [],
  robberPosition: null
};
```

### 4. Cálculo de Probabilidades

Para cada posição de assentamento:

```typescript
// Probabilidade total
probability = sum(diceProbability[adjacentTile.number])

// Valor esperado
expectedValue = sum(probability * resourceValue)

// Score final
score = expectedValue * 100 + diversityBonus
```

#### Exemplo de Cálculo

Posição adjacente a:
- Madeira com 6 (prob: 13.89%, valor: 1.0)
- Trigo com 8 (prob: 13.89%, valor: 1.1)
- Ovelha com 10 (prob: 8.33%, valor: 0.9)

```
probability = 0.1389 + 0.1389 + 0.0833 = 0.3611 (36.11%)
expectedValue = (0.1389 * 1.0) + (0.1389 * 1.1) + (0.0833 * 0.9) = 0.366
diversityBonus = 3 resources * 0.5 = 1.5
score = 0.366 * 100 + 1.5 = 38.1
```

### 5. Geração de Estratégias

```typescript
// Motor de estratégia analisa:
- Top 3 posições → Recomenda assentamentos
- Assentamentos existentes → Sugere upgrades para cidade
- Distribuição de recursos → Identifica escassez
- Acesso a ore/wheat → Recomenda dev cards
```

## Personalização

### Ajustar Valores de Recursos

Edite em [src/services/boardAnalyzer.ts](src/services/boardAnalyzer.ts#L10):

```typescript
private readonly resourceValues = {
  WOOD: 1.0,    // Valor base
  BRICK: 1.0,
  WHEAT: 1.1,   // Mais valioso
  SHEEP: 0.9,   // Menos valioso
  ORE: 1.2,     // Mais valioso
  DESERT: 0,
};
```

### Modificar Prioridades de Estratégia

Edite em [src/utils/strategyEngine.ts](src/utils/strategyEngine.ts#L15):

```typescript
strategies.push({
  type: 'SETTLEMENT',
  priority: 100,  // 0-100 (maior = mais importante)
  description: '...',
  reasoning: '...',
});
```

### Calibrar OCR

Para melhorar reconhecimento de números:

```typescript
// Em src/services/ocrService.ts
await this.worker.setParameters({
  tessedit_char_whitelist: '23456789101112',  // Números válidos
  tessedit_pageseg_mode: Tesseract.PSM.SPARSE_TEXT,
});
```

## Dicas de Uso

### 1. Melhor Captura
- Use resolução Full HD (1920x1080) ou superior
- Certifique-se que o tabuleiro está visível
- Evite sobreposição de elementos UI

### 2. Interpretando Scores
- **Score > 80**: Excelente posição
- **Score 60-80**: Boa posição
- **Score 40-60**: Posição mediana
- **Score < 40**: Posição fraca

### 3. Prioridade de Estratégias
- 🟢 Verde (90+): Alta prioridade
- 🟡 Amarelo (70-89): Média prioridade
- 🔴 Vermelho (<70): Baixa prioridade

### 4. Diversidade vs. Probabilidade
O analisador valoriza ambos:
- **Alta probabilidade**: Produção consistente
- **Alta diversidade**: Flexibilidade estratégica

## Troubleshooting

### OCR não detecta números
- Verifique se a resolução é adequada
- Tente ajustar o zoom do jogo
- Calibre os parâmetros do OCR

### Janela não fica sempre no topo
- Reinicie a aplicação
- Verifique permissões do Windows

### Performance lenta
- Reduza a resolução da captura
- Desative DevTools em produção

## Exemplos de Análise

### Cenário 1: Início do Jogo

```
Top Position:
- 6 (Wheat), 8 (Brick), 5 (Wood)
- Probability: 36%
- Expected: 3.5
- Score: 85

Estratégia: Construir primeiro assentamento aqui.
Razão: Alta probabilidade + recursos diversificados + números bons.
```

### Cenário 2: Mid Game

```
Strategy: CITY
Priority: 85
Description: Upgrade settlement on wheat/ore position

Reasoning: High production value would double with city.
Already have 2 settlements, time to consolidate.
```

### Cenário 3: Late Game

```
Strategy: DEVELOPMENT
Priority: 60
Description: Consider buying development cards

Reasoning: Good ore/wheat access (3+ tiles each).
Dev cards provide flexibility and victory points.
```

## Atalhos e Comandos

### Durante o Jogo
- **F5**: Atualizar análise (implementar)
- **Ctrl+H**: Hide/Show overlay
- **Ctrl+Q**: Fechar aplicação

### Desenvolvimento
```bash
npm start          # Dev mode com hot reload
npm run build      # Build produção
npm run package    # Criar executável
```

## Próximos Passos

1. Jogue algumas partidas com o analisador
2. Calibre os valores de recursos para seu estilo
3. Teste diferentes resoluções
4. Contribua com melhorias no GitHub

Divirta-se analisando e vencendo no Catan! 🎲
