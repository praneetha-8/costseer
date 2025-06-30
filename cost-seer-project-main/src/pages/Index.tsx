
import { Dashboard as CostDashboard } from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error logging out");
    } else {
      toast.success("Logged out successfully");
    }
  };

  return (
    <div className="min-h-screen bg-cost-bg">
      <header className="py-8 bg-white shadow-sm">
        <div className="container px-4 mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-cost-text">
              <span className="text-cost-blue">Cost</span>Seer
            </h1>
            <p className="text-gray-500">Software Cost Estimation Tool</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="mr-4 text-cost-blue hover:underline">
              My Estimations
            </Link>
            <span className="text-sm text-gray-600">{user?.email}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container px-4 mx-auto py-8">
        <CostDashboard />
      </main>
      
      <footer className="py-6 bg-white border-t mt-12">
        <div className="container px-4 mx-auto text-center text-sm text-gray-500">
          <p>© 2025 CostMate - Software Cost Estimation Tool</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
