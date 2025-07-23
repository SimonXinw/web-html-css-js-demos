/**
 * 粒子效果类
 * 用于创建爆炸、引擎尾焰等特效
 */
class Particle {
    /**
     * 粒子构造函数
     * @param {Game} game - 游戏实例
     * @param {number} x - 粒子x坐标
     * @param {number} y - 粒子y坐标
     * @param {Object} options - 粒子配置选项
     */
    constructor(game, x, y, options = {}) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.size = options.size || randomBetween(1, 3);
        this.speedX = options.speedX || randomBetween(-0.5, 0.5);
        this.speedY = options.speedY || randomBetween(-0.5, 0.5);
        this.color = options.color || '#ffffff';
        this.maxLife = options.maxLife || 500;
        this.life = this.maxLife;
        this.gravity = options.gravity || 0;
        this.image = options.image || null;
        this.rotation = options.rotation || 0;
        this.rotationSpeed = options.rotationSpeed || randomBetween(-0.1, 0.1);
    }
    
    /**
     * 更新粒子状态
     * @param {number} deltaTime - 帧间隔时间
     */
    update(deltaTime) {
        this.x += this.speedX * deltaTime;
        this.y += this.speedY * deltaTime;
        this.speedY += this.gravity * deltaTime / 1000;
        this.life -= deltaTime;
        this.rotation += this.rotationSpeed * deltaTime;
    }
    
    /**
     * 绘制粒子
     */
    draw() {
        const ctx = this.game.ctx;
        const alpha = this.life / this.maxLife;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        if (this.image) {
            // 绘制图片粒子
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.drawImage(
                this.image,
                -this.size / 2,
                -this.size / 2,
                this.size,
                this.size
            );
        } else {
            // 绘制普通粒子
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    /**
     * 检查粒子是否已经死亡
     * @returns {boolean} - 是否死亡
     */
    isDead() {
        return this.life <= 0;
    }
}

/**
 * 爆炸效果生成器
 * @param {Game} game - 游戏实例
 * @param {number} x - 爆炸中心x坐标
 * @param {number} y - 爆炸中心y坐标
 * @param {Object} options - 爆炸配置选项
 * @returns {Array<Particle>} - 生成的粒子数组
 */
function createExplosion(game, x, y, options = {}) {
    const particles = [];
    const count = options.count || 20;
    const colors = options.colors || ['#ffaa00', '#ff5500', '#ff0000', '#ffffff'];
    const maxLife = options.maxLife || 500;
    const size = options.size || { min: 1, max: 3 };
    const speed = options.speed || { min: 0.1, max: 0.5 };
    const useImage = options.useImage || false;
    
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 20;
        const particleX = x + Math.cos(angle) * distance;
        const particleY = y + Math.sin(angle) * distance;
        
        const particleOptions = {
            size: randomBetween(size.min, size.max),
            speedX: Math.cos(angle) * randomBetween(speed.min, speed.max),
            speedY: Math.sin(angle) * randomBetween(speed.min, speed.max),
            color: colors[Math.floor(Math.random() * colors.length)],
            maxLife: randomBetween(maxLife * 0.7, maxLife),
            gravity: 0.01,
            rotationSpeed: randomBetween(-0.1, 0.1)
        };
        
        if (useImage && game.assets.explosion) {
            particleOptions.image = game.assets.explosion;
        }
        
        particles.push(new Particle(game, particleX, particleY, particleOptions));
    }
    
    return particles;
}

/**
 * 引擎尾焰效果生成器
 * @param {Game} game - 游戏实例
 * @param {number} x - 尾焰起始x坐标
 * @param {number} y - 尾焰起始y坐标
 * @param {Object} options - 尾焰配置选项
 * @returns {Particle} - 生成的粒子
 */
function createEngineFlame(game, x, y, options = {}) {
    const colors = options.colors || ['#ff5500', '#ffaa00', '#ff0000'];
    
    const particleOptions = {
        size: randomBetween(3, 8),
        speedX: randomBetween(-0.05, 0.05),
        speedY: randomBetween(0.1, 0.3),
        color: colors[Math.floor(Math.random() * colors.length)],
        maxLife: randomBetween(100, 300)
    };
    
    return new Particle(game, x, y, particleOptions);
}