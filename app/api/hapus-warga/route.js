import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID warga tidak valid' },
        { status: 400 }
      );
    }

    const deleteSql = 'DELETE FROM warga WHERE id = $1';
    await query(deleteSql, [id]);

    return NextResponse.json(
      {
        success: true,
        message: 'Data warga berhasil dihapus',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error di API hapus-warga:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat menghapus data',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Metode GET tidak diizinkan' },
    { status: 405 }
  );
}