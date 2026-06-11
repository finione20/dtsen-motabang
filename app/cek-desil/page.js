// app/cek-desil/page.js
'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function CekDesil() {
  const [input, setInput] = useState('');
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setHasil(null);
    setShowReset(false);

    if (!input.trim()) {
      setError('Mohon masukkan NIK atau Nomor KK');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/cek-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nik_kk: input }),
      });

      const data = await response.json();

      if (response.ok && data.found) {
        setHasil(data.data);
        setShowReset(true);
      } else {
        setError(data.message || 'Data tidak ditemukan');
      }
    } catch {
      setError('Terjadi kesalahan pada server. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInput('');
    setHasil(null);
    setError('');
    setShowReset(false);
  };

  const desilColor = (desil) => {
    const d = parseInt(desil);
    if (d <= 3) return 'desil-badge desil-badge--low';
    if (d <= 6) return 'desil-badge desil-badge--mid';
    return 'desil-badge desil-badge--high';
  };

  const StatusPill = ({ value }) => (
    <span className={value ? 'status-pill status-pill--yes' : 'status-pill status-pill--no'}>
      {value ? 'Ya' : 'Tidak'}
    </span>
  );

  const rows = hasil ? [
    { label: 'Nama Lengkap',            value: hasil.nama },
    { label: 'NIK',                     value: hasil.nik },
    { label: 'Status Padan',            value: hasil.status_padan || '-' },
    { label: 'Riwayat Desil',           value: hasil.riwayat_desil || '-' },
    { label: 'Keterangan',              value: hasil.keterangan_lain || '-' },
  ] : [];

  const bantuanRows = hasil ? [
    { label: 'PKH',                     value: hasil.penerima_pkh },
    { label: 'BPNT / Sembako',          value: hasil.penerima_bpnt },
    { label: 'BPJS PBI',                value: hasil.penerima_bpjs_pbi },
    { label: 'Santunan Yatim Piatu',    value: hasil.penerima_santunan_yatim },
    { label: 'BLTS Kesra',              value: hasil.blts_kesra },
    { label: 'Sudah Kirim Foto Rumah',  value: hasil.sudah_kirim_foto_rumah },
  ] : [];

  return (
    <div className="cek-wrapper">

      {/* ── PAGE HEADER ── */}
      <div className="page-header">
        <div className="page-header-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <div>
          <h2 className="page-title">Cek Desil Warga</h2>
          <p className="page-subtitle">Masukkan NIK atau Nomor KK untuk melihat data desil</p>
        </div>
      </div>

      {/* ── FORM ── */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <label className="field-label">NIK atau Nomor KK</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/\D/g, ''))}
            placeholder="Contoh: 3201234567890001"
            maxLength={16}
            className="field-input-lg"
            autoComplete="off"
            inputMode="numeric"
          />
          <button
            type="submit"
            disabled={loading}
            className={`btn-submit${loading ? ' btn-submit--loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Sedang mencari...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Cek Sekarang
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="alert alert-error" style={{ marginTop: '16px' }}>
            Data tidak ditemukan. Pastikan NIK atau Nomor KK yang dimasukkan benar.
          </div>
        )}
      </div>

      {/* ── HASIL ── */}
      {hasil && (
        <>
          {/* Desil highlight */}
          <div className="desil-hero">
            <div className="desil-hero-left">
              <p className="desil-hero-label">Desil Kesejahteraan</p>
              <span className={desilColor(hasil.desil)}>Desil {hasil.desil}</span>
            </div>
            <div className="desil-hero-name">
              <p className="desil-hero-namelabel">Nama</p>
              <p className="desil-hero-namevalue">{hasil.nama}</p>
            </div>
          </div>

          {/* Data pokok */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="result-section-title">Data Pokok</div>
            {rows.map((row, i) => (
              <div key={i} className={`result-row${i % 2 === 1 ? ' result-row--alt' : ''}`}>
                <span className="result-row-label">{row.label}</span>
                <span className="result-row-value">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Bantuan sosial */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="result-section-title">Bantuan Sosial</div>
            {bantuanRows.map((row, i) => (
              <div key={i} className={`result-row${i % 2 === 1 ? ' result-row--alt' : ''}`}>
                <span className="result-row-label">{row.label}</span>
                <StatusPill value={row.value} />
              </div>
            ))}
          </div>

          {/* Reset */}
          <button onClick={handleReset} className="btn-reset">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            Cek NIK / KK Lain
          </button>
        </>
      )}

      {/* ── BACK ── */}
      <div style={{ textAlign: 'center', marginTop: '8px' }}>
        <Link href="/" className="back-link">
          ← Kembali ke Beranda
        </Link>
      </div>

    </div>
  );
}