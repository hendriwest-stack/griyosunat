/* =====================================================
   GRIYOSUNAT - MAIN.JS
===================================================== */


/* =====================================================
   CEK KONFIGURASI
===================================================== */

function getApiUrl() {

  if (
    typeof API_URL === 'undefined' ||
    !API_URL
  ) {

    throw new Error(
      'API_URL belum dimuat. Pastikan js/config.js dipanggil sebelum main.js.'
    );

  }

  return API_URL;

}


/* =====================================================
   API GET
===================================================== */

async function apiGet(
  action,
  params = {}
) {

  const apiUrl =
    getApiUrl();


  const url =
    new URL(apiUrl);


  url.searchParams.set(
    'action',
    action
  );


  Object.keys(params).forEach(
    key => {

      const value =
        params[key];

      if (
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {

        url.searchParams.set(
          key,
          value
        );

      }

    }
  );


  const response =
    await fetch(
      url.toString(),
      {
        method: 'GET',
        cache: 'no-store'
      }
    );


  if (!response.ok) {

    throw new Error(
      'Server tidak dapat dihubungi. HTTP ' +
      response.status
    );

  }


  const result =
    await response.json();


  return result;

}


/* =====================================================
   API POST
===================================================== */

async function apiPost(
  action,
  data = {}
) {

  const apiUrl =
    getApiUrl();


  const payload = {

    action:
      action,

    ...data

  };


  const response =
    await fetch(
      apiUrl,
      {

        method: 'POST',

        headers: {
          'Content-Type':
            'text/plain;charset=utf-8'
        },

        body:
          JSON.stringify(payload)

      }
    );


  if (!response.ok) {

    throw new Error(
      'Server tidak dapat dihubungi. HTTP ' +
      response.status
    );

  }


  return await response.json();

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
    encodeURIComponent(
      message ||
      'Assalamu\'alaikum, saya ingin bertanya tentang layanan GriyoSunat.'
    );


  const url =
    'https://wa.me/' +
    nomor +
    '?text=' +
    pesan;


  window.open(
    url,
    '_blank'
  );

}


/* =====================================================
   FORMAT RUPIAH
===================================================== */

function formatRupiah(
  angka
) {

  if (
    angka === null ||
    angka === undefined ||
    angka === ''
  ) {

    return '-';

  }


  const nilai =
    Number(
      String(angka)
        .replace(/[^\d]/g, '')
    );


  if (
    isNaN(nilai)
  ) {

    return '-';

  }


  return new Intl.NumberFormat(
    'id-ID',
    {
      style:
        'currency',

      currency:
        'IDR',

      minimumFractionDigits:
        0
    }
  ).format(nilai);

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
   DOCUMENT READY
===================================================== */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    console.log(
      'GriyoSunat siap.'
    );

    console.log(
      'API:',
      typeof API_URL !== 'undefined'
        ? 'TERHUBUNG'
        : 'TIDAK TERSEDIA'
    );

  }
);
