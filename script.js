import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin } from '@pixiv/three-vrm';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; 

// ==========================================
// 1. CONFIGURACIÓN DEL MOTOR 3D (THREE.JS / VRM)
// ==========================================
const canvasVRM = document.getElementById('vroidCanvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 20);
camera.position.set(0, 1.2, 3); 

const renderer = new THREE.WebGLRenderer({ canvas: canvasVRM, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0); 
controls.update();

const light = new THREE.DirectionalLight(0xffffff, Math.PI);
light.position.set(1, 1, 1).normalize();
scene.add(light);

const loader = new GLTFLoader();
loader.register((parser) => new VRMLoaderPlugin(parser));

loader.load(
    'Creadora.vrm', 
    (gltf) => {
        const vrm = gltf.userData.vrm;
        scene.add(vrm.scene);
        vrm.scene.rotation.y = Math.PI;
        console.log('¡Modelo cargado con éxito en la escena!');
    },
    (progress) => {
        console.log('Cargando modelo...', Math.round(100.0 * (progress.loaded / progress.total)), '%');
    },
    (error) => {
        console.error('Error al cargar el modelo VRM:', error);
    }
);

function animate() {
    requestAnimationFrame(animate);
    controls.update(); 
    renderer.render(scene, camera);
}
animate();


// ==========================================
// 2. LÓGICA DE LA INTERFAZ Y EL CAOS (MARIPOSA)
// ==========================================
const btnIniciar = document.getElementById("btnEmpezar");
const canvasCaos = document.getElementById("caos-canvas");
const inicioMenu = document.getElementById("inicioMenu");

if (btnIniciar && canvasCaos) {
    const ctx = canvasCaos.getContext("2d");

    function redimensionarCanvas() {
        canvasCaos.width = window.innerWidth;
        canvasCaos.height = window.innerHeight;
    }
    window.addEventListener('resize', redimensionarCanvas);
    redimensionarCanvas();

    const sigma = 10, rho = 28, beta = 8 / 3, dt = 0.008;
    let variables = [];
    let animacionActiva = false;

    btnIniciar.addEventListener("click", () => {
        console.log("¡Botón 'INICIAR VIAJE' presionado con éxito!");

        // Activamos las transiciones CSS en el body
        document.body.classList.add("viaje-activo");
        
        // Ocultamos la pantalla de inicio rosa de forma fluida
        if (inicioMenu) {
            inicioMenu.classList.add("oculto");
        }

        // Permitimos que el canvas intercepte eventos de ser necesario
        canvasCaos.style.pointerEvents = "auto"; 
        
        inicializarCaos();
    });

    function inicializarCaos() {
        variables = [];
        for (let i = 0; i < 8; i++) {
            variables.push({
                x: 0.1 + (i * 0.001), y: 0, z: 0,
                color: i === 3 ? "#00ffff" : `hsl(${350 + i * 5}, 100%, 60%)`,
                historial: [] 
            });
        }
        animacionActiva = true;
        dibujarMariposa();
    }

    function dibujarMariposa() {
        if (!animacionActiva) return;

        ctx.clearRect(0, 0, canvasCaos.width, canvasCaos.height);

        const escala = 18;
        const centroX = canvasCaos.width / 2;
        const centroY = canvasCaos.height / 2 + 100;

        variables.forEach(v => {
            v.x += (sigma * (v.y - v.x)) * dt;
            v.y += (v.x * (rho - v.z) - v.y) * dt;
            v.z += ((v.x * v.y) - (beta * v.z)) * dt;

            let drawX = centroX + (v.x * escala);
            let drawY = centroY - (v.z * escala);

            v.historial.push({x: drawX, y: drawY});
            if (v.historial.length > 40) v.historial.shift();

            ctx.beginPath();
            for (let j = 0; j < v.historial.length; j++) {
                if (j === 0) ctx.moveTo(v.historial[j].x, v.historial[j].y);
                else ctx.lineTo(v.historial[j].x, v.historial[j].y);
            }
            ctx.strokeStyle = v.color;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(drawX, drawY, 3, 0, Math.PI * 2);
            ctx.fillStyle = v.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = v.color;
            ctx.fill();
        });

        requestAnimationFrame(dibujarMariposa);
    }
}