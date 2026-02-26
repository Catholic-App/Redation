import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import RedacoesList from "@/pages/redacoes/list";
import CreateRedacao from "@/pages/redacoes/create";
import EvaluateRedacao from "@/pages/redacoes/evaluate";
import TurmasList from "@/pages/turmas/list";

function AuthenticatedApp() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <main className="flex-1 overflow-y-auto w-full relative">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/redacoes" component={RedacoesList} />
              <Route path="/escrever" component={CreateRedacao} />
              <Route path="/redacoes/:id/avaliar" component={EvaluateRedacao} />
              {/* Using same component for view and evaluate, behavior changes based on status internally */}
              <Route path="/redacoes/:id" component={EvaluateRedacao} />
              <Route path="/turmas" component={TurmasList} />
              <Route path="/correcoes" component={RedacoesList} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function MainRouter() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-primary">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="font-semibold text-muted-foreground animate-pulse">Carregando plataforma...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={LandingPage} />
        {/* All other unauthenticated paths redirect to Landing or 404 */}
        <Route component={LandingPage} />
      </Switch>
    );
  }

  return <AuthenticatedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300}>
        <MainRouter />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
