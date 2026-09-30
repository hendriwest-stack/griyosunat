
/* =====================================================
   GRIYOSUNAT - MAIN JS
===================================================== */
async function apiGet(action, params = {}) {
    const url = new URL(CONFIG.API_URL);

    url.searchParams.set("action", action);

    Object.keys(params).forEach(key => {
        url.searchParams.set(key, params[key]);
    });

    const response = await fetch(url.toString());

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


