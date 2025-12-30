/**
 * Utilidades para validação de dados em banco de dados
 * 
 * NOTA IMPORTANTE: Este arquivo foi criado como suporte para possíveis validações de banco de dados.
 * Para usar estas funções, você precisará:
 * 1. Configurar credenciais de banco de dados
 * 2. Instalar driver de banco de dados apropriado
 * 3. Ajustar queries conforme o banco de dados do ParaBank (geralmente PostgreSQL ou similar)
 */

/**
 * Interface para usuário no banco de dados
 */
export interface DatabaseUser {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  ssn: string;
  createdAt?: Date;
}

/**
 * Interface para conta no banco de dados
 */
export interface DatabaseAccount {
  id: string;
  userId?: number;
  accountType: string;
  balance: number;
  createdAt?: Date;
}

/**
 * Interface para transação no banco de dados
 */
export interface DatabaseTransaction {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  type: string;
  createdAt?: Date;
}

/**
 * Validador de usuário em banco de dados
 * 
 * Exemplo de uso (quando banco de dados estiver configurado):
 * 
 * const validator = new DatabaseValidator();
 * const user = await validator.getUserByUsername('testuser');
 * expect(user).toBeTruthy();
 * expect(user.ssn).toBe('123-45-6789');
 */
export class DatabaseValidator {
  private connectionString?: string;

  constructor(connectionString?: string) {
    this.connectionString = connectionString;
  }

  /**
   * Obter usuário por username
   * @param username - Username para buscar
   * @returns Usuário encontrado ou null
   */
  async getUserByUsername(username: string): Promise<DatabaseUser | null> {
    // Implementação pendente - conectar ao banco de dados
    console.log(`[DB_VALIDATION] Buscando usuário: ${username}`);
    console.log('[DB_VALIDATION] Função de validação de banco de dados não configurada');
    return null;
  }

  /**
   * Obter usuário por SSN/CPF
   * @param ssn - SSN/CPF para buscar
   * @returns Usuário encontrado ou null
   */
  async getUserBySSN(ssn: string): Promise<DatabaseUser | null> {
    console.log(`[DB_VALIDATION] Buscando usuário por SSN: ${ssn}`);
    console.log('[DB_VALIDATION] Função de validação de banco de dados não configurada');
    return null;
  }

  /**
   * Obter contas do usuário
   * @param userId - ID do usuário
   * @returns Lista de contas do usuário
   */
  async getAccountsByUserId(userId: number): Promise<DatabaseAccount[]> {
    console.log(`[DB_VALIDATION] Buscando contas do usuário: ${userId}`);
    console.log('[DB_VALIDATION] Função de validação de banco de dados não configurada');
    return [];
  }

  /**
   * Obter conta por ID
   * @param accountId - ID da conta
   * @returns Conta encontrada ou null
   */
  async getAccountById(accountId: string): Promise<DatabaseAccount | null> {
    console.log(`[DB_VALIDATION] Buscando conta: ${accountId}`);
    console.log('[DB_VALIDATION] Função de validação de banco de dados não configurada');
    return null;
  }

  /**
   * Obter saldo da conta
   * @param accountId - ID da conta
   * @returns Saldo da conta
   */
  async getAccountBalance(accountId: string): Promise<number | null> {
    console.log(`[DB_VALIDATION] Buscando saldo da conta: ${accountId}`);
    console.log('[DB_VALIDATION] Função de validação de banco de dados não configurada');
    return null;
  }

  /**
   * Obter transações de uma conta
   * @param accountId - ID da conta
   * @param limit - Número máximo de registros a retornar
   * @returns Lista de transações
   */
  async getAccountTransactions(accountId: string, limit: number = 10): Promise<DatabaseTransaction[]> {
    console.log(`[DB_VALIDATION] Buscando transações da conta: ${accountId}`);
    console.log('[DB_VALIDATION] Função de validação de banco de dados não configurada');
    return [];
  }

  /**
   * Verificar se usuário foi criado
   * @param username - Username para verificar
   * @returns true se usuário existe
   */
  async userExists(username: string): Promise<boolean> {
    const user = await this.getUserByUsername(username);
    return !!user;
  }

  /**
   * Verificar se conta foi criada
   * @param accountId - ID da conta para verificar
   * @returns true se conta existe
   */
  async accountExists(accountId: string): Promise<boolean> {
    const account = await this.getAccountById(accountId);
    return !!account;
  }

  /**
   * Verificar se transação foi criada
   * @param fromAccountId - Conta origem
   * @param toAccountId - Conta destino
   * @param amount - Valor transferido
   * @returns true se transação existe
   */
  async transactionExists(fromAccountId: string, toAccountId: string, amount: number): Promise<boolean> {
    const transactions = await this.getAccountTransactions(fromAccountId);
    return transactions.some(t => 
      t.toAccountId === toAccountId && 
      t.amount === amount &&
      t.type === 'transfer'
    );
  }
}

/**
 * Factory para criar validador com retry automático
 */
export class DatabaseValidatorWithRetry extends DatabaseValidator {
  private maxRetries: number = 3;
  private retryDelayMs: number = 1000;

  constructor(connectionString?: string, maxRetries: number = 3, retryDelayMs: number = 1000) {
    super(connectionString);
    this.maxRetries = maxRetries;
    this.retryDelayMs = retryDelayMs;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Executar função com retry automático
   */
  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    attempt: number = 0
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (attempt < this.maxRetries) {
        console.log(`[DB_VALIDATION] Retry ${attempt + 1}/${this.maxRetries} após ${this.retryDelayMs}ms`);
        await this.sleep(this.retryDelayMs);
        return this.executeWithRetry(fn, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Obter usuário com retry
   */
  async getUserByUsernameWithRetry(username: string): Promise<DatabaseUser | null> {
    return this.executeWithRetry(() => super.getUserByUsername(username));
  }

  /**
   * Obter conta com retry
   */
  async getAccountByIdWithRetry(accountId: string): Promise<DatabaseAccount | null> {
    return this.executeWithRetry(() => super.getAccountById(accountId));
  }
}
