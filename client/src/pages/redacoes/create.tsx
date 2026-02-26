import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { PageTransition } from "@/components/page-transition";
import { useCreateRedacao } from "@/hooks/use-redacoes";
import { useAuth } from "@/hooks/use-auth";
import { RichTextEditor, countWords } from "@/components/rich-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Send } from "lucide-react";
import { Link } from "wouter";

export default function CreateRedacao() {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const createMutation = useCreateRedacao();
  
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState("Salvo localmente");

  // Word count & mock auto-save
  useEffect(() => {
    setWordCount(countWords(texto));
    
    if (texto.length > 0) {
      setSaveStatus("Salvando...");
      const timer = setTimeout(() => {
        setSaveStatus("Salvo agora mesmo");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [texto]);

  const minWords = 300;
  const isBelowMin = wordCount > 0 && wordCount < minWords;

  const handleSubmit = () => {
    if (!titulo || !texto || isBelowMin) return;
    
    createMutation.mutate({
      titulo,
      texto,
      palavras: wordCount,
      turmaId: (user as any)?.turmaId || 1, // Fallback to 1 if no class assigned
      alunoId: user?.id as string
    }, {
      onSuccess: () => {
        setLocation("/redacoes");
      }
    });
  };

  return (
    <PageTransition className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/redacoes"><ArrowLeft size={20} /></Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Nova Redação</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Save size={14} />
          {saveStatus}
        </div>
      </div>

      <div className="space-y-6 bg-card p-6 md:p-8 rounded-3xl border border-border/50 shadow-xl shadow-black/5">
        <div className="space-y-2">
          <Label htmlFor="titulo" className="text-base font-semibold">Título da Redação</Label>
          <Input 
            id="titulo"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            placeholder="Ex: Os desafios da educação no século XXI"
            className="text-lg h-14 rounded-xl border-border/60 focus-visible:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Texto</Label>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${isBelowMin ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-600'}`}>
              {wordCount} palavras {isBelowMin && `(Mínimo: ${minWords})`}
            </span>
          </div>
          <RichTextEditor value={texto} onChange={setTexto} />
        </div>

        <div className="pt-4 flex justify-end">
          <Button 
            size="lg" 
            onClick={handleSubmit}
            disabled={!titulo || !texto || isBelowMin || createMutation.isPending}
            className="rounded-xl px-8 h-14 font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {createMutation.isPending ? "Enviando..." : (
              <>
                <Send size={18} className="mr-2" />
                Enviar para Correção
              </>
            )}
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
