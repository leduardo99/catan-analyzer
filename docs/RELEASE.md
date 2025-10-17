# Como Fazer Release no GitHub

## Setup Inicial (Uma Vez)

### 1. Criar Repositório no GitHub

1. Vá em https://github.com/new
2. Nome: `catan-analyzer`
3. Descrição: `Real-time Catan Universe game analyzer with overlay`
4. Público ou Privado (sua escolha)
5. **NÃO** inicialize com README (já temos)
6. Criar repositório

### 2. Conectar Repo Local

```bash
cd "C:\Users\luis.albuquerque\source\repos\Personal\catan-ocr"

# Inicializar git (se ainda não fez)
git init

# Adicionar todos os arquivos
git add .

# Primeiro commit
git commit -m "Initial commit: Catan Analyzer v1.0.0"

# Conectar com GitHub (SUBSTITUA SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/catan-analyzer.git

# Push
git branch -M main
git push -u origin main
```

## Fazer Uma Release

### Opção A: Automática (GitHub Actions)

```bash
# 1. Fazer mudanças e commit
git add .
git commit -m "Fix: correção de bug X"

# 2. Criar tag de versão
git tag v1.0.0

# 3. Push com tags
git push origin main
git push origin v1.0.0

# 4. GitHub Actions faz o build automaticamente
# 5. Espere ~5 minutos
# 6. Vá em https://github.com/SEU_USUARIO/catan-analyzer/releases
# 7. Baixe CatanAnalyzer-1.0.0-portable.exe
```

### Opção B: Manual (Build Local)

```bash
# 1. Build local
npm run dist

# 2. Arquivo gerado: release/CatanAnalyzer-1.0.0-portable.exe

# 3. No GitHub:
#    - Vá em "Releases" → "Create a new release"
#    - Tag: v1.0.0
#    - Title: "Catan Analyzer v1.0.0"
#    - Descrição: "Initial release..."
#    - Anexar o .exe
#    - Publish release
```

## Incrementar Versão

```bash
# Patch (1.0.0 → 1.0.1) - bug fixes
npm version patch

# Minor (1.0.0 → 1.1.0) - new features
npm version minor

# Major (1.0.0 → 2.0.0) - breaking changes
npm version major

# Isso atualiza package.json e cria git tag automaticamente
git push && git push --tags
```

## Verificar Status da Build

1. Vá em: `https://github.com/SEU_USUARIO/catan-analyzer/actions`
2. Clique no workflow mais recente
3. Veja logs de build
4. Se tudo OK, a release será criada automaticamente

## Download do Executável

### Para Você Mesmo
```
https://github.com/SEU_USUARIO/catan-analyzer/releases/latest
```

### Para Outras Pessoas
Compartilhe o link acima. Elas podem baixar o .exe diretamente.

## Estrutura de Versões

Use [Semantic Versioning](https://semver.org/):

- **v1.0.0**: Release inicial
- **v1.0.1**: Bug fix (OCR melhorado)
- **v1.1.0**: Nova feature (detecção de portos)
- **v2.0.0**: Breaking change (nova UI completa)

## Exemplo de Workflow Completo

```bash
# Dia 1: Criar repo e primeira release
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU_USUARIO/catan-analyzer.git
git push -u origin main
git tag v1.0.0
git push origin v1.0.0

# [GitHub Actions builda automaticamente]
# [Baixe o .exe e teste]

# Dia 2: Fazer melhorias
# [Edite código]
git add .
git commit -m "Improve OCR accuracy"
npm version patch  # v1.0.0 → v1.0.1
git push && git push --tags

# [Nova build automática]
# [Baixe nova versão e teste]

# Dia 3: Nova feature
# [Adicione feature]
git add .
git commit -m "Add port detection"
npm version minor  # v1.0.1 → v1.1.0
git push && git push --tags
```

## Troubleshooting

### GitHub Actions falha

**Erro comum**: Permissões

Vá em: `Settings` → `Actions` → `General` → `Workflow permissions`
- Marque: "Read and write permissions"
- Save

### Tag já existe

```bash
# Deletar tag local e remota
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0

# Criar novamente
git tag v1.0.0
git push origin v1.0.0
```

### Build local funciona, GitHub Actions falha

Verifique:
- Node version no workflow (18)
- Dependências instaladas corretamente
- Logs do Actions para ver erro específico

## Resumo dos Comandos

```bash
# Setup inicial (uma vez)
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU_USUARIO/catan-analyzer.git
git push -u origin main

# Release (toda vez que quiser nova versão)
git add .
git commit -m "Descrição das mudanças"
npm version patch  # ou minor, ou major
git push && git push --tags

# Baixar .exe
# https://github.com/SEU_USUARIO/catan-analyzer/releases/latest
```

---

**Tempo estimado**:
- Setup inicial: 5 minutos
- Cada release: 1 minuto + 5 minutos de build
