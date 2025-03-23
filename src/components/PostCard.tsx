
import { Post } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Film, Image } from "lucide-react";

interface PostCardProps {
  post: Post;
  communityName?: string;
}

export function PostCard({ post, communityName }: PostCardProps) {
  const hasMedia = post.imageLink || post.videoLink;
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <Card className="overflow-hidden animate-fade-in opacity-0 card-hover">
      <CardHeader className="pb-3">
        {communityName && (
          <CardDescription>
            Posted in{" "}
            <Link 
              to={`/community/${post.communityId}`}
              className="text-whisker-orange hover:underline"
            >
              {communityName}
            </Link>
          </CardDescription>
        )}
        <CardTitle className="line-clamp-2">
          {post.content.split(" ").slice(0, 10).join(" ")}
          {post.content.split(" ").length > 10 ? "..." : ""}
        </CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="line-clamp-3 text-muted-foreground">
            {post.content}
          </p>
          
          {post.imageLink && (
            <div className="w-full h-40 overflow-hidden rounded-md">
              <img 
                src={post.imageLink} 
                alt="Post image" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                  target.alt = 'Image not available';
                }}
              />
            </div>
          )}
          
          {post.videoLink && !post.imageLink && (
            <div className="w-full h-40 overflow-hidden rounded-md">
              <video 
                src={post.videoLink} 
                muted 
                autoPlay
                loop
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Video failed to load:", e);
                }}
              />
            </div>
          )}
          
          {hasMedia && !post.imageLink && !post.videoLink && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              {post.imageLink && (
                <span className="flex items-center">
                  <Image size={16} className="mr-1.5" />
                  Image attachment
                </span>
              )}
              
              {post.videoLink && (
                <span className="flex items-center">
                  <Film size={16} className="mr-1.5" />
                  Video attachment
                </span>
              )}
            </div>
          )}
          
          <Link
            to={`/post/${post._id}`}
            className="inline-block text-whisker-orange hover:text-whisker-orange/80 font-medium"
          >
            Read more
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
