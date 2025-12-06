/*!
 * Creative Interactions for Youthful Agency Theme
 */

document.addEventListener('DOMContentLoaded', function () {
    // 1. 3D Tilt Effect for Services & Portfolio
    const tiltElements = document.querySelectorAll('#services .col-md-4, .portfolio-item');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', handleTilt);
        el.addEventListener('mouseleave', resetTilt);
    });

    function handleTilt(e) {
        const el = this;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 10;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        el.style.zIndex = 10;

        // Add dynamic glare (if supported by CSS)
        // el.style.boxShadow = ...
    }

    function resetTilt() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        this.style.zIndex = 1;
    }

    // 2. Scroll Reveal Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.service-heading, .section-heading, .timeline > li');
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });

    // Add class for CSS to handle
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .aos-animate {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        </style>
    `);
});
