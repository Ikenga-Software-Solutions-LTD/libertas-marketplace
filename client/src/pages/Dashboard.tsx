import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import TopNav from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, CheckCircle, Clock, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  // Mock data - replace with tRPC calls
  const userStats = {
    pointBalance: 2500,
    earnedTotal: 5000,
    referralEarnings: 15000,
    totalReferrals: 12,
    activeReferrals: 8,
  };

  const referralLink = `https://libertas-marketplace.manus.space?ref=${user?.id || "user123"}`;

  const referrals = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      status: "active",
      joinedDate: "2024-01-15",
      earnings: 2500,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "active",
      joinedDate: "2024-02-20",
      earnings: 1500,
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      status: "pending",
      joinedDate: "2024-03-10",
      earnings: 0,
    },
  ];

  const affiliateData = {
    status: "approved",
    commissionRate: 5,
    totalEarnings: 45000,
    totalPayouts: 30000,
    pendingEarnings: 15000,
    approvedDate: "2024-01-01",
  };

  const payoutHistory = [
    {
      id: 1,
      amount: 10000,
      status: "completed",
      date: "2024-03-01",
      method: "Bank Transfer",
    },
    {
      id: 2,
      amount: 20000,
      status: "completed",
      date: "2024-02-01",
      method: "Bank Transfer",
    },
  ];

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <main className="container flex items-center justify-center py-20">
          <Card className="max-w-md p-8 text-center">
            <h2 className="mb-4 font-display text-2xl font-bold">Sign In Required</h2>
            <p className="mb-6 text-muted-foreground">
              Please sign in to access your dashboard.
            </p>
            <Link href="/">
              <a className="inline-block">
                <Button>Return to Catalog</Button>
              </a>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav cartCount={totalItems} />

      <main className="container py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold">Welcome, {user?.name}!</h1>
          <p className="mt-2 text-muted-foreground">Manage your account and referrals</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${affiliateData.status === "approved" ? "grid-cols-3" : "grid-cols-2"}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            {affiliateData.status === "approved" && (
              <TabsTrigger value="affiliate">Affiliate</TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Points Balance */}
              <Card className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-muted-foreground">Points Balance</h3>
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <p className="font-display text-3xl font-bold text-primary">
                  {userStats.pointBalance.toLocaleString()}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Total Earned: {userStats.earnedTotal.toLocaleString()}
                </p>
              </Card>

              {/* Referral Earnings */}
              <Card className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-muted-foreground">Referral Earnings</h3>
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <p className="font-display text-3xl font-bold text-secondary">
                  ₦{(userStats.referralEarnings / 100).toLocaleString()}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  From {userStats.activeReferrals} active referrals
                </p>
              </Card>

              {/* Total Referrals */}
              <Card className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-muted-foreground">Total Referrals</h3>
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <p className="font-display text-3xl font-bold text-accent">
                  {userStats.totalReferrals}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {userStats.activeReferrals} active, {userStats.totalReferrals - userStats.activeReferrals} pending
                </p>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="mb-4 font-semibold">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/catalog">
                  <a>
                    <Button variant="outline">Continue Shopping</Button>
                  </a>
                </Link>
                <Button variant="outline">Redeem Points</Button>
                <Button variant="outline">View Orders</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            {/* Referral Link */}
            <Card className="p-6">
              <h3 className="mb-4 font-semibold">Your Referral Link</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Share this link to earn ₦500 for each successful referral
              </p>
              <div className="flex gap-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  onClick={handleCopyReferralLink}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </Card>

            {/* Referral List */}
            <Card className="p-6">
              <h3 className="mb-4 font-semibold">Your Referrals</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-2 text-left font-semibold">Name</th>
                      <th className="px-4 py-2 text-left font-semibold">Email</th>
                      <th className="px-4 py-2 text-left font-semibold">Status</th>
                      <th className="px-4 py-2 text-left font-semibold">Joined</th>
                      <th className="px-4 py-2 text-right font-semibold">Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((ref) => (
                      <tr key={ref.id} className="border-b border-border hover:bg-muted/50">
                        <td className="px-4 py-3">{ref.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{ref.email}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                              ref.status === "active"
                                ? "bg-success/20 text-success"
                                : "bg-warning/20 text-warning"
                            }`}
                          >
                            {ref.status === "active" ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            {ref.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{ref.joinedDate}</td>
                        <td className="px-4 py-3 text-right font-semibold">
                          ₦{(ref.earnings / 100).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Affiliate Tab */}
          <TabsContent value="affiliate" className="space-y-6">
            {affiliateData.status === "approved" ? (
              <>
                {/* Affiliate Stats */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <Card className="p-6">
                    <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                      Commission Rate
                    </h3>
                    <p className="font-display text-3xl font-bold text-primary">
                      {affiliateData.commissionRate}%
                    </p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                      Total Earnings
                    </h3>
                    <p className="font-display text-3xl font-bold text-secondary">
                      ₦{(affiliateData.totalEarnings / 100).toLocaleString()}
                    </p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                      Total Payouts
                    </h3>
                    <p className="font-display text-3xl font-bold text-accent">
                      ₦{(affiliateData.totalPayouts / 100).toLocaleString()}
                    </p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                      Pending
                    </h3>
                    <p className="font-display text-3xl font-bold text-warning">
                      ₦{(affiliateData.pendingEarnings / 100).toLocaleString()}
                    </p>
                  </Card>
                </div>

                {/* Payout History */}
                <Card className="p-6">
                  <h3 className="mb-4 font-semibold">Payout History</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-4 py-2 text-left font-semibold">Date</th>
                          <th className="px-4 py-2 text-left font-semibold">Amount</th>
                          <th className="px-4 py-2 text-left font-semibold">Method</th>
                          <th className="px-4 py-2 text-left font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payoutHistory.map((payout) => (
                          <tr key={payout.id} className="border-b border-border hover:bg-muted/50">
                            <td className="px-4 py-3">{payout.date}</td>
                            <td className="px-4 py-3 font-semibold">
                              ₦{(payout.amount / 100).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{payout.method}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 rounded-full bg-success/20 px-2 py-1 text-xs font-semibold text-success">
                                <CheckCircle className="h-3 w-3" />
                                {payout.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Request Payout */}
                <Card className="p-6">
                  <h3 className="mb-4 font-semibold">Request Payout</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Minimum payout amount: ₦5,000
                  </p>
                  <Button disabled={affiliateData.pendingEarnings < 500000}>
                    Request Payout
                  </Button>
                </Card>
              </>
            ) : (
              <Card className="p-8 text-center">
                <h3 className="mb-2 font-display text-2xl font-bold">
                  Become an Affiliate
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Join our affiliate program and earn commissions on every referral
                </p>
                <Button>Apply Now</Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
