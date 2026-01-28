import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, TrendingUp, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

import landingBg from "@/assets/images/landing-bg.jpg";

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col font-sans selection:bg-primary/30 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={landingBg} 
          alt="Landing Background" 
          className="w-full h-full object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
      </div>

      {/* Navbar */}
      <nav className="border-b border-white/5 backdrop-blur-md fixed w-full z-50 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-display font-bold text-white tracking-tighter">
                Ad<span className="text-primary">Clicker</span>
              </span>
            </div>
            <div>
              <Button onClick={handleLogin} className="rounded-none px-6 bg-white text-black hover:bg-white/90 font-bold">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-10 max-w-4xl"
        >
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium text-white/80 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Now open for new users
          </div>
          
          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter text-white leading-[0.9]">
            Earn Money Just By <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              Watching Ads
            </span>
          </h1>
          
          <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium leading-relaxed">
            Join thousands of users who are earning daily income <br className="hidden md:block" />
            from the comfort of their home. Simple, fast, and reliable.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" className="rounded-none px-10 h-14 text-lg font-bold bg-white text-black hover:bg-white/90 transition-transform active:scale-95" onClick={handleLogin}>
              Start Earning Now
            </Button>
            <Button size="lg" variant="outline" className="rounded-none px-10 h-14 text-lg font-bold border-white/20 text-white hover:bg-white/10 backdrop-blur-md transition-transform active:scale-95" onClick={handleLogin}>
              Sign In <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-28 w-full">
          {[
            {
              icon: TrendingUp,
              title: "Daily Rewards",
              desc: "Get guaranteed earnings every day you log in and participate in watching ads."
            },
            {
              icon: Shield,
              title: "Secure Payouts",
              desc: "Fast and secure bank transfers directly to your local account with verified security."
            },
            {
              icon: DollarSign,
              title: "High Rates",
              desc: "We offer the best rates in the market for every advertisement you watch on our platform."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
              className="p-8 rounded-none bg-white/5 border border-white/10 hover:border-primary/50 transition-all shadow-2xl backdrop-blur-sm group text-left"
            >
              <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 text-center text-white/40 text-xs font-bold tracking-widest uppercase">
          <p>&copy; {new Date().getFullYear()} AdClicker Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
