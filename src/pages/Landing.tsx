import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MapPreview from "@/components/MapPreview";
import { FuturisticAlienHero } from "@/components/ui/futuristic-alien-hero";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BentoProductGrid, BentoProductItem } from "@/components/ui/bento-product-features";
import { Map, Users, ArrowRight, Building2, Music, Palette, Camera, Radio, GraduationCap, Heart, Briefcase, Sparkles, Lightbulb, Users2, Mic2, FlaskConical, Calendar, FileText, MessageSquare, Award, Globe, Zap, Shield, Send, ExternalLink, User, Check, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import lorikeetLogo from "@/assets/lorikeet-network-logo.png";

const Landing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handlePurchase = async (paymentType: 'basic_account' | 'creative_listing') => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to continue with payment"
      });
      navigate(`/auth?return=${encodeURIComponent('/#membership')}`);
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-account-payment', {
        body: { payment_type: paymentType }
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Redirecting to payment",
          description: "Complete your payment in the new window"
        });
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { name: "Music", icon: Music },
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

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />
      
      {/* ============ LAYER 1: Hero with Animation ============ */}
      <ErrorBoundary>
        <FuturisticAlienHero />
      </ErrorBoundary>
      
      <Separator className="bg-border" />

      {/* ============ LAYER 2: Residents Desk Intro ============ */}
      <section className="py-12 md:py-16 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm mb-6 text-category-education md:text-2xl leading-relaxed">
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

      {/* ============ LAYER 3: Interactive Map ============ */}
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

      {/* ============ LAYER 4: Unified Bento Grid ============ */}
      <section id="membership" className="py-16 md:py-24 bg-[#121212] scroll-mt-16">
        <div className="container mx-auto px-4">
          
          {/* Main Bento Grid */}
          <BentoProductGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-6 auto-rows-auto">
            
            {/* === ROW 1: Platform Intro (Tall) + Stats === */}
            
            {/* Main Intro Card - Spans 3 cols, 2 rows */}
            <BentoProductItem className="lg:col-span-3 lg:row-span-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                A shared platform for Australia's creative community
              </h2>
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
            </BentoProductItem>
            
            {/* Stats Cards */}
            <BentoProductItem className="lg:col-span-1" onClick={() => navigate("/map")}>
              <div className="flex flex-col items-center text-center h-full justify-center py-4">
                <Building2 className="w-8 h-8 text-primary mb-2" />
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-xs text-gray-400">Creative spaces</div>
              </div>
            </BentoProductItem>
            
            <BentoProductItem className="lg:col-span-1" onClick={() => navigate("/community")}>
              <div className="flex flex-col items-center text-center h-full justify-center py-4">
                <Users className="w-8 h-8 text-primary mb-2" />
                <div className="text-2xl font-bold text-white">Growing</div>
                <div className="text-xs text-gray-400">Community</div>
              </div>
            </BentoProductItem>
            
            <BentoProductItem className="lg:col-span-1" onClick={() => navigate("/events")}>
              <div className="flex flex-col items-center text-center h-full justify-center py-4">
                <Calendar className="w-8 h-8 text-primary mb-2" />
                <div className="text-2xl font-bold text-white">Active</div>
                <div className="text-xs text-gray-400">Events</div>
              </div>
            </BentoProductItem>
            
            <BentoProductItem className="lg:col-span-1" onClick={() => navigate("/opportunities")}>
              <div className="flex flex-col items-center text-center h-full justify-center py-4">
                <Briefcase className="w-8 h-8 text-primary mb-2" />
                <div className="text-2xl font-bold text-white">Live</div>
                <div className="text-xs text-gray-400">Opportunities</div>
              </div>
            </BentoProductItem>
            
            <BentoProductItem className="lg:col-span-2">
              <div className="flex flex-col items-center text-center h-full justify-center py-4">
                <Globe className="w-8 h-8 text-primary mb-2" />
                <div className="text-2xl font-bold text-white">All States</div>
                <div className="text-xs text-gray-400">Nationwide participation</div>
              </div>
            </BentoProductItem>

            {/* === ROW 2: Platform Features === */}
            
            <BentoProductItem className="lg:col-span-3" onClick={() => navigate("/events")}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-500/10 shrink-0">
                  <Calendar className="w-6 h-6 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">Events Calendar</h3>
                  <p className="text-gray-400 text-sm">Workshops, exhibitions, concerts, festivals, and community gatherings.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </BentoProductItem>
            
            <BentoProductItem className="lg:col-span-3" onClick={() => navigate("/opportunities")}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-500/10 shrink-0">
                  <Briefcase className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">Opportunities Board</h3>
                  <p className="text-gray-400 text-sm">Jobs, gigs, residencies, grants, and collaboration calls.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </BentoProductItem>
            
            <BentoProductItem className="lg:col-span-3" onClick={() => navigate("/community")}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500/10 shrink-0">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">Community Directory</h3>
                  <p className="text-gray-400 text-sm">Profiles for creatives and organisations, with space to share work and connect.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </BentoProductItem>
            
            <BentoProductItem className="lg:col-span-3" onClick={() => navigate("/blog")}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-500/10 shrink-0">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">Blog & Articles</h3>
                  <p className="text-gray-400 text-sm">Stories, reflections, and updates from across the community.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </BentoProductItem>

            {/* === ROW 3: Community Hub === */}
            
            <BentoProductItem className="lg:col-span-2 lg:row-span-2" onClick={() => navigate("/discussions")}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-pink-500/10 mb-4">
                <MessageSquare className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Discussions</h3>
              <p className="text-gray-400 text-sm mb-4">Ask questions, share experience, and connect with others across Australia.</p>
              <ul className="space-y-2 text-sm text-gray-400 mt-auto">
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-pink-400" /> General discussions</li>
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-pink-400" /> Help & support</li>
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-pink-400" /> Introductions</li>
              </ul>
            </BentoProductItem>
            
            <BentoProductItem className="lg:col-span-2" onClick={() => navigate("/showcase")}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-500/10 mb-3">
                <Award className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Showcase Gallery</h3>
              <p className="text-gray-400 text-sm">A space to highlight creative projects and community work.</p>
            </BentoProductItem>
            
            <BentoProductItem className="lg:col-span-2" onClick={() => navigate("/resources")}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-cyan-500/10 mb-3">
                <Lightbulb className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Resources Library</h3>
              <p className="text-gray-400 text-sm">Guides, templates, tools, and learning resources for creative practice.</p>
            </BentoProductItem>
            
            <BentoProductItem className="lg:col-span-2" onClick={() => navigate("/mentorship")}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-500/10 mb-3">
                <Users2 className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Mentorship</h3>
              <p className="text-gray-400 text-sm">Learn from others or offer support to emerging creatives.</p>
            </BentoProductItem>
            
            <BentoProductItem className="lg:col-span-2" onClick={() => navigate("/newsletter")}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-rose-500/10 mb-3">
                <Sparkles className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Newsletter</h3>
              <p className="text-gray-400 text-sm">Weekly updates covering events, opportunities, and community highlights.</p>
            </BentoProductItem>

            {/* === ROW 4: How It Works === */}
            
            <BentoProductItem className="lg:col-span-6 bg-[#0a0a0a]">
              <div className="text-center mb-6">
                <Badge variant="secondary" className="mb-2 px-4 py-1.5">
                  How It Works
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground text-xl font-bold flex items-center justify-center mx-auto mb-3">
                    01
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Explore the Map</h4>
                  <p className="text-gray-400 text-sm">Find creative spaces, organisations, and initiatives across Australia.</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground text-xl font-bold flex items-center justify-center mx-auto mb-3">
                    02
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Join the Community</h4>
                  <p className="text-gray-400 text-sm">Create a profile, connect with others, and take part in discussions.</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground text-xl font-bold flex items-center justify-center mx-auto mb-3">
                    03
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Find Opportunities</h4>
                  <p className="text-gray-400 text-sm">Browse or post jobs, gigs, grants, and collaborations.</p>
                </div>
              </div>
            </BentoProductItem>

            {/* === ROW 5: Categories === */}
            
            <BentoProductItem className="lg:col-span-6 bg-[#0a0a0a]">
              <div className="text-center mb-6">
                <Badge variant="secondary" className="mb-2 px-4 py-1.5">
                  Categories
                </Badge>
                <h3 className="text-xl font-bold text-white">Explore by Category</h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
                {categories.map((category, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center text-center gap-2 p-3 border border-neutral-800 hover:border-primary/50 hover:bg-[#1a1a1a] transition-all cursor-pointer"
                    onClick={() => navigate("/map")}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <category.icon className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="text-xs font-medium text-white">{category.name}</span>
                  </div>
                ))}
              </div>
            </BentoProductItem>

            {/* === ROW 6: Pricing === */}
            
            {/* Creator Plan */}
            <BentoProductItem className="lg:col-span-2 relative border-primary/50">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                Most Popular
              </Badge>
              <div className="flex items-center gap-3 mb-2 pt-2">
                <User className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold text-white">Creator</h3>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">$35</span>
                <span className="text-gray-400 text-sm">/year</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">Full access for individual creatives</p>
              <ul className="space-y-2 text-gray-400 text-sm mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary flex-shrink-0" /> Browse all creative spaces</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary flex-shrink-0" /> Save favorite locations</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary flex-shrink-0" /> Create member profile</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary flex-shrink-0" /> RSVP & host events</li>
              </ul>
              <Button className="w-full" onClick={() => handlePurchase('basic_account')} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Get Creator - $35/year
              </Button>
            </BentoProductItem>
            
            {/* Business Plan */}
            <BentoProductItem className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold text-white">Business</h3>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">$55</span>
                <span className="text-gray-400 text-sm">/year</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">For creative businesses & entities</p>
              <ul className="space-y-2 text-gray-400 text-sm mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary flex-shrink-0" /> Everything in Creator</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary flex-shrink-0" /> Business listing on map</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary flex-shrink-0" /> Full business profile page</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary flex-shrink-0" /> Contact forms & social links</li>
              </ul>
              <Button className="w-full" variant="outline" onClick={() => handlePurchase('creative_listing')} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Get Business - $55/year
              </Button>
            </BentoProductItem>

            {/* Collaborator */}
            <BentoProductItem className="lg:col-span-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold text-white">Collaborator</h3>
              </div>
              <div className="mb-4">
                <span className="text-gray-400 text-sm">Free (by application)</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">Help grow the platform</p>
              <ul className="space-y-2 text-gray-400 text-sm mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary flex-shrink-0" /> Curate events & opportunities</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary flex-shrink-0" /> Manage listings</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary flex-shrink-0" /> Support showcases & articles</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary flex-shrink-0" /> Shape community direction</li>
              </ul>
              <Button className="w-full gap-2" variant="secondary" onClick={() => navigate("/collaborate")}>
                <Send className="w-4 h-4" />
                Apply to Collaborate
              </Button>
            </BentoProductItem>

            {/* === ROW 7: FAQ === */}
            
            <BentoProductItem className="lg:col-span-6">
              <div className="max-w-2xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="free" className="border-[#333]">
                    <AccordionTrigger className="text-white hover:text-primary text-sm">
                      Can I browse the map for free?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 text-sm">
                      Yes! The map is free to explore. Subscriptions unlock community features like events, opportunities, profiles, and more.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="difference" className="border-[#333]">
                    <AccordionTrigger className="text-white hover:text-primary text-sm">
                      What's the difference between Creator and Business?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 text-sm">
                      Creator is for individuals wanting to participate in the community. Business adds a map listing, dedicated profile page, galleries, and contact forms for venues, studios, and organisations.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="billing" className="border-[#333]">
                    <AccordionTrigger className="text-white hover:text-primary text-sm">
                      How does billing work?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 text-sm">
                      Subscriptions are billed annually. You can manage or cancel anytime from your dashboard.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </BentoProductItem>

            {/* === ROW 8: CTA === */}
            
            <BentoProductItem className="lg:col-span-6 text-center py-12 bg-gradient-to-br from-primary/10 to-transparent">
              <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                Get Started
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                Join Australia's creative community
              </h2>
              <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-8">
                Discover spaces, meet collaborators, find opportunities, and take part in a shared creative ecosystem.
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
            </BentoProductItem>

          </BentoProductGrid>

        </div>
      </section>

      <Separator className="bg-border" />

      {/* ============ LAYER 5: Footer ============ */}
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
    </div>
  );
};

export default Landing;
