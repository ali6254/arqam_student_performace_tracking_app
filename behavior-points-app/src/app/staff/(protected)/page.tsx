import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import GivePointsForm from '@/components/GivePointsForm';
import { submitPoints } from './actions';

export default async function StaffGivePointsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const { submitted } = await searchParams;
  const session = await getSession();
  if (!session) return null; // middleware already guards this route

  const [students, criteria, currentTerm] = await Promise.all([
    prisma.student.findMany({
      where: { schoolId: session.schoolId ?? undefined, isActive: true },
      orderBy: { lastName: 'asc' },
    }),
    prisma.criteria.findMany({
      where: { schoolId: session.schoolId ?? undefined, isActive: true },
      include: { performanceLevels: { where: { isActive: true } } },
      orderBy: { name: 'asc' },
    }),
    prisma.term.findFirst({
      where: { schoolId: session.schoolId ?? undefined, isCurrent: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-lg p-8">
      <h1 className="mb-6 text-xl font-medium text-slate-900">Give points</h1>

      {submitted && (
        <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Points submitted.</p>
      )}

      {!currentTerm && (
        <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">
          No current term is set for your school yet — ask an admin to mark one as current.
        </p>
      )}

      <GivePointsForm
        students={students}
        criteria={criteria}
        currentTermId={currentTerm?.id}
        currentTermName={currentTerm?.name}
        action={submitPoints}
      />
    </div>
  );
}
