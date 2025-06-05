'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type AddHabitFormProps = {
  users: { id: number; name: string }[];
};

export default function AddHabitForm({ users }: AddHabitFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [cadence, setCadence] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [frequency, setFrequency] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!name || !userId || !cadence || !frequency) {
        setError('Please fill out all fields.');
        setIsSubmitting(false);
        return;
    }

    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: name,
          UserID: parseInt(userId, 10),
          Cadence: cadence,
          Frequency: frequency,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      // Reset form
      setName('');
      setUserId('');
      setCadence('daily');
      setFrequency(1);

      // Refresh the page to show the new habit
      router.refresh();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-white dark:bg-black/[.1] shadow-md mt-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Habit Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600"
            required
          />
        </div>
        <div>
          <label htmlFor="user" className="block text-sm font-medium text-gray-700 dark:text-gray-300">User</label>
          <select
            id="user"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600"
            required
          >
            <option value="" disabled>Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cadence" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cadence</label>
          <select
            id="cadence"
            value={cadence}
            onChange={(e) => setCadence(e.target.value as 'daily' | 'weekly' | 'monthly')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600"
            required
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Frequency</label>
          <input
            type="number"
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(parseInt(e.target.value, 10))}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600"
            required
          />
        </div>
      </div>
      <div className="mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Adding...' : 'Add Habit'}
        </button>
      </div>
    </form>
  );
} 