# Build e Distribuição - Catan Analyzer

## 🔥 Hot Reload (Desenvolvimento)

### Como Funciona Agora

A aplicação tem **hot reload completo**:

- **React (UI)**: Vite com HMR - mudanças instantâneas sem reload
- **Electron (Main)**: TypeScript watch mode + Nodemon - recompila e reinicia automaticamente

### Iniciar com Hot Reload

```bash
npm start
```

Isso irá:
1. Compilar o código Electron uma vez
2. Iniciar Vite dev server (React)
3. Iniciar TypeScript em watch mode (Electron)
4. Iniciar Electron com Nodemon (reinicia quando Electron muda)

### O Que Você Pode Fazer

✅ **Editar React (src/renderer/)** - Hot reload instantâneo, sem reiniciar
✅ **Editar Electron (src/main/)** - Recompila automaticamente e reinicia app
✅ **Editar Services/Utils** - Hot reload instantâneo (usado pelo React)
✅ **Editar CSS** - Hot reload instantâneo

## 📦 Build Local

### Build Completo

```bash
npm run build
```

Compila:
- React → `dist/renderer/`
- Electron → `dist/main/`

### Criar Executável Portable

```bash
npm run dist
```

Gera: `release/CatanAnalyzer-1.0.0-portable.exe`

**Executável portable**:
- ✅ Não requer instalação
- ✅ Pode rodar de USB/pasta qualquer
- ✅ ~100-150MB (inclui Node.js e Electron)

## 🚀 Publicar no GitHub

### Opção 1: GitHub Actions (Recomendado)

#### Passo a Passo:

1. **Criar repositório no GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/SEU_USUARIO/catan-analyzer.git
   git push -u origin main
   ```

2. **Criar uma release com tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **GitHub Actions vai automaticamente**:
   - Fazer build no Windows
   - Criar o executável portable
   - Anexar na release

4. **Baixar o .exe**:
   - Vá em `https://github.com/SEU_USUARIO/catan-analyzer/releases`
   - Baixe `CatanAnalyzer-1.0.0-portable.exe`

#### Workflow já está configurado em:
`.github/workflows/build.yml`

### Opção 2: Build Manual e Upload

Se preferir fazer build localmente e só subir o .exe:

```bash
# Build local
npm run dist

# O .exe estará em:
# release/CatanAnalyzer-1.0.0-portable.exe

# Criar release manualmente no GitHub e anexar o arquivo
```

## 📤 Fluxo de Trabalho Completo

### Durante Desenvolvimento

```bash
# 1. Fazer mudanças nos arquivos
# 2. Ver mudanças aplicadas automaticamente
# 3. Testar na janela do Electron

# Commit quando pronto
git add .
git commit -m "Add feature X"
git push
```

### Criar Nova Versão

```bash
# 1. Atualizar versão no package.json
npm version patch  # 1.0.0 → 1.0.1
# ou
npm version minor  # 1.0.0 → 1.1.0
# ou
npm version major  # 1.0.0 → 2.0.0

# 2. Push com tag
git push && git push --tags

# 3. GitHub Actions cria a release automaticamente
# 4. Baixar .exe da página de releases
```

## 🎮 Testar com Catan Universe

### Setup para Teste

1. **Baixar o executável portable** da release
2. **Colocar em uma pasta** (ex: `C:\Games\CatanAnalyzer\`)
3. **Abrir Catan Universe** no Steam
4. **Executar** `CatanAnalyzer-1.0.0-portable.exe`
5. **Testar análise** durante uma partida

### Checklist de Teste

- [ ] App inicia sem erros
- [ ] Janela fica sempre no topo do jogo
- [ ] Captura de tela funciona
- [ ] OCR detecta números (após calibração)
- [ ] Análise mostra posições
- [ ] Estratégias são geradas
- [ ] Performance é aceitável (não trava jogo)

## 🔧 Troubleshooting de Build

### Erro: "electron-builder command not found"

```bash
npm install --save-dev electron-builder
```

### Erro: "NSIS error"

Use portable ao invés de NSIS (já configurado):
```bash
npm run dist
```

### Executável muito grande (>200MB)

Normal para apps Electron. Inclui:
- Node.js runtime (~50MB)
- Electron framework (~100MB)
- Suas dependências (~50MB)

Para reduzir:
- Remover devDependencies do build (já configurado)
- Usar asar para comprimir (electron-builder faz automaticamente)

### Erro ao executar o .exe

**"Windows protected your PC"**:
- Clique "More info" → "Run anyway"
- Ou: Assine o executável (requer certificado $$$)

**Antivirus bloqueia**:
- Adicione exceção
- Apps Electron sem assinatura podem ser flagados

## 📊 Tamanhos Esperados

| Item | Tamanho |
|------|---------|
| `dist/` (build) | ~2MB |
| `release/*.exe` | ~150MB |
| Executável extraído | ~200MB |

## 🎯 Resumo Rápido

### Desenvolvimento
```bash
npm start              # Hot reload full
# Edite arquivos e veja mudanças ao vivo
```

### Build Local
```bash
npm run dist           # Cria .exe portable
```

### Publicar GitHub
```bash
npm version patch      # Incrementa versão
git push --tags        # Triggera GitHub Actions
# Baixe .exe da release
```

### Testar no Jogo
```bash
# 1. Baixar .exe da release
# 2. Abrir Catan Universe
# 3. Rodar .exe
# 4. Clicar "Analyze Board"
```

---

**Status**: ✅ Configuração completa de dev e build
**Próximo**: Calibrar OCR com screenshots reais
