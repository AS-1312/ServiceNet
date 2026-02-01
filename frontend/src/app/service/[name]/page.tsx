"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Star, TrendingUp, Activity, Clock, DollarSign, Play, Copy, Check, ExternalLink } from "lucide-react";

export default function ServiceDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [sessionAmount, setSessionAmount] = useState("10");
  const [apiResponse, setApiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock service data
  const service = {
    name: name,
    description: "Real-time weather data for 1000+ cities worldwide with detailed forecasts",
    longDescription: "Our weather API provides comprehensive weather data including current conditions, hourly forecasts, and 7-day predictions. Data is sourced from multiple weather stations and updated every 15 minutes for maximum accuracy.",
    price: "$0.001",
    priceModel: "per call",
    calls: "12.5K",
    uptime: "99.9%",
    avgResponse: "142ms",
    rating: 4.8,
    reviews: 45,
    provider: "0x1234...5678",
    providerName: "WeatherDAO",
    category: "Data Feeds",
    tags: ["weather", "data", "real-time", "forecast"],
    endpoint: "https://api.weather.eth",
    documentation: "ipfs://Qm...",
    chains: ["Ethereum", "Base", "Arbitrum"],
    rateLimit: "1000 calls/hour",
    minPurchase: "100 calls"
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

  const handleTestAPI = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/discover"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discover</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
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

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border">
                <div>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                    <Star className="w-4 h-4" />
                    <span className="text-sm">Rating</span>
                  </div>
                  <div className="text-2xl font-bold">{service.rating}</div>
                  <div className="text-xs text-muted-foreground">{service.reviews} reviews</div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Calls</span>
                  </div>
                  <div className="text-2xl font-bold">{service.calls}</div>
                  <div className="text-xs text-muted-foreground">today</div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                    <Activity className="w-4 h-4" />
                    <span className="text-sm">Uptime</span>
                  </div>
                  <div className="text-2xl font-bold text-success">{service.uptime}</div>
                  <div className="text-xs text-muted-foreground">last 30 days</div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Response</span>
                  </div>
                  <div className="text-2xl font-bold">{service.avgResponse}</div>
                  <div className="text-xs text-muted-foreground">average</div>
                </div>
              </div>

              {/* Tags */}
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

            {/* Tabs */}
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
                {/* Overview Tab */}
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

                {/* Playground Tab */}
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
                          disabled={isLoading}
                          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          <Play className="w-5 h-5" />
                          <span>{isLoading ? "Testing..." : "Test Request"}</span>
                          <span className="text-sm opacity-75">({service.price})</span>
                        </button>

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

                {/* Reviews Tab */}
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Open Session Card */}
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Open Session</h3>
              
              <div className="space-y-4">
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
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    ≈ {Math.floor(parseFloat(sessionAmount) / parseFloat(service.price.replace("$", "")))} calls
                  </p>
                </div>

                <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                  Open Session
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
            </div>

            {/* Documentation */}
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


