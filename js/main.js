/* =====================================================
   GRIYOSUNAT - MAIN
===================================================== */

function formatRupiah(angka) {
  if (angka === null || angka === undefined || angka === '') return '-';
  const nilai = Number(String(angka).replace(/[^\d]/g, ''));
  if (isNaN(nilai)) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(nilai);
}

function formatTanggal(tanggal, tampilHari = true) {
  if (!tanggal) return '-';

  let date;
  if (typeof tanggal === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
    const [y, m, d] = tanggal.split('-').map(Number);
    date = new Date(y, m - 1, d);
  } else {
    date = new Date(tanggal);
  }

  if (isNaN(date.getTime())) return String(tanggal);

  const opsi = { day: 'numeric', month: 'long', year: 'numeric' };
  if (tampilHari) opsi.weekday = 'long';
  return new Intl.DateTimeFormat('id-ID', opsi).format(date);
}

function formatJam(jam) {
  if (!jam) return '-';
  const match = String(jam).match(/^(\d{1,2}):(\d{2})/);
  if (match) return `${String(match[1]).padStart(2,'0')}:${match[2]}`;
  return String(jam);
}

function escapeHTML(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function openWhatsApp(message = '') {
  const pesan = message || "Assalamu'alaikum, saya ingin bertanya tentang layanan GriyoSunat.";
  window.open(
    'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(pesan),
    '_blank'
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
  }
});
