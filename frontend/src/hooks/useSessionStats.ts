import { useQuery } from '@tanstack/react-query';

interface SessionStats {
  sessionId: string;
  callsMade: number;
  totalSpent: number;
  pricePerCall: number;
  yellowEnabled: boolean;
  lastUpdated: string;
}

/**
 * Hook to fetch real-time session statistics from the API provider
 * This provides off-chain call tracking via Yellow Network
 */
export function useSessionStats(sessionId: string | undefined, serviceEndpoint: string) {
  return useQuery<SessionStats>({
    queryKey: ['sessionStats', sessionId, serviceEndpoint],
    queryFn: async () => {
      if (!sessionId) {
        throw new Error('Session ID is required');
      }
      
      const response = await fetch(`${serviceEndpoint}/session/${sessionId}/stats`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch session stats');
      }
      
      return response.json();
    },
    enabled: !!sessionId,
    refetchInterval: 3000, // Refresh every 3 seconds for real-time updates
    staleTime: 2000,
  });
}
