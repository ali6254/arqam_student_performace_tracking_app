'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Not authorized');
  }
}

export async function updateStudent(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get('id'));
  if (!id) return;

  await prisma.student.update({
    where: { id },
    data: {
      firstName: String(formData.get('firstName') ?? ''),
      middleName: String(formData.get('middleName') ?? '') || null,
      lastName: String(formData.get('lastName') ?? ''),
      birthday: formData.get('birthday') ? new Date(String(formData.get('birthday'))) : null,
      address: String(formData.get('address') ?? '') || null,
      email: String(formData.get('email') ?? ''),
      phoneNumber: String(formData.get('phoneNumber') ?? '') || null,
      parentPhoneNumber: String(formData.get('parentPhoneNumber') ?? '') || null,
    },
  });

  revalidatePath(`/admin/students/${id}`);
  revalidatePath('/admin/students');
}

export async function toggleStudentActive(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get('id'));
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) return;

  await prisma.student.update({ where: { id }, data: { isActive: !student.isActive } });
  revalidatePath(`/admin/students/${id}`);
  revalidatePath('/admin/students');
}
