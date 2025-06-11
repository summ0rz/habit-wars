'use client';

import { useState } from 'react';

export default function Calendar() {
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
          {calendarDays.map((day, index) => (
            <div key={index} className={`flex items-center justify-center h-10 w-10 rounded-full ${day ? 'text-gray-800 dark:text-gray-200' : ''} ${isToday(day!) ? 'bg-indigo-600 text-white' : ''}`}>
              {day}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 