import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const sql = `
      SELECT 
        id,
        nama,
        nik,
        no_kk,
        desil,
        status_padan,
        penerima_pkh,
        penerima_bpnt,
        penerima_bpjs_pbi,
        penerima_santunan_yatim,
        blts_kesra,
        sudah_kirim_foto_rumah,
        riwayat_desil,
        keterangan_lain
      FROM warga
      ORDER BY created_at DESC
      LIMIT 100
    `;

    const data = await query(sql);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('❌ Error di API get-warga:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { message: 'Metode POST tidak diizinkan' },
    { status: 405 }
  );
}