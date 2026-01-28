import { useAuth } from "@/hooks/use-auth";
import { useAds, useClickAd } from "@/hooks/use-ads";
import { LayoutShell } from "@/components/layout-shell";
import { StatsCard } from "@/components/stats-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, CheckCircle, Clock, Play } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Dashboard() {
  const { user, isLoading: isUserLoading } = useAuth();
  const { data: ads, isLoading: isAdsLoading } = useAds();
  const { mutate: clickAd, isPending: isClicking } = useClickAd();

  if (isUserLoading || isAdsLoading) {
    return (
      <LayoutShell>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </LayoutShell>
    );
  }

  // Safe access to user properties with fallback defaults
  const userData = user as any || {};
  const balance = Number(userData.milestoneAmount || 0).toFixed(2);
  const dailyReward = Number(userData.milestoneReward || 0).toFixed(2);
  const totalAds = userData.totalAdsCompleted || 0;
  const pendingAmount = Number(userData.pendingAmount || 0).toFixed(2);

  return (
    <LayoutShell>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {userData.firstName}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Balance"
          value={`LKR ${balance}`}
          icon={Wallet}
          className="bg-gradient-to-br from-primary/20 to-card"
        />
        <StatsCard
          title="Today's Earnings"
          value={`LKR ${dailyReward}`}
          icon={TrendingUp}
          iconColor="text-emerald-500"
        />
        <StatsCard
          title="Ads Watched"
          value={totalAds}
          icon={CheckCircle}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Pending Amount"
          value={`LKR ${pendingAmount}`}
          icon={Clock}
          iconColor="text-amber-500"
        />
      </div>

      {/* Active Ads Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-display">Available Ads</h2>
          <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
            {ads?.length || 0} ads available
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ads?.map((ad) => (
            <Card key={ad.id} className="overflow-hidden border-border/50 group hover:border-primary/50 transition-all duration-300">
              {/* Image Container with Overlay */}
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="icon"
                    className="rounded-full h-12 w-12 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110 transition-all"
                    onClick={() => {
                      window.open(ad.targetUrl, "_blank");
                      clickAd(ad.id);
                    }}
                    disabled={isClicking}
                  >
                    <Play className="h-5 w-5 fill-current" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    {ad.title}
                  </h3>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                    {Number(ad.price).toFixed(2)} LKR
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {ad.description}
                </p>
                <Button
                  className="w-full font-semibold group-hover:translate-x-1 transition-transform"
                  variant="secondary"
                  onClick={() => {
                    window.open(ad.targetUrl, "_blank");
                    clickAd(ad.id);
                  }}
                  disabled={isClicking}
                >
                  Watch to Earn
                </Button>
              </CardContent>
            </Card>
          ))}
          
          {(!ads || ads.length === 0) && (
             <div className="col-span-full py-20 text-center bg-card/50 rounded-2xl border border-dashed border-border">
               <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                 <Play className="h-8 w-8 text-muted-foreground" />
               </div>
               <h3 className="text-lg font-medium">No ads available right now</h3>
               <p className="text-muted-foreground mt-2">Check back later for more earning opportunities.</p>
             </div>
          )}
        </div>
      </div>
    </LayoutShell>
  );
}
