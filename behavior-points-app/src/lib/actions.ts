'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { createSession, destroySession, getSession, type Role } from '@/lib/session';

async function login(role: Role, email: string, password: string) {
  let user: { id: number; passwordHash: string; schoolId: number | null; isActive?: boolean } | null = null;

  if (role === 'admin') {
    user = await prisma.admin.findUnique({ where: { email } });
  } else if (role === 'staff') {
    user = await prisma.staff.findUnique({ where: { email } });
  } else {
    user = await prisma.student.findUnique({ where: { email } });
  }

  if (!user || !(await verifyPassword(password, user.passwordHash)) || user.isActive === false) {
    redirect(`/${role}/login?error=1`);
  }

  await createSession({ id: user.id, role, schoolId: user.schoolId, name: email });
  redirect(`/${role}`);
}

export async function loginAdmin(formData: FormData) {
  await login('admin', String(formData.get('email') ?? ''), String(formData.get('password') ?? ''));
}

export async function loginStaff(formData: FormData) {
  await login('staff', String(formData.get('email') ?? ''), String(formData.get('password') ?? ''));
}

export async function loginStudent(formData: FormData) {
  await login('student', String(formData.get('email') ?? ''), String(formData.get('password') ?? ''));
}

export async function logout() {
  const session = await getSession();
  const role = session?.role ?? 'admin';
  await destroySession();
  redirect(`/${role}/login`);
}
