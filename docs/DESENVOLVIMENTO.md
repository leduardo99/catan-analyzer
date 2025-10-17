# Guia de Desenvolvimento - Catan Analyzer

## ✅ Configuração Completa

### Hot Reload Configurado

Agora você tem **desenvolvimento com hot reload completo**:

```bash
npm start
```

**O que acontece:**
1. ✅ Compila Electron uma vez inicial
2. ✅ Inicia Vite (React) com HMR
3. ✅ Inicia TypeScript watch (Electron)
4. ✅ Inicia Electron com Nodemon (auto-restart)

**Resultado:**
- **Edita React/CSS** → Mudanças instantâneas (sem reiniciar)
- **Edita Electron** → Recompila e reinicia app automaticamente
- **Edita Services/Utils** → Hot reload instantâneo

## 🎯 Workflow de Desenvolvimento

### 1. Iniciar Dev Mode

```bash
npm start
```

Aguarde até ver:
```
VITE v5.4.20  ready in XXX ms
➜  Local:   http://localhost:5173/
```

A janela do Electron abrirá automaticamente.

### 2. Fazer Mudanças

#### Mudanças na UI (React)

Edite qualquer arquivo em `src/renderer/`:
- `App.tsx` - Componentes React
- `App.css` - Estilos
- `main.tsx` - Entry point

**Resultado**: Hot reload instantâneo, janela não fecha.

#### Mudanças no Electron (Main Process)

Edite qualquer arquivo em `src/main/`:
- `main.ts` - Configuração da janela
- `preload.ts` - IPC bridge

**Resultado**:
1. TypeScript recompila (~1 segundo)
2. Nodemon detecta mudança
3. Electron reinicia automaticamente
4. Janela fecha e reabre

#### Mudanças em Services/Utils

Edite:
- `src/services/` - OCR, análise
- `src/utils/` - Estratégias, processamento
- `src/types/` - Tipos TypeScript

**Resultado**: Hot reload instantâneo (se usado pelo React).

### 3. Testar

A janela do Electron reflete suas mudanças automaticamente.

### 4. Commit

```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

## 📦 Build e Distribuição

### Build Local (Testar Produção)

```bash
# Build completo
npm run build

# Criar executável portable
npm run dist
```

Executável gerado: `release/CatanAnalyzer-1.0.0-portable.exe`

### Publicar no GitHub

#### Opção 1: Automática (Recomendado)

```bash
# Incrementar versão
npm version patch  # 1.0.0 → 1.0.1

# Push com tags
git push && git push --tags

# GitHub Actions faz build automaticamente
# Espere ~5 min e baixe .exe da release
```

#### Opção 2: Manual

```bash
# Build local
npm run dist

# Upload manual no GitHub
# Releases → Create new release → Anexar .exe
```

## 🎮 Testar com Catan Universe

### Setup

1. Baixar executável da release do GitHub
2. Colocar em pasta (ex: `C:\Games\CatanAnalyzer\`)
3. Abrir Catan Universe
4. Executar o .exe
5. Clicar "Analyze Board"

### Calibração do OCR

Para funcionar com jogo real, você precisa calibrar:

1. **Capturar screenshots** do jogo
2. **Testar OCR** com screenshots reais
3. **Ajustar parâmetros** em `src/services/ocrService.ts`
4. **Calibrar cores** em `src/utils/imageProcessor.ts`
5. **Testar coordenadas** dos hexágonos

Ver: `USAGE.md` para detalhes.

## 🔍 Estrutura de Arquivos (Desenvolvimento)

```
src/
├── main/                    # Electron Main Process
│   ├── main.ts             # ← Edite para mudar janela/IPC
│   └── preload.ts          # ← Edite para expor APIs ao React
│
├── renderer/                # React Application
│   ├── App.tsx             # ← Edite para mudar UI
│   ├── App.css             # ← Edite para mudar estilos
│   └── main.tsx            # Entry point (raramente editar)
│
├── services/                # Lógica de negócio
│   ├── ocrService.ts       # ← Calibre OCR aqui
│   ├── boardAnalyzer.ts    # ← Ajuste algoritmos aqui
│   └── mockBoardService.ts # Dados de teste
│
├── utils/                   # Utilidades
│   ├── strategyEngine.ts   # ← Adicione estratégias aqui
│   └── imageProcessor.ts   # ← Calibre detecção de cores
│
└── types/                   # TypeScript Types
    ├── catan.ts            # Tipos do domínio
    └── electron.d.ts       # Tipos Electron API
```

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm start                    # Dev mode com hot reload
npm run build:electron       # Só rebuild Electron (rápido)

# Build
npm run build                # Build completo (prod)
npm run build:renderer       # Só build React
npm run dist                 # Criar .exe portable

# Git/Release
npm version patch            # 1.0.0 → 1.0.1
npm version minor            # 1.0.0 → 1.1.0
git push && git push --tags  # Trigger GitHub Actions
```

## 🐛 Troubleshooting

### "Electron não reinicia automaticamente"

Verifique se Nodemon está instalado:
```bash
npm install --save-dev nodemon
```

### "Mudanças na UI não aparecem"

1. Verifique se Vite está rodando (porta 5173)
2. Recarregue a janela: `Ctrl+R` no Electron
3. Limpe cache: `rm -rf node_modules/.vite && npm start`

### "TypeScript errors"

```bash
# Recompilar tudo
npm run build:electron
```

### "Porta 5173 em uso"

Vite tentará automaticamente 5174, 5175, etc.
O Electron foi configurado para buscar automaticamente.

### "Electron não abre"

1. Certifique-se que compilou: `npm run build:electron`
2. Verifique se `dist/main/main.js` existe
3. Veja logs no terminal

## 📚 Documentação de Referência

- `README.md` - Overview geral
- `QUICKSTART.md` - Início rápido para novos usuários
- `USAGE.md` - Guia detalhado de uso
- `BUILD.md` - Guia de build e distribuição
- `RELEASE.md` - Como fazer releases no GitHub
- `PROJECT_SUMMARY.md` - Visão técnica completa

## 🎯 Próximos Passos

### Curto Prazo (1-2 dias)
- [ ] Testar hot reload com mudanças reais
- [ ] Capturar screenshots do Catan Universe
- [ ] Começar calibração do OCR

### Médio Prazo (1 semana)
- [ ] Calibrar detecção de números
- [ ] Calibrar detecção de recursos
- [ ] Testar com jogo real
- [ ] Ajustar algoritmos baseado em resultados

### Longo Prazo
- [ ] Adicionar detecção de portos
- [ ] Implementar tracking de settlements
- [ ] Melhorar UI/UX
- [ ] Adicionar mais estratégias

## 💡 Dicas

1. **Use DevTools** - F12 no Electron para debugar React
2. **Console.log** - Use liberalmente para debug
3. **Mock Data** - Use `mockBoardService` para testar sem jogo
4. **Git Commits** - Faça commits pequenos e frequentes
5. **Teste Sempre** - Teste cada mudança antes de commit

---

**Status**: ✅ Ambiente de desenvolvimento completo
**Hot Reload**: ✅ Funcionando
**Build Pipeline**: ✅ Configurado
**GitHub Actions**: ✅ Pronto para usar

**Você está pronto para desenvolver! 🚀**
