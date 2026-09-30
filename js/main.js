/* =====================================================
   GRIYOSUNAT - MAIN.JS
===================================================== */


/* =====================================================
   FORMAT RUPIAH
===================================================== */

function formatRupiah(angka) {

  if (
    angka === null ||
    angka === undefined ||
    angka === ''
  ) {
    return '-';
  }

  const nilai = Number(
    String(angka).replace(/[^\d]/g, '')
  );

  if (isNaN(nilai)) {
    return '-';
  }

  return new Intl.NumberFormat(
    'id-ID',
    {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }
  ).format(nilai);
}


/* =====================================================
   FORMAT TANGGAL
   Contoh:
   2026-10-01
   menjadi:
   Kamis, 1 Oktober 2026
===================================================== */

function formatTanggal(
  tanggal,
  tampilHari = true
) {

  if (
    tanggal === null ||
    tanggal === undefined ||
    tanggal === ''
  ) {
    return '-';
  }

  let date;

  /*
   * Jika format YYYY-MM-DD
   * gunakan waktu lokal agar tidak bergeser
   */
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

  } else {

    date = new Date(tanggal);

  }


  if (
    isNaN(date.getTime())
  ) {
    return tanggal;
  }


  const opsi = {

    day: 'numeric',

    month: 'long',

    year: 'numeric'

  };


  if (tampilHari) {

    opsi.weekday = 'long';

  }


  return new Intl.DateTimeFormat(
    'id-ID',
    opsi
  ).format(date);

}


/* =====================================================
   FORMAT TANGGAL PENDEK
   Contoh:
   1 Oktober 2026
===================================================== */

function formatTanggalPendek(
  tanggal
) {

  return formatTanggal(
    tanggal,
    false
  );

}


/* =====================================================
   FORMAT JAM
===================================================== */

function formatJam(
  jam
) {

  if (
    jam === null ||
    jam === undefined ||
    jam === ''
  ) {
    return '-';
  }

  /*
   * Jika sudah berupa HH:mm
   */
  if (
    typeof jam === 'string' &&
    /^\d{1,2}:\d{2}/.test(jam)
  ) {

    return jam.substring(
      0,
      5
    );

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
   ESCAPE HTML
===================================================== */

function escapeHTML(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return '';

  }


  return String(value)

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
   LOADING
===================================================== */

function showLoading(
  element,
  text = 'Memuat data...'
) {

  if (!element) {
    return;
  }

  element.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <div>${escapeHTML(text)}</div>
    </div>
  `;

}


/* =====================================================
   ERROR
===================================================== */

function showError(
  element,
  message = 'Terjadi kesalahan.'
) {

  if (!element) {
    return;
  }

  element.innerHTML = `
    <div class="error-box">
      <div class="error-icon">!</div>
      <div>
        ${escapeHTML(message)}
      </div>
    </div>
  `;

}


/* =====================================================
   WHATSAPP
===================================================== */

function openWhatsApp(
  message = ''
) {

  const nomor =
    typeof WHATSAPP_NUMBER !== 'undefined'
      ? WHATSAPP_NUMBER
      : '6287885607666';


  const pesan =
    message ||
    'Assalamu\'alaikum, saya ingin bertanya tentang layanan GriyoSunat.';


  window.open(
    'https://wa.me/' +
    nomor +
    '?text=' +
    encodeURIComponent(pesan),
    '_blank'
  );

}
