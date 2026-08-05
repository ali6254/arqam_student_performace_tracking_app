import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

interface TotalRow {
  term_id: number;
  term_name: string;
  total_points: number;
}

interface HistoryRow {
  entry_id: number;
  criteria_name: string;
  performance_name: string;
  points_awarded: number;
  awarded_by: string;
  note: string | null;
  created_at: Date;
}

export default async function StudentReportPage() {
  const session = await getSession();
  if (!session) return null; // middleware already guards this route

  const totals = await prisma.$queryRaw<TotalRow[]>`
    SELECT term_id, term_name, total_points
    FROM student_term_totals
    WHERE student_id = ${session.id}
    ORDER BY term_id DESC
  `;

  const currentTotal = totals[0];

  const history = currentTotal
    ? await prisma.$queryRaw<HistoryRow[]>`
        SELECT entry_id, criteria_name, performance_name, points_awarded, awarded_by, note, created_at
        FROM student_point_history
        WHERE student_id = ${session.id} AND term_id = ${currentTotal.term_id}
        ORDER BY created_at DESC
      `
    : [];

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-8 rounded-lg bg-slate-900 p-6 text-center">
        <p className="text-sm text-slate-300">{currentTotal?.term_name ?? 'No term yet'}</p>
        <p className="mt-1 text-4xl font-medium text-white">{currentTotal?.total_points ?? 0}</p>
        <p className="text-sm text-slate-300">total points</p>
      </div>

      <h2 className="mb-3 text-base font-medium text-slate-900">Detail</h2>
      <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
        {history.length === 0 && <p className="p-4 text-sm text-slate-500">No entries yet this term.</p>}
        {history.map((h) => (
          <div key={h.entry_id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">
                {h.criteria_name} — {h.performance_name}
              </p>
              <p className="text-xs text-slate-500">
                by {h.awarded_by} · {new Date(h.created_at).toLocaleDateString()}
              </p>
              {h.note && <p className="mt-1 text-xs text-slate-500">{h.note}</p>}
            </div>
            <span className={`text-sm font-medium ${h.points_awarded >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {h.points_awarded > 0 ? `+${h.points_awarded}` : h.points_awarded}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
