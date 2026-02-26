import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

interface RichTextEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

export function RichTextEditor({ value, onChange, readOnly = false }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Desenvolva sua redação aqui. Tente ser claro, coeso e persuasivo...',
      }),
    ],
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none dark:prose-invert',
      },
    },
  });

  // Sync external value changes if needed (useful for initial load)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  return (
    <div className={`w-full rounded-xl border bg-card transition-colors ${readOnly ? 'opacity-90 bg-muted/30' : 'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary'}`}>
      <div className="p-4 border-b bg-muted/40 rounded-t-xl flex gap-2 items-center">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {readOnly ? 'Modo de Leitura' : 'Editor de Texto'}
        </div>
      </div>
      <EditorContent editor={editor} className="min-h-[400px]" />
    </div>
  );
}

// Utility to count words from HTML
export function countWords(html: string): number {
  if (!html) return 0;
  const text = html.replace(/<[^>]*>?/gm, ' ').replace(/&nbsp;/g, ' ').trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
}
