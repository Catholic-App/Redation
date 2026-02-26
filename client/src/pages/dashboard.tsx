import { PageTransition } from "@/components/page-transition";
import { useAuth } from "@/hooks/use-auth";
import { useDashboardMetrics } from "@/hooks/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, BookOpen, Clock, Trophy } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const role = (user as any)?.role || 'student';
  const { data: metrics, isLoading } = useDashboardMetrics();

  if (isLoading) {
    return (
      <PageTransition className="p-6 space-y-6">
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-[400px] rounded-2xl" />
      </PageTransition>
    );
  }

  // Fallback mock data if API is incomplete
  const stats = metrics || {
    mediaTurma: 840,
    totalEnviadas: 142,
    totalPendentes: 24,
    evolucaoNotas: [
      { data: 'Mar', nota: 720 },
      { data: 'Abr', nota: 760 },
      { data: 'Mai', nota: 800 },
      { data: 'Jun', nota: 840 },
      { data: 'Jul', nota: 920 },
    ],
    ranking: [
      { aluno: "Ana Silva", media: 960 },
      { aluno: "João Pedro", media: 920 },
      { aluno: "Maria Clara", media: 880 },
    ]
  };

  return (
    <PageTransition className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Olá, {user?.firstName || 'Usuário'}! 👋
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            {role === 'student' ? 'Acompanhe seu desempenho e evolução.' : 'Aqui está o resumo das suas turmas.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-border/50 shadow-lg shadow-black/5 hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {role === 'student' ? 'Minha Média' : 'Média da Turma'}
            </CardTitle>
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Trophy size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display font-bold">{stats.mediaTurma}</div>
            <p className="text-sm text-green-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp size={14} /> +40 pontos desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-lg shadow-black/5 hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Redações Enviadas
            </CardTitle>
            <div className="p-2 bg-accent/50 text-accent-foreground rounded-lg">
              <BookOpen size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display font-bold">{stats.totalEnviadas}</div>
            <p className="text-sm text-muted-foreground mt-1">Neste semestre</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-lg shadow-black/5 hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {role === 'student' ? 'Corrigidas' : 'Pendentes de Correção'}
            </CardTitle>
            <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
              <Clock size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display font-bold">{stats.totalPendentes}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {role === 'student' ? 'Retornos recebidos' : 'Aguardando sua avaliação'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-2xl border-border/50 shadow-xl shadow-black/5">
          <CardHeader>
            <CardTitle className="text-xl font-display">Evolução de Notas</CardTitle>
            <CardDescription>Acompanhamento ao longo dos meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.evolucaoNotas} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNota" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="data" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} dy={10} />
                  <YAxis domain={[0, 1000]} axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="nota" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorNota)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-xl shadow-black/5">
          <CardHeader>
            <CardTitle className="text-xl font-display">Top Desempenho</CardTitle>
            <CardDescription>Maiores médias da turma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-2">
              {stats.ranking.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      i === 0 ? 'bg-yellow-400/20 text-yellow-600' :
                      i === 1 ? 'bg-gray-300/20 text-gray-500' :
                      i === 2 ? 'bg-orange-400/20 text-orange-600' : 'bg-primary/10 text-primary'
                    }`}>
                      {i + 1}
                    </div>
                    <span className="font-semibold">{item.aluno}</span>
                  </div>
                  <div className="font-display font-bold text-primary">{item.media}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
