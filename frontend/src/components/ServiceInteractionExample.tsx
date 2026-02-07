"use client";

import { useService, useYellowSessionWrite, useUSDCOperations } from '@/hooks';
import { useState } from 'react';

/**
 * Example component demonstrating smart contract integration
 * This can be used as a reference for building other components
 */
export function ServiceInteractionExample({ ensName }: { ensName: string }) {
  const [sessionAmount, setSessionAmount] = useState('10');
  
  // Read service data
  const { service, formattedService, metrics, rating, isLoading } = useService(ensName);
  
  // Session operations
  const {
    openSession,
    closeSession,
    isPending: isSessionPending,
    isSuccess: isSessionSuccess,
    error: sessionError,
  } = useYellowSessionWrite();
  
  // USDC operations
  const {
    balance,
    balanceFormatted,
    allowance,
    needsApproval,
    approveYellow,
    isPending: isApprovePending,
  } = useUSDCOperations();

  const handleOpenSession = async () => {
    try {
      // Check if approval is needed
      if (needsApproval || (allowance && allowance < BigInt(sessionAmount))) {
        // Approve USDC first
        await approveYellow(sessionAmount);
      }
      
      // Open session (24 hours)
      await openSession(ensName, sessionAmount, 86400);
    } catch (error) {
      console.error('Failed to open session:', error);
    }
  };

  if (isLoading) {
    return <div>Loading service data...</div>;
  }

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <div className="space-y-6 p-6 border rounded-lg">
      {/* Service Information */}
      <div>
        <h2 className="text-2xl font-bold">{service.ensName}</h2>
        <p className="text-sm text-gray-600">Provider: {service.provider}</p>
        
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Price per Call</p>
            <p className="text-lg font-semibold">
              {formattedService?.pricePerCallFormatted}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Total Calls</p>
            <p className="text-lg font-semibold">
              {formattedService?.totalCallsFormatted}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Rating</p>
            <p className="text-lg font-semibold">
              {rating ? (Number(rating.averageRating) / 100).toFixed(2) : 'N/A'} ⭐
            </p>
          </div>
        </div>
      </div>

      {/* USDC Balance */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Your Wallet</h3>
        <p>USDC Balance: ${balanceFormatted || '0.00'}</p>
        {needsApproval && (
          <button
            onClick={() => approveYellow('1000')}
            disabled={isApprovePending}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isApprovePending ? 'Approving...' : 'Approve USDC'}
          </button>
        )}
      </div>

      {/* Session Management */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Open Session</h3>
        
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={sessionAmount}
            onChange={(e) => setSessionAmount(e.target.value)}
            className="border rounded px-3 py-2 w-32"
            placeholder="Amount"
          />
          <span>USDC</span>
          
          <button
            onClick={handleOpenSession}
            disabled={isSessionPending || isApprovePending}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {isSessionPending ? 'Opening...' : 'Open Session'}
          </button>
        </div>
        
        {isSessionSuccess && (
          <p className="mt-2 text-green-600">Session opened successfully! ✓</p>
        )}
        
        {sessionError && (
          <p className="mt-2 text-red-600">Error: {sessionError}</p>
        )}
      </div>

      {/* Status */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Service Status</h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${service.active ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>{service.active ? 'Active' : 'Inactive'}</span>
        </div>
      </div>
    </div>
  );
}

export default ServiceInteractionExample;
