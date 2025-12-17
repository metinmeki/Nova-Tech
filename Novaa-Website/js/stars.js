// NOVA TECH – Pulsing Galaxy Stars (no falling)
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

// Number of stars
const STAR_COUNT = 180;

let stars = [];

function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.6 + 0.3,
            alpha: Math.random(),
            pulseSpeed: Math.random() * 0.015 + 0.005 // glowing effect
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(s => {
        s.alpha += s.pulseSpeed;
        if (s.alpha > 1 || s.alpha < 0.1) {
            s.pulseSpeed *= -1; // reverse pulse direction
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(155, 110, 255, ${s.alpha})`; // Nova Soft Purple
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgb(170, 90, 255)";
        ctx.fill();
    });

    requestAnimationFrame(draw);
}

createStars();
draw();
