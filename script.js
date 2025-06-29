document.addEventListener('DOMContentLoaded', function() {
    const yearSelect = document.getElementById('year-select');
    const magazineFrame = document.getElementById('magazine-frame');
    const magazineImage = document.getElementById('magazine-image'); // Añadido
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main section');
    const mainFooter = document.getElementById('main-footer');
    const stickyNavbar = document.getElementById('sticky-navbar');
    const headerElement = document.querySelector('header');

    // Mapeo de años a las URL de tus revistas. ¡Ahora incluye 'type'!
    const magazines = {
        '2024': { type: 'iframe', url: 'https://online.publuu.com/907362/1986623/page/1' },
        '2025': { type: 'image', url: 'https://i.imgur.com/dBnwnal.jpeg' } // Tipo 'image' para 2025
    };

    // Función para cargar la revista o imagen
    function loadMagazine() {
        const selectedYear = yearSelect.value;
        const magazineInfo = magazines[selectedYear];

        // Ocultar ambos al inicio
        magazineFrame.style.display = 'none';
        magazineImage.style.display = 'none';
        magazineFrame.src = ''; // Limpiar el iframe
        magazineImage.src = ''; // Limpiar la imagen

        if (magazineInfo) {
            if (magazineInfo.type === 'iframe') {
                magazineFrame.src = magazineInfo.url;
                magazineFrame.style.display = 'block';
            } else if (magazineInfo.type === 'image') {
                magazineImage.src = magazineInfo.url;
                magazineImage.style.display = 'block';
            }
        } else {
            alert('No hay contenido disponible para el año seleccionado.');
        }
    }

    // Inicializar al cargar la página y al cambiar la selección
    loadMagazine();
    yearSelect.addEventListener('change', loadMagazine);

    // --- Funcionalidad del menú desplegable (hamburguesa) ---
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        
        if (window.innerWidth <= 768) {
            if (navLinks.classList.contains('active')) {
                sections.forEach(section => {
                    section.style.display = 'none';
                });
                mainFooter.style.display = 'none';
            } else {
                document.querySelector('.active-section').style.display = 'block';
                mainFooter.style.display = 'block';
            }
        }
    });

    // --- Funcionalidad de navegación por secciones ---
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            const targetHref = this.getAttribute('href');

            if (targetHref.startsWith('http')) {
                window.open(targetHref, '_blank');
                if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    document.querySelector('.active-section').style.display = 'block';
                    mainFooter.style.display = 'block';
                }
                return;
            }

            const targetId = targetHref.substring(1);
            const targetSection = document.getElementById(targetId);

            navLinks.classList.remove('active');
            if (window.innerWidth <= 768) {
                sections.forEach(section => section.style.display = 'none');
                mainFooter.style.display = 'block';
            }

            sections.forEach(section => section.classList.remove('active-section'));
            navItems.forEach(link => link.classList.remove('active'));

            if (targetSection) {
                targetSection.classList.add('active-section');
                if (window.innerWidth <= 768) {
                    targetSection.style.display = 'block';
                }
                this.classList.add('active');

                if (targetId === 'ediciones-section' || targetId === 'social-media-section') {
                    mainFooter.style.display = 'none';
                } else {
                    mainFooter.style.display = 'block';
                }

                const offset = stickyNavbar.offsetHeight + 10;
                window.scrollTo({
                    top: targetSection.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Gestionar la visibilidad de la sección inicial al cargar ---
    sections.forEach(section => {
        if (section.id === 'home') {
            section.classList.add('active-section');
        } else {
            section.classList.remove('active-section');
        }
    });
    // Se activa el enlace a la sección "home" que contiene el selector de año
    document.querySelector('.nav-links a[href="#home"]').classList.add('active');


    // --- Sticky Navbar (ajuste de padding del body) ---
    function adjustBodyPadding() {
        if (stickyNavbar.classList.contains('fixed')) {
            document.body.style.paddingTop = stickyNavbar.offsetHeight + 'px';
        } else {
            document.body.style.paddingTop = '0px';
        }
    }

    function checkNavbarPosition() {
        const headerHeight = headerElement.offsetHeight;
        const scrollPosition = window.scrollY;

        if (scrollPosition > headerHeight) {
            stickyNavbar.classList.add('fixed');
        } else {
            stickyNavbar.classList.remove('fixed');
        }
        adjustBodyPadding(); // Ajusta el padding cada vez que la posición cambia
    }

    // Ejecutar al cargar y al hacer scroll
    window.addEventListener('scroll', checkNavbarPosition);
    window.addEventListener('resize', checkNavbarPosition);
    checkNavbarPosition(); // Ejecutar al cargar por primera vez
});
