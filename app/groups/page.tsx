import { Metadata } from "next";
import { auth } from "@/app/auth";
import GroupsPage from "@/components/GroupsPage";
import { getUserId } from "@/app/auth/utils";
import SignInButton from "@/components/SignInButton";

export const metadata: Metadata = {
  title: 'Groups - Habit Wars',
}

export default async function Groups() {
  const session = await auth()

  if (!session) {
    return (
      <div className="min-h-screen p-8">
        <main className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Please sign in to view groups</h1>
            <SignInButton />
          </div>
        </main>
      </div>
    )
  }

  const userId = await getUserId(session?.user?.email);

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

  return <GroupsPage userId={userId} />
} 