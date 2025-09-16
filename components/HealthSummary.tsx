
import React from 'react';
import { User, Meal } from '../types';
import { Card, CardContent } from './ui/Card';

interface HealthSummaryProps {
    user: User;
    meals: Meal[];
    suggestedCalories: number | null;
}

const getBmiCategory = (bmi: number): { category: string, color: string } => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-500' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-500' };
    return { category: 'Obesity', color: 'text-red-500' };
};

export const HealthSummary: React.FC<HealthSummaryProps> = ({ user, meals, suggestedCalories }) => {
    const bmi = user.weight / ((user.height / 100) ** 2);
    const bmiCategory = getBmiCategory(bmi);

    const today = new Date().toISOString().split('T')[0];
    const todaysCalories = meals
        .filter(m => m.date.startsWith(today))
        .reduce((sum, meal) => sum + meal.nutrients.calories, 0);

    const progress = suggestedCalories ? (todaysCalories / suggestedCalories) * 100 : 0;
    
    return (
        <Card>
            <CardContent>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Health Summary</h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">BMI</h3>
                            <p className={`font-bold text-lg ${bmiCategory.color}`}>{bmi.toFixed(1)}</p>
                        </div>
                        <p className="text-right text-sm text-slate-500 dark:text-slate-400">{bmiCategory.category}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Health Focus</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.healthConcerns && user.healthConcerns.length > 0 ? user.healthConcerns.map(concern => (
                                <span key={concern} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                                    {concern.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            )) : <p className="text-sm text-slate-500 dark:text-slate-400">No specific concerns selected.</p>}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Today's Calorie Intake</h3>
                        {suggestedCalories === null ? (
                            <div className="text-center p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Calculating your goal...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{todaysCalories.toLocaleString()}</span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">/ {suggestedCalories.toLocaleString()} kcal</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                    <div 
                                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                        aria-valuenow={todaysCalories}
                                        aria-valuemin={0}
                                        aria-valuemax={suggestedCalories}
                                        role="progressbar"
                                        aria-label={`Calorie intake: ${todaysCalories} of ${suggestedCalories}`}
                                    ></div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
