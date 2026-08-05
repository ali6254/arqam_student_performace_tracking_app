import type { ReactNode } from 'react';
import { logout } from '@/lib/actions';

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <nav className="flex items-center gap-6 border-b border-slate-200 bg-white px-8 py-4">
        <span className="text-sm font-medium text-slate-900">My report</span>
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
