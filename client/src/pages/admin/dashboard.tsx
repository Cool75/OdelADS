import { AdminLayout } from "@/components/admin-layout";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Users, MousePointer, Wallet, DollarSign, Clock, ArrowRight, TrendingUp, ChevronRight, Shield, Rocket } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import sentinelBg from "@/assets/images/sentinel-bg.jpg";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  totalWithdrawals: string;
  pendingWithdrawals: string;
  totalDeposits: string;
  totalAdClicks: number;
  totalEarnings: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [showHero, setShowHero] = useState(true);

  const { data: stats } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"]
  });

  const { data: users } = useQuery<any[]>({
    queryKey: ["/api/users"]
  });

  const { data: withdrawals } = useQuery<any[]>({
    queryKey: ["/api/withdrawals"]
  });

  if (!(user as any)?.isAdmin) {
    return <div className="p-8 text-center text-red-500">Access Denied</div>;
  }

  const pendingWithdrawalsList = withdrawals?.filter(w => w.status === "pending") || [];
  const recentUsers = users?.slice(0, 5) || [];

  if (showHero) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center text-white font-sans selection:bg-primary/30">
        <div className="absolute inset-0 z-0">
          <img 
            src={sentinelBg} 
            alt="Sentinel Defense Background" 
            className="w-full h-full object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>

        <nav className="absolute top-0 w-full p-8 flex items-center justify-between z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center p-1">
              <svg fill="white" viewBox="0 0 147 70" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M56 50.2031V14H70V60.1562C70 65.5928 65.5928 70 60.1562 70C57.5605 70 54.9982 68.9992 53.1562 67.1573L0 14H19.7969L56 50.2031Z" />
                <path d="M147 56H133V23.9531L100.953 56H133V70H96.6875C85.8144 70 77 61.1856 77 50.3125V14H91V46.1562L123.156 14H91V0H127.312C138.186 0 147 8.81439 147 19.6875V56Z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">Skydda</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <button className="hover:text-white transition-colors">About</button>
            <button className="hover:text-white transition-colors">Features</button>
            <button className="hover:text-white transition-colors">Testimonials</button>
            <button className="hover:text-white transition-colors">Pricing</button>
            <button className="hover:text-white transition-colors">FAQ</button>
          </div>
          <button 
            className="text-sm font-bold tracking-tight hover:text-primary transition-colors"
            onClick={() => setShowHero(false)}
          >
            Get Started
          </button>
        </nav>

        <div className="relative z-10 max-w-4xl text-center px-4 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-white">
            AI Defense That Sees<br />Through the Dark
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-medium">
            Our autonomous AI sentinel detects and neutralizes<br className="hidden md:block" />
            zero-day threats <span className="text-white">before they reach your gateway.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button 
              size="lg" 
              className="h-14 px-10 text-base font-bold bg-white text-black hover:bg-white/90 rounded-none w-full sm:w-auto transition-transform active:scale-95"
              onClick={() => setShowHero(false)}
            >
              Deploy the Sentinel
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="h-14 px-10 text-base font-bold border-white/20 text-white hover:bg-white/10 rounded-none w-full sm:w-auto backdrop-blur-md transition-transform active:scale-95"
            >
              Read the Whitepaper
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">Monitor your platform's performance and key metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                  <span className="text-xs font-medium text-green-500">+12%</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
              <div className="h-full bg-primary" style={{ width: '70%' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ad Clicks</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{(stats?.totalAdClicks || 0).toLocaleString()}</p>
                  <span className="text-xs font-medium text-green-500">+8%</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <MousePointer className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
              <div className="h-full bg-blue-500" style={{ width: '45%' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Distributed</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">LKR {Math.round(parseFloat(stats?.totalEarnings || "0")).toLocaleString()}</p>
                  <span className="text-xs font-medium text-green-500">+23%</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
              <div className="h-full bg-purple-500" style={{ width: '85%' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{stats?.activeUsers || 0}</p>
                  <span className="text-xs font-medium text-blue-500">Live</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
              <div className="h-full bg-emerald-500" style={{ width: '60%' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card className="shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between gap-2 border-b pb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">Priority Pending</CardTitle>
            </div>
            <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 bg-primary/10 text-primary border-none">
              {(stats?.pendingUsers || 0) + pendingWithdrawalsList.length} total
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Users className="h-4.5 w-4.5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{stats?.pendingUsers || 0} Pending Users</p>
                    <p className="text-xs text-muted-foreground">Identity verification required</p>
                  </div>
                </div>
                <Link href="/admin/users/pending">
                  <Button variant="outline" size="sm" className="h-8 rounded-md" data-testid="link-review-users">
                    Manage
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Wallet className="h-4.5 w-4.5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{pendingWithdrawalsList.length} Payout Requests</p>
                    <p className="text-xs text-muted-foreground">Bank transfers to process</p>
                  </div>
                </div>
                <Link href="/admin/withdrawals">
                  <Button variant="outline" size="sm" className="h-8 rounded-md" data-testid="link-review-withdrawals">
                    Manage
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between gap-2 border-b pb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">Recent Registrations</CardTitle>
            </div>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-8" data-testid="link-view-all-users">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {recentUsers.length > 0 ? recentUsers.map((u: any) => (
                <div key={u.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors" data-testid={`user-row-${u.id}`}>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={u.profileImageUrl} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {u.firstName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{u.firstName} {u.lastName}</p>
                      <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium">{u.email?.split("@")[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs font-semibold">LKR {Math.round(parseFloat(u.milestoneAmount || "0")).toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-medium">{u.status}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-sm text-muted-foreground">No recent users found.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
