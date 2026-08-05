import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Every seeded account uses this password locally. Never do this in production —
// this file is for local development only.
const DEV_PASSWORD = 'password123';

async function main() {
  const hash = await bcrypt.hash(DEV_PASSWORD, 10);

  const issp = await prisma.school.upsert({
    where: { name: 'ISSP' },
    update: {},
    create: { name: 'ISSP' },
  });

  await prisma.school.upsert({
    where: { name: 'Arqm Academy' },
    update: {},
    create: { name: 'Arqm Academy' },
  });

  const term = await prisma.term.upsert({
    where: { schoolId_name: { schoolId: issp.id, name: 'Term 1 - 2025/2026' } },
    update: {},
    create: {
      schoolId: issp.id,
      name: 'Term 1 - 2025/2026',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2026-01-15'),
      isCurrent: true,
    },
  });

  const homework = await prisma.criteria.upsert({
    where: { schoolId_name: { schoolId: issp.id, name: 'Homework' } },
    update: {},
    create: { schoolId: issp.id, name: 'Homework', description: 'Quality and consistency of homework' },
  });

  const consistent = await prisma.performanceLevel.upsert({
    where: { criteriaId_name: { criteriaId: homework.id, name: 'Consistent' } },
    update: {},
    create: { criteriaId: homework.id, name: 'Consistent', points: 2 },
  });
  await prisma.performanceLevel.upsert({
    where: { criteriaId_name: { criteriaId: homework.id, name: 'Creative' } },
    update: {},
    create: { criteriaId: homework.id, name: 'Creative', points: 5 },
  });
  await prisma.performanceLevel.upsert({
    where: { criteriaId_name: { criteriaId: homework.id, name: 'Not doing well' } },
    update: {},
    create: { criteriaId: homework.id, name: 'Not doing well', points: -3 },
  });

  // update: passwordHash ensures this fixes the password even if the row already
  // exists with the placeholder hash from db/init/002_seed.sql
  await prisma.admin.upsert({
    where: { email: 'admin@issp.edu' },
    update: { passwordHash: hash },
    create: { email: 'admin@issp.edu', passwordHash: hash, schoolId: null },
  });

  const staff = await prisma.staff.upsert({
    where: { email: 'j.carter@issp.edu' },
    update: { passwordHash: hash },
    create: { firstName: 'John', lastName: 'Carter', email: 'j.carter@issp.edu', passwordHash: hash, schoolId: issp.id },
  });

  const student = await prisma.student.upsert({
    where: { email: 'ahmed.y@issp.edu' },
    update: { passwordHash: hash },
    create: {
      studentNumber: 'ISSP-1001',
      firstName: 'Ahmed',
      lastName: 'Youssef',
      email: 'ahmed.y@issp.edu',
      passwordHash: hash,
      schoolId: issp.id,
    },
  });

  // Note: this insert isn't idempotent — re-running the seed adds another
  // entry each time, the same way a real staff submission would.
  await prisma.pointEntry.create({
    data: {
      studentId: student.id,
      staffId: staff.id,
      performanceLevelId: consistent.id,
      termId: term.id,
      pointsAwarded: consistent.points,
    },
  });

  console.log('Seed complete. Dev password for every seeded account:', DEV_PASSWORD);
  console.log('Try: admin@issp.edu / j.carter@issp.edu / ahmed.y@issp.edu');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
