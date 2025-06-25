import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Drop existing tables
    await sql`DROP TABLE IF EXISTS group_members CASCADE;`;
    await sql`DROP TABLE IF EXISTS groups CASCADE;`;

    // Create Groups table
    await sql`
      CREATE TABLE groups (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    // Create GroupMembers table
    await sql`
      CREATE TABLE group_members (
        id SERIAL PRIMARY KEY,
        group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(group_id, user_id)
      );
    `;

    return NextResponse.json({ message: 'Migration completed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ message: 'Migration failed', error }, { status: 500 });
  }
} 