import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

type Habit = {
  id: number;
  Name: string;
  UserID: number;
  Cadence: 'daily' | 'weekly' | 'monthly';
  Frequency: number;
};

export async function POST(request: Request) {
  try {
    const { Name, UserID, Cadence, Frequency } = await request.json();
    
    if (!Name || !UserID || !Cadence || !Frequency) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO "Habits" ("Name", "UserID", "Cadence", "Frequency")
      VALUES (${Name}, ${UserID}, ${Cadence}, ${Frequency})
      RETURNING *;
    `;

    return NextResponse.json({ habit: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating habit:', error);
    return NextResponse.json({ message: 'Error creating habit' }, { status: 500 });
  }
}

export async function GET() {
    try {
      const result = await sql<Habit>`SELECT id, "Name", "UserID", "Cadence", "Frequency" FROM "Habits"`;
      const habits = result.rows;
  
      if (!habits || habits.length === 0) {
        return NextResponse.json({ message: 'No habits found' }, { status: 404 });
      }
  
      return NextResponse.json({ habits }, { status: 200 });
    } catch (error) {
      console.error('Error fetching habits:', error);
      return NextResponse.json({ message: 'Error fetching habits' }, { status: 500 });
    }
  } 