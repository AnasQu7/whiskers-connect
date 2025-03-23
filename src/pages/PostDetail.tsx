
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { postsAPI, communitiesAPI } from "@/lib/api";
import { Post, Community } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Lock, Unlock, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const fetchPostDetails = async () => {
    if (!postId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const postData = await postsAPI.getById(postId);
      setPost(postData);
      
      // Fetch community after post
      if (postData.communityId) {
        const communityData = await communitiesAPI.getById(postData.communityId);
        setCommunity(communityData);
      }
    } catch (err) {
      setError("Failed to load post");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const handleJoin = async () => {
    if (!isAuthenticated || !user || !community) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You need to log in to join communities",
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
      fetchPostDetails();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error joining community",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const isMember = user && community?.members.includes(user._id);
  const canViewPost = !community?.isPrivate || isMember;
  const formattedDate = post ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : '';

  return (
    <Layout>
      <div className="container py-8">
        <Button variant="outline" className="mb-6" asChild>
          <Link to={post ? `/community/${post.communityId}` : "/communities"}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {community ? community.name : "Communities"}
          </Link>
        </Button>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whisker-orange"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={fetchPostDetails} variant="outline">
              Try Again
            </Button>
          </div>
        ) : post && community ? (
          <>
            {!canViewPost ? (
              <div className="glass p-8 rounded-xl text-center py-12 animate-fade-in opacity-0">
                <h2 className="text-2xl font-semibold mb-4">Private Community Content</h2>
                <p className="text-muted-foreground mb-6">
                  This post is in a private community. Join the community to view its content.
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
              <div className="max-w-4xl mx-auto">
                <Card className="glass overflow-hidden animate-scale-in opacity-0">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Link 
                        to={`/community/${community._id}`}
                        className="text-whisker-orange hover:underline flex items-center"
                      >
                        {community.name}
                        {community.isPrivate ? (
                          <Badge variant="outline" className="ml-2 flex items-center gap-1">
                            <Lock size={14} />
                            Private
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="ml-2 flex items-center gap-1 bg-whisker-orange/20">
                            <Unlock size={14} />
                            Public
                          </Badge>
                        )}
                      </Link>
                      <div className="flex items-center text-muted-foreground">
                        <Users size={16} className="mr-1.5" />
                        <span>{community.members.length} member{community.members.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl">{post.content.split(" ").slice(0, 10).join(" ")}</CardTitle>
                    <p className="text-muted-foreground">{formattedDate}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-lg">{post.content}</p>
                    
                    {post.imageLink && (
                      <div className="rounded-md overflow-hidden">
                        <img 
                          src={post.imageLink} 
                          alt="Post image" 
                          className="w-full h-auto" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                            target.alt = 'Image not available';
                          }}
                        />
                      </div>
                    )}
                    
                    {post.videoLink && (
                      <div className="rounded-md overflow-hidden">
                        <video 
                          src={post.videoLink} 
                          controls 
                          autoPlay
                          muted
                          loop
                          className="w-full h-auto" 
                          onError={(e) => {
                            console.error("Video failed to load:", e);
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl mb-4">Post not found</p>
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

export default PostDetail;
