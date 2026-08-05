import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-3 p-8">
      <h1 className="mb-4 text-lg font-medium text-slate-900">Behavior Points</h1>
      <Link
        href="/admin/login"
        className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-center text-sm text-slate-700 hover:bg-slate-50"
      >
        Admin sign in
      </Link>
      <Link
        href="/staff/login"
        className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-center text-sm text-slate-700 hover:bg-slate-50"
      >
        Staff sign in
      </Link>
      <Link
        href="/student/login"
        className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-center text-sm text-slate-700 hover:bg-slate-50"
      >
        Student sign in
      </Link>
    </div>
  );
}
