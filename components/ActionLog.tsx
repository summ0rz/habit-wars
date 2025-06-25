'use client';

import { useEffect, useState } from 'react';

type User = {
  id: number;
  name: string;
};

type Habit = {
  id: number;
  Name: string;
};

type Action = {
  id: number;
  habit_id: number;
  user_id: number;
  logged_at: string;
};

type ActionLogProps = {
  userId: number;
  actions: Action[] | undefined;
  users: User[] | undefined;
  habits: Habit[] | undefined;
};

export default function ActionLog({ userId, actions, users, habits }: ActionLogProps) {
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) {
        return <p className="text-center text-gray-500 dark:text-gray-400">Loading actions...</p>;
    }

    if (!actions || !users || !habits) {
        return <p className="text-center text-red-500">Could not load activity.</p>;
    }

    const getEntityName = (id: number, entities: {id: number, name?: string, Name?: string}[]) => {
        const entity = entities.find(e => e.id === id);
        return entity?.name || entity?.Name || 'Unknown';
      };

    return (
        <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            {actions.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-black/[.1] shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    {actions.map((action) => (
                        <li key={action.id} className="py-3 px-2">
                            <p className="text-lg font-medium">
                                <span className="font-bold">{action.user_id === userId ? "You" : getEntityName(action.user_id, users)}</span> completed <span className="font-bold">{getEntityName(action.habit_id, habits)}</span>
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(action.logged_at).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">No recent activity.</p>
            )}
        </section>
    );
} 