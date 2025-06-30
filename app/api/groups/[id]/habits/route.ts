import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = parseInt(params.id);
    
    // Get all habits from group members with their current progress
    const result = await sql`
      WITH current_period_actions AS (
        SELECT 
          habit_id,
          COUNT(*) as completed_count
        FROM actions a
        WHERE a.logged_at >= DATE_TRUNC('week', CURRENT_TIMESTAMP)
        GROUP BY habit_id
      )
      SELECT 
        h.id,
        h.name,
        h.color,
        h.frequency,
        h.cadence,
        h.user_id,
        u.name as user_name,
        COALESCE(cpa.completed_count, 0) as completed_count
      FROM habits h
      JOIN users u ON h.user_id = u.id
      JOIN group_members gm ON h.user_id = gm.user_id
      LEFT JOIN current_period_actions cpa ON h.id = cpa.habit_id
      WHERE gm.group_id = ${groupId}
      ORDER BY u.name, h.name;
    `;

    return NextResponse.json({
      habits: result.rows
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching group habits:', error);
    return NextResponse.json({ message: 'Error fetching group habits' }, { status: 500 });
  }
} 