import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { User, Meal, WaterLog } from './types';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { getCalorieSuggestion, getUnhealthyIntakeFeedback } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useLocalStorage<User | null>('neuronest-user', null);
  const [meals, setMeals] = useLocalStorage<Meal[]>('neuronest-meals', []);
  const [suggestedCalories, setSuggestedCalories] = useLocalStorage<number | null>('neuronest-calories', null);
  const [waterLog, setWaterLog] = useLocalStorage<WaterLog>('neuronest-water', {});
  const [notification, setNotification] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (user && suggestedCalories === null) {
      const fetchSuggestion = async () => {
        try {
          const calories = await getCalorieSuggestion(user);
          setSuggestedCalories(calories);
        } catch (e) {
          console.error("Failed to fetch calorie suggestion", e);
        }
      };
      fetchSuggestion();
    }
  }, [user, suggestedCalories, setSuggestedCalories]);


  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setMeals([]); // Clear meals for a new user session
    setSuggestedCalories(null); // Reset calorie suggestion
    setWaterLog({});
  };
  
  const handleLogout = () => {
    setUser(null);
    setMeals([]);
    setSuggestedCalories(null);
    setWaterLog({});
  };

  const addMeal = async (newMeal: Meal) => {
    setMeals(prevMeals => [...prevMeals, newMeal]);
    if (user) {
        getUnhealthyIntakeFeedback(newMeal.nutrients, user).then(feedback => {
            if (feedback) {
                setNotification(feedback);
            }
        }).catch(e => console.error("Failed to get meal feedback", e));
    }
  };

  const handleWaterChange = (increment: number) => {
      setWaterLog(prevLog => {
          const newCount = (prevLog[todayStr] || 0) + increment;
          return {
              ...prevLog,
              [todayStr]: Math.max(0, newCount)
          };
      });
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const waterToday = waterLog[todayStr] || 0;

  return (
    <Dashboard 
        user={user} 
        meals={meals} 
        addMeal={addMeal} 
        logout={handleLogout} 
        suggestedCalories={suggestedCalories}
        waterToday={waterToday}
        addWater={() => handleWaterChange(1)}
        removeWater={() => handleWaterChange(-1)}
        notification={notification}
        dismissNotification={() => setNotification(null)}
    />
  );
};

export default App;
