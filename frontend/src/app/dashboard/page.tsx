"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, DollarSign, Activity, Clock, TrendingUp, AlertCircle, X, Loader2 } from "lucide-react";
import { useAccount } from "wagmi";
import { useUserSessions, useUSDCOperations } from "@/hooks";
import { ENSProfile } from "@/components/ens-profile";
import { ENSServiceResolver } from "@/components/ens-service-resolver";
import { SessionCard } from "@/components/SessionCard";

export default function ConsumerDashboard() {
  const { address, isConnected } = useAccount();
  const [showAddFunds, setShowAddFunds] = useState(false);

  // Fetch user's sessions from contract
  const { sessionIds, isLoading: loadingSessions } = useUserSessions();
  
  // Fetch USDC balance
  const { balance, balanceFormatted, isLoading: loadingBalance } = useUSDCOperations();

  const activeSessions = [
    {
      service: "weather.api.eth",
      balance: "$8.32",
      total: "$10.00",
      calls: 168,
      maxCalls: 1000,
      expires: "23h 41m",
      status: "active"
    },
    {
      service: "ai.summarize.eth",
      balance: "$0.23",
      total: "$5.00",
      calls: 477,
      maxCalls: 500,
      expires: "2h 15m",
      status: "low"
    },
    {
      service: "crypto.price.eth",
      balance: "$4.56",
      total: "$5.00",
      calls: 88,
      maxCalls: 10000,
      expires: "47h 22m",
      status: "active"
    }
  ];

  const recentTransactions = [
    {
      type: "call",
      service: "weather.api.eth",
      amount: "-$0.001",
      time: "2 min ago",
      status: "completed"
    },
    {
      type: "call",
      service: "ai.summarize.eth",
      amount: "-$0.01",
      time: "5 min ago",
      status: "completed"
    },
    {
      type: "session",
      service: "crypto.price.eth",
      amount: "-$5.00",
      time: "1 hour ago",
      status: "completed"
    },
    {
      type: "call",
      service: "weather.api.eth",
      amount: "-$0.001",
      time: "2 hours ago",
      status: "completed"
    },
    {
      type: "settlement",
      service: "weather.api.eth",
      amount: "-$1.68",
      time: "1 day ago",
      status: "completed"
    }
  ];

  // Mock stats (in production, calculate from session data)
  const stats = {
    totalSpent: "$4.52",
    activeSessions: sessionIds?.length || 0,
    totalCalls: 733,
    avgCost: "$0.006"
  };

  const isLoading = loadingSessions || loadingBalance;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-success bg-success/10";
      case "low":
        return "text-warning bg-warning/10";
      case "expired":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getProgressPercentage = (current: number, max: number) => {
    return (current / max) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Wallet Connection Check */}
        {!isConnected && (
          <div className="mb-8 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <h3 className="font-semibold text-yellow-600 dark:text-yellow-400">Wallet Not Connected</h3>
                <p className="text-sm text-yellow-600/80 dark:text-yellow-400/80 mt-1">
                  Connect your wallet to view your active sessions and usage data.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Consumer Dashboard</h1>
            <p className="text-muted-foreground">Manage your active sessions and usage</p>
          </div>
          <Link
            href="/discover"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Open New Session</span>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">USDC Balance</span>
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                `$${balanceFormatted}`
              )}
            </div>
            <div className="text-xs text-muted-foreground">Available balance</div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Active Sessions</span>
              <Activity className="w-5 h-5 text-success" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                stats.activeSessions
              )}
            </div>
            <div className="text-xs text-muted-foreground">Currently running</div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Total Calls (24h)</span>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalCalls}</div>
            <div className="text-xs text-success">+12% from yesterday</div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Avg Cost/Call</span>
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.avgCost}</div>
            <div className="text-xs text-muted-foreground">Last 7 days</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <ENSProfile />
          <ENSServiceResolver />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-2xl font-bold mb-6">Active Sessions</h2>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-6 rounded-xl border-2 border-border animate-pulse">
                      <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                      <div className="h-4 bg-muted rounded w-full mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                      <div className="h-2 bg-muted rounded w-full mb-4"></div>
                      <div className="flex gap-2">
                        <div className="flex-1 h-10 bg-muted rounded"></div>
                        <div className="flex-1 h-10 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !isConnected ? (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Connect your wallet to view sessions</p>
                </div>
              ) : sessionIds && sessionIds.length > 0 ? (
                <div className="space-y-4">
                  {sessionIds.map((sessionId) => (
                    <SessionCard key={sessionId} sessionId={sessionId} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Sessions</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't opened any sessions yet. Browse services and start using APIs!
                  </p>
                  <Link
                    href="/discover"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Browse Services</span>
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Usage Overview</h2>
                <select className="px-4 py-2 bg-secondary border border-border rounded-lg text-sm">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>

              <div className="h-64 flex items-center justify-center bg-secondary/50 rounded-xl">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Usage chart coming soon</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {recentTransactions.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {tx.type === "call" && <Activity className="w-4 h-4 text-primary" />}
                        {tx.type === "session" && <Plus className="w-4 h-4 text-accent" />}
                        {tx.type === "settlement" && <DollarSign className="w-4 h-4 text-success" />}
                        <span className="text-sm font-medium capitalize">{tx.type}</span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{tx.service}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{tx.amount}</div>
                      <div className="text-xs text-muted-foreground">{tx.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors">
                View All Transactions
              </button>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-6">
              <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">USDC Balance</span>
                  <span className="font-semibold">
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      `$${balanceFormatted}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Sessions</span>
                  <span className="font-semibold">{stats.activeSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Calls</span>
                  <span className="font-semibold">{stats.totalCalls}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">Avg Cost/Call</span>
                  <span className="font-bold">{stats.avgCost}</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Favorite Services</h3>
              <div className="space-y-2">
                {["weather.api.eth", "ai.summarize.eth", "crypto.price.eth"].map((service, i) => (
                  <Link
                    key={i}
                    href={`/service/${service}`}
                    className="block p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                  >
                    <div className="text-sm font-medium">{service}</div>
                    <div className="text-xs text-muted-foreground mt-1">Quick access</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddFunds && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Add Funds</h3>
              <button
                onClick={() => setShowAddFunds(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount (USDC)</label>
                <input
                  type="number"
                  placeholder="10.00"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                Add Funds
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


