import LoginForm from '@/components/LoginForm';
import { loginAdmin } from '@/lib/actions';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return <LoginForm title="Admin sign in" action={loginAdmin} error={error} />;
}
