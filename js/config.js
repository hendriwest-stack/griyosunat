/* =====================================================
   GRIYOSUNAT - KONFIGURASI
===================================================== */

const API_URL = 'https://script.google.com/macros/s/AKfycbzhYI25bbIqmCWVLur1ND9jbCTBdblMQp_xXGG89WK3srkLXOEUJp1Yp73Vw5b7iyynZQ/exec';
const WHATSAPP_NUMBER = '6287885607666';
const SITE_NAME = 'GriyoSunat';
const SITE_LOCATION = 'Serang, Banten';

async function apiGet(action, params = {}) {
  const url = new URL(API_URL);
  url.searchParams.set('action', action);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    cache: 'no-store',
    redirect: 'follow'
  });

  if (!response.ok) {
    throw new Error('Server tidak dapat dihubungi');
  }

  return response.json();
}

async function apiPost(action, data = {}) {
  const body = new URLSearchParams();
  body.set('action', action);

  Object.entries(data).forEach(([key, value]) => {
    body.set(key, value === undefined || value === null ? '' : String(value));
  });

  const response = await fetch(API_URL, {
    method: 'POST',
    body,
    redirect: 'follow'
  });

  if (!response.ok) {
    throw new Error('Server tidak dapat dihubungi');
  }

  return response.json();
}
