import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BentoCard, BentoGrid, BentoSectionFooter } from "@/components/ui/bento-card";
import MapPreview from "@/components/MapPreview";
import { FuturisticAlienHero } from "@/components/ui/futuristic-alien-hero";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Map, Users, ArrowRight, Building2, Music, Palette, Camera, Radio, GraduationCap, Heart, Briefcase, Sparkles, Lightbulb, Users2, Mic2, FlaskConical, Calendar, FileText, MessageSquare, Award, Star, Globe, Zap, Shield, Send, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import lorikeetLogo from "@/assets/lorikeet-network-logo.png";
const Landing = () => {
  const navigate = useNavigate();
  const categories = [{
    name: "Music",
    icon: Music
  }, {
    name: "Visual Arts",
    icon: Palette
  }, {
    name: "Venues",
    icon: Building2
  }, {
    name: "Festivals",
    icon: Radio
  }, {
    name: "Studios",
    icon: Camera
  }, {
    name: "Education",
    icon: GraduationCap
  }, {
    name: "Creative Hubs",
    icon: Sparkles
  }, {
    name: "Technology",
    icon: Lightbulb
  }, {
    name: "Community",
    icon: Heart
  }, {
    name: "Production",
    icon: Mic2
  }, {
    name: "Innovation",
    icon: FlaskConical
  }, {
    name: "Events",
    icon: Calendar
  }];
  return <div className="min-h-screen bg-[#121212]">
      <Navbar />
      <ErrorBoundary>
        <FuturisticAlienHero />
      </ErrorBoundary>
      
      {/* Divider between hero and main content */}
      <Separator className="bg-border" />

      {/* Main Bento Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          
          {/* Hero Intro + Stats Row */}
          <BentoGrid className="lg:grid-cols-6 mb-4">
            {/* Main Intro Card - Large */}
            <BentoCard className="md:col-span-2 lg:col-span-3 lg:row-span-2" title="A shared platform for Australia's creative community">
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                Creative Atlas is a practical place to discover spaces, meet people, and find opportunities across Australia's creative ecosystem. It brings together venues, projects, events, and creatives to support connection, collaboration, and ongoing creative work.
              </p>
              <div className="flex flex-wrap gap-3 mt-auto">
                <Button onClick={() => navigate("/map")} className="gap-2">
                  <Map className="h-4 w-4" />
                  Explore the Map
                </Button>
                <Button variant="outline" onClick={() => navigate("/auth")} className="gap-2">
                  <Users className="h-4 w-4" />
                  Join Free
                </Button>
              </div>
            </BentoCard>
            
            {/* Stats Cards */}
            <BentoCard className="lg:col-span-1" onClick={() => navigate("/map")}>
              <div className="flex flex-col items-center text-center h-full justify-center">
                <Building2 className="w-8 h-8 text-primary mb-2" />
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-xs text-gray-400">Creative spaces listed</div>
              </div>
            </BentoCard>
            
            <BentoCard className="lg:col-span-1" onClick={() => navigate("/community")}>
              <div className="flex flex-col items-center text-center h-full justify-center">
                <Users className="w-8 h-8 text-primary mb-2" />
                <div className="text-2xl font-bold text-white">Growing</div>
                <div className="text-xs text-gray-400">Community</div>
              </div>
            </BentoCard>
            
            <BentoCard className="lg:col-span-1" onClick={() => navigate("/events")}>
              <div className="flex flex-col items-center text-center h-full justify-center">
                <Calendar className="w-8 h-8 text-primary mb-2" />
                <div className="text-2xl font-bold text-white">Active</div>
                <div className="text-xs text-gray-400">Events</div>
              </div>
            </BentoCard>
            
            <BentoCard className="lg:col-span-1" onClick={() => navigate("/opportunities")}>
              <div className="flex flex-col items-center text-center h-full justify-center">
                <Briefcase className="w-8 h-8 text-primary mb-2" />
                <div className="text-2xl font-bold text-white">Live</div>
                <div className="text-xs text-gray-400">Opportunities</div>
              </div>
            </BentoCard>
            
            <BentoCard className="lg:col-span-2">
              <div className="flex flex-col items-center text-center h-full justify-center">
                <Globe className="w-8 h-8 text-primary mb-2" />
                <div className="text-2xl font-bold text-white">All States</div>
                <div className="text-xs text-gray-400">Nationwide participation</div>
              </div>
            </BentoCard>
          </BentoGrid>

          <div className="text-center mt-12 max-w-3xl mx-auto">
            
            
            <p className="text-sm mb-6 text-category-education md:text-2xl">
              Creative Atlas is an initiative emerging from our new platform, Residents Desk, launching soon and designed to catalyse co-creation and interdisciplinary innovation across Australia, New Zealand, and the Pacific.
            </p>
            <a href="https://www.residentsdesk.au" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Residents Desk
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Interactive Map - Full Width */}
      <section className="py-16 md:py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              Explore
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Interactive Map</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
              Browse creative spaces across Australia—venues, studios, festivals, hubs, and initiatives—mapped to make discovery simple and accessible.
            </p>
          </div>
          
          <div className="rounded-lg overflow-hidden border border-[#333]">
            <MapPreview />
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Core Platform Features */}
      <section className="py-16 md:py-24 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              Platform Features
            </Badge>
          </div>
          
          <BentoGrid className="lg:grid-cols-4 mb-4">
            <BentoCard className="flex flex-row items-center gap-4" onClick={() => navigate("/events")}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-500/10 shrink-0">
                <Calendar className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white">Events Calendar</h3>
                <p className="text-gray-400 text-sm line-clamp-2">Workshops, exhibitions, concerts, festivals, and community gatherings.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </BentoCard>
            
            <BentoCard className="flex flex-row items-center gap-4" onClick={() => navigate("/opportunities")}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-500/10 shrink-0">
                <Briefcase className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white">Opportunities Board</h3>
                <p className="text-gray-400 text-sm line-clamp-2">Jobs, gigs, residencies, grants, and collaboration calls.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </BentoCard>
            
            <BentoCard className="flex flex-row items-center gap-4" onClick={() => navigate("/community")}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500/10 shrink-0">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white">Community Directory</h3>
                <p className="text-gray-400 text-sm line-clamp-2">Profiles for creatives and organisations, with space to share work and connect.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </BentoCard>
            
            <BentoCard className="flex flex-row items-center gap-4" onClick={() => navigate("/blog")}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-500/10 shrink-0">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white">Blog & Articles</h3>
                <p className="text-gray-400 text-sm line-clamp-2">Stories, reflections, and updates from across the community.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </BentoCard>
          </BentoGrid>

          <BentoSectionFooter title="A connected creative ecosystem" description="Creative Atlas supports participation through events, shared knowledge, opportunities, and conversation—helping creative work happen in real contexts." />
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Community Hub Grid */}
      <section className="py-16 md:py-24 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              Community Hub
            </Badge>
          </div>
          
          <BentoGrid className="lg:grid-cols-3 mb-4">
            <BentoCard className="lg:row-span-2" onClick={() => navigate("/discussions")}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-pink-500/10 mb-4">
                <MessageSquare className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Discussions</h3>
              <p className="text-gray-400 text-sm mb-4">Ask questions, share experience, and connect with others across Australia. Topics range from practical advice to collaboration and introductions.</p>
              <ul className="space-y-2 text-sm text-gray-400 mt-auto">
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-pink-400" /> General discussions</li>
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-pink-400" /> Help & support</li>
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-pink-400" /> Introductions</li>
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-pink-400" /> Opportunities</li>
              </ul>
            </BentoCard>
            
            <BentoCard onClick={() => navigate("/showcase")}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-500/10 mb-4">
                <Award className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Showcase Gallery</h3>
              <p className="text-gray-400 text-sm">A space to highlight creative projects and community work.</p>
            </BentoCard>
            
            <BentoCard onClick={() => navigate("/resources")}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-cyan-500/10 mb-4">
                <Lightbulb className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Resources Library</h3>
              <p className="text-gray-400 text-sm">Guides, templates, tools, and learning resources for creative practice.</p>
            </BentoCard>
            
            <BentoCard onClick={() => navigate("/mentorship")}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-500/10 mb-4">
                <Users2 className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Mentorship</h3>
              <p className="text-gray-400 text-sm">Opportunities to learn from others or offer support to emerging creatives.</p>
            </BentoCard>
            
            <BentoCard onClick={() => navigate("/newsletter")}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-rose-500/10 mb-4">
                <Sparkles className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Newsletter</h3>
              <p className="text-gray-400 text-sm">Weekly updates covering events, opportunities, and community highlights.</p>
            </BentoCard>
          </BentoGrid>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              How It Works
            </Badge>
          </div>
          
          <BentoGrid className="lg:grid-cols-3 max-w-4xl mx-auto">
            <BentoCard className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                01
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Explore the Map</h3>
              <p className="text-gray-400 text-sm">Find creative spaces, organisations, and initiatives across Australia.</p>
            </BentoCard>
            
            <BentoCard className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                02
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Join the Community</h3>
              <p className="text-gray-400 text-sm">Create a profile, connect with others, and take part in discussions and events.</p>
            </BentoCard>
            
            <BentoCard className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                03
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Find Opportunities</h3>
              <p className="text-gray-400 text-sm">Browse or post jobs, gigs, grants, and collaborations.</p>
            </BentoCard>
          </BentoGrid>

          <BentoSectionFooter title="Get started in a few simple steps" description="Whether you're an individual creative or an organisation, Creative Atlas is designed to be easy to use and open to participation." />
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Categories */}
      <section className="py-16 md:py-24 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              Categories
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Explore by Category</h2>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 max-w-4xl mx-auto">
            {categories.map((category, index) => <BentoCard key={index} className="p-3 md:p-4" onClick={() => navigate("/map")}>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <category.icon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-xs font-medium text-white">{category.name}</span>
                </div>
              </BentoCard>)}
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Membership Benefits */}
      <section className="py-16 md:py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              Membership
            </Badge>
          </div>
          
          <BentoGrid className="lg:grid-cols-3 max-w-5xl mx-auto">
            <BentoCard>
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold text-white">For Creatives</h3>
              </div>
              <ul className="space-y-3 text-gray-400 text-sm mb-6">
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary flex-shrink-0" /> Access the interactive map</li>
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary flex-shrink-0" /> Browse and RSVP to events</li>
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary flex-shrink-0" /> Apply for opportunities</li>
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary flex-shrink-0" /> Create a public profile</li>
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary flex-shrink-0" /> Join community discussions</li>
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary flex-shrink-0" /> Publish articles and stories</li>
              </ul>
              <Button className="w-full" onClick={() => navigate("/pricing")}>
                View Pricing
              </Button>
            </BentoCard>
            
            <BentoCard>
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold text-white">For Creative Entities</h3>
              </div>
              <ul className="space-y-3 text-gray-400 text-sm mb-6">
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary flex-shrink-0" /> List a venue, studio, or organisation</li>
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary flex-shrink-0" /> Create a detailed profile</li>
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary flex-shrink-0" /> Post events and opportunities</li>
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary flex-shrink-0" /> Share work and offerings</li>
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary flex-shrink-0" /> Receive enquiries</li>
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary flex-shrink-0" /> Connect with the wider community</li>
              </ul>
              <Button className="w-full" onClick={() => navigate("/pricing")}>
                View Pricing
              </Button>
            </BentoCard>

            <BentoCard className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold text-white">Become a Collaborator</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Collaborators help maintain and grow the platform by contributing to content, events, and community care.
              </p>
              <ul className="space-y-3 text-gray-400 text-sm mb-6">
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary flex-shrink-0" /> Curate events and opportunities</li>
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary flex-shrink-0" /> Manage listings and locations</li>
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary flex-shrink-0" /> Support showcases and articles</li>
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary flex-shrink-0" /> Help shape community direction</li>
              </ul>
              <Button className="w-full gap-2" onClick={() => navigate("/collaborate")}>
                <Send className="w-4 h-4" />
                Apply to Collaborate
              </Button>
            </BentoCard>
          </BentoGrid>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#121212]">
        <div className="container mx-auto px-4">
          <BentoCard className="max-w-3xl mx-auto text-center py-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              Get Started
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Join Australia's creative community
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-8">
              Discover spaces, meet collaborators, find opportunities, and take part in a shared creative ecosystem built around participation and care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
                Create Account
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/map")} className="gap-2">
                Explore the Map
                <Map className="h-5 w-5" />
              </Button>
            </div>
          </BentoCard>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Footer */}
      <footer className="border-t border-[#333] py-8 md:py-12 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-3">
            <a href="https://www.lorikeet.network" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src={lorikeetLogo} alt="Lorikeet Network" className="h-10 md:h-12 w-auto object-contain" />
            </a>
            <p className="text-xs md:text-sm text-gray-400 text-center max-w-md">
              Creative Atlas is a project of the Lorikeet Network, supporting Australia's creative and socially positive future.
            </p>
            <p className="text-xs text-gray-500">
              © 2025 Creative Atlas.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Landing;