import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import cron from "node-cron";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // === ADS ===
  app.get(api.ads.list.path, isAuthenticated, async (req, res) => {
    const ads = await storage.getAds();
    res.json(ads);
  });

  app.post(api.ads.create.path, isAuthenticated, async (req, res) => {
    const user = req.user as any;
    // Check admin
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const input = api.ads.create.input.parse(req.body);
    const ad = await storage.createAd(input);
    res.status(201).json(ad);
  });

  app.put(api.ads.update.path, isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const id = parseInt(req.params.id);
    const input = api.ads.update.input.parse(req.body);
    const ad = await storage.updateAd(id, input);
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    res.json(ad);
  });

  app.delete(api.ads.delete.path, isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    await storage.deleteAd(parseInt(req.params.id));
    res.status(204).send();
  });

  // Ad Click Logic
  app.post(api.ads.click.path, isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const userId = user.claims.sub;
    const adId = parseInt(req.params.id);
    
    const dbUser = await storage.getUser(userId);
    if (!dbUser) return res.status(404).json({ message: "User not found" });
    if (dbUser.status !== 'active') return res.status(403).json({ message: "Account not active" });

    const ad = await storage.getAd(adId);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    let earning = 0;

    if (dbUser.restrictionAdsLimit && dbUser.restrictionAdsLimit > 0) {
      // PROMOTION MODE
      if ((dbUser.restrictedAdsCompleted || 0) >= dbUser.restrictionAdsLimit) {
        return res.status(400).json({ message: "Promotion completed" });
      }

      const commission = parseFloat(dbUser.restrictionCommission || "0");
      earning = commission;
      
      await storage.addMilestoneReward(userId, commission);
      await storage.incrementRestrictedAds(userId);
      await storage.incrementAdsCompleted(userId);
    } else {
      // NORMAL MODE
      const commission = parseFloat(ad.price || "0");
      earning = commission;
      
      await storage.addMilestoneReward(userId, commission);
      await storage.addMilestoneAmount(userId, commission);
      await storage.incrementAdsCompleted(userId);
    }

    res.json({ success: true, earnings: earning.toFixed(2) });
  });

  // === WITHDRAWALS ===
  app.get(api.withdrawals.list.path, isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    
    if (dbUser?.isAdmin) {
      const all = await storage.getWithdrawals();
      return res.json(all);
    }
    
    const myWithdrawals = await storage.getWithdrawals(user.claims.sub);
    res.json(myWithdrawals);
  });

  app.post(api.withdrawals.create.path, isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const userId = user.claims.sub;
    const dbUser = await storage.getUser(userId);
    if (!dbUser) return res.status(404).json({ message: "User not found" });

    const input = api.withdrawals.create.input.parse(req.body);
    const amount = parseFloat(input.amount);
    const balance = parseFloat(dbUser.milestoneAmount || "0");

    if (amount > balance) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const withdrawal = await storage.createWithdrawal({
      ...input,
      userId,
      status: "pending"
    });
    
    res.status(201).json(withdrawal);
  });

  app.post(api.withdrawals.approve.path, isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const id = parseInt(req.params.id);
    const withdrawal = await storage.getWithdrawal(id);
    if (!withdrawal) return res.status(404).json({ message: "Withdrawal not found" });
    if (withdrawal.status !== "pending") return res.status(400).json({ message: "Already processed" });

    // Deduct balance
    const wAmount = parseFloat(withdrawal.amount);
    await storage.subtractMilestoneAmount(withdrawal.userId, wAmount);
    
    const updated = await storage.updateWithdrawalStatus(id, "approved");
    res.json(updated);
  });

  app.post(api.withdrawals.reject.path, isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const id = parseInt(req.params.id);
    const { reason } = req.body;
    
    const updated = await storage.updateWithdrawalStatus(id, "rejected", reason);
    res.json(updated);
  });

  // === ADMIN USERS ===
  app.get(api.users.list.path, isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const users = await storage.getUsers();
    res.json(users);
  });

  app.get(api.users.get.path, isAuthenticated, async (req, res) => {
    // Users can see their own, admins can see anyone
    const user = req.user as any;
    const targetId = req.params.id;
    const dbUser = await storage.getUser(user.claims.sub);
    
    if (targetId !== user.claims.sub && !dbUser?.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const targetUser = await storage.getUser(targetId);
    if (!targetUser) return res.status(404).json({ message: "User not found" });
    res.json(targetUser);
  });

  app.patch(api.users.updateStatus.path, isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const targetId = req.params.id;
    const { status } = req.body;
    const updated = await storage.updateUser(targetId, { status });
    res.json(updated);
  });

  app.post(api.users.restrict.path, isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const targetId = req.params.id;
    const { adsLimit, deposit, commission, pendingAmount } = req.body;
    
    const updated = await storage.setUserRestriction(targetId, {
      restrictionAdsLimit: adsLimit,
      restrictionDeposit: deposit,
      restrictionCommission: commission,
      pendingAmount: pendingAmount || "0",
      restrictedAdsCompleted: 0
    });
    res.json(updated);
  });

  app.post(api.users.unrestrict.path, isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const updated = await storage.removeUserRestriction(req.params.id);
    res.json(updated);
  });

  app.post(api.users.deposit.path, isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const targetId = req.params.id;
    const { amount } = req.body;
    await storage.addMilestoneAmount(targetId, parseFloat(amount));
    const updated = await storage.getUser(targetId);
    res.json(updated);
  });

  app.post(api.users.resetField.path, isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const targetId = req.params.id;
    const { field } = req.body;
    
    // Allowed fields to reset
    const allowed = [
      "milestoneAmount", "milestoneReward", "destinationAmount", 
      "ongoingMilestone", "totalAdsCompleted", "points", 
      "restrictedAdsCompleted"
    ];

    if (!allowed.includes(field)) {
      return res.status(400).json({ message: "Field not allowed" });
    }

    const updates: any = {};
    updates[field] = field.includes("Amount") || field.includes("Reward") ? "0" : 0;
    
    const updated = await storage.updateUser(targetId, updates);
    res.json(updated);
  });

  // Cron Job for Daily Reset
  cron.schedule('0 0 * * *', async () => {
    console.log("Running daily reset...");
    await storage.resetAllMilestoneRewards();
  });

  // Load Seed Data
  import("./seed").catch(console.error);

  return httpServer;
}
