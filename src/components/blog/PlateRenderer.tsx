import { cn } from '@/lib/utils';
import React from 'react';

interface PlateRendererProps {
  content: any[];
  className?: string;
}

const renderLeaf = (leaf: any, index: number): React.ReactNode => {
  let text: React.ReactNode = leaf.text;
  
  if (leaf.bold) {
    text = <strong key={`bold-${index}`}>{text}</strong>;
  }
  if (leaf.italic) {
    text = <em key={`italic-${index}`}>{text}</em>;
  }
  if (leaf.underline) {
    text = <u key={`underline-${index}`}>{text}</u>;
  }
  if (leaf.code) {
    text = <code key={`code-${index}`} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{text}</code>;
  }
  
  return text;
};

const renderChildren = (children: any[]): React.ReactNode => {
  return children?.map((child, i) => renderLeaf(child, i));
};

export const PlateRenderer = ({ content, className }: PlateRendererProps) => {
  if (!content || !Array.isArray(content)) {
    return <p className="text-muted-foreground">No content</p>;
  }

  return (
    <div className={cn("prose prose-lg max-w-none", className)}>
      {content.map((block: any, i: number) => {
        const children = renderChildren(block.children);
        
        switch (block.type) {
          case 'h1':
            return <h1 key={i} className="text-4xl font-bold mb-6 mt-8 text-foreground">{children}</h1>;
          case 'h2':
            return <h2 key={i} className="text-3xl font-semibold mb-4 mt-6 text-foreground">{children}</h2>;
          case 'h3':
            return <h3 key={i} className="text-2xl font-semibold mb-3 mt-4 text-foreground">{children}</h3>;
          case 'blockquote':
            return (
              <blockquote key={i} className="border-l-4 border-primary pl-6 my-6 italic text-muted-foreground">
                {children}
              </blockquote>
            );
          default:
            return <p key={i} className="mb-4 leading-relaxed text-foreground">{children}</p>;
        }
      })}
    </div>
  );
};

export default PlateRenderer;
