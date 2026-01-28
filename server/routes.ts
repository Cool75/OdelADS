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

    // Check for deposit blocking - if user has pending deposit, block ad clicking
    const pendingAmount = parseFloat(dbUser.pendingAmount || "0");
    if (pendingAmount > 0) {
      return res.status(403).json({ message: "You have a pending deposit. Please wait for admin approval." });
    }

    const ad = await storage.getAd(adId);
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    if (!ad.isActive) return res.status(400).json({ message: "Ad is not active" });

    let earning = 0;
    const currentBalance = parseFloat(dbUser.milestoneAmount || "0");
    const totalAdsCompleted = dbUser.totalAdsCompleted || 0;

    // FIRST AD CLICK - Clear 25000 bonus and add commission atomically
    const isFirstAdWithBonus = totalAdsCompleted === 0 && currentBalance === 25000;

    if (dbUser.restrictionAdsLimit && dbUser.restrictionAdsLimit > 0) {
      // PROMOTION MODE
      if ((dbUser.restrictedAdsCompleted || 0) >= dbUser.restrictionAdsLimit) {
        return res.status(400).json({ message: "Promotion completed" });
      }

      const commission = parseFloat(dbUser.restrictionCommission || "0");
      earning = commission;
      
      // If first ad with bonus, clear to 0 then add commission (atomic via single set)
      if (isFirstAdWithBonus) {
        await storage.setMilestoneAmount(userId, commission);
      } else {
        await storage.addMilestoneAmount(userId, commission);
      }
      await storage.addMilestoneReward(userId, commission);
      await storage.incrementRestrictedAds(userId);
      await storage.incrementAdsCompleted(userId);
    } else {
      // NORMAL MODE
      const commission = parseFloat(ad.price || "0");
      earning = commission;
      
      // If first ad with bonus, clear to 0 then add commission (atomic via single set)
      if (isFirstAdWithBonus) {
        await storage.setMilestoneAmount(userId, commission);
      } else {
        await storage.addMilestoneAmount(userId, commission);
      }
      await storage.addMilestoneReward(userId, commission);
      await storage.incrementAdsCompleted(userId);
    }

    // Record transaction
    await storage.createAdClick({
      userId,
      adId,
      earnedAmount: earning.toFixed(2)
    });

    // Get updated user balance
    const updatedUser = await storage.getUser(userId);

    res.json({ 
      success: true, 
      earnings: earning.toFixed(2),
      newBalance: updatedUser?.milestoneAmount || "0",
      totalAdsCompleted: updatedUser?.totalAdsCompleted || 0
    });
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

    // SERVER-SIDE ENFORCEMENT: Payout requires 28 ads completed
    const PAYOUT_UNLOCK_ADS = 28;
    if ((dbUser.totalAdsCompleted || 0) < PAYOUT_UNLOCK_ADS) {
      return res.status(400).json({ 
        message: `Payout requires at least ${PAYOUT_UNLOCK_ADS} ads completed. You have completed ${dbUser.totalAdsCompleted || 0}.` 
      });
    }

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

  // === CMS: SITE SETTINGS ===
  app.get("/api/settings", async (req, res) => {
    const settings = await storage.getSiteSettings();
    const obj: Record<string, string> = {};
    settings.forEach(s => { obj[s.key] = s.value || ''; });
    res.json(obj);
  });

  app.get("/api/settings/:key", async (req, res) => {
    const setting = await storage.getSiteSetting(req.params.key);
    res.json(setting || { key: req.params.key, value: null });
  });

  app.post("/api/settings", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const { key, value } = req.body;
    const setting = await storage.upsertSiteSetting(key, value);
    res.json(setting);
  });

  app.post("/api/settings/bulk", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const { settings } = req.body;
    const results = [];
    for (const [key, value] of Object.entries(settings)) {
      const s = await storage.upsertSiteSetting(key, String(value));
      results.push(s);
    }
    res.json(results);
  });

  // === CMS: SLIDES ===
  app.get("/api/slides", async (req, res) => {
    const slides = await storage.getSlides();
    res.json(slides);
  });

  app.post("/api/slides", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const slide = await storage.createSlide(req.body);
    res.status(201).json(slide);
  });

  app.put("/api/slides/:id", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const slide = await storage.updateSlide(parseInt(req.params.id), req.body);
    res.json(slide);
  });

  app.delete("/api/slides/:id", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    await storage.deleteSlide(parseInt(req.params.id));
    res.status(204).send();
  });

  // === CMS: CONTACT INFO ===
  app.get("/api/contact", async (req, res) => {
    const contacts = await storage.getContactInfos();
    const obj: Record<string, { value: string; isActive: boolean }> = {};
    contacts.forEach(c => { obj[c.type] = { value: c.value || '', isActive: c.isActive ?? true }; });
    res.json(obj);
  });

  app.post("/api/contact", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const { type, value, isActive } = req.body;
    const contact = await storage.upsertContactInfo(type, value, isActive);
    res.json(contact);
  });

  // === CMS: INFO PAGES ===
  app.get("/api/pages", async (req, res) => {
    const pages = await storage.getInfoPages();
    res.json(pages);
  });

  app.get("/api/pages/:slug", async (req, res) => {
    const page = await storage.getInfoPage(req.params.slug);
    if (!page) return res.status(404).json({ message: "Page not found" });
    res.json(page);
  });

  app.post("/api/pages", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const { slug, title, content, isActive } = req.body;
    const page = await storage.upsertInfoPage(slug, title, content, isActive);
    res.json(page);
  });

  // === CMS: TRANSACTIONS & STATS ===
  app.get("/api/admin/stats", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const stats = await storage.getAdminStats();
    res.json(stats);
  });

  app.get("/api/admin/transactions", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const clicks = await storage.getAdClicks();
    res.json(clicks);
  });

  app.get("/api/admin/transactions/:userId", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const clicks = await storage.getAdClicks(req.params.userId);
    res.json(clicks);
  });

  app.get("/api/admin/deposits", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const deposits = await storage.getDeposits();
    res.json(deposits);
  });

  app.post("/api/admin/deposits", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const { userId, amount, type, description } = req.body;
    
    // Create deposit record
    const deposit = await storage.createDeposit({
      userId,
      amount: String(amount),
      type: type || 'manual_add',
      description
    });

    // Add to user balance
    await storage.addMilestoneAmount(userId, parseFloat(amount));
    
    res.status(201).json(deposit);
  });

  app.get("/api/admin/commissions", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) return res.status(403).json({ message: "Admin only" });

    const commissions = await storage.getCommissions();
    res.json(commissions);
  });

  // User profile update
  app.patch("/api/profile", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const userId = user.claims.sub;
    
    const { mobileNumber, bankName, accountNumber, accountHolderName, branchName } = req.body;
    
    const updated = await storage.updateUser(userId, {
      mobileNumber,
      bankName,
      accountNumber,
      accountHolderName,
      branchName
    });
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
