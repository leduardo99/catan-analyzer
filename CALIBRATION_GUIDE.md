# 🎯 Guia de Calibração - Catan Analyzer

## ✅ O Que Foi Implementado

Agora você tem **detecção real** de tabuleiro! O app captura a tela e tenta detectar:
- ✅ Posições dos hexágonos (19 tiles)
- ✅ Números nos tiles (placeholder - números aleatórios por enquanto)
- ✅ Recursos por cor (detecção básica de RGB)

## 🎮 Como Testar

### 1. Abrir Catan Universe

1. Abra o **Catan Universe** no Steam
2. Inicie uma partida (ou modo tutorial/practice)
3. Espere até o tabuleiro aparecer completamente
4. **Maximize a janela** (fullscreen ou maximizado)

### 2. Iniciar Catan Analyzer

```bash
npm start
```

A janela do analyzer aparecerá no canto.

### 3. Testar Detecção Real

1. **Clique no botão "📸 Real Mode"** (deve estar verde)
2. **Clique "🎲 Analyze Board (Real)"**
3. O app irá:
   - Capturar screenshot da tela inteira
   - Processar e detectar tiles
   - Mostrar resultados

4. **Clique em "🔍 Calibration"** para ver o screenshot capturado

### 4. Verificar Resultados

Você deve ver:
- ✅ **19 tiles detectados** (mensagem verde no topo)
- 📊 **Top Positions** com scores calculados
- 💡 **Strategy Suggestions**

## 🔧 Calibração Necessária

### Problema: Posições dos Tiles Erradas

As posições dos hexágonos são **hardcoded** baseando-se no centro da tela.

**Solução**:

1. Tire um screenshot do Catan Universe
2. Abra no Paint/Photoshop/GIMP
3. Anote as coordenadas (x, y) dos centros dos hexágonos
4. Edite `src/services/realBoardDetector.ts` linha ~40:

```typescript
const centerX = image.width / 2;  // Ajuste se necessário
const centerY = image.height / 2; // Ajuste se necessário
const hexSize = 80;               // ← Ajuste este tamanho
```

### Problema: Cores Não Detectam Recursos Corretamente

A detecção de cores usa valores RGB aproximados.

**Solução**:

1. No screenshot, use um color picker para pegar RGB exato de cada recurso
2. Edite `src/services/realBoardDetector.ts` linha ~158:

```typescript
private colorToResource(r: number, g: number, b: number): ResourceType {
  // Ajuste estes valores baseado nas cores REAIS do jogo

  // Forest (verde escuro)
  if (g > r && g > b && g > 80) {
    return ResourceType.WOOD;
  }

  // Hills (vermelho/tijolo)
  if (r > g && r > b && r > 100) {
    return ResourceType.BRICK;
  }

  // ... etc
}
```

### Problema: Números Não São Detectados

OCR ainda não está integrado (números são aleatórios).

**Solução**: Vou implementar Tesseract.js na próxima etapa.

## 📸 Captura de Screenshot

### Como Funciona

```typescript
// 1. Captura tela inteira
const screenshot = await window.electronAPI.captureScreenshot();

// 2. Converte para Image
const image = await base64ToImage(screenshot);

// 3. Detecta tiles baseado em posições fixas
const tiles = await detectTiles(image);

// 4. Para cada tile:
//    - Extrai região
//    - Analisa cor (RGB)
//    - Determina recurso

// 5. Retorna BoardState
return { tiles, settlements: [], robberPosition: null };
```

### Debugging

Abra DevTools (F12) e veja console:

```javascript
Processing screenshot...
Detected 19 tiles
Board detected: { tiles: 19, sample: [...] }
```

## 🎨 Valores de Cores Padrão

Atualmente usando estas aproximações (precisam calibração):

| Recurso | Cor Esperada | RGB Aproximado |
|---------|--------------|----------------|
| 🌲 Wood | Verde escuro | (50, 100, 50) |
| 🧱 Brick | Vermelho/marrom | (150, 80, 60) |
| 🌾 Wheat | Amarelo | (200, 180, 80) |
| 🐑 Sheep | Verde claro | (140, 180, 100) |
| ⛰️ Ore | Cinza escuro | (80, 80, 80) |
| 🏜️ Desert | Areia/bege | (180, 150, 100) |

