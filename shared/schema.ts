import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

// === ADS TABLE ===
export const ads = pgTable("ads", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  targetUrl: text("target_url").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// === WITHDRAWALS TABLE ===
export const withdrawals = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: text("method").notNull(), // Bank Transfer, etc.
  accountDetails: text("account_details").notNull(),
  status: text("status").default("pending"), // pending, approved, rejected
  reason: text("reason"), // rejection reason
  createdAt: timestamp("created_at").defaultNow(),
});

// === DEPOSITS/TRANSACTIONS TABLE (Optional but good for history) ===
// Guide focuses on updating user balance, but tracking deposits is standard.
export const deposits = pgTable("deposits", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // "deposit", "manual_add", "admin_bonus"
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===
export const insertAdSchema = createInsertSchema(ads).omit({ id: true, createdAt: true });
export const insertWithdrawalSchema = createInsertSchema(withdrawals).omit({ id: true, userId: true, status: true, reason: true, createdAt: true });
export const insertDepositSchema = createInsertSchema(deposits).omit({ id: true, createdAt: true });

// === TYPES ===
export type Ad = typeof ads.$inferSelect;
export type InsertAd = z.infer<typeof insertAdSchema>;
export type Withdrawal = typeof withdrawals.$inferSelect;
export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;
export type Deposit = typeof deposits.$inferSelect;
export type InsertDeposit = z.infer<typeof insertDepositSchema>;
