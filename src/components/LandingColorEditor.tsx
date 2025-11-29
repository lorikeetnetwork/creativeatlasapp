import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Palette, RotateCcw, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ColorConfig {
  // Features section
  featuresBg: string;
  featuresCardBg: string;
  featuresCardBorder: string;
  featuresTitle: string;
  featuresText: string;
  featuresIconBg: string;
  featuresIcon: string;
  
  // Map section
  mapBg: string;
  mapTitle: string;
  mapText: string;
  
  // How it works section
  howItWorksBg: string;
  howItWorksTitle: string;
  howItWorksText: string;
  stepCircleBg: string;
  stepCircleText: string;
  
  // Categories section
  categoriesBg: string;
  categoriesTitle: string;
  categoriesText: string;
  categoryCardBg: string;
  categoryCardBorder: string;
  
  // CTA section
  ctaBg: string;
  ctaTitle: string;
  ctaText: string;
  
  // Footer
  footerBg: string;
  footerText: string;
}

const defaultColors: ColorConfig = {
  featuresBg: "#020617",
  featuresCardBg: "rgba(15, 23, 42, 0.5)",
  featuresCardBorder: "#1e293b",
  featuresTitle: "#ffffff",
  featuresText: "#94a3b8",
  featuresIconBg: "rgba(199, 89, 48, 0.1)",
  featuresIcon: "#c75930",
  
  mapBg: "#faf5f0",
  mapTitle: "#1c1917",
  mapText: "#78716c",
  
  howItWorksBg: "#020617",
  howItWorksTitle: "#ffffff",
  howItWorksText: "#94a3b8",
  stepCircleBg: "#c75930",
  stepCircleText: "#ffffff",
  
  categoriesBg: "#faf5f0",
  categoriesTitle: "#1c1917",
  categoriesText: "#78716c",
  categoryCardBg: "#ffffff",
  categoryCardBorder: "#e7e5e4",
  
  ctaBg: "#0f172a",
  ctaTitle: "#ffffff",
  ctaText: "#94a3b8",
  
  footerBg: "#020617",
  footerText: "#64748b",
};

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorInput = ({ label, value, onChange }: ColorInputProps) => (
  <div className="flex items-center gap-3">
    <input
      type="color"
      value={value.startsWith("rgba") || value.startsWith("#") ? (value.startsWith("#") ? value : "#ffffff") : value}
      onChange={(e) => onChange(e.target.value)}
      className="w-10 h-10 rounded-md border border-border cursor-pointer"
    />
    <div className="flex-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-xs font-mono"
        placeholder="#000000"
      />
    </div>
  </div>
);

interface LandingColorEditorProps {
  colors: ColorConfig;
  onColorsChange: (colors: ColorConfig) => void;
}

export const LandingColorEditor = ({ colors, onColorsChange }: LandingColorEditorProps) => {
  const [copied, setCopied] = useState(false);

  const updateColor = (key: keyof ColorConfig, value: string) => {
    onColorsChange({ ...colors, [key]: value });
  };

  const resetColors = () => {
    onColorsChange(defaultColors);
    toast.success("Colors reset to defaults");
  };

  const copyCSS = () => {
    const css = `/* Landing Page Custom Colors */
:root {
  --landing-features-bg: ${colors.featuresBg};
  --landing-features-card-bg: ${colors.featuresCardBg};
  --landing-features-title: ${colors.featuresTitle};
  --landing-features-text: ${colors.featuresText};
  --landing-map-bg: ${colors.mapBg};
  --landing-map-title: ${colors.mapTitle};
  --landing-how-it-works-bg: ${colors.howItWorksBg};
  --landing-categories-bg: ${colors.categoriesBg};
  --landing-cta-bg: ${colors.ctaBg};
  --landing-footer-bg: ${colors.footerBg};
}`;
    navigator.clipboard.writeText(css);
    setCopied(true);
    toast.success("CSS copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 border-0"
        >
          <Palette className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Editor
          </SheetTitle>
        </SheetHeader>
        <div className="px-6 pb-4 flex gap-2">
          <Button variant="outline" size="sm" onClick={resetColors} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={copyCSS} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            Copy CSS
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-160px)]">
          <div className="px-6 pb-6 space-y-6">
            {/* Features Section */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Features Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ColorInput label="Background" value={colors.featuresBg} onChange={(v) => updateColor("featuresBg", v)} />
                <ColorInput label="Card Background" value={colors.featuresCardBg} onChange={(v) => updateColor("featuresCardBg", v)} />
                <ColorInput label="Card Border" value={colors.featuresCardBorder} onChange={(v) => updateColor("featuresCardBorder", v)} />
                <ColorInput label="Title Color" value={colors.featuresTitle} onChange={(v) => updateColor("featuresTitle", v)} />
                <ColorInput label="Text Color" value={colors.featuresText} onChange={(v) => updateColor("featuresText", v)} />
                <ColorInput label="Icon Background" value={colors.featuresIconBg} onChange={(v) => updateColor("featuresIconBg", v)} />
                <ColorInput label="Icon Color" value={colors.featuresIcon} onChange={(v) => updateColor("featuresIcon", v)} />
              </CardContent>
            </Card>

            {/* Map Section */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Map Preview Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ColorInput label="Background" value={colors.mapBg} onChange={(v) => updateColor("mapBg", v)} />
                <ColorInput label="Title Color" value={colors.mapTitle} onChange={(v) => updateColor("mapTitle", v)} />
                <ColorInput label="Text Color" value={colors.mapText} onChange={(v) => updateColor("mapText", v)} />
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">How It Works Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ColorInput label="Background" value={colors.howItWorksBg} onChange={(v) => updateColor("howItWorksBg", v)} />
                <ColorInput label="Title Color" value={colors.howItWorksTitle} onChange={(v) => updateColor("howItWorksTitle", v)} />
                <ColorInput label="Text Color" value={colors.howItWorksText} onChange={(v) => updateColor("howItWorksText", v)} />
                <ColorInput label="Step Circle" value={colors.stepCircleBg} onChange={(v) => updateColor("stepCircleBg", v)} />
                <ColorInput label="Step Number" value={colors.stepCircleText} onChange={(v) => updateColor("stepCircleText", v)} />
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Categories Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ColorInput label="Background" value={colors.categoriesBg} onChange={(v) => updateColor("categoriesBg", v)} />
                <ColorInput label="Title Color" value={colors.categoriesTitle} onChange={(v) => updateColor("categoriesTitle", v)} />
                <ColorInput label="Text Color" value={colors.categoriesText} onChange={(v) => updateColor("categoriesText", v)} />
                <ColorInput label="Card Background" value={colors.categoryCardBg} onChange={(v) => updateColor("categoryCardBg", v)} />
                <ColorInput label="Card Border" value={colors.categoryCardBorder} onChange={(v) => updateColor("categoryCardBorder", v)} />
              </CardContent>
            </Card>

            {/* CTA */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">CTA Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ColorInput label="Background" value={colors.ctaBg} onChange={(v) => updateColor("ctaBg", v)} />
                <ColorInput label="Title Color" value={colors.ctaTitle} onChange={(v) => updateColor("ctaTitle", v)} />
                <ColorInput label="Text Color" value={colors.ctaText} onChange={(v) => updateColor("ctaText", v)} />
              </CardContent>
            </Card>

            {/* Footer */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Footer Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ColorInput label="Background" value={colors.footerBg} onChange={(v) => updateColor("footerBg", v)} />
                <ColorInput label="Text Color" value={colors.footerText} onChange={(v) => updateColor("footerText", v)} />
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export const defaultLandingColors = defaultColors;
export type { ColorConfig };
