"use client";

import { useState } from 'react';
import { useENSResolver } from '@/hooks/useENSResolver';
import { Search, Loader2, ExternalLink, DollarSign, Zap } from 'lucide-react';

export function ENSServiceResolver() {
  const [ensInput, setEnsInput] = useState('');
  const [resolvedService, setResolvedService] = useState<any>(null);
  const { resolveENSName, loading, error } = useENSResolver();

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensInput.trim()) return;

    const result = await resolveENSName(ensInput);
    setResolvedService(result);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-card rounded-2xl border border-border">
        <h3 className="text-lg font-semibold mb-4">Resolve ENS Service</h3>
        <form onSubmit={handleResolve} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={ensInput}
              onChange={(e) => setEnsInput(e.target.value)}
              placeholder="Enter ENS name (e.g., weather.api.eth)"
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !ensInput.trim()}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Resolving...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Resolve Service</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </div>

      {resolvedService && (
        <div className="p-6 bg-card rounded-2xl border border-border space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">
                {resolvedService.ensName}
              </h3>
              <p className="text-sm text-muted-foreground font-mono">
                {resolvedService.address}
              </p>
            </div>
            <a
              href={`https://etherscan.io/address/${resolvedService.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          {Object.keys(resolvedService.metadata).length > 0 ? (
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Service Metadata
              </h4>
              
              <div className="grid gap-3">
                {resolvedService.metadata.description && (
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                    <p className="text-foreground">{resolvedService.metadata.description}</p>
                  </div>
                )}

                {resolvedService.metadata.endpoint && (
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Endpoint</p>
                    <p className="text-foreground font-mono text-sm break-all">
                      {resolvedService.metadata.endpoint}
                    </p>
                  </div>
                )}

                {resolvedService.metadata.price && (
                  <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Price per Call</p>
                      <p className="text-lg font-bold text-primary">
                        ${resolvedService.metadata.price} {resolvedService.metadata.token || 'USDC'}
                      </p>
                    </div>
                  </div>
                )}

                {resolvedService.metadata.category && (
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Category</p>
                    <div className="flex flex-wrap gap-2">
                      {resolvedService.metadata.category.split(',').map((cat: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium"
                        >
                          {cat.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {resolvedService.metadata.rateLimit && (
                  <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Rate Limit</p>
                      <p className="text-foreground font-medium">{resolvedService.metadata.rateLimit}</p>
                    </div>
                  </div>
                )}

                {resolvedService.metadata.uptime && (
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Uptime</p>
                    <p className="text-foreground font-bold text-success">{resolvedService.metadata.uptime}%</p>
                  </div>
                )}

                {resolvedService.metadata.version && (
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Version</p>
                    <p className="text-foreground font-mono">{resolvedService.metadata.version}</p>
                  </div>
                )}

                {resolvedService.metadata.chains && (
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Supported Chains</p>
                    <div className="flex flex-wrap gap-2">
                      {resolvedService.metadata.chains.split(',').map((chain: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-background border border-border rounded text-sm"
                        >
                          {chain.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                No service metadata found for this ENS name
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
