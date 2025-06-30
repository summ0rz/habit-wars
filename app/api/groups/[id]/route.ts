import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Get group details and members
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = parseInt(params.id);
    
    // Get group details
    const groupResult = await sql`
      SELECT 
        g.id,
        g.name,
        g.description,
        g.invite_code,
        g.created_at,
        g.created_by,
        (
          SELECT COUNT(*)
          FROM group_members gm2
          WHERE gm2.group_id = g.id
        ) as member_count
      FROM groups g
      WHERE g.id = ${groupId};
    `;

    if (groupResult.rows.length === 0) {
      return NextResponse.json({ message: 'Group not found' }, { status: 404 });
    }

    const group = groupResult.rows[0];

    // Get group members with their roles
    const membersResult = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        gm.role,
        gm.joined_at
      FROM group_members gm
      JOIN users u ON gm.user_id = u.id
      WHERE gm.group_id = ${groupId}
      ORDER BY gm.joined_at ASC;
    `;

    return NextResponse.json({
      group,
      members: membersResult.rows
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching group details:', error);
    return NextResponse.json({ message: 'Error fetching group details' }, { status: 500 });
  }
}

// Delete a group
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = parseInt(params.id);
    
    // Check if the user making the request is an admin of the group
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'Missing userId parameter' }, { status: 400 });
    }

    const adminCheck = await sql`
      SELECT id FROM group_members
      WHERE group_id = ${groupId}
      AND user_id = ${parseInt(userId)}
      AND role = 'admin';
    `;

    if (adminCheck.rows.length === 0) {
      return NextResponse.json(
        { message: 'Only group admins can delete the group' },
        { status: 403 }
      );
    }

    // Delete the group (this will cascade to group_members due to ON DELETE CASCADE)
    await sql`
      DELETE FROM groups
      WHERE id = ${groupId};
    `;

    return NextResponse.json({ message: 'Group deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting group:', error);
    return NextResponse.json({ message: 'Error deleting group' }, { status: 500 });
  }
} 