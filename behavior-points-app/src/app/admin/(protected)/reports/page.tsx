import { prisma } from '@/lib/prisma';

export default async function ReportsPage() {
  const terms = await prisma.term.findMany({
    include: { school: true },
    orderBy: [{ schoolId: 'asc' }, { startDate: 'desc' }],
  });

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-xl font-medium text-slate-900">Reports</h1>
      <p className="mb-4 text-sm text-slate-500">
        Download a spreadsheet of every student&apos;s total points for a term.
      </p>
      <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
        {terms.length === 0 && <p className="p-4 text-sm text-slate-500">No terms yet.</p>}
        {terms.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">{t.name}</p>
              <p className="text-xs text-slate-500">
                {t.school.name}
                {t.isCurrent && ' · current'}
              </p>
            </div>
            <a
              href={`/api/admin/reports/term/${t.id}`}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              Download .xlsx
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
