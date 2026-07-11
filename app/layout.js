/* eslint-disable @next/next/no-page-custom-font */
// app/layout.js
import './globals.css';

export const metadata = {
  title: 'DTSEN Desa Motabang',
  description: 'Portal pelayanan publik digital Desa Motabang — pengecekan dan pembaruan data desil warga.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6328560337270481"
     crossorigin="anonymous"></script>
      </head>
      <body>

        {/* ── HEADER ── */}
        <header className="site-header">
          <div className="header-inner">
            <div className="header-brand">
              <div className="header-logo-mark">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div>
                <span className="header-name">Desa Motabang</span>
                <span className="header-sub">Kec. Lolak · Kab. Bolaang Mongondow · Sulawesi Utara</span>
              </div>
            </div>
            <div className="header-badge">DTSEN</div>
          </div>
        </header>

        {/* ── MAIN ── */}
        <main className="site-main">
          {children}
        </main>

        {/* ── FOOTER ── */}
        <footer className="site-footer">
          <div className="footer-inner">
            <p className="footer-copy">© 2026 Desa Motabang. Semua hak dilindungi.</p>
            <p className="footer-note">Portal Pelayanan Publik Digital · DTSEN</p>
          </div>
        </footer>

      </body>
    </html>
  );
}