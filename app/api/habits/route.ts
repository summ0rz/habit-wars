import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

type Habit = {
  id: number;
  name: string;
  user_id: number;
  cadence: 'daily' | 'weekly' | 'monthly';
  frequency: number;
  completed_count: number;
  color: string;
};

export async function POST(request: Request) {
  try {
    const { name, user_id, cadence, frequency, color } = await request.json();
    
    if (!name || !user_id || !cadence || !frequency) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO habits (name, user_id, cadence, frequency, color)
      VALUES (${name}, ${user_id}, ${cadence}, ${frequency}, ${color || '#808080'})
      RETURNING *;
    `;

    return NextResponse.json({ habit: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating habit:', error);
    return NextResponse.json({ message: 'Error creating habit' }, { status: 500 });
  }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'Missing userId parameter' }, { status: 400 });
    }

    try {
      const result = await sql`
        SELECT
            h.id,
            h.name,
            h.user_id,
            h.cadence,
            h.frequency,
            h.color,
            CAST( (
                SELECT COUNT(*)
                FROM actions a
                WHERE a.habit_id = h.id AND
                CASE
                    WHEN h.cadence = 'daily' THEN a.logged_at >= date_trunc('day', NOW())
                    WHEN h.cadence = 'weekly' THEN a.logged_at >= date_trunc('week', NOW()) - interval '1 day'
                    WHEN h.cadence = 'monthly' THEN a.logged_at >= date_trunc('month', NOW())
                    ELSE FALSE
                END
            ) AS INTEGER) as completed_count
        FROM habits h
        WHERE h.user_id = ${userId}
      `;
      
      const habits = result.rows as Habit[];
      console.log(habits);
      return NextResponse.json({ habits }, { status: 200 });
    } catch (error) {
        console.error('Error fetching habits:', error);
        return NextResponse.json({ message: 'Error fetching habits' }, { status: 500 });
    }
  } 