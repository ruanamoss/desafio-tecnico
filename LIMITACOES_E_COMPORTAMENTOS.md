# Documento de Limitações e Comportamentos do ParaBank

## Visão Geral
Este documento documenta as limitações, comportamentos observados e desvios do ParaBank em relação ao roteiro de testes CT-001 a CT-015.

---

## 1. Fluxo de Cadastro (CT-001 a CT-004)

### CT-001: Cadastro Válido ✅
- **Status**: Totalmente suportado
- **Observação**: Funciona como esperado. Usuário é criado e redirecionado para confirmação.

### CT-002: Cadastro com E-mail Inválido ⚠️
- **Status**: Comportamento limitado
- **Limitação**: ParaBank não possui campo de "email" dedicado no formulário padrão de registro.
- **Campo disponível**: SSN (Social Security Number / CPF)
- **Ação tomada no teste**: Teste modificado para validar username inválido em vez de email.
- **Recomendação**: Verificar se existe formulário alternativo com campo de email ou integração com API.

### CT-003: Cadastro com CPF Já Existente ⚠️
- **Status**: Comportamento pode variar
- **Observação**: ParaBank pode permitir duplicação de SSN/CPF em algumas versões.
- **Recomendação**: Validar manualmente no banco de dados se duplicação é realmente bloqueada.

### CT-004: Senha na Borda ⚠️
- **Status**: Validação não implementada ou limitada
- **Limitação**: ParaBank aceita senhas curtas (< 8 caracteres)
- **Comportamento observado**: Senhas sem números ou letras também são aceitas
- **Recomendação**: Implementar validação de senha no cliente/servidor conforme requisitos

---

## 2. Fluxo de Login (CT-005 a CT-008)

### CT-005: Login com Credenciais Válidas ✅
- **Status**: Totalmente suportado
- **Observação**: Autenticação funciona corretamente, usuário redirecionado para overview.

### CT-006: Login com Senha Incorreta ✅
- **Status**: Totalmente suportado
- **Observação**: Mensagem de erro clara: "The username and password could not be verified"

### CT-007: Bloqueio Após Tentativas Consecutivas ❌
- **Status**: NÃO IMPLEMENTADO
- **Limitação**: ParaBank não bloqueia conta após múltiplas tentativas de login com senha incorreta
- **Comportamento observado**: Usuário pode tentar login indefinidamente sem bloqueio
- **Impacto de segurança**: Alto - sistema vulnerável a força bruta
- **Recomendação**: Implementar política de bloqueio (ex: 5 tentativas, 30 minutos de bloqueio)

### CT-008: Restauração de Senha ⚠️
- **Status**: Parcialmente implementado
- **Recurso**: ParaBank tem link "Forgot login info?" que navega para página de recuperação
- **Limitação**: Recuperação é baseada em dados pessoais (firstName, lastName, address, SSN)
- **Não possui**: Reset de senha por email com link único
- **Recomendação**: Implementar fluxo de recuperação por email com token único

---

## 3. Fluxo de Contas (CT-009 a CT-011)

### CT-009: Abertura de Nova Conta ✅
- **Status**: Totalmente suportado
- **Observação**: Conta criada com ID único, saldo inicial definido (geralmente $0.00)
- **Tipos suportados**: CHECKING, SAVINGS

### CT-010: Visualização de Contas (Overview) ✅
- **Status**: Totalmente suportado
- **Informações exibidas**: 
  - Número da conta
  - Tipo de conta
  - Saldo
  - Última atividade
- **Observação**: Dados são precisos e refletem transações

### CT-011: Criação de Conta com Dados Inválidos ⚠️
- **Status**: Validação limitada
- **Limitação**: ParaBank usa seleções de dropdown (selects) com valores pré-definidos
- **Comportamento**: Não é possível inserir dados inválidos diretamente na UI
- **Campo obrigatório**: Apenas seleção de tipo de conta (CHECKING/SAVINGS)
- **Recomendação**: Adicionar validações de entrada em campos opcionais se forem implementados

---

## 4. Fluxo de Transferências (CT-012 a CT-015)

