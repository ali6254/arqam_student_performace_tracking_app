import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

interface TotalRow {
  student_number: string;
  first_name: string;
  last_name: string;
  total_points: number;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ termId: string }> }) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  const { termId } = await params;
  const termIdNum = Number(termId);

  const term = await prisma.term.findUnique({
    where: { id: termIdNum },
    include: { school: true },
  });
  if (!term) {
    return NextResponse.json({ error: 'Term not found' }, { status: 404 });
  }

  const totals = await prisma.$queryRaw<TotalRow[]>`
    SELECT student_number, first_name, last_name, total_points
    FROM student_term_totals
    WHERE term_id = ${termIdNum}
    ORDER BY total_points DESC
  `;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(term.name.slice(0, 31));

  sheet.columns = [
    { header: 'Student #', key: 'studentNumber', width: 16 },
    { header: 'First name', key: 'firstName', width: 18 },
    { header: 'Last name', key: 'lastName', width: 18 },
    { header: 'Total points', key: 'totalPoints', width: 14 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const row of totals) {
    sheet.addRow({
      studentNumber: row.student_number,
      firstName: row.first_name,
      lastName: row.last_name,
      totalPoints: row.total_points,
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const safeName = `${term.school.name}-${term.name}-points`.replace(/[^a-z0-9-]+/gi, '_');

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${safeName}.xlsx"`,
    },
  });
}
