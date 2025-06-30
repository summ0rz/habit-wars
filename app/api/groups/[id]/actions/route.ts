import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = parseInt(params.id);
    
    // Get all actions for habits shared in the group
    const result = await sql`
      SELECT DISTINCT
        a.id,
        a.habit_id,
        a.logged_at,
        a.user_id,
        u.name as user_name,
        h.name as habit_name,
        h.color as habit_color
      FROM actions a
      JOIN habits h ON a.habit_id = h.id
      JOIN users u ON a.user_id = u.id
      JOIN group_members gm ON a.user_id = gm.user_id
      WHERE gm.group_id = ${groupId}
      ORDER BY a.logged_at DESC;
    `;

    return NextResponse.json({
      actions: result.rows
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching group actions:', error);
    return NextResponse.json({ message: 'Error fetching group actions' }, { status: 500 });
  }
} 