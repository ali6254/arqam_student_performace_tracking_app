'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { hashPassword } from '@/lib/auth';

export async function createStudent(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Not authorized');

  const passwordHash = await hashPassword(String(formData.get('password') ?? ''));

  await prisma.student.create({
    data: {
      studentNumber: String(formData.get('studentNumber') ?? ''),
      firstName: String(formData.get('firstName') ?? ''),
      middleName: String(formData.get('middleName') ?? '') || null,
      lastName: String(formData.get('lastName') ?? ''),
      birthday: formData.get('birthday') ? new Date(String(formData.get('birthday'))) : null,
      address: String(formData.get('address') ?? '') || null,
      email: String(formData.get('email') ?? ''),
      phoneNumber: String(formData.get('phoneNumber') ?? '') || null,
      parentPhoneNumber: String(formData.get('parentPhoneNumber') ?? '') || null,
      passwordHash,
      schoolId: Number(formData.get('schoolId')),
    },
  });

  revalidatePath('/admin/students');
}
