
import { Layout } from "@/components/Layout";
import { RegisterForm } from "@/components/AuthForms";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated, error } = useAuth();
  
  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      navigate("/communities");
    }
  }, [isAuthenticated, navigate]);
  
  const handleSuccess = () => {
    navigate("/login");
  };

  return (
    <Layout>
      <div className="container py-12 md:py-20">
        <div className="max-w-md mx-auto">
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
                </a> to visit the API URL directly and accept the consent screen, then return to this page.
              </AlertDescription>
            </Alert>
          )}
          <RegisterForm onSuccess={handleSuccess} />
        </div>
      </div>
    </Layout>
  );
};

export default Register;
