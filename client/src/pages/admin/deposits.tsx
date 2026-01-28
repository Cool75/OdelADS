import { AdminLayout } from "@/components/admin-layout";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Wallet } from "lucide-react";

interface Deposit {
  id: number;
  userId: string;
  amount: string;
  type: string;
  description: string | null;
  createdAt: string;
}

export default function AdminDeposits() {
  const { user } = useAuth();

  const { data: deposits, isLoading } = useQuery<Deposit[]>({
    queryKey: ["/api/admin/deposits"]
  });

  if (!(user as any)?.isAdmin) {
    return <div className="p-8 text-center text-red-500">Access Denied</div>;
  }

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center">
          <Wallet className="h-6 w-6 text-teal-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Deposit Details</h1>
          <p className="text-muted-foreground">{deposits?.length || 0} total deposits</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                </TableRow>
              ) : !deposits?.length ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No deposits yet
                  </TableCell>
                </TableRow>
              ) : (
                deposits.map((d) => (
                  <TableRow key={d.id} data-testid={`row-deposit-${d.id}`}>
                    <TableCell className="font-mono text-sm">#{d.id}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {d.userId.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/20 text-green-500">
                        +LKR {parseFloat(d.amount).toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{d.type}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {d.description || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(d.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
