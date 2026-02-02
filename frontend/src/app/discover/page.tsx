"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, TrendingUp, Star, Activity } from "lucide-react";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const categories = [
    { id: "all", name: "All Services" },
    { id: "ai", name: "AI Models" },
    { id: "data", name: "Data Feeds" },
    { id: "api", name: "APIs" },
    { id: "oracle", name: "Oracles" },
    { id: "compute", name: "Compute" }
  ];

  const services = [
    {
      name: "weather.api.eth",
      category: "data",
      description: "Real-time weather data for 1000+ cities worldwide",
      price: "$0.001",
      priceModel: "per call",
      calls: "12.5K",
      uptime: "99.9%",
      rating: 4.8,
      reviews: 45,
      provider: "0x1234...5678",
      tags: ["weather", "data", "real-time"]
    },
    {
      name: "ai.summarize.eth",
      category: "ai",
      description: "GPT-powered text summarization with context awareness",
      price: "$0.01",
      priceModel: "per summary",
      calls: "8.2K",
      uptime: "99.7%",
      rating: 4.9,
      reviews: 67,
      provider: "0x8765...4321",
      tags: ["ai", "nlp", "gpt"]
    },
    {
      name: "crypto.price.eth",
      category: "oracle",
      description: "Real-time cryptocurrency prices with 100+ tokens",
      price: "$0.0005",
      priceModel: "per call",
      calls: "25.1K",
      uptime: "99.95%",
      rating: 4.7,
      reviews: 89,
      provider: "0xabcd...ef01",
      tags: ["crypto", "price", "oracle"]
    },
    {
      name: "image.enhance.eth",
      category: "ai",
      description: "AI-powered image enhancement and upscaling",
      price: "$0.05",
      priceModel: "per image",
      calls: "3.4K",
      uptime: "99.5%",
      rating: 4.6,
      reviews: 34,
      provider: "0x2468...1357",
      tags: ["ai", "image", "enhancement"]
    },
    {
      name: "nft.metadata.eth",
      category: "api",
      description: "NFT metadata aggregation across multiple chains",
      price: "$0.002",
      priceModel: "per query",
      calls: "15.8K",
      uptime: "99.8%",
      rating: 4.8,
      reviews: 56,
      provider: "0x9876...5432",
      tags: ["nft", "metadata", "multichain"]
    },
    {
      name: "translate.ai.eth",
      category: "ai",
      description: "Neural machine translation for 50+ languages",
      price: "$0.003",
      priceModel: "per translation",
      calls: "6.7K",
      uptime: "99.6%",
      rating: 4.7,
      reviews: 42,
      provider: "0x1357...2468",
      tags: ["ai", "translation", "nlp"]
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return parseInt(b.calls.replace("K", "000")) - parseInt(a.calls.replace("K", "000"));
      case "rating":
        return b.rating - a.rating;
      case "price-low":
        return parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", ""));
      case "price-high":
        return parseFloat(b.price.replace("$", "")) - parseFloat(a.price.replace("$", ""));
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Discover Services</h1>
          <p className="text-muted-foreground text-lg">
            Browse {services.length} decentralized services powered by ENS
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border hover:border-primary"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6 text-sm text-muted-foreground">
          Showing {sortedServices.length} of {services.length} services
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedServices.map((service, i) => (
            <Link
              key={i}
              href={`/service/${service.name}`}
              className="group p-6 bg-card rounded-2xl border border-border hover:border-primary transition-all card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium">{service.rating}</span>
                      <span className="text-muted-foreground">({service.reviews})</span>
                    </div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-semibold whitespace-nowrap">
                  {service.price}
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {service.tags.slice(0, 3).map((tag, j) => (
                  <span
                    key={j}
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm pt-4 border-t border-border">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium text-foreground">{service.calls}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Activity className="w-4 h-4" />
                    <span className="font-medium text-success">{service.uptime}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{service.priceModel}</span>
              </div>
            </Link>
          ))}
        </div>

        {sortedServices.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No services found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


