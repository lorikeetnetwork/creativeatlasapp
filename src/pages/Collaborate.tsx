import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BentoCard, BentoGrid, BentoSectionFooter } from "@/components/ui/bento-card";
import Navbar from "@/components/Navbar";
import lorikeetLogo from "@/assets/lorikeet-network-logo.png";
import { CollaboratorApplicationForm } from "@/components/collaborator/CollaboratorApplicationForm";
import { 
  Handshake, Users, Building2, Music, Palette, Radio, GraduationCap, 
  Lightbulb, Heart, Globe, Zap, ArrowRight, Mail, Sparkles, 
  Target, TrendingUp, Share2, Award, Megaphone, Calendar, Code,
  Database, BookOpen, Network, Shield
} from "lucide-react";

const Collaborate = () => {
  const navigate = useNavigate();

  const collaboratorTypes = [
    { name: "Music Labels & Collectives", icon: Music, description: "Record labels, artist collectives, and music distributors" },
    { name: "Venues & Event Spaces", icon: Building2, description: "Live music venues, galleries, and performance spaces" },
    { name: "Festivals & Organisers", icon: Radio, description: "Festival producers and event management companies" },
    { name: "Arts Organisations", icon: Palette, description: "Galleries, arts councils, and cultural institutions" },
    { name: "Creative Tech Companies", icon: Lightbulb, description: "Tech startups serving the creative industries" },
    { name: "Educational Institutions", icon: GraduationCap, description: "Universities, TAFEs, and training providers" },
    { name: "Media & Publications", icon: Megaphone, description: "Music blogs, magazines, and content creators" },
    { name: "Government & Peak Bodies", icon: Globe, description: "Arts councils, funding bodies, and industry associations" },
  ];

  const collaborationOpportunities = [
    { 
      title: "Sponsorship & Funding", 
      icon: TrendingUp, 
      description: "Support the platform's development and gain visibility across Australia's creative community.",
      color: "text-green-400",
      bg: "bg-green-500/10"
    },
    { 
      title: "Content Partnerships", 
      icon: BookOpen, 
      description: "Contribute articles, resources, and insights to our growing knowledge base.",
      color: "text-purple-400",
      bg: "bg-purple-500/10"
    },
    { 
      title: "Event Co-hosting", 
      icon: Calendar, 
      description: "Partner on workshops, networking events, and creative industry gatherings.",
      color: "text-orange-400",
      bg: "bg-orange-500/10"
    },
    { 
      title: "Technology Integration", 
      icon: Code, 
      description: "Integrate your tools and services with Creative Atlas for mutual benefit.",
      color: "text-blue-400",
      bg: "bg-blue-500/10"
    },
    { 
      title: "Data & Research", 
      icon: Database, 
      description: "Collaborate on creative industry research and mapping initiatives.",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10"
    },
    { 
      title: "Community Programs", 
      icon: Network, 
      description: "Develop mentorship, training, and community-building initiatives together.",
      color: "text-pink-400",
      bg: "bg-pink-500/10"
    },
  ];

  const whyCollaborate = [
    { title: "Growing Audience", description: "Reach thousands of creative professionals across Australia", icon: Users },
    { title: "Innovation Focus", description: "Align with a platform driving creative industry innovation", icon: Lightbulb },
    { title: "Community Values", description: "Be part of a mission-driven, community-first initiative", icon: Heart },
    { title: "National Network", description: "Connect with creatives in every state and territory", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-[#0a0a0a] to-[#121212]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5">
              <Handshake className="w-4 h-4 mr-2" />
              Partner With Us
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Collaborate on{" "}
              <span className="text-primary">Creative Atlas</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join us in building Australia's creative community platform—and contribute to the wider 
              <span className="text-white font-medium"> Residents Desk </span>
              ecosystem supporting creative and social innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="gap-2">
                <a href="mailto:hello@creativeatlas.au">
                  <Mail className="h-5 w-5" />
                  Get in Touch
                </a>
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/")} className="gap-2">
                Learn About the Platform
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-[#333]" />

      {/* About Creative Atlas */}
      <section className="py-16 md:py-24 bg-[#121212]">
        <div className="container mx-auto px-4">
          <BentoGrid className="lg:grid-cols-2 max-w-5xl mx-auto">
            <BentoCard className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white">Creative Atlas</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Creative Atlas is Australia's comprehensive creative community platform—an interactive map 
                connecting venues, studios, festivals, artists, and creative organisations across the country.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Interactive mapping of 500+ creative spaces</li>
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Events calendar and opportunity board</li>
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Community directory and member profiles</li>
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Resources, mentorship, and discussions</li>
              </ul>
            </BentoCard>

            <BentoCard className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-500/10">
                  <Sparkles className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Residents Desk</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Residents Desk is the umbrella organisation behind Creative Atlas—a broader initiative 
                dedicated to supporting Australia's creative and socially positive future through 
                technology, community building, and innovative platforms.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-orange-400" /> Mission-driven technology development</li>
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-orange-400" /> Community-first platform design</li>
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-orange-400" /> Open collaboration and partnerships</li>
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-orange-400" /> Long-term sustainability focus</li>
              </ul>
            </BentoCard>
          </BentoGrid>
        </div>
      </section>

      <Separator className="bg-[#333]" />

      {/* Why Collaborate */}
      <section className="py-16 md:py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              Why Partner With Us
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Benefits of Collaboration</h2>
          </div>

          <BentoGrid className="lg:grid-cols-4 max-w-5xl mx-auto">
            {whyCollaborate.map((item, index) => (
              <BentoCard key={index} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </BentoCard>
            ))}
          </BentoGrid>
        </div>
      </section>

      <Separator className="bg-[#333]" />

      {/* Types of Collaborators */}
      <section className="py-16 md:py-24 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              Who We're Looking For
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Types of Collaborators</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We welcome partnerships with a wide range of creative industry stakeholders.
            </p>
          </div>

          <BentoGrid className="lg:grid-cols-4 max-w-6xl mx-auto">
            {collaboratorTypes.map((type, index) => (
              <BentoCard key={index}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#333] mb-4 group-hover:bg-primary/10 transition-colors">
                  <type.icon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{type.name}</h3>
                <p className="text-gray-400 text-sm">{type.description}</p>
              </BentoCard>
            ))}
          </BentoGrid>
        </div>
      </section>

      <Separator className="bg-[#333]" />

      {/* Collaboration Opportunities */}
      <section className="py-16 md:py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              Partnership Opportunities
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ways to Collaborate</h2>
          </div>

          <BentoGrid className="lg:grid-cols-3 max-w-5xl mx-auto">
            {collaborationOpportunities.map((opp, index) => (
              <BentoCard key={index}>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${opp.bg} mb-4`}>
                  <opp.icon className={`w-6 h-6 ${opp.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{opp.title}</h3>
                <p className="text-gray-400 text-sm">{opp.description}</p>
              </BentoCard>
            ))}
          </BentoGrid>

          <BentoSectionFooter 
            title="Let's Build Together"
            description="Whether you're a music label, venue, arts organisation, or tech company—there's a place for you in Creative Atlas."
          />
        </div>
      </section>

      <Separator className="bg-[#333]" />

      {/* Application Form Section */}
      <section id="apply" className="py-16 md:py-24 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              <Shield className="w-4 h-4 mr-2" />
              Become a Collaborator
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Apply to Join Our Team</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Collaborators help curate content, manage events, verify locations, and shape the growth of Australia's creative community platform.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <BentoCard>
              <CollaboratorApplicationForm />
            </BentoCard>
          </div>
        </div>
      </section>

      <Separator className="bg-[#333]" />

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <BentoCard className="max-w-3xl mx-auto text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Share2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Organization Partnerships
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-8">
              Looking to partner as an organization? Reach out to discuss sponsorship, 
              content partnerships, and collaboration opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="gap-2">
                <a href="mailto:hello@creativeatlas.au">
                  <Mail className="h-5 w-5" />
                  hello@creativeatlas.au
                </a>
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/map")} className="gap-2">
                Explore the Platform
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </BentoCard>
        </div>
      </section>

      <Separator className="bg-[#333]" />

      {/* Footer */}
      <footer className="border-t border-[#333] py-8 md:py-12 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-3">
            <a href="https://www.lorikeet.network" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src={lorikeetLogo} alt="Lorikeet Network" className="h-10 md:h-12 w-auto object-contain" />
            </a>
            <p className="text-xs md:text-sm text-gray-400 text-center max-w-md">
              © 2025 Creative Atlas. A project of the{" "}
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

export default Collaborate;
