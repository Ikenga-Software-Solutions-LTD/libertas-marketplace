import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import TopNav from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

type CheckoutStep = "cart" | "shipping" | "review" | "confirmation";

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [orderNumber, setOrderNumber] = useState("");

  const [shippingData, setShippingData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [billingData, setBillingData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [useSameAddress, setUseSameAddress] = useState(true);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <main className="container flex items-center justify-center py-20">
          <Card className="max-w-md p-8 text-center">
            <h2 className="mb-4 font-display text-2xl font-bold">Sign In Required</h2>
            <p className="mb-6 text-muted-foreground">
              Please sign in to proceed with checkout.
            </p>
            <Link href="/">
              <a className="inline-block">
                <Button>Return to Catalog</Button>
              </a>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBillingData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    // Generate order number
    const newOrderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setOrderNumber(newOrderNumber);
    clearCart();
    setStep("confirmation");
    toast.success("Order placed successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav cartCount={totalItems} />

      <main className="container py-12">
        {/* Progress Indicator */}
        <div className="mb-12 flex items-center justify-between">
          {["cart", "shipping", "review", "confirmation"].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                  step === s
                    ? "bg-primary text-white"
                    : ["cart", "shipping", "review"].includes(s) && ["cart", "shipping", "review", "confirmation"].indexOf(step) > idx
                    ? "bg-success text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {idx + 1}
              </div>
              {idx < 3 && (
                <div
                  className={`mx-2 h-1 w-16 ${
                    ["cart", "shipping", "review"].indexOf(step) > idx
                      ? "bg-success"
                      : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Cart Step */}
        {step === "cart" && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="mb-6 font-display text-2xl font-bold">Shopping Cart</h2>
              {items.length > 0 ? (
                <div className="space-y-4">
                  {items.map((item) => (
                    <Card key={item.id} className="flex items-center gap-4 p-4">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ₦{(item.price / 100).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="mb-4 text-muted-foreground">Your cart is empty</p>
                  <Link href="/catalog">
                    <a>
                      <Button variant="outline">Continue Shopping</Button>
                    </a>
                  </Link>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-20 p-6">
                <h3 className="mb-4 font-semibold">Order Summary</h3>
                <div className="space-y-2 border-b border-border pb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₦{(totalPrice / 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>₦0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₦0.00</span>
                  </div>
                </div>
                <div className="my-4 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₦{(totalPrice / 100).toLocaleString()}</span>
                </div>
                <Button
                  onClick={() => setStep("shipping")}
                  disabled={items.length === 0}
                  className="w-full"
                >
                  Proceed to Shipping
                </Button>
              </Card>
            </div>
          </div>
        )}

        {/* Shipping Step */}
        {step === "shipping" && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="mb-6 font-display text-2xl font-bold">Shipping Information</h2>
              <Card className="p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={shippingData.fullName}
                      onChange={handleShippingChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={shippingData.email}
                      onChange={handleShippingChange}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleShippingChange}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={shippingData.address}
                      onChange={handleShippingChange}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingData.city}
                      onChange={handleShippingChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={shippingData.state}
                      onChange={handleShippingChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={shippingData.zipCode}
                      onChange={handleShippingChange}
                    />
                  </div>
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <h3 className="mb-4 font-semibold">Billing Address</h3>
                  <div className="mb-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="useSameAddress"
                      checked={useSameAddress}
                      onChange={(e) => setUseSameAddress(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="useSameAddress" className="cursor-pointer">
                      Same as shipping address
                    </Label>
                  </div>

                  {!useSameAddress && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Label htmlFor="billingAddress">Address</Label>
                        <Textarea
                          id="billingAddress"
                          name="address"
                          value={billingData.address}
                          onChange={handleBillingChange}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingCity">City</Label>
                        <Input
                          id="billingCity"
                          name="city"
                          value={billingData.city}
                          onChange={handleBillingChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingState">State</Label>
                        <Input
                          id="billingState"
                          name="state"
                          value={billingData.state}
                          onChange={handleBillingChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingZipCode">Zip Code</Label>
                        <Input
                          id="billingZipCode"
                          name="zipCode"
                          value={billingData.zipCode}
                          onChange={handleBillingChange}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="flex flex-col gap-4">
              <Card className="sticky top-20 p-6">
                <h3 className="mb-4 font-semibold">Order Summary</h3>
                <div className="mb-4 space-y-2 border-b border-border pb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₦{(totalPrice / 100).toLocaleString()}</span>
                  </div>
                </div>
                <div className="mb-6 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₦{(totalPrice / 100).toLocaleString()}</span>
                </div>
              </Card>
              <Button onClick={() => setStep("review")}>Review Order</Button>
              <Button variant="outline" onClick={() => setStep("cart")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </div>
        )}

        {/* Review Step */}
        {step === "review" && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="mb-6 font-display text-2xl font-bold">Order Review</h2>

              <div className="space-y-6">
                {/* Shipping Summary */}
                <Card className="p-6">
                  <h3 className="mb-4 font-semibold">Shipping Address</h3>
                  <p>{shippingData.fullName}</p>
                  <p>{shippingData.address}</p>
                  <p>
                    {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{shippingData.email}</p>
                  <p className="text-sm text-muted-foreground">{shippingData.phone}</p>
                </Card>

                {/* Items Summary */}
                <Card className="p-6">
                  <h3 className="mb-4 font-semibold">Order Items</h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          ₦{((item.price * item.quantity) / 100).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Card className="sticky top-20 p-6">
                <h3 className="mb-4 font-semibold">Order Summary</h3>
                <div className="mb-4 space-y-2 border-b border-border pb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₦{(totalPrice / 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>₦0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₦0.00</span>
                  </div>
                </div>
                <div className="mb-6 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₦{(totalPrice / 100).toLocaleString()}</span>
                </div>
              </Card>
              <Button onClick={handlePlaceOrder}>Place Order</Button>
              <Button variant="outline" onClick={() => setStep("shipping")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </div>
        )}

        {/* Confirmation Step */}
        {step === "confirmation" && (
          <div className="flex items-center justify-center">
            <Card className="max-w-md p-8 text-center">
              <CheckCircle className="mx-auto mb-4 h-16 w-16 text-success" />
              <h2 className="mb-2 font-display text-2xl font-bold">Order Confirmed!</h2>
              <p className="mb-4 text-muted-foreground">
                Thank you for your purchase. Your order has been placed successfully.
              </p>
              <div className="mb-6 rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-mono font-semibold">{orderNumber}</p>
              </div>
              <Link href="/catalog">
                <a>
                  <Button className="w-full">Continue Shopping</Button>
                </a>
              </Link>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
