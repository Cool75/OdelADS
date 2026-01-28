import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Eye, EyeOff, Play, DollarSign, Users, TrendingUp, ChevronLeft, ChevronRight, Search, User, Menu, X, Star, Shield, Zap, Clock, Wallet, Gift, Phone, Mail, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { SiGoogle, SiFacebook, SiX, SiInstagram, SiYoutube } from "react-icons/si";

type ViewType = "landing" | "login" | "register";

const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&auto=format&fit=crop",
    title: "WATCH & EARN",
    subtitle: "Up to LKR 25,000 Daily",
    description: "Start earning today by watching advertisements"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&auto=format&fit=crop",
    title: "INSTANT WITHDRAWALS",
    subtitle: "Direct to Your Bank",
    description: "Get your earnings transferred within 24 hours"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&auto=format&fit=crop",
    title: "REGISTRATION BONUS",
    subtitle: "LKR 25,000 FREE",
    description: "Sign up now and receive instant bonus credits"
  }
];

const features = [
  { icon: Play, title: "Watch Ads", description: "Simple video ads to watch" },
  { icon: DollarSign, title: "Earn Money", description: "Get paid for every ad" },
  { icon: Wallet, title: "Easy Withdraw", description: "Bank transfer or mobile" },
  { icon: Gift, title: "Bonus Rewards", description: "Daily login bonuses" },
  { icon: Shield, title: "100% Secure", description: "Your data is protected" },
  { icon: Clock, title: "24/7 Support", description: "Always here to help" }
];

