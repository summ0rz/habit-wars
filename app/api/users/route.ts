import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Define a type for your user data for better type safety
// Adjust this based on your actual table structure
type User = {
  id: number;
  name: string;
  email: string;
  // Add other fields if they exist
};

export async function GET() {
  try {
    // Ensure the USERS table exists and has data
    // This is a placeholder query, replace with your actual table name and columns
    const result = await sql<User>`SELECT id, name, email FROM Users`;
    const users = result.rows;

    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'No users found' }, { status: 404 });
    }

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    // It's good practice to avoid sending detailed error messages to the client in production
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  }
} 