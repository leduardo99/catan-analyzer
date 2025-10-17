# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2025-10-17

### Adicionado
- ✨ Aplicação desktop Electron + React + TypeScript
- 🎯 Interface overlay transparente e arrastável
- 📸 Sistema de captura de tela
- 🔍 Serviço OCR com Tesseract.js
- 🎲 Motor de análise de probabilidades do Catan
- 💡 Sistema de sugestões estratégicas
- 🎨 UI moderna com tema dark
- 🔄 Hot reload completo (React + Electron)
- 🏗️ Pipeline de build automatizado
- 🤖 GitHub Actions para releases automáticas
- 📚 Documentação completa

### Funcionalidades Principais
- Análise de posições de assentamentos
- Cálculo de probabilidades baseado em dados
- Sugestões de estratégia (settlements, cities, trades, dev cards)
- Overlay sempre no topo do jogo
- Sistema de mock data para testes
- Build portable (não requer instalação)

### Documentação
- README.md - Overview geral
- QUICKSTART.md - Início rápido
- USAGE.md - Guia detalhado de uso
- DESENVOLVIMENTO.md - Guia de desenvolvimento
- BUILD.md - Guia de build e distribuição
- RELEASE.md - Como fazer releases no GitHub
- PROJECT_SUMMARY.md - Visão técnica completa

### Tecnologias
- Electron 28.0.0
- React 18.2.0
- TypeScript 5.3.3
- Vite 5.0.8
- Tesseract.js 5.0.4
- screenshot-desktop 1.15.0

## [Unreleased]

### Planejado
- [ ] Calibração do OCR com screenshots reais do Catan Universe
- [ ] Detecção de cores para identificar recursos
- [ ] Detecção de portos (2:1 e 3:1)
- [ ] Tracking de assentamentos e cidades dos oponentes
- [ ] Histórico de análises
- [ ] Estatísticas de partida
- [ ] Visualização do tabuleiro
- [ ] Suporte para expansões do Catan
- [ ] Modo de análise pós-jogo
- [ ] Exportar análises (CSV/JSON)

### Em Consideração
- [ ] Machine learning para melhorar detecção
- [ ] Suporte para múltiplos monitores
- [ ] Integração com API do Catan Universe (se disponível)
- [ ] Modo tutorial interativo
- [ ] Temas de UI customizáveis
- [ ] Ícone customizado da aplicação

---

## Guia de Versionamento

### Tipos de Mudança
- **Adicionado** - Novas funcionalidades
- **Modificado** - Mudanças em funcionalidades existentes
- **Descontinuado** - Funcionalidades que serão removidas
- **Removido** - Funcionalidades removidas
- **Corrigido** - Correções de bugs
- **Segurança** - Correções de vulnerabilidades

### Semantic Versioning
- **MAJOR** (X.0.0) - Mudanças incompatíveis na API
- **MINOR** (0.X.0) - Novas funcionalidades compatíveis
- **PATCH** (0.0.X) - Correções de bugs compatíveis

### Exemplo de Uso
```bash
# Bug fix
npm version patch  # 1.0.0 → 1.0.1

# Nova feature
npm version minor  # 1.0.0 → 1.1.0

# Breaking change
npm version major  # 1.0.0 → 2.0.0
```
