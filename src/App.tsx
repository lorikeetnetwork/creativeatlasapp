import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/map" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/business/:locationId" element={<BusinessProfile />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/new" element={<BlogEditor />} />
          <Route path="/blog/edit/:id" element={<BlogEditor />} />
          <Route path="/blog/my-articles" element={<MyArticles />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/new" element={<EventEditor />} />
          <Route path="/events/edit/:id" element={<EventEditor />} />
          <Route path="/events/my-events" element={<MyEvents />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
