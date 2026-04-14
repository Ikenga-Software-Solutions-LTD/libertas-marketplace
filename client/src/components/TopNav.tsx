import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingCart,
  Menu,
  User,
  LogOut,
  LayoutDashboard,
  Users,
  Search,
  MapPin,
  Heart,
  Bell,
  ChevronDown,
  Headphones,
  Store,
  Package,
  MessageSquareText,
} from "lucide-react";

interface TopNavProps {
  cartCount?: number;
  categories?: Array<{ id: number; name: string; slug: string }>;
  selectedCategory?: string;
  onCategoryChange?: (slug: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function TopNav({
  cartCount = 0,
  categories = [],
  selectedCategory = "",
  onCategoryChange,
  searchQuery = "",
  onSearchChange,
}: TopNavProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showManagerDialog, setShowManagerDialog] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange?.(localSearch);
  };

  return (
    <header className="topnav-wrapper sticky top-0 z-50">
      {/* Top Utility Bar */}
      <div className="topnav-utility-bar">
        <div className="container topnav-utility-inner">
          <div className="topnav-utility-left">
            <span className="topnav-utility-item">
              <MapPin className="h-3.5 w-3.5" />
              <span>Deliver to <strong>Lagos</strong></span>
            </span>
          </div>
          <div className="topnav-utility-right">
            <a href="#" className="topnav-utility-link">
              <Store className="h-3.5 w-3.5" />
              Sell on Libertas
            </a>
            <span className="topnav-utility-divider" />
            <a href="#" className="topnav-utility-link">
              <Headphones className="h-3.5 w-3.5" />
              Help Center
            </a>
            <span className="topnav-utility-divider" />
            <a href="#" className="topnav-utility-link">
              <Package className="h-3.5 w-3.5" />
              Track Order
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="topnav-main">
        <div className="container topnav-main-inner">
          {/* Logo */}
          <Link href="/">
            <a className="topnav-logo" id="topnav-logo">
              <div className="topnav-logo-icon">
                <span>Ⓛ</span>
              </div>
              <div className="topnav-logo-text">
                <span className="topnav-logo-name">Libertas</span>
                <span className="topnav-logo-tagline">Marketplace</span>
              </div>
            </a>
          </Link>

          {/* Search Bar */}
          <form className="topnav-search-form" onSubmit={handleSearchSubmit} id="topnav-search">
            <div className="topnav-search-wrapper">
              <Input
                placeholder="Search for products, brands, and more..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  onSearchChange?.(e.target.value);
                }}
                className="topnav-search-input"
                id="topnav-search-input"
              />
              <button type="submit" className="topnav-search-btn" id="topnav-search-btn">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="topnav-actions">
            {/* Talk to the Manager */}
            <button
              className="topnav-action-item group"
              id="topnav-manager-btn"
              onClick={() => setShowManagerDialog(true)}
            >
              <div className="relative">
                <MessageSquareText className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              </div>
              <span className="topnav-action-label">Talk to Manager</span>
            </button>

            {/* Wishlist */}
            <button className="topnav-action-item" id="topnav-wishlist">
              <Heart className="h-5 w-5" />
              <span className="topnav-action-label">Wishlist</span>
            </button>

            {/* Cart */}
            <Link href={isAuthenticated ? "/checkout" : getLoginUrl()}>
              <a className="topnav-action-item topnav-cart" id="topnav-cart">
                <div className="topnav-cart-icon-wrap">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="topnav-cart-badge">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </div>
                <span className="topnav-action-label">Cart</span>
              </a>
            </Link>

            {/* Mobile Menu Toggle */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="topnav-mobile-toggle" id="topnav-mobile-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="mt-8 flex flex-col gap-6">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearchSubmit}>
                    <div className="topnav-search-wrapper">
                      <Input
                        placeholder="Search..."
                        value={localSearch}
                        onChange={(e) => {
                          setLocalSearch(e.target.value);
                          onSearchChange?.(e.target.value);
                        }}
                        className="topnav-search-input"
                      />
                      <button type="submit" className="topnav-search-btn">
                        <Search className="h-5 w-5" />
                      </button>
                    </div>
                  </form>

                  <h3 className="font-display text-lg font-bold">Categories</h3>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant={selectedCategory === "" ? "default" : "outline"}
                      onClick={() => {
                        onCategoryChange?.("");
                        setMobileMenuOpen(false);
                      }}
                      className="justify-start"
                    >
                      All Products
                    </Button>
                    {categories.map((cat) => (
                      <Button
                        key={cat.id}
                        variant={selectedCategory === cat.slug ? "default" : "outline"}
                        onClick={() => {
                          onCategoryChange?.(cat.slug);
                          setMobileMenuOpen(false);
                        }}
                        className="justify-start"
                      >
                        {cat.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>


      {/* Manager Dialog Overlay (Global) */}
      {showManagerDialog && (
        <div className="manager-dialog-overlay" onClick={() => setShowManagerDialog(false)}>
          <div className="manager-dialog" onClick={(e) => e.stopPropagation()} id="manager-dialog">
            <div className="manager-dialog-header">
              <div className="manager-dialog-avatar">M</div>
              <div>
                <p className="manager-dialog-name">The Manager</p>
                <p className="manager-dialog-status">
                  <span className="manager-dialog-online" />
                  Online now
                </p>
              </div>
              <button className="manager-dialog-close" onClick={() => setShowManagerDialog(false)}>✕</button>
            </div>
            <div className="manager-dialog-body">
              <div className="manager-dialog-bubble">
                Hello! 👋 I'm the store manager at Libertas Marketplace. Can't find what you're looking for in our stores? Tell me exactly what you need and I'll make it happen — custom orders are our specialty!
              </div>
            </div>
            <div className="manager-dialog-input-area">
              <input
                type="text"
                placeholder="Describe what you're looking for..."
                className="manager-dialog-input"
                autoFocus
              />
              <button className="manager-dialog-send">Send</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
