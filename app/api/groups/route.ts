import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

type Group = {
  id: number;
  Name: string;
  Description: string | null;
  CreatedAt: string;
  CreatedBy: number;
  MemberCount: number;
  Role: string;
};

// Create a new group
export async function POST(request: Request) {
  try {
    const { Name, Description, CreatedBy } = await request.json();
    
    if (!Name || !CreatedBy) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Create the group
    const groupResult = await sql`
      INSERT INTO "Groups" ("Name", "Description", "CreatedBy")
      VALUES (${Name}, ${Description}, ${CreatedBy})
      RETURNING *;
    `;

    const group = groupResult.rows[0];

    // Add the creator as an admin member
    await sql`
      INSERT INTO "GroupMembers" ("GroupID", "UserID", "Role")
      VALUES (${group.id}, ${CreatedBy}, 'admin');
    `;

    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ 
      message: 'Error creating group',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Get groups for a user
export async function GET(request: Request) {
  console.log('GET /api/groups - Start');
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  console.log('User ID from params:', userId);

  if (!userId) {
    console.log('GET /api/groups - Missing userId');
    return NextResponse.json({ message: 'Missing userId parameter' }, { status: 400 });
  }

  try {
    console.log('Executing SQL query for user:', userId);
    // Get all groups where the user is a member, including member count and user's role
    const result = await sql`
      SELECT 
        g.id,
        g."Name",
        g."Description",
        g."CreatedAt",
        g."CreatedBy",
        gm."Role",
        (
          SELECT COUNT(*)
          FROM "GroupMembers" gm2
          WHERE gm2."GroupID" = g.id
        ) as "MemberCount"
      FROM "Groups" g
      JOIN "GroupMembers" gm ON g.id = gm."GroupID"
      WHERE gm."UserID" = ${parseInt(userId)}
      ORDER BY g."CreatedAt" DESC;
    `;
    
    console.log('Query results:', result.rows);
    const groups = result.rows as Group[];

    if (groups.length === 0) {
      console.log('No groups found for user:', userId);
      return NextResponse.json({ groups: [] }, { status: 200 });
    }

    console.log('GET /api/groups - Success, returning groups:', groups.length);
    return NextResponse.json({ groups }, { status: 200 });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json({ 
      message: 'Error fetching groups',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 