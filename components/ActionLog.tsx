'use client';

import { useEffect, useState } from 'react';

type Action = {
    id: number;
    HabitName: string;
    UserName: string;
    LoggedAt: string;
};

export default function ActionLog() {
    const [actions, setActions] = useState<Action[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchActions() {
        try {
            const res = await fetch('/api/actions');
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to fetch actions');
            }
            const data = await res.json();
            setActions(data.actions);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchActions();
        
        const handleActionAdded = () => fetchActions();
        window.addEventListener('actionAdded', handleActionAdded);

        return () => {
            window.removeEventListener('actionAdded', handleActionAdded);
        };
    }, []);

    if (loading) {
        return <p className="text-center text-gray-500 dark:text-gray-400">Loading actions...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            {actions.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-black/[.1] shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    {actions.map((action) => (
                        <li key={action.id} className="py-3 px-2">
                            <p className="text-lg font-medium">
                                <span className="font-bold">{action.UserName}</span> completed <span className="font-bold">{action.HabitName}</span>
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(action.LoggedAt).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">No actions logged yet.</p>
            )}
        </section>
    );
} 