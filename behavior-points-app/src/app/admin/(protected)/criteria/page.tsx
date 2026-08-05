import { prisma } from '@/lib/prisma';
import {
  createCriteria,
  createPerformanceLevel,
  toggleCriteriaActive,
  togglePerformanceLevelActive,
  updatePerformanceLevel,
} from './actions';

export default async function CriteriaPage() {
  const [criteria, schools] = await Promise.all([
    prisma.criteria.findMany({
      include: { performanceLevels: { orderBy: { id: 'asc' } }, school: true },
      orderBy: { id: 'asc' },
    }),
    prisma.school.findMany({ orderBy: { id: 'asc' } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-10 p-8">
      <h1 className="text-xl font-medium text-slate-900">Criteria &amp; performance levels</h1>

      <div className="space-y-6">
        {criteria.map((c) => (
          <div
            key={c.id}
            className={`rounded-lg border border-slate-200 p-5 ${c.isActive ? 'bg-white' : 'bg-slate-50 opacity-60'}`}
          >
            <div className="mb-3 flex items-baseline justify-between">
              <div>
                <h2 className="text-base font-medium text-slate-900">{c.name}</h2>
                <span className="text-xs text-slate-500">
                  {c.school.name}
                  {!c.isActive && ' · inactive'}
                </span>
              </div>
              <form action={toggleCriteriaActive}>
                <input type="hidden" name="id" value={c.id} />
                <button type="submit" className="text-xs text-slate-500 underline hover:text-slate-900">
                  {c.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </form>
            </div>
            {c.description && <p className="mb-3 text-sm text-slate-600">{c.description}</p>}

            <div className="mb-4 space-y-2">
              {c.performanceLevels.map((pl) => (
                <form
                  key={pl.id}
                  action={updatePerformanceLevel}
                  className={`flex flex-wrap items-end gap-2 border-t border-slate-100 pt-2 ${
                    pl.isActive ? '' : 'opacity-50'
                  }`}
                >
                  <input type="hidden" name="id" value={pl.id} />
                  <input
                    name="name"
                    defaultValue={pl.name}
                    className="w-40 rounded-md border border-slate-300 px-2 py-1 text-sm"
                  />
                  <input
                    name="points"
                    type="number"
                    defaultValue={pl.points}
                    className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm"
                  />
                  <button
                    type="submit"
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Save
                  </button>
                  <button
                    type="submit"
                    formAction={togglePerformanceLevelActive}
                    className="text-xs text-slate-500 underline hover:text-slate-900"
                  >
                    {pl.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </form>
              ))}
            </div>

            <form action={createPerformanceLevel} className="flex flex-wrap items-end gap-2">
              <input type="hidden" name="criteriaId" value={c.id} />
              <div>
                <label className="mb-1 block text-xs text-slate-500">New performance name</label>
                <input name="name" required className="rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Points</label>
                <input
                  name="points"
                  type="number"
                  required
                  className="w-24 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800"
              >
                Add
              </button>
            </form>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-dashed border-slate-300 p-5">
        <h2 className="mb-3 text-base font-medium text-slate-900">New criteria</h2>
        <form action={createCriteria} className="flex flex-wrap items-end gap-2">
          <div>
            <label className="mb-1 block text-xs text-slate-500">School</label>
            <select name="schoolId" className="rounded-md border border-slate-300 px-2 py-1.5 text-sm">
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Name</label>
            <input name="name" required className="rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Description (optional)</label>
            <input name="description" className="rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </div>
          <button type="submit" className="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800">
            Add criteria
          </button>
        </form>
      </div>
    </div>
  );
}
