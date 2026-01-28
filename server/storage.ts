import { db } from "./db";
import { 
  users, ads, withdrawals, deposits,
  type User, type InsertUser, type Ad, type InsertAd, 
  type Withdrawal, type InsertWithdrawal, type Deposit, type InsertDeposit 
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { IAuthStorage } from "./replit_integrations/auth/storage";

export interface IStorage extends IAuthStorage {
  // User Ops (Extended)
  getUser(id: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  
  // Balance Ops
  addMilestoneReward(userId: string, amount: number): Promise<void>;
  addMilestoneAmount(userId: string, amount: number): Promise<void>;
  subtractMilestoneAmount(userId: string, amount: number): Promise<void>;
  incrementAdsCompleted(userId: string): Promise<void>;
  incrementRestrictedAds(userId: string): Promise<void>;
  resetAllMilestoneRewards(): Promise<void>;
  
  // Ads
  getAds(): Promise<Ad[]>;
  getAd(id: number): Promise<Ad | undefined>;
  createAd(ad: InsertAd): Promise<Ad>;
  updateAd(id: number, updates: Partial<InsertAd>): Promise<Ad>;
  deleteAd(id: number): Promise<void>;
  
  // Withdrawals
  getWithdrawals(userId?: string): Promise<Withdrawal[]>;
  getWithdrawal(id: number): Promise<Withdrawal | undefined>;
  createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal>;
  updateWithdrawalStatus(id: number, status: string, reason?: string): Promise<Withdrawal>;
  
  // Admin Ops
  setUserRestriction(userId: string, restriction: Partial<User>): Promise<User>;
  removeUserRestriction(userId: string): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // Auth Storage implementation
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // App Storage
  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async addMilestoneReward(userId: string, amount: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;
    const current = parseFloat(user.milestoneReward || "0");
    await this.updateUser(userId, { milestoneReward: (current + amount).toFixed(2) });
  }

  async addMilestoneAmount(userId: string, amount: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;
    const current = parseFloat(user.milestoneAmount || "0");
    await this.updateUser(userId, { milestoneAmount: (current + amount).toFixed(2) });
  }

  async subtractMilestoneAmount(userId: string, amount: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;
    const current = parseFloat(user.milestoneAmount || "0");
    await this.updateUser(userId, { milestoneAmount: (current - amount).toFixed(2) });
  }

  async incrementAdsCompleted(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;
    await this.updateUser(userId, { totalAdsCompleted: (user.totalAdsCompleted || 0) + 1 });
  }

  async incrementRestrictedAds(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;
    await this.updateUser(userId, { restrictedAdsCompleted: (user.restrictedAdsCompleted || 0) + 1 });
  }

  async resetAllMilestoneRewards(): Promise<void> {
    await db.update(users).set({ milestoneReward: "0" });
  }

  // Ads
  async getAds(): Promise<Ad[]> {
    return await db.select().from(ads).orderBy(desc(ads.createdAt));
  }

  async getAd(id: number): Promise<Ad | undefined> {
    const [ad] = await db.select().from(ads).where(eq(ads.id, id));
    return ad;
  }

  async createAd(ad: InsertAd): Promise<Ad> {
    const [newAd] = await db.insert(ads).values(ad).returning();
    return newAd;
  }

  async updateAd(id: number, updates: Partial<InsertAd>): Promise<Ad> {
    const [updated] = await db.update(ads).set(updates).where(eq(ads.id, id)).returning();
    return updated;
  }

  async deleteAd(id: number): Promise<void> {
    await db.delete(ads).where(eq(ads.id, id));
  }

  // Withdrawals
  async getWithdrawals(userId?: string): Promise<Withdrawal[]> {
    if (userId) {
      return await db.select().from(withdrawals).where(eq(withdrawals.userId, userId)).orderBy(desc(withdrawals.createdAt));
    }
    return await db.select().from(withdrawals).orderBy(desc(withdrawals.createdAt));
  }

  async getWithdrawal(id: number): Promise<Withdrawal | undefined> {
    const [w] = await db.select().from(withdrawals).where(eq(withdrawals.id, id));
    return w;
  }

  async createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal> {
    const [w] = await db.insert(withdrawals).values(withdrawal).returning();
    return w;
  }

  async updateWithdrawalStatus(id: number, status: string, reason?: string): Promise<Withdrawal> {
    const [w] = await db
      .update(withdrawals)
      .set({ status, reason })
      .where(eq(withdrawals.id, id))
      .returning();
    return w;
  }

  // Admin
  async setUserRestriction(userId: string, restriction: Partial<User>): Promise<User> {
    return await this.updateUser(userId, restriction);
  }

  async removeUserRestriction(userId: string): Promise<User> {
    return await this.updateUser(userId, {
      restrictionAdsLimit: null,
      restrictionDeposit: null,
      restrictionCommission: null,
      restrictedAdsCompleted: 0,
      pendingAmount: "0"
    });
  }
}

export const storage = new DatabaseStorage();
// Export authStorage for the auth module to use (aliased to same instance)
export const authStorage = storage;
