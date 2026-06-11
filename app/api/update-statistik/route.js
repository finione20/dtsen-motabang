import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      jumlah_keluarga,
      jumlah_penduduk,
      desil_1,
      desil_2,
      desil_3,
      desil_4,
      desil_5,
      desil_6_10,
      belum_pemeringkatan,
    } = body;

    await query(
      `UPDATE statistik_desa SET
        jumlah_keluarga = $1,
        jumlah_penduduk = $2,
        desil_1 = $3,
        desil_2 = $4,
        desil_3 = $5,
        desil_4 = $6,
        desil_5 = $7,
        desil_6_10 = $8,
        belum_pemeringkatan = $9
      WHERE id = 1`,
      [
        jumlah_keluarga,
        jumlah_penduduk,
        desil_1,
        desil_2,
        desil_3,
        desil_4,
        desil_5,
        desil_6_10,
        belum_pemeringkatan,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Statistik berhasil diperbarui',
    });
  } catch (error) {
    console.error('❌ Error update-statistik:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan data statistik' },
      { status: 500 }
    );
  }
}