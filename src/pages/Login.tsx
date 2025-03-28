
import { Layout } from "@/components/Layout";
import { LoginForm } from "@/components/AuthForms";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, error } = useAuth();
  
  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      navigate("/communities");
    }
  }, [isAuthenticated, navigate]);
  
  const handleSuccess = () => {
    navigate("/communities");
  };

  return (
    <Layout>
      <div className="container py-12 md:py-20">
        <div className="max-w-md mx-auto">
          <LoginForm onSuccess={handleSuccess} />
        </div>
      </div>
    </Layout>
  );
};

export default Login;
