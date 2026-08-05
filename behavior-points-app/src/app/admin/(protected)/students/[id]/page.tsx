import { prisma } from '@/lib/prisma';
import { toggleStudentActive, updateStudent } from './actions';

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

function toDateInputValue(d: Date | null) {
  if (!d) return '';
  return d.toISOString().slice(0, 10);
}

export default async function AdminStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const studentId = Number(id);

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) {
    return <p className="p-8 text-sm text-slate-500">Student not found.</p>;
  }

  const totals = await prisma.$queryRaw<TotalRow[]>`
    SELECT term_id, term_name, total_points
    FROM student_term_totals
    WHERE student_id = ${studentId}
    ORDER BY term_id DESC
  `;

  const currentTotal = totals[0];

  const history = currentTotal
    ? await prisma.$queryRaw<HistoryRow[]>`
        SELECT entry_id, criteria_name, performance_name, points_awarded, awarded_by, note, created_at
        FROM student_point_history
        WHERE student_id = ${studentId} AND term_id = ${currentTotal.term_id}
        ORDER BY created_at DESC
      `
    : [];

  return (
    <div className="mx-auto max-w-2xl space-y-10 p-8">
      <div>
        <div className="mb-1 flex items-center gap-3">
          <h1 className="text-xl font-medium text-slate-900">
            {student.firstName} {student.lastName}
          </h1>
          {!student.isActive && (
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">Inactive</span>
          )}
        </div>
        <p className="text-sm text-slate-500">{student.studentNumber}</p>
      </div>

      <div>
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

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-medium text-slate-900">Edit student</h2>
          <form action={toggleStudentActive}>
            <input type="hidden" name="id" value={student.id} />
            <button type="submit" className="text-xs text-slate-500 underline hover:text-slate-900">
              {student.isActive ? 'Deactivate student' : 'Activate student'}
            </button>
          </form>
        </div>

        <form action={updateStudent} className="grid grid-cols-2 gap-3">
          <input type="hidden" name="id" value={student.id} />
          <div>
            <label className="mb-1 block text-xs text-slate-500">First name</label>
            <input
              name="firstName"
              defaultValue={student.firstName}
              required
              className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Middle name</label>
            <input
              name="middleName"
              defaultValue={student.middleName ?? ''}
              className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Last name</label>
            <input
              name="lastName"
              defaultValue={student.lastName}
              required
              className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Birthday</label>
            <input
              name="birthday"
              type="date"
              defaultValue={toDateInputValue(student.birthday)}
              className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={student.email}
              required
              className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Phone</label>
            <input
              name="phoneNumber"
              defaultValue={student.phoneNumber ?? ''}
              className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Parent phone</label>
            <input
              name="parentPhoneNumber"
              defaultValue={student.parentPhoneNumber ?? ''}
              className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Address</label>
            <input
              name="address"
              defaultValue={student.address ?? ''}
              className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div className="col-span-2">
            <button type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
