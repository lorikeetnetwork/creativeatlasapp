import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import MapPreview from "@/components/MapPreview";
import { FuturisticAlienHero } from "@/components/ui/futuristic-alien-hero";
import { LandingColorEditor, defaultLandingColors, ColorConfig } from "@/components/LandingColorEditor";
import { Map, Search, MapPin, Users, Sparkles, ArrowRight, Building2, Music, Palette, Camera, Radio, Megaphone, GraduationCap, Building, Heart, Briefcase, ChevronRight } from "lucide-react";
import logoImage from "@/assets/creative-atlas-logo.png";
import lorikeetLogo from "@/assets/lorikeet-network-logo.png";
const STORAGE_KEY = "landing-page-colors";
const Landing = () => {
  const navigate = useNavigate();
  const [colors, setColors] = useState<ColorConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultLandingColors;
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
  }, [colors]);
  const features = [{
    icon: Map,
    title: "Interactive Mapping",
    description: "Explore creative spaces across Australia with our intuitive map interface"
  }, {
    icon: Search,
    title: "Advanced Search",
    description: "Filter by category, location, and keywords to find exactly what you need"
  }, {
    icon: MapPin,
    title: "Detailed Information",
    description: "Complete contact details, descriptions, capacity, and accessibility info"
  }, {
    icon: Sparkles,
    title: "Submit Your Space",
    description: "Share your creative venue with the community (requires sign-in)"
  }];
  const categories = [{
    name: "Venue",
    icon: Building2
  }, {
    name: "Studio",
    icon: Music
  }, {
    name: "Festival",
    icon: Radio
  }, {
    name: "Gallery",
    icon: Palette
  }, {
    name: "Label",
    icon: Camera
  }, {
    name: "Management",
    icon: Briefcase
  }, {
    name: "Education",
    icon: GraduationCap
  }, {
    name: "Peak Body",
    icon: Building
  }, {
    name: "Community",
    icon: Heart
  }, {
    name: "Creative Hub",
    icon: Megaphone
  }];
  const steps = [{
    number: "01",
    title: "Browse the Map",
    description: "Explore creative spaces across Australia with interactive filters"
  }, {
    number: "02",
    title: "View Details",
    description: "Click any location to see comprehensive information and contact details"
  }, {
    number: "03",
    title: "Submit Your Space",
    description: "Sign up to add your venue and connect with the creative community"
  }];
  return <div className="min-h-screen bg-background">
      {/* Color Editor */}
      <LandingColorEditor colors={colors} onColorsChange={setColors} />

      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="h-16 flex items-center justify-between w-full px-5 bg-[#eeff00]">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Creative Atlas" className="h-14 w-auto object-contain" />
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate("/pricing")} className="text-foreground hover:text-primary">
              Pricing
            </Button>
            <Button variant="ghost" onClick={() => navigate("/map")} className="text-foreground hover:text-primary">
              Explore Map
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section - UNCHANGED */}
      <FuturisticAlienHero />

      <Separator className="bg-border" />

      {/* Features Section */}
      <section style={{
      backgroundColor: colors.featuresBg
    }} className="py-24 transition-colors duration-300 bg-destructive">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300" style={{
            color: colors.featuresTitle
          }}>
              Everything You Need to Connect
            </h2>
            <p className="text-lg transition-colors duration-300" style={{
            color: colors.featuresText
          }}>
              Discover, explore, and contribute to Australia's vibrant creative ecosystem
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => <Card key={index} className="transition-all duration-300 hover:shadow-lg group" style={{
            backgroundColor: colors.featuresCardBg,
            borderColor: colors.featuresCardBorder
          }}>
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors" style={{
                backgroundColor: colors.featuresIconBg
              }}>
                    <feature.icon className="w-6 h-6 transition-colors" style={{
                  color: colors.featuresIcon
                }} />
                  </div>
                  <CardTitle className="text-xl transition-colors duration-300" style={{
                color: colors.featuresTitle
              }}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base transition-colors duration-300" style={{
                color: colors.featuresText
              }}>
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Map Preview Section */}
      <section style={{
      backgroundColor: colors.mapBg
    }} className="py-24 transition-colors duration-300 bg-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            
            <h2 style={{
            color: colors.mapTitle
          }} className="text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300 text-primary-glow">
              Explore the Map
            </h2>
            <p style={{
            color: colors.mapText
          }} className="text-lg transition-colors duration-300 text-secondary">
              Discover hundreds of creative spaces across the country. Pan, zoom, and find the vibrant creative scene near you.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-border shadow-lg">
            <MapPreview />
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* How It Works Section */}
      <section style={{
      backgroundColor: colors.howItWorksBg
    }} className="py-24 transition-colors duration-300 border-destructive bg-destructive">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300" style={{
            color: colors.howItWorksTitle
          }}>
              How It Works
            </h2>
            <p className="text-lg transition-colors duration-300" style={{
            color: colors.howItWorksText
          }}>
              Get started in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => <div key={index} className="relative text-center group">
                <div className="w-20 h-20 rounded-full text-2xl font-bold flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-105 transition-all duration-300" style={{
              backgroundColor: colors.stepCircleBg,
              color: colors.stepCircleText,
              boxShadow: `0 10px 25px -5px ${colors.stepCircleBg}40`
            }}>
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3 transition-colors duration-300" style={{
              color: colors.howItWorksTitle
            }}>
                  {step.title}
                </h3>
                <p className="transition-colors duration-300" style={{
              color: colors.howItWorksText
            }}>
                  {step.description}
                </p>
                {index < steps.length - 1 && <ChevronRight className="hidden md:block absolute top-10 -right-4 w-8 h-8" style={{
              color: `${colors.howItWorksText}50`
            }} />}
              </div>)}
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Categories Preview */}
      <section style={{
      backgroundColor: colors.categoriesBg
    }} className="py-24 transition-colors duration-300 bg-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300" style={{
            color: colors.categoriesTitle
          }}>
              Explore by Category
            </h2>
            <p className="text-lg transition-colors duration-300" style={{
            color: colors.categoriesText
          }}>
              From venues and studios to festivals and creative spaces
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {categories.map((category, index) => <Card key={index} className="cursor-pointer transition-all duration-300 hover:shadow-md group" style={{
            backgroundColor: colors.categoryCardBg,
            borderColor: colors.categoryCardBorder
          }} onClick={() => navigate("/map")}>
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <category.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-sm font-medium transition-colors duration-300" style={{
                color: colors.categoriesTitle
              }}>
                    {category.name}
                  </span>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* CTA Section */}
      <section style={{
      backgroundColor: colors.ctaBg
    }} className="py-24 transition-colors duration-300 bg-destructive">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            
            <h2 className="text-3xl md:text-5xl font-bold transition-colors duration-300" style={{
            color: colors.ctaTitle
          }}>
              Ready to Explore Australia's Creative Scene?
            </h2>
            <p className="text-xl max-w-2xl mx-auto transition-colors duration-300" style={{
            color: colors.ctaText
          }}>
              Join our community and discover the spaces that bring creativity to life
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" onClick={() => navigate("/map")} className="text-lg h-12 px-8 gap-2">
                View the Map
                <Map className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg h-12 px-8 gap-2 border-slate-700 hover:bg-slate-800" style={{
              color: colors.ctaTitle
            }}>
                Create Account
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Footer */}
      <footer style={{
      backgroundColor: colors.footerBg
    }} className="border-t border-border py-12 transition-colors duration-300 bg-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="Creative Atlas" className="h-8 w-auto object-contain" />
              <span className="text-sm transition-colors duration-300" style={{
              color: colors.footerText
            }}>
                © 2025 Creative Atlas. Mapping Australia's music, creative & arts sectors.
              </span>
            </div>
            <div className="flex gap-6 text-sm">
              {["About", "Contact", "Terms", "Privacy"].map(link => <button key={link} className="hover:text-white transition-colors" style={{
              color: colors.footerText
            }}>
                  {link}
                </button>)}
            </div>
          </div>
          
          <Separator className="my-8 bg-slate-800" />
          
          {/* Lorikeet Network Attribution */}
          <div className="flex flex-col items-center gap-3">
            <a href="https://www.lorikeet.network" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src={lorikeetLogo} alt="Lorikeet Network" className="h-12 w-auto object-contain" />
            </a>
            <p className="text-sm transition-colors duration-300" style={{
            color: colors.footerText
          }}>
              This app/site is a project of the{" "}
              <a href="https://www.lorikeet.network" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline">
                Lorikeet Network
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Landing;