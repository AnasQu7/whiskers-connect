
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthState, User } from "@/types";
import { authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        setState({
          isAuthenticated: true,
          user,
          loading: false,
          error: null,
        });
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: "Session expired",
        });
      }
    } else {
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
    }
  }, []);

  const login = async (username: string, password: string) => {
    setState({ ...state, loading: true, error: null });
    
    try {
      const user = await authAPI.login(username, password);
      
      setState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      });
    } catch (error) {
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : "Login failed",
      });
      
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Login failed",
      });
    }
  };

  const register = async (username: string, password: string) => {
    setState({ ...state, loading: true, error: null });
    
    try {
      await authAPI.register(username, password);
      
      toast({
        title: "Registration successful",
        description: "You can now log in with your credentials",
      });
      
      setState({
        ...state,
        loading: false,
      });
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: error instanceof Error ? error.message : "Registration failed",
      });
      
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Registration failed",
      });
    }
  };

  const logout = () => {
    authAPI.logout();
    
    setState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
