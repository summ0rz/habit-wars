import HabitSection from '@/components/HabitSection'
import ActionLog from '@/components/ActionLog'
import Calendar from '@/components/Calendar'
import Link from 'next/link'

type MainPageProps = {
  userId: number;
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
  
  async function getHabits(userId: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/habits?userId=${userId}`, { cache: 'no-store' });
  
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
    Color: string;
  };

  export default async function MainPage({ userId }: MainPageProps) {
    const [usersData, habitsData] = await Promise.all([
        getUsers(),
        getHabits(userId)
      ]);
    
      const users = !usersData.error ? (usersData?.users as User[] | undefined) : undefined;
      const habits = !habitsData.error ? (habitsData?.habits as Habit[] | undefined) : undefined;
      console.log('Habits in MainPage:', habits);
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-[family-name:var(--font-geist-sans)]">
          <main className="container mx-auto p-4 sm:p-8">
            <h1 className="text-4xl font-bold mb-16 text-center">Habit Wars</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <Calendar />
              {/* Display Habits List */}
              <HabitSection habits={habits} habitsData={habitsData} userId={userId} />
            </div>
            <ActionLog userId={userId} />
    
            {/* Display Users List */}
            <section className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Users</h2>
                {usersData.error ? (
                  <p className="text-center text-red-500">{usersData.error}</p>
                ) : users && users.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-black/[.1] shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700">
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
                    No users found.
                  </p>
                )}
              </section>
              <div className="mt-8 flex justify-start">
                <Link
                  href="/api/auth/signout"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign out
                </Link>
              </div>
          </main>
        </div>
      );
  }