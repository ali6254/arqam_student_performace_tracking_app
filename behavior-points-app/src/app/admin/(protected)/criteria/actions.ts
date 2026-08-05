'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Not authorized');
  }
  return session;
}

export async function createCriteria(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim() || null;
  const schoolId = Number(formData.get('schoolId'));
  if (!name || !schoolId) return;

  await prisma.criteria.create({ data: { name, description, schoolId } });
  revalidatePath('/admin/criteria');
}

export async function toggleCriteriaActive(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get('id'));
  const criteria = await prisma.criteria.findUnique({ where: { id } });
  if (!criteria) return;

  await prisma.criteria.update({ where: { id }, data: { isActive: !criteria.isActive } });
  revalidatePath('/admin/criteria');
}

export async function createPerformanceLevel(formData: FormData) {
  await requireAdmin();

  const criteriaId = Number(formData.get('criteriaId'));
  const name = String(formData.get('name') ?? '').trim();
  const points = Number(formData.get('points'));
  if (!criteriaId || !name || Number.isNaN(points)) return;

  await prisma.performanceLevel.create({ data: { criteriaId, name, points } });
  revalidatePath('/admin/criteria');
}

export async function updatePerformanceLevel(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get('id'));
  const name = String(formData.get('name') ?? '').trim();
  const points = Number(formData.get('points'));
  if (!id || !name || Number.isNaN(points)) return;

  // Note: this only changes the level going forward. Past point_entries keep
  // the points_awarded value that was snapshotted when they were submitted,
  // so editing a level never rewrites history.
  await prisma.performanceLevel.update({ where: { id }, data: { name, points } });
  revalidatePath('/admin/criteria');
}

export async function togglePerformanceLevelActive(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get('id'));
  const level = await prisma.performanceLevel.findUnique({ where: { id } });
  if (!level) return;

  await prisma.performanceLevel.update({ where: { id }, data: { isActive: !level.isActive } });
  revalidatePath('/admin/criteria');
}
