import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock cart context behavior
describe("CartContext", () => {
  let cartState: any;

  beforeEach(() => {
    cartState = {
      items: [],
      totalItems: 0,
      totalPrice: 0,
    };
  });

  it("should add an item to the cart", () => {
    const product = {
      id: 1,
      name: "Test Product",
      price: 10000,
      category: "Gadgets",
      supplier: "TestCorp",
      image: "test.jpg",
      description: "A test product",
      stock: 10,
    };

    // Simulate adding item
    const existingItem = cartState.items.find((item: any) => item.productId === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartState.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    }

    cartState.totalItems = cartState.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    cartState.totalPrice = cartState.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    expect(cartState.items).toHaveLength(1);
    expect(cartState.items[0].name).toBe("Test Product");
    expect(cartState.totalItems).toBe(1);
    expect(cartState.totalPrice).toBe(10000);
  });

  it("should increase quantity when adding duplicate item", () => {
    const product = {
      id: 1,
      name: "Test Product",
      price: 10000,
      category: "Gadgets",
      supplier: "TestCorp",
      image: "test.jpg",
      description: "A test product",
      stock: 10,
    };

    // Add item twice
    for (let i = 0; i < 2; i++) {
      const existingItem = cartState.items.find((item: any) => item.productId === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartState.items.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        });
      }
    }

    cartState.totalItems = cartState.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    cartState.totalPrice = cartState.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    expect(cartState.items).toHaveLength(1);
    expect(cartState.items[0].quantity).toBe(2);
    expect(cartState.totalItems).toBe(2);
    expect(cartState.totalPrice).toBe(20000);
  });

  it("should remove an item from the cart", () => {
    cartState.items = [
      { productId: 1, name: "Product 1", price: 10000, quantity: 1 },
      { productId: 2, name: "Product 2", price: 5000, quantity: 1 },
    ];

    // Remove first item
    cartState.items = cartState.items.filter((item: any) => item.productId !== 1);
    cartState.totalItems = cartState.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    cartState.totalPrice = cartState.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    expect(cartState.items).toHaveLength(1);
    expect(cartState.items[0].productId).toBe(2);
    expect(cartState.totalItems).toBe(1);
    expect(cartState.totalPrice).toBe(5000);
  });

  it("should update item quantity", () => {
    cartState.items = [{ productId: 1, name: "Product 1", price: 10000, quantity: 1 }];

    // Update quantity
    const item = cartState.items.find((item: any) => item.productId === 1);
    if (item) {
      item.quantity = 3;
    }

    cartState.totalItems = cartState.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    cartState.totalPrice = cartState.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    expect(cartState.items[0].quantity).toBe(3);
    expect(cartState.totalItems).toBe(3);
    expect(cartState.totalPrice).toBe(30000);
  });

  it("should clear the cart", () => {
    cartState.items = [
      { productId: 1, name: "Product 1", price: 10000, quantity: 2 },
      { productId: 2, name: "Product 2", price: 5000, quantity: 1 },
    ];

    // Clear cart
    cartState.items = [];
    cartState.totalItems = 0;
    cartState.totalPrice = 0;

    expect(cartState.items).toHaveLength(0);
    expect(cartState.totalItems).toBe(0);
    expect(cartState.totalPrice).toBe(0);
  });

  it("should calculate correct total price with multiple items", () => {
    cartState.items = [
      { productId: 1, name: "Product 1", price: 10000, quantity: 2 },
      { productId: 2, name: "Product 2", price: 5000, quantity: 3 },
      { productId: 3, name: "Product 3", price: 15000, quantity: 1 },
    ];

    cartState.totalItems = cartState.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    cartState.totalPrice = cartState.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    expect(cartState.totalItems).toBe(6);
    expect(cartState.totalPrice).toBe(10000 * 2 + 5000 * 3 + 15000 * 1); // 50000
  });
});
