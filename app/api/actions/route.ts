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

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'Missing userId parameter' }, { status: 400 });
    }

    try {
        const result = await sql`
            SELECT
                a.id,
                a."HabitID",
                a."UserID",
                a."LoggedAt",
                h."Name" as "HabitName",
                u.name as "UserName"
            FROM "Actions" a
            JOIN "Habits" h ON a."HabitID" = h.id
            JOIN "users" u ON a."UserID" = u.id
            WHERE a."UserID" = ${userId}
            ORDER BY a."LoggedAt" DESC
        `;
        
        const actions = result.rows as Action[];
        return NextResponse.json({ actions }, { status: 200 });
    } catch (error) {
        console.error('Error fetching actions:', error);
        return NextResponse.json({ message: 'Error fetching actions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { HabitID, UserID, LoggedAt } = await request.json();

        if (!HabitID || !UserID) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        let result;
        if (LoggedAt) {
            result = await sql`
                INSERT INTO "Actions" ("HabitID", "UserID", "LoggedAt")
                VALUES (${HabitID}, ${UserID}, ${LoggedAt})
                RETURNING *;
            `;
        } else {
            result = await sql`
                INSERT INTO "Actions" ("HabitID", "UserID")
                VALUES (${HabitID}, ${UserID})
                RETURNING *;
            `;
        }

        return NextResponse.json({ action: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('Error creating action:', error);
        return NextResponse.json({ message: 'Error creating action' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { HabitID, UserID } = await request.json();

        if (!HabitID || !UserID) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Find the most recent action and delete it
        const result = await sql`
            DELETE FROM "Actions"
            WHERE id = (
                SELECT id
                FROM "Actions"
                WHERE "HabitID" = ${HabitID} AND "UserID" = ${UserID}
                ORDER BY "LoggedAt" DESC
                LIMIT 1
            )
            RETURNING *;
        `;

        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'No action found to delete' }, { status: 404 });
        }

        return NextResponse.json({ action: result.rows[0] }, { status: 200 });
    } catch (error) {
        console.error('Error deleting action:', error);
        return NextResponse.json({ message: 'Error deleting action' }, { status: 500 });
    }
} 