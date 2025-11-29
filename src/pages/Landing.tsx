import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import MapPreview from "@/components/MapPreview";
import { FuturisticAlienHero } from "@/components/ui/futuristic-alien-hero";
import { Map, Search, MapPin, Sparkles, ArrowRight, Building2, Music, Palette, Camera, Radio, Megaphone, GraduationCap, Building, Heart, Briefcase, ChevronRight } from "lucide-react";
import logoImage from "@/assets/creative-atlas-logo.png";
import lorikeetLogo from "@/assets/lorikeet-network-logo.png";

const Landing = () => {
  const navigate = useNavigate();
  
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
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="h-16 flex items-center justify-between w-full px-5 bg-[#121212]">
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

      {/* Hero Section */}
      <FuturisticAlienHero />

      <Separator className="bg-border" />

      {/* Features Section */}
      <section className="py-24 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Everything You Need to Connect
            </h2>
            <p className="text-lg text-gray-400">
              Discover, explore, and contribute to Australia's vibrant creative ecosystem
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-lg group bg-[#1a1a1a] border-[#333]">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-[#333]">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Map Preview Section */}
      <section className="py-24 bg-[#121212]">
        <div className="container mx-auto px-4">
          <Card className="text-center max-w-2xl mx-auto mb-12 backdrop-blur-sm bg-card/80 border-border/50">
            <CardHeader>
              <Badge variant="secondary" className="mb-4 px-4 py-1.5 w-fit mx-auto">
                Discover
              </Badge>
              <CardTitle className="text-3xl md:text-4xl font-bold text-white">
                Explore the Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg text-gray-400">
                Discover hundreds of creative spaces across the country. Pan, zoom, and find the vibrant creative scene near you.
              </CardDescription>
            </CardContent>
          </Card>
          <div className="rounded-xl overflow-hidden border border-border shadow-lg">
            <MapPreview />
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* How It Works Section */}
      <section className="py-24 bg-[#121212]">
        <div className="container mx-auto px-4">
          <Card className="text-center max-w-2xl mx-auto mb-16 backdrop-blur-sm bg-card/80 border-border/50">
            <CardHeader>
              <Badge variant="secondary" className="mb-4 px-4 py-1.5 w-fit mx-auto">
                Getting Started
              </Badge>
              <CardTitle className="text-3xl md:text-4xl font-bold text-white">
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg text-gray-400">
                Get started in three simple steps
              </CardDescription>
            </CardContent>
          </Card>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center group">
                <div className="w-20 h-20 rounded-full text-2xl font-bold flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-105 transition-all duration-300 bg-white text-[#121212]">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {step.title}
                </h3>
                <p className="text-gray-400">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-10 -right-4 w-8 h-8 text-gray-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Categories Preview */}
      <section className="py-24 bg-[#121212]">
        <div className="container mx-auto px-4">
          <Card className="text-center max-w-2xl mx-auto mb-12 backdrop-blur-sm bg-card/80 border-border/50">
            <CardHeader>
              <Badge variant="secondary" className="mb-4 px-4 py-1.5 w-fit mx-auto">
                Categories
              </Badge>
              <CardTitle className="text-3xl md:text-4xl font-bold text-white">
                Explore by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg text-gray-400">
                From venues and studios to festivals and creative spaces
              </CardDescription>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="cursor-pointer transition-all duration-300 hover:shadow-md group bg-[#1a1a1a] border-[#333]" 
                onClick={() => navigate("/map")}
              >
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <category.icon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-white">
                    {category.name}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* CTA Section */}
      <section className="py-24 bg-[#121212]">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-3xl mx-auto backdrop-blur-sm bg-card/80 border-border/50">
            <CardHeader>
              <Badge variant="secondary" className="mb-4 px-4 py-1.5 w-fit mx-auto">
                Get Started
              </Badge>
              <CardTitle className="text-3xl md:text-5xl font-bold text-white">
                Ready to Explore Australia's Creative Scene?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <CardDescription className="text-xl max-w-2xl mx-auto text-gray-400">
                Join our community and discover the spaces that bring creativity to life
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" onClick={() => navigate("/map")} className="text-lg h-12 px-8 gap-2">
                  View the Map
                  <Map className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg h-12 px-8 gap-2 border-[#333] hover:bg-[#1a1a1a] text-white">
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="Creative Atlas" className="h-8 w-auto object-contain" />
              <span className="text-sm text-gray-400">
                © 2025 Creative Atlas. Mapping Australia's music, creative & arts sectors.
              </span>
            </div>
            <div className="flex gap-6 text-sm">
              {["About", "Contact", "Terms", "Privacy"].map(link => (
                <button key={link} className="text-gray-400 hover:text-white transition-colors">
                  {link}
                </button>
              ))}
            </div>
          </div>
          
          <Separator className="my-8 bg-[#333]" />
          
          {/* Lorikeet Network Attribution */}
          <div className="flex flex-col items-center gap-3">
            <a href="https://www.lorikeet.network" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src={lorikeetLogo} alt="Lorikeet Network" className="h-12 w-auto object-contain" />
            </a>
            <p className="text-sm text-gray-400">
              This app/site is a project of the{" "}
              <a href="https://www.lorikeet.network" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline">
                Lorikeet Network
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
