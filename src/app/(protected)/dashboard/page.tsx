import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/session';

export default async function DashboardPage() {
  const session = await getUserSession();

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      {/* Rest of dashboard content */}
    </div>
  );
} 