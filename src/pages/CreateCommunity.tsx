
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { communitiesAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";

const CreateCommunity = () => {
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Community name is required");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await communitiesAPI.create(name, isPrivate);
      
      toast({
        title: "Community created",
        description: `${name} has been created successfully`,
      });
      
      navigate("/communities");
    } catch (err) {
      setError("Failed to create community");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="glass animate-scale-in opacity-0">
            <CardHeader>
              <CardTitle className="text-2xl">Create a New Community</CardTitle>
              <CardDescription>
                Set up a new community and start connecting with others
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
                  <Label htmlFor="name">Community Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter community name"
                    className="bg-white/5"
                    disabled={loading}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="private"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                    disabled={loading}
                  />
                  <Label htmlFor="private">Private Community</Label>
                </div>
                
                {isPrivate && (
                  <div className="text-sm text-muted-foreground rounded-md p-3 bg-white/5">
                    <p>Private communities are only visible to members.</p>
                  </div>
                )}
                
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-whisker-orange hover:bg-whisker-orange/80"
                    disabled={loading}
                  >
                    {loading ? "Creating Community..." : "Create Community"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCommunity;
