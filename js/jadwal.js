```javascript
/* =====================================================
   GRIYOSUNAT - JADWAL
===================================================== */

document.addEventListener(
  'DOMContentLoaded',
  loadJadwal
);


async function loadJadwal() {

  const loading =
    document.getElementById(
      'scheduleLoading'
    );

  const error =
    document.getElementById(
      'scheduleError'
    );

  const container =
    document.getElementById(
      'scheduleContainer'
    );

  const empty =
    document.getElementById(
      'scheduleEmpty'
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
        result.message ||
        'Gagal mengambil jadwal'
      );

    }


    loading.style.display =
      'none';


    if (
      !result.data ||
      result.data.length === 0
    ) {

      empty.style.display =
        'block';

      return;

    }


    /*
     * Kelompokkan berdasarkan tanggal
     */

    const grouped = {};


    result.data.forEach(slot => {

      if (
        !grouped[slot.tanggal]
      ) {

        grouped[slot.tanggal] =
          [];

      }


      grouped[slot.tanggal]
        .push(slot);

    });


    Object.keys(grouped)
      .sort()
      .forEach(tanggal => {


        const title =
          document.createElement(
            'div'
          );


        title.style.gridColumn =
          '1 / -1';


        title.style.marginTop =
          '15px';


        title.innerHTML = `

          <div
            style="
              font-weight:800;
              color:#073b32;
              font-size:14px;
              margin-bottom:4px;
            "
          >
            ${escapeHTML(
              formatTanggal(tanggal)
            )}
          </div>

        `;


        container.appendChild(
          title
        );


        grouped[tanggal]
          .forEach(slot => {

            const el =
              document.createElement(
                'div'
              );


            const status =
              String(
                slot.status || ''
              )
              .toUpperCase();


            let statusClass =
              '';


            if (
              status === 'PENUH'
            ) {

              statusClass =
                'full';

            }


            el.className =
              'slot ' +
              statusClass;


            el.innerHTML = `

              <span class="slot-time">
                ${escapeHTML(slot.jam)}
              </span>

              <span class="slot-status">
                ${escapeHTML(status)}
              </span>

              <small
                style="
                  display:block;
                  margin-top:5px;
                  font-size:9px;
                  opacity:.75;
                "
              >
                ${slot.tersisa ?? 0}
                slot tersisa
              </small>

            `;


            if (
              status !== 'PENUH'
            ) {

              el.addEventListener(
                'click',
                function () {

                  window.location.href =
                    'booking.html?' +
                    'tanggal=' +
                    encodeURIComponent(
                      slot.tanggal
                    ) +
                    '&jam=' +
                    encodeURIComponent(
                      slot.jam
                    ) +
                    '&jadwal=' +
                    encodeURIComponent(
                      slot.id
                    );

                }
              );

            }


            container.appendChild(
              el
            );

          });

      });


  } catch (errorObject) {

    loading.style.display =
      'none';


    error.style.display =
      'block';


    error.textContent =
      errorObject.message ||
      'Terjadi kesalahan saat mengambil jadwal.';

  }

}
```

