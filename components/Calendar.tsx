'use client';

import { useState } from 'react';

type Habit = {
  id: number;
  Name: string;
  Color: string;
};

type Action = {
  id: number;
  habit_id: number;
  user_id: number;
  logged_at: string;
};

type CalendarProps = {
  actions: Action[] | undefined;
  habits: Habit[] | undefined;
};

export default function Calendar({ actions, habits }: CalendarProps) {
  const [date, setDate] = useState(new Date());

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const leadingEmptyDays = Array.from({ length: startDayOfWeek }).map(() => null);
  
  const calendarDays = [...leadingEmptyDays, ...days];
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getActionsForDay = (day: number) => {
    if (!actions || !day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return actions.filter(a => a.logged_at && a.logged_at.startsWith(dateStr));
  };

  const getHabitColor = (habitId: number) => {
    if (!habits) return '#808080'; // Default gray
    const habit = habits.find(h => h.id === habitId);
    return habit ? habit.Color : '#808080';
  };

  const getHabitName = (habitId: number) => {
    if (!habits) return '';
    const habit = habits.find(h => h.id === habitId);
    return habit ? habit.Name : 'Unknown Habit';
  };

  const goToPreviousMonth = () => {
    setDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setDate(new Date(year, month + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  return (
    <section className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 min-h-[40px]">
        <h2 className="text-2xl font-semibold">
          {date.toLocaleString('default', { month: 'long' })} {year}
        </h2>
        <div className="flex gap-2">
          <button onClick={goToPreviousMonth} className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600">&lt;</button>
          <button onClick={goToNextMonth} className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600">&gt;</button>
        </div>
      </div>
      <div className="bg-white dark:bg-black/[.1] shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex-grow">
        <div className="grid grid-cols-7 gap-2 text-center">
          {weekdays.map(day => (
            <div key={day} className="font-semibold text-sm text-gray-600 dark:text-gray-400">{day}</div>
          ))}
          {calendarDays.map((day, index) => {
            const dayActions = getActionsForDay(day!);
            return (
            <div key={index} className="flex flex-col items-center justify-start h-12 w-10">
                <div className={`flex items-center justify-center h-8 w-8 rounded-full ${day ? 'text-gray-800 dark:text-gray-200' : ''} ${isToday(day!) ? 'bg-indigo-600 text-white' : ''}`}>
                  {day}
                </div>
                <div className="flex -space-x-1 overflow-hidden mt-1 h-3">
                    {dayActions.map(action => (
                      <div 
                        key={action.id} 
                        className="w-3 h-3 rounded-full border border-white dark:border-gray-800" 
                        style={{ backgroundColor: getHabitColor(action.habit_id) }}
                        title={getHabitName(action.habit_id)}
                      ></div>
                    ))}
                </div>
            </div>
          )})}
        </div>
      </div>
    </section>
  );
} 