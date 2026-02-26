import { Switch, Route, useLocation } from "wouter";
import { queryClient, apiRequest } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Key } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@shared/routes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import RedacoesList from "@/pages/redacoes/list";
import CreateRedacao from "@/pages/redacoes/create";
import EvaluateRedacao from "@/pages/redacoes/evaluate";
import TurmasList from "@/pages/turmas/list";

function FirstLoginGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingRole, setPendingRole] = useState<'teacher' | 'admin' | null>(null);

  useEffect(() => {
    const intent = sessionStorage.getItem("login_intent");
    if (user?.isFirstLogin && intent && intent !== 'student') {
      setPendingRole(intent as 'teacher' | 'admin');
      setShowCodeDialog(true);
    }
  }, [user]);

  const handleVerifyCode = async () => {
    if (!accessCode || !pendingRole) return;
    setIsVerifying(true);
    try {
      const res = await apiRequest("POST", api.users.verifyCode.path, {
        code: accessCode,
        targetRole: pendingRole
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Sucesso", description: data.message });
        sessionStorage.removeItem("login_intent");
        setShowCodeDialog(false);
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      } else {
        toast({ title: "Erro", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Código inválido ou expirado.", variant: "destructive" });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancel = async () => {
    try {
      await apiRequest("PUT", `/api/users/${user?.id}`, { isFirstLogin: false });
      sessionStorage.removeItem("login_intent");
      setShowCodeDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {children}
      <Dialog open={showCodeDialog} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Verificação de Primeiro Acesso
            </DialogTitle>
            <DialogDescription>
              Você selecionou entrar como {pendingRole === 'admin' ? 'Administrador' : 'Professor'}. 
              Insira o código de acesso para confirmar sua identidade.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código de Acesso</Label>
              <Input
                id="code"
                placeholder="Insira o código"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyCode()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={handleCancel}>Continuar como Aluno</Button>
            <Button onClick={handleVerifyCode} disabled={!accessCode || isVerifying}>
              {isVerifying ? "Verificando..." : "Confirmar Acesso"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AuthenticatedApp() {
  return (
    <FirstLoginGuard>
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
                <Route path="/redacoes/:id" component={EvaluateRedacao} />
                <Route path="/turmas" component={TurmasList} />
                <Route path="/correcoes" component={RedacoesList} />
                <Route component={NotFound} />
              </Switch>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </FirstLoginGuard>
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
