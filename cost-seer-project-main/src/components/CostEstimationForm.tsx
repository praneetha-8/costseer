
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RandomForestModel } from "@/utils/RandomForestModel";
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

type EstimationFormProps = {
  onSubmit: (result: { formData: FormData; estimate: number }) => void;
};

export const CostEstimationForm = ({ onSubmit }: EstimationFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    teamExp: 5,
    managerExp: 7,
    length: 6,
    transactions: 50,
    entities: 20,
    pointsAdjust: 200,
    language: 3,
  });

  const model = new RandomForestModel();
  const languageOptions = model.getLanguageOptions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const formValues = Object.values(formData);
    if (formValues.some(val => val <= 0)) {
      toast.error("All values must be greater than zero");
      return;
    }
    
    // Generate estimate
    const estimate = model.predict(formData);
    
    // Call the onSubmit callback with the result
    onSubmit({ formData, estimate });
    toast.success("Cost estimation completed!");
  };

  const handleChange = (field: keyof FormData, value: string | number) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    setFormData((prev) => ({ ...prev, [field]: numValue }));
  };

  return (
    <Card className="w-full max-w-md bg-white">
      <CardHeader>
        <CardTitle className="text-cost-text">Software Cost Estimation</CardTitle>
        <CardDescription>
          Enter project details to get a cost estimate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teamExp">Team Experience (years)</Label>
              <Input
                id="teamExp"
                type="number"
                min="0"
                step="0.5"
                value={formData.teamExp}
                onChange={(e) => handleChange("teamExp", e.target.value)}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="managerExp">Manager Experience (years)</Label>
              <Input
                id="managerExp"
                type="number"
                min="0"
                step="0.5"
                value={formData.managerExp}
                onChange={(e) => handleChange("managerExp", e.target.value)}
                className="border-gray-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="length">Project Length (months)</Label>
            <Input
              id="length"
              type="number"
              min="1"
              value={formData.length}
              onChange={(e) => handleChange("length", e.target.value)}
              className="border-gray-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transactions">User Transactions</Label>
              <Input
                id="transactions"
                type="number"
                min="1"
                value={formData.transactions}
                onChange={(e) => handleChange("transactions", e.target.value)}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entities">Data Entities</Label>
              <Input
                id="entities"
                type="number"
                min="1"
                value={formData.entities}
                onChange={(e) => handleChange("entities", e.target.value)}
                className="border-gray-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pointsAdjust">Adjusted Function Points</Label>
            <Input
              id="pointsAdjust"
              type="number"
              min="1"
              value={formData.pointsAdjust}
              onChange={(e) => handleChange("pointsAdjust", e.target.value)}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Programming Language</Label>
            <Select
              value={formData.language.toString()}
              onValueChange={(value) => handleChange("language", parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-cost-blue hover:bg-blue-700 text-white"
          >
            Calculate Estimate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
