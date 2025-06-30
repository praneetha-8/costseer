
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

type ResultData = {
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
};

type EstimationResultProps = {
  result: ResultData;
  previousResults: ResultData[];
  onReset: () => void;
  onSave: () => void;
};

export const CostEstimationResult = ({ 
  result, 
  previousResults, 
  onReset, 
  onSave 
}: EstimationResultProps) => {
  // Format the cost estimate as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Prepare data for the chart
  const getFactorData = () => {
    return [
      { name: "Team Exp", value: result.formData.teamExp * 10000 },
      { name: "Manager Exp", value: result.formData.managerExp * 8000 },
      { name: "Duration", value: result.formData.length * 15000 },
      { name: "Transactions", value: result.formData.transactions * 500 },
      { name: "Entities", value: result.formData.entities * 1000 },
      { name: "Function Points", value: result.formData.pointsAdjust * 100 },
    ];
  };

  // Prepare comparison data for the chart
  const getComparisonData = () => {
    if (previousResults.length === 0) return [];
    
    // Only include the last 3 previous results plus the current one
    const recentResults = [...previousResults.slice(-3), result];
    
    return recentResults.map((item, index) => ({
      name: index === recentResults.length - 1 ? "Current" : `Estimate ${index + 1}`,
      cost: item.estimate
    }));
  };

  const comparisonData = getComparisonData();
  
  return (
    <div className="space-y-6 w-full max-w-4xl">
      <Card className="bg-white border-cost-teal border-t-4">
        <CardHeader>
          <CardTitle className="text-cost-text text-2xl">Your Software Cost Estimate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-cost-teal mb-6">
            {formatCurrency(result.estimate)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-cost-text">Project Details:</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="text-sm text-gray-500">Team Experience:</div>
                <div className="text-sm font-medium">{result.formData.teamExp} years</div>
                
                <div className="text-sm text-gray-500">Manager Experience:</div>
                <div className="text-sm font-medium">{result.formData.managerExp} years</div>
                
                <div className="text-sm text-gray-500">Project Duration:</div>
                <div className="text-sm font-medium">{result.formData.length} months</div>
                
                <div className="text-sm text-gray-500">User Transactions:</div>
                <div className="text-sm font-medium">{result.formData.transactions}</div>
                
                <div className="text-sm text-gray-500">Data Entities:</div>
                <div className="text-sm font-medium">{result.formData.entities}</div>
                
                <div className="text-sm text-gray-500">Adjusted Function Points:</div>
                <div className="text-sm font-medium">{result.formData.pointsAdjust}</div>
                
                <div className="text-sm text-gray-500">Language Type:</div>
                <div className="text-sm font-medium">Type {result.formData.language}</div>
              </div>
            </div>
            
            <div className="h-60">
              <h3 className="font-medium text-cost-text mb-2">Cost Factor Contribution</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getFactorData()}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {comparisonData.length > 1 && (
            <div className="mt-8 h-60">
              <h3 className="font-medium text-cost-text mb-2">Compare with Previous Estimates</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparisonData}
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="cost" fill="#6366F1" name="Estimated Cost" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          
          <div className="flex gap-4 mt-6">
            <Button 
              onClick={onSave}
              className="bg-cost-teal hover:bg-green-600 text-white"
            >
              Save Estimate
            </Button>
            <Button 
              onClick={onReset}
              variant="outline"
              className="border-cost-blue text-cost-blue hover:bg-blue-50"
            >
              New Estimate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
