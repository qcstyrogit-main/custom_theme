document.addEventListener("DOMContentLoaded", () => {
    const eventCardsContainer = document.querySelector('.events-cards');
    const eventWrapper = document.querySelector('.events-wrapper');
    const eventCards = document.querySelectorAll('.events-cards .event-card');

    // Duplicate cards for infinite scrolling
    eventCards.forEach(card => {
        const clone = card.cloneNode(true);
        eventCardsContainer.appendChild(clone);
    });

    let scrollSpeed = 0.5; // pixels per frame
    let isDragging = false;
    let startX, scrollLeft;

    const animate = () => {
        if (!isDragging) {
            eventCardsContainer.scrollLeft += scrollSpeed;
            // Reset scroll for infinite loop
            if (eventCardsContainer.scrollLeft >= eventCardsContainer.scrollWidth / 2) {
                eventCardsContainer.scrollLeft = 0;
            }
        }
        requestAnimationFrame(animate);
    };
    animate();

    // ===========================
    // DRAG & SWIPE SUPPORT
    // ===========================
    eventCardsContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - eventCardsContainer.offsetLeft;
        scrollLeft = eventCardsContainer.scrollLeft;
        eventCardsContainer.classList.add('dragging');
    });

    eventCardsContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        eventCardsContainer.classList.remove('dragging');
    });

    eventCardsContainer.addEventListener('mouseup', () => {
        isDragging = false;
        eventCardsContainer.classList.remove('dragging');
    });

    eventCardsContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const x = e.pageX - eventCardsContainer.offsetLeft;
        const walk = x - startX;
        eventCardsContainer.scrollLeft = scrollLeft - walk;
    });

    // Touch events
    eventCardsContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - eventCardsContainer.offsetLeft;
        scrollLeft = eventCardsContainer.scrollLeft;
    });

    eventCardsContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - eventCardsContainer.offsetLeft;
        const walk = x - startX;
        eventCardsContainer.scrollLeft = scrollLeft - walk;
    });

    eventCardsContainer.addEventListener('touchend', () => {
        isDragging = false;
    });

    // ===========================
    // HOVER PAUSE
    // ===========================
    eventWrapper.addEventListener('mouseenter', () => {
        scrollSpeed = 0;
    });
    eventWrapper.addEventListener('mouseleave', () => {
        scrollSpeed = 0.5;
    });
});
