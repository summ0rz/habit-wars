import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

type Group = {
  id: number;
  name: string;
  description: string | null;
  invite_code: string;
  created_at: string;
  created_by: number;
  member_count: number;
  role: string;
};

async function generateUniqueInviteCode(): Promise<string> {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let isUnique = false;
  let inviteCode = '';

  while (!isUnique) {
    // Generate a random 6-letter code
    inviteCode = Array.from(
      { length: 6 },
      () => characters[Math.floor(Math.random() * characters.length)]
    ).join('');

    // Check if the code already exists
    const result = await sql`
      SELECT id FROM groups WHERE invite_code = ${inviteCode};
    `;

    if (result.rows.length === 0) {
      isUnique = true;
    }
  }

  return inviteCode;
}

// Create a new group
export async function POST(request: Request) {
  try {
    const { name, description, created_by } = await request.json();
    
    if (!name || !created_by) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const inviteCode = await generateUniqueInviteCode();

    // Create the group
    const groupResult = await sql`
      INSERT INTO groups (name, description, created_by, invite_code)
      VALUES (${name}, ${description}, ${created_by}, ${inviteCode})
      RETURNING *;
    `;

    const group = groupResult.rows[0];

    // Add the creator as an admin member
    await sql`
      INSERT INTO group_members (group_id, user_id, role)
      VALUES (${group.id}, ${created_by}, 'admin');
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
        g.name,
        g.description,
        g.created_at,
        g.created_by,
        gm.role,
        (
          SELECT COUNT(*)
          FROM group_members gm2
          WHERE gm2.group_id = g.id
        ) as member_count
      FROM groups g
      JOIN group_members gm ON g.id = gm.group_id
      WHERE gm.user_id = ${parseInt(userId)}
      ORDER BY g.created_at DESC;
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