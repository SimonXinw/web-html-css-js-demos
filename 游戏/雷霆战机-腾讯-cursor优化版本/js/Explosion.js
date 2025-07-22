/**
 * 爆炸效果类
 * 处理爆炸动画
 */
class Explosion {
    /**
     * 构造函数
     * @param {number} x - 爆炸x坐标
     * @param {number} y - 爆炸y坐标
     * @param {Game} game - 游戏实例
     * @param {number} size - 爆炸大小
     */
    constructor(x, y, game, size = 1) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.frame = 0;
        this.maxFrame = 8;
        this.frameTime = 0;
        this.frameInterval = 80; // 帧间隔（毫秒）
        this.radius = 30 * size;
        this.particles = this.createParticles();
        this.maxParticles = 20;
    }
    
    /**
     * 创建爆炸粒子
     */
    createParticles() {
        const particles = [];
        for (let i = 0; i < this.maxParticles; i++) {
            const angle = (Math.PI * 2 / this.maxParticles) * i;
            const speed = Math.random() * 3 + 2;
            particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                maxLife: 1.0,
                size: Math.random() * 4 + 2,
                color: this.getRandomExplosionColor()
            });
        }
        return particles;
    }
    
    /**
     * 获取随机爆炸颜色
     */
    getRandomExplosionColor() {
        const colors = ['#f39c12', '#e74c3c', '#e67e22', '#f1c40f', '#ff6b6b'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    /**
     * 更新爆炸状态
     * @param {number} deltaTime - 时间差（毫秒）
     */
    update(deltaTime) {
        this.frameTime += deltaTime;
        if (this.frameTime > this.frameInterval) {
            this.frame++;
            this.frameTime = 0;
        }
        
        // 更新粒子
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= deltaTime / 1000;
            
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }
    
    /**
     * 绘制爆炸效果
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    draw(ctx) {
        // 绘制爆炸中心
        this.drawExplosionCenter(ctx);
        
        // 绘制爆炸光芒
        this.drawExplosionRays(ctx);
        
        // 绘制爆炸粒子
        this.drawExplosionParticles(ctx);
    }
    
    /**
     * 绘制爆炸中心
     */
    drawExplosionCenter(ctx) {
        const progress = this.frame / this.maxFrame;
        const currentRadius = this.radius * (1 - progress * 0.5);
        
        // 创建径向渐变
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, currentRadius
        );
        gradient.addColorStop(0, '#f39c12');
        gradient.addColorStop(0.3, '#e74c3c');
        gradient.addColorStop(0.7, '#e67e22');
        gradient.addColorStop(1, 'rgba(192, 57, 43, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * 绘制爆炸光芒
     */
    drawExplosionRays(ctx) {
        const progress = this.frame / this.maxFrame;
        const rayCount = 16;
        const rayLength = (30 + Math.random() * 20) * (1 - progress * 0.5);
        const rayWidth = 3 * (1 - progress * 0.5);
        
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = rayWidth;
        
        for (let i = 0; i < rayCount; i++) {
            const angle = Math.PI * 2 / rayCount * i;
            const length = rayLength + Math.random() * 10;
            
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x + Math.cos(angle) * length,
                this.y + Math.sin(angle) * length
            );
            ctx.stroke();
        }
    }
    
    /**
     * 绘制爆炸粒子
     */
    drawExplosionParticles(ctx) {
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
            ctx.fill();
            
            // 粒子光晕
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * alpha * 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }
} 