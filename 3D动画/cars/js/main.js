import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import { Car } from './CarModel.js';
import { Environment } from './Environment.js';
import { GameManager } from './GameManager.js';

// --- 1. Basic Scene Setup ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.015);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// --- 2. Post Processing ---
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0.2;
bloomPass.strength = 0; // Starts at 0, increases when active
bloomPass.radius = 0.5;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// --- 3. Game Objects ---
const car = new Car(scene);
const environment = new Environment(scene);
const gameManager = new GameManager(scene, car);

// --- 4. Input Handling ---
const keys = { w: false, a: false, s: false, d: false, space: false };

window.addEventListener('keydown', (e) => {
    const code = e.code;
    if(code === 'KeyW' || code === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.w = true;
    if(code === 'KeyA' || code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.a = true;
    if(code === 'KeyS' || code === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.s = true;
    if(code === 'KeyD' || code === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.d = true;
    
    // 按一下空格激活氮气，如果已经在喷氮气中则不重复激活
    if((code === 'Space' || e.key === ' ') && !isNitroActive) {
        keys.space = true;
        isNitroActive = true;
        nitroTimer = NITRO_DURATION;
    }
});

window.addEventListener('keyup', (e) => {
    const code = e.code;
    if(code === 'KeyW' || code === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.w = false;
    if(code === 'KeyA' || code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.a = false;
    if(code === 'KeyS' || code === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.s = false;
    if(code === 'KeyD' || code === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.d = false;
    // 不在这里重置 keys.space，由计时器自动控制
});

// --- 5. Game State variables ---
let speed = 0;
const normalMaxSpeed = 0.8; // 相当于 120 KM/H
const nitroMaxSpeed = 1.6;  // 相当于 240 KM/H

// 降低基础加速度，使得从 0 到 120 需要更长时间
const acceleration = 0.005; 
const friction = 0.005;
let steeringAngle = 0;
const turnSpeed = 0.03;

// Nitro system variables
let isNitroActive = false;
let nitroTimer = 0;
const NITRO_DURATION = 5.0; // 氮气持续时间延长到 5 秒

const speedometerUI = document.getElementById('speedometer');
const clock = new THREE.Clock();

// --- 6. Main Loop ---
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    // 1. Acceleration / Braking / Nitro Logic
    let currentMaxSpeed = normalMaxSpeed;
    
    // 处理氮气计时与状态
    if (isNitroActive) {
        nitroTimer -= delta;
        if (nitroTimer <= 0) {
            isNitroActive = false;
            keys.space = false;
        }
    }

    if (keys.w) {
        if (isNitroActive) {
            // 氮气加速：从快到慢，平滑逼近 nitroMaxSpeed (240km/h)
            // 降低这里的系数，让氮气加速的过程也稍微拉长一点
            speed += (nitroMaxSpeed - speed) * 0.02;
        } else {
            // 普通加速
            if (speed > normalMaxSpeed) {
                // 如果当前速度超过了普通最高速（比如刚喷完氮气），则平滑减速回落到 normalMaxSpeed
                // 减速从快到慢：距离 120 越远，减得越快，稍微调慢减速时间
                speed -= (speed - normalMaxSpeed) * 0.015;
            } else {
                speed += acceleration;
                speed = Math.min(speed, normalMaxSpeed);
            }
        }
    } else if (keys.s) {
        speed -= acceleration * 2; // 刹车稍微快一点
    } else {
        // 自然滑行减速
        if (speed > 0) speed -= friction;
        if (speed < 0) speed += friction;
        if (Math.abs(speed) < friction) speed = 0;
    }
    
    // 绝对速度下限保护（倒车不做太多限制，仅限制下限）
    speed = Math.max(-normalMaxSpeed / 2, speed);

    // 2. Steering
    if (Math.abs(speed) > 0.01) {
        const turnDir = speed > 0 ? 1 : -1;
        if (keys.a) steeringAngle += turnSpeed * turnDir;
        if (keys.d) steeringAngle -= turnSpeed * turnDir;
    }
    steeringAngle *= 0.9; // Return to center

    // 3. Movement calculations (Environment moves instead of car)
    const moveX = Math.sin(steeringAngle) * speed;
    const moveZ = Math.cos(steeringAngle) * speed;

    // 4. Update entities
    const isGameActive = gameManager.active;
    
    // Update Bloom strength based on game state
    const targetBloom = isGameActive ? 2.0 : 0.0;
    bloomPass.strength = THREE.MathUtils.lerp(bloomPass.strength, targetBloom, 0.05);

    car.update(delta, speed, steeringAngle, keys.space, isGameActive);
    environment.update(speed, steeringAngle, moveX, moveZ, keys.space, isGameActive);
    gameManager.update(delta, speed, moveX, moveZ);

    // 5. Camera follow
    const cameraOffset = new THREE.Vector3(0, 3, 8);
    cameraOffset.z += Math.abs(speed) * 2;
    camera.position.lerp(cameraOffset, 0.1);
    camera.lookAt(car.group.position);

    // 6. UI
    const displaySpeed = Math.abs(Math.round(speed * 150));
    speedometerUI.innerText = `${displaySpeed} KM/H`;
    speedometerUI.style.color = keys.space ? '#f0f' : '#fff';

    composer.render();
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

animate();
