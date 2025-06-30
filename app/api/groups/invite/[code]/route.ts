import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Get group information by invite code
export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const inviteCode = params.code;
    
    // Get group details
    const result = await sql`
      SELECT 
        g.id,
        g.name,
        g.description,
        (
          SELECT COUNT(*)
          FROM group_members gm
          WHERE gm.group_id = g.id
        ) as member_count
      FROM groups g
      WHERE g.invite_code = ${inviteCode};
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Invalid invite code' }, { status: 404 });
    }

    return NextResponse.json({
      group: result.rows[0]
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching group by invite code:', error);
    return NextResponse.json({ message: 'Error fetching group information' }, { status: 500 });
  }
} 