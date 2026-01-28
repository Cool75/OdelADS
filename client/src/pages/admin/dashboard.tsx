import { LayoutShell } from "@/components/layout-shell";
import { useAuth } from "@/hooks/use-auth";
import { useUsersList } from "@/hooks/use-users";
import { useWithdrawals } from "@/hooks/use-withdrawals";
import { StatsCard } from "@/components/stats-card";
import { Users, AlertCircle, Coins, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: users } = useUsersList();
  const { data: withdrawals } = useWithdrawals();

  if (!(user as any)?.isAdmin) {
    return <div className="p-8 text-center text-red-500">Access Denied</div>;
  }

  const pendingUsers = users?.filter(u => u.status === "pending").length || 0;
  const activeUsers = users?.filter(u => u.status === "active").length || 0;
  const pendingWithdrawals = withdrawals?.filter(w => w.status === "pending").length || 0;
  const totalPaid = withdrawals
    ?.filter(w => w.status === "approved")
    .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

  return (
    <LayoutShell>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-amber-500">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and management</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Users"
          value={pendingUsers}
          icon={Users}
          iconColor="text-amber-500"
        />
        <StatsCard
          title="Active Users"
          value={activeUsers}
          icon={Users}
          iconColor="text-primary"
        />
        <StatsCard
          title="Pending Withdrawals"
          value={pendingWithdrawals}
          icon={AlertCircle}
          iconColor="text-destructive"
        />
        <StatsCard
          title="Total Payouts"
          value={`LKR ${totalPaid.toFixed(2)}`}
          icon={Coins}
          iconColor="text-blue-500"
        />
      </div>

      {/* Quick Actions or Recent Activity could go here */}
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div className="p-6 bg-card rounded-xl border">
          <h3 className="font-bold mb-4">Pending Approvals</h3>
          <p className="text-muted-foreground">Go to Users tab to approve {pendingUsers} new accounts.</p>
        </div>
        <div className="p-6 bg-card rounded-xl border">
          <h3 className="font-bold mb-4">Withdrawal Requests</h3>
          <p className="text-muted-foreground">You have {pendingWithdrawals} pending payout requests to review.</p>
        </div>
      </div>
    </LayoutShell>
  );
}
