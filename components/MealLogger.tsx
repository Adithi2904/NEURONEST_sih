
import React, { useState } from 'react';
import { Meal } from '../types';
import { getNutritionalInfo } from '../services/geminiService';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';

interface MealLoggerProps {
  addMeal: (meal: Meal) => void;
}

export const MealLogger: React.FC<MealLoggerProps> = ({ addMeal }) => {
  const [mealInput, setMealInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogMeal = async () => {
    if (!mealInput.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const nutrientInfo = await getNutritionalInfo(mealInput);
      const newMeal: Meal = {
        id: new Date().toISOString(),
        date: new Date().toISOString(),
        description: mealInput,
        nutrients: nutrientInfo,
      };
      addMeal(newMeal);
      setMealInput('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Log a Meal</h2>
        <p className="text-slate-500 dark:text-slate-400">Describe what you ate, and our AI will do the rest. Be descriptive for best results!</p>
        
        <textarea
          value={mealInput}
          onChange={(e) => setMealInput(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
          placeholder="e.g., A bowl of oatmeal with a handful of blueberries, a tablespoon of chia seeds, and a splash of almond milk."
          disabled={isAnalyzing}
        />
        
        {error && <p className="text-sm text-red-500">{error}</p>}
        
        <div className="flex justify-end">
          <Button onClick={handleLogMeal} isLoading={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Log Meal'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
