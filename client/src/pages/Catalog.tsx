import { useState } from "react";
import TopNav from "@/components/TopNav";
import PeopleBuying from "@/components/PeopleBuying";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useLocation, Link } from "wouter";
import { Zap, Leaf, Sparkles, ArrowRight, MessageSquareText, Store } from "lucide-react";

const stores = [
  {
    slug: "gadgets",
    name: "Gadgets",
    tagline: "The future is now",
    description: "Cutting-edge electronics, smart devices, and tech accessories for the modern explorer.",
    icon: <Zap className="h-8 w-8" />,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
    color: "gadgets",
    productCount: 6,
    featured: "Wireless Earbuds, Smart Watches, Power Banks & more",
  },
  {
    slug: "seeds",
    name: "Seeds",
    tagline: "Grow something beautiful",
    description: "Premium organic seeds for gardens — from heirloom vegetables to exotic herbs.",
    icon: <Leaf className="h-8 w-8" />,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
    color: "seeds",
    productCount: 6,
    featured: "Tomato, Basil, Chili, Sunflower, Lavender & more",
  },
  {
    slug: "vogue",
    name: "Vogue",
    tagline: "Style is eternal",
    description: "Curated fashion, accessories, and lifestyle essentials for trendsetters.",
    icon: <Sparkles className="h-8 w-8" />,
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop",
    color: "vogue",
    productCount: 6,
    featured: "Sunglasses, Handbags, Watches, Perfumes & more",
  },
];

export default function Catalog() {
  const { totalItems } = useCart();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <TopNav cartCount={totalItems} />

      {/* People are Buying — compact strip */}
      <PeopleBuying />

      <main className="container home-main">
        {/* Stores Heading */}
        <div className="home-stores-heading">
          <div>
            <h1 className="home-stores-title">
              <Store className="home-stores-title-icon" />
              Explore Our Stores
            </h1>
            <p className="home-stores-subtitle">
              Step into a unique shopping experience — each store has its own vibe, curated products, and a dedicated attendant ready to help you.
            </p>
          </div>
        </div>

        {/* Store Cards Grid */}
        <div className="home-stores-grid">
          {stores.map((store) => (
            <Link key={store.slug} href={`/store/${store.slug}`}>
              <Card
                className={`home-store-card home-store-card--${store.color} group h-full`}
                id={`store-card-${store.slug}`}
              >
                {/* Image */}
                <div className="home-store-card-img-wrap">
                  <img src={store.image} alt={store.name} className="home-store-card-img" />
                  <div className="home-store-card-img-overlay" />
                  <div className="home-store-card-icon">{store.icon}</div>
                </div>

                {/* Body */}
                <div className="home-store-card-body">
                  <h2 className="home-store-card-name">{store.name}</h2>
                  <p className="home-store-card-tagline">{store.tagline}</p>
                  <p className="home-store-card-desc">{store.description}</p>

                  <div className="home-store-card-featured">
                    <span className="home-store-card-featured-label">Featured:</span>
                    <span className="home-store-card-featured-text">{store.featured}</span>
                  </div>

                  <div className="home-store-card-footer">
                    <span className="home-store-card-count">{store.productCount} products</span>
                    <span className="home-store-card-enter">
                      Enter Store <ArrowRight className="h-4 w-4" />
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
