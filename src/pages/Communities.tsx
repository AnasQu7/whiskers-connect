
import { Layout } from "@/components/Layout";
import { CommunityCard } from "@/components/CommunityCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { communitiesAPI } from "@/lib/api";
import { Community } from "@/types";
import { PlusCircle, RefreshCw, Search, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Communities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated } = useAuth();

  const fetchCommunities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await communitiesAPI.getAll();
      console.log("Fetched communities:", data);
      setCommunities(data);
      setFilteredCommunities(data);
    } catch (err) {
      console.error("Error fetching communities:", err);
      setError(err instanceof Error ? err.message : "Failed to load communities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    // Filter communities by name
    if (searchTerm.trim() === "") {
      setFilteredCommunities(communities);
    } else {
      const filtered = communities.filter(community =>
        community.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCommunities(filtered);
    }
  }, [searchTerm, communities]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Communities</h1>
            <p className="text-muted-foreground">
              Join existing communities or create your own
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <Button asChild className="bg-whisker-orange hover:bg-whisker-orange/80">
                <Link to="/create-community">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Community
                </Link>
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={fetchCommunities}
              disabled={loading}
              title="Refresh communities"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </Button>
          </div>
        </div>
        
        {error && error.includes("ngrok") && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>API Connection Issue</AlertTitle>
            <AlertDescription>
              The API server requires consent through ngrok. Please <a 
                href="https://b702-2405-201-5018-883b-291d-a362-edc4-e2c.ngrok-free.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                click here
              </a> to visit the API URL directly and accept the consent screen, then return and refresh this page.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Search and filters */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search communities..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 bg-white/5"
            />
          </div>
        </div>
        
        {/* Communities grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whisker-orange"></div>
          </div>
        ) : error && !error.includes("ngrok") ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={fetchCommunities} variant="outline">
              Try Again
            </Button>
          </div>
        ) : filteredCommunities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl mb-4">No communities found</p>
            {searchTerm ? (
              <p className="text-muted-foreground mb-4">
                No communities match your search criteria
              </p>
            ) : (
              <p className="text-muted-foreground mb-4">
                Be the first to create a community!
              </p>
            )}
            
            {isAuthenticated && (
              <Button asChild className="bg-whisker-orange hover:bg-whisker-orange/80">
                <Link to="/create-community">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Community
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <CommunityCard
                key={community._id}
                community={community}
                onJoin={fetchCommunities}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Communities;
