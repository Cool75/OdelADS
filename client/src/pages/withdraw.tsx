import { LayoutShell } from "@/components/layout-shell";
import { useAuth } from "@/hooks/use-auth";
import { useCreateWithdrawal, useWithdrawals } from "@/hooks/use-withdrawals";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWithdrawalSchema } from "@shared/schema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const withdrawalFormSchema = insertWithdrawalSchema.extend({
  amount: z.coerce.number().min(1000, "Minimum withdrawal is 1000 LKR"),
});

export default function WithdrawPage() {
  const { user } = useAuth();
  const { mutate: createWithdrawal, isPending } = useCreateWithdrawal();
  const { data: withdrawals } = useWithdrawals();

  const form = useForm<z.infer<typeof withdrawalFormSchema>>({
    resolver: zodResolver(withdrawalFormSchema),
    defaultValues: {
      amount: 0,
      method: "Bank Transfer",
      accountDetails: "",
    },
  });

  const onSubmit = (data: z.infer<typeof withdrawalFormSchema>) => {
    createWithdrawal(data);
    form.reset();
  };

  const balance = Number((user as any)?.milestoneAmount || 0);

  return (
    <LayoutShell>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-display font-bold">Withdraw Funds</h1>
            <p className="text-muted-foreground">Request a payout to your bank account.</p>
          </div>

          <Card className="glass-card border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Available Balance</div>
              <div className="text-4xl font-display font-bold text-primary mt-2">
                {balance.toFixed(2)} LKR
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request Withdrawal</CardTitle>
              <CardDescription>Minimum withdrawal amount is 1,000.00 LKR</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (LKR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                            <SelectItem value="EzCash">EzCash</SelectItem>
                            <SelectItem value="KoKo">KoKo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Details</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Bank Name, Account Number, Branch, Holder Name" 
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg" 
                    disabled={isPending || balance < 1000}
                  >
                    {isPending ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-display font-bold">History</h2>
            <p className="text-muted-foreground">Recent withdrawal requests</p>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals?.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell className="text-muted-foreground text-xs">
                        {w.createdAt ? format(new Date(w.createdAt), "MMM d, yyyy") : "-"}
                      </TableCell>
                      <TableCell className="font-mono">{Number(w.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={w.status === "approved" ? "default" : w.status === "rejected" ? "destructive" : "secondary"}>
                          {w.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!withdrawals || withdrawals.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        No history found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutShell>
  );
}
