import * as THREE from 'three';

export class Car {
    constructor(scene) {
        this.group = new THREE.Group();
        this.wheels = [];
        
        // Head Lights (Spotlights)
        this.headLight = new THREE.SpotLight(0x00ffff, 50, 100, Math.PI/4, 0.5, 1);
        this.headLight.position.set(0, 0.5, -2);
        this.headLight.target.position.set(0, 0, -10);
        this.group.add(this.headLight);
        this.group.add(this.headLight.target);

        // Build the procedural car
        this.buildProceduralCar();

        // Nitro Exhaust Particles
        this.maxExhaustParticles = 150;
        const particleGeo = new THREE.BufferGeometry();
        this.particlePositions = new Float32Array(this.maxExhaustParticles * 3);
        // Initialize way off-screen
        for (let i = 0; i < this.maxExhaustParticles * 3; i++) {
            this.particlePositions[i] = 9999;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
        
        this.particleMat = new THREE.PointsMaterial({
            color: 0xff00ff,
            size: 0.6,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        this.exhaustSystem = new THREE.Points(particleGeo, this.particleMat);
        this.group.add(this.exhaustSystem);
        this.particleIndex = 0;

        scene.add(this.group);
        this.box = new THREE.Box3();
    }

    createChinaFlagTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#ee1c25';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffff00';
        drawStar(ctx, 85, 64, 25, 0);
        drawStar(ctx, 170, 25, 8, Math.PI / 6);
        drawStar(ctx, 204, 51, 8, Math.PI / 4);
        drawStar(ctx, 204, 93, 8, 0);
        drawStar(ctx, 170, 119, 8, -Math.PI / 6);

        ctx.font = 'bold 70px "Microsoft YaHei", sans-serif';
        ctx.fillStyle = '#ffff00';
        ctx.fillText('中 国', 260, 160);
        
        function drawStar(ctx, cx, cy, radius, rotation) {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rotation);
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * radius,
                           -Math.sin((18 + i * 72) / 180 * Math.PI) * radius);
                ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * (radius / 2.5),
                           -Math.sin((54 + i * 72) / 180 * Math.PI) * (radius / 2.5));
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    buildProceduralCar() {
        const flagTexture = this.createChinaFlagTexture();

        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff3333, 
            map: flagTexture,
            roughness: 0.2, 
            metalness: 0.7 
        });
        const blackMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8, metalness: 0.2 });
        const neonCyanMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        const neonPinkMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        const tireMaterial = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9 });

        const chassisGeo = new THREE.BoxGeometry(1.2, 0.4, 4.5);
        const chassis = new THREE.Mesh(chassisGeo, bodyMaterial);
        chassis.position.y = 0.4;
        this.group.add(chassis);

        const cabinGeo = new THREE.BoxGeometry(0.8, 0.4, 1.5);
        const cabin = new THREE.Mesh(cabinGeo, bodyMaterial);
        cabin.position.set(0, 0.8, -0.5);
        this.group.add(cabin);

        const frontWingGeo = new THREE.BoxGeometry(2.4, 0.05, 0.6);
        const frontWing = new THREE.Mesh(frontWingGeo, bodyMaterial);
        frontWing.position.set(0, 0.2, -2.2);
        this.group.add(frontWing);
        
        const frontNoseGeo = new THREE.BoxGeometry(0.6, 0.2, 0.8);
        const frontNose = new THREE.Mesh(frontNoseGeo, bodyMaterial);
        frontNose.position.set(0, 0.3, -1.8);
        this.group.add(frontNose);

        const rearWingGeo = new THREE.BoxGeometry(2.2, 0.05, 0.8);
        const rearWing = new THREE.Mesh(rearWingGeo, bodyMaterial);
        rearWing.position.set(0, 1.2, 2.0);
        this.group.add(rearWing);

        const wingSupportGeo = new THREE.BoxGeometry(0.1, 0.8, 0.4);
        const leftSupport = new THREE.Mesh(wingSupportGeo, blackMaterial);
        leftSupport.position.set(-0.6, 0.8, 2.0);
        this.group.add(leftSupport);
        const rightSupport = new THREE.Mesh(wingSupportGeo, blackMaterial);
        rightSupport.position.set(0.6, 0.8, 2.0);
        this.group.add(rightSupport);

        const stripGeo = new THREE.BoxGeometry(1.3, 0.05, 4.5);
        const strip = new THREE.Mesh(stripGeo, neonCyanMaterial);
        strip.position.y = 0.2;
        this.group.add(strip);

        const tailLightGeo = new THREE.BoxGeometry(0.3, 0.2, 0.1);
        const tailLight = new THREE.Mesh(tailLightGeo, neonPinkMaterial);
        tailLight.position.set(0, 0.4, 2.26);
        this.group.add(tailLight);

        const createWheel = (x, z, isFront) => {
            const width = isFront ? 0.4 : 0.6;
            const radius = isFront ? 0.45 : 0.5;
            
            const wheelGroup = new THREE.Group();
            wheelGroup.position.set(x, radius, z);

            const wheelGeo = new THREE.CylinderGeometry(radius, radius, width, 32);
            const wheel = new THREE.Mesh(wheelGeo, tireMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheelGroup.add(wheel);
            
            const rimGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, width + 0.02, 16);
            const rim = new THREE.Mesh(rimGeo, isFront ? neonCyanMaterial : neonPinkMaterial);
            rim.rotation.z = Math.PI / 2;
            wheelGroup.add(rim);
            
            this.group.add(wheelGroup);
            return wheelGroup;
        };

        this.wheels = [
            createWheel(-1.1, -1.5, true),
            createWheel(1.1, -1.5, true),
            createWheel(-1.2, 1.5, false),
            createWheel(1.2, 1.5, false)
        ];
    }

    update(delta, speed, steeringAngle, isNitro, isGameActive) {
        this.group.rotation.y = steeringAngle;
        
        const targetTilt = speed * 0.05;
        this.group.rotation.x += (targetTilt - this.group.rotation.x) * 0.1;
        
        const targetRoll = steeringAngle * 0.5;
        this.group.rotation.z += (targetRoll - this.group.rotation.z) * 0.1;

        // 原本方块车的车轮逻辑
        this.wheels.forEach(wheel => {
            wheel.rotation.x -= speed * 0.5;
        });
        this.wheels[0].rotation.y = steeringAngle * 2;
        this.wheels[1].rotation.y = steeringAngle * 2;
        
        // --- 排气管/氮气 粒子特效 ---
        // 1. 让所有现有粒子往后飘（相对于车身 +Z）
        for (let i = 0; i < this.maxExhaustParticles; i++) {
            const idx = i * 3;
            if (this.particlePositions[idx + 1] !== 9999) { // 只更新活跃的粒子
                // 向后飞的速度跟车速挂钩，飞得更快
                this.particlePositions[idx + 2] += delta * (30 + speed * 20); 
                
                // 如果粒子飞得太远了，隐藏它
                if (this.particlePositions[idx + 2] > 6) {
                    this.particlePositions[idx + 1] = 9999;
                }
            }
        }

        // 2. 根据状态生成新粒子 (只有速度大于一定值才喷火)
        if (speed > 0.1) {
            // 氮气喷得多，普通喷得少
            const numToSpawn = isNitro ? 4 : 1; 
            
            for (let k = 0; k < numToSpawn; k++) {
                this.particleIndex = (this.particleIndex + 1) % this.maxExhaustParticles;
                const idx = this.particleIndex * 3;
                
                // 在车尾附近生成，做一些随机偏移
                const spreadX = isNitro ? 1.0 : 0.4;
                this.particlePositions[idx] = (Math.random() - 0.5) * spreadX; // x (左右)
                this.particlePositions[idx + 1] = 0.3 + (Math.random() - 0.5) * 0.2; // y (上下)
                this.particlePositions[idx + 2] = 2.4 + Math.random() * 0.2; // z (车尾位置)
            }
            
            // 动态修改材质颜色和大小
            if (isNitro) {
                this.particleMat.color.setHex(0xff00ff); // 紫红色
                this.particleMat.size = 1.2; // 颗粒变大
            } else {
                this.particleMat.color.setHex(0x00ffff); // 青蓝色
                this.particleMat.size = 0.5; // 颗粒较小
            }
        }
        this.exhaustSystem.geometry.attributes.position.needsUpdate = true;
        // --- 结束特效 ---

        // Headlight intensity changes based on game state
        if (isGameActive) {
            this.headLight.intensity = THREE.MathUtils.lerp(this.headLight.intensity, 50, 0.1);
        } else {
            this.headLight.intensity = THREE.MathUtils.lerp(this.headLight.intensity, 0, 0.1);
        }
        
        this.box.setFromObject(this.group);
    }
}