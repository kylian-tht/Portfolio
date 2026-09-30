/**
 * PORTFOLIO KYLIAN THEVENET - SCRIPTS PRINCIPAUX
 * Boîtier PC 3D en lévitation avec ventilateurs rotatifs lumineux (Three.js),
 * Effet 3D Tilt sur les cartes, Lightbox plein écran, Toast & Interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initScrollReveal();
    initCvModal();
    initEmailCopy();
    initCards3DTilt();
    initThreeJsPcCase();
    initSmoothAnchors();
    initUniversalLightbox();
});

/* ==========================================================================
   1. GESTION DU HEADER & NAVIGATION
   ========================================================================== */
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active', isActive);
        menuToggle.setAttribute('aria-expanded', isActive);
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = document.getElementById('header')?.offsetHeight || 70;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: elementPosition - headerHeight - 16,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/* ==========================================================================
   2. SCROLL REVEAL OPTIMISÉ (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.01,
            rootMargin: '100px 0px 50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }
}

/* ==========================================================================
   3. EFFET 3D TILT SUR LES CARTES
   ========================================================================== */
function initCards3DTilt() {
    if (window.matchMedia('(hover: none) or (max-width: 768px)').matches) return;

    const tiltCards = document.querySelectorAll('.tilt-card, .projet-card');

    tiltCards.forEach(card => {
        let bounds;

        function updateBounds() {
            bounds = card.getBoundingClientRect();
        }

        function onMouseMove(e) {
            if (!bounds) updateBounds();
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;

            const halfWidth = bounds.width / 2;
            const halfHeight = bounds.height / 2;

            const rotateX = ((mouseY - halfHeight) / halfHeight) * -7;
            const rotateY = ((mouseX - halfWidth) / halfWidth) * 7;

            const percentX = (mouseX / bounds.width) * 100;
            const percentY = (mouseY / bounds.height) * 100;
            card.style.setProperty('--mouse-x', `${percentX}%`);
            card.style.setProperty('--mouse-y', `${percentY}%`);

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
        }

        function onMouseEnter() {
            updateBounds();
            card.style.transition = 'transform 0.1s ease-out, box-shadow 0.25s ease, border-color 0.25s ease';
        }

        function onMouseLeave() {
            card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }

        card.addEventListener('mouseenter', onMouseEnter);
        card.addEventListener('mousemove', onMouseMove);
        card.addEventListener('mouseleave', onMouseLeave);
        window.addEventListener('resize', updateBounds);
    });
}

/* ==========================================================================
   4. SCÈNE 3D THREE.JS : BOÎTIER PC GAMER & WORKSTATION ULTRA-DÉTAILLÉ
   ========================================================================== */
