'use client';

import { useState } from 'react';

interface PerformanceLevel {
  id: number;
  name: string;
  points: number;
}

interface CriteriaOption {
  id: number;
  name: string;
  performanceLevels: PerformanceLevel[];
}

interface StudentOption {
  id: number;
  firstName: string;
  lastName: string;
  studentNumber: string;
}

export default function GivePointsForm({
  students,
  criteria,
  currentTermId,
  currentTermName,
  action,
}: {
  students: StudentOption[];
  criteria: CriteriaOption[];
  currentTermId: number | undefined;
  currentTermName: string | undefined;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [criteriaId, setCriteriaId] = useState<number | ''>(criteria[0]?.id ?? '');
  const selected = criteria.find((c) => c.id === criteriaId);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-slate-600">Student</label>
        <select name="studentId" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.lastName}, {s.firstName} ({s.studentNumber})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm text-slate-600">Term</label>
        <select
          name="termId"
          defaultValue={currentTermId}
          required
          disabled={!currentTermId}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {currentTermId && <option value={currentTermId}>{currentTermName} (current)</option>}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm text-slate-600">Criteria</label>
        <select
          value={criteriaId}
          onChange={(e) => setCriteriaId(Number(e.target.value))}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {criteria.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm text-slate-600">Performance</label>
        <select
          name="performanceLevelId"
          required
          key={selected?.id ?? 'none'}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {selected?.performanceLevels.map((pl) => (
            <option key={pl.id} value={pl.id}>
              {pl.name} ({pl.points > 0 ? `+${pl.points}` : pl.points})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm text-slate-600">Note (optional)</label>
        <input name="note" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </div>

      <button
        type="submit"
        disabled={!currentTermId}
        className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        Submit
      </button>
    </form>
  );
}
