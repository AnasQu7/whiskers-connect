
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { communitiesAPI, postsAPI } from "@/lib/api";
import { Community } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Film, Image } from "lucide-react";

const CreatePost = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const [content, setContent] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!communityId) {
      navigate("/communities");
      return;
    }
    
    const fetchCommunity = async () => {
      try {
        const data = await communitiesAPI.getById(communityId);
        setCommunity(data);
        
        // Check if user is a member
        if (user && !data.members.includes(user._id)) {
          toast({
            variant: "destructive",
            title: "Access denied",
            description: "You need to be a member to create posts in this community",
          });
          navigate(`/community/${communityId}`);
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load community",
        });
        navigate("/communities");
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchCommunity();
  }, [communityId, navigate, user, toast]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError("Post content is required");
      return;
    }
    
    if (!communityId) {
      navigate("/communities");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await postsAPI.create(communityId, {
        content,
        imageLink: imageLink.trim() || undefined,
        videoLink: videoLink.trim() || undefined,
      });
      
      toast({
        title: "Post created",
        description: "Your post has been created successfully",
      });
      
      navigate(`/community/${communityId}`);
    } catch (err) {
      setError("Failed to create post");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          {initialLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whisker-orange"></div>
            </div>
          ) : community ? (
            <Card className="glass animate-scale-in opacity-0">
              <CardHeader>
                <CardTitle className="text-2xl">Create a New Post</CardTitle>
                <CardDescription>
                  Share content with the {community.name} community
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
                    <Label htmlFor="content">Post Content</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="What's on your mind?"
                      className="min-h-[150px] bg-white/5"
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imageLink" className="flex items-center gap-2">
                      <Image size={16} />
                      Image Link (optional)
                    </Label>
                    <Input
                      id="imageLink"
                      value={imageLink}
                      onChange={(e) => setImageLink(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="bg-white/5"
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="videoLink" className="flex items-center gap-2">
                      <Film size={16} />
                      Video Link (optional)
                    </Label>
                    <Input
                      id="videoLink"
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="bg-white/5"
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-whisker-orange hover:bg-whisker-orange/80"
                      disabled={loading}
                    >
                      {loading ? "Creating Post..." : "Create Post"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl mb-4">Community not found</p>
              <Button
                variant="outline"
                onClick={() => navigate("/communities")}
              >
                Back to Communities
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;
