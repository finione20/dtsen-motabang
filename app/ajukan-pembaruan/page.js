/* eslint-disable react-hooks/static-components */
// app/ajukan-pembaruan/page.js
'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AjukanPembaruan() {
  const [formData, setFormData] = useState({ no_kk: '', nama_kk: '', no_wa: '' });
  const [fotoDepan,    setFotoDepan]    = useState(null);
  const [fotoBelakang, setFotoBelakang] = useState(null);
  const [fotoKK,       setFotoKK]       = useState(null);
  const [lokasi,       setLokasi]       = useState(null); // { lat, lng, accuracy }
  const [loadingLokasi, setLoadingLokasi] = useState(false);
  const [lokasiError,   setLokasiError]   = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Ukuran file maksimal 5MB'); return; }
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) { alert('Format file harus JPG atau PNG'); return; }
    setFile(file);
  };

  // ── Ambil lokasi GPS ──
  const handleAmbilLokasi = () => {
    if (!navigator.geolocation) {
      setLokasiError('Browser Anda tidak mendukung fitur lokasi.');
      return;
    }
    setLoadingLokasi(true);
    setLokasiError('');
    setLokasi(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLokasi({
          lat:      pos.coords.latitude.toFixed(7),
          lng:      pos.coords.longitude.toFixed(7),
          accuracy: Math.round(pos.coords.accuracy),
        });
        setLoadingLokasi(false);
      },
      (err) => {
        setLoadingLokasi(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLokasiError('Izin lokasi ditolak. Aktifkan izin lokasi di browser Anda.');
            break;
          case err.POSITION_UNAVAILABLE:
            setLokasiError('Informasi lokasi tidak tersedia. Coba lagi di luar ruangan.');
            break;
          case err.TIMEOUT:
            setLokasiError('Waktu permintaan lokasi habis. Coba lagi.');
            break;
          default:
            setLokasiError('Gagal mendapatkan lokasi. Coba lagi.');
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // ── Handle edit manual lat/lng ──
  const handleLokasiChange = (e) => {
    const { name, value } = e.target;
    setLokasi(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.no_kk || !formData.nama_kk || !formData.no_wa) {
      setError('Semua field harus diisi'); setLoading(false); return;
    }
    if (!fotoDepan || !fotoBelakang || !fotoKK) {
      setError('Foto depan, foto dalam, dan foto KK harus diupload'); setLoading(false); return;
    }
    if (!lokasi?.lat || !lokasi?.lng) {
      setError('Titik lokasi rumah harus diisi. Klik "Ambil Lokasi Saya" atau isi manual.'); setLoading(false); return;
    }
    const waPattern = /^08[0-9]{8,11}$/;
    if (!waPattern.test(formData.no_wa)) {
      setError('Nomor WhatsApp tidak valid (dimulai 08, 10–12 digit)'); setLoading(false); return;
    }

    const submitData = new FormData();
    submitData.append('no_kk',        formData.no_kk);
    submitData.append('nama_kk',      formData.nama_kk);
    submitData.append('no_wa',        formData.no_wa);
    submitData.append('latitude',     lokasi.lat);
    submitData.append('longitude',    lokasi.lng);
    submitData.append('accuracy',     lokasi.accuracy ?? '');
    submitData.append('foto_depan',   fotoDepan);
    submitData.append('foto_belakang', fotoBelakang);
    submitData.append('foto_kk',      fotoKK);

    try {
      const response = await fetch('/api/submit-pembaruan', { method: 'POST', body: submitData });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess('Data berhasil dikirim! Operator akan memproses dalam 1–3 hari kerja.');
        setFormData({ no_kk: '', nama_kk: '', no_wa: '' });
        setFotoDepan(null);
        setFotoBelakang(null);
        setFotoKK(null);
        setLokasi(null);
        setTimeout(() => setSuccess(''), 6000);
      } else {
        setError(data.message || 'Terjadi kesalahan saat mengirim data');
      }
    } catch {
      setError('Terjadi kesalahan pada server. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const FileUploadBox = ({ label, file, onChange, id }) => (
    <div className="upload-box">
      <label htmlFor={id} className="upload-box-inner">
        {file ? (
          <>
            <div className="upload-icon upload-icon--done">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <span className="upload-filename">{file.name}</span>
            <span className="upload-filesize">{(file.size / 1024).toFixed(0)} KB · Klik untuk ganti</span>
          </>
        ) : (
          <>
            <div className="upload-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <span className="upload-prompt">{label}</span>
            <span className="upload-hint">JPG / PNG · Maks. 5 MB</span>
          </>
        )}
      </label>
      <input
        id={id} type="file" accept="image/jpeg,image/jpg,image/png"
        onChange={onChange} style={{ display: 'none' }}
      />
    </div>
  );

  return (
    <div className="cek-wrapper">

      {/* ── PAGE HEADER ── */}
      <div className="page-header">
        <div className="page-header-icon page-header-icon--blue">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>
        <div>
          <h2 className="page-title">Ajukan Pembaruan Desil</h2>
          <p className="page-subtitle">Isi formulir, upload foto, dan tandai lokasi rumah</p>
        </div>
      </div>

      {/* ── INFO BOX ── */}
      <div className="info-strip info-strip--blue" style={{ marginBottom: '20px' }}>
        <div className="info-strip-title">📌 Petunjuk Pengisian</div>
        <ul className="info-list info-list--blue">
          <li>Isi Nomor KK dan Nama Kepala Keluarga dengan benar</li>
          <li>Foto tampak <strong>depan</strong> — pastikan pintu utama terlihat jelas</li>
          <li>Foto tampak <strong>dalam</strong> — pastikan area dalam rumah terlihat jelas</li>
          <li>Foto <strong>Kartu Keluarga</strong> — pastikan semua data terbaca jelas</li>
          <li>Klik <strong>"Ambil Lokasi Saya"</strong> untuk menandai titik koordinat rumah</li>
          <li>Nomor WhatsApp harus aktif untuk konfirmasi proses</li>
        </ul>
      </div>

      {/* ── FORM ── */}
      <div className="card">
        <form onSubmit={handleSubmit}>

          {/* Nomor KK */}
          <div className="field-group">
            <label className="field-label">Nomor KK <span className="field-required">*</span></label>
            <input
              type="text" name="no_kk" value={formData.no_kk}
              onChange={handleInputChange} placeholder="Contoh: 3201234567890001"
              maxLength={16} inputMode="numeric" autoComplete="off"
            />
          </div>

          {/* Nama KK */}
          <div className="field-group">
            <label className="field-label">Nama Kepala Keluarga <span className="field-required">*</span></label>
            <input
              type="text" name="nama_kk" value={formData.nama_kk}
              onChange={handleInputChange} placeholder="Contoh: Budi Santoso"
              autoComplete="off"
            />
          </div>

          {/* No WA */}
          <div className="field-group">
            <label className="field-label">Nomor WhatsApp Aktif <span className="field-required">*</span></label>
            <input
              type="tel" name="no_wa" value={formData.no_wa}
              onChange={handleInputChange} placeholder="Contoh: 081234567890"
              maxLength={13} inputMode="tel"
            />
          </div>

          {/* ── TITIK LOKASI ── */}
          <div className="field-group">
            <label className="field-label">
              Titik Lokasi Rumah <span className="field-required">*</span>
            </label>

            {/* Tombol ambil lokasi */}
            <button
              type="button"
              onClick={handleAmbilLokasi}
              disabled={loadingLokasi}
              className="btn-lokasi"
            >
              {loadingLokasi ? (
                <>
                  <span className="spinner spinner--dark" style={{ width: 15, height: 15, borderWidth: 2 }} />
                  Mengambil lokasi...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                    <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
                  </svg>
                  {lokasi ? 'Perbarui Lokasi' : 'Ambil Lokasi Saya'}
                </>
              )}
            </button>

            {/* Error lokasi */}
            {lokasiError && (
              <div className="alert alert-error" style={{ marginTop: 10, marginBottom: 0 }}>
                {lokasiError}
              </div>
            )}

            {/* Hasil lokasi + edit manual */}
            {lokasi && (
              <div className="lokasi-result">
                <div className="lokasi-result-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--emerald-600)', flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Lokasi berhasil diambil{lokasi.accuracy ? ` · Akurasi ±${lokasi.accuracy}m` : ''}</span>
                </div>

                <div className="lokasi-input-grid">
                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <label className="field-label" style={{ fontSize: 12 }}>Lintang (Latitude)</label>
                    <input
                      type="text" name="lat" value={lokasi.lat}
                      onChange={handleLokasiChange}
                      placeholder="-8.1234567"
                      style={{ marginBottom: 0, fontFamily: 'monospace', fontSize: 13 }}
                    />
                  </div>
                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <label className="field-label" style={{ fontSize: 12 }}>Bujur (Longitude)</label>
                    <input
                      type="text" name="lng" value={lokasi.lng}
                      onChange={handleLokasiChange}
                      placeholder="117.1234567"
                      style={{ marginBottom: 0, fontFamily: 'monospace', fontSize: 13 }}
                    />
                  </div>
                </div>

                {/* Link buka di Google Maps */}
                <a
                  href={`https://www.google.com/maps?q=${lokasi.lat},${lokasi.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lokasi-maps-link"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Lihat di Google Maps
                </a>
              </div>
            )}

            {/* Input manual jika belum ambil lokasi */}
            {!lokasi && (
              <div className="lokasi-manual">
                <p className="lokasi-manual-label">atau isi koordinat secara manual:</p>
                <div className="lokasi-input-grid">
                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <label className="field-label" style={{ fontSize: 12 }}>Lintang (Latitude)</label>
                    <input
                      type="text" name="lat"
                      value={lokasi?.lat ?? ''}
                      onChange={(e) => setLokasi(prev => ({ ...(prev || {}), lat: e.target.value }))}
                      placeholder="-8.1234567"
                      style={{ marginBottom: 0, fontFamily: 'monospace', fontSize: 13 }}
                    />
                  </div>
                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <label className="field-label" style={{ fontSize: 12 }}>Bujur (Longitude)</label>
                    <input
                      type="text" name="lng"
                      value={lokasi?.lng ?? ''}
                      onChange={(e) => setLokasi(prev => ({ ...(prev || {}), lng: e.target.value }))}
                      placeholder="117.1234567"
                      style={{ marginBottom: 0, fontFamily: 'monospace', fontSize: 13 }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Upload Foto Rumah */}
          <div className="upload-section">
            <p className="field-label" style={{ marginBottom: '12px' }}>
              Foto Rumah <span className="field-required">*</span>
            </p>
            <div className="upload-grid">
              <div>
                <p className="upload-label">Tampak Depan</p>
                <FileUploadBox
                  id="foto-depan" label="Upload foto depan" file={fotoDepan}
                  onChange={(e) => handleFileChange(e, setFotoDepan)}
                />
              </div>
              <div>
                <p className="upload-label">Tampak Dalam</p>
                <FileUploadBox
                  id="foto-dalam" label="Upload foto dalam" file={fotoBelakang}
                  onChange={(e) => handleFileChange(e, setFotoBelakang)}
                />
              </div>
            </div>
          </div>

          {/* Upload Foto KK */}
          <div className="upload-section">
            <p className="field-label" style={{ marginBottom: '12px' }}>
              Foto Kartu Keluarga <span className="field-required">*</span>
            </p>
            <div className="upload-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div>
                <p className="upload-label">Foto KK (pastikan semua data terbaca)</p>
                <FileUploadBox
                  id="foto-kk" label="Upload foto Kartu Keluarga" file={fotoKK}
                  onChange={(e) => handleFileChange(e, setFotoKK)}
                />
              </div>
            </div>
          </div>

          {/* Error & Success */}
          {error && (
            <div className="alert alert-error" style={{ marginTop: '4px', marginBottom: '16px' }}>
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" style={{ marginBottom: '16px' }}>
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            className={`btn-submit btn-submit--blue${loading ? ' btn-submit--loading' : ''}`}
          >
            {loading ? (
              <><span className="spinner" /> Sedang mengirim...</>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Kirim Pengajuan
              </>
            )}
          </button>

        </form>
      </div>

      <div style={{ textAlign: 'center', marginTop: '8px' }}>
        <Link href="/" className="back-link">← Kembali ke Beranda</Link>
      </div>

    </div>
  );
}