import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { PageTransition } from "@/components/page-transition";
import { useRedacao, useEvaluateRedacao } from "@/hooks/use-redacoes";
import { RichTextEditor } from "@/components/rich-editor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle, Award } from "lucide-react";
import { Link } from "wouter";

export default function EvaluateRedacao() {
  const params = useParams();
  const id = Number(params.id);
  const [_, setLocation] = useLocation();
  
  const { data: redacao, isLoading } = useRedacao(id);
  const evaluateMutation = useEvaluateRedacao();
  
  const [nota, setNota] = useState<number>(500);
  const [comentario, setComentario] = useState("");

  // Pre-fill if already evaluated (for view mode)
  useEffect(() => {
    if (redacao) {
      if (redacao.nota) setNota(redacao.nota);
      if (redacao.comentario) setComentario(redacao.comentario);
    }
  }, [redacao]);

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-[600px] rounded-2xl" />
          <Skeleton className="h-[600px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!redacao) return <div className="p-8">Redação não encontrada.</div>;

  const isCorrigido = redacao.status === 'corrigido';

  const handleEvaluate = () => {
    if (!comentario) return;
    evaluateMutation.mutate({
      id,
      data: { nota, comentario }
    }, {
      onSuccess: () => setLocation("/redacoes")
    });
  };

  return (
    <PageTransition className="p-4 md:p-8 space-y-6 h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex items-center gap-4 shrink-0">
        <Button variant="outline" size="icon" asChild className="rounded-full bg-card">
          <Link href="/redacoes"><ArrowLeft size={20} /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">{redacao.titulo}</h1>
          <p className="text-sm text-muted-foreground mt-1">Autor ID: {redacao.alunoId} • {redacao.palavras} palavras</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: The Essay (Read Only) */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border/50 shadow-xl shadow-black/5 overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-muted/20 shrink-0">
            <h3 className="font-semibold">Conteúdo da Redação</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <RichTextEditor value={redacao.texto} readOnly />
          </div>
        </div>

        {/* Right Column: Grading Panel */}
        <div className="bg-card rounded-2xl border border-border/50 shadow-xl shadow-black/5 flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-muted/20 shrink-0 flex items-center gap-2">
            <Award className="text-primary" size={20} />
            <h3 className="font-semibold">Avaliação</h3>
          </div>
          
          <div className="p-6 space-y-8 flex-1 overflow-y-auto">
            <div className="space-y-4 bg-muted/20 p-5 rounded-xl border border-border/50">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Nota Final</Label>
                <div className="text-3xl font-display font-bold text-primary">{nota}</div>
              </div>
              <Slider
                disabled={isCorrigido}
                value={[nota]}
                onValueChange={(v) => setNota(v[0])}
                max={1000}
                step={20}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-medium">
                <span>0</span>
                <span>1000</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Feedback e Comentários</Label>
              <Textarea 
                disabled={isCorrigido}
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                placeholder="Escreva um feedback detalhado apontando pontos fortes e áreas de melhoria..."
                className="min-h-[250px] resize-none rounded-xl text-base leading-relaxed border-border/60 focus-visible:ring-primary/20"
              />
            </div>
          </div>
          
          {!isCorrigido && (
            <div className="p-4 border-t bg-muted/10 shrink-0">
              <Button 
                onClick={handleEvaluate}
                disabled={!comentario || evaluateMutation.isPending}
                className="w-full h-14 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                {evaluateMutation.isPending ? "Salvando..." : (
                  <>
                    <CheckCircle className="mr-2" size={20} />
                    Finalizar Correção
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
