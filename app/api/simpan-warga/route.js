import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const data = await request.json();

    const {
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

    const checkSql = 'SELECT id FROM warga WHERE nik = $1';
    const checkData = await query(checkSql, [nik]);

    if (checkData.length > 0) {
      const updateSql = `
        UPDATE warga SET
          nama = $1,
          no_kk = $2,
          desil = $3,
          status_padan = $4,
          penerima_pkh = $5,
          penerima_bpnt = $6,
          penerima_bpjs_pbi = $7,
          penerima_santunan_yatim = $8,
          blts_kesra = $9,
          sudah_kirim_foto_rumah = $10,
          riwayat_desil = $11,
          keterangan_lain = $12,
          updated_at = NOW()
        WHERE nik = $13
      `;

      await query(updateSql, [
        nama,
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
        nik,
      ]);

      return NextResponse.json({
        success: true,
        message: 'Data warga berhasil diupdate',
      });
    } else {
      const insertSql = `
        INSERT INTO warga (
          nama, nik, no_kk, desil, status_padan,
          penerima_pkh, penerima_bpnt, penerima_bpjs_pbi,
          penerima_santunan_yatim, blts_kesra,
          sudah_kirim_foto_rumah, riwayat_desil, keterangan_lain
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `;

      await query(insertSql, [
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
      ]);

      return NextResponse.json({
        success: true,
        message: 'Data warga berhasil disimpan',
      });
    }
  } catch (error) {
    console.error('❌ Error di API simpan-warga:', error);
    console.error('Error message:', error.message);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat menyimpan data',
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