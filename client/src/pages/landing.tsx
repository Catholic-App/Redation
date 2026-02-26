import { Button } from "@/components/ui/button";
import { PenTool, CheckCircle, TrendingUp, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/30 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <PenTool size={22} />
          </div>
          <span className="text-2xl font-bold font-display tracking-tight">RedaX</span>
        </div>
        <Button onClick={handleLogin} size="lg" className="rounded-full px-8 font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300">
          Entrar na Plataforma
        </Button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-12 py-12 lg:py-24 relative z-10">
        <div className="flex-1 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-primary text-sm font-semibold mb-6 border border-primary/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Nova experiência de correção
          </div>
          <h1 className="text-5xl lg:text-7xl font-display font-extrabold leading-[1.1] tracking-tight mb-6">
            Eleve o nível das <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-foreground">
              suas redações.
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
            A plataforma definitiva para escolas. Alunos enviam redações, professores corrigem com eficiência e dashboards mostram a evolução em tempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button onClick={handleLogin} size="lg" className="h-14 rounded-xl px-10 text-lg font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300">
              Começar Agora
            </Button>
            <Button variant="outline" size="lg" className="h-14 rounded-xl px-10 text-lg font-semibold bg-background/50 backdrop-blur-sm border-2">
              Ver Demonstração
            </Button>
          </div>
          
          <div className="flex items-center gap-8 mt-12 pt-10 border-t border-border/60 w-full max-w-xl">
            <div className="flex flex-col gap-1">
              <h4 className="text-3xl font-display font-bold text-foreground">10k+</h4>
              <p className="text-sm text-muted-foreground font-medium">Redações corrigidas</p>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="flex flex-col gap-1">
              <h4 className="text-3xl font-display font-bold text-foreground">50+</h4>
              <p className="text-sm text-muted-foreground font-medium">Escolas parceiras</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-2xl relative">
          {/* landing page hero education study writing */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 aspect-square lg:aspect-[4/3] group">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=900&fit=crop" 
              alt="Students learning" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {/* Floating Glass Card */}
            <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-6 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Nota: 960</h4>
                  <p className="text-white/80 text-sm">Competência III atingida com excelência.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
