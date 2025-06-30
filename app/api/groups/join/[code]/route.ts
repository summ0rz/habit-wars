import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import { getUserId } from '@/app/auth/utils';

export async function POST(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const userId = await getUserId(session.user.email);
    if (!userId) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const inviteCode = params.code;
    
    // Get group ID from invite code
    const groupResult = await sql`
      SELECT id FROM groups WHERE invite_code = ${inviteCode};
    `;

    if (groupResult.rows.length === 0) {
      return NextResponse.json({ message: 'Invalid invite code' }, { status: 404 });
    }

    const groupId = groupResult.rows[0].id;

    // Check if user is already a member
    const memberCheck = await sql`
      SELECT id FROM group_members
      WHERE group_id = ${groupId} AND user_id = ${userId};
    `;

    if (memberCheck.rows.length > 0) {
      return NextResponse.json({ message: 'Already a member of this group' }, { status: 400 });
    }

    // Add user as a member
    await sql`
      INSERT INTO group_members (group_id, user_id, role)
      VALUES (${groupId}, ${userId}, 'member');
    `;

    return NextResponse.json({ message: 'Successfully joined group' }, { status: 200 });
  } catch (error) {
    console.error('Error joining group:', error);
    return NextResponse.json({ message: 'Error joining group' }, { status: 500 });
  }
} 