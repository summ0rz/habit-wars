'use client';

import { useState, useEffect } from 'react';

type GroupAction = {
  id: number;
  habit_id: number;
  logged_at: string;
  user_id: number;
  user_name: string;
  habit_name: string;
  habit_color: string;
};

type RecentActivityProps = {
  actions: GroupAction[];
};

export default function RecentActivity({ actions }: RecentActivityProps) {
  // Sort actions by date, most recent first
  const sortedActions = [...actions].sort((a, b) => 
    new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()
  );

  // Format the date to show relative time (e.g., "2 hours ago")
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
      <div className="bg-white dark:bg-black/[.1] shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
        {sortedActions.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedActions.slice(0, 10).map((action) => (
              <li key={action.id} className="p-4 flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: action.habit_color }}
                ></div>
                <div className="flex-grow">
                  <p className="text-sm">
                    <span className="font-medium">{action.user_name}</span>
                    {' completed '}
                    <span className="font-medium">{action.habit_name}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {getRelativeTime(action.logged_at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No recent activity
          </div>
        )}
      </div>
    </section>
  );
} 