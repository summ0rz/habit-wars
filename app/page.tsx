import type { Metadata } from 'next'
import HabitSection from '@/components/HabitSection'

export const metadata: Metadata = {
  title: 'Habit Wars',
}

async function getUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/users`);

  if (!res.ok) {
    console.error('Failed to fetch users:', await res.text());
    return null;
  }
  return res.json();
}

async function getHabits() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/habits`);

  if (!res.ok) {
    console.error('Failed to fetch habits:', await res.text());
    return null;
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
};

export default async function Home() {
  const usersData = await getUsers();
  const users = usersData?.users as User[] | undefined;

  const habitsData = await getHabits();
  const habits = habitsData?.habits as Habit[] | undefined;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-[family-name:var(--font-geist-sans)]">
      <main className="container mx-auto p-4 sm:p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Habit Wars</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Display Users List */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Users</h2>
            {users && users.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-black/[.1] shadow-md rounded-lg p-4">
                {users.map((user) => (
                  <li key={user.id} className="py-3 px-2">
                    <div>
                      <p className="text-lg font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                {usersData ? 'No users found.' : 'Could not load users.'}
              </p>
            )}
          </section>

          {/* Display Habits List */}
          <HabitSection habits={habits} users={users} habitsData={habitsData} />
        </div>
      </main>
    </div>
  );
}