function initThreeJsPcCase() {
    const container = document.getElementById('canvas-3d-container');
    if (!container || typeof THREE === 'undefined') return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    
    // Caméra 3D optimisée pour cadrer l'ensemble avec perspective 3/4
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(4.8, 2.1, 7.0);
    camera.lookAt(0, 0.15, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Groupe principal du boîtier PC
    const pcTower = new THREE.Group();
    pcTower.position.set(0, 0.15, 0);
    scene.add(pcTower);

    // --- ÉCLAIRAGES CINÉMATOGRAPHIQUES ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.9);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    const blueRimLight = new THREE.DirectionalLight(0x2563eb, 2.6);
    blueRimLight.position.set(-6, -2, -5);
    scene.add(blueRimLight);

    const softFillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    softFillLight.position.set(4, -3, 5);
    scene.add(softFillLight);

    // Lumière interne cyan & blanc doux
    const internalLedLight = new THREE.PointLight(0x38bdf8, 3.8, 6.5);
    internalLedLight.position.set(0.2, 0.65, 0.1);
    pcTower.add(internalLedLight);

    const internalGpuLight = new THREE.PointLight(0x2563eb, 2.5, 4);
    internalGpuLight.position.set(0.1, -0.2, 0.3);
    pcTower.add(internalGpuLight);

    // --- MATÉRIAUX RÉALISTES PBR ---
    const caseFrameMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.85,
        roughness: 0.32
    });

    const innerChassisMat = new THREE.MeshStandardMaterial({
        color: 0x090d16,
        metalness: 0.45,
        roughness: 0.65
    });

    const pcbMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.3,
        roughness: 0.55
    });

    const aluminiumMat = new THREE.MeshStandardMaterial({
        color: 0xcfd8dc,
        metalness: 0.95,
        roughness: 0.18
    });

    const copperMat = new THREE.MeshStandardMaterial({
        color: 0xd97736,
        metalness: 0.92,
        roughness: 0.25
    });

    const chromeMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        metalness: 1.0,
        roughness: 0.08
    });

    const goldMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.95,
        roughness: 0.2
    });

    const darkPlasticMat = new THREE.MeshStandardMaterial({
        color: 0x1e2430,
        metalness: 0.1,
        roughness: 0.85
    });

    const usbBlueMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const cyanGlowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const blueGlowMat = new THREE.MeshBasicMaterial({ color: 0x2563eb });
    const whiteLedMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const psuLabelMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37, // Gold 850W
        metalness: 0.9,
        roughness: 0.3
    });

    const glassMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.22,
        roughness: 0.05,
        metalness: 0.95
    });

    const glassBorderMat = new THREE.MeshBasicMaterial({
        color: 0x090d16,
        transparent: true,
        opacity: 0.85
    });

    const fanBladeMat = new THREE.MeshStandardMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
        metalness: 0.35
    });

    // ==========================================
    // 1. STRUCTURE EXTÉRIEURE DU BOÎTIER
    // ==========================================
    // Toit et Sol
    const topPanel = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.12, 3.25), caseFrameMat);
    topPanel.position.set(0, 1.72, 0);
    pcTower.add(topPanel);

    // Filtre à poussière magnétique supérieur (grille perforée)
    const dustFilter = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.02, 2.4), darkPlasticMat);
    dustFilter.position.set(-0.1, 1.79, -0.2);
    pcTower.add(dustFilter);

    const botPanel = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.12, 3.25), caseFrameMat);
    botPanel.position.set(0, -1.72, 0);
    pcTower.add(botPanel);

    // 4 Pieds massifs avec semelles chromées
    const footGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.16, 24);
    const footPositions = [
        [-0.65, -1.86, 1.3], [0.65, -1.86, 1.3],
        [-0.65, -1.86, -1.3], [0.65, -1.86, -1.3]
    ];
    footPositions.forEach(pos => {
        const foot = new THREE.Mesh(footGeo, caseFrameMat);
        foot.position.set(...pos);
        const footRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 8, 24), chromeMat);
        footRing.rotation.x = Math.PI / 2;
        footRing.position.set(pos[0], pos[1] - 0.05, pos[2]);
        pcTower.add(foot);
        pcTower.add(footRing);
    });

    // Panneau droit (métal plein)
    const rightPanel = new THREE.Mesh(new THREE.BoxGeometry(0.06, 3.44, 3.25), caseFrameMat);
    rightPanel.position.set(-0.84, 0, 0);
    pcTower.add(rightPanel);

    // Façade avant (Mesh métallique aéré avec chanfreins)
    const frontBezel = new THREE.Mesh(new THREE.BoxGeometry(1.68, 3.44, 0.14), caseFrameMat);
    frontBezel.position.set(0, 0, 1.63);
    pcTower.add(frontBezel);

    const frontMesh = new THREE.Mesh(new THREE.BoxGeometry(1.36, 3.0, 0.04), innerChassisMat);
    frontMesh.position.set(0, 0, 1.71);
    pcTower.add(frontMesh);

    // Panneau arrière avec I/O Shield et grilles PCIe
    const backPanel = new THREE.Mesh(new THREE.BoxGeometry(1.68, 3.44, 0.06), innerChassisMat);
    backPanel.position.set(0, 0, -1.63);
    pcTower.add(backPanel);

    // ==========================================
    // 2. PANNEAU I/O SUPÉRIEUR (PORTS USB & POWER)
    // ==========================================
    const ioStrip = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.04, 1.4), darkPlasticMat);
    ioStrip.position.set(0.62, 1.79, 0.7);
    pcTower.add(ioStrip);

    // Bouton Power circulaire avec anneau LED
    const powerButtonBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 24), chromeMat);
    powerButtonBase.position.set(0.62, 1.81, 1.25);
    pcTower.add(powerButtonBase);

    const powerButtonLedRing = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.015, 8, 24), cyanGlowMat);
    powerButtonLedRing.rotation.x = Math.PI / 2;
    powerButtonLedRing.position.set(0.62, 1.83, 1.25);
    pcTower.add(powerButtonLedRing);

    // Bouton Reset plus petit
    const resetBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 16), chromeMat);
    resetBtn.position.set(0.62, 1.81, 1.05);
    pcTower.add(resetBtn);

    // Port USB Type-C (Ovale métallique)
    const typeCOuter = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.12), chromeMat);
    typeCOuter.position.set(0.62, 1.81, 0.88);
    pcTower.add(typeCOuter);
    const typeCInner = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.08), innerChassisMat);
    typeCInner.position.set(0.62, 1.82, 0.88);
    pcTower.add(typeCInner);

    // 2x Ports USB 3.0 (Bleu électrique interne avec contour métallique)
    for (let u = 0; u < 2; u++) {
        const zPos = 0.68 - u * 0.18;
        const usbHousing = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.13), chromeMat);
        usbHousing.position.set(0.62, 1.81, zPos);
        pcTower.add(usbHousing);

        const usbTongue = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.035, 0.08), usbBlueMat);
        usbTongue.position.set(0.62, 1.82, zPos);
        pcTower.add(usbTongue);
    }

    // Prises Jack Audio 3.5mm (Micro & Casque avec anneaux dorés)
    const jackMic = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.012, 8, 16), goldMat);
    jackMic.rotation.x = Math.PI / 2;
    jackMic.position.set(0.62, 1.81, 0.28);
    pcTower.add(jackMic);

    const jackAudio = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.012, 8, 16), chromeMat);
    jackAudio.rotation.x = Math.PI / 2;
    jackAudio.position.set(0.62, 1.81, 0.16);
    pcTower.add(jackAudio);

    // ==========================================
    // 3. CACHE ALIMENTATION (PSU SHROUD) & BLOC PSU
    // ==========================================
    const psuShroud = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.82, 3.16), innerChassisMat);
    psuShroud.position.set(0, -1.25, 0);
    pcTower.add(psuShroud);

    // Ligne LED profilée sur le cache alimentation
    const shroudLed = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 2.6), cyanGlowMat);
    shroudLed.position.set(0.79, -0.86, 0);
    pcTower.add(shroudLed);

    // Fenêtre latérale laissant voir l'alimentation
    const psuWindow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.44, 0.95), innerChassisMat);
    psuWindow.position.set(0.79, -1.28, -0.7);
    pcTower.add(psuWindow);

    // Bloc d'alimentation (PSU) visible à l'intérieur
    const psuBody = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.72, 1.2), darkPlasticMat);
    psuBody.position.set(0, -1.28, -0.8);
    pcTower.add(psuBody);

    // Badge "850W GOLD" sur le bloc alim
    const psuBadge = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.18, 0.5), psuLabelMat);
    psuBadge.position.set(0.72, -1.28, -0.7);
    pcTower.add(psuBadge);

    // ==========================================
    // 4. CARTE MÈRE ET COMPOSANTS ÉLECTRONIQUES
    // ==========================================
    // PCB Carte Mère ATX
    const mobo = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.25, 2.45), pcbMat);
    mobo.position.set(-0.72, 0.42, -0.15);
    pcTower.add(mobo);

    // Dissipateurs thermiques VRM massifs en aluminium taillé
    const vrmTop = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.32, 1.05), aluminiumMat);
    vrmTop.position.set(-0.62, 1.25, -0.38);
    pcTower.add(vrmTop);

    const vrmLeft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.75, 0.32), aluminiumMat);
    vrmLeft.position.set(-0.62, 0.76, -0.92);
    pcTower.add(vrmLeft);

    // Condensateurs solides cylindriques métalliques (Rangée de 6)
    const capGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.14, 16);
    for (let c = 0; c < 6; c++) {
        const cap = new THREE.Mesh(capGeo, aluminiumMat);
        cap.rotation.z = Math.PI / 2;
        cap.position.set(-0.63, 1.02 - c * 0.12, -0.72);
        pcTower.add(cap);

        const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.02, 16), goldMat);
        capTop.rotation.z = Math.PI / 2;
        capTop.position.set(-0.55, 1.02 - c * 0.12, -0.72);
        pcTower.add(capTop);
    }

    // Dissipateur M.2 NVMe SSD avec motif à ailettes
    const m2Heatsink = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.78), aluminiumMat);
    m2Heatsink.position.set(-0.65, 0.28, -0.3);
    pcTower.add(m2Heatsink);

    const m2Led = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.6), cyanGlowMat);
    m2Led.position.set(-0.58, 0.28, -0.3);
    pcTower.add(m2Led);

    // ==========================================
    // 5. BARRETTES DE RAM DDR5 RGB (4 SLOTS)
    // ==========================================
    for (let r = 0; r < 4; r++) {
        const zRam = 0.05 + r * 0.11;
        // Dissipateur noir
        const ramHeatsink = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.52, 0.075), darkPlasticMat);
        ramHeatsink.position.set(-0.55, 0.82, zRam);
        pcTower.add(ramHeatsink);

        // Bande diffuseur RGB sur le dessus
        const ramRgb = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.06, 0.075), (r % 2 === 0) ? cyanGlowMat : blueGlowMat);
        ramRgb.position.set(-0.54, 1.09, zRam);
        pcTower.add(ramRgb);
    }

    // ==========================================
    // 6. VENTIRAD CPU / WATERBLOCK AIO AVEC TUYAUX
    // ==========================================
    // Pompe / Waterblock circulaire CPU (effet miroir infini)
    const pumpBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 32), darkPlasticMat);
    pumpBase.rotation.z = Math.PI / 2;
    pumpBase.position.set(-0.60, 0.76, -0.36);
    pcTower.add(pumpBase);

    // Anneau lumineux circulaire sur la pompe
    const pumpRing = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 12, 32), cyanGlowMat);
    pumpRing.rotation.y = Math.PI / 2;
    pumpRing.position.set(-0.50, 0.76, -0.36);
    pcTower.add(pumpRing);

    // Logo central blanc sur la pompe
    const pumpLogo = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 16), whiteLedMat);
    pumpLogo.rotation.z = Math.PI / 2;
    pumpLogo.position.set(-0.49, 0.76, -0.36);
    pcTower.add(pumpLogo);

    // Radiateur AIO supérieur (fixé sous le top panel)
    const aioRadiator = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 2.3), aluminiumMat);
    aioRadiator.position.set(0, 1.55, -0.1);
    pcTower.add(aioRadiator);

    // Tuyaux tressés souples du watercooling (courbes douces vers le haut)
    const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x111827,
        roughness: 0.85,
        metalness: 0.2
    });

    const curve1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.52, 0.84, -0.28),
        new THREE.Vector3(-0.35, 1.15, -0.15),
        new THREE.Vector3(-0.15, 1.42, -0.25)
    ]);
    const tube1 = new THREE.Mesh(new THREE.TubeGeometry(curve1, 24, 0.045, 12, false), tubeMat);
    pcTower.add(tube1);

    const curve2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.52, 0.68, -0.26),
        new THREE.Vector3(-0.25, 0.98, -0.05),
        new THREE.Vector3(0.05, 1.42, -0.15)
    ]);
    const tube2 = new THREE.Mesh(new THREE.TubeGeometry(curve2, 24, 0.045, 12, false), tubeMat);
    pcTower.add(tube2);

    // Colliers chromés sur les tuyaux
    const tubeRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.015, 8, 16), chromeMat);
    tubeRing1.position.set(-0.52, 0.84, -0.28);
    pcTower.add(tubeRing1);

    const tubeRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.015, 8, 16), chromeMat);
    tubeRing2.position.set(-0.52, 0.68, -0.26);
    pcTower.add(tubeRing2);

    // ==========================================
    // 7. CARTE GRAPHIQUE HAUTE DÉFINITION (GPU TRIPLE-FAN)
    // ==========================================
    const gpuGroup = new THREE.Group();
    gpuGroup.position.set(-0.22, 0.08, 0.08);
    pcTower.add(gpuGroup);

    // Corps principal du GPU (épais 3 slots)
    const gpuShroud = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.44, 2.15), caseFrameMat);
    gpuGroup.add(gpuShroud);

    // Backplate supérieure en métal brossé bicolore
    const gpuBackplate = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.04, 2.18), aluminiumMat);
    gpuBackplate.position.set(0, 0.23, 0);
    gpuGroup.add(gpuBackplate);

    // Découpe géométrique sur la backplate (Flow-Through ventilation)
    const gpuFlowCutout = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.05, 0.55), innerChassisMat);
    gpuFlowCutout.position.set(0, 0.23, 0.7);
    gpuGroup.add(gpuFlowCutout);

    // Ailettes du dissipateur thermique visibles sur la tranche latérale
    const gpuFins = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 1.8), aluminiumMat);
    gpuFins.position.set(0.33, 0, 0);
    gpuGroup.add(gpuFins);

    // Ligne LED RGB latérale dynamique
    const gpuLedBar = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 1.45), cyanGlowMat);
    gpuLedBar.position.set(0.35, 0.12, -0.05);
    gpuGroup.add(gpuLedBar);

    // Câbles d'alimentation tressés 2x 8-Pin avec peignes de câble (cable combs)
    for (let pin = 0; pin < 2; pin++) {
        const pinZ = -0.3 + pin * 0.14;
        const cableCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.25, 0.24, pinZ),
            new THREE.Vector3(0.52, 0.15, pinZ + 0.08),
            new THREE.Vector3(0.68, -0.85, pinZ + 0.12)
        ]);
        const pcieCable = new THREE.Mesh(new THREE.TubeGeometry(cableCurve, 18, 0.04, 10, false), tubeMat);
        gpuGroup.add(pcieCable);

        // Peigne de câble bleu
        const comb = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.07, 0.09), usbBlueMat);
        comb.position.set(0.44, 0.19, pinZ + 0.04);
        gpuGroup.add(comb);
    }

    // Équerre PCIe arrière chromée
    const pcieBracket = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.75, 0.04), chromeMat);
    pcieBracket.position.set(0.15, -0.08, -1.09);
    gpuGroup.add(pcieBracket);

    // ==========================================
    // 8. VENTILATEURS ROTATIFS HAUTE PRÉCISION
    // ==========================================
    const spinningFans = [];

    function createHighDetailFan(radius, bladeCount, haloColorMat, speed = 0.07) {
        const fanGroup = new THREE.Group();

        // Cadre extérieur carré avec silentblocs
        const frameSize = radius * 2.1;
        const fanHousing = new THREE.Mesh(new THREE.BoxGeometry(frameSize, frameSize, 0.06), innerChassisMat);
        fanGroup.add(fanHousing);

        // Anneau lumineux circulaire externe
        const ringGeo = new THREE.TorusGeometry(radius, 0.038, 12, 32);
        const ringMesh = new THREE.Mesh(ringGeo, haloColorMat);
        fanGroup.add(ringMesh);

        // Anneau lumineux interne (diffuseur central)
        const innerRingGeo = new THREE.TorusGeometry(radius * 0.42, 0.025, 10, 24);
        const innerRingMesh = new THREE.Mesh(innerRingGeo, haloColorMat);
        fanGroup.add(innerRingMesh);

        // Rotor avec pales profilées
        const rotor = new THREE.Group();
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.36, radius * 0.36, 0.08, 24), caseFrameMat);
        hub.rotation.x = Math.PI / 2;
        rotor.add(hub);

        // Pastille centrale miroir/chrome
        const hubCap = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.09, 16), chromeMat);
        hubCap.rotation.x = Math.PI / 2;
        rotor.add(hubCap);

        const bladeGeo = new THREE.BoxGeometry(radius * 0.65, 0.018, radius * 0.24);
        for (let b = 0; b < bladeCount; b++) {
            const blade = new THREE.Mesh(bladeGeo, fanBladeMat);
            blade.position.x = radius * 0.48;
            blade.rotation.y = 0.32; // Angle aérodynamique

            const pivot = new THREE.Group();
            pivot.rotation.z = (b / bladeCount) * Math.PI * 2;
            pivot.add(blade);
            rotor.add(pivot);
        }

        fanGroup.add(rotor);
        spinningFans.push({ rotor, speed });

        return fanGroup;
    }

    // 3x Ventilateurs avant (Façade)
    const frontFan1 = createHighDetailFan(0.38, 9, cyanGlowMat, 0.075);
    frontFan1.position.set(0, 1.05, 1.56);
    pcTower.add(frontFan1);

    const frontFan2 = createHighDetailFan(0.38, 9, blueGlowMat, 0.072);
    frontFan2.position.set(0, 0.22, 1.56);
    pcTower.add(frontFan2);

    const frontFan3 = createHighDetailFan(0.38, 9, cyanGlowMat, 0.078);
    frontFan3.position.set(0, -0.62, 1.56);
    pcTower.add(frontFan3);

    // 1x Ventilateur arrière (Extraction)
    const rearFan = createHighDetailFan(0.36, 7, cyanGlowMat, 0.08);
    rearFan.position.set(0, 0.82, -1.54);
    pcTower.add(rearFan);

    // 3x Petits ventilateurs GPU sous la carte
    for (let gf = 0; gf < 3; gf++) {
        const gpuFan = createHighDetailFan(0.24, 7, blueGlowMat, 0.11);
        gpuFan.rotation.x = Math.PI / 2;
        gpuFan.position.set(0, -0.23, -0.68 + gf * 0.68);
        gpuGroup.add(gpuFan);
    }

    // ==========================================
    // 9. VITRE EN VERRE TREMPÉ AVEC VIS À MAIN CHROMÉES
    // ==========================================
    // Vitre principale
    const glassPanel = new THREE.Mesh(new THREE.BoxGeometry(0.04, 3.42, 3.16), glassMat);
    glassPanel.position.set(0.82, 0, 0);
    pcTower.add(glassPanel);

    // Cadre noir sérigraphié sur le pourtour de la vitre
    const glassBorderTop = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.14, 3.16), glassBorderMat);
    glassBorderTop.position.set(0.82, 1.64, 0);
    pcTower.add(glassBorderTop);

    const glassBorderBot = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.14, 3.16), glassBorderMat);
    glassBorderBot.position.set(0.82, -1.64, 0);
    pcTower.add(glassBorderBot);

    const glassBorderLeft = new THREE.Mesh(new THREE.BoxGeometry(0.045, 3.42, 0.14), glassBorderMat);
    glassBorderLeft.position.set(0.82, 0, 1.51);
    pcTower.add(glassBorderLeft);

    const glassBorderRight = new THREE.Mesh(new THREE.BoxGeometry(0.045, 3.42, 0.14), glassBorderMat);
    glassBorderRight.position.set(0.82, 0, -1.51);
    pcTower.add(glassBorderRight);

    // 4 Vis à main moletées chromées (Thumbscrews) aux 4 coins de la vitre
    const thumbscrewGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 20);
    const thumbscrewPositions = [
        [0.85, 1.55, 1.4],
        [0.85, 1.55, -1.4],
        [0.85, -1.55, 1.4],
        [0.85, -1.55, -1.4]
    ];

    thumbscrewPositions.forEach(pos => {
        const screw = new THREE.Mesh(thumbscrewGeo, chromeMat);
        screw.rotation.z = Math.PI / 2;
        screw.position.set(...pos);
        pcTower.add(screw);

        // Rondelle caoutchouc noir
        const washer = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.012, 8, 16), darkPlasticMat);
        washer.rotation.y = Math.PI / 2;
        washer.position.set(pos[0] - 0.02, pos[1], pos[2]);
        pcTower.add(washer);
    });

    // ==========================================
    // 10. INTERACTION SOURIS & ANIMATION FLUIDE
    // ==========================================
    pcTower.rotation.y = -0.58;
    pcTower.rotation.x = 0.16;

    let targetRotationX = 0.16;
    let targetRotationY = -0.58;

    const onPointerMove = (e) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        targetRotationY = -0.58 + x * 0.72;
        targetRotationX = 0.16 + y * 0.48;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });

    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Rotation des pales de ventilateurs
        spinningFans.forEach(fan => {
            fan.rotor.rotation.z += fan.speed;
        });

        // Lévitation douce
        pcTower.position.y = 0.15 + Math.sin(elapsedTime * 1.5) * 0.07;

        // Pulsation subtile de la lumière interne RGB
        internalLedLight.intensity = 3.6 + Math.sin(elapsedTime * 2.2) * 0.6;
        internalGpuLight.intensity = 2.4 + Math.cos(elapsedTime * 2.5) * 0.5;

        // Rotation fluide au survol
        targetRotationY += 0.0011;
        pcTower.rotation.x += (targetRotationX - pcTower.rotation.x) * 0.055;
        pcTower.rotation.y += (targetRotationY - pcTower.rotation.y) * 0.055;

        renderer.render(scene, camera);
    }

    animate();

    const onResize = () => {
        if (!container) return;
        width = container.clientWidth;
        height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    };

    window.addEventListener('resize', onResize);
}

