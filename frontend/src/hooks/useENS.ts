"use client";

import { useEffect, useState } from 'react';
import { useAccount, useEnsName, useEnsAvatar } from 'wagmi';
import { normalize } from 'viem/ens';

export function useENS() {
  const { address, isConnected } = useAccount();
  const [ensName, setEnsName] = useState<string | null>(null);
  const [ensAvatar, setEnsAvatar] = useState<string | null>(null);

  const { data: fetchedEnsName } = useEnsName({
    address: address,
    chainId: 1, // Mainnet for ENS
  });

  const { data: fetchedEnsAvatar } = useEnsAvatar({
    name: fetchedEnsName ? normalize(fetchedEnsName) : undefined,
    chainId: 1,
  });

  useEffect(() => {
    if (fetchedEnsName) {
      setEnsName(fetchedEnsName);
    } else {
      setEnsName(null);
    }
  }, [fetchedEnsName]);

  useEffect(() => {
    if (fetchedEnsAvatar) {
      setEnsAvatar(fetchedEnsAvatar);
    } else {
      setEnsAvatar(null);
    }
  }, [fetchedEnsAvatar]);

  return {
    address,
    isConnected,
    ensName,
    ensAvatar,
    displayName: ensName || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null),
  };
}

// Made with Bob
