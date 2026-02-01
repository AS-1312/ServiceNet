"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, X, Info } from "lucide-react";

export default function RegisterServicePage() {
  const [ensName, setEnsName] = useState("");
  const [pricing, setPricing] = useState("0.001");
  const [pricingModel, setPricingModel] = useState("per-call");
  const [endpoint, setEndpoint] = useState("");
  const [category, setCategory] = useState("api");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [rateLimit, setRateLimit] = useState("1000");
  const [chains, setChains] = useState<string[]>(["ethereum"]);

  const categories = [
    { value: "ai", label: "AI Models" },
    { value: "data", label: "Data Feeds" },
    { value: "api", label: "APIs" },
    { value: "oracle", label: "Oracles" },
    { value: "compute", label: "Compute" }
  ];

  const availableChains = [
    { value: "ethereum", label: "Ethereum" },
    { value: "base", label: "Base" },
    { value: "arbitrum", label: "Arbitrum" },
    { value: "optimism", label: "Optimism" }
  ];

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const toggleChain = (chain: string) => {
    if (chains.includes(chain)) {
      setChains(chains.filter(c => c !== chain));
    } else {
      setChains([...chains, chain]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      ensName,
      pricing,
      pricingModel,
      endpoint,
      category,
      description,
      tags,
      rateLimit,
      chains
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/provider"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Register New Service</h1>
          <p className="text-muted-foreground text-lg">
            Set up your ENS name and configure your service for the marketplace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  ENS Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={ensName}
                  onChange={(e) => setEnsName(e.target.value)}
                  placeholder="weather.api.eth"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Your ENS name will be used to identify your service on the marketplace
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category <span className="text-destructive">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what your service does..."
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  This will be displayed on your service page
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add a tag..."
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-secondary rounded-lg text-sm"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-destructive transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-xl font-semibold mb-6">Pricing Configuration</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (USDC) <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      step="0.0001"
                      value={pricing}
                      onChange={(e) => setPricing(e.target.value)}
                      placeholder="0.001"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <select
                    value={pricingModel}
                    onChange={(e) => setPricingModel(e.target.value)}
                    className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="per-call">per call</option>
                    <option value="per-minute">per minute</option>
                    <option value="per-mb">per MB</option>
                  </select>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Set your pricing in USDC. Consumers will pay this amount for each unit of usage.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Supported Chains <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availableChains.map((chain) => (
                    <button
                      key={chain.value}
                      type="button"
                      onClick={() => toggleChain(chain.value)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        chains.includes(chain.value)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {chain.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-xl font-semibold mb-6">Technical Configuration</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Service Endpoint <span className="text-destructive">*</span>
                </label>
                <input
                  type="url"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="https://api.example.com"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  The URL where your service is hosted
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Rate Limit (calls/hour)
                </label>
                <input
                  type="number"
                  value={rateLimit}
                  onChange={(e) => setRateLimit(e.target.value)}
                  placeholder="1000"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Maximum number of calls allowed per hour per user
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-primary mb-2">Next Steps</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your ENS text records will be automatically updated</li>
                  <li>• Deploy your service backend with the provided SDK</li>
                  <li>• Your service will be listed on the marketplace after verification</li>
                  <li>• You can update pricing and settings anytime from your dashboard</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/provider"
              className="flex-1 px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-xl font-semibold transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Register Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
