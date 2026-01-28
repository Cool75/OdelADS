import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

import SplashPage from "@/pages/splash";
import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import WithdrawPage from "@/pages/withdraw";
import ExclusivesPage from "@/pages/exclusives";
import StatusPage from "@/pages/status";
import AdsHubPage from "@/pages/ads-hub";
import ContactPage from "@/pages/contact";
import EventsPage from "@/pages/events";
import SettingsPage from "@/pages/settings";
import NotFound from "@/pages/not-found";

import AdminDashboard from "@/pages/admin/dashboard";
import AdminAllUsers from "@/pages/admin/users/index";
import AdminPendingUsers from "@/pages/admin/users/pending";
import AdminAdmins from "@/pages/admin/users/admins";
import AdminTransactionUsers from "@/pages/admin/transactions/users";
import AdminPremiumManage from "@/pages/admin/transactions/premium";
import AdminTransactionDetails from "@/pages/admin/transactions/details";
import AdminWithdrawals from "@/pages/admin/withdrawals";
import AdminDeposits from "@/pages/admin/deposits";
import AdminCommissions from "@/pages/admin/commissions";
import AdminAds from "@/pages/admin/ads";
import AdminSlides from "@/pages/admin/slides";
import AdminContact from "@/pages/admin/contact/index";
import AdminInfoPages from "@/pages/admin/pages/index";
import AdminHomeContent from "@/pages/admin/content/home";
import AdminLabels from "@/pages/admin/content/labels";
import AdminTheme from "@/pages/admin/appearance/theme";
import AdminBranding from "@/pages/admin/appearance/branding";
import AdminDashboardSettings from "@/pages/admin/cms/dashboard-settings";

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType, adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  if (adminOnly && !(user as any).isAdmin) {
    return <NotFound />;
  }

  return <Component />;
}

function HomePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return <SplashPage />;
}

function WelcomePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return <LandingPage />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/welcome" component={WelcomePage} />
      
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/withdraw">
        {() => <ProtectedRoute component={WithdrawPage} />}
      </Route>
      <Route path="/exclusives">
        {() => <ProtectedRoute component={ExclusivesPage} />}
      </Route>
      <Route path="/status">
        {() => <ProtectedRoute component={StatusPage} />}
      </Route>
      <Route path="/withdrawals">
        {() => <ProtectedRoute component={WithdrawPage} />}
      </Route>
      <Route path="/ads-hub">
        {() => <ProtectedRoute component={AdsHubPage} />}
      </Route>
      <Route path="/contact">
        {() => <ProtectedRoute component={ContactPage} />}
      </Route>
      <Route path="/events">
        {() => <ProtectedRoute component={EventsPage} />}
      </Route>
      <Route path="/settings">
        {() => <ProtectedRoute component={SettingsPage} />}
      </Route>

      <Route path="/admin">
        {() => <ProtectedRoute component={AdminDashboard} adminOnly />}
      </Route>
      <Route path="/admin/users">
        {() => <ProtectedRoute component={AdminAllUsers} adminOnly />}
      </Route>
      <Route path="/admin/users/pending">
        {() => <ProtectedRoute component={AdminPendingUsers} adminOnly />}
      </Route>
      <Route path="/admin/users/admins">
        {() => <ProtectedRoute component={AdminAdmins} adminOnly />}
      </Route>
      <Route path="/admin/transactions/users">
        {() => <ProtectedRoute component={AdminTransactionUsers} adminOnly />}
      </Route>
      <Route path="/admin/transactions/premium">
        {() => <ProtectedRoute component={AdminPremiumManage} adminOnly />}
      </Route>
      <Route path="/admin/transactions/details">
        {() => <ProtectedRoute component={AdminTransactionDetails} adminOnly />}
      </Route>
      <Route path="/admin/withdrawals">
        {() => <ProtectedRoute component={AdminWithdrawals} adminOnly />}
      </Route>
      <Route path="/admin/deposits">
        {() => <ProtectedRoute component={AdminDeposits} adminOnly />}
      </Route>
      <Route path="/admin/commissions">
        {() => <ProtectedRoute component={AdminCommissions} adminOnly />}
      </Route>
      <Route path="/admin/ads">
        {() => <ProtectedRoute component={AdminAds} adminOnly />}
      </Route>
      <Route path="/admin/slides">
        {() => <ProtectedRoute component={AdminSlides} adminOnly />}
      </Route>
      <Route path="/admin/contact/phone">
        {() => <ProtectedRoute component={AdminContact} adminOnly />}
      </Route>
      <Route path="/admin/contact/email">
        {() => <ProtectedRoute component={AdminContact} adminOnly />}
      </Route>
      <Route path="/admin/contact/whatsapp">
        {() => <ProtectedRoute component={AdminContact} adminOnly />}
      </Route>
      <Route path="/admin/contact/telegram">
        {() => <ProtectedRoute component={AdminContact} adminOnly />}
      </Route>
      <Route path="/admin/pages/about">
        {() => <ProtectedRoute component={AdminInfoPages} adminOnly />}
      </Route>
      <Route path="/admin/pages/terms">
        {() => <ProtectedRoute component={AdminInfoPages} adminOnly />}
      </Route>
      <Route path="/admin/pages/privacy">
        {() => <ProtectedRoute component={AdminInfoPages} adminOnly />}
      </Route>
      <Route path="/admin/content/home">
        {() => <ProtectedRoute component={AdminHomeContent} adminOnly />}
      </Route>
      <Route path="/admin/content/dashboard">
        {() => <ProtectedRoute component={AdminLabels} adminOnly />}
      </Route>
      <Route path="/admin/content/labels">
        {() => <ProtectedRoute component={AdminLabels} adminOnly />}
      </Route>
      <Route path="/admin/appearance/theme">
        {() => <ProtectedRoute component={AdminTheme} adminOnly />}
      </Route>
      <Route path="/admin/appearance/branding">
        {() => <ProtectedRoute component={AdminBranding} adminOnly />}
      </Route>
      <Route path="/admin/cms/dashboard">
        {() => <ProtectedRoute component={AdminDashboardSettings} adminOnly />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
