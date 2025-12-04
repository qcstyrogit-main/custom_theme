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


function openViber() {
    const viberURL = "viber://chat?number=+639178143250";
    const fallbackURL = "https://www.viber.com/download"; // in case Viber is not installed

    // Mobile or desktop
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
        // Try opening Viber app
        window.location.href = viberURL;

        // Fallback after 1.5 seconds
        setTimeout(() => {
            window.location.href = fallbackURL;
        }, 1500);
    } else {
        // Desktop fallback
        alert("Viber app cannot be opened directly on desktop. Please install Viber.");
        window.open(fallbackURL, "_blank");
    }
}
