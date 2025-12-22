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

    // Adaptive color based on scroll
    const startColor = [19, 56, 128]; // rgb(19,56,128)
    const endColor = [0, 0, 0];       // rgb(0,0,0)
    const maxScroll = 1000;

    const factor = Math.min(scrollY / maxScroll, 1);

    const r = Math.round(startColor[0] + factor * (endColor[0] - startColor[0]));
    const g = Math.round(startColor[1] + factor * (endColor[1] - startColor[1]));
    const b = Math.round(startColor[2] + factor * (endColor[2] - startColor[2]));

    backToTop.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.15)`;
    backToTop.style.color = `rgb(${r}, ${g}, ${b})`;
});

// Scroll smoothly to top on click
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
// Mobile Menu & Dropdown
// ----------------------
document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileNav = document.getElementById("mobileNav");
    const mobileDropdownToggle = document.getElementById("mobileDropdownToggle");
    const mobileDropdown = document.getElementById("mobileDropdown");

    menuToggle.addEventListener("click", function() {
        this.classList.toggle("active");
        mobileNav.classList.toggle("show");
        if(mobileNav.classList.contains("show")) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    mobileDropdownToggle.addEventListener("click", function(e) {
        e.preventDefault();
        mobileDropdown.classList.toggle("show");
        const expanded = this.getAttribute("aria-expanded") === "true";
        this.setAttribute("aria-expanded", !expanded);
    });

    window.addEventListener("resize", function() {
        if(window.innerWidth > 768) {
            mobileNav.classList.remove("show");
            menuToggle.classList.remove("active");
            mobileDropdown.classList.remove("show");
            mobileDropdownToggle.setAttribute("aria-expanded", "false");
            document.body.style.overflow = '';
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const href = this.getAttribute("href");

            if (href === "#" || href === "/#") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if(targetElement) {
                    e.preventDefault();
                    const headerOffset = 60;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }
            }

            // Close mobile menu after click
            mobileNav.classList.remove("show");
            menuToggle.classList.remove("active");
            mobileDropdown.classList.remove("show");
            mobileDropdownToggle.setAttribute("aria-expanded", "false");
            document.body.style.overflow = '';
        });
    });
});


// ----------------------
// Hide/Show Header on Scroll
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".home-header");
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    header.style.transform = "translateY(-100%)";
                } else {
                    header.style.transform = "translateY(0)";
                }
                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    });
});
