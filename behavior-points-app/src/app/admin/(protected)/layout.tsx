import Link from 'next/link';
import type { ReactNode } from 'react';
import { logout } from '@/lib/actions';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <nav className="flex items-center gap-6 border-b border-slate-200 bg-white px-8 py-4">
        <span className="text-sm font-medium text-slate-900">Admin</span>
        <Link href="/admin" className="text-sm text-slate-600 hover:text-slate-900">
          Dashboard
        </Link>
        <Link href="/admin/criteria" className="text-sm text-slate-600 hover:text-slate-900">
          Criteria
        </Link>
        <Link href="/admin/students" className="text-sm text-slate-600 hover:text-slate-900">
          Students
        </Link>
        <Link href="/admin/staff" className="text-sm text-slate-600 hover:text-slate-900">
          Staff
        </Link>
        <Link href="/admin/reports" className="text-sm text-slate-600 hover:text-slate-900">
          Reports
        </Link>
        <form action={logout} className="ml-auto">
          <button type="submit" className="text-sm text-slate-500 hover:text-slate-900">
            Sign out
          </button>
        </form>
      </nav>
      {children}
    </div>
  );
}
