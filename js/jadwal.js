const API_TIMEOUT = 15000;

async function fetchDenganTimeout(url, timeout = API_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
      redirect: 'follow'
    });
    if (!response.ok) throw new Error('Server mengembalikan HTTP ' + response.status);
    return response;
  } finally {
    clearTimeout(timer);
  }
}

async function loadJadwal() {
  const container = document.getElementById('jadwalContainer');
  if (!container) return;

  container.innerHTML = '<div class="state-box">Memuat jadwal...</div>';

  try {
    const url = new URL(API_URL);
    url.searchParams.set('action', 'jadwal');

    const response = await fetchDenganTimeout(url.toString());
    const result = await response.json();

    if (!result?.success || !Array.isArray(result.data)) {
      throw new Error(result?.message || 'Format data jadwal tidak valid');
    }

    if (!result.data.length) {
      container.innerHTML = '<div class="state-box">Belum ada jadwal tersedia.</div>';
      return;
    }

    renderJadwal(result.data);
  } catch (error) {
    container.innerHTML = `<div class="state-box error">Gagal memuat jadwal: ${escapeHTML(error.message)}</div>`;
  }
}

function renderJadwal(data) {
  const container = document.getElementById('jadwalContainer');
  const groups = {};

  data.forEach(item => {
    const tanggal = item.tanggal || '';
    if (!groups[tanggal]) groups[tanggal] = [];
    groups[tanggal].push(item);
  });

  container.innerHTML = Object.keys(groups).sort().map(tanggal => `
    <section class="schedule-group">
      <h2>${escapeHTML(formatTanggal(tanggal))}</h2>
      <div class="schedule-grid">
        ${groups[tanggal].map(renderSlot).join('')}
      </div>
    </section>
  `).join('');
}

function renderSlot(item) {
  const status = String(item.status || 'TERSEDIA').toUpperCase();
  const penuh = status === 'PENUH';
  const jam = formatJam(item.jam_mulai || item.jam);
  const selesai = formatJam(item.jam_selesai);
  const waktu = selesai !== '-' ? `${jam} - ${selesai}` : jam;

  return `
    <article class="schedule-card ${status.toLowerCase()}">
      <div class="schedule-time">${escapeHTML(waktu)}</div>
      <div class="badge">${escapeHTML(status)}</div>
      <p>${Number(item.tersisa || 0)} slot tersedia</p>
      <button class="btn btn-primary" ${penuh ? 'disabled' : ''}
        onclick="pilihJadwal('${escapeHTML(item.tanggal || '')}','${escapeHTML(jam)}')">
        ${penuh ? 'Sudah Penuh' : 'Pilih Jadwal'}
      </button>
    </article>
  `;
}

function pilihJadwal(tanggal, jam) {
  const params = new URLSearchParams({ tanggal, jam });
  window.location.href = `booking.html?${params.toString()}`;
}

document.addEventListener('DOMContentLoaded', loadJadwal);
