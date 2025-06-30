
import { AuthForm } from "@/components/AuthForm";

const Auth = () => {
  return (
    <div className="min-h-screen bg-cost-bg flex flex-col">
      <header className="py-8 bg-white shadow-sm">
        <div className="container px-4 mx-auto">
          <h1 className="text-3xl font-bold text-cost-text">
            <span className="text-cost-blue">Cost</span>Seer
          </h1>
          <p className="text-gray-500">Software Cost Estimation Tool</p>
        </div>
      </header>
      
      <main className="flex-1 container px-4 mx-auto py-8 flex items-center justify-center">
        <AuthForm />
      </main>
      
      <footer className="py-6 bg-white border-t">
        <div className="container px-4 mx-auto text-center text-sm text-gray-500">
          <p>© 2025 CostSeer - Software Cost Estimation Tool</p>
        </div>
      </footer>
    </div>
  );
};

export default Auth;
