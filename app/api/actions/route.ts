import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

type Action = {
    id: number;
    HabitID: number;
    UserID: number;
    LoggedAt: string;
    HabitName: string;
    UserName: string;
};

export async function GET() {
    try {
        const result = await sql<Action>`
            SELECT
                a.id,
                a."HabitID",
                a."UserID",
                a."LoggedAt",
                h."Name" as "HabitName",
                u.name as "UserName"
            FROM "Actions" a
            JOIN "Habits" h ON a."HabitID" = h.id
            JOIN "Users" u ON a."UserID" = u.id
            ORDER BY a."LoggedAt" DESC;
        `;
        const actions = result.rows;
        return NextResponse.json({ actions }, { status: 200 });
    } catch (error) {
        console.error('Error fetching actions:', error);
        return NextResponse.json({ message: 'Error fetching actions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { HabitID, UserID } = await request.json();

        if (!HabitID || !UserID) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const result = await sql`
            INSERT INTO "Actions" ("HabitID", "UserID")
            VALUES (${HabitID}, ${UserID})
            RETURNING *;
        `;

        return NextResponse.json({ action: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('Error creating action:', error);
        return NextResponse.json({ message: 'Error creating action' }, { status: 500 });
    }
} 