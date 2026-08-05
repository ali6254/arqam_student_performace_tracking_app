'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function submitPoints(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'staff') throw new Error('Not authorized');

  const studentId = Number(formData.get('studentId'));
  const termId = Number(formData.get('termId'));
  const performanceLevelId = Number(formData.get('performanceLevelId'));
  const note = String(formData.get('note') ?? '').trim() || null;

  const level = await prisma.performanceLevel.findUnique({ where: { id: performanceLevelId } });
  if (!level) throw new Error('Invalid performance level');

  await prisma.pointEntry.create({
    data: {
      studentId,
      staffId: session.id,
      performanceLevelId,
      termId,
      pointsAwarded: level.points, // snapshot at time of submission
      note,
    },
  });

  revalidatePath('/staff');
  redirect('/staff?submitted=1');
}