const partners = [
  { name: "Dialog", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Dialog_Axiata_logo.svg/200px-Dialog_Axiata_logo.svg.png" },
  { name: "Mobitel", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/25/Mobitel_logo.svg/200px-Mobitel_logo.svg.png" },
  { name: "Hutch", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/54/Hutch_Sri_Lanka_logo.svg/200px-Hutch_Sri_Lanka_logo.svg.png" },
  { name: "Airtel", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Airtel_logo.svg/200px-Airtel_logo.svg.png" }
];

export default function LandingPage() {
  const [view, setView] = useState<ViewType>("landing");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleAuth = () => {
    window.location.href = "/api/login";
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  // Landing/Welcome View
  if (view === "landing") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="bg-black sticky top-0 z-50">
          {/* Top Bar */}
          <div className="border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs text-zinc-400">
              <div className="hidden md:flex items-center gap-4">
                <span>24/7 Customer Support</span>
                <span>|</span>
                <span>Trusted by 10,000+ Users</span>
              </div>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-orange-500 transition-colors"><SiFacebook className="w-4 h-4" /></a>
                <a href="#" className="hover:text-orange-500 transition-colors"><SiInstagram className="w-4 h-4" /></a>
                <a href="#" className="hover:text-orange-500 transition-colors"><SiX className="w-4 h-4" /></a>
                <a href="#" className="hover:text-orange-500 transition-colors"><SiYoutube className="w-4 h-4" /></a>
              </div>
            </div>
          </div>

          {/* Main Header */}
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="text-2xl md:text-3xl font-light tracking-widest text-white">
                <span className="font-normal">O</span>
                <span className="text-orange-500 font-bold">D</span>
                <span className="font-normal">E</span>
                <span className="font-normal">L</span>
                <span className="text-orange-500 text-sm ml-1">ADS</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-300">
              <a href="#" className="hover:text-orange-500 transition-colors">Home</a>
              <a href="#" className="hover:text-orange-500 transition-colors">How It Works</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Earn Money</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Contact</a>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView("login")}
                className="hidden md:flex text-white"
                data-testid="button-header-login"
              >
                Log In
              </Button>
              <Button
                size="sm"
                onClick={() => setView("register")}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                data-testid="button-header-register"
              >
                Sign Up Free
              </Button>
              <button
                className="md:hidden text-white p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-zinc-900 border-t border-zinc-800"
              >
                <nav className="flex flex-col p-4 gap-3 text-zinc-300">
                  <a href="#" className="py-2 hover:text-orange-500">Home</a>
                  <a href="#" className="py-2 hover:text-orange-500">How It Works</a>
                  <a href="#" className="py-2 hover:text-orange-500">Earn Money</a>
                  <a href="#" className="py-2 hover:text-orange-500">Contact</a>
                  <Button
                    variant="outline"
                    onClick={() => { setView("login"); setMobileMenuOpen(false); }}
                    className="border-orange-500 text-orange-500 mt-2"
                    data-testid="button-mobile-login"
                  >
                    Log In
                  </Button>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Bar */}
          <div className="bg-zinc-800 hidden md:block">
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-6 text-xs text-zinc-300">
              <span className="hover:text-orange-500 cursor-pointer transition-colors">WATCH ADS</span>
              <span className="hover:text-orange-500 cursor-pointer transition-colors">EARN MONEY</span>
              <span className="hover:text-orange-500 cursor-pointer transition-colors">WITHDRAW</span>
              <span className="hover:text-orange-500 cursor-pointer transition-colors">REFERRALS</span>
              <span className="hover:text-orange-500 cursor-pointer transition-colors">BONUSES</span>
              <span className="hover:text-orange-500 cursor-pointer transition-colors">PREMIUM</span>
              <span className="hover:text-orange-500 cursor-pointer transition-colors">SUPPORT</span>
            </div>
          </div>
        </header>

        {/* Hero Slider */}
        <section className="relative h-[300px] md:h-[500px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-orange-500/80 z-10" />
              <img
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-white/80 text-sm md:text-base mb-2">{heroSlides[currentSlide].description}</p>
                  <h1 className="text-3xl md:text-6xl font-bold text-white mb-2">{heroSlides[currentSlide].title}</h1>
                  <p className="text-xl md:text-3xl text-white font-light">{heroSlides[currentSlide].subtitle}</p>
                  <Button
                    onClick={() => setView("register")}
                    className="mt-6 bg-black hover:bg-zinc-900 text-white px-8 py-6 text-lg rounded-full"
                    data-testid="button-hero-cta"
                  >
                    Start Earning Now
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            data-testid="button-slider-prev"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            data-testid="button-slider-next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/40"}`}
                data-testid={`button-slider-dot-${index}`}
              />
            ))}
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-zinc-900 py-6">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-orange-500">10,000+</p>
              <p className="text-xs md:text-sm text-zinc-400">Active Users</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-orange-500">LKR 5M+</p>
              <p className="text-xs md:text-sm text-zinc-400">Total Paid Out</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-orange-500">500+</p>
              <p className="text-xs md:text-sm text-zinc-400">Active Ads Daily</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-orange-500">24/7</p>
              <p className="text-xs md:text-sm text-zinc-400">Customer Support</p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose ODELADS?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">The easiest way to earn money online by watching advertisements</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-8 md:py-12 bg-zinc-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1">OUR PARTNERS</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {partners.map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg p-6 flex items-center justify-center h-24"
                  data-testid={`card-partner-${index}`}
                >
                  <span className="text-lg font-bold text-gray-700">{partner.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-gray-600">Start earning in just 3 simple steps</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: 1, title: "Create Account", desc: "Sign up for free and get LKR 25,000 bonus", icon: User },
                { step: 2, title: "Watch Ads", desc: "View advertisements at your own pace", icon: Play },
                { step: 3, title: "Get Paid", desc: "Withdraw earnings to your bank account", icon: Wallet }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ChevronRight className="w-8 h-8 text-orange-500" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-20 bg-orange-500">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Ready to Start Earning?</h2>
            <p className="text-white/80 mb-8 text-lg">Join thousands of users already earning money with ODELADS</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setView("register")}
                className="bg-black hover:bg-zinc-900 text-white px-8 py-6 text-lg rounded-full"
                data-testid="button-cta-register"
              >
                Create Free Account
              </Button>
              <Button
                variant="outline"
                onClick={() => setView("login")}
                className="border-2 border-white text-white px-8 py-6 text-lg rounded-full bg-transparent"
                data-testid="button-cta-login"
              >
                Log In
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-zinc-900 text-zinc-400 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              {/* Column 1 */}
              <div>
                <h4 className="text-white font-semibold mb-4">Customer Care</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-orange-500">Help Center</a></li>
                  <li><a href="#" className="hover:text-orange-500">Contact Us</a></li>
                  <li><a href="#" className="hover:text-orange-500">FAQs</a></li>
                  <li><a href="#" className="hover:text-orange-500">Withdraw Guide</a></li>
                </ul>
              </div>
              {/* Column 2 */}
              <div>
                <h4 className="text-white font-semibold mb-4">About Us</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-orange-500">Our Story</a></li>
                  <li><a href="#" className="hover:text-orange-500">How It Works</a></li>
                  <li><a href="#" className="hover:text-orange-500">Testimonials</a></li>
                  <li><a href="#" className="hover:text-orange-500">Blog</a></li>
                </ul>
              </div>
              {/* Column 3 */}
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-orange-500">Terms of Use</a></li>
                  <li><a href="#" className="hover:text-orange-500">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-orange-500">Cookie Policy</a></li>
                  <li><a href="#" className="hover:text-orange-500">Refund Policy</a></li>
                </ul>
              </div>
              {/* Column 4 */}
              <div>
                <h4 className="text-white font-semibold mb-4">Contact</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-orange-500" />
                    <span>+94 11 123 4567</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-orange-500" />
                    <span>support@odelads.com</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
                    <span>Colombo, Sri Lanka</span>
                  </li>
                </ul>
                <div className="flex gap-3 mt-4">
                  <a href="#" className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                    <SiFacebook className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                    <SiInstagram className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                    <SiX className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Bottom Bar */}
            <div className="border-t border-zinc-800 pt-8 text-center text-sm">
              <p>Copyright 2026 ODELADS. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Login/Register Form View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        {/* Left Side - Image (hidden on mobile) */}
        <div className="hidden md:block md:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 to-red-600/90 z-10" />
          <img
            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop"
            alt="VR Experience"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-start p-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <span className="text-white text-3xl font-bold">O</span>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 left-8 right-8 z-20"
          >
            <h2 className="text-white text-2xl font-bold mb-2">Welcome to ODELADS</h2>
            <p className="text-white/80 text-sm">Watch ads. Earn rewards. It's that simple.</p>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Back Button */}
            <button
              onClick={() => setView("landing")}
              className="mb-6 text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-2"
              data-testid="button-back-landing"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </button>

            {/* Mobile Logo */}
            <div className="md:hidden flex justify-center mb-6">
              <div className="w-14 h-14 rounded-xl bg-orange-500 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">O</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" data-testid="text-auth-title">
              {view === "login" ? "Log in" : "Create an Account"}
            </h1>
            <p className="text-gray-500 mb-6 md:mb-8 text-sm md:text-base">
              {view === "login" ? (
                <>Don't have an account? <button onClick={() => setView("register")} className="text-orange-500 font-medium">Create an Account</button></>
              ) : (
                <>Already have an account? <button onClick={() => setView("login")} className="text-orange-500 font-medium">Log in</button></>
              )}
            </p>

            {/* Form Fields */}
            <div className="space-y-4">
              {view === "register" && (
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">First Name</label>
                    <Input
                      placeholder="John"
                      className="h-11 md:h-12 border-gray-300 focus:border-orange-500"
                      data-testid="input-first-name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Last Name</label>
                    <Input
                      placeholder="Doe"
                      className="h-11 md:h-12 border-gray-300 focus:border-orange-500"
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  className="h-11 md:h-12 border-gray-300 focus:border-orange-500"
                  data-testid="input-email"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="h-11 md:h-12 border-gray-300 focus:border-orange-500 pr-12"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {view === "login" && (
                  <div className="text-right mt-2">
                    <button className="text-sm text-orange-500 font-medium">Forgot Password?</button>
                  </div>
                )}
              </div>

              {view === "register" && (
                <div className="flex items-start gap-2 mt-4">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="border-gray-300 mt-0.5"
                    data-testid="checkbox-terms"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the <button className="text-orange-500 font-medium">Terms & Conditions</button>
                  </label>
                </div>
              )}

              <Button
                onClick={handleAuth}
                className="w-full h-12 md:h-14 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base md:text-lg rounded-xl mt-4"
                data-testid="button-submit-auth"
              >
                {view === "login" ? "Log In" : "Create Account"}
              </Button>

              <div className="relative my-4 md:my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-400">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <Button
                  variant="outline"
                  onClick={handleAuth}
                  className="h-11 md:h-12 border-gray-300 hover:bg-gray-50 font-medium rounded-xl text-sm"
                  data-testid="button-google"
                >
                  <SiGoogle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-red-500" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAuth}
                  className="h-11 md:h-12 border-gray-300 hover:bg-gray-50 font-medium rounded-xl text-sm"
                  data-testid="button-facebook"
                >
                  <SiFacebook className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
                  Facebook
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
