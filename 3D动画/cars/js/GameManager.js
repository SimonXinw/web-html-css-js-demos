import * as THREE from 'three';

export class GameManager {
    constructor(scene, car) {
        this.scene = scene;
        this.car = car;
        this.score = 0;
        this.active = false;
        
        this.collectibles = [];
        this.scoreUI = document.getElementById('score-display');
        this.statusUI = document.getElementById('game-status');
        
        this.spawnTimer = 0;
        
        this.itemGeo = new THREE.TorusGeometry(0.8, 0.2, 16, 100); // 基础金币环
        
        // 扩展得分道具类型
        this.itemTypes = [
            {
                type: 'ring',
                geometry: new THREE.TorusGeometry(0.8, 0.2, 16, 100),
                material: new THREE.MeshBasicMaterial({ color: 0xffff00 }), // 黄色
                score: 10,
                colorHex: 0xffff00,
                spinSpeed: 0.05,
                weight: 40 // 出现概率权重
            },
            {
                type: 'box',
                geometry: new THREE.BoxGeometry(1, 1, 1),
                material: new THREE.MeshBasicMaterial({ color: 0xff00ff }), // 粉色能量盒
                score: 20,
                colorHex: 0xff00ff,
                spinSpeed: 0.02,
                weight: 25
            },
            {
                type: 'sphere',
                geometry: new THREE.SphereGeometry(0.6, 16, 16),
                material: new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }), // 蓝色线框球
                score: 5,
                colorHex: 0x0000ff,
                spinSpeed: 0.08,
                weight: 20
            },
            {
                type: 'cylinder',
                geometry: new THREE.CylinderGeometry(0.4, 0.4, 1.2, 16),
                material: new THREE.MeshBasicMaterial({ color: 0xff8800 }), // 橙色电池筒
                score: 15,
                colorHex: 0xff8800,
                spinSpeed: 0.06,
                weight: 20
            },
            {
                type: 'crystal',
                geometry: new THREE.IcosahedronGeometry(0.7, 0),
                material: new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // 绿色水晶
                score: 30,
                colorHex: 0x00ff00,
                spinSpeed: 0.07,
                weight: 15
            },
            {
                type: 'diamond',
                geometry: new THREE.OctahedronGeometry(0.6, 0),
                material: new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true }), // 蓝绿线框钻石
                score: 50,
                colorHex: 0x00ffff,
                spinSpeed: 0.1,
                weight: 10
            },
            {
                type: 'crown',
                geometry: new THREE.TorusKnotGeometry(0.5, 0.15, 64, 8),
                material: new THREE.MeshBasicMaterial({ color: 0xff0000 }), // 红色传说结
                score: 100,
                colorHex: 0xff0000,
                spinSpeed: 0.15,
                weight: 2 // 极低概率
            }
        ];
        
        // 预先计算总权重
        this.totalWeight = this.itemTypes.reduce((sum, item) => sum + item.weight, 0);
        
        // Explosion particles
        this.explosions = [];
    }
    
    start() {
        this.active = true;
        this.scoreUI.style.display = 'block';
        this.statusUI.innerText = "状态: 驾驶中 (得分模式开启)";
    }
    
    spawnCollectible() {
        // 根据权重随机选择一种道具类型
        let rand = Math.random() * this.totalWeight;
        let itemConfig = this.itemTypes[0];
        
        for (const type of this.itemTypes) {
            if (rand < type.weight) {
                itemConfig = type;
                break;
            }
            rand -= type.weight;
        }

        const item = new THREE.Mesh(itemConfig.geometry, itemConfig.material);
        
        // Random X position between -15 and 15
        const x = (Math.random() - 0.5) * 30;
        // Z is far ahead
        const z = -100;
        
        // 动态调整高度，比如悬浮在半空
        const y = 0.8 + Math.random() * 1.5;

        item.position.set(x, y, z);
        item.rotation.y = Math.random() * Math.PI;
        item.rotation.x = Math.random() * Math.PI; // 增加一些随机初始角度
        
        this.scene.add(item);
        
        this.collectibles.push({
            mesh: item,
            config: itemConfig, // 把配置保存下来，碰撞时取对应的分数和特效
            box: new THREE.Box3()
        });
    }
    
    createExplosion(position, colorHex) {
        const particleCount = 30;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = position.x;
            positions[i * 3 + 1] = position.y;
            positions[i * 3 + 2] = position.z;
            
            // 更强的爆炸冲击力
            velocities.push(
                new THREE.Vector3(
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4 + 1, // 稍微偏向上方爆炸
                    (Math.random() - 0.5) * 4
                )
            );
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ 
            color: colorHex, 
            size: 0.8, // 更大的爆炸粒子
            transparent: true, 
            opacity: 1 
        });
        const points = new THREE.Points(geometry, material);
        
        this.scene.add(points);
        this.explosions.push({ points, velocities, life: 1.0 });
    }

    update(delta, speed, moveX, moveZ) {
        if (!this.active && speed > 0.1) {
            this.start();
        }
        
        if (!this.active) return;
        
        // Spawning logic
        this.spawnTimer += delta * (speed + 0.5); // Add a base value so it spawns even when slow
        if (this.spawnTimer > 3) { // Spawn more frequently
            this.spawnCollectible();
            this.spawnTimer = 0;
        }
        
        // Update car bounding box
        this.car.box.setFromObject(this.car.group);
        // Shrink the box slightly to make collision feel fairer
        this.car.box.expandByScalar(-0.2);

        // Update collectibles
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const itemObj = this.collectibles[i];
            const mesh = itemObj.mesh;
            const config = itemObj.config;
            
            // Move items relative to world to simulate car forward movement
            mesh.position.z += moveZ;
            mesh.position.x += moveX;
            // 不同道具使用自己配置的旋转速度
            mesh.rotation.y += config.spinSpeed; 
            mesh.rotation.x += config.spinSpeed * 0.5;
            
            itemObj.box.setFromObject(mesh);
            
            // Collision detection
            if (this.car.box.intersectsBox(itemObj.box)) {
                // Hit! 根据撞击的道具增加不同的分数
                this.score += config.score;
                this.scoreUI.innerText = `得分: ${this.score}`;
                
                // Show effect，并传入道具的颜色以便爆炸特效与道具颜色一致
                this.createExplosion(mesh.position, config.colorHex);
                
                // Remove
                this.scene.remove(mesh);
                this.collectibles.splice(i, 1);
                continue;
            }
            
            // Missed / Behind car
            if (mesh.position.z > 10) {
                this.scene.remove(mesh);
                this.collectibles.splice(i, 1);
            }
        }
        
        // Update explosions
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const exp = this.explosions[i];
            exp.life -= delta * 2;
            
            if (exp.life <= 0) {
                this.scene.remove(exp.points);
                exp.points.geometry.dispose();
                exp.points.material.dispose();
                this.explosions.splice(i, 1);
                continue;
            }
            
            const positions = exp.points.geometry.attributes.position.array;
            for (let j = 0; j < positions.length / 3; j++) {
                const vel = exp.velocities[j];
                positions[j * 3] += vel.x * delta * 10;
                positions[j * 3 + 1] += vel.y * delta * 10;
                positions[j * 3 + 2] += vel.z * delta * 10;
            }
            exp.points.geometry.attributes.position.needsUpdate = true;
            exp.points.material.opacity = exp.life;
        }
    }
}
