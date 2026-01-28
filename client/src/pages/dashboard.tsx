import { useAuth } from "@/hooks/use-auth";
import { useAds, useClickAd } from "@/hooks/use-ads";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Wallet, TrendingUp, CheckCircle, Clock, Play, Home, Settings, 
  LayoutGrid, CreditCard, HelpCircle, LogOut, ChevronRight, Zap,
  DollarSign, Eye, Gift, Star, ArrowRight
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

const sidebarItems = [
  { icon: LayoutGrid, label: "Dashboard", path: "/dashboard" },
  { icon: Play, label: "Watch Ads", path: "/dashboard" },
  { icon: Wallet, label: "Withdrawals", path: "/withdrawals" },
  { icon: CreditCard, label: "Transactions", path: "/transactions" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const adCategories = ["All Ads", "Featured", "High Reward", "Quick Watch", "New"];

export default function Dashboard() {
  const { user, isLoading: isUserLoading } = useAuth();
  const { data: ads, isLoading: isAdsLoading } = useAds();
  const { mutate: clickAd, isPending: isClicking } = useClickAd();
  const [activeCategory, setActiveCategory] = useState("All Ads");
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (ads && ads.length > 0) {
      const timer = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [ads]);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isUserLoading || isAdsLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex">
        <div className="w-20 bg-zinc-900" />
        <div className="flex-1 p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48 bg-zinc-800" />
            <div className="grid grid-cols-3 gap-6">
              <Skeleton className="h-64 bg-zinc-800 rounded-2xl" />
              <Skeleton className="h-64 bg-zinc-800 rounded-2xl col-span-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userData = user as any || {};
  const balance = Number(userData.milestoneAmount || 0).toFixed(2);
  const dailyReward = Number(userData.milestoneReward || 0).toFixed(2);
  const totalAds = userData.totalAdsCompleted || 0;
  const pendingAmount = Number(userData.pendingAmount || 0).toFixed(2);
  const firstName = userData.firstName || "User";

  const featuredAd = ads?.[currentAdIndex];

  return (
    <div className="min-h-screen bg-zinc-950 flex text-white font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -80 }}
        animate={{ x: 0 }}
        className="w-20 bg-zinc-900/50 backdrop-blur-xl border-r border-zinc-800/50 flex flex-col items-center py-6 fixed h-full z-50"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center mb-8"
        >
          <span className="text-white font-bold text-lg">O</span>
        </motion.div>

        <nav className="flex-1 flex flex-col items-center gap-2">
          {sidebarItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLocation(item.path)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                item.path === "/dashboard" 
                  ? "bg-orange-500 text-white" 
                  : "text-zinc-400 hover:text-white"
              }`}
              data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
            >
              <item.icon className="w-5 h-5" />
            </motion.button>
          ))}
        </nav>

        <div className="mt-auto flex flex-col items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <HelpCircle className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-all"
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5" />
          </motion.button>
          <Avatar className="w-10 h-10 border-2 border-orange-500">
            <AvatarImage src={userData.profileImageUrl} />
            <AvatarFallback className="bg-zinc-700 text-white text-sm">
              {firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 ml-20 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold mb-1">Hi {firstName}!</h1>
              <p className="text-zinc-400">Welcome back to your earnings dashboard</p>
            </div>
            
            {/* Category Tabs */}
            <div className="flex items-center gap-2">
              {adCategories.slice(0, 4).map((cat, i) => (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-white text-black"
                      : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
                  data-testid={`tab-${cat.toLowerCase().replace(' ', '-')}`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Stats */}
            <div className="space-y-6">
              {/* Balance Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border-zinc-700/50 backdrop-blur-xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                          <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-zinc-400 text-sm">Total Balance</p>
                          <h3 className="text-2xl font-bold text-white">LKR {balance}</h3>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-xl p-4 border border-cyan-500/20"
                      >
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-2">
                          <Zap className="w-4 h-4 text-cyan-400" />
                        </div>
                        <p className="text-xl font-bold text-white">LKR {dailyReward}</p>
                        <p className="text-xs text-zinc-400">TODAY</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-4 border border-purple-500/20"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-2">
                          <TrendingUp className="w-4 h-4 text-purple-400" />
                        </div>
                        <p className="text-xl font-bold text-white">{totalAds}</p>
                        <p className="text-xs text-zinc-400">ADS WATCHED</p>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-white mb-4">Earnings Summary</h3>
                    <p className="text-sm text-zinc-400 mb-4">Track your earnings progress</p>
                    
                    <div className="space-y-3">
                      {[
                        { icon: Eye, label: "Ads Viewed", value: `${totalAds}`, color: "text-blue-400" },
                        { icon: DollarSign, label: "Pending", value: `LKR ${pendingAmount}`, color: "text-amber-400" },
                        { icon: Gift, label: "Bonus", value: "LKR 0.00", color: "text-green-400" },
                      ].map((item, i) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + (i * 0.1) }}
                          whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.02)" }}
                          className="flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center ${item.color}`}>
                              <item.icon className="w-4 h-4" />
                            </div>
                            <span className="text-zinc-300 text-sm">{item.label}</span>
                          </div>
                          <span className="text-white font-medium text-sm">{item.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Featured Ad & Grid */}
            <div className="lg:col-span-2 space-y-6">
              {/* Featured Ad Hero */}
              <AnimatePresence mode="wait">
                {featuredAd && (
                  <motion.div
                    key={featuredAd.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="relative rounded-2xl overflow-hidden h-[320px] group cursor-pointer"
                    onClick={() => {
                      window.open(featuredAd.targetUrl, "_blank");
                      clickAd(featuredAd.id);
                    }}
                  >
                    <img 
                      src={featuredAd.imageUrl} 
                      alt={featuredAd.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Live Badge */}
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 px-3 py-1.5 rounded-full"
                    >
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-xs font-bold text-white">LIVE</span>
                    </motion.div>

                    {/* Stats Overlay */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      {[
                        { icon: Star, value: "4.8" },
                        { icon: Eye, value: "1.2k" },
                        { icon: Zap, value: `${Number(featuredAd.price).toFixed(0)} LKR` },
                      ].map((stat, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + (i * 0.1) }}
                          className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full text-xs text-white"
                        >
                          <stat.icon className="w-3 h-3" />
                          <span>{stat.value}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Bottom Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-end justify-between">
                        <div className="flex items-center gap-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-14 h-14 rounded-full bg-white flex items-center justify-center"
                          >
                            <Play className="w-6 h-6 text-black fill-black ml-1" />
                          </motion.button>
                          <div>
                            <p className="text-white font-bold text-lg">{featuredAd.title}</p>
                            <p className="text-zinc-300 text-sm">{featuredAd.description}</p>
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-2 text-white"
                        >
                          <span className="text-sm">Watch Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Ad Indicators */}
              {ads && ads.length > 0 && (
                <div className="flex justify-center gap-2">
                  {ads.slice(0, 5).map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setCurrentAdIndex(i)}
                      whileHover={{ scale: 1.2 }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentAdIndex ? "w-6 bg-orange-500" : "bg-zinc-600"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Ad Grid */}
              <div className="grid grid-cols-3 gap-4">
                {ads?.slice(0, 3).map((ad, i) => (
                  <motion.div
                    key={ad.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className="relative rounded-xl overflow-hidden h-40 group cursor-pointer"
                    onClick={() => {
                      window.open(ad.targetUrl, "_blank");
                      clickAd(ad.id);
                    }}
                    data-testid={`ad-card-${ad.id}`}
                  >
                    <img 
                      src={ad.imageUrl} 
                      alt={ad.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-medium text-sm truncate">{ad.title}</p>
                      <p className="text-zinc-400 text-xs">Earn {Number(ad.price).toFixed(2)} LKR</p>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center"
                    >
                      <Play className="w-4 h-4 text-white fill-white" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {(!ads || ads.length === 0) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-zinc-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No ads available</h3>
                  <p className="text-zinc-400">Check back later for more earning opportunities</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
