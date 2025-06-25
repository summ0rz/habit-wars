'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

type Member = {
  id: number;
  name: string;
  email: string;
  role: string;
  joined_at: string;
};

type Group = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  created_by: number;
  member_count: number;
};

type GroupDetailsPageProps = {
  userId: number;
  groupId: number;
};

export default function GroupDetailsPage({ userId, groupId }: GroupDetailsPageProps) {
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  async function fetchGroupDetails() {
    try {
      const res = await fetch(`/api/groups/${groupId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch group details');
      }
      const data = await res.json();
      setGroup(data.group);
      setMembers(data.members);
      
      // Find the current user's role in the group
      const currentMember = data.members.find((m: Member) => m.id === userId);
      setUserRole(currentMember?.role || null);
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load group details');
      console.error('Error fetching group details:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="container mx-auto p-4 sm:p-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
        </div>
      </main>
    );
  }

  if (error || !group) {
    return (
      <main className="container mx-auto p-4 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push('/groups')}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Groups
          </button>
          <Navigation />
        </div>
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
          {error || 'Group not found'}
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => router.push('/groups')}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Groups
        </button>
        <Navigation />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{group.name}</h1>
        <button
          onClick={() => {/* TODO: Implement invite functionality */}}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Invite Members
        </button>
      </div>

      <div className="bg-white dark:bg-black/[.1] shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
        {group.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">{group.description}</p>
        )}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Created {new Date(group.created_at).toLocaleDateString()}</p>
          <p>{group.member_count} members</p>
          {userRole && <p>Your role: <span className="capitalize">{userRole}</span></p>}
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Members</h2>
        <div className="bg-white dark:bg-black/[.1] shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {members.map((member) => (
              <li key={member.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{member.name}</h3>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-sm capitalize bg-gray-100 dark:bg-gray-700 rounded">
                      {member.role}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Joined {new Date(member.joined_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
} 