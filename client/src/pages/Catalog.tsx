import { useState } from "react";
import TopNav from "@/components/TopNav";
import PeopleBuying from "@/components/PeopleBuying";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Link } from "wouter";
import { Zap, Leaf, ArrowRight, Store } from "lucide-react";

const stores = [
  {
    slug: "seeds",
    name: "SEED BANK",
    tagline: "Freedom begins with Food security",
    description: "Get input and consultation for your garden or your farm project.",
    icon: <Leaf className="h-8 w-8" />,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
    color: "seeds",
    productCount: 6,
    featured: "Maradona Pawpaw, Pepper Seeds, Maize Seeds & more",
  },
  {
    slug: "power",
    name: "POWER STORE",
    tagline: "Power the future",
    description: "High-efficiency solar solutions, inverter systems, and smart power management.",
    icon: <Zap className="h-8 w-8" />,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop",
    color: "power",
    productCount: 6,
    featured: "Solar Panels, Deep Cycle Batteries, Inverters & more",
  },
];

export default function Catalog() {
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <TopNav cartCount={totalItems} />

      {/* People are Buying — compact strip */}
      <PeopleBuying />

      <main className="container home-main max-w-6xl py-12">
        {/* Stores Heading */}
        <div className="home-stores-heading text-center mb-12">
          <h1 className="home-stores-title justify-center">
            <Store className="home-stores-title-icon" />
            Explore Our Featured Stores
          </h1>
          <p className="home-stores-subtitle max-w-lg mx-auto mt-2">
            Step into a unique shopping experience — choose from our specialized stores.
          </p>
        </div>

        {/* 2-Column Grid of Stores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {stores.map((store) => (
            <Link key={store.slug} href={`/store/${store.slug}`}>
              <Card
                className={`home-store-card home-store-card--${store.color} group h-full cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl border-border`}
                id={`store-card-${store.slug}`}
              >
                {/* Image */}
                <div className="home-store-card-img-wrap h-56 relative overflow-hidden">
                  <img src={store.image} alt={store.name} className="home-store-card-img w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="home-store-card-img-overlay absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="home-store-card-icon">{store.icon}</div>
                </div>

                {/* Body */}
                <div className="home-store-card-body p-6 space-y-4">
                  <div>
                    <h2 className="home-store-card-name text-2xl font-bold tracking-tight text-foreground">{store.name}</h2>
                    <p className="home-store-card-tagline text-xs font-semibold uppercase tracking-wider text-primary mt-1">{store.tagline}</p>
                  </div>
                  <p className="home-store-card-desc text-muted-foreground text-sm leading-relaxed">{store.description}</p>

                  <div className="home-store-card-featured p-3 bg-muted/50 rounded-lg">
                    <span className="home-store-card-featured-label font-semibold text-xs text-foreground block mb-1">Featured:</span>
                    <span className="home-store-card-featured-text text-muted-foreground text-xs">{store.featured}</span>
                  </div>

                  <div className="home-store-card-footer flex items-center justify-between pt-4 border-t border-border">
                    <span className="home-store-card-count text-xs text-muted-foreground">{store.productCount} products</span>
                    <span className="home-store-card-enter flex items-center gap-1.5 text-sm font-bold text-primary group-hover:text-primary/80 transition-colors">
                      Enter Store <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
