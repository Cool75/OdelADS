import { AdminLayout } from "@/components/admin-layout";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Users, MousePointer, Wallet, DollarSign, Clock, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "wouter";

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

  return (
    <AdminLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">{stats?.activeUsers || 0} active, {stats?.pendingUsers || 0} pending</p>
                <p className="text-3xl font-bold mt-1">{stats?.totalUsers || 0}</p>
                <p className="text-blue-100 text-xs mt-1">+12% from last week</p>
              </div>
              <Users className="h-10 w-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm">All time clicks</p>
                <p className="text-3xl font-bold mt-1">{(stats?.totalAdClicks || 0).toLocaleString()}</p>
                <p className="text-cyan-100 text-xs mt-1">+8% from last week</p>
              </div>
              <MousePointer className="h-10 w-10 text-cyan-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-500 to-violet-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-100 text-sm">Earnings distributed</p>
                <p className="text-3xl font-bold mt-1">LKR {parseFloat(stats?.totalEarnings || "0").toLocaleString()}</p>
                <p className="text-violet-100 text-xs mt-1">+23% from last week</p>
              </div>
              <TrendingUp className="h-10 w-10 text-violet-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Active Users</p>
                <p className="text-3xl font-bold mt-1">{stats?.activeUsers || 0}</p>
                <p className="text-emerald-100 text-xs mt-1">67% of total</p>
              </div>
              <Users className="h-10 w-10 text-emerald-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">TOTAL WITHDRAW</p>
                <p className="text-3xl font-bold mt-2">LKR {parseFloat(stats?.totalWithdrawals || "0").toLocaleString()}</p>
                <p className="text-amber-100 text-xs mt-1">LKR {parseFloat(stats?.pendingWithdrawals || "0").toLocaleString()} pending</p>
              </div>
              <Wallet className="h-12 w-12 text-amber-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">TOTAL DEPOSIT</p>
                <p className="text-3xl font-bold mt-2">LKR {parseFloat(stats?.totalDeposits || "0").toLocaleString()}</p>
                <p className="text-teal-100 text-xs mt-1">User balances</p>
              </div>
              <DollarSign className="h-12 w-12 text-teal-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">ACTIVE USERS</p>
                <p className="text-3xl font-bold mt-2">{stats?.activeUsers || 0}</p>
                <p className="text-purple-100 text-xs mt-1">{stats?.totalUsers ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% of total</p>
              </div>
              <Users className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-lg">High Priority Actions</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">
              {(stats?.pendingUsers || 0) + pendingWithdrawalsList.length} pending
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium">{stats?.pendingUsers || 0} Pending Users</p>
                  <p className="text-sm text-muted-foreground">Awaiting approval</p>
                </div>
              </div>
              <Link href="/admin/users/pending">
                <Button variant="ghost" size="sm" data-testid="link-review-users">
                  Review <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">{pendingWithdrawalsList.length} Withdrawal Request</p>
                  <p className="text-sm text-muted-foreground">Pending approval</p>
                </div>
              </div>
              <Link href="/admin/withdrawals">
                <Button variant="ghost" size="sm" data-testid="link-review-withdrawals">
                  Review <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Recent Users</CardTitle>
            </div>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" data-testid="link-view-all-users">
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUsers.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between" data-testid={`user-row-${u.id}`}>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={u.profileImageUrl} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {u.firstName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-muted-foreground">@{u.email?.split("@")[0]}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={u.status === "active" ? "default" : u.status === "pending" ? "secondary" : "destructive"}
                    className={u.status === "active" ? "bg-green-500/20 text-green-500" : ""}
                  >
                    {u.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    LKR {parseFloat(u.milestoneAmount || "0").toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
