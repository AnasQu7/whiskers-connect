
import { Link } from "react-router-dom";
import { Community } from "@/types";
import { Lock, Unlock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { communitiesAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface CommunityCardProps {
  community: Community;
  onJoin?: () => void;
}

export function CommunityCard({ community, onJoin }: CommunityCardProps) {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [joining, setJoining] = useState(false);
  
  const isMember = user && community.members.includes(user._id);

  const handleJoin = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!isAuthenticated || !user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You need to log in to join communities",
      });
      return;
    }
    
    if (isMember) {
      toast({
        title: "Already a member",
        description: "You are already a member of this community",
      });
      return;
    }
    
    setJoining(true);
    
    try {
      await communitiesAPI.join(community._id, user._id);
      
      toast({
        title: "Joined community",
        description: `You have joined ${community.name}`,
      });
      
      if (onJoin) {
        onJoin();
      }
    } catch (error) {
      console.error("Join error:", error);
      toast({
        variant: "destructive",
        title: "Error joining community",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="glass card-hover animate-scale-in opacity-0 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-whisker-orange" />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-medium">{community.name}</h3>
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
        
        <div className="flex items-center text-muted-foreground mb-6">
          <span>{community.posts.length} post{community.posts.length !== 1 ? 's' : ''}</span>
        </div>
        
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <Button asChild className="flex-1 bg-whisker-blue hover:bg-whisker-blue/80">
            <Link to={`/community/${community._id}`}>View Community</Link>
          </Button>
          
          {isAuthenticated && !isMember && (
            <Button 
              variant="default" 
              className="flex-1 bg-whisker-orange hover:bg-whisker-orange/80"
              onClick={handleJoin}
              disabled={joining}
            >
              {joining ? "Joining..." : "Join Community"}
            </Button>
          )}
          
          {isMember && (
            <Button
              variant="outline"
              className="flex-1 border-whisker-orange text-whisker-orange hover:bg-whisker-orange/20"
              disabled
            >
              Member
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
