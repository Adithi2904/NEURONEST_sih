
import React, { useMemo } from 'react';
import { Meal } from '../types';
import { Card, CardContent } from './ui/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, TooltipPayload } from 'recharts';

interface AnalyticsProps {
  meals: Meal[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658']; // Protein, Carbs, Fat

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[]; }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm">
          <p className="font-semibold">{`${payload[0].name} : ${payload[0].value?.toFixed(1)}g`}</p>
        </div>
      );
    }
  
    return null;
  };

export const Analytics: React.FC<AnalyticsProps> = ({ meals }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const dailyData = useMemo(() => {
    const data: { [key: string]: { date: string; calories: number; protein: number; carbs: number; fat: number } } = {};
    
    meals.forEach(meal => {
        const date = new Date(meal.date).toLocaleDateString('en-CA'); // YYYY-MM-DD
        if (!data[date]) {
            data[date] = { date, calories: 0, protein: 0, carbs: 0, fat: 0 };
        }
        data[date].calories += meal.nutrients.calories;
        data[date].protein += meal.nutrients.protein;
        data[date].carbs += meal.nutrients.carbs.total;
        data[date].fat += meal.nutrients.fat.total;
    });

    return Object.values(data).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7);
  }, [meals]);


  const todaysMacros = useMemo(() => {
    const todaysMeals = meals.filter(m => m.date.startsWith(today));
    const totals = todaysMeals.reduce(
      (acc, meal) => {
        acc.protein += meal.nutrients.protein;
        acc.carbs += meal.nutrients.carbs.total;
        acc.fat += meal.nutrients.fat.total;
        return acc;
      },
      { protein: 0, carbs: 0, fat: 0 }
    );
    
    if(totals.protein + totals.carbs + totals.fat === 0) return [];
    
    return [
      { name: 'Protein', value: totals.protein },
      { name: 'Carbs', value: totals.carbs },
      { name: 'Fat', value: totals.fat },
    ];
  }, [meals, today]);


  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Analytics</h2>
        
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Today's Macros</h3>
            {todaysMacros.length > 0 ? (
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={todaysMacros} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {todaysMacros.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ) : <p className="text-sm text-slate-500 dark:text-slate-400">Log a meal today to see your macro breakdown.</p>}
        </div>

        <div>
            <h3 className="text-lg font-semibold mb-2">Daily Calorie Intake (Last 7 Days)</h3>
            {dailyData.length > 0 ? (
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <BarChart data={dailyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(dateStr) => new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })}/>
                            <YAxis tick={{ fontSize: 12 }}/>
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: '14px' }}/>
                            <Bar dataKey="calories" fill="#8884d8" name="Calories (kcal)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : <p className="text-sm text-slate-500 dark:text-slate-400">Log meals for a few days to see trends.</p>}
        </div>
      </CardContent>
    </Card>
  );
};
