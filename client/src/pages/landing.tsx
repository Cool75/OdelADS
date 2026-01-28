import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, TrendingUp, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Navbar */}
      <nav className="border-b border-border/10 backdrop-blur-md fixed w-full z-50 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                AdClicker
              </span>
            </div>
            <div>
              <Button onClick={handleLogin} className="rounded-full px-6 shadow-lg shadow-primary/20">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-3xl"
        >
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Now open for new users
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground">
            Earn money just by <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
              watching ads
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who are earning daily income from the comfort of their home. Simple, fast, and reliable payouts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="rounded-full px-8 h-12 text-lg shadow-xl shadow-primary/25 hover:scale-105 transition-transform" onClick={handleLogin}>
              Start Earning Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 w-full">
          {[
            {
              icon: TrendingUp,
              title: "Daily Rewards",
              desc: "Get guaranteed earnings every day you log in and participate."
            },
            {
              icon: Shield,
              title: "Secure Payouts",
              desc: "Fast and secure bank transfers directly to your local account."
            },
            {
              icon: DollarSign,
              title: "High Rates",
              desc: "We offer the best rates in the market for every ad you watch."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
              className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors shadow-lg group text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-border/10 py-12 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} AdClicker Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
