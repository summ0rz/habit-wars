import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

interface HabitData {
  name: string;
  cadence: 'daily' | 'weekly' | 'monthly';
  frequency: number;
  color: string;
}

async function updateHabit(habitId: string, data: HabitData) {
  try {
    const { name, cadence, frequency, color } = data;
    
    if (!name || !cadence || !frequency) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const result = await sql`
      UPDATE habits 
      SET name = ${name}, cadence = ${cadence}, frequency = ${frequency}, color = ${color}
      WHERE id = ${habitId}
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

async function deleteHabit(habitId: string) {
  try {
    // First delete all actions associated with this habit
    await sql`
      DELETE FROM actions 
      WHERE habit_id = ${habitId};
    `;

    // Then delete the habit itself
    const result = await sql`
      DELETE FROM habits 
      WHERE id = ${habitId}
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

export async function PUT(request: Request, context: { params: { id: string } }) {
  const data = await request.json();
  return updateHabit(context.params.id, data);
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  return deleteHabit(context.params.id);
} 