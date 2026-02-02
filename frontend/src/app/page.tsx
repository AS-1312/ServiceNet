"use client";

import Link from "next/link";
import { ArrowRight, Zap, Shield, TrendingUp, Code, Database, Cpu, Search } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Micropayments",
      description: "Pay $0.0001 per API call with zero gas fees via Yellow state channels"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "ENS-Native Discovery",
      description: "Services are human-readable names like weather.api.eth, not contract addresses"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "True Pay-Per-Use",
      description: "No subscriptions, no monthly fees. Pay only for what you actually use"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Composable Services",
      description: "Services can call other services programmatically in one session"
    }
  ];

  const categories = [
    { name: "AI Models", icon: <Cpu className="w-5 h-5" />, count: "24 services" },
    { name: "Data Feeds", icon: <Database className="w-5 h-5" />, count: "18 services" },
    { name: "APIs", icon: <Code className="w-5 h-5" />, count: "32 services" },
    { name: "Oracles", icon: <TrendingUp className="w-5 h-5" />, count: "12 services" }
  ];

  const popularServices = [
    {
      name: "weather.api.eth",
      description: "Real-time weather data for 1000+ cities",
      price: "$0.001",
      calls: "12.5K",
      uptime: "99.9%",
      rating: 4.8
    },
    {
      name: "ai.summarize.eth",
      description: "GPT-powered text summarization",
      price: "$0.01",
      calls: "8.2K",
      uptime: "99.7%",
      rating: 4.9
    },
    {
      name: "crypto.price.eth",
      description: "Real-time cryptocurrency prices",
      price: "$0.0005",
      calls: "25.1K",
      uptime: "99.95%",
      rating: 4.7
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-primary">Powered by ENS & Yellow Network</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Turn Your ENS Name Into a
              <span className="block gradient-text mt-2">Revenue Stream</span>
            </h1>

            <p className="max-w-3xl mx-auto text-xl text-muted-foreground leading-relaxed">
              A decentralized marketplace where services are discovered via ENS names and consumed via instant, gas-free micropayments. Monetize APIs, AI models, and services with true pay-per-use.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/discover"
                className="group inline-flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/provider"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-card border-2 border-border rounded-xl font-semibold hover:border-primary transition-all hover:scale-105"
              >
                <span>Become a Provider</span>
              </Link>
            </div>


            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 max-w-4xl mx-auto">
              {[
                { value: "86", label: "Active Services" },
                { value: "45K+", label: "API Calls Today" },
                { value: "$2.3K", label: "Volume (24h)" },
                { value: "99.8%", label: "Avg Uptime" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why ServiceNet?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The Web3-native alternative to centralized API marketplaces
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all hover:shadow-lg card-hover"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Browse by Category</h2>
            <p className="text-xl text-muted-foreground">
              Discover services across multiple categories
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, i) => (
              <Link
                key={i}
                href={`/discover?category=${category.name.toLowerCase()}`}
                className="group p-8 bg-card rounded-2xl border border-border hover:border-primary transition-all card-hover text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">Popular Services</h2>
              <p className="text-muted-foreground">Most used services this week</p>
            </div>
            <Link
              href="/discover"
              className="hidden sm:inline-flex items-center space-x-2 text-primary hover:underline font-medium"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularServices.map((service, i) => (
              <Link
                key={i}
                href={`/service/${service.name}`}
                className="group p-6 bg-card rounded-2xl border border-border hover:border-primary transition-all card-hover"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium">{service.rating}</span>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                    {service.price}/call
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">{service.calls}</span> calls
                    </span>
                    <span className="text-muted-foreground">
                      <span className="font-medium text-success">{service.uptime}</span> uptime
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link
              href="/discover"
              className="inline-flex items-center space-x-2 text-primary hover:underline font-medium"
            >
              <span>View all services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Discover Services",
                description: "Browse services by ENS name or category. Check pricing, uptime, and reviews."
              },
              {
                step: "02",
                title: "Open Session",
                description: "Connect wallet and open a Yellow state channel session with your desired allowance."
              },
              {
                step: "03",
                title: "Use & Pay",
                description: "Make unlimited API calls with instant micropayments. One settlement transaction at the end."
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 -right-4 text-primary/30">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}


