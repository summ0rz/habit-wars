import { Metadata } from "next";
import { auth } from "@/app/auth";
import { getUserId } from "@/app/auth/utils";
import SignInButton from "@/components/SignInButton";
import GroupDetailsPage from "@/components/GroupDetailsPage";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Group Details - Habit Wars',
}

export default async function GroupDetailsRoute({ params }: { params: { id: string } }) {
  const session = await auth();
  
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Sign in to view group details</h1>
          <SignInButton />
        </div>
      </div>
    );
  }

  const userId = await getUserId(session.user.email || '');
  
  if (!userId) {
    redirect('/');  // Redirect to home if user ID not found
  }

  return <GroupDetailsPage userId={userId} groupId={parseInt(params.id)} />;
} 