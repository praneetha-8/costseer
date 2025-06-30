
// A simplified implementation of Random Forest Regression
// In a real-world app, you'd use a more sophisticated library or connect to a backend service

type InputData = {
  teamExp: number;
  managerExp: number;
  length: number;
  transactions: number;
  entities: number;
  pointsAdjust: number;
  language: number;
};

export class RandomForestModel {
  // This is a simplified model - in a real system, you'd have trained coefficients
  private readonly languageFactors: Record<number, number> = {
    1: 1.0,   // Low-level languages (C, Assembly)
    2: 0.8,   // Mid-level languages (C++, Java)
    3: 0.6,   // High-level languages (Python, JavaScript)
    4: 0.5,   // Very high-level languages (Ruby, PHP)
    5: 0.4    // Domain-specific languages (SQL, R)
  };
  
  private readonly baseCost = 50000; // Base cost in currency units
  
  predict(data: InputData): number {
    // Feature importance coefficients (simplified)
    const teamExpFactor = 0.3;
    const managerExpFactor = 0.2;
    const lengthFactor = 0.4;
    const transactionsFactor = 0.02;
    const entitiesFactor = 0.03;
    const pointsAdjustFactor = 0.05;
    
    // Calculate cost
    let cost = this.baseCost;
    
    // Team experience reduces cost (more experience = less cost)
    cost = cost * (1 - (data.teamExp * teamExpFactor / 15)); // Assuming max team experience of 15 years
    
    // Manager experience reduces cost
    cost = cost * (1 - (data.managerExp * managerExpFactor / 20)); // Assuming max manager experience of 20 years
    
    // Length increases cost
    cost = cost * (1 + (data.length * lengthFactor / 12)); // Normalized by 12 months
    
    // Complexity factors increase cost
    cost = cost * (1 + (data.transactions * transactionsFactor / 100));
    cost = cost * (1 + (data.entities * entitiesFactor / 50));
    cost = cost * (1 + (data.pointsAdjust * pointsAdjustFactor / 100));
    
    // Language factor
    const languageFactor = this.languageFactors[data.language] || 1.0;
    cost = cost * languageFactor;
    
    // Add some randomness to simulate the "forest" part of random forest
    // In a real model, this would be based on multiple decision trees
    const noiseLevel = 0.05; // 5% noise
    const randomNoise = 1 + (Math.random() * 2 - 1) * noiseLevel;
    cost = cost * randomNoise;
    
    return Math.round(cost);
  }
  
  // Get language options for the dropdown
  getLanguageOptions(): { value: number; label: string }[] {
    return [
      { value: 1, label: "Low-level (C, Assembly)" },
      { value: 2, label: "Mid-level (C++, Java)" },
      { value: 3, label: "High-level (Python, JavaScript)" },
      { value: 4, label: "Very high-level (Ruby, PHP)" },
      { value: 5, label: "Domain-specific (SQL, R)" }
    ];
  }
}
