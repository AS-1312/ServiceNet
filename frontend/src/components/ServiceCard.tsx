"use client";

import Link from "next/link";
import { Star, TrendingUp, Activity } from "lucide-react";
import { useReadContract } from "wagmi";
import { ServiceNetConfig } from "@/config/contracts";
import { formatUSDC } from "@/lib/contracts";
import type { Service } from "@/types/contracts";

interface ServiceCardProps {
  ensNode: `0x${string}`;
  isRealService?: boolean;
}

export function ServiceCard({ ensNode, isRealService = false }: ServiceCardProps) {
  // Fetch service data from contract
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

  if (!serviceData) return null;

  const service = serviceData as Service;
  const metrics = metricsData as [bigint, bigint, bigint] | undefined;
  const rating = ratingData as [bigint, bigint] | undefined;

  // Format data for display
  const ensName = service.ensName || 'Unknown Service';
  const priceUSD = formatUSDC(service.pricePerCall);
  const totalCalls = metrics ? Number(metrics[0]) : 0;
  const totalRevenue = metrics ? formatUSDC(metrics[1]) : '$0';
  const avgRating = rating && rating[0] > BigInt(0) 
    ? Number(rating[1]) / 100 
    : 0;
  const totalRatings = rating ? Number(rating[0]) : 0;
  const isActive = service.active;

  return (
    <Link
      href={`/service/${ensName}`}
      className="group p-6 bg-card rounded-2xl border border-border hover:border-primary transition-all card-hover relative"
    >
      {isRealService && (
        <div className="absolute top-4 right-4 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs font-semibold text-green-600 dark:text-green-400">
          ⛓️ On-Chain
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
            {ensName}
          </h3>
          <div className="flex items-center space-x-3 text-sm">
            {avgRating > 0 ? (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">{avgRating.toFixed(1)}</span>
                <span className="text-muted-foreground">({totalRatings})</span>
              </div>
            ) : (
              <span className="text-muted-foreground text-xs">No ratings yet</span>
            )}
          </div>
        </div>
        <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-semibold whitespace-nowrap">
          ${priceUSD}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Service registered on ServiceNet
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {isActive ? (
          <span className="px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded text-xs font-medium">
            Active
          </span>
        ) : (
          <span className="px-2 py-1 bg-red-500/20 text-red-600 dark:text-red-400 rounded text-xs font-medium">
            Inactive
          </span>
        )}
        <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
          {ensName.split('.').pop()}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium text-foreground">{totalCalls.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Activity className="w-4 h-4" />
            <span className="font-medium text-success">{totalRevenue}</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">per call</span>
      </div>
    </Link>
  );
}
