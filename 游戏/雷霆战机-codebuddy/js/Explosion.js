/**
 * 爆炸效果类
 */
class Explosion {
    /**
     * 爆炸效果构造函数
     * @param {number} x - 爆炸中心x坐标
     * @param {number} y - 爆炸中心y坐标
     * @param {string} type - 爆炸类型
     */
    constructor(x, y, type = 'normal') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.isFinished = false;
        
        // 根据类型设置爆炸属性
        this.setupExplosionType();
        
        // 粒子系统
        this.particles = [];
        this.createParticles();
        
        // 动画参数
        this.animationFrame = 0;
        this.duration = 0;
    }
    
    /**
     * 设置爆炸类型属性
     */
    setupExplosionType() {
        switch (this.type) {
            case 'normal':
                this.maxRadius = 30;
                this.maxDuration = 500;
                this.particleCount = 8;
                this.colors = ['#ff6600', '#ff9900', '#ffcc00'];
                break;
            case 'large':
                this.maxRadius = 50;
                this.maxDuration = 800;
                this.particleCount = 15;
                this.colors = ['#ff3300', '#ff6600', '#ff9900', '#ffcc00'];
                break;
            case 'plasma':
                this.maxRadius = 40;
                this.maxDuration = 600;
                this.particleCount = 12;
                this.colors = ['#ff00ff', '#ff66ff', '#ffaaff'];
                break;
        }
    }
    
    /**
     * 创建爆炸粒子
     */
    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const angle = (i / this.particleCount) * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            const size = 3 + Math.random() * 5;
            
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                maxSize: size,
                life: 1.0,
                color: this.colors[Math.floor(Math.random() * this.colors.length)]
            });
        }
    }
    
    /**
     * 更新爆炸效果状态
     * @param {number} deltaTime - 帧间隔时间
     */
    update(deltaTime) {
        this.duration += deltaTime;
        this.animationFrame += 0.2;
        
        // 更新粒子
        for (let particle of this.particles) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= deltaTime / this.maxDuration;
            particle.size = particle.maxSize * particle.life;
            
            // 添加重力效果
            particle.vy += 0.1;
        }
        
        // 检查是否结束
        if (this.duration >= this.maxDuration) {
            this.isFinished = true;
        }
    }
    
    /**
     * 渲染爆炸效果
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    render(ctx) {
        ctx.save();
        
        const progress = this.duration / this.maxDuration;
        const radius = this.maxRadius * progress;
        const opacity = 1 - progress;
        
        // 渲染主爆炸圈
        this.renderMainExplosion(ctx, radius, opacity);
        
        // 渲染粒子
        this.renderParticles(ctx);
        
        // 渲染冲击波
        if (progress < 0.3) {
            this.renderShockwave(ctx, radius, opacity);
        }
        
        ctx.restore();
    }
    
    /**
     * 渲染主爆炸圈
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     * @param {number} radius - 爆炸半径
     * @param {number} opacity - 透明度
     */
    renderMainExplosion(ctx, radius, opacity) {
        // 外圈
        const outerGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
        outerGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.8})`);
        outerGradient.addColorStop(0.3, `rgba(255, 150, 0, ${opacity * 0.6})`);
        outerGradient.addColorStop(0.7, `rgba(255, 50, 0, ${opacity * 0.3})`);
        outerGradient.addColorStop(1, `rgba(255, 0, 0, 0)`);
        
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 内核
        const coreRadius = radius * 0.4;
        const coreGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, coreRadius);
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        coreGradient.addColorStop(0.5, `rgba(255, 200, 100, ${opacity * 0.8})`);
        coreGradient.addColorStop(1, `rgba(255, 100, 0, ${opacity * 0.4})`);
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, coreRadius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * 渲染爆炸粒子
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    renderParticles(ctx) {
        for (let particle of this.particles) {
            if (particle.life <= 0) continue;
            
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // 添加光晕
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = particle.size * 2;
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
    
    /**
     * 渲染冲击波
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     * @param {number} radius - 爆炸半径
     * @param {number} opacity - 透明度
     */
    renderShockwave(ctx, radius, opacity) {
        const shockwaveRadius = radius * 2;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, shockwaveRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.strokeStyle = `rgba(255, 200, 0, ${opacity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, shockwaveRadius * 1.2, 0, Math.PI * 2);
        ctx.stroke();
    }
}

/**
 * 升级特效类
 */
class UpgradeEffect {
    /**
     * 升级特效构造函数
     * @param {number} x - 中心x坐标
     * @param {number} y - 中心y坐标
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.duration = 0;
        this.maxDuration = 1000;
        this.isFinished = false;
        
        // 创建光环粒子
        this.rings = [];
        for (let i = 0; i < 3; i++) {
            this.rings.push({
                radius: 10 + i * 15,
                maxRadius: 50 + i * 20,
                opacity: 1,
                speed: 0.5 + i * 0.2
            });
        }
        
        // 创建星星粒子
        this.stars = [];
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            this.stars.push({
                x: this.x,
                y: this.y,
                targetX: this.x + Math.cos(angle) * 60,
                targetY: this.y + Math.sin(angle) * 60,
                size: 4,
                opacity: 1
            });
        }
    }
    
    /**
     * 更新升级特效
     * @param {number} deltaTime - 帧间隔时间
     */
    update(deltaTime) {
        this.duration += deltaTime;
        const progress = this.duration / this.maxDuration;
        
        // 更新光环
        for (let ring of this.rings) {
            ring.radius += ring.speed * deltaTime * 0.1;
            ring.opacity = 1 - (ring.radius / ring.maxRadius);
        }
        
        // 更新星星
        for (let star of this.stars) {
            const t = Math.min(progress * 2, 1);
            star.x = this.x + (star.targetX - this.x) * t;
            star.y = this.y + (star.targetY - this.y) * t;
            star.opacity = 1 - progress;
        }
        
        if (progress >= 1) {
            this.isFinished = true;
        }
    }
    
    /**
     * 渲染升级特效
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    render(ctx) {
        ctx.save();
        
        // 渲染光环
        for (let ring of this.rings) {
            if (ring.opacity <= 0) continue;
            
            ctx.globalAlpha = ring.opacity;
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, ring.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // 渲染星星
        for (let star of this.stars) {
            if (star.opacity <= 0) continue;
            
            ctx.globalAlpha = star.opacity;
            ctx.fillStyle = '#ffff00';
            this.renderStar(ctx, star.x, star.y, star.size);
        }
        
        // 渲染中心光芒
        const progress = this.duration / this.maxDuration;
        if (progress < 0.5) {
            ctx.globalAlpha = 1 - progress * 2;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 20 * (1 - progress), 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    /**
     * 渲染星星形状
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     * @param {number} x - x坐标
     * @param {number} y - y坐标
     * @param {number} size - 大小
     */
    renderStar(ctx, x, y, size) {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5;
            const radius = i % 2 === 0 ? size : size / 2;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        ctx.fill();
    }
}