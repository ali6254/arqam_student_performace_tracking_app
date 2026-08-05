import LoginForm from '@/components/LoginForm';
import { loginStudent } from '@/lib/actions';

export default async function StudentLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return <LoginForm title="Student sign in" action={loginStudent} error={error} />;
}
