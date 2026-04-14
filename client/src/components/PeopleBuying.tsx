import { useEffect, useRef, useState } from "react";
import { ShoppingCart, Star, Flame } from "lucide-react";

interface BuyingItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  buyer: string;
  timeAgo: string;
}

const buyingItems: BuyingItem[] = [
  { id: 101, name: "Wireless Earbuds Pro", price: 12999, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop", buyer: "Adebayo O.", timeAgo: "2 min ago" },
  { id: 102, name: "Smart Watch Ultra", price: 24999, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop", buyer: "Chinwe A.", timeAgo: "5 min ago" },
  { id: 103, name: "Heirloom Tomato Seeds", price: 499, imageUrl: "https://images.unsplash.com/photo-1585836369683-038a6eb6b206?w=200&h=200&fit=crop", buyer: "Emeka I.", timeAgo: "8 min ago" },
  { id: 104, name: "Portable Power Bank", price: 3499, imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=200&fit=crop", buyer: "Fatima M.", timeAgo: "12 min ago" },
  { id: 105, name: "Designer Sunglasses", price: 8999, imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop", buyer: "Grace N.", timeAgo: "15 min ago" },
  { id: 106, name: "Organic Basil Seeds", price: 299, imageUrl: "https://images.unsplash.com/photo-1464226184081-280282a34e6d?w=200&h=200&fit=crop", buyer: "Hassan K.", timeAgo: "18 min ago" },
  { id: 107, name: "Bluetooth Speaker", price: 6999, imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop", buyer: "Ifeoma U.", timeAgo: "22 min ago" },
  { id: 108, name: "Leather Handbag", price: 15999, imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop", buyer: "James O.", timeAgo: "25 min ago" },
];

export default function PeopleBuying() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const allItems = [...buyingItems, ...buyingItems];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    // Set initial position to the middle to allow left-to-right scrolling
    const setInitialPos = () => {
      if (el.scrollWidth > 0) {
        el.scrollLeft = el.scrollWidth / 2;
      } else {
        setTimeout(setInitialPos, 100);
      }
    };
    setInitialPos();

    let raf: number;
    const animate = () => {
      if (!isPaused && el) {
        el.scrollLeft -= 0.8;
        if (el.scrollLeft <= 0) {
          el.scrollLeft = el.scrollWidth / 2;
        }
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isPaused]);

  return (
    <div className="pb-strip" id="people-buying">
      <div className="pb-strip-label">
        <Flame className="pb-strip-flame" />
        <span className="pb-strip-text">People are buying</span>
        <span className="pb-strip-dot" />
        <span className="pb-strip-live">Live</span>
      </div>
      <div
        className="pb-strip-scroll"
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="pb-strip-track">
          {allItems.map((item, i) => (
            <div key={`${item.id}-${i}`} className={`pb-strip-item ${i % 3 === 0 ? "pb-strip-item--highlight" : ""}`}>
              <div className="relative">
                <img src={item.imageUrl} alt={item.name} className="pb-strip-img" />
                {i % 3 === 0 && <span className="pb-strip-badge">New</span>}
              </div>
              <div className="pb-strip-info">
                <span className="pb-strip-name">{item.name}</span>
                <span className="pb-strip-buyer">{item.buyer} · {item.timeAgo}</span>
              </div>
              <span className="pb-strip-price">₦{(item.price / 100).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
