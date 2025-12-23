import { useState, useCallback } from 'react';
import { Bold, Italic, Underline, Heading1, Heading2, Heading3, Quote, List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
}: {
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={onClick}
    title={title}
    className="h-8 w-8 p-0"
  >
    {children}
  </Button>
);

// Simple JSON-based editor that stores content as structured data
export const PlateEditor = ({
  value,
  onChange,
  placeholder = "Start writing your article...",
  readOnly = false,
}: PlateEditorProps) => {
  // Convert value array to plain text for editing
  const getTextContent = useCallback(() => {
    if (!value || !Array.isArray(value)) return '';
    return value.map((block: any) => {
      if (block.children) {
        return block.children.map((child: any) => child.text || '').join('');
      }
      return block.text || '';
    }).join('\n\n');
  }, [value]);

  const [text, setText] = useState(getTextContent());

  const handleChange = (newText: string) => {
    setText(newText);
    // Convert plain text to structured JSON format
    const paragraphs = newText.split('\n\n').filter(p => p.trim());
    const newValue = paragraphs.map(p => ({
      type: 'p',
      children: [{ text: p }],
    }));
    onChange(newValue.length > 0 ? newValue : [{ type: 'p', children: [{ text: '' }] }]);
  };

  if (readOnly) {
    return (
      <div className="prose prose-sm max-w-none">
        {value?.map((block: any, i: number) => (
          <p key={i} className="mb-3">
            {block.children?.map((child: any) => child.text).join('') || ''}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
        <ToolbarButton onClick={() => {}} title="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => {}} title="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => {}} title="Underline">
          <Underline className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton onClick={() => {}} title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => {}} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => {}} title="Heading 3">
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton onClick={() => {}} title="Quote">
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => {}} title="Bullet List">
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => {}} title="Numbered List">
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
      </div>
      
      <Textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "min-h-[300px] p-4 border-0 rounded-none resize-none focus-visible:ring-0",
          "text-base leading-relaxed"
        )}
      />
    </div>
  );
};

export default PlateEditor;
