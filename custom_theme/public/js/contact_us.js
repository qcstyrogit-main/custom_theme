document.addEventListener("DOMContentLoaded", function() {
    const areaSelect = document.getElementById("area");
    const offices = document.querySelectorAll(".contact_row");

    function filterOffices() {
        const selectedArea = areaSelect.value;

        offices.forEach(office => {
            if (selectedArea === "all" || office.dataset.area === selectedArea) {
                office.style.display = "flex"; // show the office row
            } else {
                office.style.display = "none"; // hide the office row
            }
        });
    }

    // Filter when the select changes
    areaSelect.addEventListener("change", filterOffices);

    // Initial filter on page load
    filterOffices();
});


document.addEventListener("DOMContentLoaded", function() {
    const textElements = document.querySelectorAll('.contact_us-section, .contact_text, .contact-header, .area-filter label');

    textElements.forEach(el => {
        // Get computed background color
        const bg = window.getComputedStyle(el).backgroundColor;
        if (bg) {
            const rgb = bg.match(/\d+/g);
            if (rgb) {
                const brightness = Math.round(((parseInt(rgb[0]) * 299) +
                                              (parseInt(rgb[1]) * 587) +
                                              (parseInt(rgb[2]) * 114)) / 1000);
                el.style.color = (brightness > 150) ? '#000' : '#fff';
            }
        }
    });
});

