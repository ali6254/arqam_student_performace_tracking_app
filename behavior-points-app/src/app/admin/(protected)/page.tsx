import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-xl font-medium text-slate-900">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/criteria"
          className="rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-300"
        >
          <p className="text-sm font-medium text-slate-900">Criteria</p>
          <p className="mt-1 text-xs text-slate-500">Manage categories and point values</p>
        </Link>
        <Link
          href="/admin/students"
          className="rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-300"
        >
          <p className="text-sm font-medium text-slate-900">Students</p>
          <p className="mt-1 text-xs text-slate-500">Manage the student roster</p>
        </Link>
        <Link
          href="/admin/staff"
          className="rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-300"
        >
          <p className="text-sm font-medium text-slate-900">Staff</p>
          <p className="mt-1 text-xs text-slate-500">Manage staff accounts</p>
        </Link>
        <Link
          href="/admin/reports"
          className="rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-300"
        >
          <p className="text-sm font-medium text-slate-900">Reports</p>
          <p className="mt-1 text-xs text-slate-500">Download term points as Excel</p>
        </Link>
      </div>
    </div>
  );
}
