(function() {
    'use strict';
    
    const novaCanvas = document.getElementById("novaRing");
    if (!novaCanvas) {
        console.warn('Nova Ring canvas not found');
        return;
    }

    const renderer = new THREE.WebGLRenderer({ 
        canvas: novaCanvas, 
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x7f3fed,
        transparent: true,
        opacity: 0.8
    });
    const ring = new THREE.Mesh(geometry, material);
    scene.add(ring);

    // Glow ring
    const glowGeometry = new THREE.TorusGeometry(2.3, 0.55, 32, 80);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xb58cff,
        transparent: true,
        opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // Animate
    let animationId;
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        ring.rotation.x += 0.003;
        ring.rotation.y += 0.004;
        glow.rotation.y += 0.002;
        
        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    function handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    window.addEventListener("resize", handleResize);

    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        geometry.dispose();
        material.dispose();
        glowGeometry.dispose();
        glowMaterial.dispose();
        renderer.dispose();
    });

    console.log('✅ Nova Ring initialized');
})();