import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const data = await request.json();

    const {
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
      keterangan_lain,
    } = data;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID warga tidak ditemukan' },
        { status: 400 }
      );
    }

    const updateSql = `
      UPDATE warga SET
        nama = $1,
        nik = $2,
        no_kk = $3,
        desil = $4,
        status_padan = $5,
        penerima_pkh = $6,
        penerima_bpnt = $7,
        penerima_bpjs_pbi = $8,
        penerima_santunan_yatim = $9,
        blts_kesra = $10,
        sudah_kirim_foto_rumah = $11,
        riwayat_desil = $12,
        keterangan_lain = $13,
        updated_at = NOW()
      WHERE id = $14
    `;

    await query(updateSql, [
      nama,
      nik,
      no_kk,
      desil,
      status_padan || null,
      !!penerima_pkh,
      !!penerima_bpnt,
      !!penerima_bpjs_pbi,
      !!penerima_santunan_yatim,
      !!blts_kesra,
      !!sudah_kirim_foto_rumah,
      riwayat_desil || null,
      keterangan_lain || null,
      id,
    ]);

    return NextResponse.json({
      success: true,
      message: 'Data warga berhasil diupdate',
    });
  } catch (error) {
    console.error('❌ Error di API update-warga:', error);
    console.error('Error message:', error.message);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengupdate data',
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