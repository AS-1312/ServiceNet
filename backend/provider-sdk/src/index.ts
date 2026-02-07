import express, { Request, Response, NextFunction } from 'express';
import { verifyMessage } from 'viem';
import cors from 'cors';

export interface ServiceNetSDKConfig {
  ensName: string;
  pricePerCall: number; // USDC (e.g., 0.001)
  apiEndpoint?: string;
  enableCors?: boolean;
}

// Extend Express Request type
interface AuthenticatedRequest extends Request {
  sessionId?: string;
  consumerAddress?: string;
}

export class ServiceNetSDK {
  private app: express.Application;
  private config: ServiceNetSDKConfig;
  private callCounts: Map<string, number>; // sessionId -> call count
  private sessionSpent: Map<string, number>; // sessionId -> total spent
  
  constructor(config: ServiceNetSDKConfig) {
    this.app = express();
    this.config = config;
    this.callCounts = new Map();
    this.sessionSpent = new Map();
    
    // Default middleware
    this.app.use(express.json());
    
    if (config.enableCors !== false) {
      this.app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'x-session-id', 'x-session-signature', 'x-consumer-address']
      }));
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
            error: 'Unauthorized',
            message: 'Invalid session signature'
          });
        }
        
        // Store session info in request
        req.sessionId = sessionId;
        req.consumerAddress = consumerAddress;
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
        
        // Add usage info to response headers
        res.setHeader('X-ServiceNet-Calls-Made', newCount.toString());
        res.setHeader('X-ServiceNet-Price-Per-Call', callCost.toFixed(6));
        res.setHeader('X-ServiceNet-Total-Spent', totalSpent.toFixed(6));
        res.setHeader('X-ServiceNet-Provider', this.config.ensName);
        
        console.log(`[ServiceNet SDK] 📞 API call #${newCount} | Session: ${req.sessionId.slice(0, 10)}... | Cost: $${totalSpent.toFixed(6)}`);
        
        return originalJson(data);
      };
      
      next();
    };
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
   * Get the Express app instance
   */
  getApp(): express.Application {
    return this.app;
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
