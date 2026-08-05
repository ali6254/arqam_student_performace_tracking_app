'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { hashPassword } from '@/lib/auth';

export async function toggleStaffActive(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Not authorized');

  const id = Number(formData.get('id'));
  const staff = await prisma.staff.findUnique({ where: { id } });
  if (!staff) return;

  await prisma.staff.update({ where: { id }, data: { isActive: !staff.isActive } });
  revalidatePath('/admin/staff');
}

export async function createStaff(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Not authorized');

  const passwordHash = await hashPassword(String(formData.get('password') ?? ''));

  await prisma.staff.create({
    data: {
      firstName: String(formData.get('firstName') ?? ''),
      lastName: String(formData.get('lastName') ?? ''),
      email: String(formData.get('email') ?? ''),
      passwordHash,
      schoolId: Number(formData.get('schoolId')),
    },
  });

  revalidatePath('/admin/staff');
}
