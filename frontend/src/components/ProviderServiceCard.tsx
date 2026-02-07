"use client";

import Link from "next/link";
import { Settings, Loader2, Power, Edit, TrendingUp, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { ServiceNetConfig } from "@/config/contracts";
import { useServiceNetWrite, useService } from "@/hooks";
import { formatUSDC } from "@/lib/contracts";
import type { Service } from "@/types/contracts";
import { useTransactionToast } from "@/contexts/ToastContext";
import { InlineTransactionStatus } from "@/components/TransactionStatus";

interface ProviderServiceCardProps {
  ensNode: `0x${string}`;
  isSelected: boolean;
  onSelect: () => void;
}

export function ProviderServiceCard({ ensNode, isSelected, onSelect }: ProviderServiceCardProps) {
  const [showPriceEdit, setShowPriceEdit] = useState(false);
  const [newPrice, setNewPrice] = useState("");
  const [toastId, setToastId] = useState<string>("");
  
  // Transaction toasts
  const {
    showTransactionPending,
    showTransactionSubmitted,
    showTransactionSuccess,
    showTransactionError,
  } = useTransactionToast();
  
  // Fetch service data
  const { data: serviceData } = useReadContract({
    ...ServiceNetConfig,
    functionName: 'getService',
    args: [ensNode],
  });

  const { data: metricsData } = useReadContract({
    ...ServiceNetConfig,
    functionName: 'getServiceMetrics',
    args: [ensNode],
  });

  const { data: ratingData } = useReadContract({
    ...ServiceNetConfig,
    functionName: 'getRating',
    args: [ensNode],
  });

  // Service write operations
  const { 
    toggleService, 
    updatePrice,
    isPending: isUpdating, 
    isConfirming: isConfirmingUpdate,
    isSuccess: updateSuccess,
    error: updateError,
    hash: txHash,
  } = useServiceNetWrite();

  // Handle transaction states
  useEffect(() => {
    if (isUpdating && !toastId) {
      const id = showTransactionPending('Update Pending');
      setToastId(id);
    }
  }, [isUpdating, toastId, showTransactionPending]);

  useEffect(() => {
    if (isConfirmingUpdate && toastId && txHash) {
      showTransactionSubmitted(toastId, txHash);
    }
  }, [isConfirmingUpdate, toastId, txHash, showTransactionSubmitted]);

  useEffect(() => {
    if (updateSuccess && toastId) {
      showTransactionSuccess(
        toastId,
        'Service Updated!',
        'Your service has been updated successfully.',
        txHash
      );
      setShowPriceEdit(false);
      setToastId("");
    }
  }, [updateSuccess, toastId, txHash, showTransactionSuccess]);

  useEffect(() => {
    if (updateError && toastId) {
      showTransactionError(
        toastId,
        'Update Failed',
        updateError
      );
      setToastId("");
    }
  }, [updateError, toastId, showTransactionError]);

  if (!serviceData) {
    return (
      <div className="p-6 rounded-xl border-2 border-border animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-muted rounded w-full mb-2"></div>
      </div>
    );
  }

  const service = serviceData as Service;
  const metrics = metricsData as [bigint, bigint, bigint] | undefined;
  const rating = ratingData as [bigint, bigint] | undefined;

  // Format data for display
  const ensName = service.ensName || 'Unknown Service';
  const priceUSD = formatUSDC(service.pricePerCall);
  const totalCalls = metrics ? Number(metrics[0]) : 0;
  const totalRevenue = metrics ? formatUSDC(metrics[1]) : '0.00';
  const avgRating = rating && rating[0] > BigInt(0) 
    ? Number(rating[1]) / 100 
    : 0;
  const totalRatings = rating ? Number(rating[0]) : 0;
  const isActive = service.active;

  const handleToggleService = async () => {
    if (!service.ensName) return;
    
    const action = isActive ? 'deactivate' : 'activate';
    if (confirm(`Are you sure you want to ${action} this service?`)) {
      try {
        await toggleService(service.ensName);
      } catch (error) {
        console.error('Failed to toggle service:', error);
      }
    }
  };

  const handleUpdatePrice = async () => {
    if (!service.ensName || !newPrice) return;
    
    try {
      await updatePrice(service.ensName, newPrice);
    } catch (error) {
      console.error('Failed to update price:', error);
    }
  };

  return (
    <div
      className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">{ensName}</h3>
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
            isActive 
              ? 'bg-success/10 text-success' 
              : 'bg-red-500/10 text-red-600 dark:text-red-400'
          }`}>
            {isActive ? '🟢 active' : '🔴 inactive'}
          </span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowPriceEdit(!showPriceEdit);
          }}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Update Error */}
      {updateError && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{updateError}</p>
        </div>
      )}

      {/* Price Editor */}
      {showPriceEdit && (
        <div className="mb-4 p-4 bg-secondary rounded-lg" onClick={(e) => e.stopPropagation()}>
          <h4 className="text-sm font-semibold mb-3">Update Service</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1.5">Price per Call (USD)</label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder={priceUSD}
                step="0.001"
                min="0"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleUpdatePrice}
                disabled={isUpdating || isConfirmingUpdate || !newPrice}
                className="flex-1 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <InlineTransactionStatus
                  isPending={isUpdating}
                  isConfirming={isConfirmingUpdate}
                  isSuccess={false}
                  defaultText="Update Price"
                  pendingText="Approving..."
                  confirmingText="Updating..."
                />
              </button>
              <button
                onClick={() => setShowPriceEdit(false)}
                className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Total Calls</div>
          <div className="text-lg font-bold">{totalCalls.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Revenue</div>
          <div className="text-lg font-bold text-success">${totalRevenue}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Rating</div>
          <div className="text-lg font-bold">
            {avgRating > 0 ? `${avgRating.toFixed(1)} ⭐` : 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Price</div>
          <div className="text-lg font-bold">${priceUSD}</div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="flex items-center justify-between mb-4 pt-4 border-t border-border text-sm">
        <div>
          <span className="text-muted-foreground">Reviews: </span>
          <span className="font-semibold">{totalRatings}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Provider: </span>
          <span className="font-mono text-xs">{service.provider.slice(0, 6)}...{service.provider.slice(-4)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/service/${ensName}`}
          className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-center text-sm font-medium transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          View Public Page
        </Link>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleService();
          }}
          disabled={isUpdating}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
            isActive
              ? 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20'
              : 'bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20'
          }`}
        >
          {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
          <Power className="w-4 h-4" />
          {isUpdating ? 'Updating...' : (isActive ? 'Deactivate' : 'Activate')}
        </button>
      </div>

      {/* Service Details (collapsed) */}
      <details className="mt-4 text-xs" onClick={(e) => e.stopPropagation()}>
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          View Technical Details
        </summary>
        <div className="mt-2 p-3 bg-secondary rounded-lg space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ENS Node:</span>
            <span className="font-mono">{ensNode.slice(0, 20)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Provider Address:</span>
            <span className="font-mono">{service.provider.slice(0, 10)}...{service.provider.slice(-8)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created:</span>
            <span>{new Date(Number(service.createdAt) * 1000).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Revenue:</span>
            <span className="font-medium">${totalRevenue} USDC</span>
          </div>
        </div>
      </details>
    </div>
  );
}
