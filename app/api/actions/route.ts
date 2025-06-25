import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

type Action = {
    id: number;
    habit_id: number;
    user_id: number;
    logged_at: string;
    habit_name: string;
    user_name: string;
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
                a.habit_id,
                a.user_id,
                a.logged_at,
                h.name as habit_name,
                u.name as user_name
            FROM actions a
            JOIN habits h ON a.habit_id = h.id
            JOIN users u ON a.user_id = u.id
            WHERE a.user_id = ${userId}
            ORDER BY a.logged_at DESC
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
        const { habit_id, user_id, logged_at } = await request.json();

        if (!habit_id || !user_id) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        let result;
        if (logged_at) {
            result = await sql`
                INSERT INTO actions (habit_id, user_id, logged_at)
                VALUES (${habit_id}, ${user_id}, ${logged_at})
                RETURNING *;
            `;
        } else {
            result = await sql`
                INSERT INTO actions (habit_id, user_id)
                VALUES (${habit_id}, ${user_id})
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
        const { habit_id, user_id } = await request.json();

        if (!habit_id || !user_id) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Find the most recent action and delete it
        const result = await sql`
            DELETE FROM actions
            WHERE id = (
                SELECT id
                FROM actions
                WHERE habit_id = ${habit_id} AND user_id = ${user_id}
                ORDER BY logged_at DESC
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