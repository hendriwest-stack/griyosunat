document.addEventListener('DOMContentLoaded', loadMetodePage);

async function loadMetodePage() {
  const container = document.getElementById('metodeContainer');
  container.innerHTML = '<div class="state-box">Memuat metode...</div>';

  try {
    const result = await apiGet('metode');
    if (!result.success || !Array.isArray(result.data)) {
      throw new Error(result.message || 'Data metode tidak valid');
    }

    if (!result.data.length) {
      container.innerHTML = '<div class="state-box">Belum ada metode aktif.</div>';
      return;
    }

    container.innerHTML = result.data.map(item => `
      <article class="method-card">
        <h2>${escapeHTML(item.nama)}</h2>
        <p>${escapeHTML(item.deskripsi || 'Informasi metode tersedia saat konsultasi.')}</p>
        ${item.durasi ? `<p><strong>Durasi:</strong> ${escapeHTML(item.durasi)}</p>` : ''}
        ${item.harga ? `<div class="price">${formatRupiah(item.harga)}</div>` : ''}
        <a class="btn btn-primary" href="booking.html">Pilih Metode</a>
      </article>
    `).join('');
  } catch (error) {
    container.innerHTML = `<div class="state-box error">${escapeHTML(error.message)}</div>`;
  }
}
