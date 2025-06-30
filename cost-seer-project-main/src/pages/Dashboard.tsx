
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { CostEstimationForm } from "@/components/CostEstimationForm";
import { CostEstimationResult } from "@/components/CostEstimationResult";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type EstimationResult = {
  id?: string;
  formData: {
    teamExp: number;
    managerExp: number;
    length: number;
    transactions: number;
    entities: number;
    pointsAdjust: number;
    language: number;
  };
  estimate: number;
  created_at?: string;
};

const Dashboard: React.FC = () => {
  const [currentResult, setCurrentResult] = useState<EstimationResult | null>(null);
  const [savedResults, setSavedResults] = useState<EstimationResult[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchSavedEstimations();
  }, [user]);

  const fetchSavedEstimations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const transformedResults: EstimationResult[] = data.map(project => ({
        id: project.id,
        formData: {
          teamExp: project.team_exp,
          managerExp: project.manager_exp,
          length: project.length,
          transactions: project.transactions,
          entities: project.entities,
          pointsAdjust: project.points_adjust,
          language: project.language,
        },
        estimate: Number(project.estimated_cost),
        created_at: project.created_at
      }));
      
      setSavedResults(transformedResults);
    } catch (error) {
      toast.error('Error fetching saved estimations');
      console.error(error);
    }
  };

  const handleEstimationSubmit = async (result: EstimationResult) => {
    setCurrentResult(result);
  };

  const handleSave = async () => {
    if (!currentResult || !user) return;
    
    try {
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
      
      if (error) throw error;
      
      toast.success('Estimation saved successfully');
      await fetchSavedEstimations();
      setCurrentResult(null);
    } catch (error) {
      toast.error('Error saving estimation');
      console.error(error);
    }
  };

  const handleDeleteEstimation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Estimation deleted successfully');
      await fetchSavedEstimations();
      setDeletingId(null);
    } catch (error) {
      toast.error('Error deleting estimation');
      console.error(error);
    }
  };

  const handleReset = () => {
    setCurrentResult(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
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
        
        <div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Saved Estimations</CardTitle>
            </CardHeader>
            <CardContent>
              {savedResults.length === 0 ? (
                <p className="text-gray-500 text-center">No saved estimations</p>
              ) : (
                <div className="space-y-4">
                  {savedResults.map((result) => (
                    <div 
                      key={result.id} 
                      className="border rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">${result.estimate.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(result.created_at!).toLocaleDateString()}
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Estimation</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this estimation? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => result.id && handleDeleteEstimation(result.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
