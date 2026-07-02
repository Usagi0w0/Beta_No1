// LINE 1-17: Asynchronous function that bypasses security locks
async function iniciarMotor() {
    try {
        const THREE = await import('three');
        const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
        const { VRMLoaderPlugin } = await import('@pixiv/three-vrm');

        console.log("Librerías cargadas");
        
        // LÍNEA 11: Configuración de escena básica
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('contenedor-vroid').appendChild(renderer.domElement);

        // LÍNEA 19: Carga del modelo (Asegúrate de que la ruta sea correcta)
        const loader = new GLTFLoader();
        loader.register((parser) => new VRMLoaderPlugin(parser));
        
        loader.load('Modelos/Creadora.vrm', (gltf) => {
            scene.add(gltf.userData.vrm.scene);
            renderer.render(scene, camera);
            console.log("Avatar en pantalla");
        });

    } catch (err) { console.error("Error de carga:", err); }
}

// LÍNEA 35: El puente para el botón
document.getElementById('btn-inicio').addEventListener('click', () => {
    console.log("Botón presionado");
    document.getElementById('pantalla-inicio').style.display = 'none';
    document.getElementById('interfaz-juego').style.display = 'block';
    iniciarMotor();
});