import * as THREE from 'three';

export class Environment {
    constructor(scene) {
        this.scene = scene;
        this.particleCount = 1000;
        this.gridHelper = null;
        this.particles = null;
        this.particleMat = null;
        
        this.init();
    }

    init() {
        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
        dirLight.position.set(5, 10, 5);
        this.scene.add(dirLight);

        // Cyberpunk Grid
        this.gridHelper = new THREE.GridHelper(200, 100, 0xff00ff, 0x440044);
        this.gridHelper.position.y = 0;
        // Make it initially invisible/dark until moving
        this.gridHelper.material.opacity = 0;
        this.gridHelper.material.transparent = true;
        this.scene.add(this.gridHelper);

        // Speed line particles
        const particleGeo = new THREE.BufferGeometry();
        const particlePos = new Float32Array(this.particleCount * 3);
        for(let i = 0; i < this.particleCount * 3; i += 3) {
            particlePos[i] = (Math.random() - 0.5) * 100;
            particlePos[i+1] = Math.random() * 20;
            particlePos[i+2] = (Math.random() - 0.5) * 100;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
        
        this.particleMat = new THREE.PointsMaterial({ 
            color: 0x00ffff, 
            size: 0.2,
            transparent: true,
            opacity: 0
        });
        
        this.particles = new THREE.Points(particleGeo, this.particleMat);
        this.scene.add(this.particles);
    }

    update(speed, steeringAngle, moveX, moveZ, isNitro, isGameActive) {
        // Fade in effects when game becomes active
        if (isGameActive) {
            this.gridHelper.material.opacity = THREE.MathUtils.lerp(this.gridHelper.material.opacity, 1, 0.05);
            this.particleMat.opacity = THREE.MathUtils.lerp(this.particleMat.opacity, 1, 0.05);
        } else {
            this.gridHelper.material.opacity = THREE.MathUtils.lerp(this.gridHelper.material.opacity, 0, 0.05);
            this.particleMat.opacity = THREE.MathUtils.lerp(this.particleMat.opacity, 0, 0.05);
        }

        // Move grid to simulate forward movement
        this.gridHelper.position.z += moveZ;
        if (this.gridHelper.position.z > 2) {
            this.gridHelper.position.z -= 2;
        } else if (this.gridHelper.position.z < 0) {
            this.gridHelper.position.z += 2;
        }
        
        this.gridHelper.position.x += moveX;
        if (this.gridHelper.position.x > 2) this.gridHelper.position.x -= 2;
        if (this.gridHelper.position.x < 0) this.gridHelper.position.x += 2;

        // Move particles
        const positions = this.particles.geometry.attributes.position.array;
        for(let i = 0; i < this.particleCount * 3; i += 3) {
            positions[i] += moveX * 2;
            positions[i+2] += moveZ * 2;
            
            if(positions[i] > 50) positions[i] = -50;
            if(positions[i] < -50) positions[i] = 50;
            if(positions[i+2] > 50) positions[i+2] = -50;
            if(positions[i+2] < -50) positions[i+2] = 50;
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
        
        // Nitro color change
        this.particleMat.color.setHex(isNitro ? 0xff00ff : 0x00ffff);
    }
}
