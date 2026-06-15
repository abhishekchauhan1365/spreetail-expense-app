import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      include: {
        paidBy: true,
        splits: { include: { user: true } }
      },
      orderBy: { date: 'desc' }
    });

    const users = await prisma.user.findMany();
    
    // Calculate balances
    const balances: Record<string, { name: string; paid: number; owes: number; net: number }> = {};
    users.forEach(u => {
      balances[u.id] = { name: u.name, paid: 0, owes: 0, net: 0 };
    });

    expenses.forEach(exp => {
      if (exp.isSettlement) {
        // e.g., Rohan paid Aisha back (Rohan = paidBy, Aisha = split)
        if (balances[exp.paidById]) balances[exp.paidById].paid += exp.amount;
        if (exp.splits.length > 0) {
          const payee = exp.splits[0].userId;
          if (balances[payee]) balances[payee].owes += exp.amount;
        }
      } else {
        if (balances[exp.paidById]) {
          balances[exp.paidById].paid += exp.amount;
        }
        exp.splits.forEach(split => {
          if (balances[split.userId]) {
            balances[split.userId].owes += split.amountOwed;
          }
        });
      }
    });

    Object.keys(balances).forEach(id => {
      balances[id].net = balances[id].paid - balances[id].owes;
    });

    return NextResponse.json({
      balances: Object.values(balances),
      expenses
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
