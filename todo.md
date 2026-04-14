# Libertas Marketplace TODO

## Design System & Setup
- [x] Define color palette (primary, secondary, accent, neutral, success, warning, error)
- [x] Set up typography (font family, sizes, weights, line heights)
- [x] Configure Tailwind CSS with custom theme tokens
- [x] Update global styles in index.css
- [x] Create reusable component variants and spacing system

## Database Schema
- [x] Create products table (id, name, description, price, category, supplier, image_url, stock, created_at)
- [x] Create categories table (id, name, slug)
- [x] Create orders table (id, user_id, total_price, status, created_at)
- [x] Create order_items table (id, order_id, product_id, quantity, price)
- [x] Create cart table (id, user_id, product_id, quantity)
- [x] Create affiliates table (id, user_id, status, commission_rate, total_earnings, approved_at)
- [x] Create referrals table (id, referrer_id, referred_user_id, status, created_at)
- [x] Create user_points table (id, user_id, balance, earned_total, redeemed_total)
- [x] Run migrations and verify schema

## Navigation & Layout
- [x] Build TopNav component with logo, category filters, search (optional), cart icon, profile menu
- [x] Implement category filter dropdown in navigation
- [x] Add cart item count badge to cart icon
- [x] Build profile menu with dashboard, affiliate (if applicable), and logout options
- [x] Create responsive mobile navigation (hamburger menu)
- [x] Set up route structure and authentication guards

## Product Catalog
- [x] Build product listing page with grid layout
- [x] Implement category filtering in catalog
- [x] Add product cards with image, price, description, and "Add to Cart" button
- [x] Implement add-to-cart functionality with cart state management
- [ ] Add product sorting (price, name, newest)
- [ ] Build product detail modal/page with full description, supplier info, and purchase CTA
- [x] Implement responsive design for mobile and tablet

## User Dashboard
- [x] Build dashboard layout with sidebar navigation
- [x] Create overview section showing points balance and referral earnings
- [x] Display unique referral link with copy-to-clipboard functionality
- [x] Show referral history (referred users, earnings, status)
- [ ] Integrate with Libertas Alpha API to fetch live points and referral data
- [x] Build affiliate sub-section (visible only to approved affiliates)
- [x] Affiliate sub-section: show referral tracking, commission rate, total earnings, payout history

## Affiliate System
- [ ] Create affiliate application form (in user dashboard)
- [x] Build affiliate approval workflow (admin panel)
- [x] Implement affiliate status tracking (pending, approved, rejected)
- [x] Display affiliate-specific metrics and payouts
- [ ] Create affiliate commission calculation logic
- [x] Build payout history view for affiliates

## Checkout Flow
- [x] Build cart page with product list, quantities, and totals
- [x] Implement remove/update quantity functionality
- [x] Create checkout step 1: shipping and billing information
- [x] Create checkout step 2: order review and confirmation
- [x] Create checkout step 3: order confirmation screen with order number
- [ ] Implement order creation and persistence
- [ ] Add order history to user dashboard

## Admin Panel
- [x] Build admin dashboard with product and affiliate management sections
- [x] Create product management: list, add, edit, delete products
- [x] Implement product form with image upload, pricing, description
- [x] Create affiliate approval interface with list of pending applications
- [x] Build affiliate approval/rejection workflow
- [x] Add admin-only route guards and role-based access control
- [ ] Create admin analytics view (optional: sales, top products, affiliate performance)

## Authentication & Authorization
- [x] Implement authentication guards for protected routes (dashboard, checkout, admin)
- [x] Set up public routes (catalog, product detail, home)
- [x] Create role-based access control (user vs admin)
- [x] Implement affiliate status checks for affiliate dashboard visibility
- [x] Add logout functionality

## Cart Management
- [x] Implement client-side cart state management (React Context or similar)
- [ ] Persist cart to database for logged-in users
- [ ] Sync cart on login/logout
- [x] Implement cart item count in navigation

## Testing & Polish
- [x] Write vitest tests for core features (cart, checkout, affiliate logic)
- [x] Test responsive design across devices
- [ ] Verify accessibility (keyboard navigation, ARIA labels)
- [ ] Optimize performance (lazy loading, code splitting)
- [ ] Polish animations and micro-interactions
- [ ] Verify all forms have proper validation and error handling

## Integration & Deployment
- [ ] Integrate with Libertas Alpha API for points and referral data
- [ ] Set up environment variables for API endpoints
- [ ] Test end-to-end user flows
- [ ] Create checkpoint before deployment
- [ ] Deploy to production

## Future Enhancements (Out of Scope)
- [ ] Payment processing integration (Stripe)
- [ ] Email notifications for orders and referrals
- [ ] Advanced analytics dashboard
- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Inventory management
- [ ] Multi-currency support
- [ ] Blockchain integration for smart contracts
