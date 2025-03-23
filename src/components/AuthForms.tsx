
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
    if (onSuccess) onSuccess();
  };

  return (
    <Card className="w-full max-w-md mx-auto glass animate-scale-in opacity-0">
      <CardHeader>
        <CardTitle className="text-2xl">Log in to your account</CardTitle>
        <CardDescription>
          Enter your username and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/20 p-3 rounded-md flex items-start space-x-2">
              <AlertCircle size={18} className="text-destructive mt-0.5" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              className="bg-white/5"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="bg-white/5"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-whisker-orange hover:bg-whisker-orange/80" 
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-whisker-orange hover:underline">
              Register
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { register, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    
    setPasswordError("");
    await register(username, password);
    if (onSuccess) onSuccess();
  };

  return (
    <Card className="w-full max-w-md mx-auto glass animate-scale-in opacity-0">
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your details to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/20 p-3 rounded-md flex items-start space-x-2">
              <AlertCircle size={18} className="text-destructive mt-0.5" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              className="bg-white/5"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="bg-white/5"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className="bg-white/5"
            />
            {passwordError && (
              <p className="text-destructive text-sm mt-1">{passwordError}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-whisker-orange hover:bg-whisker-orange/80" 
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-whisker-orange hover:underline">
              Log in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
