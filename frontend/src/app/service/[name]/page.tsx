"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Star, TrendingUp, Activity, Clock, DollarSign, Play, Copy, Check, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { useAccount } from "wagmi";
import { useService, useYellowSessionWrite, useUSDCOperations } from "@/hooks";
import { formatUSDC } from "@/lib/contracts";

export default function ServiceDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("overview");
  const [sessionAmount, setSessionAmount] = useState("10");
  const [sessionDuration, setSessionDuration] = useState("86400"); // 24 hours
  const [apiResponse, setApiResponse] = useState("");
  const [isTestingAPI, setIsTestingAPI] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch service data from contract
  const { service: serviceData, formattedService, metrics, rating, isLoading: isLoadingService } = useService(name);
  
  // Yellow Network session management
  const { openSession, isPending: isOpeningSession, isSuccess: sessionOpened, error: sessionError } = useYellowSessionWrite();
  
  // USDC operations
  const { balance, balanceFormatted, needsApproval, approveYellow, isPending: isApproving } = useUSDCOperations();

  // Handle successful session opening
  useEffect(() => {
    if (sessionOpened) {
      alert('Session opened successfully! You can now use this service.');
    }
  }, [sessionOpened]);

  // Combine real and mock data
  const service = {
    name: name,
    description: serviceData ? `Service registered on ServiceNet` : "Real-time weather data for 1000+ cities worldwide with detailed forecasts",
    longDescription: serviceData ? `This service is registered on the ServiceNet marketplace using ENS name resolution.` : "Our weather API provides comprehensive weather data including current conditions, hourly forecasts, and 7-day predictions. Data is sourced from multiple weather stations and updated every 15 minutes for maximum accuracy.",
    price: formattedService?.pricePerCallFormatted || "$0.001",
    priceUSDC: serviceData?.pricePerCall || BigInt(1000),
    priceModel: "per call",
    calls: formattedService?.totalCallsFormatted || "0",
    uptime: "99.9%",
    avgResponse: "142ms",
    rating: rating ? Number(rating.averageRating) / 100 : 0,
    reviews: rating ? Number(rating.totalRatings) : 0,
    provider: serviceData?.provider || "0x0000...0000",
    providerName: name.split('.')[0],
    category: "Data Feeds",
    tags: serviceData ? [name.split('.').pop() || 'eth', serviceData.active ? 'active' : 'inactive'] : ["weather", "data", "real-time", "forecast"],
    endpoint: `https://${name}`,
    documentation: "ipfs://Qm...",
    chains: ["Ethereum", "Sepolia"],
    rateLimit: "1000 calls/hour",
    minPurchase: "100 calls",
    isActive: serviceData?.active || false,
    totalRevenue: formattedService?.totalRevenueFormatted || "$0"
  };

  const reviews = [
    {
      user: "0xabcd...ef01",
      rating: 5,
      comment: "Excellent API! Very reliable and fast responses. Using it for my weather app.",
      date: "2 days ago"
    },
    {
      user: "0x8765...4321",
      rating: 4,
      comment: "Good service, accurate data. Would love to see more cities added.",
      date: "1 week ago"
    },
    {
      user: "0x2468...1357",
      rating: 5,
      comment: "Best weather API I've used. The micropayment model is perfect for my use case.",
      date: "2 weeks ago"
    }
  ];

  const handleOpenSession = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // Check if approval is needed
      if (needsApproval) {
        await approveYellow(sessionAmount);
      }
      
      // Open Yellow Network session
      await openSession(name, sessionAmount, parseInt(sessionDuration));
    } catch (error) {
      console.error('Failed to open session:', error);
    }
  };

  const handleTestAPI = async () => {
    setIsTestingAPI(true);
    // Simulate API call
    setTimeout(() => {
      setApiResponse(JSON.stringify({
        city: "San Francisco",
        temperature: 18.5,
        conditions: "Partly Cloudy",
        humidity: 65,
        wind_speed: 12,
        forecast: "Clear skies expected"
      }, null, 2));
      setIsTestingAPI(false);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading state
  if (isLoadingService) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading service data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/discover"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discover</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Service Status Banner */}
            {serviceData && (
              <div className={`p-4 rounded-xl border mb-6 ${serviceData.active ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                <div className="flex items-center gap-2">
                  {serviceData.active ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">⛓️ Service Active On-Chain</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">Service Currently Inactive</span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="bg-card rounded-2xl border border-border p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
                <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-lg font-bold">
                  {service.price}
                  <span className="text-sm font-normal">/{service.priceModel.split(" ")[1]}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border">
                <div>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                    <Star className="w-4 h-4" />
                    <span className="text-sm">Rating</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {service.rating > 0 ? service.rating.toFixed(1) : 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground">{service.reviews} reviews</div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Total Calls</span>
                  </div>
                  <div className="text-2xl font-bold">{service.calls}</div>
                  <div className="text-xs text-muted-foreground">lifetime</div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Revenue</span>
                  </div>
                  <div className="text-2xl font-bold">{service.totalRevenue}</div>
                  <div className="text-xs text-muted-foreground">lifetime</div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                    <Activity className="w-4 h-4" />
                    <span className="text-sm">Status</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {service.isActive ? '🟢' : '🔴'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {service.isActive ? 'active' : 'inactive'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-6 border-t border-border mt-6">
                {service.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-lg text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border">
              <div className="border-b border-border">
                <div className="flex space-x-1 p-2">
                  {["overview", "playground", "reviews"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3 rounded-lg capitalize transition-colors ${
                        activeTab === tab
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">About This Service</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.longDescription}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Service Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">Endpoint</span>
                          <span className="font-mono text-sm">{service.endpoint}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">Rate Limit</span>
                          <span>{service.rateLimit}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">Min Purchase</span>
                          <span>{service.minPurchase}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">Supported Chains</span>
                          <span>{service.chains.join(", ")}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Provider</h3>
                      <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                        <div>
                          <div className="font-semibold">{service.providerName}</div>
                          <div className="text-sm text-muted-foreground font-mono">{service.provider}</div>
                        </div>
                        <button className="px-4 py-2 bg-card border border-border rounded-lg hover:border-primary transition-colors">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "playground" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">API Playground</h3>
                      <p className="text-muted-foreground mb-6">
                        Test the API with sample requests. Each test costs {service.price}.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Endpoint</label>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 px-4 py-3 bg-secondary rounded-lg font-mono text-sm">
                              GET {service.endpoint}/weather/san-francisco
                            </div>
                            <button
                              onClick={() => copyToClipboard(`${service.endpoint}/weather/san-francisco`)}
                              className="p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                            >
                              {copied ? <Check className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Parameters</label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="city"
                              defaultValue="san-francisco"
                              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <select className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                              <option>metric</option>
                              <option>imperial</option>
                            </select>
                          </div>
                        </div>

                        <button
                          onClick={handleTestAPI}
                          disabled={isTestingAPI || !isConnected}
                          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          {isTestingAPI ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                          <span>{isTestingAPI ? "Testing..." : "Test Request"}</span>
                          <span className="text-sm opacity-75">({service.price})</span>
                        </button>
                        
                        {!isConnected && (
                          <p className="text-xs text-center text-muted-foreground">
                            Connect your wallet to test this API
                          </p>
                        )}

                        {apiResponse && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium">Response</label>
                              <span className="text-xs text-success">200 OK • 156ms</span>
                            </div>
                            <pre className="p-4 bg-secondary rounded-lg overflow-x-auto text-sm font-mono">
                              {apiResponse}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">User Reviews</h3>
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                        Write Review
                      </button>
                    </div>

                    <div className="space-y-4">
                      {reviews.map((review, i) => (
                        <div key={i} className="p-4 bg-secondary rounded-xl">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-mono text-sm">{review.user}</div>
                              <div className="flex items-center space-x-1 mt-1">
                                {[...Array(5)].map((_, j) => (
                                  <Star
                                    key={j}
                                    className={`w-4 h-4 ${
                                      j < review.rating
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Open Session</h3>
              
              {!isConnected ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Connect your wallet to open a session</p>
                </div>
              ) : (
              <div className="space-y-4">
                {/* USDC Balance */}
                <div className="p-3 bg-secondary rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Your USDC Balance</span>
                    <span className="font-semibold">${balanceFormatted}</span>
                  </div>
                </div>

                {/* Session Error */}
                {sessionError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{sessionError}</p>
                  </div>
                )}

                {/* Session Success */}
                {sessionOpened && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400">✓ Session opened successfully!</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">Session Amount (USDC)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="number"
                      value={sessionAmount}
                      onChange={(e) => setSessionAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="10.00"
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    ≈ {Math.floor(parseFloat(sessionAmount || "0") / parseFloat(service.price.replace("$", "")))} calls
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <select
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="3600">1 hour</option>
                    <option value="86400">24 hours</option>
                    <option value="604800">7 days</option>
                    <option value="2592000">30 days</option>
                  </select>
                </div>

                {needsApproval && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      ⚠️ USDC approval needed before opening session
                    </p>
                  </div>
                )}

                <button 
                  onClick={handleOpenSession}
                  disabled={isOpeningSession || isApproving || !service.isActive || sessionOpened}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isApproving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Approving USDC...
                    </>
                  ) : isOpeningSession ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Opening Session...
                    </>
                  ) : sessionOpened ? (
                    'Session Opened'
                  ) : needsApproval ? (
                    'Approve & Open Session'
                  ) : (
                    'Open Session'
                  )}
                </button>

                <div className="pt-4 border-t border-border space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per call</span>
                    <span className="font-medium">{service.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gas fees</span>
                    <span className="font-medium text-success">$0.00</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">${sessionAmount}</span>
                  </div>
                </div>
              </div>
              )}
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Documentation</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center justify-between p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium">API Reference</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium">Code Examples</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium">OpenAPI Spec</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


