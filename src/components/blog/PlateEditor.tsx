import { useCallback, useMemo } from 'react';
import { withProps } from '@udecode/cn';
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { HeadingPlugin } from '@udecode/plate-heading/react';
import {
  Plate,
  PlateContent,
  PlateElement,
  PlateLeaf,
  usePlateEditor,
  useEditorRef,
} from '@udecode/plate/react';
import { Bold, Italic, Underline, Heading1, Heading2, Heading3, Quote, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PlateEditorProps {
  value: any[];
  onChange: (value: any[]) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const ToolbarButton = ({
  onClick,
  children,
  title,
  active = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  title: string;
  active?: boolean;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={onClick}
    title={title}
    className={cn("h-8 w-8 p-0", active && "bg-muted")}
  >
    {children}
  </Button>
);

const defaultValue = [
  {
    id: '1',
    type: 'p',
    children: [{ text: '' }],
  },
];

// Toolbar component that uses the editor context
const EditorToolbar = () => {
  const editor = useEditorRef();

  const toggleMark = (mark: string) => {
    editor.tf.toggleMark(mark);
  };

  const toggleBlock = (type: string) => {
    editor.tf.toggleBlock(type);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
      <ToolbarButton onClick={() => toggleMark('bold')} title="Bold (Ctrl+B)">
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => toggleMark('italic')} title="Italic (Ctrl+I)">
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => toggleMark('underline')} title="Underline (Ctrl+U)">
        <Underline className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => toggleMark('code')} title="Code">
        <Code className="h-4 w-4" />
      </ToolbarButton>
      <div className="w-px h-6 bg-border mx-1" />
      <ToolbarButton onClick={() => toggleBlock('h1')} title="Heading 1">
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => toggleBlock('h2')} title="Heading 2">
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => toggleBlock('h3')} title="Heading 3">
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>
      <div className="w-px h-6 bg-border mx-1" />
      <ToolbarButton onClick={() => toggleBlock('blockquote')} title="Quote">
        <Quote className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
};

export const PlateEditor = ({
  value,
  onChange,
  placeholder = "Start writing your article...",
  readOnly = false,
}: PlateEditorProps) => {
  const initialValue = useMemo(() => {
    if (!value || !Array.isArray(value) || value.length === 0) {
      return defaultValue;
    }
    return value;
  }, []);

  const editor = usePlateEditor({
    plugins: [
      BlockquotePlugin,
      HeadingPlugin,
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
      CodePlugin,
    ],
    override: {
      components: {
        blockquote: withProps(PlateElement, {
          as: 'blockquote',
          className: 'mb-4 border-l-4 border-primary pl-4 text-muted-foreground italic',
        }),
        bold: withProps(PlateLeaf, { as: 'strong' }),
        code: withProps(PlateLeaf, { 
          as: 'code',
          className: 'bg-muted px-1.5 py-0.5 rounded text-sm font-mono',
        }),
        h1: withProps(PlateElement, {
          as: 'h1',
          className: 'mb-4 mt-6 text-4xl font-bold tracking-tight text-foreground',
        }),
        h2: withProps(PlateElement, {
          as: 'h2',
          className: 'mb-4 mt-6 text-3xl font-semibold tracking-tight text-foreground',
        }),
        h3: withProps(PlateElement, {
          as: 'h3',
          className: 'mb-3 mt-4 text-2xl font-semibold tracking-tight text-foreground',
        }),
        italic: withProps(PlateLeaf, { as: 'em' }),
        p: withProps(PlateElement, {
          as: 'p',
          className: 'mb-4 leading-relaxed text-foreground',
        }),
        underline: withProps(PlateLeaf, { as: 'u' }),
      },
    },
    value: initialValue,
  });

  const handleChange = useCallback(({ value: newValue }: { editor: any; value: any[] }) => {
    onChange(newValue);
  }, [onChange]);

  if (readOnly) {
    return (
      <Plate editor={editor} readOnly>
        <PlateContent className="prose prose-lg max-w-none outline-none" />
      </Plate>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <Plate editor={editor} onChange={handleChange}>
        <EditorToolbar />
        <PlateContent 
          className="min-h-[300px] p-4 outline-none focus:outline-none text-base leading-relaxed"
          placeholder={placeholder}
        />
      </Plate>
    </div>
  );
};

export default PlateEditor;
