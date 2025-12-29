import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import { OnboardingProvider } from "@/components/onboarding/OnboardingContext";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CollaboratorDashboard from "./pages/CollaboratorDashboard";
import EntityDashboard from "./pages/EntityDashboard";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";
import Dashboard from "./pages/Dashboard";
import Subscription from "./pages/Subscription";
import BusinessProfile from "./pages/BusinessProfile";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import BlogEditor from "./pages/BlogEditor";
import MyArticles from "./pages/MyArticles";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import EventEditor from "./pages/EventEditor";
import MyEvents from "./pages/MyEvents";
import Opportunities from "./pages/Opportunities";
import OpportunityDetail from "./pages/OpportunityDetail";
import OpportunityEditor from "./pages/OpportunityEditor";
import MyOpportunities from "./pages/MyOpportunities";
import Community from "./pages/Community";
import MemberProfile from "./pages/MemberProfile";
import EditMemberProfile from "./pages/EditMemberProfile";
import NotFound from "./pages/NotFound";
import Collaborate from "./pages/Collaborate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <OnboardingProvider>
          <OnboardingModal />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/map" element={<Index />} />
            <Route path="/collaborate" element={<Collaborate />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/business/:locationId" element={<BusinessProfile />} />
            
            {/* Dashboards */}
            <Route path="/collaborator" element={<CollaboratorDashboard />} />
            <Route path="/entity-dashboard" element={<EntityDashboard />} />
            <Route path="/dashboard" element={<SubscriptionGate featureName="Dashboard"><Dashboard /></SubscriptionGate>} />
            
            {/* Blog - protected */}
            <Route path="/blog" element={<SubscriptionGate featureName="Blog"><Blog /></SubscriptionGate>} />
            <Route path="/blog/new" element={<SubscriptionGate featureName="Blog Editor"><BlogEditor /></SubscriptionGate>} />
            <Route path="/blog/edit/:id" element={<SubscriptionGate featureName="Blog Editor"><BlogEditor /></SubscriptionGate>} />
            <Route path="/blog/my-articles" element={<SubscriptionGate featureName="My Articles"><MyArticles /></SubscriptionGate>} />
            <Route path="/blog/:slug" element={<SubscriptionGate featureName="Blog Articles"><BlogArticle /></SubscriptionGate>} />
            
            {/* Events - protected */}
            <Route path="/events" element={<SubscriptionGate featureName="Events"><Events /></SubscriptionGate>} />
            <Route path="/events/new" element={<SubscriptionGate featureName="Event Editor"><EventEditor /></SubscriptionGate>} />
            <Route path="/events/edit/:id" element={<SubscriptionGate featureName="Event Editor"><EventEditor /></SubscriptionGate>} />
            <Route path="/events/my-events" element={<SubscriptionGate featureName="My Events"><MyEvents /></SubscriptionGate>} />
            <Route path="/events/:slug" element={<SubscriptionGate featureName="Event Details"><EventDetail /></SubscriptionGate>} />
            
            {/* Opportunities - protected */}
            <Route path="/opportunities" element={<SubscriptionGate featureName="Opportunities"><Opportunities /></SubscriptionGate>} />
            <Route path="/opportunities/new" element={<SubscriptionGate featureName="Opportunity Editor"><OpportunityEditor /></SubscriptionGate>} />
            <Route path="/opportunities/edit/:id" element={<SubscriptionGate featureName="Opportunity Editor"><OpportunityEditor /></SubscriptionGate>} />
            <Route path="/opportunities/my-opportunities" element={<SubscriptionGate featureName="My Opportunities"><MyOpportunities /></SubscriptionGate>} />
            <Route path="/opportunities/:slug" element={<SubscriptionGate featureName="Opportunity Details"><OpportunityDetail /></SubscriptionGate>} />
            
            {/* Community - protected */}
            <Route path="/community" element={<SubscriptionGate featureName="Community Directory"><Community /></SubscriptionGate>} />
            <Route path="/community/profile/:id" element={<SubscriptionGate featureName="Member Profile"><MemberProfile /></SubscriptionGate>} />
            <Route path="/community/edit-profile" element={<SubscriptionGate featureName="Edit Profile"><EditMemberProfile /></SubscriptionGate>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </OnboardingProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
