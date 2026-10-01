let jadwalData = [];
let metodeData = [];

document.addEventListener('DOMContentLoaded', initBooking);

async function initBooking() {
  await Promise.all([loadBookingJadwal(), loadMetode()]);
  setupForm();
  loadUrlSelection();
}

async function loadBookingJadwal() {
  const tanggal = document.getElementById('tanggal');
  const jam = document.getElementById('jam');

  try {
    const result = await apiGet('jadwal');
    if (!result.success) throw new Error(result.message || 'Gagal memuat jadwal');
    jadwalData = result.data || [];

    const now = new Date();
    const localToday = [
      now.getFullYear(),
      String(now.getMonth()+1).padStart(2,'0'),
      String(now.getDate()).padStart(2,'0')
    ].join('-');

    tanggal.min = localToday;
    tanggal.addEventListener('change', updateJam);
  } catch (error) {
    jam.innerHTML = '<option value="">Gagal memuat jadwal</option>';
  }
}

function updateJam() {
  const tanggal = document.getElementById('tanggal').value;
  const jam = document.getElementById('jam');

  jam.innerHTML = '<option value="">Pilih jam</option>';
  if (!tanggal) return;

  const filtered = jadwalData.filter(slot =>
    slot.tanggal === tanggal &&
    String(slot.status || '').toUpperCase() !== 'PENUH' &&
    Number(slot.tersisa || 0) > 0
  );

  filtered.forEach(slot => {
    const option = document.createElement('option');
    option.value = formatJam(slot.jam || slot.jam_mulai);
    option.textContent = `${option.value} — ${slot.status} (${slot.tersisa} slot)`;
    jam.appendChild(option);
  });

  if (!filtered.length) {
    jam.innerHTML = '<option value="">Tidak ada jadwal tersedia</option>';
  }
}

async function loadMetode() {
  const select = document.getElementById('metode');

  try {
    const result = await apiGet('metode');
    if (!result.success) throw new Error(result.message || 'Gagal memuat metode');
    metodeData = result.data || [];

    select.innerHTML = '<option value="">Pilih metode sunat</option>';
    metodeData.forEach(item => {
      const option = document.createElement('option');
      option.value = item.nama;
      option.textContent = item.harga
        ? `${item.nama} — ${formatRupiah(item.harga)}`
        : item.nama;
      select.appendChild(option);
    });
  } catch (error) {
    select.innerHTML = '<option value="">Gagal memuat metode</option>';
  }
}

function loadUrlSelection() {
  const params = new URLSearchParams(window.location.search);
  const tanggal = params.get('tanggal');
  const jam = params.get('jam');

  if (tanggal) {
    document.getElementById('tanggal').value = tanggal;
    updateJam();
    if (jam) document.getElementById('jam').value = jam;
  }
}

function setupForm() {
  const form = document.getElementById('bookingForm');
  if (form) form.addEventListener('submit', submitBooking);
}

async function submitBooking(event) {
  event.preventDefault();

  const button = document.getElementById('bookingSubmit');
  const message = document.getElementById('bookingMessage');
  const success = document.getElementById('bookingSuccess');
  const form = document.getElementById('bookingForm');

  const data = new FormData(form);
  const payload = Object.fromEntries(data.entries());

  button.disabled = true;
  button.textContent = 'Memproses booking...';
  message.textContent = '';

  try {
    const result = await apiPost('booking', payload);
    if (!result.success) throw new Error(result.message || 'Booking gagal');

    window.lastBooking = result.data;
    form.style.display = 'none';
    success.style.display = 'block';
    success.innerHTML = `
      <div class="success-box">
        <div class="success-icon">✓</div>
        <h2>Booking Berhasil</h2>
        <p>Simpan nomor booking berikut.</p>
        <div class="booking-code">${escapeHTML(result.data.id_booking)}</div>
        <p><strong>${escapeHTML(result.data.nama_anak)}</strong></p>
        <p>${escapeHTML(formatTanggal(result.data.tanggal))}, ${escapeHTML(result.data.jam)}</p>
        <p>${escapeHTML(result.data.metode)}</p>
        <button class="btn btn-primary" onclick="sendBookingWhatsApp()">Konfirmasi via WhatsApp</button>
      </div>`;
  } catch (error) {
    message.textContent = error.message || 'Booking gagal. Silakan coba lagi.';
    button.disabled = false;
    button.textContent = 'Konfirmasi Booking';
  }
}

function sendBookingWhatsApp() {
  const b = window.lastBooking;
  if (!b) return;

  openWhatsApp(
`Assalamu'alaikum GriyoSunat.

Saya sudah melakukan booking sunat.

Nomor Booking: ${b.id_booking}
Nama Anak: ${b.nama_anak}
Tanggal: ${formatTanggal(b.tanggal)}
Jam: ${b.jam}
Metode: ${b.metode}`
  );
}
