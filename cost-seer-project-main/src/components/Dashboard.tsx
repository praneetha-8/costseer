
import { useState, useEffect } from "react";
import { CostEstimationForm } from "./CostEstimationForm";
import { CostEstimationResult } from "./CostEstimationResult";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type FormData = {
  teamExp: number;
  managerExp: number;
  length: number;
  transactions: number;
  entities: number;
  pointsAdjust: number;
  language: number;
};

type EstimationResult = {
  formData: FormData;
  estimate: number;
};

export const Dashboard = () => {
  const [currentResult, setCurrentResult] = useState<EstimationResult | null>(null);
  const [savedResults, setSavedResults] = useState<EstimationResult[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    // Fetch saved estimations when component mounts
    const fetchSavedEstimations = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error('Error fetching saved estimations');
        return;
      }
      
      // Transform database results to EstimationResult type
      const transformedResults = data.map(project => ({
        formData: {
          teamExp: project.team_exp,
          managerExp: project.manager_exp,
          length: project.length,
          transactions: project.transactions,
          entities: project.entities,
          pointsAdjust: project.points_adjust,
          language: project.language,
        },
        estimate: Number(project.estimated_cost)  // Fix: Convert to Number explicitly
      }));
      
      setSavedResults(transformedResults);
    };
    
    fetchSavedEstimations();
  }, [user]);
  
  const handleEstimationSubmit = async (result: EstimationResult) => {
    setCurrentResult(result);
  };
  
  const handleReset = () => {
    setCurrentResult(null);
  };
  
  const handleSave = async () => {
    if (!currentResult || !user) return;
    
    const { error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        team_exp: currentResult.formData.teamExp,
        manager_exp: currentResult.formData.managerExp,
        length: currentResult.formData.length,
        transactions: currentResult.formData.transactions,
        entities: currentResult.formData.entities,
        points_adjust: currentResult.formData.pointsAdjust,
        language: currentResult.formData.language,
        estimated_cost: currentResult.estimate,
      });
    
    if (error) {
      toast.error('Error saving estimation');
      return;
    }
    
    toast.success('Estimation saved successfully');
    setSavedResults([currentResult, ...savedResults]);
  };
  
  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto">
      {!currentResult ? (
        <CostEstimationForm onSubmit={handleEstimationSubmit} />
      ) : (
        <CostEstimationResult
          result={currentResult}
          previousResults={savedResults}
          onReset={handleReset}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
