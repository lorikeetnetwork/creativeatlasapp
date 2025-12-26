import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MapPreview from "@/components/MapPreview";
import { FuturisticAlienHero } from "@/components/ui/futuristic-alien-hero";
import { 
  Map, Search, MapPin, Users, ArrowRight, Building2, Music, Palette, Camera, Radio, 
  GraduationCap, Building, Heart, Briefcase, ChevronRight, Sparkles, Lightbulb, 
  Users2, Mic2, FlaskConical, Calendar, FileText, MessageSquare, Award, 
  BookOpen, Handshake, Star, Globe, Zap
} from "lucide-react";
import Navbar from "@/components/Navbar";
import logoImage from "@/assets/creative-atlas-logo.png";
import lorikeetLogo from "@/assets/lorikeet-network-logo.png";

const Landing = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: Map,
      title: "Interactive Map",
      description: "Navigate Australia's creative ecosystem—venues, studios, festivals, and creative hubs, all mapped for easy discovery."
    },
    {
      icon: Calendar,
      title: "Events Calendar",
      description: "Discover workshops, exhibitions, concerts, festivals, and networking events happening across the creative community."
    },
    {
      icon: Briefcase,
      title: "Opportunities Board",
      description: "Find jobs, gigs, residencies, grants, and collaborations tailored to creative professionals."
    },
    {
      icon: Users,
      title: "Community Directory",
      description: "Connect with fellow creatives, view portfolios, and find collaborators or mentors in your discipline."
    }
  ];

  const communityFeatures = [
    {
      icon: FileText,
      title: "Blog & Articles",
      description: "Read and share insights, stories, and updates from the creative community.",
      link: "/blog",
      color: "text-purple-400"
    },
    {
      icon: Calendar,
      title: "Events",
      description: "Browse and RSVP to workshops, exhibitions, concerts, and creative meetups.",
      link: "/events",
      color: "text-orange-400"
    },
    {
      icon: Briefcase,
      title: "Opportunities",
      description: "Discover jobs, gigs, grants, residencies, and collaboration opportunities.",
      link: "/opportunities",
      color: "text-green-400"
    },
    {
      icon: Users2,
      title: "Community",
      description: "Connect with creatives, explore portfolios, and find your next collaborator.",
      link: "/community",
      color: "text-blue-400"
    },
    {
      icon: MessageSquare,
      title: "Discussions",
      description: "Join conversations, ask questions, and share knowledge with the community.",
      link: "/discussions",
      color: "text-pink-400"
    },
    {
      icon: Award,
      title: "Showcase",
      description: "Celebrate outstanding creative projects and get inspired by community work.",
      link: "/showcase",
      color: "text-yellow-400"
    }
  ];

  const categories = [
    { name: "Music Industry", icon: Music },
    { name: "Visual Arts", icon: Palette },
    { name: "Venues", icon: Building2 },
    { name: "Festivals", icon: Radio },
    { name: "Studios", icon: Camera },
    { name: "Education", icon: GraduationCap },
    { name: "Creative Hubs", icon: Sparkles },
    { name: "Technology", icon: Lightbulb },
    { name: "Community", icon: Heart },
    { name: "Production", icon: Mic2 },
    { name: "Innovation", icon: FlaskConical },
    { name: "Events", icon: Calendar }
  ];

  const steps = [
    {
      number: "01",
      title: "Explore the Map",
      description: "Use the interactive map to discover creative spaces, organisations, and initiatives across Australia."
    },
    {
      number: "02",
      title: "Join the Community",
      description: "Create your profile, connect with fellow creatives, and participate in discussions and events."
    },
    {
      number: "03",
      title: "Find Opportunities",
      description: "Browse jobs, gigs, grants, and collaborations—or post your own to find the perfect creative partner."
    }
  ];

  const stats = [
    { label: "Creative Spaces", value: "500+", icon: Building2 },
    { label: "Community Members", value: "Growing", icon: Users },
    { label: "Events Listed", value: "Active", icon: Calendar },
    { label: "Opportunities", value: "Live", icon: Briefcase }
  ];

  return (
    <div className="min-h-screen bg-background">
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
              Australia's Creative Community Platform
            </h2>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-8">
              More than a map—Creative Atlas is your gateway to discovering spaces, connecting with creatives, 
              finding opportunities, and engaging with Australia's thriving creative ecosystem.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/map")} className="gap-2">
                <Map className="h-5 w-5" />
                Explore Map
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/events")} className="gap-2">
                <Calendar className="h-5 w-5" />
                Browse Events
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/opportunities")} className="gap-2">
                <Briefcase className="h-5 w-5" />
                Find Opportunities
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Core Features Section */}
      <section className="py-16 md:py-24 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              Platform Features
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
              Everything You Need to Thrive Creatively
            </h2>
            <p className="text-gray-400">
              From discovery to collaboration, Creative Atlas provides the tools to connect and grow.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:border-primary/50 group bg-[#1a1a1a] border-[#333]">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
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
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Community Features Grid */}
      <section className="py-16 md:py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              Community Hub
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
              A Complete Creative Ecosystem
            </h2>
            <p className="text-gray-400">
              Engage with the community through events, discussions, opportunities, and more.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {communityFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer group bg-[#1a1a1a] border-[#333]"
                onClick={() => navigate(feature.link)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#333] group-hover:bg-[#444] transition-colors">
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg text-white group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-400">
                    {feature.description}
                  </CardDescription>
                  <div className="mt-4 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
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
                Interactive Map
              </Badge>
              <CardTitle className="text-2xl md:text-4xl font-bold text-white">
                Discover Creative Australia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base md:text-lg text-gray-400">
                Explore venues, studios, galleries, festivals, creative hubs, and more across every state and territory.
              </CardDescription>
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
      <section className="py-16 md:py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <Card className="text-center max-w-2xl mx-auto mb-12 md:mb-16 backdrop-blur-sm bg-card/80 border-border/50">
            <CardHeader>
              <Badge variant="secondary" className="mb-4 px-4 py-1.5 w-fit mx-auto">
                How It Works
              </Badge>
              <CardTitle className="text-2xl md:text-4xl font-bold text-white">
                Get Started in Three Simple Steps
              </CardTitle>
            </CardHeader>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full text-xl md:text-2xl font-bold flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg group-hover:scale-105 transition-all duration-300 bg-primary text-primary-foreground">
                  {step.number}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-gray-400">
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
                From music venues to tech labs, discover the full spectrum of Australia's creative ecosystem
              </CardDescription>
            </CardContent>
          </Card>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 max-w-4xl mx-auto">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="cursor-pointer transition-all duration-300 hover:shadow-md hover:border-primary/50 group bg-[#1a1a1a] border-[#333]" 
                onClick={() => navigate("/map")}
              >
                <CardContent className="p-3 md:p-4 flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <category.icon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-xs font-medium text-white">
                    {category.name}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Membership Benefits */}
      <section className="py-16 md:py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                Membership
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
                Unlock the Full Experience
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Join Creative Atlas to access all features and become part of Australia's creative network.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#1a1a1a] border-[#333]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    For Creatives
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> Access the full interactive map</li>
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> Browse & RSVP to events</li>
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> Apply for opportunities</li>
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> Create your member profile</li>
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> Join community discussions</li>
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> Publish articles & stories</li>
                  </ul>
                  <Button className="w-full mt-4" onClick={() => navigate("/pricing")}>
                    View Pricing
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-[#1a1a1a] border-[#333]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    For Creative Entities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> List your venue, studio, or org</li>
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> Create a rich business profile</li>
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> Post events & opportunities</li>
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> Showcase your work & offerings</li>
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> Receive inquiries from members</li>
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> Connect with the community</li>
                  </ul>
                  <Button className="w-full mt-4" onClick={() => navigate("/pricing")}>
                    View Pricing
                  </Button>
                </CardContent>
              </Card>
            </div>
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
                Get Started
              </Badge>
              <CardTitle className="text-2xl md:text-5xl font-bold text-white">
                Join Australia's Creative Community Today
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 md:space-y-8">
              <CardDescription className="text-lg md:text-xl max-w-2xl mx-auto text-gray-400">
                Discover spaces, connect with creatives, find opportunities, and be part of a thriving ecosystem 
                dedicated to collaboration and innovation.
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-4">
                <Button size="lg" onClick={() => navigate("/auth")} className="text-base md:text-lg h-12 px-6 md:px-8 gap-2">
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/map")} className="text-base md:text-lg h-12 px-6 md:px-8 gap-2">
                  Explore the Map
                  <Map className="h-5 w-5" />
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate("/map")} className="text-gray-400 hover:text-white transition-colors">Map</button></li>
                <li><button onClick={() => navigate("/events")} className="text-gray-400 hover:text-white transition-colors">Events</button></li>
                <li><button onClick={() => navigate("/opportunities")} className="text-gray-400 hover:text-white transition-colors">Opportunities</button></li>
                <li><button onClick={() => navigate("/community")} className="text-gray-400 hover:text-white transition-colors">Community</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Community</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate("/blog")} className="text-gray-400 hover:text-white transition-colors">Blog</button></li>
                <li><button onClick={() => navigate("/discussions")} className="text-gray-400 hover:text-white transition-colors">Discussions</button></li>
                <li><button onClick={() => navigate("/showcase")} className="text-gray-400 hover:text-white transition-colors">Showcase</button></li>
                <li><button onClick={() => navigate("/resources")} className="text-gray-400 hover:text-white transition-colors">Resources</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Account</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate("/auth")} className="text-gray-400 hover:text-white transition-colors">Sign In</button></li>
                <li><button onClick={() => navigate("/pricing")} className="text-gray-400 hover:text-white transition-colors">Pricing</button></li>
                <li><button onClick={() => navigate("/dashboard")} className="text-gray-400 hover:text-white transition-colors">Dashboard</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="text-gray-400 hover:text-white transition-colors">About</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Contact</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Terms</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Privacy</button></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-6 md:my-8 bg-[#333]" />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
              <img src={logoImage} alt="Creative Atlas" className="h-8 w-auto object-contain" />
              <span className="text-xs md:text-sm text-gray-400">
                © 2025 Creative Atlas. Australia's creative community platform.
              </span>
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
    </div>
  );
};

export default Landing;
