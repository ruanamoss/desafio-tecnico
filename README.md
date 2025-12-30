# Desafio — Automação Web com Playwright (POC)

Projeto de prova de conceito (POC) para automação de testes do ParaBank (Parasoft).

## Pré-requisitos

- Node.js versão 16 ou superior instalado (verifique com `node --version`)
- NPM instalado (vem com Node.js)
- Git para versionamento (opcional, mas recomendado)

## Instalação

1. Clone ou baixe o repositório:
   ```bash
   git clone https://github.com/ruanamoss/desafio-tecnico.git
   cd desafio-tecnico
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Instale os browsers do Playwright:
   ```bash
   npx playwright install
   ```

## Como Executar

### Executar todos os testes
```bash
npm test
```

### Executar testes específicos
```bash
# Apenas register
npm test -- --grep "Register"

# Apenas login
npm test -- --grep "Login"

# Apenas accounts
npm test -- --grep "Accounts"

# Apenas transfer
npm test -- --grep "Transfer"
```

### Executar em browser específico
```bash
# Apenas Chromium
npm test -- --project=chromium

# Apenas Firefox
npm test -- --project=firefox

# Apenas WebKit (Safari)
npm test -- --project=webkit
```

### Ver relatório HTML
Após execução, abra o relatório:
```bash
npx playwright show-report
```

## Decisões Técnicas

- **Linguagem:** TypeScript para tipagem forte e melhor manutenção.
- **Framework:** Playwright Test para automação web robusta e cross-browser.
- **Arquitetura:** Page Object Model (POM) para separação de responsabilidades e reutilização.
- **Configuração:**
  - Workers: 1 (single-threaded) para evitar conflitos de browser.
  - Timeouts: Aumentados (actionTimeout: 10s, navigationTimeout: 30s) devido à latência do site demo.
  - User Agent: Simulado como Chrome para evitar detecção de bot.
- **Estrutura de Pastas:**
  - `tests/pages/`: Classes POM (BasePage, HomePage, RegisterPage, etc.)
  - `tests/specs/`: Arquivos de teste agrupados por funcionalidade.
  - `tests/utils/`: Utilitários para geração de dados de teste.
- **Seletores:** Baseados em atributos name/id do HTML do ParaBank, priorizando robustez.
- **Gestão de Dados:** Usuários únicos gerados dinamicamente para evitar conflitos.

## Suposições

- O site ParaBank mantém a estrutura HTML atual (seletores podem precisar ajuste se mudar).
- O site permite automação básica, mas pode ter limitações (rate limiting, proteção anti-bot).
- Browsers headless funcionam; use `--headed` se necessário para debug.
- Conexão estável com internet para acessar https://parabank.parasoft.com/parabank.

## Cenários de Teste Implementados

### Cadastro (Register) - 5 cenários
- CT-001: Cadastro com sucesso
- CT-002: Campos obrigatórios vazios
- CT-003: Senha e confirmação diferentes
- CT-004: Username já existente
- CT-005: Zip Code inválido

### Login - 4 cenários
- CT-006: Login com sucesso
- CT-007: Senha incorreta
- CT-008: Usuário inexistente
- CT-009: Campos vazios

### Contas (Accounts) - 3 cenários
- CT-010: Abrir conta Savings
- CT-011: Abrir conta Checking
- CT-012: Accounts Overview

### Transferências (Transfer) - 3 cenários
- CT-013: Transferência com sucesso
- CT-014: Valor vazio
- CT-015: Valor inválido

## Limitações e Observações

- Alguns testes podem falhar devido a proteção anti-automação do site demo (ex.: browser fechado após registro/login).
- Execute testes individualmente se houver falhas em lote.
- Para CI/CD, adicione `CI=true` para retries automáticos.
- Relatórios salvos em `playwright-report/` e `test-results/`.

## Estrutura do Projeto

```
desafio-tecnico/
├── tests/
│   ├── pages/          # Page Object Model classes
│   ├── specs/          # Test specifications
│   └── utils/          # Test utilities
├── playwright.config.ts # Playwright configuration
├── tsconfig.json       # TypeScript configuration
├── package.json        # Dependencies and scripts
└── README.md           # This file
```
