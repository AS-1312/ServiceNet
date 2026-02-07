"use client";

import { useState } from "react";
import { Plus, TrendingUp, DollarSign, Activity, Users, Settings, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useGetProviderServices } from "@/hooks";
import { ProviderServiceCard } from "@/components/ProviderServiceCard";

export default function ProviderDashboard() {
  const { address, isConnected } = useAccount();
  const [selectedService, setSelectedService] = useState(0);

  // Fetch provider's services from contract
  const { data: serviceNodes, isLoading: loadingServices } = useGetProviderServices(address);

  const myServices = [
    {
      name: "weather.api.eth",
      status: "active",
      calls: "2,341",
      revenue: "$2.34",
      uptime: "99.95%",
      avgResponse: "142ms",
      activeSessions: 12,
      pendingSettlement: "$1.23"
    },
    {
      name: "data.sports.eth",
      status: "active",
      calls: "1,856",
      revenue: "$1.86",
      uptime: "99.8%",
      avgResponse: "178ms",
      activeSessions: 8,
      pendingSettlement: "$0.92"
    }
  ];

  const recentActivity = [
    { type: "call", service: "weather.api.eth", amount: "$0.001", time: "2 min ago" },
    { type: "call", service: "weather.api.eth", amount: "$0.001", time: "3 min ago" },
    { type: "session", service: "data.sports.eth", amount: "$5.00", time: "15 min ago" },
    { type: "call", service: "weather.api.eth", amount: "$0.001", time: "18 min ago" },
    { type: "settlement", service: "weather.api.eth", amount: "$12.45", time: "2 hours ago" }
  ];

  // Calculate stats from real services
  const stats = {
    totalRevenue: "$4.20", // Would be calculated from all services
    totalCalls: "4,197",   // Would be calculated from all services
    avgUptime: "99.87%",
    activeSessions: serviceNodes?.length || 0
  };

  const isLoading = loadingServices;

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
                  Connect your wallet to manage your services and track earnings.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Provider Dashboard</h1>
            <p className="text-muted-foreground">Manage your services and track earnings</p>
          </div>
          <Link
            href="/provider/register"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Register New Service</span>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">My Services</span>
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                serviceNodes?.length || 0
              )}
            </div>
            <div className="text-xs text-muted-foreground">Registered services</div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Total Calls (24h)</span>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalCalls}</div>
            <div className="text-xs text-success">+8% from yesterday</div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Avg Uptime</span>
              <Activity className="w-5 h-5 text-success" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.avgUptime}</div>
            <div className="text-xs text-muted-foreground">Last 30 days</div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Active Sessions</span>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.activeSessions}</div>
            <div className="text-xs text-muted-foreground">Across all services</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-2xl font-bold mb-6">My Services</h2>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-6 rounded-xl border-2 border-border animate-pulse">
                      <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                      <div className="h-4 bg-muted rounded w-full mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="h-12 bg-muted rounded"></div>
                        <div className="h-12 bg-muted rounded"></div>
                        <div className="h-12 bg-muted rounded"></div>
                        <div className="h-12 bg-muted rounded"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 h-10 bg-muted rounded"></div>
                        <div className="flex-1 h-10 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !isConnected ? (
                <div className="text-center py-12">
                  <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Connect your wallet to view your services</p>
                </div>
              ) : serviceNodes && serviceNodes.length > 0 ? (
                <div className="space-y-4">
                  {serviceNodes.map((ensNode, i) => (
                    <ProviderServiceCard 
                      key={ensNode} 
                      ensNode={ensNode}
                      isSelected={selectedService === i}
                      onSelect={() => setSelectedService(i)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Services Registered</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't registered any services yet. Start monetizing your APIs!
                  </p>
                  <Link
                    href="/provider/register"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Register Your First Service</span>
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Analytics</h2>
                <select className="px-4 py-2 bg-secondary border border-border rounded-lg text-sm">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>

              <div className="h-64 flex items-center justify-center bg-secondary/50 rounded-xl">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Analytics chart coming soon</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {activity.type === "call" && <Activity className="w-4 h-4 text-primary" />}
                        {activity.type === "session" && <Users className="w-4 h-4 text-accent" />}
                        {activity.type === "settlement" && <DollarSign className="w-4 h-4 text-success" />}
                        <span className="text-sm font-medium capitalize">{activity.type}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.service}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{activity.amount}</div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                  <span className="text-sm font-medium">Edit Pricing</span>
                  <Settings className="w-4 h-4" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                  <span className="text-sm font-medium">Update ENS Records</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                  <span className="text-sm font-medium">View Documentation</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                  <span className="text-sm font-medium">Manage Sessions</span>
                  <Users className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-6">
              <h3 className="text-lg font-semibold mb-4">Earnings Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Today</span>
                  <span className="font-semibold">{stats.totalRevenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <span className="font-semibold">$28.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">This Month</span>
                  <span className="font-semibold">$124.80</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">All Time</span>
                  <span className="font-bold text-lg">$1,245.60</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                Withdraw All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


