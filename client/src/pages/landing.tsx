import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, TrendingUp, DollarSign, Play, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <nav className="border-b border-border/40 backdrop-blur-md fixed w-full z-50 top-0 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                OdelADS
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <button className="hover:text-foreground transition-colors">How It Works</button>
              <button className="hover:text-foreground transition-colors">Earnings</button>
              <button className="hover:text-foreground transition-colors">FAQ</button>
            </div>
            <div>
              <Button onClick={handleLogin} className="rounded-lg px-6 font-semibold">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-3xl"
        >
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Now accepting new members
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight">
            Earn Real Money<br/>
            <span className="text-primary">Watching Ads</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of Sri Lankans earning daily income from home. 
            Simple tasks, reliable payouts, and instant bank transfers in LKR.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="rounded-lg px-8 h-12 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all" onClick={handleLogin}>
              Start Earning Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-lg px-8 h-12 text-lg font-semibold" onClick={handleLogin}>
              <Play className="mr-2 h-5 w-5" /> Watch Demo
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 pt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Free to join</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Instant payouts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Bank transfer</span>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mt-24 w-full">
          {[
            {
              icon: TrendingUp,
              title: "Daily Rewards",
              desc: "Earn guaranteed rewards every day you participate. The more you engage, the more you earn.",
              highlight: "Up to LKR 500/day"
            },
            {
              icon: Shield,
              title: "Secure Payouts",
              desc: "Fast and secure bank transfers directly to your local account. No hidden fees.",
              highlight: "Direct bank transfer"
            },
            {
              icon: DollarSign,
              title: "Best Rates",
              desc: "We offer competitive rates in the market for every advertisement you complete.",
              highlight: "Premium ad rates"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
              className="p-8 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{feature.highlight}</p>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 w-full">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-primary mb-2">10,000+</p>
                <p className="text-muted-foreground">Active Members</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">LKR 2.5M+</p>
                <p className="text-muted-foreground">Paid Out</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">4.8/5</p>
                <p className="text-muted-foreground">User Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="border-t border-border py-12 bg-card/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <Zap className="h-3 w-3 text-white" />
              </div>
              <span className="font-bold">OdelADS</span>
            </div>
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} OdelADS Platform. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <button className="hover:text-foreground transition-colors">Privacy</button>
              <button className="hover:text-foreground transition-colors">Terms</button>
              <button className="hover:text-foreground transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
