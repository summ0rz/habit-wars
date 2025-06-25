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
        g."Name",
        g."Description",
        g."CreatedAt",
        g."CreatedBy",
        (
          SELECT COUNT(*)
          FROM "GroupMembers" gm2
          WHERE gm2."GroupID" = g.id
        ) as "MemberCount"
      FROM "Groups" g
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
        gm."Role",
        gm."JoinedAt"
      FROM "GroupMembers" gm
      JOIN "users" u ON gm."UserID" = u.id
      WHERE gm."GroupID" = ${groupId}
      ORDER BY gm."JoinedAt" ASC;
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
      SELECT id FROM "GroupMembers"
      WHERE "GroupID" = ${groupId}
      AND "UserID" = ${parseInt(userId)}
      AND "Role" = 'admin';
    `;

    if (adminCheck.rows.length === 0) {
      return NextResponse.json(
        { message: 'Only group admins can delete the group' },
        { status: 403 }
      );
    }

    // Delete the group (this will cascade to GroupMembers due to ON DELETE CASCADE)
    await sql`
      DELETE FROM "Groups"
      WHERE id = ${groupId};
    `;

    return NextResponse.json({ message: 'Group deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting group:', error);
    return NextResponse.json({ message: 'Error deleting group' }, { status: 500 });
  }
} 