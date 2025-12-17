/* ============================================================
   NOVA TECH — MAIN JAVASCRIPT (CLEAN & OPTIMIZED)
   ============================================================ */

$(document).ready(function () {

    /* =======================
       1. NAVBAR TOGGLE
       ======================= */
    $('.fa-bars').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('.fa-bars').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if ($(window).scrollTop() > 35) {
            $('.header').css({
                background: '#002e5f',
                boxShadow: '0 .2rem .5rem rgba(0,0,0,.4)'
            });
        } else {
            $('.header').css({
                background: 'none',
                boxShadow: 'none'
            });
        }
    });

    /* =======================
       2. COUNTERS
       ======================= */
    const counters = document.querySelectorAll('.counter');
    const speed = 120;

    counters.forEach(counter => {
        const update = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(update, 10);
            } else {
                counter.innerText = target;
            }
        };
        update();
    });

    /* =======================
       3. BACK TO TOP
       ======================= */
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });

    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500);
        return false;
    });

    /* =======================
       4. FAQ ACCORDION
       ======================= */
    $('.accordion-header').click(function () {
        $('.accordion .accordion-body').slideUp(400);
        $(this).next('.accordion-body').slideDown(400);
        $('.accordion .accordion-header span').text('+');
        $(this).children('span').text('-');
    });

}); // END document ready


/* =======================================================
   5. PARALLAX IMAGE MOVEMENT
   ======================================================= */
document.addEventListener("mousemove", (e) => {
    const galaxy = document.getElementById("nova-galaxy");
    if (!galaxy) return;

    let x = (e.clientX - window.innerWidth / 2) / 40;
    let y = (e.clientY - window.innerHeight / 2) / 40;

    galaxy.style.transform =
        `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
});


/* =======================================================
   6. NEON CUSTOM CURSOR
   ======================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.querySelector(".nt-cursor");
    if (!cursor) return;

    document.addEventListener("mousemove", (e) => {
        cursor.style.top = e.clientY + "px";
        cursor.style.left = e.clientX + "px";
    });

    document.addEventListener("mousedown", () => {
        cursor.classList.add("click");
    });

    document.addEventListener("mouseup", () => {
        cursor.classList.remove("click");
    });
});


/* =======================================================
   7. PARALLAX LOGO FLOAT
   ======================================================= */
document.addEventListener("mousemove", (e) => {
    const logo = document.getElementById("novaLogo");
    if (!logo) return;

    let x = (e.clientX - window.innerWidth / 2) / 60;
    let y = (e.clientY - window.innerHeight / 2) / 60;

    logo.style.transform = `translate(${x}px, ${y}px)`;
});
/* =======================================================
   8. 3D SCROLL ANIMATION FOR ABOUT SECTION
   ======================================================= */
document.addEventListener('DOMContentLoaded', function() {
    console.log('3D Animation Script Started');

    const aboutSection = document.querySelector('.about');
    const aboutHeading = document.querySelector('.about .heading');
    const content = document.querySelector('.about .row .content');
    const featureCards = document.querySelectorAll('.feature-card');

    console.log('About Heading:', aboutHeading);
    console.log('Feature Cards:', featureCards.length);

    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.75;

        // Check heading
        if (aboutHeading) {
            const rect = aboutHeading.getBoundingClientRect();
            if (rect.top < triggerBottom) {
                aboutHeading.classList.add('visible');
                console.log('Heading visible added');
            }
        }

        // Check content
        if (content) {
            const rect = content.getBoundingClientRect();
            if (rect.top < triggerBottom) {
                content.classList.add('visible');
                console.log('Content visible added');
            }
        }

        // Check cards
        featureCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            if (rect.top < triggerBottom) {
                card.classList.add('visible');
                console.log('Card ' + index + ' visible added');
            }
        });
    }

    function parallaxEffect() {
        if (!aboutSection) return;

        const rect = aboutSection.getBoundingClientRect();
        const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

        if (scrollProgress >= 0 && scrollProgress <= 1) {
            const x = (scrollProgress - 0.5) * 100;
            const y = (scrollProgress - 0.5) * 100;

            aboutSection.style.setProperty('--scroll-x', x + 'px');
            aboutSection.style.setProperty('--scroll-y', y + 'px');
            aboutSection.classList.add('scrolled');
        }
    }

    // Listen to scroll
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                checkScroll();
                parallaxEffect();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Mouse effect
    featureCards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = 'translateZ(30px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.05)';
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });

    // Initial check
    console.log('Running initial check...');
    setTimeout(function() {
        checkScroll();
    }, 500);
});