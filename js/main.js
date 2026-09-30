/* =====================================================
   GRIYOSUNAT - MAIN.JS
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


function escapeHTML(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return '';
  }

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
