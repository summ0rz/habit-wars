'use client';

import Navigation from '@/components/Navigation';

type GroupsPageProps = {
  userId: number;  // Keep this for future use when implementing group creation
};

export default function GroupsPage({ userId: _ }: GroupsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="container mx-auto p-4 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Groups</h1>
          <Navigation />
        </div>

        <div className="bg-white dark:bg-black/[.1] shadow-md rounded-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">No Groups Yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Create a group to start sharing habits with others</p>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create New Group
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 