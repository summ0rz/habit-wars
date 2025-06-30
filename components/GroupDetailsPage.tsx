'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import GroupCalendar from '@/components/GroupCalendar';
import GroupHabitSection from '@/components/GroupHabitSection';
import RecentActivity from '@/components/RecentActivity';

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
  invite_code: string;
  created_at: string;
  created_by: number;
  member_count: number;
};

type GroupAction = {
  id: number;
  habit_id: number;
  logged_at: string;
  user_id: number;
  user_name: string;
  habit_name: string;
  habit_color: string;
};

type GroupDetailsPageProps = {
  userId: number;
  groupId: number;
};

export default function GroupDetailsPage({ userId, groupId }: GroupDetailsPageProps) {
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [actions, setActions] = useState<GroupAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    Promise.all([fetchGroupDetails(), fetchGroupActions()]);
  }, [groupId]);

  // Hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

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

  async function fetchGroupActions() {
    try {
      const res = await fetch(`/api/groups/${groupId}/actions`);
      if (!res.ok) {
        throw new Error('Failed to fetch group actions');
      }
      const data = await res.json();
      setActions(data.actions);
    } catch (err) {
      console.error('Error fetching group actions:', err);
    }
  }

  async function handleInvite() {
    if (!group) return;
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://habit-wars.vercel.app';
    const inviteLink = `${baseUrl}/groups/join/${group.invite_code}`;
    await navigator.clipboard.writeText(inviteLink);
    setShowToast(true);
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
      {showToast && (
        <div className="fixed top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-md text-sm z-50 shadow-lg">
          Invite link copied
        </div>
      )}
      
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
        <div>
          <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
          {group.description && (
            <p className="text-gray-600 dark:text-gray-400">{group.description}</p>
          )}
        </div>
        <button
          onClick={handleInvite}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Invite Members
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          <GroupCalendar actions={actions} />
          <RecentActivity actions={actions} />
        </div>
        <GroupHabitSection groupId={groupId} />
      </div>
    </main>
  );
} 