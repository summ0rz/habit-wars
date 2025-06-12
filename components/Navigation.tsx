'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
        aria-label="Navigation menu"
      >
        <svg
          className="w-8 h-8 text-gray-700 dark:text-gray-200"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <Link
              href="/"
              className={`block px-4 py-3 text-base ${
                pathname === '/' 
                  ? 'text-indigo-600 dark:text-indigo-400 bg-gray-100 dark:bg-gray-700'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              My Habits
            </Link>
            <Link
              href="/groups"
              className={`block px-4 py-3 text-base ${
                pathname === '/groups'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-gray-100 dark:bg-gray-700'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Groups
            </Link>
            <div className="border-t border-gray-200 dark:border-gray-600"></div>
            <Link
              href="/api/auth/signout"
              className="block px-4 py-3 text-base text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Sign out
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 