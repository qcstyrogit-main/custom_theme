// ----------------------
// Back to Top Button
// ----------------------
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Show button after scrolling 200px
    if (scrollY > 200) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }

    // Adaptive color: change color gradually based on scroll
    // Example: fade from blue to dark blue as user scrolls
    // You can customize start/end colors
    const startColor = [19, 56, 128]; // rgb(19,56,128)
    const endColor = [0, 0, 0];       // rgb(0,0,0)
    const maxScroll = 1000;           // scroll distance for full transition

    const factor = Math.min(scrollY / maxScroll, 1); // 0 → 1

    const r = Math.round(startColor[0] + factor * (endColor[0] - startColor[0]));
    const g = Math.round(startColor[1] + factor * (endColor[1] - startColor[1]));
    const b = Math.round(startColor[2] + factor * (endColor[2] - startColor[2]));

    backToTop.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.15)`;
    backToTop.style.color = `rgb(${r}, ${g}, ${b})`;
});

// Optional: scroll smoothly to top on click
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ----------------------
// Hide Chat Widget
// ----------------------
document.addEventListener("DOMContentLoaded", function() {
    const chat = document.getElementById("chat-bubble");
    if(chat) chat.style.display = "none";
});

// ----------------------
// Mobile Menu & Dropdown (Smooth)
// ----------------------
document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileNav = document.getElementById("mobileNav");
    const mobileDropdownToggle = document.getElementById("mobileDropdownToggle");
    const mobileDropdown = document.getElementById("mobileDropdown");
    const backToTop = document.getElementById("back-to-top");

    // Hamburger toggle
    menuToggle.addEventListener("click", function() {
        mobileNav.classList.toggle("show");
        document.body.classList.toggle("mobile-nav-open"); // Adjust Back to Top position
    });

    // Mobile dropdown toggle (Products)
    mobileDropdownToggle.addEventListener("click", function(e) {
        e.preventDefault();
        mobileDropdown.classList.toggle("show");
    });

    // Close mobile menu & dropdown on window resize > 768px
    window.addEventListener("resize", function() {
        if(window.innerWidth > 768) {
            mobileNav.classList.remove("show");
            mobileDropdown.classList.remove("show");
            document.body.classList.remove("mobile-nav-open");
        }
    });

    // Smooth scroll for anchor links AND Home link
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            
            // NEW LOGIC: Check for the Home link (href="#") and scroll to absolute top
            if (this.getAttribute("href") === "#" || this.getAttribute("href") === "/#") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });

                // Close mobile nav after click
                if(mobileNav.classList.contains("show")) {
                    mobileNav.classList.remove("show");
                    mobileDropdown.classList.remove("show");
                    document.body.classList.remove("mobile-nav-open");
                }
                return; // Stop further execution for the Home link
            }

            // Existing logic for other section anchor links (e.g., #about-us)
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);
            if(targetElement) {
                e.preventDefault();
                const headerOffset = 60; // fixed header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Close mobile nav after click
                if(mobileNav.classList.contains("show")) {
                    mobileNav.classList.remove("show");
                    mobileDropdown.classList.remove("show");
                    document.body.classList.remove("mobile-nav-open");
                }
            }
        });
    });
});

