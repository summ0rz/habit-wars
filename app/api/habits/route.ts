import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

type Habit = {
  id: number;
  Name: string;
  UserID: number;
  Cadence: 'daily' | 'weekly' | 'monthly';
  Frequency: number;
  completedCount: number;
  Color: string;
};

export async function POST(request: Request) {
  try {
    const { Name, UserID, Cadence, Frequency, Color } = await request.json();
    
    if (!Name || !UserID || !Cadence || !Frequency) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO "Habits" ("Name", "UserID", "Cadence", "Frequency", "Color")
      VALUES (${Name}, ${UserID}, ${Cadence}, ${Frequency}, ${Color || '#808080'})
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
            h."Name",
            h."UserID",
            h."Cadence",
            h."Frequency",
            h."Color",
            CAST( (
                SELECT COUNT(*)
                FROM "Actions" a
                WHERE a."HabitID" = h.id AND
                CASE
                    WHEN h."Cadence" = 'daily' THEN a."LoggedAt" >= date_trunc('day', NOW())
                    WHEN h."Cadence" = 'weekly' THEN a."LoggedAt" >= date_trunc('week', NOW()) - interval '1 day'
                    WHEN h."Cadence" = 'monthly' THEN a."LoggedAt" >= date_trunc('month', NOW())
                    ELSE FALSE
                END
            ) AS INTEGER) as "completedCount"
        FROM "Habits" h
        WHERE h."UserID" = ${userId}
      `;
      
      const habits = result.rows as Habit[];
      console.log(habits);
      return NextResponse.json({ habits }, { status: 200 });
    } catch (error) {
        console.error('Error fetching habits:', error);
        return NextResponse.json({ message: 'Error fetching habits' }, { status: 500 });
    }
  } 