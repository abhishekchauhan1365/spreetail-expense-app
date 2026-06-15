import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const logId = params.id;
    const log = await prisma.importLog.findUnique({
      where: { id: logId },
      include: {
        anomalies: { orderBy: { rowNumber: 'asc' } }
      }
    });

    if (!log) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }

    return NextResponse.json(log);
  } catch (error: any) {
    console.error('Import log error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
