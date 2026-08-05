import LoginForm from '@/components/LoginForm';
import { loginStaff } from '@/lib/actions';

export default async function StaffLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return <LoginForm title="Staff sign in" action={loginStaff} error={error} />;
}
