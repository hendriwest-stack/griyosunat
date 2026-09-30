```javascript
/* =====================================================
   GRIYOSUNAT - BOOKING
===================================================== */

let jadwalData = [];

let metodeData = [];


document.addEventListener(
  'DOMContentLoaded',
  initBooking
);


/* =====================================================
   INIT
===================================================== */

async function initBooking() {

  await Promise.all([
    loadBookingJadwal(),
    loadMetode()
  ]);


  setupForm();

  loadUrlSelection();

}


/* =====================================================
   LOAD JADWAL
===================================================== */

async function loadBookingJadwal() {

  const tanggal =
    document.getElementById(
      'tanggal'
    );

  const jam =
    document.getElementById(
      'jam'
    );


  try {

    const result =
      await apiGet(
        'jadwal'
      );


    if (
      !result.success
    ) {

      throw new Error(
        result.message
      );

    }


    jadwalData =
      result.data || [];


    /*
     * Minimum tanggal hari ini
     */

    const today =
      new Date()
        .toISOString()
        .split('T')[0];


    tanggal.min =
      today;


    tanggal.addEventListener(
      'change',
      updateJam
    );


  } catch (errorObject) {

    jam.innerHTML = `
      <option value="">
        Gagal memuat jadwal
      </option>
    `;

  }

}


/* =====================================================
   UPDATE JAM
===================================================== */

function updateJam() {

  const tanggal =
    document.getElementById(
      'tanggal'
    ).value;


  const jam =
    document.getElementById(
      'jam'
    );


  jam.innerHTML = `
    <option value="">
      Pilih jam
    </option>
  `;


  if (!tanggal) {

    return;

  }


  const filtered =
    jadwalData.filter(
      slot => {

        return (
          slot.tanggal === tanggal &&
          slot.status !== 'PENUH'
        );

      }
    );


  filtered.forEach(
    slot => {

      const option =
        document.createElement(
          'option'
        );


      option.value =
        slot.jam;


      option.textContent =
        slot.jam +
        ' — ' +
        slot.status +
        ' (' +
        slot.tersisa +
        ' slot)';


      jam.appendChild(
        option
      );

    }
  );


  if (
    filtered.length === 0
  ) {

    jam.innerHTML = `
      <option value="">
        Tidak ada jadwal tersedia
      </option>
    `;

  }

}


/* =====================================================
   LOAD METODE
===================================================== */

async function loadMetode() {

  const select =
    document.getElementById(
      'metode'
    );


  try {

    const result =
      await apiGet(
        'metode'
      );


    if (
      !result.success
    ) {

      throw new Error(
        result.message
      );

    }


    metodeData =
      result.data || [];


    select.innerHTML = `
      <option value="">
        Pilih metode sunat
      </option>
    `;


    metodeData.forEach(
      item => {

        const option =
          document.createElement(
            'option'
          );


        option.value =
          item.nama;


        option.textContent =
          item.nama;


        select.appendChild(
          option
        );

      }
    );


  } catch (errorObject) {

    select.innerHTML = `
      <option value="">
        Gagal memuat metode
      </option>
    `;

  }

}


/* =====================================================
   URL SELECTION
===================================================== */

function loadUrlSelection() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const tanggal =
    params.get(
      'tanggal'
    );


  const jam =
    params.get(
      'jam'
    );


  const tanggalInput =
    document.getElementById(
      'tanggal'
    );


  const jamSelect =
    document.getElementById(
      'jam'
    );


  if (tanggal) {

    tanggalInput.value =
      tanggal;


    updateJam();


    setTimeout(
      function () {

        if (jam) {

          jamSelect.value =
            jam;

        }

      },
      300
    );

  }

}


/* =====================================================
   FORM
===================================================== */

function setupForm() {

  const form =
    document.getElementById(
      'bookingForm'
    );


  form.addEventListener(
    'submit',
    submitBooking
  );

}


/* =====================================================
   SUBMIT
===================================================== */

async function submitBooking(
  event
) {

  event.preventDefault();


  const button =
    document.getElementById(
      'bookingSubmit'
    );


  const message =
    document.getElementById(
      'bookingMessage'
    );


  const success =
    document.getElementById(
      'bookingSuccess'
    );


  const form =
    document.getElementById(
      'bookingForm'
    );


  const data =
    new FormData(form);


  const payload = {

    nama_anak:
      data.get(
        'nama_anak'
      ),

    umur:
      data.get(
        'umur'
      ),

    nama_orang_tua:
      data.get(
        'nama_orang_tua'
      ),

    whatsapp:
      data.get(
        'whatsapp'
      ),

    tanggal:
      data.get(
        'tanggal'
      ),

    jam:
      data.get(
        'jam'
      ),

    metode:
      data.get(
        'metode'
      ),

    catatan:
      data.get(
        'catatan'
      )

  };


  button.disabled =
    true;


  button.textContent =
    'Memproses booking...';


  message.style.display =
    'none';


  try {

    const result =
      await apiPost(
        'booking',
        payload
      );


    if (
      !result.success
    ) {

      throw new Error(
        result.message ||
        'Booking gagal'
      );

    }


    form.style.display =
      'none';


    success.style.display =
      'block';


    const booking =
      result.data;


    success.innerHTML = `

      <div class="success-message">

        <div
          style="
            text-align:center;
            font-size:45px;
          "
        >
          ✓
        </div>

        <h2
          style="
            text-align:center;
            color:#073b32;
            font-family:Amiri,serif;
            font-size:34px;
            margin:5px 0;
          "
        >
          Booking Berhasil
        </h2>

        <p
          style="
            text-align:center;
            color:#63736f;
            font-size:12px;
          "
        >
          Alhamdulillah, jadwal sunat
          berhasil dipesan.
        </p>


        <div
          style="
            margin:25px 0;
            padding:20px;
            background:white;
            border-radius:12px;
          "
        >

          <div
            style="
              font-size:10px;
              color:#63736f;
            "
          >
            NOMOR BOOKING
          </div>

          <strong
            style="
              display:block;
              margin-top:4px;
              color:#073b32;
              font-size:23px;
              letter-spacing:1px;
            "
          >
            ${escapeHTML(
              booking.id_booking
            )}
          </strong>


          <hr
            style="
              border:0;
              border-top:1px solid #e4ebe8;
              margin:15px 0;
            "
          >


          <div style="font-size:12px;">

            <strong>
              Anak:
            </strong>

            ${escapeHTML(
              booking.nama_anak
            )}

            <br>

            <strong>
              Tanggal:
            </strong>

            ${escapeHTML(
              formatTanggal(
                booking.tanggal
              )
            )}

            <br>

            <strong>
              Jam:
            </strong>

            ${escapeHTML(
              booking.jam
            )}

            <br>

            <strong>
              Metode:
            </strong>

            ${escapeHTML(
              booking.metode
            )}

          </div>

        </div>


        <div
          style="
            display:flex;
            gap:10px;
            flex-direction:column;
          "
        >

          <button
            class="btn btn-primary"
            onclick="sendBookingWhatsApp()"
          >
            💬 Konfirmasi via WhatsApp
          </button>


          <a
            href="index.html"
            class="btn btn-outline"
          >
            Kembali ke Beranda
          </a>

        </div>

      </div>

    `;


    /*
     * Simpan sementara
     * untuk tombol WhatsApp
     */

    window.lastBooking =
      booking;


  } catch (errorObject) {

    message.style.display =
      'block';


    message.className =
      'error-message';


    message.textContent =
      errorObject.message ||
      'Booking gagal. Silakan coba lagi.';


    button.disabled =
      false;


    button.textContent =
      '📅 Konfirmasi Booking';

  }

}


/* =====================================================
   WHATSAPP BOOKING
===================================================== */

function sendBookingWhatsApp() {

  const booking =
    window.lastBooking;


  if (!booking) {

    return;

  }


  const message =

    'Assalamu\\'alaikum GriyoSunat.%0A%0A' +

    'Saya sudah melakukan booking sunat.%0A%0A' +

    'Nomor Booking: ' +
    booking.id_booking +
    '%0A' +

    'Nama Anak: ' +
    booking.nama_anak +
    '%0A' +

    'Tanggal: ' +
    formatTanggal(
      booking.tanggal
    ) +
    '%0A' +

    'Jam: ' +
    booking.jam +
    '%0A' +

    'Metode: ' +
    booking.metode;


  openWhatsApp(
    decodeURIComponent(
      message
    )
  );

}
```

