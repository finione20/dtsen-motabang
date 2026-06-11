/* eslint-disable react-hooks/exhaustive-deps */
// app/dashboard-operator/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const EMPTY_FORM = {
  id: null, nama: '', nik: '', no_kk: '', desil: 'Desil 1', status_padan: '',
  penerima_pkh: false, penerima_bpnt: false, penerima_bpjs_pbi: false,
  penerima_santunan_yatim: false, blts_kesra: false,
  sudah_kirim_foto_rumah: false, riwayat_desil: '', keterangan_lain: ''
};

const EMPTY_STATISTIK = {
  jumlah_keluarga: 0, jumlah_penduduk: 0,
  desil_1: 0, desil_2: 0, desil_3: 0, desil_4: 0, desil_5: 0,
  desil_6_10: 0, belum_pemeringkatan: 0
};

const BANTUAN = [
  { name: 'penerima_pkh',            label: 'PKH' },
  { name: 'penerima_bpnt',           label: 'BPNT / Sembako' },
  { name: 'penerima_bpjs_pbi',       label: 'BPJS PBI' },
  { name: 'penerima_santunan_yatim', label: 'Santunan Yatim Piatu' },
  { name: 'blts_kesra',              label: 'BLTS Kesra' },
  { name: 'sudah_kirim_foto_rumah',  label: 'Sudah Kirim Foto Rumah' },
];

const STATISTIK_FIELDS = [
  { name: 'jumlah_keluarga',     label: 'Jumlah Keluarga' },
  { name: 'jumlah_penduduk',     label: 'Jumlah Penduduk' },
  { name: 'desil_1',             label: 'Jumlah Desil 1' },
  { name: 'desil_2',             label: 'Jumlah Desil 2' },
  { name: 'desil_3',             label: 'Jumlah Desil 3' },
  { name: 'desil_4',             label: 'Jumlah Desil 4' },
  { name: 'desil_5',             label: 'Jumlah Desil 5' },
  { name: 'desil_6_10',          label: 'Jumlah Desil 6–10' },
  { name: 'belum_pemeringkatan', label: 'Belum Pemeringkatan' },
];

