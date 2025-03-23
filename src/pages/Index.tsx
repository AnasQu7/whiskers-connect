
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ArrowRight, Lock, MessageSquare, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-whisker-blue/50 to-whisker-blue z-0" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10 z-0" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 animate-fade-in opacity-0 [animation-delay:200ms]">
              Welcome to Whisker's Community
            </h1>
            <p className="text-xl text-white/80 mb-8 animate-fade-in opacity-0 [animation-delay:400ms]">
              Connect with people who share your interests in a vibrant community platform. Join existing communities or create your own.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in opacity-0 [animation-delay:600ms]">
              <Button asChild size="lg" className="bg-whisker-orange hover:bg-whisker-orange/80">
                <Link to="/communities">
                  Browse Communities
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              {!isAuthenticated && (
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/register">
                    Create Account
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-whisker-blue to-secondary">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 animate-fade-in opacity-0">
              What Makes Us Special
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto animate-fade-in opacity-0 [animation-delay:200ms]">
              Our platform provides everything you need to connect, share, and grow your communities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-xl flex flex-col items-center text-center animate-slide-up opacity-0 [animation-delay:300ms]">
              <div className="w-14 h-14 rounded-full bg-whisker-orange/20 flex items-center justify-center mb-5">
                <Users className="h-7 w-7 text-whisker-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Building</h3>
              <p className="text-white/70">
                Create or join communities around your interests and connect with like-minded people.
              </p>
            </div>
            
            <div className="glass p-8 rounded-xl flex flex-col items-center text-center animate-slide-up opacity-0 [animation-delay:500ms]">
              <div className="w-14 h-14 rounded-full bg-whisker-orange/20 flex items-center justify-center mb-5">
                <MessageSquare className="h-7 w-7 text-whisker-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Content Sharing</h3>
              <p className="text-white/70">
                Share photos, videos, and thoughts with community members in a seamless experience.
              </p>
            </div>
            
            <div className="glass p-8 rounded-xl flex flex-col items-center text-center animate-slide-up opacity-0 [animation-delay:700ms]">
              <div className="w-14 h-14 rounded-full bg-whisker-orange/20 flex items-center justify-center mb-5">
                <Lock className="h-7 w-7 text-whisker-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Private Communities</h3>
              <p className="text-white/70">
                Create private communities for select members with exclusive content and discussions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-whisker-blue">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6 animate-fade-in opacity-0">
              Ready to Join the Community?
            </h2>
            <p className="text-lg text-white/70 mb-8 animate-fade-in opacity-0 [animation-delay:200ms]">
              Get started today and connect with people who share your interests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in opacity-0 [animation-delay:400ms]">
              {isAuthenticated ? (
                <Button asChild size="lg" className="bg-whisker-orange hover:bg-whisker-orange/80">
                  <Link to="/create-community">
                    Create a Community
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="bg-whisker-orange hover:bg-whisker-orange/80">
                  <Link to="/register">
                    Sign Up Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/communities">
                  Browse Communities
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
