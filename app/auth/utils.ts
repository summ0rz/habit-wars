export async function getUserId(email: string | null | undefined): Promise<number | null> {
  if (!email) {
    return null;
  }
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/users/find?email=${encodeURIComponent(email)}`);

    if (!res.ok) {
      if (res.status !== 404) {
        console.error('Failed to fetch user ID:', await res.text());
      }
      return null;
    }
    const data = await res.json();
    return data.id;
  } catch (error) {
    console.error('Error in getUserId:', error);
    return null;
  }
} 