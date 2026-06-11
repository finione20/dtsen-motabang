'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [statistik, setStatistik] = useState(null);
  const [loadingStat, setLoadingStat] = useState(true);

  useEffect(() => {
    fetch('/api/get-statistik')
      .then(res => res.json())
      .then(data => {
        if (data.success) setStatistik(data.data);
      })
      .catch(console.error)
      .finally(() => setLoadingStat(false));
  }, []);

  const statItems = statistik ? [
    { label: 'Jumlah Keluarga',      value: statistik.jumlah_keluarga,    color: 'stat-item--teal'  },
    { label: 'Jumlah Penduduk',       value: statistik.jumlah_penduduk,    color: 'stat-item--teal'  },
    { label: 'Desil 1',               value: statistik.desil_1,            color: 'stat-item--red'   },
    { label: 'Desil 2',               value: statistik.desil_2,            color: 'stat-item--red'   },
    { label: 'Desil 3',               value: statistik.desil_3,            color: 'stat-item--orange'},
    { label: 'Desil 4',               value: statistik.desil_4,            color: 'stat-item--orange'},
    { label: 'Desil 5',               value: statistik.desil_5,            color: 'stat-item--yellow'},
    { label: 'Desil 6–10',            value: statistik.desil_6_10,         color: 'stat-item--green' },
    { label: 'Belum Pemeringkatan',   value: statistik.belum_pemeringkatan,color: 'stat-item--gray'  },
  ] : [];

  return (
    <div className="home-wrapper">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-badge">
          <span className="badge-dot" />
          Sistem Informasi Desa Motabang
        </div>
        <h1 className="hero-title">
          Pengecekan DTSEN<br />
          <span className="hero-title-accent">Desa Motabang</span>
        </h1>
        <p className="hero-subtitle">
          Cek data desil kesejahteraan Anda secara cepat, mudah, dan transparan.
          Layanan digital resmi Desa Motabang.
        </p>
        <div className="hero-cta">
          <Link href="/cek-desil" className="btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            Cek Desil Saya
          </Link>
          <Link href="/ajukan-pembaruan" className="btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Ajukan Pembaruan
          </Link>
        </div>
      </section>

      {/* ── STATISTIK DESA ── */}
      <section className="section">
        <p className="section-label">Data Kependudukan Desa Motabang</p>
        {loadingStat ? (
          <div className="stat-loading">Memuat data statistik...</div>
        ) : (
          <div className="stat-grid">
            {statItems.map(({ label, value, color }) => (
              <div key={label} className={`stat-item ${color}`}>
                <p className="stat-item-value">{value?.toLocaleString('id-ID') ?? '–'}</p>
                <p className="stat-item-label">{label}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── LAYANAN CARDS ── */}
      <section className="section">
        <p className="section-label">Layanan Utama</p>
        <div className="card-grid">
          <Link href="/cek-desil" className="service-card service-card--green">
            <div className="service-icon service-icon--green">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <div>
              <h3 className="service-title">Cek Desil</h3>
              <p className="service-desc">Cek data desil Anda menggunakan NIK atau Nomor KK</p>
            </div>
            <span className="service-arrow">→</span>
          </Link>
          <Link href="/ajukan-pembaruan" className="service-card service-card--blue">
            <div className="service-icon service-icon--blue">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </div>
            <div>
              <h3 className="service-title">Ajukan Pembaruan</h3>
              <p className="service-desc">Upload foto rumah untuk perbarui data desil Anda</p>
            </div>
            <span className="service-arrow">→</span>
          </Link>
          <Link href="/login-operator" className="service-card service-card--slate">
            <div className="service-icon service-icon--slate">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div>
              <h3 className="service-title">Login Operator</h3>
              <p className="service-desc">Akses khusus operator desa untuk input data warga</p>
            </div>
            <span className="service-arrow">→</span>
          </Link>
        </div>
      </section>

      {/* ── INFO STRIP ── */}
      <section className="info-strip">
        <div className="info-strip-title">📌 Informasi Penting</div>
        <ul className="info-list">
          <li>Data desil digunakan untuk penentuan bantuan sosial</li>
          <li>Foto rumah harus jelas — tampak depan &amp; Dalam Rumah</li>
          <li>Operator memproses data dalam <strong>1–3 hari kerja</strong></li>
          <li>Pertanyaan? Hubungi kantor desa</li>
        </ul>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-logo">🏛️ Desa Motabang</div>
        <p className="footer-text">
          Portal Pelayanan Publik Digital &nbsp;·&nbsp; DTSEN {new Date().getFullYear()}
        </p>
      </footer>

    </div>
  );
}