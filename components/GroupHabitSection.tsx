'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProgressMeter from './ProgressMeter';
import { Habit } from '@/app/types';

type GroupHabit = Habit & {
  user_name: string;
};

type GroupHabitSectionProps = {
  groupId: number;
};

export default function GroupHabitSection({ groupId }: GroupHabitSectionProps) {
  const [habits, setHabits] = useState<GroupHabit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchGroupHabits();
  }, [groupId]);

  async function fetchGroupHabits() {
    try {
      const res = await fetch(`/api/groups/${groupId}/habits`);
      if (!res.ok) {
        throw new Error('Failed to fetch group habits');
      }
      const data = await res.json();
      setHabits(data.habits);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load habits');
      console.error('Error fetching group habits:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 bg-white dark:bg-black/[.1] shadow-md rounded-lg p-4">
        {error}
      </div>
    );
  }

  return (
    <section className="h-full flex flex-col">
      <h2 className="text-2xl font-semibold mb-4">Group Habits</h2>
      <div className="flex-grow">
        {habits.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-black/[.1] shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            {habits.map((habit) => (
              <li key={habit.id} className="py-3 px-2">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  ></span>
                  <p className="text-lg font-medium">{habit.name}</p>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    by {habit.user_name}
                  </span>
                </div>
                <ProgressMeter
                  currentValue={habit.completed_count}
                  maxValue={habit.frequency}
                  cadence={habit.cadence}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-black/[.1] shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            No habits found in this group.
          </div>
        )}
      </div>
    </section>
  );
} 