document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // EFFET DE TYPING POUR LE TITRE HERO
    // ============================================
    const typingText = document.getElementById('typing-text');
    const textToType = "Bonjour, je suis Kylian Thevenet";
    let charIndex = 0;

    function typeText() {
        if (charIndex < textToType.length) {
            typingText.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 80);
        }
    }

    // Démarrer l'animation après un court délai
    setTimeout(typeText, 500);

    // ============================================
    // MODALE CV
    // ============================================
    const cvModal = document.getElementById('cv-modal');
    const openCvModalBtn = document.getElementById('open-cv-modal');
    const closeCvModalBtn = document.getElementById('close-cv-modal');

    function openModal() {
        if (cvModal) {
            cvModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Empêche le scroll
        }
    }

    function closeModal() {
        if (cvModal) {
            cvModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Réactive le scroll
        }
    }

    if (openCvModalBtn) {
        openCvModalBtn.addEventListener('click', function(event) {
            event.preventDefault();
            openModal();
        });
    }

    if (closeCvModalBtn) {
        closeCvModalBtn.addEventListener('click', closeModal);
    }

    if (cvModal) {
        cvModal.addEventListener('click', function(event) {
            if (event.target === cvModal) {
                closeModal();
            }
        });
    }

    // Fermer avec Echap
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
            // Fermer aussi le menu mobile si ouvert
            const navMenu = document.getElementById('nav-menu');
            const menuToggle = document.getElementById('menu-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });

    // ============================================
    // MENU HAMBURGER MOBILE
    // ============================================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fermer le menu quand on clique sur un lien
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ============================================
    // SCROLL REVEAL ANIMATION
    // ============================================
    const revealElements = document.querySelectorAll('.reveal');

    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    }

    // Exécuter au chargement et au scroll
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.getElementById('header');
    let lastScrollTop = 0;

    function handleHeaderScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop;
    }

    window.addEventListener('scroll', handleHeaderScroll);

    // ============================================
    // SMOOTH SCROLL POUR LES ANCRES
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ============================================
    // FORMULAIRE DE CONTACT
    // ============================================
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // IMPORTANT: Remplacez cette adresse par la vôtre
            const recipientEmail = 'kylian.thevenet@exemple.com';

            const name = document.getElementById('name').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            const body = `Message de : ${name}\n\n${message}`;

            window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }

    // ============================================
    // PARALLAX SUBTIL SUR LE HERO
    // ============================================
    const hero = document.getElementById('hero');

    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;

            if (scrolled < window.innerHeight) {
                hero.style.backgroundPositionY = `${rate}px`;
            }
        });
    }

    // ============================================
    // EFFET DE PARTICULES ALEATOIRES (Matrix-like)
    // ============================================
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: rgba(233, 69, 96, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            animation: particleFade ${Math.random() * 3 + 2}s ease-out forwards;
        `;

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 5000);
    }

    // Ajouter l'animation keyframes dynamiquement
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes particleFade {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-100px) scale(0);
            }
        }
    `;
    document.head.appendChild(styleSheet);

    // Créer des particules périodiquement
    setInterval(createParticle, 500);

    // ============================================
    // INDICATEUR DE SCROLL DISPARITION
    // ============================================
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (scrollIndicator) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }
});