export default function DashboardOperator() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggedIn, setLoggedIn]         = useState(false);
  const [username, setUsername]         = useState('');
  const [activeTab, setActiveTab]       = useState('input');

  // ── Warga ──
  const [isEditing, setIsEditing]   = useState(false);
  const [formData, setFormData]     = useState(EMPTY_FORM);
  const [loading, setLoading]       = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [wargaList, setWargaList]   = useState([]);
  const [search, setSearch]         = useState('');

  // ── Statistik ──
  const [statistikForm, setStatistikForm]       = useState(EMPTY_STATISTIK);
  const [loadingStatistik, setLoadingStatistik] = useState(false);
  const [statistikError, setStatistikError]     = useState('');
  const [statistikSuccess, setStatistikSuccess] = useState('');

  // ─────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('operator_token');
    const user  = localStorage.getItem('operator_username');
    if (!token) {
      setCheckingAuth(false);
      router.push('/login-operator');
    } else {
      setLoggedIn(true);
      setUsername(user);
      setCheckingAuth(false);
      loadWargaList();
      loadStatistik();
    }
  }, [router]);

  // ── Loader helpers ──
  const loadWargaList = async () => {
    try {
      const res  = await fetch('/api/get-warga');
      const data = await res.json();
      if (res.ok) setWargaList(data.data);
    } catch (e) { console.error(e); }
  };

  const loadStatistik = async () => {
    try {
      const res  = await fetch('/api/get-statistik');
      const data = await res.json();
      if (data.success && data.data) setStatistikForm(data.data);
    } catch (e) { console.error(e); }
  };

  // ── Statistik handlers ──
  const handleStatistikChange = (e) => {
    const { name, value } = e.target;
    setStatistikForm(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSimpanStatistik = async (e) => {
    e.preventDefault();
    setLoadingStatistik(true);
    setStatistikError('');
    setStatistikSuccess('');
    try {
      const res  = await fetch('/api/update-statistik', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statistikForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatistikSuccess('Data statistik berhasil disimpan!');
        setTimeout(() => setStatistikSuccess(''), 4000);
      } else {
        setStatistikError(data.message || 'Gagal menyimpan statistik');
      }
    } catch {
      setStatistikError('Terjadi kesalahan pada server.');
    } finally {
      setLoadingStatistik(false);
    }
  };

  // ── Warga handlers ──
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const resetForm = () => { setFormData(EMPTY_FORM); setIsEditing(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    if (!formData.nama || !formData.nik || !formData.no_kk) {
      setError('Nama, NIK, dan Nomor KK harus diisi');
      setLoading(false);
      return;
    }
    try {
      const url  = isEditing ? '/api/update-warga' : '/api/simpan-warga';
      const res  = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(isEditing ? 'Data warga berhasil diupdate!' : 'Data warga berhasil disimpan!');
        resetForm();
        loadWargaList();
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(data.message || 'Terjadi kesalahan saat menyimpan data');
      }
    } catch {
      setError('Terjadi kesalahan pada server. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (warga) => {
    setFormData({
      id: warga.id, nama: warga.nama, nik: warga.nik, no_kk: warga.no_kk,
      desil: warga.desil || '', status_padan: warga.status_padan || '',
      penerima_pkh: warga.penerima_pkh, penerima_bpnt: warga.penerima_bpnt,
      penerima_bpjs_pbi: warga.penerima_bpjs_pbi,
      penerima_santunan_yatim: warga.penerima_santunan_yatim,
      blts_kesra: warga.blts_kesra,
      sudah_kirim_foto_rumah: warga.sudah_kirim_foto_rumah,
      riwayat_desil: warga.riwayat_desil || '',
      keterangan_lain: warga.keterangan_lain || ''
    });
    setIsEditing(true);
    setActiveTab('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHapus = async (id, nama) => {
    if (!confirm(`Hapus data warga "${nama}"?`)) return;
    setDeletingId(id);
    try {
      const res  = await fetch('/api/hapus-warga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Data warga berhasil dihapus!');
        loadWargaList();
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(data.message || 'Gagal menghapus data');
      }
    } catch {
      setError('Terjadi kesalahan pada server.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('operator_token');
    localStorage.removeItem('operator_username');
    router.push('/login-operator');
  };

  // ── Derived ──
  const filteredWarga = wargaList.filter(w =>
    w.nama?.toLowerCase().includes(search.toLowerCase()) ||
    w.nik?.includes(search)
  );

  const desilClass = (desil) => {
    const d = parseInt(desil?.replace('Desil ', '') || 0);
    if (d <= 3) return 'desil-badge desil-badge--low';
    if (d <= 6) return 'desil-badge desil-badge--mid';
    return 'desil-badge desil-badge--high';
  };

  // ── Guards ──
  if (checkingAuth) return (
    <div className="dash-loading">
      <span className="spinner spinner--dark" style={{ width: 22, height: 22, borderWidth: 3 }} />
      Memuat dashboard...
    </div>
  );

  if (!loggedIn) return null;

  // ─────────────────────────────────────────
  return (
    <div className="dash-wrapper">

      {/* ── TOP BAR ── */}
      <div className="dash-topbar">
        <div className="dash-topbar-left">
          <div className="dash-topbar-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
          <div>
            <p className="dash-topbar-title">Dashboard Operator</p>
            <p className="dash-topbar-user">
              Halo, <strong>{username}</strong>
              {isEditing && <span className="dash-edit-badge">Mode Edit</span>}
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>

      {/* ── STATS BAR ── */}
      <div className="dash-stats">
        <div className="stat-card">
          <p className="stat-label">Total Warga</p>
          <p className="stat-value">{wargaList.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Penerima PKH</p>
          <p className="stat-value">{wargaList.filter(w => w.penerima_pkh).length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Penerima BPNT</p>
          <p className="stat-value">{wargaList.filter(w => w.penerima_bpnt).length}</p>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="dash-tabs">
        <button
          onClick={() => { setActiveTab('input'); resetForm(); }}
          className={`dash-tab${activeTab === 'input' ? ' dash-tab--active' : ''}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          {isEditing ? 'Edit Data' : 'Input Data'}
        </button>

        <button
          onClick={() => setActiveTab('list')}
          className={`dash-tab${activeTab === 'list' ? ' dash-tab--active' : ''}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          Daftar Warga
          <span className="dash-tab-badge">{wargaList.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('statistik')}
          className={`dash-tab${activeTab === 'statistik' ? ' dash-tab--active' : ''}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6"  y1="20" x2="6"  y2="14"/>
          </svg>
          Statistik Desa
        </button>
      </div>

      {/* ── TAB: INPUT / EDIT ── */}
      {activeTab === 'input' && (
        <div className="card">
          {isEditing && (
            <div className="dash-edit-banner">
              <div className="dash-edit-banner-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Sedang mengedit: <strong>{formData.nama}</strong>
              </div>
              <button onClick={resetForm} className="btn-cancel-edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Batal
              </button>
            </div>
          )}

          <p className="dash-section-title">
            {isEditing ? 'Edit Data Warga' : 'Input Data Warga Baru'}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="dash-form-grid">
              <div className="field-group">
                <label className="field-label">Nama Lengkap <span className="field-required">*</span></label>
                <input
                  type="text" name="nama" value={formData.nama}
                  onChange={handleInputChange} placeholder="Contoh: Budi Santoso"
                />
              </div>
              <div className="field-group">
                <label className="field-label">NIK <span className="field-required">*</span></label>
                <input
                  type="text" name="nik" value={formData.nik}
                  onChange={handleInputChange} placeholder="16 digit NIK"
                  maxLength={16} inputMode="numeric"
                />
              </div>
              <div className="field-group">
                <label className="field-label">Nomor KK <span className="field-required">*</span></label>
                <input
                  type="text" name="no_kk" value={formData.no_kk}
                  onChange={handleInputChange} placeholder="16 digit Nomor KK"
                  maxLength={16} inputMode="numeric"
                />
              </div>
              <div className="field-group">
                <label className="field-label">Desil <span className="field-required">*</span></label>
                <select name="desil" value={formData.desil || ''} onChange={handleInputChange}>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={`Desil ${i + 1}`}>Desil {i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="field-group" style={{ gridColumn: '1 / -1' }}>
                <label className="field-label">Status Padan (Sinkron Data Capil)</label>
                <input
                  type="text" name="status_padan" value={formData.status_padan}
                  onChange={handleInputChange} placeholder="Contoh: Sinkron / Belum Sinkron"
                />
              </div>
            </div>

            <div className="dash-bantuan-section">
              <p className="field-label" style={{ marginBottom: 12 }}>Penerima Bantuan</p>
              <div className="dash-checkbox-grid">
                {BANTUAN.map(({ name, label }) => (
                  <label key={name} className="dash-checkbox-item">
                    <input
                      type="checkbox" name={name} checked={formData[name]}
                      onChange={handleInputChange} className="dash-checkbox"
                    />
                    <span className="dash-checkbox-label">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Riwayat Desil</label>
              <textarea
                name="riwayat_desil" value={formData.riwayat_desil}
                onChange={handleInputChange}
                placeholder="Contoh: Desil 5 (2024) → Desil 4 (2025)" rows={3}
              />
            </div>
            <div className="field-group">
              <label className="field-label">Keterangan Lain</label>
              <textarea
                name="keterangan_lain" value={formData.keterangan_lain}
                onChange={handleInputChange}
                placeholder="Keterangan tambahan jika ada" rows={3}
              />
            </div>

            {error   && <div className="alert alert-error"   style={{ marginBottom: 16 }}>{error}</div>}
            {success && <div className="alert alert-success" style={{ marginBottom: 16 }}>{success}</div>}

            <button
              type="submit" disabled={loading}
              className={`btn-submit${isEditing ? ' btn-submit--blue' : ' btn-submit--slate'}${loading ? ' btn-submit--loading' : ''}`}
            >
              {loading ? (
                <><span className="spinner spinner--dark" /> {isEditing ? 'Mengupdate...' : 'Menyimpan...'}</>
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  {isEditing ? 'Update Data Warga' : 'Simpan Data Warga'}
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ── TAB: DAFTAR WARGA ── */}
      {activeTab === 'list' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 18px 14px' }}>
            <p className="dash-section-title" style={{ marginBottom: 12 }}>Daftar Warga</p>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama atau NIK..." style={{ marginBottom: 0 }}
            />
          </div>

          {success && <div className="alert alert-success" style={{ margin: '0 18px 14px' }}>{success}</div>}
          {error   && <div className="alert alert-error"   style={{ margin: '0 18px 14px' }}>{error}</div>}

          {filteredWarga.length === 0 ? (
            <div className="dash-empty">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--slate-300)', marginBottom: 10 }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              {search ? 'Tidak ada hasil untuk pencarian ini' : 'Belum ada data warga'}
            </div>
          ) : (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Nama</th><th>NIK</th><th>Desil</th>
                    <th>PKH</th><th>BPNT</th><th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWarga.map((w, i) => (
                    <tr key={w.id || i}>
                      <td className="dash-td-name">{w.nama}</td>
                      <td className="dash-td-mono">{w.nik}</td>
                      <td>
                        <span className={desilClass(w.desil)} style={{ fontSize: 12, padding: '2px 10px' }}>
                          {w.desil}
                        </span>
                      </td>
                      <td>
                        <span className={w.penerima_pkh ? 'status-pill status-pill--yes' : 'status-pill status-pill--no'}>
                          {w.penerima_pkh ? 'Ya' : '-'}
                        </span>
                      </td>
                      <td>
                        <span className={w.penerima_bpnt ? 'status-pill status-pill--yes' : 'status-pill status-pill--no'}>
                          {w.penerima_bpnt ? 'Ya' : '-'}
                        </span>
                      </td>
                      <td>
                        <div className="dash-action-btns">
                          <button onClick={() => handleEdit(w)} className="btn-action btn-action--edit">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleHapus(w.id, w.nama)}
                            disabled={deletingId === w.id}
                            className="btn-action btn-action--hapus"
                          >
                            {deletingId === w.id ? (
                              <span className="spinner" style={{ width: 11, height: 11, borderWidth: 2 }} />
                            ) : (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6"/><path d="M14 11v6"/>
                                <path d="M9 6V4h6v2"/>
                              </svg>
                            )}
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: STATISTIK DESA ── */}
      {activeTab === 'statistik' && (
        <div className="card">
          <p className="dash-section-title">Edit Statistik Desa Motabang</p>
          <p className="dash-statistik-desc">
            Data ini akan ditampilkan di halaman beranda publik.
          </p>

          {/* Preview nilai saat ini */}
          <div className="dash-statistik-preview">
            {STATISTIK_FIELDS.map(({ name, label }) => (
              <div key={name} className="dash-statistik-preview-item">
                <span className="dash-statistik-preview-val">
                  {(statistikForm[name] ?? 0).toLocaleString('id-ID')}
                </span>
                <span className="dash-statistik-preview-lbl">{label}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSimpanStatistik}>
            <div className="dash-statistik-grid">
              {STATISTIK_FIELDS.map(({ name, label }) => (
                <div className="field-group" key={name}>
                  <label className="field-label">{label}</label>
                  <input
                    type="number"
                    name={name}
                    value={statistikForm[name]}
                    onChange={handleStatistikChange}
                    min={0}
                    inputMode="numeric"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>

            {statistikError   && <div className="alert alert-error"   style={{ marginBottom: 16 }}>{statistikError}</div>}
            {statistikSuccess && <div className="alert alert-success" style={{ marginBottom: 16 }}>{statistikSuccess}</div>}

            <button
              type="submit" disabled={loadingStatistik}
              className={`btn-submit btn-submit--slate${loadingStatistik ? ' btn-submit--loading' : ''}`}
            >
              {loadingStatistik ? (
                <><span className="spinner spinner--dark" /> Menyimpan...</>
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  Simpan Statistik
                </>
              )}
            </button>
          </form>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <Link href="/" className="back-link">← Kembali ke Beranda</Link>
      </div>

    </div>
  );
}