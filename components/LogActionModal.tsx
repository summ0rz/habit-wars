'use client';

import { useState, useEffect, FormEvent, useMemo } from 'react';

type LogActionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (loggedAt: string) => void;
  habitName: string;
  isSubmitting: boolean;
};

// Helper to format date to YYYY-MM-DDTHH:mm for the datetime-local input
const toLocalISOString = (date: Date) => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, 16);
    return localISOTime;
};

export default function LogActionModal({ isOpen, onClose, onSubmit, habitName, isSubmitting }: LogActionModalProps) {
  const [loggedAt, setLoggedAt] = useState(toLocalISOString(new Date()));

  useEffect(() => {
    if (isOpen) {
      // Reset to current time whenever modal is opened
      setLoggedAt(toLocalISOString(new Date()));
    }
  }, [isOpen]);
  
  const selectedDay = useMemo(() => {
    if (!loggedAt) return null;
    const date = new Date(loggedAt);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }, [loggedAt]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(loggedAt);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Log {habitName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="w-24 text-gray-600 dark:text-gray-400">
                {selectedDay || 'Select date'}
              </span>
              <input
                type="datetime-local"
                id="loggedAt"
                name="loggedAt"
                value={loggedAt}
                onChange={(e) => setLoggedAt(e.target.value)}
                className="flex-grow block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 