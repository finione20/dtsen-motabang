import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const rows = await query('SELECT * FROM statistik_desa WHERE id = $1 LIMIT 1', [1]);
    return NextResponse.json({ success: true, data: rows[0] || null });
  } catch (error) {
    console.error('❌ Error get-statistik:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat data statistik' },
      { status: 500 }
    );
  }
}