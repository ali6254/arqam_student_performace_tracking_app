import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { createStudent } from './actions';

export default async function StudentsPage() {
  const [students, schools] = await Promise.all([
    prisma.student.findMany({ orderBy: { lastName: 'asc' }, include: { school: true } }),
    prisma.school.findMany({ orderBy: { id: 'asc' } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-10 p-8">
      <h1 className="text-xl font-medium text-slate-900">Students</h1>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Student #</th>
              <th className="px-4 py-2">School</th>
              <th className="px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-2">
                  <Link href={`/admin/students/${s.id}`} className="text-slate-900 hover:underline">
                    {s.lastName}, {s.firstName}
                  </Link>
                </td>
                <td className="px-4 py-2 text-slate-600">{s.studentNumber}</td>
                <td className="px-4 py-2 text-slate-600">{s.school.name}</td>
                <td className="px-4 py-2 text-slate-600">{s.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-dashed border-slate-300 p-5">
        <h2 className="mb-3 text-base font-medium text-slate-900">New student</h2>
        <form action={createStudent} className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-slate-500">School</label>
            <select name="schoolId" className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm">
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Student number</label>
            <input name="studentNumber" required className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">First name</label>
            <input name="firstName" required className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Middle name</label>
            <input name="middleName" className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Last name</label>
            <input name="lastName" required className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Birthday</label>
            <input name="birthday" type="date" className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Email</label>
            <input name="email" type="email" required className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Phone</label>
            <input name="phoneNumber" className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Parent phone</label>
            <input name="parentPhoneNumber" className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Address</label>
            <input name="address" className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-xs text-slate-500">Initial password</label>
            <input name="password" type="text" required className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </div>
          <div className="col-span-2">
            <button type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800">
              Add student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
