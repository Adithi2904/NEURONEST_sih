
import React from 'react';
import { Card, CardContent } from './ui/Card';

interface WaterTrackerProps {
  waterToday: number;
  addWater: () => void;
  removeWater: () => void;
}

const WATER_GOAL = 8; // glasses

const WaterDropIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-8 h-8 transition-colors ${filled ? 'text-cyan-500' : 'text-slate-300 dark:text-slate-600'}`}>
        <path d="M10 3.75a.75.75 0 00-1.5 0v1.518a4.5 4.5 0 00-3.232 4.482C5.268 13.65 8.01 16.5 10 16.5s4.732-2.85 4.732-6.75a4.5 4.5 0 00-3.232-4.482V3.75a.75.75 0 00-1.5 0z" />
    </svg>
);


export const WaterTracker: React.FC<WaterTrackerProps> = ({ waterToday, addWater, removeWater }) => {
    return (
        <Card>
            <CardContent>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Water Intake</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Goal: {WATER_GOAL} glasses</p>
                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {Array.from({ length: WATER_GOAL }).map((_, i) => (
                           <WaterDropIcon key={i} filled={i < waterToday} />
                        ))}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        <button onClick={removeWater} disabled={waterToday === 0} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" aria-label="Remove one glass of water">-</button>
                        <button onClick={addWater} disabled={waterToday >= WATER_GOAL} className="w-10 h-10 rounded-full bg-indigo-600 text-white text-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" aria-label="Add one glass of water">+</button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
