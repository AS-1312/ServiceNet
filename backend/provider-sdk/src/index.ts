import express, { Request, Response, NextFunction } from 'express';
import { verifyMessage, parseUnits } from 'viem';
import cors from 'cors';
import { YellowManager, type YellowConfig } from './yellow';

export interface ServiceNetSDKConfig {
  ensName: string;
  pricePerCall: number; // USDC (e.g., 0.001)
  apiEndpoint?: string;
  enableCors?: boolean;
  enableYellow?: boolean;
  yellowConfig?: YellowConfig;
}

export { YellowManager, type YellowConfig };

// Extend Express Request type
interface AuthenticatedRequest extends Request {
  sessionId?: string;
  consumerAddress?: string;
  yellowSessionId?: string;
  onChainSessionId?: string;
}

export class ServiceNetSDK {
  private app: express.Application;
  private config: ServiceNetSDKConfig;
  private callCounts: Map<string, number>; // sessionId -> call count
  private sessionSpent: Map<string, number>; // sessionId -> total spent
  private yellowManager?: YellowManager;
  private yellowSessionMap: Map<string, string>; // onChainSessionId -> yellowSessionId
  
  constructor(config: ServiceNetSDKConfig) {
    this.app = express();
    this.config = config;
    this.callCounts = new Map();
    this.sessionSpent = new Map();
    this.yellowSessionMap = new Map();
    
    // Default middleware
    this.app.use(express.json());
    
    if (config.enableCors !== false) {
      this.app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'x-session-id', 'x-session-signature', 'x-consumer-address']
      }));
    }
    
    // Initialize Yellow Network if enabled
    if (config.enableYellow && config.yellowConfig) {
      this.initializeYellow(config.yellowConfig);
    }
  }
  
  /**
   * Initialize Yellow Network connection
   */
  private async initializeYellow(config: YellowConfig): Promise<void> {
    try {
      console.log('[ServiceNet SDK] Initializing Yellow Network...');
      this.yellowManager = new YellowManager(config);
      await this.yellowManager.connect();
      console.log('[ServiceNet SDK] ✅ Yellow Network ready');
    } catch (error) {
      console.error('[ServiceNet SDK] ⚠️  Yellow Network error:', error instanceof Error ? error.message : error);
      console.warn('[ServiceNet SDK] ⚠️  Yellow Network unavailable, using fallback');
      this.yellowManager = undefined;
    }
  }
  
  /**
   * Middleware: Verify session signature
   * For MVP: Simple signature verification
   * Consumer signs: "ServiceNet Session: {sessionId}"
   */
  authenticate() {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const sessionId = req.headers['x-session-id'] as string;
      const sessionSignature = req.headers['x-session-signature'] as string;
      const consumerAddress = req.headers['x-consumer-address'] as string;
      
      if (!sessionId || !sessionSignature || !consumerAddress) {
        return res.status(402).json({
          error: 'Payment required',
          message: 'Missing session credentials. Please open a session first.',
          hint: 'Required headers: x-session-id, x-session-signature, x-consumer-address',
          documentation: 'https://servicenet.app/docs'
        });
      }
      
      try {
        // Verify signature (consumer signs sessionId)
        const message = `ServiceNet Session: ${sessionId}`;
        const isValid = await verifyMessage({
          address: consumerAddress as `0x${string}`,
          message,
          signature: sessionSignature as `0x${string}`
        });
        
        if (!isValid) {
          return res.status(401).json({
            error: 'Invalid signature',
            message: 'Session signature verification failed'
          });
        }
        
        // Store session info on request
        req.sessionId = sessionId;
        req.consumerAddress = consumerAddress;
        req.onChainSessionId = sessionId;
        
        // Get or create Yellow session ID
        if (this.yellowManager) {
          let yellowSessionId = this.yellowSessionMap.get(sessionId);
          
          if (!yellowSessionId) {
            // Create Yellow App Session on first API call
            // Initial amount: $10 (10_000_000 with 6 decimals)
            yellowSessionId = await this.yellowManager.createAppSession(
              consumerAddress,
              parseUnits('10', 6)
            );
            this.yellowSessionMap.set(sessionId, yellowSessionId);
            console.log(`[ServiceNet SDK] Created Yellow session ${yellowSessionId.slice(0, 10)}... for on-chain session`);
          }
          
          req.yellowSessionId = yellowSessionId;
        }
        
        next();
      } catch (error) {
        console.error('[ServiceNet SDK] Authentication error:', error);
        res.status(500).json({ 
          error: 'Authentication failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };
  }
  
  /**
   * Middleware: Track API call usage and add billing headers
   */
  meterUsage() {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const originalJson = res.json.bind(res);
      
      res.json = (data: any) => {
        if (!req.sessionId) return originalJson(data);
        
        // Increment call count for this session
        const currentCount = this.callCounts.get(req.sessionId) || 0;
        const newCount = currentCount + 1;
        this.callCounts.set(req.sessionId, newCount);
        
        // Calculate costs
        const callCost = this.config.pricePerCall;
        const totalSpent = newCount * callCost;
        this.sessionSpent.set(req.sessionId, totalSpent);
        
        // Update Yellow Network state channel (0 gas!)
        if (this.yellowManager && req.yellowSessionId) {
          try {
            const callCostUSDC = parseUnits(callCost.toString(), 6);
            this.yellowManager.updateState(req.yellowSessionId, callCostUSDC);
            res.setHeader('X-ServiceNet-Yellow-Enabled', 'true');
            res.setHeader('X-ServiceNet-Gas-Cost', '0.000000');
          } catch (error) {
            console.error('[ServiceNet SDK] Yellow state update failed:', error);
            res.setHeader('X-ServiceNet-Yellow-Enabled', 'false');
          }
        } else {
          res.setHeader('X-ServiceNet-Yellow-Enabled', 'false');
          res.setHeader('X-ServiceNet-Gas-Cost', 'varies');
        }
        
        // Add usage info to response headers
        res.setHeader('X-ServiceNet-Calls-Made', newCount.toString());
        res.setHeader('X-ServiceNet-Price-Per-Call', callCost.toFixed(6));
        res.setHeader('X-ServiceNet-Total-Spent', totalSpent.toFixed(6));
        res.setHeader('X-ServiceNet-Provider', this.config.ensName);
        
        const yellowInfo = req.yellowSessionId ? ` | Yellow: ${req.yellowSessionId.slice(0, 10)}... | ⚡ 0 gas` : '';
        console.log(`[ServiceNet SDK] 📞 API call #${newCount} | Session: ${req.sessionId.slice(0, 10)}... | Cost: $${totalSpent.toFixed(6)}${yellowInfo}`);
        
        return originalJson(data);
      };
      
      next();
    };
  }
  
  /**
   * Close Yellow session and get settlement data
   */
  async closeYellowSession(sessionId: string): Promise<{
    consumerRefund: bigint;
    providerPayment: bigint;
  } | null> {
    if (!this.yellowManager) return null;
    
    const yellowSessionId = this.yellowSessionMap.get(sessionId);
    if (!yellowSessionId) return null;
    
    const settlement = await this.yellowManager.closeAppSession(yellowSessionId);
    this.yellowSessionMap.delete(sessionId);
    
    return settlement;
  }
  
  /**
   * Get Yellow Manager instance
   */
  getYellowManager(): YellowManager | undefined {
    return this.yellowManager;
  }
  
  /**
   * Check if Yellow Network is enabled and connected
   */
  isYellowEnabled(): boolean {
    return this.yellowManager?.connected ?? false;
  }
  
  /**
   * Get the Express app instance
   */
  getApp(): express.Application {
    return this.app;
  }
  
  /**
   * Get call count for a session
   */
  getSessionCallCount(sessionId: string): number {
    return this.callCounts.get(sessionId) || 0;
  }
  
  /**
   * Get total spent for a session
   */
  getSessionSpent(sessionId: string): number {
    return this.sessionSpent.get(sessionId) || 0;
  }
  
  /**
   * Get session statistics
   */
  getSessionStats(sessionId: string) {
    return {
      callsMade: this.getSessionCallCount(sessionId),
      totalSpent: this.getSessionSpent(sessionId),
      pricePerCall: this.config.pricePerCall
    };
  }
  
  /**
   * Clear session data (for testing)
   */
  clearSession(sessionId: string): void {
    this.callCounts.delete(sessionId);
    this.sessionSpent.delete(sessionId);
  }
  
  /**
   * Get SDK configuration
   */
  getConfig(): ServiceNetSDKConfig {
    return { ...this.config };
  }
}

// Export types
export type { AuthenticatedRequest };
