// Interactive Particles.js Configuration
document.addEventListener('DOMContentLoaded', function () {
    // 1. Inject Particles.js Library (if not present)
    if (!window.particlesJS) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
        script.onload = initParticles;
        document.head.appendChild(script);
    } else {
        initParticles();
    }

    function initParticles() {
        // Create container if it doesn't exist
        if (!document.getElementById('particles-js')) {
            const masthead = document.querySelector('header.masthead');
            if (masthead) {
                const particlesDiv = document.createElement('div');
                particlesDiv.id = 'particles-js';
                particlesDiv.style.position = 'absolute';
                particlesDiv.style.width = '100%';
                particlesDiv.style.height = '100%';
                particlesDiv.style.top = '0';
                particlesDiv.style.left = '0';
                particlesDiv.style.zIndex = '1'; // Behind text (z-index 2), on top of bg image
                masthead.prepend(particlesDiv);
            }
        }

        // Initialize
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#ffffff" }, // White particles
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 6, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "repulse" }, // Cool repulse effect
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "repulse": { "distance": 200, "duration": 0.4 },
                    "push": { "particles_nb": 4 }
                }
            },
            "retina_detect": true
        });
    }
});
