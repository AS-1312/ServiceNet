import { createPublicClient, createWalletClient, http, type PublicClient, type WalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import WebSocket from 'ws';

/**
 * Yellow Network configuration
 */
export interface YellowConfig {
  endpoint?: string;
  privateKey?: `0x${string}`;
  rpcUrl?: string;
  enableTestMode?: boolean;
}

/**
 * App Session definition for Yellow Network
 */
interface AppSessionDefinition {
  protocol: string;
  participants: string[];
  weights: number[];
  quorum: number;
  challenge: number;
  nonce: number;
}

/**
 * App Session state
 */
interface AppSessionState {
  sessionId: string;
  version: number;
  allocations: {
    participant: string;
    asset: string;
    amount: string;
  }[];
  status: 'open' | 'closed';
}

/**
 * Yellow Network Manager
 * Manages off-chain state channels for zero-gas API micropayments
 */
export class YellowManager {
  private ws: WebSocket | null = null;
  private publicClient: PublicClient | null = null;
  private walletClient: WalletClient | null = null;
  private providerAccount: ReturnType<typeof privateKeyToAccount> | null = null;
  private sessions: Map<string, AppSessionState> = new Map();
  private config: Required<YellowConfig>;
  private isConnected: boolean = false;
  
  constructor(config: YellowConfig) {
    // Default configuration with test mode enabled by default
    this.config = {
      endpoint: config.endpoint || 'wss://clearnet-sandbox.yellow.com/ws',
      privateKey: config.privateKey || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', // Hardhat test key
      rpcUrl: config.rpcUrl || 'https://eth-sepolia.g.alchemy.com/v2/demo',
      enableTestMode: config.enableTestMode !== false // Default to true (test mode)
    };
    
    // Only initialize blockchain clients if not in test mode
    if (!this.config.enableTestMode) {
      // Initialize account
      this.providerAccount = privateKeyToAccount(this.config.privateKey);
      
      // Initialize Viem clients
      this.publicClient = createPublicClient({
        chain: sepolia,
        transport: http(this.config.rpcUrl)
      });
      
      this.walletClient = createWalletClient({
        chain: sepolia,
        transport: http(this.config.rpcUrl),
        account: this.providerAccount
      });
    }
  }
  
  /**
   * Get provider address (mock in test mode)
   */
  private getProviderAddress(): string {
    if (this.config.enableTestMode) {
      // Use Hardhat test account #1 address
      return '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
    }
    return this.providerAccount!.address;
  }
  
  /**
   * Connect to Yellow Network ClearNode
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('[Yellow] Connecting to Yellow Network...');
      console.log(`[Yellow] Endpoint: ${this.config.endpoint}`);
      
      if (this.config.enableTestMode) {
        console.log('[Yellow] ⚠️  Test mode enabled - using mock Yellow Network');
        this.isConnected = true;
        resolve();
        return;
      }
      
      try {
        this.ws = new WebSocket(this.config.endpoint);
        
        this.ws.on('open', () => {
          console.log('[Yellow] ✅ Connected to Yellow Network');
          this.isConnected = true;
          resolve();
        });
        
        this.ws.on('message', (data) => {
          this.handleMessage(JSON.parse(data.toString()));
        });
        
        this.ws.on('error', (error) => {
          console.error('[Yellow] ❌ Connection error:', error.message);
          reject(error);
        });
        
        this.ws.on('close', () => {
          console.log('[Yellow] Disconnected from Yellow Network');
          this.isConnected = false;
        });
        
        // Timeout after 10 seconds
        setTimeout(() => {
          if (!this.isConnected) {
            reject(new Error('Connection timeout'));
          }
        }, 10000);
      } catch (error) {
        console.error('[Yellow] Failed to connect:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Create Yellow Network App Session
   * This creates an off-chain state channel for tracking API payments
   */
  async createAppSession(
    consumerAddress: string,
    initialAmount: bigint,
    asset: string = 'usdc'
  ): Promise<string> {
    const sessionId = this.generateSessionId();
    
    console.log('[Yellow] Creating App Session...');
    console.log(`[Yellow]   Session ID: ${sessionId}`);
    console.log(`[Yellow]   Consumer: ${consumerAddress}`);
    console.log(`[Yellow]   Provider: ${this.getProviderAddress()}`);
    console.log(`[Yellow]   Initial Amount: ${initialAmount.toString()}`);
    
    // Define app session with quorum governance
    const definition: AppSessionDefinition = {
      protocol: 'NitroRPC/0.4',
      participants: [consumerAddress, this.getProviderAddress()],
      weights: [50, 50], // Equal voting power
      quorum: 100,       // Both must agree (100%)
      challenge: 3600,   // 1 hour dispute window
      nonce: Date.now()
    };
    
    // Initial allocations (consumer has all funds, provider has none)
    const initialState: AppSessionState = {
      sessionId,
      version: 1,
      allocations: [
        {
          participant: consumerAddress,
          asset,
          amount: initialAmount.toString()
        },
        {
          participant: this.getProviderAddress(),
          asset,
          amount: '0'
        }
      ],
      status: 'open'
    };
    
    // Store session
    this.sessions.set(sessionId, initialState);
    
    if (this.config.enableTestMode) {
      console.log('[Yellow] ✅ App Session created (test mode)');
      return sessionId;
    }
    
    // Send to Yellow Network
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify({
        type: 'create_app_session',
        definition,
        allocations: initialState.allocations
      }));
    }
    
    console.log('[Yellow] ✅ App Session created');
    return sessionId;
  }
  
  /**
   * Update App Session state after an API call
   * This updates the off-chain allocation between consumer and provider
   */
  async updateState(
    yellowSessionId: string,
    callCost: bigint
  ): Promise<void> {
    const session = this.sessions.get(yellowSessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }
    
    if (session.status !== 'open') {
      throw new Error('Session is not open');
    }
    
    // Calculate new allocations
    const consumerAllocation = session.allocations[0];
    const providerAllocation = session.allocations[1];
    
    const currentConsumerAmount = BigInt(consumerAllocation.amount);
    const currentProviderAmount = BigInt(providerAllocation.amount);
    
    // Transfer from consumer to provider
    const newConsumerAmount = currentConsumerAmount - callCost;
    const newProviderAmount = currentProviderAmount + callCost;
    
    if (newConsumerAmount < 0n) {
      throw new Error('Insufficient balance');
    }
    
    // Update session state
    session.version += 1;
    session.allocations = [
      {
        participant: consumerAllocation.participant,
        asset: consumerAllocation.asset,
        amount: newConsumerAmount.toString()
      },
      {
        participant: providerAllocation.participant,
        asset: providerAllocation.asset,
        amount: newProviderAmount.toString()
      }
    ];
    
    // Store updated state
    this.sessions.set(yellowSessionId, session);
    
    console.log(`[Yellow] State updated v${session.version}: Consumer ${this.formatUSDC(newConsumerAmount)}, Provider ${this.formatUSDC(newProviderAmount)}`);
    
    // Send to Yellow Network (off-chain state update - 0 gas!)
    if (this.ws && this.isConnected && !this.config.enableTestMode) {
      this.ws.send(JSON.stringify({
        type: 'submit_app_state',
        sessionId: yellowSessionId,
        version: session.version,
        allocations: session.allocations
      }));
    }
  }
  
  /**
   * Close Yellow App Session
   * Returns final settlement amounts for on-chain transaction
   */
  async closeAppSession(yellowSessionId: string): Promise<{
    consumerRefund: bigint;
    providerPayment: bigint;
  }> {
    const session = this.sessions.get(yellowSessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }
    
    // Get final amounts
    const consumerAmount = BigInt(session.allocations[0].amount);
    const providerAmount = BigInt(session.allocations[1].amount);
    
    console.log('[Yellow] Closing App Session...');
    console.log(`[Yellow]   Final Consumer Balance: ${this.formatUSDC(consumerAmount)}`);
    console.log(`[Yellow]   Final Provider Balance: ${this.formatUSDC(providerAmount)}`);
    
    // Mark as closed
    session.status = 'closed';
    this.sessions.set(yellowSessionId, session);
    
    // Send close message to Yellow Network
    if (this.ws && this.isConnected && !this.config.enableTestMode) {
      this.ws.send(JSON.stringify({
        type: 'close_app_session',
        sessionId: yellowSessionId,
        finalAllocations: session.allocations
      }));
    }
    
    console.log('[Yellow] ✅ App Session closed');
    
    return {
      consumerRefund: consumerAmount,
      providerPayment: providerAmount
    };
  }
  
  /**
   * Get App Session state
   */
  getSessionState(yellowSessionId: string): AppSessionState | undefined {
    return this.sessions.get(yellowSessionId);
  }
  
  /**
   * Check if session is active
   */
  isSessionActive(yellowSessionId: string): boolean {
    const session = this.sessions.get(yellowSessionId);
    return session?.status === 'open';
  }
  
  /**
   * Handle incoming messages from Yellow Network
   */
  private handleMessage(message: any): void {
    console.log('[Yellow] Received message:', message.type);
    
    switch (message.type) {
      case 'session_created':
        console.log('[Yellow] ✅ Session confirmed by network');
        break;
      case 'session_message':
        console.log('[Yellow] 📨 App message received');
        break;
      case 'error':
        console.error('[Yellow] ❌ Error:', message.error);
        break;
    }
  }
  
  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return '0x' + Date.now().toString(16).padStart(64, '0');
  }
  
  /**
   * Format USDC amount for display
   */
  private formatUSDC(amount: bigint): string {
    return `$${(Number(amount) / 1_000_000).toFixed(6)}`;
  }
  
  /**
   * Disconnect from Yellow Network
   */
  async disconnect(): Promise<void> {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    console.log('[Yellow] Disconnected');
  }
  
  /**
   * Get connection status
   */
  get connected(): boolean {
    return this.isConnected;
  }
}
