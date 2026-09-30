
/* =====================================================
   GRIYOSUNAT - KONFIGURASI
===================================================== */

const API_URL =
  'GANTI_DENGAN_URL_WEB_APP_APPS_SCRIPT';


/* Nomor WhatsApp GriyoSunat
   Format internasional tanpa +
   Contoh: 628123456789
*/
const WHATSAPP_NUMBER =
  '628xxxxxxxxxx';


/* Nama website */

const SITE_NAME =
  'GriyoSunat';


/* Kota / lokasi */

const SITE_LOCATION =
  'Boyolali, Jawa Tengah';


/* =====================================================
   HELPER API
===================================================== */

async function apiGet(action, params = {}) {

  const url =
    new URL(API_URL);

  url.searchParams.set(
    'action',
    action
  );

  Object.keys(params).forEach(key => {

    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ''
    ) {

      url.searchParams.set(
        key,
        params[key]
      );

    }

  });


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
      'Server tidak dapat dihubungi'
    );

  }


  return await response.json();

}


/* =====================================================
   POST API
===================================================== */

async function apiPost(
  action,
  data = {}
) {

  const payload = {

    action:
      action,

    ...data

  };


  const response =
    await fetch(
      API_URL,
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
      'Server tidak dapat dihubungi'
    );

  }


  return await response.json();

}


/* =====================================================
   WHATSAPP
===================================================== */

function openWhatsApp(message = '') {

  const encoded =
    encodeURIComponent(
      message
    );


  const url =
    'https://wa.me/' +
    WHATSAPP_NUMBER +
    '?text=' +
    encoded;


  window.open(
    url,
    '_blank'
  );

}


