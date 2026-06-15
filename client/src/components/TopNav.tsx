import { useState } from "react";
import AuthModal from "./AuthModal";
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
  ShieldCheck,
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
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange?.(localSearch);
  };

  return (
    <header className="topnav-wrapper sticky top-0 z-50">


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
            {!isAuthenticated && (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="hidden xl:flex items-center gap-2 px-4 py-2 mr-2 bg-primary hover:bg-primary/95 text-white rounded-full transition-all group shadow-sm active:scale-95 font-medium"
              >
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs whitespace-nowrap px-1">
                  Connect Alpha ID
                </span>
              </button>
            )}

            {/* Sell on Libertas */}
            <a href="#" className="topnav-action-item" id="topnav-sell">
              <Store className="h-5 w-5" />
              <span className="topnav-action-label">Sell on Libertas</span>
            </a>

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


      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  );
}
