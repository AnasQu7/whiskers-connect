
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  Menu, X, Home, Users, LogIn, LogOut, User, PlusCircle
} from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    closeMenu();
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "text-whisker-orange" : "text-white hover:text-whisker-orange";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-whisker-blue/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-white text-xl font-medium group"
              onClick={closeMenu}
            >
              <span className="h-8 w-8 rounded-full bg-whisker-orange flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <span className="text-lg font-bold">W</span>
              </span>
              <span className="transition-all duration-300 group-hover:text-whisker-orange">
                Whisker's Community
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-6">
              <Link to="/" className={`${isActive("/")} transition-colors duration-300`}>
                <span className="flex items-center gap-1.5">
                  <Home size={18} />
                  <span>Home</span>
                </span>
              </Link>
              
              <Link to="/communities" className={`${isActive("/communities")} transition-colors duration-300`}>
                <span className="flex items-center gap-1.5">
                  <Users size={18} />
                  <span>Communities</span>
                </span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/create-community" className={`${isActive("/create-community")} transition-colors duration-300`}>
                    <span className="flex items-center gap-1.5">
                      <PlusCircle size={18} />
                      <span>New Community</span>
                    </span>
                  </Link>
                  
                  <Button
                    variant="ghost"
                    className="text-white hover:text-whisker-orange hover:bg-transparent"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} className="mr-1.5" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className={`${isActive("/login")} transition-colors duration-300`}>
                    <span className="flex items-center gap-1.5">
                      <LogIn size={18} />
                      <span>Login</span>
                    </span>
                  </Link>
                  
                  <Link to="/register" className={`${isActive("/register")} transition-colors duration-300`}>
                    <span className="flex items-center gap-1.5">
                      <User size={18} />
                      <span>Register</span>
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-white p-2 rounded-md focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-whisker-blue/95 backdrop-blur-md animate-slide-in opacity-0">
          <div className="px-2 pt-2 pb-4 space-y-3">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md ${isActive("/")}`}
              onClick={closeMenu}
            >
              <span className="flex items-center gap-2">
                <Home size={18} />
                <span>Home</span>
              </span>
            </Link>
            
            <Link 
              to="/communities" 
              className={`block px-3 py-2 rounded-md ${isActive("/communities")}`}
              onClick={closeMenu}
            >
              <span className="flex items-center gap-2">
                <Users size={18} />
                <span>Communities</span>
              </span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  to="/create-community" 
                  className={`block px-3 py-2 rounded-md ${isActive("/create-community")}`}
                  onClick={closeMenu}
                >
                  <span className="flex items-center gap-2">
                    <PlusCircle size={18} />
                    <span>New Community</span>
                  </span>
                </Link>
                
                <button
                  className="w-full text-left block px-3 py-2 rounded-md text-white hover:text-whisker-orange"
                  onClick={handleLogout}
                >
                  <span className="flex items-center gap-2">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`block px-3 py-2 rounded-md ${isActive("/login")}`}
                  onClick={closeMenu}
                >
                  <span className="flex items-center gap-2">
                    <LogIn size={18} />
                    <span>Login</span>
                  </span>
                </Link>
                
                <Link 
                  to="/register" 
                  className={`block px-3 py-2 rounded-md ${isActive("/register")}`}
                  onClick={closeMenu}
                >
                  <span className="flex items-center gap-2">
                    <User size={18} />
                    <span>Register</span>
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
