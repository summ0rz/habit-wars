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
  habitsData: HabitsData | null;
};

export default function HabitSection({ habits, users, habitsData }: HabitSectionProps) {
  const [showForm, setShowForm] = useState(false);

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
        {habits && habits.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-black/[.1] shadow-md rounded-lg p-4">
            {habits.map((habit) => (
              <li key={habit.id} className="py-3 px-2">
                <div>
                  <p className="text-lg font-medium">{habit.Name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Cadence: {habit.Cadence}, Frequency: {habit.Frequency}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-black/[.1] shadow-md rounded-lg p-4">
            {habitsData ? 'No habits found.' : 'Could not load habits.'}
          </div>
        )}
      </div>
    </section>
  );
} 