document.addEventListener('DOMContentLoaded', function() {
    // Éléments de la modale
    const cvModal = document.getElementById('cv-modal');
    const openCvModalBtn = document.getElementById('open-cv-modal');
    const closeCvModalBtn = document.getElementById('close-cv-modal');

    // Fonction pour ouvrir la modale
    function openModal() {
        if (cvModal) {
            cvModal.style.display = 'flex';
        }
    }

    // Fonction pour fermer la modale
    function closeModal() {
        if (cvModal) {
            cvModal.style.display = 'none';
        }
    }

    // Événements
    if (openCvModalBtn) {
        openCvModalBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Empêche le lien de remonter en haut de page
            openModal();
        });
    }

    if (closeCvModalBtn) {
        closeCvModalBtn.addEventListener('click', closeModal);
    }

    // Fermer la modale en cliquant en dehors
    if (cvModal) {
        cvModal.addEventListener('click', function(event) {
            if (event.target === cvModal) {
                closeModal();
            }
        });
    }

    // Fermer la modale avec la touche "Echap"
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && cvModal.style.display === 'flex') {
            closeModal();
        }
    });
});