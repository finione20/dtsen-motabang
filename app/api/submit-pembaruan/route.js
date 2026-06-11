import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const formData = await request.formData();

    const no_kk = formData.get('no_kk');
    const nama_kk = formData.get('nama_kk');
    const no_wa = formData.get('no_wa');
    const latitude = formData.get('latitude');
    const longitude = formData.get('longitude');
    const accuracy = formData.get('accuracy');
    const fotoDepan = formData.get('foto_depan');
    const fotoBelakang = formData.get('foto_belakang');
    const fotoKK = formData.get('foto_kk');

    if (!no_kk || !nama_kk || !no_wa || !latitude || !longitude || !fotoDepan || !fotoBelakang || !fotoKK) {
      return NextResponse.json(
        { success: false, message: 'Semua field termasuk lokasi dan foto harus diisi' },
        { status: 400 }
      );
    }

    const fotoDepanBuffer = Buffer.from(await fotoDepan.arrayBuffer());
    const fotoBelakangBuffer = Buffer.from(await fotoBelakang.arrayBuffer());
    const fotoKKBuffer = Buffer.from(await fotoKK.arrayBuffer());

    const extDepan = fotoDepan.name?.split('.').pop() || 'jpg';
    const extBelakang = fotoBelakang.name?.split('.').pop() || 'jpg';
    const extKK = fotoKK.name?.split('.').pop() || 'jpg';

    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portal Desa Motabang" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `📝 Ajukan Pembaruan Desil – ${nama_kk} (KK: ${no_kk})`,
      html: `
        <h3 style="color:#047857;margin-bottom:12px">Pengajuan Pembaruan Desil</h3>

        <table style="border-collapse:collapse;font-size:14px;margin-bottom:20px">
          <tr>
            <td style="padding:6px 20px 6px 0;color:#64748b;font-weight:600">No. KK</td>
            <td style="padding:6px 0"><strong>${no_kk}</strong></td>
          </tr>
          <tr>
            <td style="padding:6px 20px 6px 0;color:#64748b;font-weight:600">Nama KK</td>
            <td style="padding:6px 0">${nama_kk}</td>
          </tr>
          <tr>
            <td style="padding:6px 20px 6px 0;color:#64748b;font-weight:600">No. WhatsApp</td>
            <td style="padding:6px 0">${no_wa}</td>
          </tr>
          <tr>
            <td style="padding:6px 20px 6px 0;color:#64748b;font-weight:600">Lintang</td>
            <td style="padding:6px 0;font-family:monospace">${latitude}</td>
          </tr>
          <tr>
            <td style="padding:6px 20px 6px 0;color:#64748b;font-weight:600">Bujur</td>
            <td style="padding:6px 0;font-family:monospace">${longitude}</td>
          </tr>
          ${accuracy ? `
          <tr>
            <td style="padding:6px 20px 6px 0;color:#64748b;font-weight:600">Akurasi GPS</td>
            <td style="padding:6px 0">±${accuracy} meter</td>
          </tr>` : ''}
        </table>

        <a href="${googleMapsUrl}" target="_blank"
          style="display:inline-flex;align-items:center;gap:6px;background:#059669;color:white;
                text-decoration:none;padding:9px 16px;border-radius:8px;font-size:13px;
                font-weight:600;margin-bottom:20px">
          📍 Buka Lokasi di Google Maps
        </a>

        <p style="color:#475569;font-size:13px;line-height:1.6;margin-top:4px">
          Terlampir: <strong>foto depan rumah</strong>, <strong>foto dalam rumah</strong>,
          dan <strong>foto Kartu Keluarga</strong>.<br/>
          Silakan input data warga secara manual di dashboard operator.
        </p>
      `,
      attachments: [
        {
          filename: `foto_depan_${no_kk}.${extDepan}`,
          content: fotoDepanBuffer,
        },
        {
          filename: `foto_dalam_${no_kk}.${extBelakang}`,
          content: fotoBelakangBuffer,
        },
        {
          filename: `foto_kk_${no_kk}.${extKK}`,
          content: fotoKKBuffer,
        },
      ],
    });

    console.log('✅ Email terkirim untuk KK:', no_kk);

    return NextResponse.json({
      success: true,
      message: 'Pengajuan berhasil dikirim. Operator akan memproses data Anda.',
    });
  } catch (error) {
    console.error('❌ Error submit-pembaruan:', error.message);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat mengirim data. Silakan coba lagi.' },
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