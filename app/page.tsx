import type { Metadata } from 'next'
import HabitSection from '@/components/HabitSection'
import ActionLog from '@/components/ActionLog'
import Calendar from '@/components/Calendar'

export const metadata: Metadata = {
  title: 'Habit Wars',
}

async function getUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/users`, { cache: 'no-store' });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Failed to fetch users:', errorText);
    return { error: `Could not load users. Status: ${res.status}` };
  }
  return res.json();
}

async function getHabits() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/habits`, { cache: 'no-store' });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Failed to fetch habits:', errorText);
    return { error: `Could not load habits. Status: ${res.status}` };
  }
  return res.json();
}

// Define a type for your user data for better type safety
// This should match the type defined in your API route
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
  completedCount: number;
};

export default async function Home() {
  const [usersData, habitsData] = await Promise.all([
    getUsers(),
    getHabits()
  ]);

  const users = !usersData.error ? (usersData?.users as User[] | undefined) : undefined;
  const habits = !habitsData.error ? (habitsData?.habits as Habit[] | undefined) : undefined;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-[family-name:var(--font-geist-sans)]">
      <main className="container mx-auto p-4 sm:p-8">
        <h1 className="text-4xl font-bold mb-16 text-center">Habit Wars</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <Calendar />
          {/* Display Habits List */}
          <HabitSection habits={habits} users={users} habitsData={habitsData} />
        </div>
        <ActionLog />
      </main>
    </div>
  );
}