/* ==========================================================================
   5. COPIE RAPIDE E-MAIL & TOAST NOTIFICATION
   ========================================================================== */
function initEmailCopy() {
    const copyBtns = document.querySelectorAll('.btn-copy-email, [data-copy-email]');
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = btn.getAttribute('data-email') || 'kylian.thevenet@gmail.com';

            navigator.clipboard.writeText(email).then(() => {
                showToast(`Adresse e-mail copiée : ${email}`);
            }).catch(() => {
                const tempInput = document.createElement('input');
                tempInput.value = email;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showToast(`Adresse e-mail copiée !`);
            });
        });
    });

    function showToast(message) {
        if (!toast) return;
        if (toastMsg) toastMsg.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }
}

/* ==========================================================================
   6. MODALE CV ÉPURÉE ("Kylian Thevenet")
   ========================================================================== */
function initCvModal() {
    const cvModal = document.getElementById('cv-modal');
    const openCvTriggers = document.querySelectorAll(
        '#open-cv-modal, #open-cv-modal-section, #open-cv-sheet, [data-open-cv]'
    );
    const closeCvBtn = document.getElementById('close-cv-modal');

    if (!cvModal) return;

    const openModal = (e) => {
        if (e) e.preventDefault();
        cvModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        cvModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    openCvTriggers.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    if (closeCvBtn) closeCvBtn.addEventListener('click', closeModal);

    cvModal.addEventListener('click', (e) => {
        if (e.target === cvModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cvModal.style.display === 'flex') {
            closeModal();
        }
    });
}

/* ==========================================================================
   7. LIGHTBOX PLEIN ÉCRAN UNIVERSELLE POUR IMAGES DE PROJETS
   ========================================================================== */
function initUniversalLightbox() {
    let lightbox = document.getElementById('lightbox-modal');

    // Créer la lightbox dans le DOM si elle n'existe pas encore
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox-modal';
        lightbox.className = 'lightbox-modal';
        lightbox.innerHTML = `
            <button class="lightbox-close-btn" aria-label="Fermer le plein écran">&times;</button>
            <img src="" alt="Aperçu plein écran" id="lightbox-modal-img">
        `;
        document.body.appendChild(lightbox);
    }

    const lightboxImg = document.getElementById('lightbox-modal-img');
    const closeBtn = lightbox.querySelector('.lightbox-close-btn');

    // Cibler toutes les images cliquables de projets
    const zoomableImages = document.querySelectorAll(
        '.screenshot-container img, .screenshot-wrap img, .service-card img, img[data-zoom]'
    );

    zoomableImages.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || 'Aperçu agrandi';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (!lightbox.classList.contains('active')) {
                lightboxImg.src = '';
            }
        }, 250);
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}