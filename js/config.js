/* =====================================================
   GRIYOSUNAT - KONFIGURASI
===================================================== */

const API_URL =
  'https://script.google.com/macros/s/AKfycbzhYI25bbIqmCWVLur1ND9jbCTBdblMQp_xXGG89WK3srkLXOEUJp1Yp73Vw5b7iyynZQ/exec';

const WHATSAPP_NUMBER =
  '6287885607666';

const SITE_NAME =
  'GriyoSunat';

const SITE_LOCATION =
  'Serang, Banten';


/* =====================================================
   API GET
===================================================== */

async function apiGet(action, params = {}) {

  const url = new URL(API_URL);

  url.searchParams.set('action', action);

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

  const response = await fetch(
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
   API POST
===================================================== */

async function apiPost(
  action,
  data = {}
) {

  const response = await fetch(
    API_URL,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'text/plain;charset=utf-8'
      },

      body: JSON.stringify({
        action: action,
        ...data
      })
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
    encodeURIComponent(message);

  window.open(
    'https://wa.me/' +
    WHATSAPP_NUMBER +
    '?text=' +
    encoded,
    '_blank'
  );
}
