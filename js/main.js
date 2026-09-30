
/* =====================================================
   GRIYOSUNAT - MAIN JS
===================================================== */
// =====================================================
// API GET
// =====================================================

async function apiGet(action, params = {}) {

    if (typeof CONFIG === "undefined") {
        throw new Error("CONFIG belum dimuat. Periksa config.js");
    }

    if (!CONFIG.API_URL || CONFIG.API_URL.includes("GANTI_DENGAN")) {
        throw new Error("URL Web App GAS belum diisi di config.js");
    }

    const url = new URL(CONFIG.API_URL);

    url.searchParams.set("action", action);

    Object.keys(params).forEach(key => {
        if (
            params[key] !== undefined &&
            params[key] !== null &&
            params[key] !== ""
        ) {
            url.searchParams.set(key, params[key]);
        }
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(
            "Server API gagal. HTTP " + response.status
        );
    }

    return await response.json();
}

/* =====================================================
   MOBILE MENU
===================================================== */

document.addEventListener(
  'DOMContentLoaded',
  function () {

    const toggle =
      document.getElementById(
        'menuToggle'
      );

    const nav =
      document.getElementById(
        'mainNav'
      );


    if (
      toggle &&
      nav
    ) {

      toggle.addEventListener(
        'click',
        function () {

          nav.classList.toggle(
            'show'
          );

        }
      );


      nav.querySelectorAll('a')
        .forEach(link => {

          link.addEventListener(
            'click',
            function () {

              nav.classList.remove(
                'show'
              );

            }
          );

        });

    }

  }
);


/* =====================================================
   SET ACTIVE MENU
===================================================== */

document.addEventListener(
  'DOMContentLoaded',
  function () {

    const current =
      window.location.pathname
        .split('/')
        .pop()
        || 'index.html';


    document
      .querySelectorAll(
        '.main-nav a'
      )
      .forEach(link => {

        const href =
          link
            .getAttribute('href')
            .split('/')
            .pop();


        if (
          href === current
        ) {

          link.classList.add(
            'active'
          );

        }

      });

  }
);


/* =====================================================
   DATE FORMAT
===================================================== */

function formatTanggal(
  tanggal
) {

  if (!tanggal) {

    return '-';

  }


  const parts =
    tanggal.split('-');


  if (
    parts.length !== 3
  ) {

    return tanggal;

  }


  const date =
    new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );


  return date.toLocaleDateString(
    'id-ID',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }
  );

}


/* =====================================================
   FORMAT RUPIAH
===================================================== */

function formatRupiah(
  value
) {

  if (
    value === '' ||
    value === null ||
    value === undefined
  ) {

    return '-';

  }


  const number =
    Number(
      String(value)
        .replace(
          /[^0-9]/g,
          ''
        )
    );


  if (isNaN(number)) {

    return value;

  }


  return new Intl.NumberFormat(
    'id-ID',
    {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }
  ).format(number);

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
  value
) {

  return String(
    value ?? ''
  )
  .replace(
    /&/g,
    '&amp;'
  )
  .replace(
    /</g,
    '&lt;'
  )
  .replace(
    />/g,
    '&gt;'
  )
  .replace(
    /"/g,
    '&quot;'
  )
  .replace(
    /'/g,
    '&#039;'
  );

}


