import { Metadata } from "next";
import MainPage from "@/components/MainPage";
import { auth } from "@/app/auth";
import SignInButton from "@/components/SignInButton";

export const metadata: Metadata = {
  title: 'Habit Wars',
}

async function getUserId(email: string | null | undefined): Promise<number | null> {
  if (!email) {
    return null;
  }
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/users/find?email=${encodeURIComponent(email)}`);

    if (!res.ok) {
      if (res.status !== 404) {
        console.error('Failed to fetch user ID:', await res.text());
      }
      return null;
    }
    const data = await res.json();
    return data.id;
  } catch (error) {
    console.error('Error in getUserId:', error);
    return null;
  }
}

export default async function Home() {
  const session = await auth()

  if (!session) {
    return (
      <div className="min-h-screen p-8">
        <main className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Welcome to Habit Wars</h1>
            <SignInButton />
          </div>
        </main>
      </div>
    )
  }

  console.log(session?.user?.email);

  // TODO: Check if user has an account. If not, create one
  // 1. Add DB method (API) that takes in email and returns user id
  // 2. Pass user id to MainPage
  // 3. Update MainPage to only show habits for the passed in user id
  // -- DONE --
  // 4. Update all API calls to take in user id
  // 5. Remove user dropdown from AddHabitForm
  const userId = await getUserId(session?.user?.email);
  console.log(userId);

  if (!userId) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <main className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Account not found.</h1>
            <p>Please contact support to have an account created.</p>
          </div>
        </main>
      </div>
    )
  }

  return <MainPage userId={userId} />
}
