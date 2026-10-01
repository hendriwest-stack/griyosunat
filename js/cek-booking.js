document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('cekForm').addEventListener('submit', cekBooking);
});

async function cekBooking(event) {
  event.preventDefault();

  const value = document.getElementById('pencarian').value.trim();
  const hasil = document.getElementById('cekHasil');

  if (!value) return;

  hasil.innerHTML = '<div class="state-box">Mencari booking...</div>';

  try {
    const params = value.toUpperCase().startsWith('GS-')
      ? { id: value }
      : { whatsapp: value };

    const result = await apiGet('cekBooking', params);
    if (!result.success) throw new Error(result.message || 'Booking tidak ditemukan');

    const b = result.data;
    hasil.innerHTML = `
      <article class="booking-result">
        <h2>${escapeHTML(b.id_booking)}</h2>
        <p><strong>Nama Anak:</strong> ${escapeHTML(b.nama_anak)}</p>
        <p><strong>Tanggal:</strong> ${escapeHTML(formatTanggal(b.tanggal))}</p>
        <p><strong>Jam:</strong> ${escapeHTML(b.jam)}</p>
        <p><strong>Metode:</strong> ${escapeHTML(b.metode)}</p>
        <p><strong>Status:</strong> ${escapeHTML(b.status)}</p>
        ${String(b.status).toUpperCase() !== 'BATAL'
          ? `<button class="btn btn-danger" onclick="batalkan('${escapeHTML(b.id_booking)}')">Batalkan Booking</button>`
          : ''}
      </article>`;
  } catch (error) {
    hasil.innerHTML = `<div class="state-box error">${escapeHTML(error.message)}</div>`;
  }
}

async function batalkan(id) {
  if (!confirm('Yakin ingin membatalkan booking ini?')) return;

  try {
    const result = await apiPost('batalBooking', { id_booking: id });
    if (!result.success) throw new Error(result.message || 'Gagal membatalkan booking');
    alert('Booking berhasil dibatalkan.');
    document.getElementById('cekForm').requestSubmit();
  } catch (error) {
    alert(error.message);
  }
}
