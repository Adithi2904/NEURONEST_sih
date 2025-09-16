
import React, { useState } from 'react';
import { Meal, NutrientInfo } from '../types';
import { Card, CardContent } from './ui/Card';

interface MealHistoryProps {
  meals: Meal[];
}

const NutrientDetail: React.FC<{ label: string; value: string | number; unit?: string; indent?: boolean }> = ({ label, value, unit, indent = false }) => (
    <div className={`flex justify-between text-sm ${indent ? 'ml-4' : ''}`}>
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">{value}{unit}</span>
    </div>
);

const MealItem: React.FC<{ meal: Meal }> = ({ meal }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { nutrients } = meal;

    return (
        <div className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-indigo-600 dark:text-indigo-400">{nutrients.mealName}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(meal.date).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="font-bold text-lg">{nutrients.calories} kcal</span>
                        <svg className={`w-5 h-5 text-slate-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </button>
            {isOpen && (
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50">
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 italic">Original entry: "{meal.description}"</p>
                    <div className="space-y-2">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Macro Nutrients</h4>
                        <NutrientDetail label="Protein" value={nutrients.protein} unit="g" />
                        <NutrientDetail label="Carbohydrates" value={nutrients.carbs.total} unit="g" />
                        <NutrientDetail label="Fiber" value={nutrients.carbs.fiber || 0} unit="g" indent />
                        <NutrientDetail label="Sugar" value={nutrients.carbs.sugar || 0} unit="g" indent />
                        <NutrientDetail label="Fat" value={nutrients.fat.total} unit="g" />
                        <NutrientDetail label="Saturated Fat" value={nutrients.fat.saturated || 0} unit="g" indent />
                        <NutrientDetail label="Sodium" value={nutrients.sodium || 0} unit="mg" />
                        
                        {nutrients.vitamins && nutrients.vitamins.length > 0 && (
                            <>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-2">Vitamins & Minerals</h4>
                                {nutrients.vitamins.map(v => (
                                    <NutrientDetail key={v.name} label={v.name} value={v.amount} />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const MealHistory: React.FC<MealHistoryProps> = ({ meals }) => {
  const sortedMeals = [...meals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Meal History</h2>
        <div className="max-h-[600px] overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700">
            {sortedMeals.length > 0 ? (
                sortedMeals.map(meal => <MealItem key={meal.id} meal={meal} />)
            ) : (
                <div className="text-center p-8 text-slate-500 dark:text-slate-400">
                    <p>No meals logged yet.</p>
                    <p>Log your first meal to see it here!</p>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
};
