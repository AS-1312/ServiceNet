"use client";

import { useENS } from '@/hooks/useENS';
import { User, Copy, ExternalLink, Check } from 'lucide-react';
import { useState } from 'react';

export function ENSProfile() {
  const { address, isConnected, ensName, ensAvatar, displayName } = useENS();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="p-6 bg-card rounded-2xl border border-border">
        <div className="text-center text-muted-foreground">
          <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Connect your wallet to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-2xl border border-border">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {ensAvatar ? (
            <img
              src={ensAvatar}
              alt={ensName || 'Profile'}
              className="w-16 h-16 rounded-full border-2 border-primary"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
              <User className="w-8 h-8 text-primary" />
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            {ensName ? (
              <>
                <h3 className="text-xl font-bold text-foreground mb-1">{ensName}</h3>
                <p className="text-sm text-muted-foreground">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              </>
            ) : (
              <h3 className="text-xl font-bold text-foreground">
                {displayName}
              </h3>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={copyAddress}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Address</span>
                </>
              )}
            </button>

            <a
              href={`https://etherscan.io/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View on Etherscan</span>
            </a>

            {ensName && (
              <a
                href={`https://app.ens.domains/${ensName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Manage ENS</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ENS Badge */}
      {ensName && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>ENS Name Verified</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Made with Bob
