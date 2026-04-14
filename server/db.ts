import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, categories, cart, orders, affiliates, userPoints, referrals, referralEarnings } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Products
 */
export async function getProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products);
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}

export async function getProductsByCategory(categoryId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.categoryId, categoryId));
}

export async function getCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories);
}

/**
 * Cart
 */
export async function getUserCart(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cart).where(eq(cart.userId, userId));
}

export async function addToCart(userId: number, productId: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(cart)
    .where(and(eq(cart.userId, userId), eq(cart.productId, productId)))
    .limit(1);
  
  if (existing.length > 0) {
    await db.update(cart)
      .set({ quantity: existing[0].quantity + quantity })
      .where(eq(cart.id, existing[0].id));
  } else {
    await db.insert(cart).values({ userId, productId, quantity });
  }
}

export async function removeFromCart(cartId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cart).where(eq(cart.id, cartId));
}

export async function clearUserCart(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cart).where(eq(cart.userId, userId));
}

/**
 * Orders
 */
export async function createOrder(userId: number, totalPrice: number, shippingAddress: string, billingAddress: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const result = await db.insert(orders).values({
    userId,
    orderNumber,
    totalPrice,
    shippingAddress,
    billingAddress,
  });
  
  return result;
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.userId, userId));
}

/**
 * Affiliates
 */
export async function getAffiliateByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(affiliates).where(eq(affiliates.userId, userId)).limit(1);
  return result[0];
}

export async function createAffiliateApplication(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(affiliates).values({ userId, status: "pending" });
}

/**
 * User Points
 */
export async function getUserPoints(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userPoints).where(eq(userPoints.userId, userId)).limit(1);
  return result[0];
}

export async function createUserPoints(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(userPoints).values({ userId, balance: 0, earnedTotal: 0, redeemedTotal: 0 });
}

/**
 * Referrals
 */
export async function getReferralsByReferrer(referrerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(referrals).where(eq(referrals.referrerId, referrerId));
}

export async function getReferralEarnings(referralId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(referralEarnings).where(eq(referralEarnings.referralId, referralId));
}
