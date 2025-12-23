import { cn } from '@/lib/utils';

interface PlateRendererProps {
  content: any[];
  className?: string;
}

export const PlateRenderer = ({ content, className }: PlateRendererProps) => {
  if (!content || !Array.isArray(content)) {
    return <p className="text-muted-foreground">No content</p>;
  }

  return (
    <div className={cn("prose prose-lg max-w-none", className)}>
      {content.map((block: any, i: number) => {
        const text = block.children?.map((child: any) => child.text).join('') || '';
        
        switch (block.type) {
          case 'h1':
            return <h1 key={i} className="text-4xl font-bold mb-6 mt-8 text-foreground">{text}</h1>;
          case 'h2':
            return <h2 key={i} className="text-3xl font-semibold mb-4 mt-6 text-foreground">{text}</h2>;
          case 'h3':
            return <h3 key={i} className="text-2xl font-semibold mb-3 mt-4 text-foreground">{text}</h3>;
          case 'blockquote':
            return (
              <blockquote key={i} className="border-l-4 border-primary pl-6 my-6 italic text-muted-foreground">
                {text}
              </blockquote>
            );
          default:
            return <p key={i} className="mb-4 leading-relaxed text-foreground">{text}</p>;
        }
      })}
    </div>
  );
};

export default PlateRenderer;
