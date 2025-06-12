import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const habitId = params.id;
    const { Name, Cadence, Frequency, Color } = await request.json();
    
    if (!Name || !Cadence || !Frequency) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const result = await sql`
      UPDATE "Habits" 
      SET "Name" = ${Name}, "Cadence" = ${Cadence}, "Frequency" = ${Frequency}, "Color" = ${Color}
      WHERE "id" = ${habitId}
      RETURNING *;
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Habit not found' }, { status: 404 });
    }

    return NextResponse.json({ habit: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error updating habit:', error);
    return NextResponse.json({ message: 'Error updating habit' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const habitId = params.id;

    // First delete all actions associated with this habit
    await sql`
      DELETE FROM "Actions" 
      WHERE "HabitID" = ${habitId};
    `;

    // Then delete the habit itself
    const result = await sql`
      DELETE FROM "Habits" 
      WHERE "id" = ${habitId}
      RETURNING *;
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Habit not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Habit and all associated actions deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting habit:', error);
    return NextResponse.json({ message: 'Error deleting habit' }, { status: 500 });
  }
} 