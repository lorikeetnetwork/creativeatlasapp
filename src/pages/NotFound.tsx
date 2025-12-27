import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { BentoPage, BentoContainer } from "@/components/ui/bento-page-layout";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <BentoPage>
      <Navbar />
      <div className="flex flex-1 items-center justify-center p-4">
        <BentoContainer className="max-w-md text-center">
          <h1 className="mb-4 text-6xl font-bold text-white">404</h1>
          <p className="mb-6 text-xl text-gray-400">Oops! Page not found</p>
          <p className="mb-8 text-gray-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </BentoContainer>
      </div>
    </BentoPage>
  );
};

export default NotFound;
