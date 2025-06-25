'use client';

import { useState, useEffect, FormEvent, useRef, useMemo } from 'react';
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
    const [shuffledPresetColors, setShuffledPresetColors] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const colorInputRef = useRef<HTMLInputElement>(null);

    const presetColors = useMemo(() => [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
        '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'
    ], []);

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
                    name: name,
                    user_id: userId,
                    cadence: cadence,
                    frequency: frequency,
                    color: color,
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
            const array = [...presetColors];
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            setShuffledPresetColors(array);
            
            setName('');
            setCadence('daily');
            setFrequency(1);
            setColor(array[0]);
            setError(null);
            setIsSubmitting(false);
        }
    }, [isOpen, presetColors]);

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
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 border p-2 custom-select"
                                required
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
                            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Goal</label>
                            <div className="mt-1 flex items-stretch">
                                <div className="flex items-center flex-grow rounded-l-md border border-r-0 border-gray-300 shadow-sm sm:text-sm dark:border-gray-600">
                                    <input
                                        type="number"
                                        id="frequency"
                                        value={frequency}
                                        onChange={(e) => setFrequency(parseInt(e.target.value, 10) || 1)}
                                        min="1"
                                        className="block w-full text-center p-2 border-none bg-transparent focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        required
                                    />
                                    <span className="pr-3 text-gray-500 dark:text-gray-400">
                                        /{cadence === 'daily' ? 'day' : cadence.slice(0, -2)}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <button
                                        type="button"
                                        onClick={() => setFrequency(f => f + 1)}
                                        className="px-3 flex-grow border-t border-r border-b bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 rounded-tr-md"
                                    >
                                        +
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFrequency(f => Math.max(1, f - 1))}
                                        className="px-3 flex-grow border-b border-r bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 rounded-br-md"
                                    >
                                        -
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
                            <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                            <div className="mt-2 flex items-center gap-2">
                                {shuffledPresetColors.map((presetColor) => (
                                    <button
                                        key={presetColor}
                                        type="button"
                                        className={`w-8 h-8 rounded-full border-3 ${color === presetColor ? 'border-indigo-500' : 'border-transparent'} cursor-pointer`}
                                        style={{ backgroundColor: presetColor }}
                                        onClick={() => setColor(presetColor)}
                                    />
                                ))}
                                <div className={`w-10 h-10 border-3 rounded overflow-hidden ${!shuffledPresetColors.includes(color) ? 'border-indigo-500' : 'border-transparent'}`}>
                                    <input
                                        ref={colorInputRef}
                                        type="color"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="cursor-pointer"
                                        style={{ 
                                            width: 'calc(100% + 8px)',
                                            height: 'calc(100% + 8px)',
                                            margin: '-4px',
                                            padding: 0,
                                            border: 'none',
                                            outline: 'none',
                                            borderRadius: 0,
                                            WebkitAppearance: 'none',
                                            MozAppearance: 'none',
                                            appearance: 'none'
                                        }}
                                        title="Choose a custom color"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => colorInputRef.current?.click()}
                                    className="-ml-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none cursor-pointer"
                                    title="Choose a custom color"
                                >
                                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M12 15a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                </button>
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