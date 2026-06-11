import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { nik_kk } = body;

    console.log('📥 Request body:', body);
    console.log('🔍 NIK/KK input:', nik_kk);

    if (!nik_kk || nik_kk.trim() === '') {
      return NextResponse.json(
        { found: false, message: 'NIK atau KK harus diisi' },
        { status: 400 }
      );
    }

    const sql = `
      SELECT 
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
      WHERE nik = $1 OR no_kk = $2
      LIMIT 1
    `;

    console.log('🔎 Menjalankan query SQL...');
    const data = await query(sql, [nik_kk.trim(), nik_kk.trim()]);
    console.log('📊 Data hasil query:', data);

    if (data.length > 0) {
      console.log('✅ Data ditemukan:', data[0].nama);
      return NextResponse.json({
        found: true,
        data: data[0],
      });
    } else {
      console.log('❌ Data tidak ditemukan untuk NIK/KK:', nik_kk);
      return NextResponse.json(
        { found: false, message: 'Data warga tidak ditemukan' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('❌ Error di API cek-data:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    return NextResponse.json(
      {
        found: false,
        message: 'Terjadi kesalahan server',
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