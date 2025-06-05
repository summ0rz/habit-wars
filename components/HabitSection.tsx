'use client';

import { useState } from 'react';
import AddHabitForm from './AddHabitForm';

type User = {
    id: number;
    name: string;
    email: string;
};

type Habit = {
  id: number;
  Name: string;
  UserID: number;
  Cadence: 'daily' | 'weekly' | 'monthly';
  Frequency: number;
};

type HabitsData = {
  habits: Habit[] | undefined;
}

type HabitSectionProps = {
  habits: Habit[] | undefined;
  users: User[] | undefined;
  habitsData: HabitsData | null | { error: string };
};

export default function HabitSection({ habits, users, habitsData }: HabitSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [isLogging, setIsLogging] = useState<number | null>(null);

  const handleLogAction = async (habitId: number, userId: number) => {
    setIsLogging(habitId);
    try {
      const res = await fetch('/api/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          HabitID: habitId,
          UserID: userId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('actionAdded'));

    } catch (err) {
      console.error(err);
      // You might want to show an error to the user here
    } finally {
      setIsLogging(null);
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Habits</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {showForm ? 'Cancel' : 'Add Habit'}
        </button>
      </div>

      {showForm && users && <AddHabitForm users={users} />}

      <div className="mt-4">
        {habitsData && 'error' in habitsData && habitsData.error ? (
          <p className="text-center text-red-500 bg-white dark:bg-black/[.1] shadow-md rounded-lg p-4">{habitsData.error}</p>
        ) : habits && habits.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-black/[.1] shadow-md rounded-lg p-4">
            {habits.map((habit) => (
              <li key={habit.id} className="py-3 px-2 flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium">{habit.Name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Cadence: {habit.Cadence}, Frequency: {habit.Frequency}
                  </p>
                </div>
                <button
                  onClick={() => handleLogAction(habit.id, habit.UserID)}
                  disabled={isLogging === habit.id}
                  className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isLogging === habit.id ? 'Logging...' : 'Log'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-black/[.1] shadow-md rounded-lg p-4">
            No habits found.
          </div>
        )}
      </div>
    </section>
  );
} 