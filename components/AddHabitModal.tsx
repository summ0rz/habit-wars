'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type AddHabitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
};

export default function AddHabitModal({ isOpen, onClose, userId }: AddHabitModalProps) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [cadence, setCadence] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [frequency, setFrequency] = useState(1);
    const [color, setColor] = useState('#4ade80');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const presetColors = ['#4ade80', '#facc15', '#fb923c', '#60a5fa', '#c084fc', '#f87171', '#808080'];

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!name || !cadence || !frequency) {
            setError('Please fill out all fields.');
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await fetch('/api/habits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Name: name,
                    UserID: userId,
                    Cadence: cadence,
                    Frequency: frequency,
                    Color: color,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            onClose();
            router.refresh();

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setName('');
            setCadence('daily');
            setFrequency(1);
            setColor('#4ade80');
            setError(null);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Add New Habit</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="space-y-4">
                        <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 border p-2 dark:placeholder-white"
                                placeholder="ie: Exercise, Sleep before midnight"
                                required
                            />
                        </div>
                        <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
                            <label htmlFor="cadence" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cadence</label>
                            <select
                                id="cadence"
                                value={cadence}
                                onChange={(e) => setCadence(e.target.value as 'daily' | 'weekly' | 'monthly')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 border p-2"
                                required
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
                            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Frequency</label>
                            <div className="mt-1 flex">
                                <input
                                    type="number"
                                    id="frequency"
                                    value={frequency}
                                    onChange={(e) => setFrequency(parseInt(e.target.value, 10) || 1)}
                                    min="1"
                                    className="block w-full text-center rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-t border-b border-l"
                                    required
                                />
                                <div className="flex flex-col">
                                    <button
                                        type="button"
                                        onClick={() => setFrequency(f => f + 1)}
                                        className="px-3 py-0.15 border bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 rounded-tr-md"
                                    >
                                        +
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFrequency(f => Math.max(1, f - 1))}
                                        className="px-3 py-0.15 border-l border-b border-r bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 rounded-br-md"
                                    >
                                        -
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
                            <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                            <div className="mt-2 flex items-center gap-2">
                                {presetColors.map((presetColor) => (
                                    <button
                                        key={presetColor}
                                        type="button"
                                        className={`w-8 h-8 rounded-full border-2 ${color === presetColor ? 'border-indigo-500' : 'border-transparent'}`}
                                        style={{ backgroundColor: presetColor }}
                                        onClick={() => setColor(presetColor)}
                                    />
                                ))}
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-8 h-8 p-0 border-none rounded-full cursor-pointer"
                                    title="Choose a color"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                            {isSubmitting ? 'Adding...' : 'Add Habit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 