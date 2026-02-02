"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, DollarSign, Activity, Clock, TrendingUp, AlertCircle, X } from "lucide-react";
import { ENSProfile } from "@/components/ens-profile";
import { ENSServiceResolver } from "@/components/ens-service-resolver";

export default function ConsumerDashboard() {
  const [showAddFunds, setShowAddFunds] = useState(false);

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

  const stats = {
    totalSpent: "$4.52",
    activeSessions: 3,
    totalCalls: 733,
    avgCost: "$0.006"
  };

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
              <span className="text-muted-foreground text-sm">Total Spent (24h)</span>
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalSpent}</div>
            <div className="text-xs text-muted-foreground">Across all services</div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Active Sessions</span>
              <Activity className="w-5 h-5 text-success" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.activeSessions}</div>
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

              <div className="space-y-4">
                {activeSessions.map((session, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-xl border-2 border-border hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Link
                          href={`/service/${session.service}`}
                          className="text-lg font-semibold hover:text-primary transition-colors"
                        >
                          {session.service}
                        </Link>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Expires in {session.expires}</span>
                          </span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Balance</span>
                        <span className="font-semibold">
                          {session.balance} / {session.total}
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            session.status === "low" ? "bg-warning" : "bg-success"
                          }`}
                          style={{
                            width: `${(parseFloat(session.balance.replace("$", "")) / parseFloat(session.total.replace("$", ""))) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Calls Used</span>
                        <span className="font-semibold">
                          {session.calls} / {session.maxCalls}
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${getProgressPercentage(session.calls, session.maxCalls)}%` }}
                        />
                      </div>
                    </div>

                    {session.status === "low" && (
                      <div className="flex items-center space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg mb-4">
                        <AlertCircle className="w-4 h-4 text-warning" />
                        <span className="text-sm text-warning">Low balance - consider adding funds</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowAddFunds(true)}
                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors"
                      >
                        Add Funds
                      </button>
                      <button className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors">
                        Close Session
                      </button>
                      <Link
                        href={`/service/${session.service}`}
                        className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
                      >
                        View Service
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
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
              <h3 className="text-lg font-semibold mb-4">Spending Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Today</span>
                  <span className="font-semibold">{stats.totalSpent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <span className="font-semibold">$28.40</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">This Month</span>
                  <span className="font-semibold">$124.60</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">All Time</span>
                  <span className="font-bold text-lg">$1,456.80</span>
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


