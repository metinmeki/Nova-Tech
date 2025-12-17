const canvas = document.getElementById("novaRing");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 6;

// Ring
const geometry = new THREE.TorusGeometry(2, 0.35, 32, 80);
const material = new THREE.MeshBasicMaterial({ color: 0x7f3fed });
const ring = new THREE.Mesh(geometry, material);
scene.add(ring);

// Glow ring
const glow = new THREE.Mesh(
    new THREE.TorusGeometry(2.3, 0.55, 32, 80),
    new THREE.MeshBasicMaterial({
        color: 0xb58cff,
        transparent: true,
        opacity: 0.3
    })
);
scene.add(glow);

// Animate
function animate() {
    requestAnimationFrame(animate);
    ring.rotation.x += 0.003;
    ring.rotation.y += 0.004;
    glow.rotation.y += 0.002;
    renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
