export type User = {
  id: number;
  name: string;
  email: string;
};

export type Habit = {
  id: number;
  name: string;
  user_id: number;
  cadence: 'daily' | 'weekly' | 'monthly';
  frequency: number;
  completed_count: number;
  color: string;
};

export type Action = {
  id: number;
  habit_id: number;
  user_id: number;
  logged_at: string;
}; 