import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MapPreview from "@/components/MapPreview";
import { FuturisticAlienHero } from "@/components/ui/futuristic-alien-hero";
import { Map, Search, MapPin, Users, ArrowRight, Building2, Music, Palette, Camera, Radio, GraduationCap, Building, Heart, Briefcase, ChevronRight, Sparkles, Lightbulb, Users2, Mic2, FlaskConical } from "lucide-react";
import Navbar from "@/components/Navbar";
import logoImage from "@/assets/creative-atlas-logo.png";
import lorikeetLogo from "@/assets/lorikeet-network-logo.png";

const Landing = () => {
  const navigate = useNavigate();
  const features = [{
    icon: Map,
    title: "Collaborative Mapping",
    description: "Navigate Australia's creative ecosystem in real time—venues, studios, festivals, innovators, cultural spaces, and positive-tech projects, all mapped for easy discovery."
  }, {
    icon: Search,
    title: "Connection-Focused Search",
    description: "Filter by category, location, practice, project type, or intention. Whether you're seeking collaborators, partners, spaces, or ideas, the Atlas helps you find the right people."
  }, {
    icon: MapPin,
    title: "In-Depth Profiles",
    description: "Every listing includes clear descriptions, contact information, capabilities, accessibility details, and context—so you understand how each entity works and how to engage them."
  }, {
    icon: Users,
    title: "Community-Driven Contributions",
    description: "Submit your own space, initiative, collective, or project to strengthen the network and increase visibility for authentic creative collaboration."
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
    icon: Sparkles
  }, {
    name: "Technology for Good",
    icon: Lightbulb
  }, {
    name: "Collective",
    icon: Users2
  }, {
    name: "Production",
    icon: Mic2
  }, {
    name: "Innovation Lab",
    icon: FlaskConical
  }];
  const steps = [{
    number: "01",
    title: "Browse the Network",
    description: "Use the interactive map and filters to explore Australia's creative and innovation landscape."
  }, {
    number: "02",
    title: "Learn & Connect",
    description: "Open any listing for detailed information, context, and contact details to support real collaboration."
  }, {
    number: "03",
    title: "Contribute Your Space or Project",
    description: "Sign in to add your venue, initiative, or creative hub and join a growing network committed to collaboration and societal good."
  }];
  const highlights = ["Venues, studios, stages, and live music infrastructure", "Festivals, producers, and cultural organisers", "Creative hubs, coworking spaces, and community centres", "Arts organisations, collectives, and peak bodies", "Digital and emerging technology projects that are \"good for society\"", "Education, training, and professional pathways", "Management, labels, platforms, and production partners"];

  return <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <FuturisticAlienHero />

      <Separator className="bg-border" />

      {/* Intro Text Section */}
      <section className="py-16 md:py-20 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 text-white">
              Find the collaborators, spaces, and creative opportunities shaping Australia's future.
            </h2>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed">
              A living map of music, arts, creative industries, and socially positive technology—built to spark genuine connection, partnership, and shared innovation.
            </p>
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              Features
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
              Designed for Collaboration and Creative Connection
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => <Card key={index} className="transition-all duration-300 hover:shadow-lg group bg-[#1a1a1a] border-[#333]">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-[#333]">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg md:text-xl text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm md:text-base text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Map Preview Section */}
      <section className="py-16 md:py-24 bg-[#121212]">
        <div className="container mx-auto px-4">
          <Card className="text-center max-w-3xl mx-auto mb-8 md:mb-12 backdrop-blur-sm bg-card/80 border-border/50">
            <CardHeader>
              <Badge variant="secondary" className="mb-4 px-4 py-1.5 w-fit mx-auto">
                Discover
              </Badge>
              <CardTitle className="text-2xl md:text-4xl font-bold text-white">
                Explore the Map
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <CardDescription className="text-base md:text-lg text-gray-400">
                Trace the connections that power Australia's creative life. Pan, zoom, and explore the people, places, and projects driving music, arts, culture, and ethical innovation in your region.
              </CardDescription>
              <div className="text-left max-w-xl mx-auto">
                <p className="text-sm font-medium text-white mb-3">The Creative Atlas highlights:</p>
                <ul className="space-y-2">
                  {highlights.map((item, index) => <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {item}
                    </li>)}
                </ul>
              </div>
            </CardContent>
          </Card>
          <div className="rounded-xl overflow-hidden border border-border shadow-lg">
            <MapPreview />
          </div>
          <div className="text-center mt-8">
            <Button size="lg" onClick={() => navigate("/map")} className="text-base md:text-lg h-12 px-6 md:px-8 gap-2">
              Explore Full Map
              <Map className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-[#121212]">
        <div className="container mx-auto px-4">
          <Card className="text-center max-w-2xl mx-auto mb-12 md:mb-16 backdrop-blur-sm bg-card/80 border-border/50">
            <CardHeader>
              <Badge variant="secondary" className="mb-4 px-4 py-1.5 w-fit mx-auto">
                How It Works
              </Badge>
              <CardTitle className="text-2xl md:text-4xl font-bold text-white">
                A simple way to find collaborators and opportunities
              </CardTitle>
            </CardHeader>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => <div key={index} className="relative text-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full text-xl md:text-2xl font-bold flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg group-hover:scale-105 transition-all duration-300 bg-white text-[#121212]">
                  {step.number}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-gray-400">
                  {step.description}
                </p>
                {index < steps.length - 1 && <ChevronRight className="hidden md:block absolute top-10 -right-4 w-8 h-8 text-gray-600" />}
              </div>)}
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Categories Preview */}
      <section className="py-16 md:py-24 bg-[#121212]">
        <div className="container mx-auto px-4">
          <Card className="text-center max-w-3xl mx-auto mb-8 md:mb-12 backdrop-blur-sm bg-card/80 border-border/50">
            <CardHeader>
              <Badge variant="secondary" className="mb-4 px-4 py-1.5 w-fit mx-auto">
                Categories
              </Badge>
              <CardTitle className="text-2xl md:text-4xl font-bold text-white">
                Explore by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base md:text-lg text-gray-400">
                Creative Atlas spans the full breadth of Australia's music, arts, cultural, and creative-tech ecosystem
              </CardDescription>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 max-w-6xl mx-auto">
            {categories.map((category, index) => <Card key={index} className="cursor-pointer transition-all duration-300 hover:shadow-md group bg-[#1a1a1a] border-[#333]" onClick={() => navigate("/map")}>
                <CardContent className="p-3 md:p-4 flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <category.icon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-white">
                    {category.name}
                  </span>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#121212]">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-3xl mx-auto backdrop-blur-sm bg-card/80 border-border/50">
            <CardHeader>
              <Badge variant="secondary" className="mb-4 px-4 py-1.5 w-fit mx-auto">
                Join the Network
              </Badge>
              <CardTitle className="text-2xl md:text-5xl font-bold text-white">
                Ready to Connect with Australia's Creative Community?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 md:space-y-8">
              <CardDescription className="text-lg md:text-xl max-w-2xl mx-auto text-gray-400">
                Discover collaborators, find the right spaces, and build meaningful relationships that support creativity and positive innovation nationwide.
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-4">
                <Button size="lg" onClick={() => navigate("/map")} className="text-base md:text-lg h-12 px-6 md:px-8 gap-2">
                  View the Map
                  <Map className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-base md:text-lg h-12 px-6 md:px-8 gap-2">
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
      <footer className="border-t border-border py-8 md:py-12 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
              <img src={logoImage} alt="Creative Atlas" className="h-8 w-auto object-contain" />
              <span className="text-xs md:text-sm text-gray-400">
                © 2025 Creative Atlas. Mapping collaboration and creative innovation across Australia.
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
              {["About", "Contact", "Terms", "Privacy"].map(link => <button key={link} className="text-gray-400 hover:text-white transition-colors py-2">
                  {link}
                </button>)}
            </div>
          </div>
          
          <Separator className="my-6 md:my-8 bg-[#333]" />
          
          {/* Lorikeet Network Attribution */}
          <div className="flex flex-col items-center gap-3">
            <a href="https://www.lorikeet.network" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src={lorikeetLogo} alt="Lorikeet Network" className="h-10 md:h-12 w-auto object-contain" />
            </a>
            <p className="text-xs md:text-sm text-gray-400 text-center max-w-md">
              A project of the{" "}
              <a href="https://www.lorikeet.network" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline">
                Lorikeet Network
              </a>
              {" "}— supporting Australia's creative and socially positive future.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Landing;