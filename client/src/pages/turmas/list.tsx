import { PageTransition } from "@/components/page-transition";
import { useTurmas } from "@/hooks/use-turmas";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, GraduationCap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TurmasList() {
  const { data: turmas, isLoading } = useTurmas();

  return (
    <PageTransition className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Turmas</h1>
          <p className="text-muted-foreground mt-1">Gerencie turmas e alunos associados.</p>
        </div>
        <Button className="rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <Plus size={18} className="mr-2" />
          Nova Turma
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1,2,3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {turmas?.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-card rounded-2xl border border-dashed border-border">
              <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">Nenhuma turma criada</h3>
              <p className="text-muted-foreground text-sm mt-1">Adicione uma turma para organizar os alunos.</p>
            </div>
          ) : (
            turmas?.map((turma: any) => (
              <Card key={turma.id} className="rounded-2xl border-border/50 shadow-lg shadow-black/5 hover-elevate group cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Users size={24} />
                    </div>
                    <div className="text-sm font-semibold px-2 py-1 bg-secondary rounded-md text-secondary-foreground">
                      Ano {turma.ano}
                    </div>
                  </div>
                  <CardTitle className="text-2xl mt-4">{turma.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Turma Ativa
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </PageTransition>
  );
}
