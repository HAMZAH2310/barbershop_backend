const pptxgen = require("pptxgenjs");
const path = require("path");

async function createPresentation() {
    const pres = new pptxgen();

    // Set 16:9 Widescreen Layout (13.333" x 7.5")
    pres.layout = "LAYOUT_WIDE";
    pres.title = "Barbershop Management & Real-Time Queue POS System";
    pres.author = "Barbershop Engineering Team";
    pres.company = "Kafka Barbershop";

    const COLOR_BG = "0B0B0C";        // Charcoal Black
    const COLOR_HEADER = "141416";    // Dark Header
    const COLOR_CARD = "18181B";      // Surface Card
    const COLOR_IVORY = "F5F1E8";     // Ivory Text
    const COLOR_BRASS = "B08D57";     // Metallic Brass Gold
    const COLOR_MUTED = "8B8B8A";     // Muted Gray
    const COLOR_LINE = "2A2A2D";      // Subtle Border

    const imageDir = "C:/Users/Hamzah/.gemini/antigravity-ide/brain/7815312d-bfe9-490b-bb2f-610ef8ff28aa";

    const slidesData = [
        {
            badge: "SLIDE 1 • PROBLEM STATEMENT",
            number: "01 / 04",
            title: "Tantangan Klasik Barbershop Tradisional",
            subtitle: "Ketidakpastian antrean, pembukuan manual, dan kebocoran pendapatan harian",
            imagePath: path.join(imageDir, "barbershop_problem_clean_1789021216261.jpg"),
            points: [
                {
                    title: "1. Antrean Fisik Menumpuk & Waktu Tunggu Tidak Jelas",
                    desc: "Pelanggan harus menunggu berjam-jam tanpa kepastian giliran. Ketiadaan nomor antrean transparan memicu serobotan dan tingkat pembatalan (drop-off) tinggi."
                },
                {
                    title: "2. Pembukuan Kasir Manual & Selisih Uang Kas",
                    desc: "Transaksi dicatat manual di buku kas kertas atau nota tercecer. Tutup kas harian rawan salah hitung (human error) dan komisi kapster sulit diaudit."
                },
                {
                    title: "3. Kebocoran Omzet & Ketiadaan Audit Trail",
                    desc: "Layanan yang dikerjakan kapster tidak terikat otomatis ke sistem kasir. Opsi pembayaran terbatas pada tunai, kehilangan potensi pelanggan non-tunai (QRIS)."
                }
            ],
            notes: "Slide 1: Mengidentifikasi masalah utama operasional barbershop tradisional yaitu antrean fisik yang tidak transparan, pencatatan manual yang rentan selisih, dan potensi kebocoran pendapatan."
        },
        {
            badge: "SLIDE 2 • VISION & MOTIVATION",
            number: "02 / 04",
            title: "Kenapa Saya Membuat Program Ini?",
            subtitle: "Menghubungkan keahlian pangkas rambut tradisional dengan ekosistem digital modern",
            imagePath: path.join(imageDir, "barbershop_vision_clean_1789021323507.jpg"),
            points: [
                {
                    title: "1. Pengalaman Pelanggan Transparan & Fleksibel",
                    desc: "Pelanggan dapat memantau estimasi giliran secara live dari smartphone sambil beraktivitas, memilih kapster favorit, dan datang tepat waktu."
                },
                {
                    title: "2. Memangkas Waktu Tunggu Operasional Hingga 40%",
                    desc: "Otomasi antrean: ketika kapster menyelesaikan order (completed), antrean berikutnya langsung dipanggil (in-service) secara otomatis tanpa jeda."
                },
                {
                    title: "3. Keamanan Finansial 100% & Zero Revenue Leakage",
                    desc: "Setiap transaksi otomatis menerbitkan invoice digital resmi bernomor unik. Pemilik dapat memantau rekap omzet real-time kapan pun dan dari mana pun."
                }
            ],
            notes: "Slide 2: Memaparkan visi dan motivasi pembuatan sistem yaitu efisiensi waktu pelanggan, otomasi operasional kapster, dan integritas finansial bisnis."
        },
        {
            badge: "SLIDE 3 • SOLUTION: PART 1",
            number: "03 / 04",
            title: "Solusi 1: Antrean Digital & Booking Real-Time",
            subtitle: "Sistem antrean cerdas tersinkronisasi instan via WebSocket (Socket.IO)",
            imagePath: path.join(imageDir, "barbershop_queue_clean_1789021346071.jpg"),
            points: [
                {
                    title: "1. Live Queue Tracking Tanpa Reload (Socket.IO)",
                    desc: "Tiket digital di HP pelanggan menyajikan estimasi menit tunggu dan jumlah antrean di depan. Sinkron <200ms dengan monitor display barbershop."
                },
                {
                    title: "2. Katalog Layanan & Profil Kapster Interaktif",
                    desc: "Pelanggan bebas memilih paket layanan (haircut, shaving, coloring) dan kapster favorit dengan transparansi harga serta estimasi durasi."
                },
                {
                    title: "3. Smart Dispatcher Antrean Otomatis",
                    desc: "Kapster berstatus available langsung melayani order masuk, sedangkan kapster working otomatis menampung antrean berurutan secara terstruktur."
                }
            ],
            notes: "Slide 3: Solusi sisi pelanggan dan operasional antrean dengan teknologi WebSocket real-time dan dispatching otomatis."
        },
        {
            badge: "SLIDE 4 • SOLUTION: PART 2",
            number: "04 / 04",
            title: "Solusi 2: Smart POS & Recap Pendapatan Real-Time",
            subtitle: "Point-of-Sale kasir, Multi-Payment Midtrans, dan laporan keuangan komprehensif",
            imagePath: path.join(imageDir, "barbershop_pos_clean_1789021380513.jpg"),
            points: [
                {
                    title: "1. POS Kasir Multi-Payment (Cash, QRIS, Midtrans)",
                    desc: "Kasir memproses pembayaran tunai dengan kembalian otomatis atau QRIS/transfer via Midtrans Snap Gateway yang terverifikasi otomatis via Webhook."
                },
                {
                    title: "2. Dashboard Rekapitulasi Pendapatan Komprehensif",
                    desc: "Menampilkan 4 KPI utama (Total Omzet, Transaksi Lunas, AOV, Total Layanan) dengan filter fleksibel: Hari Ini, Minggu Ini, Bulan Ini, dan Semua Waktu."
                },
                {
                    title: "3. Analitik Bisnis & Transparansi Komisi Kapster",
                    desc: "Grafik tren omzet harian, ranking performa per kapster untuk pembagian bagi hasil yang adil, serta audit trail rincian invoice terbayar secara real-time."
                }
            ],
            notes: "Slide 4: Solusi finansial dan analitik bisnis bagi pemilik barbershop: POS kasir terintegrasi dan rekapitulasi omzet all-time."
        }
    ];

    for (const data of slidesData) {
        const slide = pres.addSlide();

        // 1. Slide Solid Background (Full Canvas 13.333" x 7.5")
        slide.background = { color: COLOR_BG };

        // 2. Top Header Bar
        slide.addShape(pres.ShapeType.rect, {
            x: 0,
            y: 0,
            w: 13.333,
            h: 0.65,
            fill: { color: COLOR_HEADER },
            line: { color: COLOR_LINE, width: 1 }
        });

        // 3. Header Badge Pill
        slide.addText(data.badge, {
            x: 0.8,
            y: 0.15,
            w: 5.0,
            h: 0.35,
            fontSize: 10,
            bold: true,
            color: COLOR_BRASS,
            fontFace: "Segoe UI"
        });

        // 4. Slide Counter
        slide.addText(data.number, {
            x: 11.5,
            y: 0.15,
            w: 1.0,
            h: 0.35,
            align: "right",
            fontSize: 11,
            bold: true,
            color: COLOR_MUTED,
            fontFace: "Segoe UI"
        });

        // 5. Slide Title & Subtitle
        slide.addText(data.title, {
            x: 0.8,
            y: 0.85,
            w: 11.7,
            h: 0.45,
            fontSize: 22,
            bold: true,
            color: COLOR_IVORY,
            fontFace: "Segoe UI"
        });

        slide.addText(data.subtitle, {
            x: 0.8,
            y: 1.35,
            w: 11.7,
            h: 0.30,
            fontSize: 12,
            color: COLOR_MUTED,
            fontFace: "Segoe UI"
        });

        // 6. Left Column: Elegant Visual Image Card (Exact 16:9 Aspect Ratio)
        // Card frame behind image
        const imgX = 0.8;
        const imgY = 1.95;
        const imgW = 6.2;
        const imgH = 3.4875; // 6.2 * 9 / 16

        // Subtle decorative border frame around image
        slide.addShape(pres.ShapeType.roundRect, {
            x: imgX - 0.04,
            y: imgY - 0.04,
            w: imgW + 0.08,
            h: imgH + 0.08,
            fill: { color: COLOR_CARD },
            line: { color: COLOR_BRASS, width: 1.5 },
            rectRadius: 0.08
        });

        // Image without any circular clip mask (perfect rectangle)
        slide.addImage({
            path: data.imagePath,
            x: imgX,
            y: imgY,
            w: imgW,
            h: imgH
        });

        // 7. Right Column: Structured Feature Cards
        const cardX = 7.3;
        const cardW = 5.2;
        const cardH = 1.45;
        const cardGap = 0.20;
        const startCardY = 1.95;

        data.points.forEach((pt, idx) => {
            const currentY = startCardY + idx * (cardH + cardGap);

            // Card Container Shape
            slide.addShape(pres.ShapeType.roundRect, {
                x: cardX,
                y: currentY,
                w: cardW,
                h: cardH,
                fill: { color: COLOR_CARD },
                line: { color: COLOR_LINE, width: 1 },
                rectRadius: 0.08
            });

            // Vertical Accent Stripe on the Left of the Card
            slide.addShape(pres.ShapeType.rect, {
                x: cardX,
                y: currentY + 0.12,
                w: 0.07,
                h: cardH - 0.24,
                fill: { color: COLOR_BRASS }
            });

            // Point Title
            slide.addText(pt.title, {
                x: cardX + 0.22,
                y: currentY + 0.12,
                w: cardW - 0.35,
                h: 0.32,
                fontSize: 12,
                bold: true,
                color: COLOR_IVORY,
                fontFace: "Segoe UI"
            });

            // Point Description
            slide.addText(pt.desc, {
                x: cardX + 0.22,
                y: currentY + 0.46,
                w: cardW - 0.35,
                h: 0.90,
                fontSize: 10,
                color: COLOR_MUTED,
                fontFace: "Segoe UI",
                lineSpacingMultiple: 1.2
            });
        });

        // 8. Speaker Notes
        slide.addNotes(data.notes);
    }

    const outputPath = "C:/Users/Hamzah/kafka_barbershop/Presentasi_Barbershop_System_v2.pptx";
    await pres.writeFile({ fileName: outputPath });
    console.log("PPTX berhasil diperbarui di: " + outputPath);
}

createPresentation().catch(err => {
    console.error("Error generating PPTX:", err);
    process.exit(1);
});