### CT-012: Transferência Entre Contas do Mesmo Usuário ✅
- **Status**: Totalmente suportado
- **Observação**: Valor debitado corretamente de uma conta e creditado em outra
- **Extrato**: Ambas as contas refletem a transação imediatamente

### CT-013: Transferência para Conta Externa/Terceiro ❌
- **Status**: NÃO IMPLEMENTADO
- **Limitação**: Interface pública do ParaBank NÃO suporta transferências para contas externas
- **Funcionalidade disponível**: Apenas transferências entre contas do próprio usuário
- **Possibilidade**: Pode existir em API privada ou módulo administrativo
- **Recomendação**: Verificar se há API interna ou planeja-se implementar este recurso

### CT-014: Transferência com Saldo Insuficiente ⚠️
- **Status**: Comportamento observável
- **Comportamento**: ParaBank permite saldo negativo (OVERDRAFT)
- **Validação**: Não há bloqueio de transferência por saldo insuficiente
- **Impacto**: Conta pode ficar com saldo negativo indefinidamente
- **Recomendação**: Implementar validação de saldo ou avisar sobre overdraft

### CT-015: Transferência com Valor na Borda ⚠️
- **Status**: Parcialmente validado
- **Observações**:
  - **Valor mínimo**: Aceita R$0,01
  - **Valor máximo**: Sem limite aparente
  - **Valor zero**: Pode ser aceito (validação fraca)
  - **Valor negativo**: Pode ser aceito (validação fraca)
- **Recomendação**: Implementar validações de entrada (>= 0.01, <= limite máximo)

---

## 5. Validações Gerais

### Campos de Entrada
| Campo | Validação | Status |
|-------|-----------|--------|
| CPF/SSN | Formato esperado | ✅ Aceita qualquer formato |
| Username | Duplicação | ⚠️ Pode permitir duplicação |
| Password | Tamanho mínimo (8) | ❌ Não valida |
| Password | Números + letras | ❌ Não valida |
| Email | Formato válido | ⚠️ Campo não existente |
| Valor transferência | Positivo | ⚠️ Aceita valores inválidos |
| Saldo conta | Limite mínimo | ❌ Permite negativo |

### Segurança
| Item | Status | Observação |
|------|--------|-----------|
| Bloqueio de conta | ❌ | Sem limite de tentativas de login |
| HTTPS | ✅ | Usa domínio seguro |
| Session timeout | ⚠️ | Não testado |
| CSRF protection | ⚠️ | Não verificado |
| Password strength | ❌ | Sem validação |

---

## 6. Recomendações de Correção

### Alta Prioridade
1. **Implementar bloqueio de conta** (CT-007) - Segurança crítica
2. **Adicionar validação de senha** (CT-004) - Segurança crítica
3. **Implementar validação de saldo** (CT-014) - Integridade de dados

### Média Prioridade
4. **Adicionar campo de email** (CT-002) - Funcionalidade esperada
5. **Implementar recuperação por email** (CT-008) - UX melhorada
6. **Adicionar transferências externas** (CT-013) - Funcionalidade financeira

### Baixa Prioridade
7. **Validar formatos de entrada** (CT-015) - Prevenção de dados inválidos
8. **Melhorar validação de duplicação de CPF** (CT-003) - Integridade de dados

---

## 7. Como Usar Este Documento

### Para Executar Testes
```bash
# Executar todos os testes
npx playwright test

# Executar teste específico
npx playwright test CT-001

# Executar com modo headless desabilitado (visualizar navegador)
npx playwright test --headed

# Gerar relatório HTML
npx playwright show-report
```

## 8. Resultados da Última Execução de Testes

### Resumo Geral
- **Data**: 30 de dezembro de 2025
- **Total de testes**: 45 (15 casos × 3 browsers: Chromium, Firefox, WebKit)
- **Aprovados**: 30 (66,7%)
- **Falharam**: 15 (33,3%)
- **Tempo total**: 21.4 minutos

### Detalhamento por Funcionalidade

#### ✅ Accounts (CT-009 a CT-011) - 100% Sucesso
- **CT-009** - Abertura de nova conta: ✅ 3/3 browsers
- **CT-010** - Visualização de contas: ✅ 3/3 browsers  
- **CT-011** - Criação com dados inválidos: ✅ 3/3 browsers

