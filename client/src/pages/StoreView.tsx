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

/* ─── Store Data ──────────────────────────────────────────── */
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
  gadgets: {
    name: "Gadgets",
    tagline: "The future is now",
    description: "Cutting-edge electronics, smart devices, and tech accessories curated for the modern explorer.",
    themeClass: "store-gadgets",
    icon: <Zap className="h-6 w-6" />,
    heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop",
    attendantName: "TechBot",
    attendantRole: "Gadgets Specialist",
    products: [
      { id: 1, name: "Wireless Earbuds Pro", price: 12999, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop", description: "Premium wireless earbuds with active noise cancellation and 36hr battery life", rating: 4.8, stock: 15 },
      { id: 2, name: "Smart Watch Ultra", price: 24999, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop", description: "Advanced fitness tracking, heart rate monitoring, GPS and water resistance", rating: 4.7, stock: 8 },
      { id: 3, name: "Portable Power Bank", price: 3499, imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop", description: "50000mAh portable charger with USB-C fast charging and LED display", rating: 4.5, stock: 30 },
      { id: 4, name: "Bluetooth Speaker", price: 8999, imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop", description: "360° surround sound, IPX7 waterproof, 20hr playtime", rating: 4.4, stock: 22 },
      { id: 5, name: "USB-C Hub Adapter", price: 5499, imageUrl: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500&h=500&fit=crop", description: "7-in-1 multiport adapter with 4K HDMI, SD card, and ethernet", rating: 4.3, stock: 40 },
      { id: 6, name: "Mechanical Keyboard", price: 11999, imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&h=500&fit=crop", description: "RGB backlit, hot-swappable switches, aluminum frame", rating: 4.6, stock: 12 },
    ],
  },
  seeds: {
    name: "Seeds",
    tagline: "Grow something beautiful",
    description: "Premium organic seeds for your garden — from heirloom vegetables to exotic herbs. Nature's potential in your hands.",
    themeClass: "store-seeds",
    icon: <Leaf className="h-6 w-6" />,
    heroImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=400&fit=crop",
    attendantName: "Flora",
    attendantRole: "Garden Expert",
    products: [
      { id: 11, name: "Heirloom Tomato Seeds", price: 499, imageUrl: "https://images.unsplash.com/photo-1585836369683-038a6eb6b206?w=500&h=500&fit=crop", description: "Organic heirloom tomato seeds, 50+ varieties mixed pack", rating: 4.9, stock: 50 },
      { id: 12, name: "Organic Basil Seeds", price: 299, imageUrl: "https://images.unsplash.com/photo-1464226184081-280282a34e6d?w=500&h=500&fit=crop", description: "Sweet Genovese basil, perfect for culinary gardens and pesto", rating: 4.6, stock: 100 },
      { id: 13, name: "Chili Pepper Seeds", price: 399, imageUrl: "https://images.unsplash.com/photo-1599599810694-b5ac4dd64e4b?w=500&h=500&fit=crop", description: "Mix of Carolina Reaper, Ghost pepper, and Habanero", rating: 4.8, stock: 75 },
      { id: 14, name: "Sunflower Seeds", price: 349, imageUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=500&h=500&fit=crop", description: "Giant Russian sunflower, grows up to 12 feet tall", rating: 4.7, stock: 60 },
      { id: 15, name: "Lavender Seeds", price: 599, imageUrl: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=500&h=500&fit=crop", description: "English lavender, aromatic and great for pollinators", rating: 4.5, stock: 45 },
      { id: 16, name: "Herb Garden Kit", price: 1299, imageUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=500&h=500&fit=crop", description: "Complete starter kit with 10 herb varieties and soil pods", rating: 4.9, stock: 25 },
    ],
  },
  vogue: {
    name: "Vogue",
    tagline: "Style is eternal",
    description: "Curated fashion, accessories, and lifestyle essentials for those who define trends, not follow them.",
    themeClass: "store-vogue",
    icon: <Sparkles className="h-6 w-6" />,
    heroImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=400&fit=crop",
    attendantName: "Aria",
    attendantRole: "Style Consultant",
    products: [
      { id: 21, name: "Designer Sunglasses", price: 8999, imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop", description: "UV400 polarized lenses with titanium frame", rating: 4.6, stock: 18 },
      { id: 22, name: "Leather Handbag", price: 15999, imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop", description: "Genuine Italian leather, handcrafted with gold hardware", rating: 4.8, stock: 10 },
      { id: 23, name: "Silk Scarf", price: 4999, imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop", description: "100% mulberry silk, hand-rolled edges, exclusive print", rating: 4.7, stock: 35 },
      { id: 24, name: "Classic Watch", price: 29999, imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop", description: "Swiss movement, sapphire crystal, genuine leather strap", rating: 4.9, stock: 5 },
      { id: 25, name: "Perfume Collection", price: 12999, imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop", description: "Set of 3 luxury fragrances — day, evening, and signature", rating: 4.5, stock: 20 },
      { id: 26, name: "Cashmere Beanie", price: 3999, imageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500&h=500&fit=crop", description: "100% pure cashmere, ribbed knit, unisex design", rating: 4.4, stock: 28 },
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
