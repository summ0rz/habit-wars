'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProgressMeter from './ProgressMeter';
import LogActionModal from './LogActionModal';
import AddHabitModal from './AddHabitModal';
import EditHabitModal from './EditHabitModal';

type Habit = {
  id: number;
  Name: string;
  UserID: number;
  Cadence: 'daily' | 'weekly' | 'monthly';
  Frequency: number;
  completedCount: number;
  Color: string;
};

type HabitsData = {
  habits: Habit[] | undefined;
}

type HabitSectionProps = {
  habits: Habit[] | undefined;
  habitsData: HabitsData | null | { error: string };
  userId: number;
};

export default function HabitSection({ habits, habitsData, userId }: HabitSectionProps) {
  const [isAddHabitModalOpen, setIsAddHabitModalOpen] = useState(false);
  const [isLogging, setIsLogging] = useState<number | null>(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleUnlogAction = async (habitId: number, userId: number) => {
    setIsLogging(habitId);
    try {
      const res = await fetch('/api/actions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          HabitID: habitId,
          UserID: userId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      
      window.dispatchEvent(new CustomEvent('actionAdded'));
      router.refresh();

    } catch (err) {
      console.error(err);
      // You might want to show an error to the user here
    } finally {
      setIsLogging(null);
    }
  };

  const handleLogAction = async (habitId: number, userId: number, loggedAt?: string) => {
    setIsLogging(habitId);
    try {
      const res = await fetch('/api/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          HabitID: habitId,
          UserID: userId,
          LoggedAt: loggedAt,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      
      setIsModalOpen(false);
      window.dispatchEvent(new CustomEvent('actionAdded'));
      router.refresh();

    } catch (err) {
      console.error(err);
      // You might want to show an error to the user here
    } finally {
      setIsLogging(null);
    }
  };

  const openLogModal = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsModalOpen(true);
  };

  const onModalSubmit = (loggedAt: string) => {
    if (selectedHabit) {
      handleLogAction(selectedHabit.id, selectedHabit.UserID, loggedAt);
    }
  };

  const openEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <section className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 min-h-[40px]">
          <h2 className="text-2xl font-semibold">Habits</h2>
          <button
            onClick={() => setIsAddHabitModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Habit
          </button>
        </div>

        <div className="flex-grow">
          {habitsData && 'error' in habitsData && habitsData.error ? (
            <p className="text-center text-red-500 bg-white dark:bg-black/[.1] shadow-md rounded-lg p-4 h-full flex items-center justify-center">{habitsData.error}</p>
          ) : habits && habits.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-black/[.1] shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700 h-full">
              {habits.map((habit) => (
                <li key={habit.id} className="py-3 px-2">
                  <div className='flex justify-between items-center'>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: habit.Color }}
                      ></span>
                      <p className="text-lg font-medium">{habit.Name}</p>
                      <button
                        type="button"
                        onClick={() => openEditModal(habit)}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none cursor-pointer"
                        title="Edit habit"
                      >
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUnlogAction(habit.id, habit.UserID)}
                        disabled={isLogging === habit.id || habit.completedCount === 0}
                        className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        Unlog
                      </button>
                      <button
                        onClick={() => openLogModal(habit)}
                        disabled={isLogging === habit.id}
                        className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {isLogging === habit.id ? '...' : 'Log'}
                      </button>
                    </div>
                  </div>
                  <ProgressMeter
                    currentValue={habit.completedCount}
                    maxValue={habit.Frequency}
                    cadence={habit.Cadence}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-black/[.1] shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700 h-full flex items-center justify-center">
              No habits found.
            </div>
          )}
        </div>
      </section>
      {selectedHabit && (
        <LogActionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={onModalSubmit}
          habitName={selectedHabit.Name}
          isSubmitting={isLogging === selectedHabit.id}
        />
      )}
      <AddHabitModal
        isOpen={isAddHabitModalOpen}
        onClose={() => setIsAddHabitModalOpen(false)}
        userId={userId}
      />
      <EditHabitModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        habit={editingHabit}
      />
    </>
  );
} 