import { LayoutShell } from "@/components/layout-shell";
import { useAuth } from "@/hooks/use-auth";
import { useWithdrawals, useApproveWithdrawal, useRejectWithdrawal } from "@/hooks/use-withdrawals";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Label } from "@/components/ui/label";

export default function AdminWithdrawals() {
  const { user } = useAuth();
  const { data: withdrawals } = useWithdrawals();
  const { mutate: approve } = useApproveWithdrawal();
  const { mutate: reject } = useRejectWithdrawal();
  
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  if (!(user as any)?.isAdmin) return null;

  const handleReject = () => {
    if (rejectId && rejectReason) {
      reject({ id: rejectId, reason: rejectReason });
      setRejectId(null);
      setRejectReason("");
    }
  };

  return (
    <LayoutShell>
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-display font-bold">Withdrawal Requests</h1>
        <p className="text-muted-foreground">Approve or reject payouts</p>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals?.map((w) => (
              <TableRow key={w.id}>
                <TableCell className="font-mono text-xs">{w.userId}</TableCell>
                <TableCell className="font-bold">{Number(w.amount).toFixed(2)} LKR</TableCell>
                <TableCell>{w.method}</TableCell>
                <TableCell className="max-w-xs truncate text-xs text-muted-foreground" title={w.accountDetails}>
                  {w.accountDetails}
                </TableCell>
                <TableCell>
                   <Badge variant={
                    w.status === 'approved' ? 'default' : 
                    w.status === 'rejected' ? 'destructive' : 'secondary'
                  }>
                    {w.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {w.status === 'pending' && (
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => approve(w.id)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => setRejectId(w.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!rejectId} onOpenChange={(open) => !open && setRejectId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Withdrawal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason for rejection</Label>
              <Textarea 
                placeholder="Insufficient details, etc."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={handleReject}>Confirm Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LayoutShell>
  );
}
