// Particles.js configuration
document.addEventListener('DOMContentLoaded', () => {
    if (window.particlesJS) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#9b59b6'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    },
                    polygon: {
                        nb_sides: 5
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#d4af37',
                    opacity: 0.3,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }

    // Scroll Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    // Elements to animate
    const animatedElements = document.querySelectorAll('.card, .large-card, .entity-card');
    animatedElements.forEach(el => observer.observe(el));

    // 3D Entity Hover Effect
    const entityCards = document.querySelectorAll('.entity-card');
    entityCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15; // Max 15 deg
            const rotateY = ((x - centerX) / centerX) * 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 3D Universe Parallax Effect
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
        
        const universeBg = document.querySelector('.bg-video');
        const particlesDiv = document.getElementById('particles-js');
        
        if (universeBg) {
            // Move the background slowly for depth
            universeBg.style.transform = `translate(${x * -10}px, ${y * -10}px) scale(1.05)`;
        }
        
        if (particlesDiv) {
            // Move the particles faster to create a 3D effect
            particlesDiv.style.transform = `translate(${x * -50}px, ${y * -50}px)`;
        }

        const floatingTexts = document.querySelectorAll('.floating-text');
        floatingTexts.forEach(text => {
            // Apply a 3D tilt and shift that reacts to mouse 'gravity'
            text.style.transform = `translate(${x * 15}px, ${y * 15}px) rotateX(${y * -20}deg) rotateY(${x * 20}deg)`;
        });
    });

    // Incident Menu Toggle Logic
    const menuOptions = document.querySelectorAll('.menu-option');
    menuOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const isActive = this.classList.contains('active');
                
                // Hide all sections and remove active from all options
                document.querySelectorAll('.incident-section').forEach(sec => {
                    sec.style.display = 'none';
                    sec.classList.remove('visible'); // Assuming there might be a visible class for animation
                });
                menuOptions.forEach(opt => opt.classList.remove('active'));
                
                // If it wasn't active, open it
                if (!isActive) {
                    this.classList.add('active');
                    targetSection.style.display = 'block';
                    // Trigger reflow and add class for potential animations
                    void targetSection.offsetWidth;
                    targetSection.classList.add('visible');
                }
            }
        });
    });
    // Audio Logic - Continuous Playback
    const audio = document.getElementById('bg-audio');

    if (audio) {
        // Ensure volume is up and it's not muted
        audio.muted = false;
        audio.volume = 0.5; // Set a balanced volume

        const tryPlayAudio = () => {
            if (audio.paused) {
                audio.play().then(() => {
                    console.log("Background audio initiated.");
                    // Remove listeners once playing
                    ['mousedown', 'mousemove', 'scroll', 'keydown', 'touchstart'].forEach(type => {
                        document.removeEventListener(type, tryPlayAudio);
                    });
                }).catch(err => {
                    // Autoplay might be blocked by browser until interaction
                });
            }
        };

        // Aggressive attempt to play on any early interaction
        ['mousedown', 'mousemove', 'scroll', 'keydown', 'touchstart'].forEach(type => {
            document.addEventListener(type, tryPlayAudio, { once: true, passive: true });
        });

        // Backup polling to ensure it keeps playing if it was somehow paused
        setInterval(() => {
            if (audio.paused) {
                audio.play().catch(() => {});
            }
        }, 2000);
    }
});
