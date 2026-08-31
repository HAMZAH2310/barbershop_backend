const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Product Requirement Document (PRD) - Barbershop Management & Real-time Queue System</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
      @bottom-right {
        content: counter(page);
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1e293b;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }

    /* Cover Page */
    .cover-page {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 240mm;
      padding: 20mm 10mm 10mm 10mm;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: linear-gradient(145deg, #0f172a 0%, #1e293b 60%, #0f172a 100%);
      color: #ffffff;
    }

    .cover-badge {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: #38bdf8;
      border-radius: 20px;
      font-size: 10pt;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 25px;
    }

    .cover-title {
      font-size: 32pt;
      font-weight: 800;
      line-height: 1.15;
      margin: 0 0 15px 0;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-subtitle {
      font-size: 15pt;
      color: #94a3b8;
      font-weight: 400;
      margin: 0 0 35px 0;
      max-width: 90%;
      line-height: 1.4;
    }

    .cover-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      background: rgba(255, 255, 255, 0.05);
      padding: 20px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: 30px;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
    }

    .meta-label {
      font-size: 8.5pt;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin-bottom: 4px;
    }

    .meta-val {
      font-size: 11pt;
      font-weight: 600;
      color: #f1f5f9;
    }

    .cover-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9pt;
      color: #64748b;
    }

    /* Content Layout */
    .page-break {
      page-break-after: always;
    }

    .avoid-break {
      page-break-inside: avoid;
    }

    h1, h2, h3, h4 {
      color: #0f172a;
      font-weight: 700;
    }

    h1 {
      font-size: 19pt;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 8px;
      margin-top: 25px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }

    h2 {
      font-size: 14pt;
      color: #0369a1;
      margin-top: 20px;
      margin-bottom: 10px;
      border-left: 4px solid #0284c7;
      padding-left: 10px;
    }

    h3 {
      font-size: 11.5pt;
      color: #1e293b;
      margin-top: 14px;
      margin-bottom: 6px;
    }

    p {
      margin: 0 0 10px 0;
      text-align: justify;
    }

    ul, ol {
      margin: 0 0 12px 0;
      padding-left: 20px;
    }

    li {
      margin-bottom: 5px;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 18px 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }

    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: left;
    }

    th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 8.5pt;
      letter-spacing: 0.03em;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    /* Badges & Tags */
    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 8pt;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-get { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    .badge-post { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .badge-put { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
    .badge-patch { background: #ffedd5; color: #c2410c; border: 1px solid #fed7aa; }
    .badge-del { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
    .badge-auth { background: #f3e8ff; color: #7e22ce; border: 1px solid #e9d5ff; }

    /* Code Blocks */
    code {
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 8.5pt;
      background-color: #f1f5f9;
      padding: 2px 5px;
      border-radius: 4px;
      color: #0f172a;
    }

    pre {
      background-color: #0f172a;
      color: #f8fafc;
      padding: 12px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 8pt;
      overflow-x: hidden;
      margin: 10px 0 15px 0;
      page-break-inside: avoid;
      line-height: 1.4;
    }

    /* Cards & Callouts */
    .callout {
      background-color: #f0fdf4;
      border-left: 4px solid #22c55e;
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      margin: 12px 0;
      font-size: 9.5pt;
    }

    .callout-info {
      background-color: #f0f9ff;
      border-left: 4px solid #0284c7;
    }

    .callout-warning {
      background-color: #fffbeb;
      border-left: 4px solid #f59e0b;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin: 12px 0;
      page-break-inside: avoid;
    }

    .card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }

    .card-title {
      font-weight: 700;
      color: #0369a1;
      margin-bottom: 6px;
      font-size: 10pt;
    }

    .status-pill {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 8pt;
      font-weight: 600;
      display: inline-block;
    }
    .status-available { background: #dcfce7; color: #166534; }
    .status-working { background: #dbeafe; color: #1e40af; }
    .status-break { background: #fee2e2; color: #991b1b; }

    /* Header in Content Pages */
    .header-bar {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-bottom: 15px;
      font-size: 8.5pt;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-page">
    <div>
      <div class="cover-badge">Product Requirement Document (PRD)</div>
      <div class="cover-title">Barbershop Management &amp; Real-Time Queue POS System</div>
      <div class="cover-subtitle">Spesifikasi Lengkap Arsitektur, Kebutuhan Fungsional &amp; Teknis Frontend, Backend, Payment Gateway Midtrans, dan Real-time WebSocket</div>
    </div>

    <div>
      <div class="cover-meta-grid">
        <div class="meta-item">
          <span class="meta-label">Nama Dokumen</span>
          <span class="meta-val">PRD-BARBERSHOP-SYS-2026</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Versi Sistem</span>
          <span class="meta-val">v1.0.0 Production Ready</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Tech Stack Backend</span>
          <span class="meta-val">Node.js, Express, Prisma ORM, PostgreSQL</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Tech Stack Frontend</span>
          <span class="meta-val">Next.js / React, Tailwind CSS, Socket.IO</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Integrasi Pihak Ketiga</span>
          <span class="meta-val">Midtrans Snap, Cloudinary, Nodemailer</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Status &amp; Akses</span>
          <span class="meta-val">Approved Technical Specification</span>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <span>Barbershop System Engineering Team</span>
      <span>Dokumen Resmi Spesifikasi Produk</span>
    </div>
  </div>

  <!-- TABLE OF CONTENTS / SUMMARY -->
  <div class="header-bar">
    <span>PRD: Barbershop Management &amp; Queue POS System</span>
    <span>Daftar Isi &amp; Ringkasan Eksekutif</span>
  </div>

  <h1>1. Ringkasan Eksekutif (Executive Summary)</h1>
  
  <h2>1.1 Latar Belakang &amp; Deskripsi Produk</h2>
  <p>
    Sistem <strong>Barbershop Management &amp; Real-time Queue System</strong> adalah platform digital terintegrasi 
    yang menghubungkan operasional barbershop fisik dengan pengalaman digital pelanggan secara <em>seamless</em>. 
    Aplikasi ini menyelesaikan masalah klasik industri potong rambut tradisional seperti antrean yang tidak transparan, 
    pembayaran yang tidak terintegrasi, kalkulasi pendapatan manual, serta absensi dan ketersediaan kapster (barber) yang sulit dilacak.
  </p>
  <p>
    Platform ini mengusung arsitektur <em>modern decoupled client-server</em> dengan backend berbasis <strong>Express.js &amp; Prisma ORM (PostgreSQL)</strong>, 
    dan frontend interaktif responsif berbasis <strong>Next.js / React</strong>, dilengkapi kemampuan <strong>Real-time WebSocket (Socket.IO)</strong> 
    untuk pembaruan antrean dan analitik pendapatan kasir seketika, serta integrasi payment gateway <strong>Midtrans (Snap &amp; Core API Webhook)</strong>.
  </p>

  <h2>1.2 Tujuan &amp; Key Performance Indicators (KPI)</h2>
  <div class="card-grid">
    <div class="card">
      <div class="card-title">Tujuan Bisnis</div>
      <ul>
        <li>Mengurangi waktu tunggu fisik pelanggan hingga 40% dengan sistem nomor antrean digital transparan.</li>
        <li>Mencegah <em>revenue leakage</em> dengan otomatisasi invoice dan pencatatan transaksi POS kasir.</li>
        <li>Menyediakan opsi pembayaran digital non-tunai (QRIS, VA, E-Wallet, Kartu) melalui Midtrans.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title">Target Teknis</div>
      <ul>
        <li>Latensi notifikasi update pendapatan via WebSocket &lt; 200ms.</li>
        <li>Tingkat keberhasilan verifikasi email registrasi &gt; 99% dengan JWT &amp; SMTP.</li>
        <li>Integritas data transaksi keuangan dengan Prisma Database Transaction atomicity.</li>
      </ul>
    </div>
  </div>

  <h2>1.3 User Personas &amp; Stakeholder</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 20%;">Peran (Role)</th>
        <th style="width: 35%;">Kebutuhan Utama</th>
        <th style="width: 45%;">Fitur yang Diakses</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Customer (Pelanggan)</strong></td>
        <td>Melihat katalog layanan, memilih kapster, booking antrean, memantau posisi antrean secara live, membayar online/offline.</td>
        <td>Portal Publik/Customer: Katalog Layanan, Profil Barber, Create Order, Live Queue Tracker, Pembayaran Midtrans Snap, Riwayat Invoice.</td>
      </tr>
      <tr>
        <td><strong>Admin / Kasir (Staff)</strong></td>
        <td>Mengelola status antrean dan kapster, POS kasir (pembayaran tunai + kembalian), manajemen layanan, live revenue dashboard.</td>
        <td>Admin Dashboard: Manajemen Barber, Manajemen Service &amp; Media Upload, Kasir POS &amp; Invoice, Monitoring Real-time Revenue WebSocket.</td>
      </tr>
      <tr>
        <td><strong>Barber (Kapster)</strong></td>
        <td>Menerima giliran pelanggan, mengubah status kerja (Available, Working, On Break).</td>
        <td>Daftar antrean aktif kapster, sistem auto-advance antrean ketika servis selesai.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- ARCHITECTURE & TECH STACK -->
  <div class="header-bar">
    <span>PRD: Barbershop Management &amp; Queue POS System</span>
    <span>Arsitektur Sistem &amp; Database</span>
  </div>

  <h1>2. Arsitektur Sistem &amp; Teknologi</h1>

  <h2>2.1 Diagram Arsitektur Komponen</h2>
  <pre>
┌──────────────────────────────────────────────────────────────────────────┐
│                             FRONTEND LAYER                               │
│       Next.js / React (Customer Portal &amp; Admin POS/Analytics App)         │
│  - Tailwind CSS Styling          - Socket.io Client (Live Events)        │
│  - Midtrans Snap.js Popup SDK    - Cookie-based Auth Client              │
└───────────────────▲──────────────────────────────────▲───────────────────┘
                    │ REST API (JSON / Cookies)        │ WebSocket (WSS)
                    │ (HttpOnly JWT Auth)              │ (Real-time events)
┌───────────────────▼──────────────────────────────────▼───────────────────┐
│                              BACKEND LAYER                               │
│                     Express.js &amp; TypeScript Engine                       │
│  - Auth Middleware &amp; Verification  - Order &amp; Queue State Machine Logic   │
│  - Cloudinary Image Upload Buffer  - Midtrans Snap &amp; Webhook Processor  │
│  - POS Cashier &amp; Invoice Generator - Socket.IO Broadcast Server          │
└──────────────┬─────────────────────────┬──────────────────────┬──────────┘
               │ Prisma ORM (v7)         │ Webhook &amp; SDK        │ SMTP / API
┌──────────────▼──────────┐   ┌──────────▼──────────┐   ┌───────▼──────────┐
│   DATABASE (PostgreSQL) │   │   MIDTRANS GATEWAY  │   │ CLOUDINARY/EMAIL │
│ Users, Customers,       │   │ Snap Token, VA,     │   │ Cloudinary Media │
│ Barbers, Orders, Items, │   │ QRIS, Webhooks      │   │ Nodemailer Gmail │
│ Payments, Invoices      │   └─────────────────────┘   └──────────────────┘
└─────────────────────────┘
  </pre>

  <h2>2.2 Data Model &amp; Skema Relasi Database (Prisma ORM)</h2>
  <table>
    <thead>
      <tr>
        <th>Model</th>
        <th>Field Utama</th>
        <th>Relasi &amp; Deskripsi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>Users</code></td>
        <td><code>id, username, email, password, role, isVerified, created_at</code></td>
        <td>Menyimpan akun kredensial auth (Role: <code>ADMIN</code> / <code>CUSTOMER</code>). Password di-hash bcrypt.</td>
      </tr>
      <tr>
        <td><code>Customer</code></td>
        <td><code>id, name, email, phone, profilePicture</code></td>
        <td>Relasi <code>1-to-Many</code> ke <code>Order</code>. Menyimpan profil personal pelanggan.</td>
      </tr>
      <tr>
        <td><code>Barber</code></td>
        <td><code>id, name, phone, picture, status</code></td>
        <td>Status enum: <code>available</code>, <code>working</code>, <code>on_break</code>. Relasi <code>1-to-Many</code> ke <code>Order</code>.</td>
      </tr>
      <tr>
        <td><code>Services</code></td>
        <td><code>id, name, duration, price, image</code></td>
        <td>Katalog layanan potong rambut/treatment beserta durasi dan harga dalam IDR.</td>
      </tr>
      <tr>
        <td><code>Order</code></td>
        <td><code>id, customerId, barberId, queueNumber, service_status, payement_status, notes, checkin_time</code></td>
        <td>Status layanan: <code>waiting</code>, <code>in_service</code>, <code>completed</code>.<br>Status bayar: <code>unpaid</code>, <code>pending</code>, <code>paid</code>, dll.</td>
      </tr>
      <tr>
        <td><code>OrderItems</code></td>
        <td><code>id, orderId, serviceId, duration, price, qty, subtotal</code></td>
        <td>Item rincian layanan dalam satu order (snapshot harga &amp; durasi saat order).</td>
      </tr>
      <tr>
        <td><code>Payment</code></td>
        <td><code>id, orderId, amountReceived, change, paymentMethod, paidAt</code></td>
        <td>Transaksi pembayaran manual kasir (cash, qris, card, other) dan pencatatan kembalian.</td>
      </tr>
      <tr>
        <td><code>Invoice</code></td>
        <td><code>id, orderId, invoiceNo, totalAmount, issuedAt, paidAt, status</code></td>
        <td>Faktur pembayaran digital unik dengan format <code>INV-{orderId}-{timestamp}</code>.</td>
      </tr>
      <tr>
        <td><code>MidtransTransaction</code></td>
        <td><code>id, orderId, midtransOrderId, grossAmount, transactionStatus, snapToken, redirectUrl</code></td>
        <td>Penyimpanan log transaksi gateway online Midtrans Snap &amp; notifikasi webhook.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- FUNCTIONAL REQUIREMENTS: BACKEND -->
  <div class="header-bar">
    <span>PRD: Barbershop Management &amp; Queue POS System</span>
    <span>Spesifikasi Kebutuhan Fungsional Backend</span>
  </div>

  <h1>3. Spesifikasi Fungsional Backend (API Modules)</h1>

  <h2>3.1 Modul Autentikasi &amp; Keamanan Akun (<code>/api/auth</code>)</h2>
  <ul>
    <li><strong>Registrasi Pengguna (<code>POST /register</code>):</strong> Menerima data <code>username</code>, <code>email</code>, <code>password</code>, <code>role</code>. Password di-hash menggunakan <code>bcrypt (salt=10)</code>. Akun dibuat dengan status <code>isVerified: false</code> dan secara otomatis mengirimkan email verifikasi berisi token JWT 1 jam via Nodemailer.</li>
    <li><strong>Verifikasi Email (<code>GET /verify-email?token=...</code>):</strong> Memvalidasi JWT token dari link email. Jika valid, update <code>isVerified = true</code>.</li>
    <li><strong>Kirim Ulang Email Verifikasi (<code>POST /resend-verification</code>):</strong> Memungkinkan pengiriman ulang link jika token sebelumnya kadaluarsa.</li>
    <li><strong>Login (<code>POST /login</code>):</strong> Memverifikasi username &amp; password. Memblokir akun yang belum verifikasi email (<code>403 Forbidden</code>). Menghasilkan JWT token yang disimpan dalam <strong>HttpOnly Cookie</strong> yang aman (<code>maxAge: 24h, sameSite: strict</code>).</li>
    <li><strong>Logout (<code>POST /logout</code>):</strong> Menghapus HttpOnly cookie <code>token</code> dari browser client.</li>
    <li><strong>Profile (<code>GET /profile</code>):</strong> Mengambil profil user yang sedang login via token middleware.</li>
  </ul>

  <h2>3.2 Modul Manajemen Barber (Kapster) (<code>/api/barber</code>)</h2>
  <ul>
    <li><strong>CRUD Barber:</strong> Menambah barber baru (nama, telepon, upload foto via Cloudinary), update data, dan delete barber.</li>
    <li><strong>Status Lifecycle Barber:</strong> Mendukung status <code>available</code> (siap melayani), <code>working</code> (sedang melayani), dan <code>on_break</code> (sedang istirahat).</li>
    <li><strong>Auto Status Update:</strong> Status otomatis berubah menjadi <code>working</code> saat order baru dibuat jika barber <code>available</code>. Status otomatis kembali <code>available</code> saat antrean selesai.</li>
  </ul>

  <h2>3.3 Modul Antrean Cerdas &amp; Order (<code>/api/order</code>)</h2>
  <div class="callout callout-info">
    <strong>Logika State Machine &amp; Queue Numbering:</strong>
    <ol style="margin-top: 5px; margin-bottom: 0;">
      <li>Jika Barber berstatus <code>available</code>: Order langsung diset ke <code>service_status: in_service</code>, barber berubah menjadi <code>working</code>, dan nomor antrean = <code>null</code> (langsung dilayani).</li>
      <li>Jika Barber berstatus <code>working</code>: Order diset ke <code>service_status: waiting</code>, dan sistem otomatis memberikan <code>queueNumber</code> berurutan (N+1) berdasarkan antrean terakhir barber tersebut.</li>
      <li>Jika Barber berstatus <code>on_break</code>: Sistem menolak order baru dengan pesan kesalahan.</li>
      <li><strong>Auto Queue Progression:</strong> Ketika order aktif diupdate menjadi <code>completed</code>, sistem mencari antrean berikutnya (<code>queueNumber</code> terkecil) dan mengubah statusnya menjadi <code>in_service</code>. Jika tidak ada antrean tersisa, status barber direset ke <code>available</code>.</li>
    </ol>
  </div>
  <ul>
    <li><strong>Tracking Antrean (<code>GET /queue-position/:id</code>):</strong> Mengembalikan posisi antrean spesifik pelanggan serta jumlah orang yang mengantre di depannya (<code>peopleAhead</code>).</li>
  </ul>

  <h2>3.4 Modul Transaksi &amp; Order Items (<code>/api/order-item</code>)</h2>
  <ul>
    <li>Menambahkan beberapa layanan sekaligus ke dalam satu order ID.</li>
    <li>Menghitung subtotal otomatis berdasarkan harga layanan dan kuantitas (<code>price * qty</code>).</li>
  </ul>

  <h2>3.5 Modul Pembayaran Kasir (POS) (<code>/api/payment</code>)</h2>
  <ul>
    <li><strong>Pencatatan Pembayaran Manual:</strong> Menerima metode pembayaran <code>cash</code>, <code>qris</code>, <code>card</code>, atau <code>other</code>.</li>
    <li><strong>Validasi Servis Selesai:</strong> Pembayaran kasir hanya dapat dilakukan jika order telah berstatus <code>service_status = completed</code>.</li>
    <li><strong>Kalkulasi Kembalian:</strong> Menghitung total order, memverifikasi <code>amountReceived &gt;= totalOrder</code>, dan menghitung nominal <code>change</code> (kembalian).</li>
    <li><strong>Atomic Transaction (Prisma $transaction):</strong> Menyimpan record pembayaran, mengubah status order menjadi <code>paid</code>, dan mencetak invoice digital dalam satu transaksi database atomik.</li>
  </ul>

  <h2>3.6 Modul Payment Gateway Midtrans &amp; Real-Time Socket.IO (<code>/api/midtrans</code>)</h2>
  <ul>
    <li><strong>Generate Snap Token (<code>POST /transaction</code>):</strong> Mengumpulkan detail item layanan dan data customer, kemudian berkomunikasi dengan Midtrans Snap API untuk memperoleh <code>snapToken</code> dan <code>redirectUrl</code>.</li>
    <li><strong>Webhook Notification Handler (<code>POST /notification</code>):</strong> Endpoint publik untuk menerima notifikasi status pembayaran dari Midtrans (<code>settlement</code>, <code>capture</code>, <code>deny</code>, <code>expire</code>, <code>cancel</code>).</li>
    <li><strong>Invoice Generation &amp; Real-time Revenue Broadcast:</strong> Ketika status menjadi <code>paid</code> (settlement), sistem membuat invoice resmi dan menghitung omzet bulanan (<code>calculateMonthlyRevenue</code>), lalu memancarkan event WebSocket <code>revenue:updated</code> ke semua admin yang terhubung.</li>
  </ul>

  <div class="page-break"></div>

  <!-- FUNCTIONAL REQUIREMENTS: FRONTEND -->
  <div class="header-bar">
    <span>PRD: Barbershop Management &amp; Queue POS System</span>
    <span>Spesifikasi Kebutuhan Fungsional Frontend</span>
  </div>

  <h1>4. Spesifikasi Fungsional Frontend (UI/UX Modules)</h1>

  <h2>4.1 Portal Pelanggan (Customer Web Interface)</h2>
  <div class="card-grid">
    <div class="card">
      <div class="card-title">1. Landing Page &amp; Katalog Layanan</div>
      <p style="font-size: 9pt;">Menampilkan showcase barbershop, daftar lengkap servis (nama, durasi pengerjaan, harga IDR, foto layanan dari Cloudinary), dan rating/testimoni.</p>
    </div>
    <div class="card">
      <div class="card-title">2. Pemilihan Barber &amp; Status Live</div>
      <p style="font-size: 9pt;">Kartu profil barber interaktif yang menampilkan badge status terkini: <span class="status-pill status-available">Available</span>, <span class="status-pill status-working">Working</span>, atau <span class="status-pill status-break">On Break</span>.</p>
    </div>
    <div class="card">
      <div class="card-title">3. Flow Booking &amp; Order Placement</div>
      <p style="font-size: 9pt;">Form pemilihan paket layanan (multi-select item), input catatan khusus (request model rambut), konfirmasi total durasi &amp; estimasi biaya.</p>
    </div>
    <div class="card">
      <div class="card-title">4. Real-time Live Queue Tracker</div>
      <p style="font-size: 9pt;">Komponen visual tiket antrean digital yang menampilkan: Nomor antrean Anda, nama kapster pilihan, jumlah orang di depan Anda (<code>peopleAhead</code>), dan estimasi waktu panggil.</p>
    </div>
    <div class="card">
      <div class="card-title">5. Pembayaran Midtrans Snap Modal</div>
      <p style="font-size: 9pt;">Integrasi modal pop-up Midtrans Snap yang memungkinkan bayar instan via GoPay, ShopeePay, QRIS, Virtual Account BCA/Mandiri/BNI/BRI, atau Kartu Kredit.</p>
    </div>
    <div class="card">
      <div class="card-title">6. E-Receipt / Digital Invoice Viewer</div>
      <p style="font-size: 9pt;">Halaman ringkasan bukti pembayaran resmi lengkap dengan nomor faktur, rincian biaya, metode pembayaran, stempel lunas, dan opsi download PDF.</p>
    </div>
  </div>

  <h2>4.2 Portal Admin &amp; Kasir (Admin POS &amp; Analytics Dashboard)</h2>
  <div class="card-grid">
    <div class="card">
      <div class="card-title">1. Live Revenue &amp; Analytics Widget</div>
      <p style="font-size: 9pt;">Grafik dan ringkasan omzet bulanan yang terupdate secara real-time melalui <strong>Socket.IO client</strong> setiap kali transaksi sukses tanpa perlu refresh halaman.</p>
    </div>
    <div class="card">
      <div class="card-title">2. Queue Board &amp; Status Controller</div>
      <p style="font-size: 9pt;">Papan kontrol antrean per barber: Tombol aksi untuk memajukan status (<code>waiting</code> &rarr; <code>in_service</code> &rarr; <code>completed</code>) dan mengontrol jeda istirahat kapster.</p>
    </div>
    <div class="card">
      <div class="card-title">3. POS Cashier Terminal</div>
      <p style="font-size: 9pt;">Modul kasir cepat: input nominal uang tunai yang diterima, kalkulator kembalian otomatis instan, pilihan pembayaran (Cash/Debit/QRIS), dan print struk faktur.</p>
    </div>
    <div class="card">
      <div class="card-title">4. Master Data Management (CRUD)</div>
      <p style="font-size: 9pt;">Tabel manajemen kapster &amp; layanan, dilengkapi form upload gambar (drag-and-drop) terintegrasi ke endpoint Cloudinary.</p>
    </div>
  </div>

  <h2>4.3 Alur Pengguna (User Flow)</h2>
  <pre>
[Pelanggan Masuk Web] ──&gt; [Pilih Layanan &amp; Barber] ──&gt; [Buat Order]
                                                              │
   ┌──────────────────────────────────────────────────────────┴───────────────────────────────┐
   │ Barber Available                                         │ Barber Sedang Sibuk (Working) │
   ▼                                                          ▼                               │
[Langsung Masuk Kursi / In Service]             [Dapat Nomor Antrean (Queue #)]               │
   │                                                          │ Pantau Live Queue di HP       │
   │                                                          ▼                               │
   │                                            [Giliran Dipanggil / In Service]              │
   └──────────────────────────┬───────────────────────────────┘                               │
                              ▼                                                               │
                     [Pangkas Selesai / Completed]                                            │
                              │                                                               │
            ┌─────────────────┴────────────────────────┐                                      │
            │ Bayar di Kasir (Cash / Debit)            │ Bayar Online (Midtrans Snap)         │
            ▼                                          ▼                                      │
    [Kasir Input Pembayaran &amp; Kembalian]        [Pelanggan Bayar via QRIS / VA]               │
            │                                          │ Webhook Midtrans Sukses              │
            └─────────────────┬────────────────────────┘                                      │
                              ▼                                                               │
                [Invoice Diterbitkan (INV-xxx)] ──&gt; [Real-time Socket.IO Update Omzet Admin]
  </pre>

  <div class="page-break"></div>

  <!-- API REFERENCE & SPECIFICATION -->
  <div class="header-bar">
    <span>PRD: Barbershop Management &amp; Queue POS System</span>
    <span>Spesifikasi API Endpoint</span>
  </div>

  <h1>5. Spesifikasi Lengkap REST API</h1>

  <table>
    <thead>
      <tr>
        <th>Method</th>
        <th>Endpoint Path</th>
        <th>Auth</th>
        <th>Fungsi &amp; Payload Utama</th>
      </tr>
    </thead>
    <tbody>
      <!-- AUTH -->
      <tr>
        <td><span class="badge badge-post">POST</span></td>
        <td><code>/api/auth/register</code></td>
        <td>Public</td>
        <td>Registrasi user: <code>{ username, email, password, role }</code></td>
      </tr>
      <tr>
        <td><span class="badge badge-post">POST</span></td>
        <td><code>/api/auth/login</code></td>
        <td>Public</td>
        <td>Login &amp; set cookie JWT: <code>{ username, password }</code></td>
      </tr>
      <tr>
        <td><span class="badge badge-post">POST</span></td>
        <td><code>/api/auth/logout</code></td>
        <td>Public</td>
        <td>Hapus cookie auth session token.</td>
      </tr>
      <tr>
        <td><span class="badge badge-get">GET</span></td>
        <td><code>/api/auth/verify-email</code></td>
        <td>Public</td>
        <td>Verifikasi email via query param <code>?token=...</code></td>
      </tr>
      <tr>
        <td><span class="badge badge-post">POST</span></td>
        <td><code>/api/auth/resend-verification</code></td>
        <td>Public</td>
        <td>Kirim ulang link aktivasi: <code>{ email }</code></td>
      </tr>
      <tr>
        <td><span class="badge badge-get">GET</span></td>
        <td><code>/api/auth/profile</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Mengambil info akun user yang sedang aktif.</td>
      </tr>

      <!-- CUSTOMER -->
      <tr>
        <td><span class="badge badge-post">POST</span></td>
        <td><code>/api/customer/register</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Registrasi profil customer + upload foto (multipart/form-data).</td>
      </tr>
      <tr>
        <td><span class="badge badge-get">GET</span></td>
        <td><code>/api/customer/all</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Mengambil semua data pelanggan.</td>
      </tr>
      <tr>
        <td><span class="badge badge-get">GET</span></td>
        <td><code>/api/customer/:id</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Detail pelanggan berdasarkan ID.</td>
      </tr>
      <tr>
        <td><span class="badge badge-put">PUT</span></td>
        <td><code>/api/customer/update/:id</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Update profil &amp; nomor telepon customer.</td>
      </tr>
      <tr>
        <td><span class="badge badge-del">DELETE</span></td>
        <td><code>/api/customer/delete/:id</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Hapus data customer.</td>
      </tr>

      <!-- BARBER -->
      <tr>
        <td><span class="badge badge-post">POST</span></td>
        <td><code>/api/barber/register</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Tambah master kapster + upload gambar Cloudinary.</td>
      </tr>
      <tr>
        <td><span class="badge badge-get">GET</span></td>
        <td><code>/api/barber/all</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Mengambil semua daftar barber &amp; status operasionalnya.</td>
      </tr>
      <tr>
        <td><span class="badge badge-patch">PATCH</span></td>
        <td><code>/api/barber/update-status/:id</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Update status kapster: <code>{ status: "available"|"working"|"on_break" }</code></td>
      </tr>
      <tr>
        <td><span class="badge badge-put">PUT</span></td>
        <td><code>/api/barber/update/:id</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Update data nama, no telp, dan foto barber.</td>
      </tr>

      <!-- SERVICES -->
      <tr>
        <td><span class="badge badge-post">POST</span></td>
        <td><code>/api/service/create</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Tambah layanan baru: <code>{ name, duration, price, image }</code></td>
      </tr>
      <tr>
        <td><span class="badge badge-get">GET</span></td>
        <td><code>/api/service/all</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Mengambil semua katalog menu layanan potong rambut.</td>
      </tr>
      <tr>
        <td><span class="badge badge-put">PUT</span></td>
        <td><code>/api/service/update/:id</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Update rincian harga atau durasi layanan.</td>
      </tr>

      <!-- ORDER & QUEUE -->
      <tr>
        <td><span class="badge badge-post">POST</span></td>
        <td><code>/api/order/create</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Buat order baru &amp; kalkulasi antrean: <code>{ customerId, barberId, notes }</code></td>
      </tr>
      <tr>
        <td><span class="badge badge-get">GET</span></td>
        <td><code>/api/order/all</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Mengambil semua order dan relasi Customer &amp; Barber.</td>
      </tr>
      <tr>
        <td><span class="badge badge-get">GET</span></td>
        <td><code>/api/order/:id</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Detail order berdasarkan ID.</td>
      </tr>
      <tr>
        <td><span class="badge badge-get">GET</span></td>
        <td><code>/api/order/queue-position/:id</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Posisi antrean dan jumlah antrean di depan pelanggan.</td>
      </tr>
      <tr>
        <td><span class="badge badge-patch">PATCH</span></td>
        <td><code>/api/order/update-status/:id</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Update status servis: <code>{ status: "in_service"|"completed" }</code></td>
      </tr>

      <!-- ORDER ITEMS -->
      <tr>
        <td><span class="badge badge-post">POST</span></td>
        <td><code>/api/order-item/create</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Tambah item layanan ke order: <code>{ orderId, serviceId, qty }</code></td>
      </tr>
      <tr>
        <td><span class="badge badge-get">GET</span></td>
        <td><code>/api/order-item/all</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Daftar item dalam order (filter via <code>?orderId=...</code>).</td>
      </tr>

      <!-- POS PAYMENT -->
      <tr>
        <td><span class="badge badge-post">POST</span></td>
        <td><code>/api/payment/create</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Proses bayar kasir: <code>{ orderId, amountRecived, paymentMethod }</code></td>
      </tr>
      <tr>
        <td><span class="badge badge-get">GET</span></td>
        <td><code>/api/payment/all</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Riwayat pembayaran kasir.</td>
      </tr>

      <!-- INVOICE -->
      <tr>
        <td><span class="badge badge-get">GET</span></td>
        <td><code>/api/invoice/all</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Daftar seluruh invoice yang diterbitkan.</td>
      </tr>
      <tr>
        <td><span class="badge badge-get">GET</span></td>
        <td><code>/api/invoice/:id</code></td>
        <td><span class="badge badge-auth">Auth</span></td>
        <td>Detail invoice lengkap (items, payment, customer, barber).</td>
      </tr>

      <!-- MIDTRANS & REALTIME -->
      <tr>
        <td><span class="badge badge-post">POST</span></td>
        <td><code>/api/midtrans/transaction</code></td>
        <td>Public</td>
        <td>Buat Snap transaction token: <code>{ orderId }</code></td>
      </tr>
      <tr>
        <td><span class="badge badge-post">POST</span></td>
        <td><code>/api/midtrans/notification</code></td>
        <td>Public</td>
        <td>Webhook endpoint notifikasi pembayaran Midtrans.</td>
      </tr>
      <tr>
        <td><span class="badge badge-get">GET</span></td>
        <td><code>/api/midtrans/monthly-revenue</code></td>
        <td>Public</td>
        <td>Ringkasan analitik omzet bulanan.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- NON-FUNCTIONAL REQUIREMENTS & ROADMAP -->
  <div class="header-bar">
    <span>PRD: Barbershop Management &amp; Queue POS System</span>
    <span>Kebutuhan Non-Fungsional &amp; Roadmap</span>
  </div>

  <h1>6. Kebutuhan Non-Fungsional (Non-Functional Requirements)</h1>

  <h2>6.1 Keamanan &amp; Integritas Data (Security)</h2>
  <ul>
    <li><strong>Kerahasiaan Kredensial:</strong> Password wajib di-hash menggunakan algoritma <code>bcrypt</code> dengan salt work factor minimal 10.</li>
    <li><strong>Perlindungan Token &amp; Sesi:</strong> JWT disimpan dalam <code>HttpOnly, Secure, SameSite=Strict</code> cookie guna memitigasi risiko Cross-Site Scripting (XSS) dan Session Hijacking.</li>
    <li><strong>Validasi Webhook:</strong> Notifikasi Midtrans diverifikasi langsung menggunakan <code>midtrans-client CoreApi.transaction.notification()</code> untuk mencegah fraud injection.</li>
    <li><strong>Database Atomicity:</strong> Operasi pembayaran dan penerbitan faktur wajib dibungkus dalam <code>prisma.$transaction</code> untuk menjamin ACID compliance.</li>
  </ul>

  <h2>6.2 Performa &amp; Ketersediaan (Performance &amp; Scalability)</h2>
  <ul>
    <li><strong>Response Time API:</strong> Waktu respon rata-rata endpoint REST API &lt; 150ms pada beban normal.</li>
    <li><strong>Real-time Latency:</strong> Waktu tunda penyampaian event WebSocket (Socket.IO) &lt; 200ms.</li>
    <li><strong>Media Storage:</strong> Semua aset media (foto barber, gambar layanan) di-host pada Cloudinary CDN berkecepatan tinggi dengan auto-format dan optimasi kompresi.</li>
  </ul>

  <h2>6.3 Kompatibilitas &amp; Responsivitas UI</h2>
  <ul>
    <li>Frontend mendukung antarmuka <em>Mobile-First</em> untuk pelanggan di smartphone (iOS &amp; Android) serta tampilan dashboard lebar (Desktop / Tablet) untuk kasir POS.</li>
  </ul>

  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;">

  <h1>7. Roadmap Implementasi &amp; Pengembangan Lanjutan</h1>
  <table>
    <thead>
      <tr>
        <th style="width: 15%;">Fase</th>
        <th style="width: 35%;">Deliverables &amp; Fitur</th>
        <th style="width: 25%;">Target Waktu</th>
        <th style="width: 25%;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Fase 1 (MVP Core)</strong></td>
        <td>Auth JWT, CRUD Customer, Barber, Service, Queue Logic, POS Cashier, Basic Invoicing.</td>
        <td>Bulan 1</td>
        <td><span class="badge badge-post">Selesai (Completed)</span></td>
      </tr>
      <tr>
        <td><strong>Fase 2 (Integration)</strong></td>
        <td>Midtrans Snap &amp; Webhook, Cloudinary Media Buffer, Real-time WebSocket Revenue &amp; Queue.</td>
        <td>Bulan 2</td>
        <td><span class="badge badge-post">Selesai (Completed)</span></td>
      </tr>
      <tr>
        <td><strong>Fase 3 (Enhancement)</strong></td>
        <td>WhatsApp / SMS Notification Gateway untuk pengingat giliran antrean otomatis saat sisa 2 orang.</td>
        <td>Bulan 3</td>
        <td><span class="badge badge-put">Direncanakan</span></td>
      </tr>
      <tr>
        <td><strong>Fase 4 (Scale &amp; Loyalty)</strong></td>
        <td>Sistem Poin Loyalitas Pelanggan, Bagi Hasil / Komisi Kapster, dan Multi-Branch Barbershop Support.</td>
        <td>Bulan 4</td>
        <td><span class="badge badge-get">Backlog</span></td>
      </tr>
    </tbody>
  </table>

  <div class="callout callout-info" style="margin-top: 20px;">
    <strong>Catatan Pengesahan Dokumen:</strong><br>
    Dokumen PRD ini telah disesuaikan secara presisi dengan arsitektur basis data, controller logic, route endpoints, dan integrasi frontend-backend yang berjalan pada repositori sistem Barbershop.
  </div>

</body>
</html>
`;

// Write HTML file
const htmlPath = path.join(__dirname, 'PRD_Barbershop_System.html');
const pdfPath = path.join(__dirname, 'PRD_Barbershop_System.pdf');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('HTML created successfully at ' + htmlPath);

// Convert HTML to PDF using Chrome or Edge
const chromePath = 'C:\\Program Files\\Google\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

let browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

const cmd = `"${browserPath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" --print-to-pdf-no-header --no-pdf-header-footer "${htmlPath}"`;
console.log('Running command:', cmd);

try {
  execSync(cmd);
  console.log('PDF generated successfully at: ' + pdfPath);
} catch (err) {
  console.error('Error generating PDF:', err);
}
