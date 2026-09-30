/* =====================================================
   GRIYOSUNAT - JADWAL
===================================================== */

const API_TIMEOUT = 15000;


/* =====================================================
   FORMAT TANGGAL
===================================================== */

function formatTanggal(tanggal) {

    if (!tanggal) {
        return '-';
    }

    const text = String(tanggal).trim();

    let date;

    // yyyy-MM-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {

        const parts = text.split('-');

        date = new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

    }

    // dd/MM/yyyy
    else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(text)) {

        const parts = text.split('/');

        date = new Date(
            Number(parts[2]),
            Number(parts[1]) - 1,
            Number(parts[0])
        );

    }

    else {

        date = new Date(text);

    }


    if (isNaN(date.getTime())) {
        return text;
    }


    const hari = [
        'Minggu',
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        'Jumat',
        'Sabtu'
    ];


    const bulan = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember'
    ];


    return (
        hari[date.getDay()] +
        ', ' +
        date.getDate() +
        ' ' +
        bulan[date.getMonth()] +
        ' ' +
        date.getFullYear()
    );

}


/* =====================================================
   FORMAT JAM
===================================================== */

function formatJam(jam) {

    if (
        jam === null ||
        jam === undefined ||
        jam === ''
    ) {

        return '-';

    }


    const text =
        String(jam).trim();


    /*
     * Sudah HH:mm
     */

    const match =
        text.match(
            /^(\d{1,2}):(\d{2})/
        );


    if (match) {

        return (
            String(match[1])
                .padStart(2, '0')
            +
            ':' +
            match[2]
        );

    }


    /*
     * Jika backend masih mengirim
     * bentuk Date string
     */

    const date =
        new Date(text);


    if (
        !isNaN(
            date.getTime()
        )
    ) {

        return (
            String(
                date.getHours()
            ).padStart(2, '0')
            +
            ':' +
            String(
                date.getMinutes()
            ).padStart(2, '0')
        );

    }


    return text;

}


/* =====================================================
   GET ELEMENT
===================================================== */

function getJadwalContainer() {

    return (
        document.getElementById(
            'jadwalContainer'
        )
        ||
        document.getElementById(
            'jadwal-list'
        )
        ||
        document.getElementById(
            'jadwalList'
        )
    );

}


/* =====================================================
   LOADING
===================================================== */

function tampilkanLoading() {

    const container =
        getJadwalContainer();


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="jadwal-loading">

            <div class="loading-spinner"></div>

            <div>
                Memuat jadwal...
            </div>

        </div>

    `;

}


/* =====================================================
   ERROR
===================================================== */

function tampilkanError(
    message
) {

    const container =
        getJadwalContainer();


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="jadwal-error">

            <div class="error-icon">
                !
            </div>

            <h3>
                Jadwal belum dapat dimuat
            </h3>

            <p>
                ${escapeHTML(
                    message ||
                    'Terjadi kesalahan saat mengambil data jadwal.'
                )}
            </p>

            <button
                type="button"
                onclick="loadJadwal()"
                class="btn-retry"
            >
                Coba Lagi
            </button>

        </div>

    `;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    text
) {

    return String(text || '')
        .replace(
            /&/g,
            '&amp;'
        )
        .replace(
            /</g,
            '&lt;'
        )
        .replace(
            />/g,
            '&gt;'
        )
        .replace(
            /"/g,
            '&quot;'
        )
        .replace(
            /'/g,
            '&#039;'
        );

}


/* =====================================================
   FETCH DENGAN TIMEOUT
===================================================== */

async function fetchDenganTimeout(
    url,
    timeout = 15000
) {

    const controller =
        new AbortController();


    const timer =
        setTimeout(
            function() {

                controller.abort();

            },
            timeout
        );


    try {

        const response =
            await fetch(
                url,
                {
                    method: 'GET',
                    cache: 'no-store',
                    signal:
                        controller.signal
                }
            );


        clearTimeout(timer);


        if (!response.ok) {

            throw new Error(
                'Server mengembalikan HTTP ' +
                response.status
            );

        }


        return response;

    }

    catch (error) {

        clearTimeout(timer);

        throw error;

    }

}


/* =====================================================
   LOAD JADWAL
===================================================== */

