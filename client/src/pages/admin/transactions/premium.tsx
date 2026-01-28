import { AdminLayout } from "@/components/admin-layout";
import { useAuth } from "@/hooks/use-auth";
import { useUsersList } from "@/hooks/use-users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Star, Search, DollarSign, RotateCcw, AlertTriangle, Plus, Shield, UserCheck, UserX, UserCog } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminPremiumManage() {
  const { user } = useAuth();
  const { data: users } = useUsersList();
  const { toast } = useToast();
  const [location] = useLocation();
  
  const urlParams = new URLSearchParams(location.split("?")[1] || "");
  const preselectedUserId = urlParams.get("userId");
  
  const [selectedUserId, setSelectedUserId] = useState<string>(preselectedUserId || "");
  const [search, setSearch] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [resetField, setResetField] = useState("");
  const [restrictionData, setRestrictionData] = useState({
    adsLimit: "",
    deposit: "",
    commission: "",
    pendingAmount: ""
  });

  const selectedUser = users?.find(u => u.id === selectedUserId);

  const depositMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/users/${selectedUserId}/deposit`, { amount: depositAmount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "Deposit added successfully" });
      setDepositAmount("");
    }
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/users/${selectedUserId}/reset`, { field: resetField });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: `${resetField} has been reset` });
      setResetField("");
    }
  });

  const restrictMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/users/${selectedUserId}/restrict`, {
        adsLimit: parseInt(restrictionData.adsLimit) || null,
        deposit: restrictionData.deposit || null,
        commission: restrictionData.commission || null,
        pendingAmount: restrictionData.pendingAmount || "0"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "Promotion/Restriction applied" });
      setRestrictionData({ adsLimit: "", deposit: "", commission: "", pendingAmount: "" });
    }
  });

  const unrestrictMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/users/${selectedUserId}/unrestrict`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "Restriction removed" });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      return apiRequest("PATCH", `/api/users/${selectedUserId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "User status updated" });
    }
  });

  if (!(user as any)?.isAdmin) {
    return <div className="p-8 text-center text-red-500">Access Denied</div>;
  }

  const filteredUsers = users?.filter(u => 
    u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
          <Star className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Premium Manage</h1>
          <p className="text-muted-foreground">Manage user balances, deposits, and promotions</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Select User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-premium"
              />
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setSelectedUserId(u.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    selectedUserId === u.id 
                      ? "bg-primary/10 border border-primary/30" 
                      : "hover:bg-muted"
                  }`}
                  data-testid={`button-select-user-${u.id}`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={u.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {u.firstName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  </div>
                  <Badge
                    variant={u.status === "active" ? "default" : "secondary"}
                    className={u.status === "active" ? "bg-green-500/20 text-green-500" : ""}
                  >
                    {u.status}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {selectedUser ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">User Details</CardTitle>
                    <Badge
                      variant={selectedUser.status === "active" ? "default" : "secondary"}
                      className={selectedUser.status === "active" ? "bg-green-500/20 text-green-500" : ""}
                    >
                      {selectedUser.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedUser.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xl">
                        {selectedUser.firstName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                      <p className="text-muted-foreground">{selectedUser.email}</p>
                      {selectedUser.isAdmin && (
                        <Badge className="bg-amber-500/20 text-amber-500 mt-1">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Milestone Amount</p>
                      <p className="text-lg font-bold text-primary">
                        LKR {parseFloat(selectedUser.milestoneAmount || "0").toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Today's Reward</p>
                      <p className="text-lg font-bold text-amber-500">
                        LKR {parseFloat(selectedUser.milestoneReward || "0").toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Ads Completed</p>
                      <p className="text-lg font-bold">{selectedUser.totalAdsCompleted || 0}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Points</p>
                      <p className="text-lg font-bold">{selectedUser.points || 0}</p>
                    </div>
                  </div>

                  {selectedUser.restrictionAdsLimit && (
                    <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-amber-500 mb-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Promotion Active</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Ads Limit:</span>
                          <span className="ml-2 font-medium">{selectedUser.restrictionAdsLimit}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Completed:</span>
                          <span className="ml-2 font-medium">{selectedUser.restrictedAdsCompleted || 0}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Commission:</span>
                          <span className="ml-2 font-medium">LKR {selectedUser.restrictionCommission || "0"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Status Change Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <UserCog className="h-5 w-5 text-purple-500" />
                      Change Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        variant={selectedUser.status === "active" ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => updateStatusMutation.mutate("active")}
                        disabled={updateStatusMutation.isPending || selectedUser.status === "active"}
                        data-testid="button-status-active"
                      >
                        <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                        Set Active
                      </Button>
                      <Button
                        variant={selectedUser.status === "pending" ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => updateStatusMutation.mutate("pending")}
                        disabled={updateStatusMutation.isPending || selectedUser.status === "pending"}
                        data-testid="button-status-pending"
                      >
                        <UserCog className="mr-2 h-4 w-4 text-amber-500" />
                        Set Pending
                      </Button>
                      <Button
                        variant={selectedUser.status === "frozen" ? "destructive" : "outline"}
                        className="w-full justify-start"
                        onClick={() => updateStatusMutation.mutate("frozen")}
                        disabled={updateStatusMutation.isPending || selectedUser.status === "frozen"}
                        data-testid="button-status-frozen"
                      >
                        <UserX className="mr-2 h-4 w-4 text-red-500" />
                        Freeze User
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      Add Deposit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Amount (LKR)</Label>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          data-testid="input-deposit-amount"
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => depositMutation.mutate()}
                        disabled={!depositAmount || depositMutation.isPending}
                        data-testid="button-add-deposit"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add to Balance
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <RotateCcw className="h-5 w-5 text-blue-500" />
                      Reset Field
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Select Field</Label>
                        <Select value={resetField} onValueChange={setResetField}>
                          <SelectTrigger data-testid="select-reset-field">
                            <SelectValue placeholder="Choose field to reset" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="milestoneAmount">Milestone Amount</SelectItem>
                            <SelectItem value="milestoneReward">Milestone Reward</SelectItem>
                            <SelectItem value="destinationAmount">Destination Amount</SelectItem>
                            <SelectItem value="ongoingMilestone">Ongoing Milestone</SelectItem>
                            <SelectItem value="totalAdsCompleted">Total Ads Completed</SelectItem>
                            <SelectItem value="points">Points</SelectItem>
                            <SelectItem value="restrictedAdsCompleted">Restricted Ads Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => resetMutation.mutate()}
                        disabled={!resetField || resetMutation.isPending}
                        data-testid="button-reset-field"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset to Zero
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    Set Promotion / Restriction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label>Ads Limit</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 50"
                        value={restrictionData.adsLimit}
                        onChange={(e) => setRestrictionData({...restrictionData, adsLimit: e.target.value})}
                        data-testid="input-ads-limit"
                      />
                    </div>
                    <div>
                      <Label>Required Deposit</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 1000"
                        value={restrictionData.deposit}
                        onChange={(e) => setRestrictionData({...restrictionData, deposit: e.target.value})}
                        data-testid="input-restriction-deposit"
                      />
                    </div>
                    <div>
                      <Label>Commission per Ad</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 5"
                        value={restrictionData.commission}
                        onChange={(e) => setRestrictionData({...restrictionData, commission: e.target.value})}
                        data-testid="input-commission"
                      />
                    </div>
                    <div>
                      <Label>Pending Amount</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 0"
                        value={restrictionData.pendingAmount}
                        onChange={(e) => setRestrictionData({...restrictionData, pendingAmount: e.target.value})}
                        data-testid="input-pending-amount"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      className="flex-1"
                      onClick={() => restrictMutation.mutate()}
                      disabled={restrictMutation.isPending}
                      data-testid="button-apply-restriction"
                    >
                      Apply Promotion
                    </Button>
                    {selectedUser.restrictionAdsLimit && (
                      <Button
                        variant="destructive"
                        onClick={() => unrestrictMutation.mutate()}
                        disabled={unrestrictMutation.isPending}
                        data-testid="button-remove-restriction"
                      >
                        Remove Restriction
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Select a user from the list to manage their account</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
