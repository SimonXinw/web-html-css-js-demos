/**
 * 玩家飞机类
 * 处理玩家飞机的移动和射击
 */
class Player {
    /**
     * 玩家飞机构造函数
     * @param {Game} game - 游戏实例
     */
    constructor(game) {
        this.game = game;
        this.width = 50;
        this.height = 60;
        this.x = game.canvas.width / 2 - this.width / 2;
        this.y = game.canvas.height - this.height - 20;
        this.speed = 0.3; // 移动速度系数
        this.targetX = this.x;
        this.targetY = this.y;
        
        // 创建武器系统
        this.weaponSystem = new WeaponSystem(game, this);
        
        // 引擎粒子效果计时器
        this.engineParticleTimer = 0;
        
        // 无敌状态（游戏开始时短暂无敌）
        this.invincible = true;
        this.invincibleTime = 2000; // 2秒无敌时间
        this.invincibleTimer = 0;
        
        // 玩家飞机图片
        this.images = {
            1: null, // 将在游戏加载时设置
            2: null,
            3: null
        };
    }
    
    /**
     * 设置玩家飞机图片
     * @param {Object} images - 飞机图片对象
     */
    setImages(images) {
        this.images = images;
    }
    
    /**
     * 更新玩家状态
     * @param {number} deltaTime - 帧间隔时间
     */
    update(deltaTime) {
        // 平滑移动到目标位置
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        this.x += dx * this.speed * (deltaTime / 16);
        this.y += dy * this.speed * (deltaTime / 16);
        
        // 确保玩家不会移出屏幕
        this.x = Math.max(0, Math.min(this.game.canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(this.game.canvas.height - this.height, this.y));
        
        // 创建引擎粒子效果
        this.engineParticleTimer += deltaTime;
        if (this.engineParticleTimer > 50) { // 每50ms创建一个粒子
            const particle = createEngineFlame(
                this.game,
                this.x + this.width / 2,
                this.y + this.height
            );
            this.game.particles.push(particle);
            this.engineParticleTimer = 0;
        }
        
        // 更新无敌状态
        if (this.invincible) {
            this.invincibleTimer += deltaTime;
            if (this.invincibleTimer >= this.invincibleTime) {
                this.invincible = false;
            }
        }
    }
    
    /**
     * 绘制玩家飞机
     */
    draw() {
        const ctx = this.game.ctx;
        
        // 无敌状态闪烁效果
        if (this.invincible && Math.floor(this.invincibleTimer / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }
        
        const currentImage = this.images[this.weaponSystem.getLevel()];
        
        if (currentImage) {
            // 绘制图片飞机
            ctx.drawImage(currentImage, this.x, this.y, this.width, this.height);
        } else {
            // 如果没有图片，绘制一个默认的飞机
            // 绘制飞机主体
            ctx.fillStyle = '#0066cc';
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.closePath();
            ctx.fill();
            
            // 绘制飞机座舱
            ctx.fillStyle = '#00aaff';
            ctx.beginPath();
            ctx.ellipse(
                this.x + this.width / 2,
                this.y + this.height / 3,
                this.width / 4,
                this.height / 6,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        
        // 恢复透明度
        ctx.globalAlpha = 1;
    }
    
    /**
     * 移动到指定位置
     * @param {number} x - 目标x坐标
     * @param {number} y - 目标y坐标
     */
    moveTo(x, y) {
        this.targetX = x - this.width / 2;
        this.targetY = y - this.height / 2;
    }
    
    /**
     * 发射子弹
     */
    shoot() {
        const bullets = this.weaponSystem.shoot();
        this.game.bullets.push(...bullets);
    }
    
    /**
     * 升级武器
     * @returns {boolean} - 是否成功升级
     */
    upgradeWeapon() {
        return this.weaponSystem.upgrade();
    }
    
    /**
     * 获取当前武器等级
     * @returns {number} - 武器等级
     */
    getWeaponLevel() {
        return this.weaponSystem.getLevel();
    }
    
    /**
     * 重置玩家状态
     */
    reset() {
        this.x = this.game.canvas.width / 2 - this.width / 2;
        this.y = this.game.canvas.height - this.height - 20;
        this.targetX = this.x;
        this.targetY = this.y;
        this.weaponSystem.reset();
        this.invincible = true;
        this.invincibleTimer = 0;
    }
}