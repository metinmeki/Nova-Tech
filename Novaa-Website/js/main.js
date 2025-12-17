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
