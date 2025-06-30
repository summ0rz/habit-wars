'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/auth';
import { getUserId } from '@/app/auth/utils';
import SignInButton from '@/components/SignInButton';

type GroupInviteInfo = {
  id: number;
  name: string;
  description: string | null;
  member_count: number;
};

export default function JoinGroupPage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [group, setGroup] = useState<GroupInviteInfo | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchGroupInfo();
  }, [params.code]);

  async function fetchGroupInfo() {
    try {
      const res = await fetch(`/api/groups/invite/${params.code}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Invalid invite link');
      }
      const data = await res.json();
      setGroup(data.group);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load group information');
      console.error('Error fetching group info:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (!group) return;
    
    setJoining(true);
    try {
      const res = await fetch(`/api/groups/join/${params.code}`, {
        method: 'POST'
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to join group');
      }

      // Redirect to the group page
      router.push(`/groups/${group.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join group');
      console.error('Error joining group:', err);
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
          <button
            onClick={() => router.push('/groups')}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Go to Groups
          </button>
        </div>
      </main>
    );
  }

  if (!group) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Invite Link</h1>
          <button
            onClick={() => router.push('/groups')}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Go to Groups
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white dark:bg-black/[.1] shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold mb-4">Join Group</h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
            {group.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">{group.description}</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {group.member_count} members
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleJoin}
              disabled={joining}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {joining ? 'Joining...' : 'Accept Invitation'}
            </button>
            <button
              onClick={() => router.push('/groups')}
              disabled={joining}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 