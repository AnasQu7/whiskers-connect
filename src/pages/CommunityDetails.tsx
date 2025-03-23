
import { Layout } from "@/components/Layout";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { communitiesAPI, postsAPI } from "@/lib/api";
import { Community, Post } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Lock, PlusCircle, RefreshCw, Unlock, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CommunityDetails = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState("all");
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchCommunity = async () => {
    if (!communityId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await communitiesAPI.getById(communityId);
      setCommunity(data);
      
      // Fetch posts after community
      const postsData = await postsAPI.getAll(communityId, tab === "trending" ? "trending" : "new");
      setPosts(postsData);
    } catch (err) {
      setError("Failed to load community");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunity();
  }, [communityId]);

  useEffect(() => {
    // Fetch posts with the selected tab filter
    if (communityId) {
      const fetchPosts = async () => {
        try {
          const postsData = await postsAPI.getAll(communityId, tab === "trending" ? "trending" : "new");
          setPosts(postsData);
        } catch (err) {
          console.error(err);
        }
      };
      
      fetchPosts();
    }
  }, [tab, communityId]);

  const handleJoin = async () => {
    if (!isAuthenticated || !user || !community) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You need to log in to join communities",
      });
      return;
    }
    
    if (community.members.includes(user._id)) {
      toast({
        title: "Already a member",
        description: "You are already a member of this community",
      });
      return;
    }
    
    try {
      await communitiesAPI.join(community._id, user._id);
      
      toast({
        title: "Joined community",
        description: `You have joined ${community.name}`,
      });
      
      // Refresh community data
      fetchCommunity();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error joining community",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const isMember = user && community?.members.includes(user._id);
  const canViewCommunity = !community?.isPrivate || isMember;

  return (
    <Layout>
      <div className="container py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whisker-orange"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={fetchCommunity} variant="outline">
              Try Again
            </Button>
          </div>
        ) : community ? (
          <>
            <div className="glass p-8 rounded-xl mb-8 animate-blur-in opacity-0">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{community.name}</h1>
                    {community.isPrivate ? (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Lock size={14} />
                        Private
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1 bg-whisker-orange/20">
                        <Unlock size={14} />
                        Public
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <Users size={16} className="mr-1.5" />
                    <span>{community.members.length} member{community.members.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {isAuthenticated && !isMember && (
                    <Button 
                      className="bg-whisker-orange hover:bg-whisker-orange/80"
                      onClick={handleJoin}
                    >
                      Join Community
                    </Button>
                  )}
                  
                  {isAuthenticated && isMember && (
                    <Button asChild className="bg-whisker-orange hover:bg-whisker-orange/80">
                      <Link to={`/community/${community._id}/create-post`}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Post
                      </Link>
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={fetchCommunity}
                    title="Refresh community"
                  >
                    <RefreshCw size={18} />
                  </Button>
                </div>
              </div>
            </div>
            
            {!canViewCommunity ? (
              <div className="glass p-8 rounded-xl text-center py-12 animate-fade-in opacity-0">
                <h2 className="text-2xl font-semibold mb-4">Private Community</h2>
                <p className="text-muted-foreground mb-6">
                  This is a private community. Join the community to view its content.
                </p>
                <Button 
                  className="bg-whisker-orange hover:bg-whisker-orange/80"
                  onClick={handleJoin}
                  disabled={!isAuthenticated}
                >
                  {isAuthenticated ? "Join Community" : "Log in to Join"}
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
                    <TabsList>
                      <TabsTrigger value="all">All Posts</TabsTrigger>
                      <TabsTrigger value="trending">Trending</TabsTrigger>
                      <TabsTrigger value="new">New</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                {posts.length === 0 ? (
                  <div className="glass p-8 rounded-xl text-center py-12 animate-fade-in opacity-0">
                    <h2 className="text-2xl font-semibold mb-4">No Posts Yet</h2>
                    <p className="text-muted-foreground mb-6">
                      Be the first to create a post in this community.
                    </p>
                    {isAuthenticated && isMember && (
                      <Button asChild className="bg-whisker-orange hover:bg-whisker-orange/80">
                        <Link to={`/community/${community._id}/create-post`}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create Post
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl mb-4">Community not found</p>
            <Button asChild variant="outline">
              <Link to="/communities">
                Back to Communities
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CommunityDetails;