## 🔬 Processo de Calibração Detalhado

### Etapa 1: Calibrar Posições dos Hexágonos

1. **Capturar screenshot com "Analyze Board (Real)"**
2. **Clicar "🔍 Calibration"** para ver imagem
3. **Anotar posições**:
   - Abra screenshot em editor de imagem
   - Clique no centro de cada hexágono
   - Anote coordenadas (x, y)

4. **Atualizar código**:

```typescript
// src/services/realBoardDetector.ts
// Método: detectTiles()

// Exemplo para 1920x1080 com jogo maximizado:
const tiles = [
  { id: 'tile-0', position: { x: 960, y: 300 } },   // Top center
  { id: 'tile-1', position: { x: 840, y: 380 } },   // Top left
  { id: 'tile-2', position: { x: 1080, y: 380 } },  // Top right
  // ... adicione todos os 19 tiles
];
```

### Etapa 2: Calibrar Detecção de Cores

1. **No screenshot, use Color Picker**:
   - Paint: Eyedropper tool
   - Browser DevTools: Inspect element
   - Online: https://imagecolorpicker.com/

2. **Para cada recurso**:
   - Clique no centro do hexágono
   - Anote valores R, G, B

3. **Atualizar código**:

```typescript
// src/services/realBoardDetector.ts
// Método: colorToResource()

// Exemplo com valores REAIS (substitua pelos seus):
if (r >= 45 && r <= 65 && g >= 90 && g <= 110 && b >= 40 && b <= 60) {
  return ResourceType.WOOD; // Verde escuro específico
}
```

### Etapa 3: Integrar OCR (Próximo Passo)

Vou implementar Tesseract.js para detectar números nos tiles.

## 🎯 Workflow de Teste

```bash
# 1. Abrir jogo
# Catan Universe maximizado

# 2. Iniciar analyzer
npm start

# 3. Testar modo real
# Clicar "📸 Real Mode"
# Clicar "🎲 Analyze Board (Real)"

# 4. Ver screenshot
# Clicar "🔍 Calibration"
# Verificar se capturou tudo

# 5. Ver resultados
# Clicar "📊 Results"
# Verificar se análise faz sentido

# 6. Comparar com jogo
# Os recursos detectados estão corretos?
# As posições fazem sentido?
```

## 🐛 Troubleshooting

### Screenshot está preto

**Problema**: Algumas apps bloqueiam captura de tela

**Solução**:
- Desabilite proteção de captura no Catan Universe (se houver)
- Ou teste com outra janela primeiro

### Nenhum tile detectado

**Problema**: Coordenadas muito erradas

**Solução**:
- Verifique resolução da tela
- Ajuste `centerX`, `centerY`, `hexSize`

### Cores sempre detectam recurso errado

**Problema**: Valores RGB muito diferentes

**Solução**:
- Use color picker no screenshot
- Atualize valores exatos em `colorToResource()`

### Performance lenta

**Problema**: Processamento de imagem é pesado

**Solução**:
- Normal para primeira versão
- Otimizações virão depois

## 📝 Checklist de Calibração

- [ ] Screenshot captura tela inteira
- [ ] 19 tiles são detectados
- [ ] Posições dos tiles estão próximas dos hexágonos reais
- [ ] Cores detectam pelo menos 3 recursos corretamente
- [ ] Análise gera posições ranqueadas
- [ ] Estratégias são sugeridas

## 🚀 Próximas Melhorias

1. **Integrar Tesseract.js** - Detectar números reais nos tiles
2. **Melhorar detecção de posições** - Usar detecção de hexágonos por contorno
3. **Calibração automática** - UI para clicar e definir posições
4. **Detecção de portos** - Identificar portos 2:1 e 3:1
5. **Tracking de settlements** - Detectar peças no tabuleiro

## 💡 Dicas

1. **Use Mock Mode para testar UI** - Alterne para "🧪 Mock Mode" se quiser testar sem jogo
2. **DevTools é seu amigo** - F12 mostra logs de detecção
3. **Compare com jogo real** - Veja se números/recursos batem
4. **Calibre incrementalmente** - Primeiro posições, depois cores, depois números

---

**Status**: ✅ Detecção real implementada, aguardando calibração
**Próximo**: Teste com Catan Universe e calibre valores
**Depois**: Integrar Tesseract.js para OCR de números
