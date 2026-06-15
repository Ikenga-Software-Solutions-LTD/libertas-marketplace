import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import TopNav from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Star, MessageCircle, ArrowLeft, Sparkles, Zap, Leaf } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";
import { toast } from "sonner";

const storeData: Record<string, {
  name: string;
  tagline: string;
  description: string;
  themeClass: string;
  icon: React.ReactNode;
  heroImage: string;
  attendantName: string;
  attendantRole: string;
  products: Array<{
    id: number; name: string; price: number; imageUrl: string;
    description: string; rating: number; stock: number;
  }>;
}> = {
  seeds: {
    name: "SEED BANK",
    tagline: "Freedom begins with Food security",
    description: "Freedom begins with Food security; get input and consultation for your garden or your farm project",
    themeClass: "store-seeds",
    icon: <Leaf className="h-6 w-6" />,
    heroImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=400&fit=crop",
    attendantName: "Flora",
    attendantRole: "Garden Expert",
    products: [
      { id: 11, name: "Maradona Pawpaw Seeds", price: 1200, imageUrl: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=500&h=500&fit=crop", description: "High-yield hybrid papaya seeds. Fast-growing dwarf variety with sweet, firm, orange-red flesh.", rating: 4.9, stock: 50 },
      { id: 12, name: "Pepper Seeds", price: 399, imageUrl: "https://images.unsplash.com/photo-1599599810694-b5ac4dd64e4b?w=500&h=500&fit=crop", description: "Premium hot pepper seeds. High heat level, disease resistant, and excellent harvest yield.", rating: 4.8, stock: 75 },
      { id: 13, name: "Maize Seeds", price: 799, imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d20f6?w=500&h=500&fit=crop", description: "Drought-tolerant hybrid yellow maize seeds. High yielding, fast maturing, perfect for grain production.", rating: 4.7, stock: 120 },
      { id: 14, name: "Organic Basil Seeds", price: 299, imageUrl: "https://images.unsplash.com/photo-1464226184081-280282a34e6d?w=500&h=500&fit=crop", description: "Sweet Genovese basil, perfect for culinary gardens, quick growing and aromatic.", rating: 4.6, stock: 100 },
      { id: 15, name: "Sunflower Seeds", price: 349, imageUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=500&h=500&fit=crop", description: "Giant Russian sunflower, grows up to 12 feet tall, easy to grow and beautiful.", rating: 4.7, stock: 60 },
      { id: 16, name: "Lavender Seeds", price: 599, imageUrl: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=500&h=500&fit=crop", description: "English lavender seeds, highly aromatic, great for pollinators and natural oils.", rating: 4.5, stock: 45 },
    ],
  },
  power: {
    name: "POWER STORE",
    tagline: "Power the future",
    description: "High-efficiency solar solutions, inverter systems, and smart power management for complete energy independence.",
    themeClass: "store-power",
    icon: <Zap className="h-6 w-6" />,
    heroImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=400&fit=crop",
    attendantName: "TechBot",
    attendantRole: "Energy Specialist",
    products: [
      { id: 1, name: "Solar Power Bank 50,000mAh", price: 8999, imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop", description: "Heavy-duty power bank with built-in solar panels, fast-charging ports, and built-in torch.", rating: 4.8, stock: 30 },
      { id: 2, name: "Mono Solar Panel 100W", price: 24999, imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&h=500&fit=crop", description: "High-efficiency monocrystalline solar panel for home off-grid and backup installations.", rating: 4.7, stock: 15 },
      { id: 3, name: "Deep Cycle Inverter Battery", price: 59999, imageUrl: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=500&h=500&fit=crop", description: "Long-life 12V 200Ah deep cycle AGM battery designed for high inverter loads.", rating: 4.6, stock: 10 },
      { id: 4, name: "Pure Sine Wave Inverter 1KVA", price: 34999, imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&h=500&fit=crop", description: "Protects sensitive home electronics with clean, silent, pure sine wave power.", rating: 4.8, stock: 8 },
      { id: 5, name: "Rechargeable LED Lantern", price: 3499, imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&h=500&fit=crop", description: "Solar-charging emergency lantern with built-in USB out for charging devices.", rating: 4.5, stock: 40 },
      { id: 6, name: "Smart Surge Protector", price: 5499, imageUrl: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500&h=500&fit=crop", description: "8-outlet heavy duty surge protector with overload auto-cutoff and USB hubs.", rating: 4.4, stock: 22 },
    ],
  },
};

export default function StoreView({ storeSlug }: { storeSlug: string }) {
  const { isAuthenticated } = useAuth();
  const { addItem, totalItems } = useCart();
  const [, navigate] = useLocation();
  const [showAttendant, setShowAttendant] = useState(false);

  const store = storeData[storeSlug];

  if (!store) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav cartCount={totalItems} />
        <div className="container py-20 text-center">
          <h1>Store not found</h1>
          <Button onClick={() => navigate("/")} className="mt-4">Go Home</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product: typeof store.products[0]) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to cart");
      window.location.href = getLoginUrl();
      return;
    }
    addItem({
      id: product.id,
      productId: product.id,
      quantity: 1,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className={`min-h-screen ${store.themeClass}`}>
      <TopNav cartCount={totalItems} />

      {/* Store Hero */}
      <div className="store-hero">
        <img src={store.heroImage} alt={store.name} className="store-hero-bg" />
        <div className="store-hero-overlay" />
        <div className="store-hero-content container">
          <button onClick={() => navigate("/")} className="store-back-btn">
            <ArrowLeft className="h-4 w-4" />
            Back to Stores
          </button>
          <div className="store-hero-badge">{store.icon}</div>
          <h1 className="store-hero-name">{store.name}</h1>
          <p className="store-hero-tagline">{store.tagline}</p>
          <p className="store-hero-desc">{store.description}</p>
        </div>
      </div>

      {/* Products */}
      <main className="container store-main">
        <div className="store-products-header">
          <h2 className="store-products-title">Our Collection</h2>
          <span className="store-products-count">{store.products.length} items</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {store.products.map((product) => (
            <Card key={product.id} className="store-product-card group">
              <div className="store-card-img-wrap">
                <img src={product.imageUrl} alt={product.name} className="store-card-img" />
                {product.stock <= 10 && (
                  <div className="store-card-low-stock">Only {product.stock} left</div>
                )}
              </div>
              <div className="store-card-body">
                <h3 className="store-card-name">{product.name}</h3>
                <p className="store-card-desc">{product.description}</p>
                <div className="store-card-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                  ))}
                  <span>{product.rating}</span>
                </div>
                <div className="store-card-footer">
                  <span className="store-card-price">₦{(product.price / 100).toLocaleString()}</span>
                  <Button size="sm" onClick={() => handleAddToCart(product)} className="store-add-btn gap-1.5">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Attendant FAB */}
      <button
        className="store-attendant-fab"
        onClick={() => setShowAttendant(!showAttendant)}
        id="store-attendant-btn"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="store-attendant-fab-label">Talk to {store.attendantName}</span>
      </button>

      {/* Attendant Chat Panel */}
      {showAttendant && (
        <div className="store-attendant-panel" id="store-attendant-panel">
          <div className="store-attendant-header">
            <div className="store-attendant-avatar">{store.attendantName.charAt(0)}</div>
            <div>
              <p className="store-attendant-name">{store.attendantName}</p>
              <p className="store-attendant-role">{store.attendantRole}</p>
            </div>
            <button className="store-attendant-close" onClick={() => setShowAttendant(false)}>✕</button>
          </div>
          <div className="store-attendant-body">
            <div className="store-attendant-bubble">
              Hi there! 👋 Welcome to the <strong>{store.name}</strong> store. I'm {store.attendantName}, your dedicated {store.attendantRole.toLowerCase()}. How can I help you today?
            </div>
          </div>
          <div className="store-attendant-input-area">
            <input type="text" placeholder={`Ask ${store.attendantName} anything...`} className="store-attendant-input" />
            <button className="store-attendant-send">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
