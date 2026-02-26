import { PageTransition } from "@/components/page-transition";
import { useRedacoes } from "@/hooks/use-redacoes";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Plus, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function RedacoesList() {
  const { user } = useAuth();
  const role = (user as any)?.role || 'student';
  const { data: redacoes, isLoading } = useRedacoes();

  return (
    <PageTransition className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Redações</h1>
          <p className="text-muted-foreground mt-1">Gerencie e visualize o histórico de redações.</p>
        </div>
        
        {role === 'student' && (
          <Button asChild className="rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <Link href="/escrever">
              <Plus size={18} className="mr-2" />
              Nova Redação
            </Link>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3 w-full max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Buscar por título..." 
            className="pl-10 rounded-xl bg-card border-border/60 focus-visible:ring-primary/20 h-12"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4 mt-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid gap-4 mt-6">
          {redacoes?.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">Nenhuma redação encontrada</h3>
              <p className="text-muted-foreground text-sm mt-1">As redações aparecerão aqui após o envio.</p>
            </div>
          ) : (
            redacoes?.map((item: any) => (
              <Card key={item.id} className="p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/30 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/5 text-primary shrink-0">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display group-hover:text-primary transition-colors">
                      {item.titulo}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span>{format(new Date(item.createdAt || new Date()), "dd 'de' MMM, yyyy", { locale: ptBR })}</span>
                      <span className="w-1 h-1 rounded-full bg-border"></span>
                      <span>{item.palavras} palavras</span>
                      {role === 'teacher' && item.alunoId && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-border"></span>
                          <span className="font-medium text-foreground">ID do Aluno: {item.alunoId}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 sm:ml-auto">
                  <div className="text-right">
                    <Badge variant={item.status === 'corrigido' ? 'default' : 'secondary'} className="rounded-md px-2 py-1 font-semibold">
                      {item.status === 'corrigido' ? 'Corrigido' : 'Pendente'}
                    </Badge>
                    {item.nota !== null && item.nota !== undefined && (
                      <div className="mt-2 text-sm font-bold text-foreground">
                        Nota: <span className="text-primary text-base">{item.nota}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button variant="ghost" size="icon" asChild className="rounded-full shrink-0 group-hover:bg-primary/10 group-hover:text-primary">
                    <Link href={role === 'teacher' && item.status === 'pendente' ? `/redacoes/${item.id}/avaliar` : `/redacoes/${item.id}`}>
                      <ChevronRight size={20} />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </PageTransition>
  );
}
