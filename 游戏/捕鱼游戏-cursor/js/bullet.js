// 子弹类
class Bullet {
    constructor(x, y, targetX, targetY, cannonLevel) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        
        // 计算方向和速度
        const angle = Utils.angle(x, y, targetX, targetY);
        this.vx = Math.cos(angle) * GameConfig.BULLET.speed;
        this.vy = Math.sin(angle) * GameConfig.BULLET.speed;
        
        this.radius = GameConfig.BULLET.radius;
        this.cannonLevel = cannonLevel;
        this.alive = true;
        this.distanceTraveled = 0;
        this.maxDistance = Utils.distance(x, y, targetX, targetY);
        
        // 子弹颜色根据炮台等级
        this.color = GameConfig.CANNON.levels[cannonLevel - 1].color;
        
        // 拖尾效果
        this.trail = [];
        this.maxTrailLength = 8;
    }

    update(deltaTime, canvasWidth, canvasHeight) {
        if (!this.alive) return;

        // 保存轨迹
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        // 更新位置
        this.x += this.vx;
        this.y += this.vy;
        this.distanceTraveled = Utils.distance(this.startX, this.startY, this.x, this.y);

        // 检查是否到达目标或超出边界
        if (this.distanceTraveled >= this.maxDistance || 
            this.x < 0 || this.x > canvasWidth || 
            this.y < 0 || this.y > canvasHeight) {
            this.explode();
        }
    }

    draw(ctx) {
        if (!this.alive) return;

        // 绘制拖尾
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = (i + 1) / this.trail.length * 0.7;
            const size = (i + 1) / this.trail.length * this.radius;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 绘制子弹主体
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制高光
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(this.x - 1, this.y - 1, this.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    explode() {
        this.alive = false;
        return new Net(this.x, this.y, this.cannonLevel);
    }

    // 检查边界碰撞
    checkBounds(canvasWidth, canvasHeight) {
        return this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight;
    }
}

// 渔网类
class Net {
    constructor(x, y, cannonLevel) {
        this.x = x;
        this.y = y;
        this.cannonLevel = cannonLevel;
        this.config = GameConfig.CANNON.levels[cannonLevel - 1];
        
        // 渔网属性
        this.radius = 0;
        this.maxRadius = this.config.netSize;
        this.expandSpeed = GameConfig.NET.expandSpeed;
        this.duration = GameConfig.NET.duration;
        this.age = 0;
        this.alive = true;
        
        // 动画属性
        this.opacity = 1;
        this.phase = 'expanding'; // expanding, active, contracting
        this.rotationAngle = 0;
        
        // 网格属性
        this.gridSize = 8;
        this.waveOffset = 0;
    }

    update(deltaTime) {
        if (!this.alive) return;

        this.age += deltaTime;
        this.rotationAngle += 0.02;
        this.waveOffset += 0.1;

        switch (this.phase) {
            case 'expanding':
                this.radius += this.expandSpeed;
                if (this.radius >= this.maxRadius) {
                    this.radius = this.maxRadius;
                    this.phase = 'active';
                }
                break;
                
            case 'active':
                if (this.age >= this.duration * 0.7) {
                    this.phase = 'contracting';
                }
                break;
                
            case 'contracting':
                this.radius -= this.expandSpeed * 2;
                this.opacity -= 0.03;
                if (this.radius <= 0 || this.opacity <= 0) {
                    this.alive = false;
                }
                break;
        }

        // 渔网存在时间限制
        if (this.age >= this.duration) {
            this.alive = false;
        }
    }

    draw(ctx) {
        if (!this.alive || this.radius <= 0) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationAngle);
        ctx.globalAlpha = this.opacity;

        // 绘制渔网背景圆
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0.1)`);
        gradient.addColorStop(0.7, `rgba(255, 255, 255, 0.3)`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0.1)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 绘制渔网网格
        ctx.strokeStyle = `rgba(255, 255, 255, 0.8)`;
        ctx.lineWidth = 2;
        
        // 径向线
        const radialLines = 12;
        for (let i = 0; i < radialLines; i++) {
            const angle = (i / radialLines) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(
                Math.cos(angle) * this.radius,
                Math.sin(angle) * this.radius
            );
            ctx.stroke();
        }

        // 同心圆
        const rings = Math.floor(this.radius / this.gridSize);
        for (let i = 1; i <= rings; i++) {
            const ringRadius = (i / rings) * this.radius;
            ctx.beginPath();
            ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
        }

        // 绘制闪光效果
        if (this.phase === 'expanding') {
            ctx.strokeStyle = this.config.color;
            ctx.lineWidth = 4;
            ctx.shadowColor = this.config.color;
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.stroke();
        }

        // 绘制波纹效果
        for (let i = 0; i < 3; i++) {
            const waveRadius = this.radius + Math.sin(this.waveOffset + i) * 5;
            const waveAlpha = 0.3 - i * 0.1;
            
            ctx.globalAlpha = this.opacity * waveAlpha;
            ctx.strokeStyle = `rgba(255, 255, 255, 1)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, waveRadius, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    // 检查是否可以捕获鱼
    canCapture() {
        return this.phase === 'expanding' || this.phase === 'active';
    }

    // 获取捕获范围
    getCaptureRadius() {
        return this.canCapture() ? this.radius : 0;
    }
}

// 子弹和渔网管理器
class ProjectileManager {
    constructor() {
        this.bullets = [];
        this.nets = [];
    }

    update(deltaTime, canvasWidth, canvasHeight) {
        // 更新子弹
        this.bullets.forEach(bullet => {
            bullet.update(deltaTime, canvasWidth, canvasHeight);
            
            // 检查子弹是否爆炸
            if (!bullet.alive) {
                const net = bullet.explode();
                if (net) {
                    this.nets.push(net);
                }
            }
        });

        // 更新渔网
        this.nets.forEach(net => net.update(deltaTime));

        // 移除失效的子弹和渔网
        this.bullets = this.bullets.filter(bullet => bullet.alive);
        this.nets = this.nets.filter(net => net.alive);
    }

    draw(ctx) {
        // 先绘制子弹，再绘制渔网
        this.bullets.forEach(bullet => bullet.draw(ctx));
        this.nets.forEach(net => net.draw(ctx));
    }

    // 发射子弹
    shootBullet(startX, startY, targetX, targetY, cannonLevel) {
        const bullet = new Bullet(startX, startY, targetX, targetY, cannonLevel);
        this.bullets.push(bullet);
        return bullet;
    }

    // 检查渔网捕获
    checkNetCaptures(fishManager) {
        const totalCaught = [];
        
        this.nets.forEach(net => {
            if (net.canCapture()) {
                const caught = fishManager.checkNetCapture(net.x, net.y, net.getCaptureRadius());
                totalCaught.push(...caught);
            }
        });
        
        return totalCaught;
    }

    // 清空所有弹药
    clear() {
        this.bullets = [];
        this.nets = [];
    }

    // 获取活跃的渔网数量
    getActiveNetsCount() {
        return this.nets.length;
    }

    // 获取活跃的子弹数量
    getActiveBulletsCount() {
        return this.bullets.length;
    }
} 