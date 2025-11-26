import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import MapPreview from "@/components/MapPreview";
import { FuturisticAlienHero } from "@/components/ui/futuristic-alien-hero";
import { Map, Search, MapPin, Users, Sparkles, ArrowRight, Building2, Music, Palette, Camera, Radio, Megaphone, GraduationCap, Building, Heart, Briefcase } from "lucide-react";
import logoImage from "@/assets/creative-atlas-logo.png";
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
    icon: Building2,
    color: "bg-category-venue"
  }, {
    name: "Studio",
    icon: Music,
    color: "bg-category-studio"
  }, {
    name: "Festival",
    icon: Radio,
    color: "bg-category-festival"
  }, {
    name: "Gallery",
    icon: Palette,
    color: "bg-category-gallery"
  }, {
    name: "Label",
    icon: Camera,
    color: "bg-category-label"
  }, {
    name: "Management",
    icon: Briefcase,
    color: "bg-category-management"
  }, {
    name: "Education",
    icon: GraduationCap,
    color: "bg-category-education"
  }, {
    name: "Peak Body",
    icon: Building,
    color: "bg-category-government"
  }, {
    name: "Community",
    icon: Heart,
    color: "bg-category-community"
  }, {
    name: "Creative Hub",
    icon: Megaphone,
    color: "bg-category-coworking"
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
    {/* Header */}
    <header className="border-b bg-white">
      <div className="h-16 flex items-center justify-between w-full px-0 mx-0 text-slate-950 bg-white">
        <div className="flex items-center gap-3 pl-[20px]">
          <img src={logoImage} alt="Creative Atlas" className="h-14 w-auto object-contain" />
        </div>
        <div className="flex items-center gap-3 pr-[20px] ml-auto">
          <Button variant="ghost" onClick={() => navigate("/pricing")}>
            Pricing
          </Button>
          <Button variant="ghost" onClick={() => navigate("/map")}>
            Explore Map
          </Button>
          <Button onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </div>
      </div>
    </header>

      {/* Hero Section */}
      <FuturisticAlienHero />

      {/* Features Section */}
      <section className="py-20 text-yellow-500 border-slate-950 border-0 bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Connect
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover, explore, and contribute to Australia's vibrant creative ecosystem
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => <Card key={index} className="hover-scale">
                <CardHeader className="border-2 border-blue-700 bg-zinc-700">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-zinc-300" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="bg-slate-950">
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Map Preview Section */}
      <section className="py-20 border-red-600 border-0 bg-neutral-900">
        <div className="container mx-auto px-4 border-slate-900 border bg-zinc-600">
          <div className="text-center max-w-2xl mx-auto mb-12">
            
            <p className="text-lg text-gray-950">
              Explore hundreds of creative spaces across the country. Pan, zoom, and discover the vibrant creative scene near you.
            </p>
          </div>
          <MapPreview />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-zinc-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => <div key={index} className="relative text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && <ArrowRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-muted-foreground/30" />}
              </div>)}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 border-red-500 bg-neutral-700">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-slate-950">
              From venues and studios to festivals and creative spaces
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {categories.map((category, index) => <Badge key={index} variant="secondary" className="text-base py-2 px-4 gap-2 hover-scale cursor-pointer">
                <category.icon className="w-4 h-4" />
                {category.name}
              </Badge>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 bg-category-festival">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-950">
              Ready to Explore Australia's Creative Scene?
            </h2>
            <p className="text-xl text-slate-950">
              Join our community and discover the spaces that bring creativity to life
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" onClick={() => navigate("/map")} className="text-lg h-12 px-8">
                View the Map
                <Map className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg h-12 px-8">
                Create Account
                <Users className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="Creative Atlas" className="h-8 w-auto object-contain" />
              <span className="text-sm text-muted-foreground">© 2025 Creative Atlas. Mapping Australia's music, creative & arts sectors.</span>
            </div>
            <div className="flex gap-6 text-sm">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Landing;