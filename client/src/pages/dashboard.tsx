import { useAuth } from "@/hooks/use-auth";
import { useAds, useClickAd } from "@/hooks/use-ads";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Wallet, TrendingUp, CheckCircle, Clock, Play, Home, Settings, 
  LayoutGrid, CreditCard, HelpCircle, LogOut, ChevronRight, Zap,
  DollarSign, Eye, Gift, Star, ArrowRight, Gem, Target, CircleDollarSign, 
  Crown, Phone, PartyPopper, LucideIcon, Mail, MapPin, ChevronUp,
  Facebook, Twitter, Instagram, Youtube
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

const sidebarItems = [
  { icon: LayoutGrid, label: "Dashboard", path: "/" },
  { icon: Gem, label: "Exclusives", path: "/exclusives" },
  { icon: Target, label: "Ad's Hub", path: "/ads-hub" },
  { icon: Wallet, label: "Payouts", path: "/withdrawals" },
  { icon: Crown, label: "Status", path: "/status" },
  { icon: PartyPopper, label: "Events", path: "/events" },
  { icon: Phone, label: "Contact", path: "/contact" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Dashboard() {
  const { user, isLoading: isUserLoading } = useAuth();
  const { data: ads, isLoading: isAdsLoading } = useAds();
  const { mutate: clickAd, isPending: isClicking } = useClickAd();
  const [activeSidebar, setActiveSidebar] = useState("/");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch site settings
  const { data: settings } = useQuery<Record<string, string>>({
    queryKey: ["/api/settings"],
  });

  // Fetch slides
  const { data: slides } = useQuery<any[]>({
    queryKey: ["/api/slides"],
  });

  // Countdown timer state
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(23, 59, 59, 999);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Slide rotation
  useEffect(() => {
    if (slides && slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides]);

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isUserLoading || isAdsLoading) {
    return (
      <div className="min-h-screen bg-black flex">
        <div className="w-20 bg-zinc-900" />
        <div className="flex-1 p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48 bg-zinc-800" />
            <Skeleton className="h-32 bg-zinc-800 rounded-2xl" />
            <Skeleton className="h-64 bg-zinc-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const userData = user as any || {};
  const firstName = userData.firstName || "User";
  const username = userData.username || userData.email?.split('@')[0] || "user";
  const status = userData.status || "active";
  const totalAds = userData.totalAdsCompleted || 0;
  const PAYOUT_UNLOCK_ADS = 28;
  const canRequestPayout = totalAds >= PAYOUT_UNLOCK_ADS;

  const marqueeText = settings?.marqueeText || "EARN MORE TODAY >>> CLICK ADS & WIN >>> RATING ADS >>> EARN MORE TODAY >>> CLICK ADS & WIN";
  const flashSaleTitle = settings?.flashSaleTitle || "Flash";
  const flashSaleSubtitle = settings?.flashSaleSubtitle || "Sale";
  const flashSaleDescription = settings?.flashSaleDescription || "Limited time offer - Don't miss out!";
  const eventTitle = settings?.eventTitle || "Event Space";
  const eventDescription = settings?.eventDescription || "Join exclusive events, webinars, and community gatherings.";
  const eventImage = settings?.eventImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800";
  const contactPhone = settings?.contactPhone || "+94 11 123 4567";
  const contactEmail = settings?.contactEmail || "support@odelads.com";
  const contactAddress = settings?.contactAddress || "123 Business Street, Colombo, Sri Lanka";
  const copyrightText = settings?.copyrightText || "Copyright 2026 ODEL-ADS. All rights reserved.";

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={{ width: 80 }}
        animate={{ width: sidebarExpanded ? 200 : 80 }}
        transition={{ duration: 0.3 }}
        className="bg-zinc-900/50 backdrop-blur-xl border-r border-zinc-800/50 flex flex-col py-6 fixed h-full z-50"
      >
        <motion.button 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center mb-8 mx-auto cursor-pointer"
        >
          <span className="text-white font-bold text-lg">O</span>
        </motion.button>

        <nav className="flex-1 flex flex-col gap-2 px-3">
          {sidebarItems
            .filter(item => item.label !== "Payouts" || canRequestPayout)
            .map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveSidebar(item.path);
                setLocation(item.path);
              }}
              className={`h-12 rounded-xl flex items-center gap-3 transition-all ${
                sidebarExpanded ? "px-4" : "justify-center"
              } ${
                activeSidebar === item.path 
                  ? "bg-orange-500 text-white" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
              data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarExpanded && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2 px-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className={`h-12 rounded-xl flex items-center gap-3 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-all ${
              sidebarExpanded ? "px-4" : "justify-center"
            }`}
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarExpanded && (
              <span className="text-sm font-medium whitespace-nowrap">Sign Out</span>
            )}
          </motion.button>
          <div className={`flex items-center gap-3 ${sidebarExpanded ? "px-2" : "justify-center"}`}>
            <Avatar className="w-10 h-10 border-2 border-orange-500 flex-shrink-0">
              <AvatarImage src={userData.profileImageUrl} />
              <AvatarFallback className="bg-zinc-700 text-white text-sm">
                {firstName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {sidebarExpanded && (
              <span className="text-sm font-medium text-white truncate">{firstName}</span>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content - Scrollable */}
      <motion.main 
        animate={{ marginLeft: sidebarExpanded ? 200 : 80 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        {/* Marquee Banner */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 py-2 overflow-hidden">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="flex whitespace-nowrap"
          >
            <span className="text-white font-bold text-sm flex items-center gap-2">
              {marqueeText.split('>>>').map((text, i) => (
                <span key={i} className="flex items-center gap-2">
                  {text.trim()}
                  {i < marqueeText.split('>>>').length - 1 && (
                    <>
                      <span className="text-amber-200">&gt;&gt;&gt;</span>
                      <DollarSign className="w-4 h-4 text-yellow-300" />
                    </>
                  )}
                </span>
              ))}
              <span className="ml-8">{marqueeText}</span>
            </span>
          </motion.div>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Welcome Card */}
          <Card className="bg-zinc-900 border-zinc-700 border-2 rounded-2xl">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white" data-testid="text-welcome">
                  Welcome, {firstName}
                </h1>
                <p className="text-zinc-400">@{username}</p>
              </div>
              <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                status === 'active' ? 'bg-blue-500' : 
                status === 'frozen' ? 'bg-red-500' : 'bg-yellow-500'
              }`}>
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium capitalize" data-testid="text-status">{status}</span>
              </div>
            </CardContent>
          </Card>

          {/* Promo Video */}
          <Card className="bg-zinc-900 border-zinc-700 border-2 rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <video 
                src={settings?.promoVideoUrl || "/videos/promo-video.mp4"}
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-auto max-h-80 object-cover"
                data-testid="video-promo"
              />
            </CardContent>
          </Card>

          {/* Flash Sale Countdown */}
          <Card className="bg-zinc-900 border-orange-500/50 border-2 rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-3xl font-bold mb-2">
                <span className="text-white">{flashSaleTitle} </span>
                <span className="text-orange-500">{flashSaleSubtitle}</span>
              </h2>
              <p className="text-zinc-400 mb-6">{flashSaleDescription}</p>
              
              <div className="grid grid-cols-4 gap-4">
                {[
                  { value: countdown.days.toString().padStart(2, '0'), label: 'DAYS' },
                  { value: countdown.hours.toString().padStart(2, '0'), label: 'HOURS' },
                  { value: countdown.minutes.toString().padStart(2, '0'), label: 'MINUTES' },
                  { value: countdown.seconds.toString().padStart(2, '0'), label: 'SECONDS' },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="bg-zinc-800 rounded-lg py-4 px-2">
                      <span className="text-2xl md:text-4xl font-bold text-orange-500" data-testid={`countdown-${item.label.toLowerCase()}`}>
                        {item.value}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">{item.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Slides */}
          {slides && slides.length > 0 && (
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative rounded-2xl overflow-hidden"
                >
                  <img 
                    src={slides[currentSlide]?.imageUrl || eventImage} 
                    alt={slides[currentSlide]?.title || "Slide"}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold text-white">{slides[currentSlide]?.title}</h3>
                    <p className="text-zinc-300">{slides[currentSlide]?.description}</p>
                    {slides[currentSlide]?.buttonText && (
                      <Button className="mt-4 bg-orange-500 hover:bg-orange-600" data-testid="button-slide-action">
                        {slides[currentSlide]?.buttonText}
                      </Button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {slides.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentSlide ? "w-6 bg-orange-500" : "bg-zinc-600"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Event Space */}
          <Card className="bg-zinc-900 border-zinc-700 border-2 rounded-2xl overflow-hidden">
            <div className="relative h-64">
              <img 
                src={eventImage} 
                alt="Event Space"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-white mb-2">{eventTitle}</h3>
                <p className="text-zinc-300 mb-4">{eventDescription}</p>
                <Button 
                  className="w-fit bg-orange-500 hover:bg-orange-600"
                  onClick={() => setLocation('/events')}
                  data-testid="button-explore-events"
                >
                  Explore Events
                </Button>
              </div>
            </div>
          </Card>

          {/* Newsletter Signup */}
          <Card className="bg-zinc-900 border-zinc-700 border-2 rounded-2xl">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Sign up for Newsletter</h3>
              <p className="text-zinc-400 mb-4">Get the latest updates and offers</p>
              <div className="flex gap-2 max-w-md mx-auto">
                <Input 
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  data-testid="input-newsletter-email"
                />
                <Button className="bg-zinc-700 hover:bg-zinc-600 text-white" data-testid="button-subscribe">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <footer className="pt-8 border-t border-zinc-800">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Customer Care */}
              <div>
                <h4 className="text-orange-500 font-bold mb-4">Customer Care</h4>
                <ul className="space-y-2 text-zinc-400">
                  <li><Link href="/refund" className="hover:text-white">Return & Refund</Link></li>
                  <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                  <li><Link href="/payment" className="hover:text-white">Service Payment</Link></li>
                  <li><Link href="/faq" className="hover:text-white">FAQs</Link></li>
                </ul>
              </div>

              {/* Get To Know Us */}
              <div>
                <h4 className="text-orange-500 font-bold mb-4">Get To Know Us</h4>
                <ul className="space-y-2 text-zinc-400">
                  <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                  <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                  <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                </ul>
                <div className="flex gap-3 mt-4">
                  <a href="#" className="w-8 h-8 rounded-full border border-zinc-600 flex items-center justify-center hover:border-white">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full border border-zinc-600 flex items-center justify-center hover:border-white">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full border border-zinc-600 flex items-center justify-center hover:border-white">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full border border-zinc-600 flex items-center justify-center hover:border-white">
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Let Us Help You */}
              <div>
                <h4 className="text-orange-500 font-bold mb-4">Let Us Help You</h4>
                <ul className="space-y-2 text-zinc-400">
                  <li><Link href="/settings" className="hover:text-white">My Account</Link></li>
                  <li><Link href="/withdrawals" className="hover:text-white">My Orders</Link></li>
                  <li><Link href="/terms" className="hover:text-white">Terms Of Use</Link></li>
                  <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-orange-500 font-bold mb-4">Contact Info</h4>
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-orange-500" />
                    <span>{contactPhone}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-orange-500" />
                    <span>{contactEmail}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-orange-500 mt-1" />
                    <span>{contactAddress}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-wrap items-center justify-center gap-4 py-4 border-t border-zinc-800">
              <span className="text-zinc-400 text-sm">We Accept:</span>
              <div className="flex gap-2">
                <span className="bg-white text-black px-3 py-1 rounded text-sm font-bold">VISA</span>
                <span className="bg-white text-black px-3 py-1 rounded text-sm font-bold">MC</span>
                <span className="bg-white text-black px-3 py-1 rounded text-sm font-bold">AMEX</span>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center py-4 text-zinc-500 text-sm">
              {copyrightText}
            </div>
          </footer>
        </div>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 z-50"
              data-testid="button-scroll-top"
            >
              <ChevronUp className="w-6 h-6 text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
