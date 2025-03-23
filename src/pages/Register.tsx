
import { Layout } from "@/components/Layout";
import { RegisterForm } from "@/components/AuthForms";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
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
          <RegisterForm onSuccess={handleSuccess} />
        </div>
      </div>
    </Layout>
  );
};

export default Register;
