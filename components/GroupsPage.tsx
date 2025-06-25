'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

type Group = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  created_by: number; // user id
  member_count: number;
  role: string;
};

type GroupsPageProps = {
  userId: number;
};

export default function GroupsPage({ userId }: GroupsPageProps) {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    Name: '',
    Description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, [userId]);

  async function fetchGroups() {
    try {
      const res = await fetch(`/api/groups?userId=${userId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || errorData.message || 'Failed to fetch groups');
      }
      const data = await res.json();
      setGroups(data.groups);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load groups. Please try again later.');
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newGroupData,
          created_by: userId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create group');
      }

      setIsCreateModalOpen(false);
      setNewGroupData({ Name: '', Description: '' });
      fetchGroups();
      router.refresh();
    } catch (err) {
      console.error('Error creating group:', err);
      setError(err instanceof Error ? err.message : 'Failed to create group. Please try again.');
    } finally {
      setIsSubmitting(false);
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

  return (
    <main className="container mx-auto p-4 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Groups</h1>
        <Navigation />
      </div>

      {error && (
        <div className="mb-8 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {groups.length === 0 ? (
        <div className="bg-white dark:bg-black/[.1] shadow-md rounded-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">No Groups Yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Create a group to start sharing habits with others</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create New Group
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create New Group
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white dark:bg-black/[.1] shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/groups/${group.id}`)}
              >
                <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                {group.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {group.description}
                  </p>
                )}
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{group.member_count} members</span>
                  <span className="capitalize">{group.role}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create Group Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Create New Group</h2>
            <form onSubmit={handleCreateGroup}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newGroupData.Name}
                  onChange={(e) => setNewGroupData({ ...newGroupData, Name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  value={newGroupData.Description}
                  onChange={(e) => setNewGroupData({ ...newGroupData, Description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
} 