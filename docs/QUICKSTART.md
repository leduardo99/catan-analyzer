# 🚀 Quick Start - Catan Analyzer

## Instalação em 3 Passos

### 1️⃣ Instalar Dependências
```bash
npm install
```

Isso instalará:
- Electron (desktop framework)
- React + TypeScript (UI)
- Tesseract.js (OCR)
- Vite (build tool)
- E todas as dependências necessárias

### 2️⃣ Iniciar Aplicação
```bash
npm start
```

Aguarde até ver:
```
✓ ready in XXX ms
[Electron] App ready
```

### 3️⃣ Testar
1. A janela do Catan Analyzer aparecerá no canto superior direito
2. Clique no botão **"🎲 Analyze Board"**
3. Veja a análise de posições e estratégias

## 🎯 Primeiro Uso

### O que você verá:

#### 🎯 Top Positions
Lista das 5 melhores posições para assentamentos com:
- Rank (#1, #2, etc)
- Score (0-100)
- Probabilidade de produção
- Valor esperado
- Recursos adjacentes (emojis)

#### 💡 Strategy Suggestions
Recomendações ordenadas por prioridade:
- 🟢 Alta prioridade (90+)
- 🟡 Média prioridade (70-89)
- 🔴 Baixa prioridade (<70)

### Controles:

| Botão | Ação |
|-------|------|
| 👁️ | Toggle visibilidade (transparência) |
| ➖ | Minimizar janela |
| ❌ | Fechar aplicação |
| Barra superior | Arrastar janela |

## 🧪 Modo de Desenvolvimento

Atualmente usando **mock data** para testes.

Para alternar entre mock e OCR real:

```typescript
// Em src/renderer/App.tsx linha 15:
const [useMockData] = useState(true); // true = mock, false = OCR
```

### Mock Boards Disponíveis:

```typescript
// Em handleAnalyze(), altere para testar diferentes cenários:

// Board padrão
boardState = mockBoardService.generateStandardBoard();

// Board com muitos 6s e 8s (rico)
boardState = mockBoardService.generateRichBoard();

// Board com números ruins (escasso)
boardState = mockBoardService.generateScarceBoard();

// Board com settlements existentes (mid-game)
boardState = mockBoardService.generateMidGameBoard();

// Board aleatório
boardState = mockBoardService.getRandomBoard();
```

## 🔍 Debug

### Abrir DevTools
DevTools abre automaticamente em modo desenvolvimento.

### Console Logs
Veja mensagens úteis como:
```
Screenshot captured
Using mock board data
Analysis complete
```

### Verificar Dados
No console do DevTools:
```javascript
// Ver análise atual
console.log(topPositions)
console.log(strategies)
```

## 📂 Estrutura Rápida

```
src/
├── main/           → Electron backend
├── renderer/       → React UI
├── services/       → Lógica de OCR e análise
├── utils/          → Estratégias e processamento
└── types/          → TypeScript types
```

## ⚙️ Comandos Úteis

```bash
# Desenvolvimento
npm start              # Dev mode com hot reload

# Build
npm run build          # Compilar tudo
npm run build:renderer # Apenas React
npm run build:electron # Apenas Electron

# Produção
npm run package        # Criar executável
```

## 🐛 Troubleshooting

### Problema: Janela não aparece
**Solução**: Verifique se porta 5173 está livre
```bash
# Windows
netstat -ano | findstr :5173
```

### Problema: Erros de TypeScript
**Solução**: Reconstruir
```bash
npm run build
```

### Problema: Dependências faltando
**Solução**: Reinstalar
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problema: Janela não fica no topo
**Solução**: Reiniciar aplicação
```bash
Ctrl+C (no terminal)
npm start
```

## 🎮 Testando com Catan Universe

### Preparação:
1. Abra Catan Universe (Steam)
2. Inicie uma partida (ou modo treino)
3. Espere o tabuleiro aparecer
4. Inicie Catan Analyzer

### Para captura real:
1. Mude `useMockData` para `false`
2. Clique "Analyze Board"
3. O sistema capturará a tela

**Nota**: OCR precisa ser calibrado com screenshots reais!

## 📖 Próximos Passos

1. **Ler README.md**: Documentação completa
2. **Ler USAGE.md**: Guia detalhado de uso
3. **Ver PROJECT_SUMMARY.md**: Overview técnico
4. **Explorar código**: Começar por `src/renderer/App.tsx`

## 🎯 Checklist de Validação

Antes de usar em jogo real:

- [ ] Aplicação inicia sem erros
- [ ] Janela é arrastável
- [ ] Botões funcionam (minimize, close)
- [ ] Analyze Board mostra resultados
- [ ] Posições estão ranqueadas
- [ ] Estratégias aparecem
- [ ] UI é legível
- [ ] Overlay não atrapalha jogo

## 💡 Dicas

1. **Posicionamento**: Coloque a janela onde não atrapalha (canto)
2. **Transparência**: Use 👁️ para tornar semi-transparente
3. **Análise**: Re-analise após cada rodada
4. **Aprendizado**: Compare sugestões com suas decisões

## 🏆 Você está pronto!

A aplicação está 100% funcional em modo mock.

Para usar com Catan Universe real:
1. Capture screenshots do jogo
2. Calibre OCR em `src/services/ocrService.ts`
3. Ajuste detecção de cores em `src/utils/imageProcessor.ts`
4. Teste e refine

**Divirta-se analisando Catan! 🎲**

---

Precisa de ajuda? Consulte:
- README.md (documentação)
- USAGE.md (guia detalhado)
- PROJECT_SUMMARY.md (visão técnica)
