
import React, { useState } from 'react';
import { User, Goal, HealthConcern } from '../types';
import { GOAL_OPTIONS, HEALTH_CONCERN_OPTIONS } from '../constants';
import { Button } from './ui/Button';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LeafIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.052A3.75 3.75 0 0115.75 6.75 3.75 3.75 0 0112 10.5a.75.75 0 00-1.5 0 5.25 5.25 0 005.25-5.25.75.75 0 00-1.787-1.014zM11.25 10.5a.75.75 0 00-1.5 0v3.248a3.75 3.75 0 01-2.25 3.497.75.75 0 00-.75 1.302 5.25 5.25 0 004.5 0 .75.75 0 00-.75-1.302 3.75 3.75 0 01-2.25-3.497V10.5z" clipRule="evenodd" />
        <path d="M12 2.25a.75.75 0 01.75.75v3.061A5.25 5.25 0 0118 11.25a.75.75 0 01-1.5 0A3.75 3.75 0 0012.75 7.5h-1.5A3.75 3.75 0 007.5 11.25a.75.75 0 01-1.5 0A5.25 5.25 0 0111.25 6.061V3a.75.75 0 01.75-.75zM5.103 16.03a.75.75 0 01.75-.623 3.75 3.75 0 003.111-5.183.75.75 0 111.385.575A5.25 5.25 0 015.025 16.7a.75.75 0 01.078-.67z" />
        <path d="M18.897 16.03a.75.75 0 01.67.078 5.25 5.25 0 01-4.738 5.108.75.75 0 01-.575-1.385 3.75 3.75 0 005.183-3.111.75.75 0 01.46-.74z" />
    </svg>
);


export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<Goal>(Goal.WeightLoss);
  const [healthConcerns, setHealthConcerns] = useState<HealthConcern[]>([]);
  const [details, setDetails] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleConcernToggle = (concern: HealthConcern) => {
    setHealthConcerns(prev =>
        prev.includes(concern)
            ? prev.filter(c => c !== concern)
            : [...prev, concern]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && height && weight) {
      onLogin({ name, goal, healthConcerns, details, height: parseFloat(height), weight: parseFloat(weight) });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-900 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="flex flex-col items-center space-y-2">
             <LeafIcon className="h-12 w-12 text-indigo-500"/>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Welcome to Neuronest</h1>
            <p className="text-slate-500 dark:text-slate-400">Let's get to know you better.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                What's your name?
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800 dark:text-slate-200"
                placeholder="e.g., Alex"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label htmlFor="height" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800 dark:text-slate-200"
                    placeholder="e.g., 175"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800 dark:text-slate-200"
                    placeholder="e.g., 70"
                    required
                  />
                </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">What's your primary goal?</label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GOAL_OPTIONS.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => setGoal(option.value)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 ${
                      goal === option.value
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Do you have any specific health concerns?</label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {HEALTH_CONCERN_OPTIONS.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => handleConcernToggle(option.value)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 text-left ${
                      healthConcerns.includes(option.value)
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="details" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Any other needs or preferences?
              </label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={2}
                className="mt-1 block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800 dark:text-slate-200"
                placeholder="e.g., vegetarian, gluten-free, or anything not on the list..."
              />
            </div>
            <Button type="submit" className="w-full">
              Start Tracking
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
