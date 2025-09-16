
import React from 'react';
import { User, Meal } from '../types';
import { MealLogger } from './MealLogger';
import { MealHistory } from './MealHistory';
import { Analytics } from './Analytics';
import { Suggestions } from './Suggestions';
import { HealthSummary } from './HealthSummary';
import { WaterTracker } from './WaterTracker';

interface DashboardProps {
  user: User;
  meals: Meal[];
  addMeal: (meal: Meal) => void;
  logout: () => void;
  suggestedCalories: number | null;
  waterToday: number;
  addWater: () => void;
  removeWater: () => void;
  notification: string | null;
  dismissNotification: () => void;
}

const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

const NotificationBanner: React.FC<{ message: string; onDismiss: () => void; }> = ({ message, onDismiss }) => (
    <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 mb-6 rounded-r-lg shadow-md flex justify-between items-center" role="alert">
        <div>
            <p className="font-bold">Friendly Reminder</p>
            <p>{message}</p>
        </div>
        <button onClick={onDismiss} className="p-1 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500" aria-label="Dismiss notification">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
    </div>
);


export const Dashboard: React.FC<DashboardProps> = ({ user, meals, addMeal, logout, suggestedCalories, waterToday, addWater, removeWater, notification, dismissNotification }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Hello, {user.name}!</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Ready to track your nutrition for today?</p>
          </div>
          <button onClick={logout} className="flex items-center space-x-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <LogoutIcon className="w-5 h-5"/>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {notification && <NotificationBanner message={notification} onDismiss={dismissNotification} />}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MealLogger addMeal={addMeal} />
            <MealHistory meals={meals} />
          </div>
          <div className="space-y-6">
            <HealthSummary user={user} meals={meals} suggestedCalories={suggestedCalories} />
            <WaterTracker waterToday={waterToday} addWater={addWater} removeWater={removeWater} />
            <Analytics meals={meals} />
            <Suggestions user={user} meals={meals} waterToday={waterToday} />
          </div>
        </div>
      </main>
    </div>
  );
};