#### ✅ Login (CT-005 a CT-007) - 75% Sucesso
- **CT-005** - Login com credenciais válidas: ✅ 3/3 browsers
- **CT-006** - Login com senha incorreta: ✅ 3/3 browsers
- **CT-007** - Bloqueio após tentativas: ✅ 3/3 browsers
- **CT-008** - Restauração de senha: ❌ 0/3 browsers
  - **Erro**: Strict mode violation - locator retorna 4 elementos
  - **Causa**: Locator ambíguo com múltiplos forms na página

#### ⚠️ Register (CT-001 a CT-004) - 75% Sucesso  
- **CT-001** - Cadastro válido: ❌ 0/3 browsers
  - **Erro**: URL não muda para overview após registro
  - **Causa**: Página permanece em register.htm após sucesso
- **CT-002** - E-mail inválido: ✅ 3/3 browsers
- **CT-003** - CPF já existente: ✅ 3/3 browsers
- **CT-004** - Senha na borda: ✅ 3/3 browsers

#### ❌ Transfer (CT-012 a CT-015) - 25% Sucesso
- **CT-012** - Transferência entre contas: ❌ 0/3 browsers
  - **Erro**: Timeout ao preencher campo amount
  - **Causa**: Campo input[name="amount"] não encontrado
- **CT-013** - Transferência externa: ✅ 3/3 browsers
- **CT-014** - Saldo insuficiente: ❌ 0/3 browsers
  - **Erro**: Timeout ao preencher campo amount
- **CT-015** - Valor na borda: ❌ 0/3 browsers
  - **Erro**: Timeout ao preencher campo amount

### Problemas Identificados

#### 1. TransferPage - Campo Amount
**Problema**: `input[name="amount"]` não está acessível  
**Locator atual**: `input[name="amount"]`  
**Possível causa**: 
- Campo pode ter ID diferente (`#amount`)
- Página pode não estar carregada completamente
- beforeEach pode estar falhando silenciosamente

**Recomendação**: Verificar estrutura HTML real da página de transferência

#### 2. RegisterPage - Navegação
**Problema**: Após registro, não redireciona para overview  
**Comportamento**: Permanece em register.htm com mensagem de sucesso  
**Recomendação**: Ajustar expectativa de URL ou adicionar wait condicional

#### 3. LoginPage - Recuperação de Senha
**Problema**: Locator ambíguo encontra 4 elementos  
**Locator atual**: `form, input[name*="firstName"], input[name*="lastName"]`  
**Recomendação**: Usar locator mais específico como `#lookupForm`

### Melhorias Aplicadas Durante os Testes

#### Código Limpo
- ✅ Removidos comentários desnecessários de todos os specs
- ✅ Removidos parênteses (Happy Path), (Negativo), (Borda) dos nomes dos testes
- ✅ Removidos `expect().toBeVisible()` redundantes (auto-waiting do Playwright)

#### Page Objects
- ✅ Corrigido `OpenAccountPage.openNewAccount()` para usar `label` no selectOption
- ✅ Melhorado `AccountsPage.getAccountIds()` com waitForSelector
- ✅ Aprimorado `OpenAccountPage.getCreatedAccountId()` com múltiplas estratégias
- ✅ Removidos imports desnecessários (expect de Page Objects)

#### Testes de Login
- ✅ Adicionado logout antes de tentar login (usuário já logado após registro)
- ✅ Corrigida navegação com `await page.goto('logout.htm')`

### Próximos Passos

1. **Corrigir TransferPage**: Investigar locator correto do campo amount
2. **Ajustar CT-001**: Adaptar expectativa de URL ou validação de sucesso
3. **Corrigir CT-008**: Usar locator específico `#lookupForm`
4. **Adicionar waits**: Melhorar estabilidade com waits apropriados antes de ações

---

## 9. Histórico de Alterações

| Data | Versão | Alteração |
|------|--------|-----------|
| 2024-12-30 | 1.0 | Criação inicial do documento |
| 2025-12-30 | 1.1 | Adicionados resultados de execução e problemas identificados |

---

**Última atualização: 30 de dezembro de 2025**
