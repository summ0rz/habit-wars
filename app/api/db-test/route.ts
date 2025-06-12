import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basic connectivity
    const testConnection = await sql`SELECT NOW();`;
    
    // Check if Groups table exists and get its structure
    const groupsTable = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Groups';
    `;

    // Check if GroupMembers table exists and get its structure
    const groupMembersTable = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'GroupMembers';
    `;

    // Get count of groups
    const groupCount = await sql`SELECT COUNT(*) FROM "Groups";`;

    return NextResponse.json({
      connection: 'success',
      timestamp: testConnection.rows[0].now,
      groupsTableStructure: groupsTable.rows,
      groupMembersTableStructure: groupMembersTable.rows,
      totalGroups: groupCount.rows[0].count
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      error: 'Database test failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 