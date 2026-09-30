/* =====================================================
   GRIYOSUNAT - JADWAL.JS
===================================================== */


/* =====================================================
   FORMAT TANGGAL
===================================================== */

function formatTanggal(tanggal) {

    if (
        tanggal === null ||
        tanggal === undefined ||
        tanggal === ''
    ) {
        return '-';
    }


    let date;


    // Format Google Sheet: YYYY-MM-DD
    if (
        typeof tanggal === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(tanggal)
    ) {

        const bagian =
            tanggal.split('-');

        date = new Date(
            Number(bagian[0]),
            Number(bagian[1]) - 1,
            Number(bagian[2])
        );

    }

    // Format DD/MM/YYYY
    else if (
        typeof tanggal === 'string' &&
        /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(tanggal)
    ) {

        const bagian =
            tanggal.split('/');

        date = new Date(
            Number(bagian[2]),
            Number(bagian[1]) - 1,
            Number(bagian[0])
        );

    }

    else {

        date = new Date(tanggal);

    }


    if (
        isNaN(date.getTime())
    ) {
        return tanggal;
    }


    return new Intl.DateTimeFormat(
        'id-ID',
        {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }
    ).format(date);

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


    // Jika sudah HH:mm
    if (
        typeof jam === 'string' &&
        /^\d{1,2}:\d{2}/.test(jam)
    ) {

        return jam.substring(0, 5);

    }


    const date =
        new Date(jam);


    if (
        isNaN(date.getTime())
    ) {
        return jam;
    }


    return new Intl.DateTimeFormat(
        'id-ID',
        {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }
    ).format(date);

}


/* =====================================================
   LOAD JADWAL
===================================================== */

async function loadJadwal() {

    const container =
        document.getElementById(
            'jadwalContainer'
        );


    if (!container) {
        console.error(
            'Elemen #jadwalContainer tidak ditemukan.'
        );
        return;
    }


    container.innerHTML = `
        <div class="loading">
            Memuat jadwal...
        </div>
    `;


    try {

        const result =
            await apiGet('jadwal');


        console.log(
            'DATA JADWAL:',
            result
        );


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result?.message ||
                'Data jadwal tidak tersedia.'
            );

        }


        const data =
            result.data || [];


        if (
            data.length === 0
        ) {

            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📅</div>
                    <h3>Belum Ada Jadwal</h3>
                    <p>
                        Jadwal sunat belum tersedia.
                        Silakan hubungi GriyoSunat melalui WhatsApp.
                    </p>
                    <button
                        class="btn btn-primary"
                        onclick="openWhatsApp()"
                    >
                        Hubungi WhatsApp
                    </button>
                </div>
            `;

            return;
        }


        container.innerHTML =
            data.map(
                item => renderJadwal(item)
            ).join('');


    } catch (error) {

        console.error(
            'ERROR JADWAL:',
            error
        );


        container.innerHTML = `
            <div class="error-box">
                <h3>Jadwal belum dapat dimuat</h3>
                <p>
                    ${escapeHTML(error.message)}
                </p>
                <button
                    class="btn btn-primary"
                    onclick="loadJadwal()"
                >
                    Coba Lagi
                </button>
            </div>
        `;

    }

}


/* =====================================================
   RENDER JADWAL
===================================================== */

function renderJadwal(item) {

    const kuota =
        Number(item.KUOTA || item.kuota || 0);

    const terisi =
        Number(item.TERISI || item.terisi || 0);

    const sisa =
        Math.max(
            kuota - terisi,
            0
        );


    const status =
        String(
            item.STATUS ||
            item.status ||
            ''
        ).toUpperCase();


    const penuh =
        status === 'PENUH' ||
        sisa <= 0;


    const tanggal =
        item.TANGGAL ||
        item.tanggal ||
        '';


    const jamMulai =
        item.JAM_MULAI ||
        item.jam_mulai ||
        '';


    const jamSelesai =
        item.JAM_SELESAI ||
        item.jam_selesai ||
        '';


    const idJadwal =
        item.ID_JADWAL ||
        item.id_jadwal ||
        '';


    return `
        <div class="schedule-card">

            <div class="schedule-date">

                <div class="schedule-day">
                    ${formatTanggal(tanggal)}
                </div>

            </div>


            <div class="schedule-info">

                <div class="schedule-time">
                    🕐
                    ${formatJam(jamMulai)}
                    -
                    ${formatJam(jamSelesai)}
                </div>


                <div class="schedule-quota">

                    ${
                        penuh
                        ? 'Kuota penuh'
                        : `Tersisa ${sisa} peserta`
                    }

                </div>


                ${
                    item.KETERANGAN ||
                    item.keterangan
                    ? `
                        <div class="schedule-note">
                            ${escapeHTML(
                                item.KETERANGAN ||
                                item.keterangan
                            )}
                        </div>
                    `
                    : ''
                }

            </div>


            <div class="schedule-action">

                ${
                    penuh

                    ? `
                        <button
                            class="btn btn-disabled"
                            disabled
                        >
                            Penuh
                        </button>
                    `

                    : `
                        <a
                            href="booking.html?jadwal=${encodeURIComponent(idJadwal)}"
                            class="btn btn-primary"
                        >
                            Booking
                        </a>
                    `
                }

            </div>

        </div>
    `;
}


/* =====================================================
   JALANKAN SAAT HALAMAN SIAP
===================================================== */

document.addEventListener(
    'DOMContentLoaded',
    function () {

        loadJadwal();

    }
);
