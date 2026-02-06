"use client";

import { useState, useCallback } from 'react';
import { useYellow } from '@/providers/yellow-provider';
import { useAccount } from 'wagmi';

export interface YellowMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: number;
  isRead: boolean;
}

export function useYellowMessaging() {
  const { ylide, isInitialized, currentNetwork } = useYellow();
  const { address } = useAccount();
  const [messages, setMessages] = useState<YellowMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Send a message through Yellow Network
   */
  const sendMessage = useCallback(
    async (to: string, subject: string, content: string) => {
      if (!ylide || !isInitialized) {
        throw new Error('Yellow SDK is not initialized');
      }

      if (!address) {
        throw new Error('Wallet not connected');
      }

      if (!currentNetwork) {
        throw new Error('Network not supported');
      }

      setIsLoading(true);
      setError(null);

      try {
        // Note: Actual implementation would use ylide.sendMessage()
        // This is a placeholder for the actual Yellow SDK messaging API
        console.log('Sending message via Yellow Network:', {
          from: address,
          to,
          subject,
          content,
          network: currentNetwork,
        });

        // Placeholder success
        return {
          success: true,
          messageId: `msg_${Date.now()}`,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [ylide, isInitialized, address, currentNetwork]
  );

  /**
   * Fetch messages for the connected wallet
   */
  const fetchMessages = useCallback(async () => {
    if (!ylide || !isInitialized) {
      throw new Error('Yellow SDK is not initialized');
    }

    if (!address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Note: Actual implementation would use ylide.getMessages()
      // This is a placeholder for the actual Yellow SDK messaging API
      console.log('Fetching messages from Yellow Network for:', address);

      // Placeholder data
      const fetchedMessages: YellowMessage[] = [];
      setMessages(fetchedMessages);

      return fetchedMessages;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [ylide, isInitialized, address]);

  /**
   * Mark a message as read
   */
  const markAsRead = useCallback(
    async (messageId: string) => {
      if (!ylide || !isInitialized) {
        throw new Error('Yellow SDK is not initialized');
      }

      try {
        // Update local state
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          )
        );

        // Note: Actual implementation would sync with Yellow Network
        console.log('Marked message as read:', messageId);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to mark message as read';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [ylide, isInitialized]
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    fetchMessages,
    markAsRead,
    isReady: isInitialized && !!address && !!currentNetwork,
  };
}

// Made with Bob