async function loadJadwal() {

    const container =
        getJadwalContainer();


    if (!container) {

        console.error(
            'Elemen jadwalContainer tidak ditemukan'
        );

        return;

    }


    tampilkanLoading();


    try {

        /*
         * Pastikan API_URL tersedia
         */

        if (
            typeof API_URL ===
            'undefined'
        ) {

            throw new Error(
                'API_URL belum tersedia. Pastikan config.js dimuat sebelum jadwal.js.'
            );

        }


        console.log(
            'Mengambil jadwal dari:',
            API_URL
        );


        const url =
            new URL(API_URL);


        url.searchParams.set(
            'action',
            'jadwal'
        );


        /*
         * Request ke GAS
         */

        const response =
            await fetchDenganTimeout(
                url.toString(),
                API_TIMEOUT
            );


        /*
         * Ambil JSON
         */

        const result =
            await response.json();


        console.log(
            'Response jadwal:',
            result
        );


        /*
         * Validasi response
         */

        if (
            !result ||
            result.success !== true
        ) {

            throw new Error(
                result &&
                result.message
                    ? result.message
                    : 'Response API tidak valid'
            );

        }


        /*
         * Pastikan data array
         */

        if (
            !Array.isArray(
                result.data
            )
        ) {

            throw new Error(
                'Format data jadwal dari server tidak valid'
            );

        }


        /*
         * Tidak ada jadwal
         */

        if (
            result.data.length === 0
        ) {

            container.innerHTML = `

                <div class="jadwal-empty">

                    <div class="empty-icon">
                        📅
                    </div>

                    <h3>
                        Belum Ada Jadwal
                    </h3>

                    <p>
                        Saat ini belum tersedia
                        jadwal sunat.
                    </p>

                </div>

            `;

            return;

        }


        /*
         * Render
         */

        renderJadwal(
            result.data
        );


    }

    catch (error) {

        console.error(
            'Gagal memuat jadwal:',
            error
        );


        let message =
            'Tidak dapat mengambil data jadwal.';


        if (
            error.name ===
            'AbortError'
        ) {

            message =
                'Server terlalu lama merespons. Silakan coba lagi.';

        }

        else if (
            error.message
        ) {

            message =
                error.message;

        }


        tampilkanError(
            message
        );

    }

}


/* =====================================================
   RENDER JADWAL
===================================================== */

function renderJadwal(
    data
) {

    const container =
        getJadwalContainer();


    if (!container) {
        return;
    }


    /*
     * Kelompokkan berdasarkan tanggal
     */

    const groups = {};


    data.forEach(
        function(item) {

            const tanggal =
                item.tanggal || '';


            if (
                !groups[tanggal]
            ) {

                groups[tanggal] = [];

            }


            groups[tanggal].push(
                item
            );

        }
    );


    let html = '';


    Object.keys(groups)
        .sort()
        .forEach(
            function(tanggal) {

                const items =
                    groups[tanggal];


                html += `

                    <section
                        class="jadwal-group"
                    >

                        <div
                            class="jadwal-date-header"
                        >

                            <div>

                                <span
                                    class="jadwal-label"
                                >
                                    Jadwal Sunat
                                </span>

                                <h3>
                                    ${escapeHTML(
                                        formatTanggal(
                                            tanggal
                                        )
                                    )}
                                </h3>

                            </div>

                        </div>

                        <div
                            class="jadwal-grid"
                        >
                `;


                items.forEach(
                    function(item) {

                        html +=
                            renderSlot(
                                item
                            );

                    }
                );


                html += `

                        </div>

                    </section>

                `;

            }
        );


    container.innerHTML =
        html;

}


/* =====================================================
   RENDER SLOT
===================================================== */

function renderSlot(
    item
) {

    const status =
        String(
            item.status ||
            'TERSEDIA'
        )
            .trim()
            .toUpperCase();


    let statusClass =
        'tersedia';


    let statusText =
        'Tersedia';


    let buttonDisabled =
        '';


    if (
        status ===
        'PENUH'
    ) {

        statusClass =
            'penuh';

        statusText =
            'Penuh';

        buttonDisabled =
            'disabled';

    }

    else if (
        status ===
        'TERBATAS'
    ) {

        statusClass =
            'terbatas';

        statusText =
            'Terbatas';

    }


    const jamMulai =
        formatJam(
            item.jam_mulai ||
            item.jam
        );


    const jamSelesai =
        formatJam(
            item.jam_selesai
        );


    let waktu =
        jamMulai;


    if (
        jamSelesai &&
        jamSelesai !== '-'
    ) {

        waktu +=
            ' - ' +
            jamSelesai;

    }


    const tersisa =
        Number(
            item.tersisa || 0
        );


    return `

        <div
            class="jadwal-card ${statusClass}"
        >

            <div
                class="jadwal-time"
            >

                ${escapeHTML(
                    waktu
                )}

            </div>


            <div
                class="jadwal-status ${statusClass}"
            >

                ${escapeHTML(
                    statusText
                )}

            </div>


            <div
                class="jadwal-kuota"
            >

                ${tersisa}
                slot tersedia

            </div>


            <button
                type="button"
                class="jadwal-booking-btn"
                ${buttonDisabled}
                onclick="pilihJadwal(
                    '${escapeHTML(
                        item.id_jadwal ||
                        item.id ||
                        ''
                    )}',
                    '${escapeHTML(
                        item.tanggal ||
                        ''
                    )}',
                    '${escapeHTML(
                        jamMulai
                    )}'
                )"
            >

                ${
                    status === 'PENUH'
                        ? 'Sudah Penuh'
                        : 'Pilih Jadwal'
                }

            </button>

        </div>

    `;

}


/* =====================================================
   PILIH JADWAL
===================================================== */

function pilihJadwal(
    id,
    tanggal,
    jam
) {

    /*
     * Simpan pilihan
     */

    try {

        sessionStorage.setItem(
            'griyosunat_jadwal',
            JSON.stringify({

                id:
                    id,

                tanggal:
                    tanggal,

                jam:
                    jam

            })
        );

    }
    catch (error) {

        console.warn(
            'sessionStorage tidak tersedia',
            error
        );

    }


    /*
     * Pindah ke booking
     */

    window.location.href =
        'booking.html';

}


/* =====================================================
   INIT
===================================================== */

document.addEventListener(
    'DOMContentLoaded',
    function() {

        loadJadwal();

    }
);
