"use client";

import { useState } from "react";
import { Plus, TrendingUp, DollarSign, Activity, Users, Settings, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ProviderDashboard() {
  const [selectedService, setSelectedService] = useState(0);

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

  const stats = {
    totalRevenue: "$4.20",
    totalCalls: "4,197",
    avgUptime: "99.87%",
    activeSessions: 20
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
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

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Total Revenue (24h)</span>
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalRevenue}</div>
            <div className="text-xs text-success">+15% from yesterday</div>
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
          {/* My Services */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-2xl font-bold mb-6">My Services</h2>

              <div className="space-y-4">
                {myServices.map((service, i) => (
                  <div
                    key={i}
                    className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedService === i
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedService(i)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{service.name}</h3>
                        <span className="inline-flex items-center px-2 py-1 bg-success/10 text-success rounded text-xs font-medium">
                          {service.status}
                        </span>
                      </div>
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Calls Today</div>
                        <div className="text-lg font-bold">{service.calls}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Revenue</div>
                        <div className="text-lg font-bold text-success">{service.revenue}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Uptime</div>
                        <div className="text-lg font-bold">{service.uptime}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Avg Response</div>
                        <div className="text-lg font-bold">{service.avgResponse}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Active Sessions: </span>
                        <span className="font-semibold">{service.activeSessions}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Pending: </span>
                        <span className="font-semibold">{service.pendingSettlement}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Link
                        href={`/service/${service.name}`}
                        className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-center text-sm font-medium transition-colors"
                      >
                        View Public Page
                      </Link>
                      <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors">
                        Withdraw Funds
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Chart Placeholder */}
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
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

            {/* Quick Actions */}
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

            {/* Earnings Summary */}
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


