import React, { useState, useEffect, useCallback } from 'react';
import { User, Meal } from '../types';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { getDietarySuggestions } from '../services/geminiService';

interface SuggestionsProps {
  user: User;
  meals: Meal[];
  waterToday: number;
}

export const Suggestions: React.FC<SuggestionsProps> = ({ user, meals, waterToday }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async () => {
    if (meals.length === 0 && waterToday === 0) {
      setSuggestions(["Log your first meal or a glass of water to get personalized suggestions!"]);
      return;
    };
    setIsLoading(true);
    setError(null);
    try {
      const result = await getDietarySuggestions(user, meals, waterToday);
      setSuggestions(result);
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred.');
        }
    } finally {
      setIsLoading(false);
    }
  }, [user, meals, waterToday]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);


  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-start mb-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Meal Ideas</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">AI tips for your next meal.</p>
            </div>
            <Button onClick={fetchSuggestions} isLoading={isLoading} className="px-3 py-1.5 text-sm !bg-indigo-100 !text-indigo-700 hover:!bg-indigo-200 dark:!bg-indigo-900/50 dark:!text-indigo-300 dark:hover:!bg-indigo-900">
                Refresh
            </Button>
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {isLoading && suggestions.length === 0 ? (
            <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
            </div>
        ) : (
            <ul className="space-y-3">
                {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-600 dark:text-slate-300">{suggestion}</span>
                    </li>
                ))}
            </ul>
        )}
      </CardContent>
    </Card>
  );
};
