/**
 * 武器系统类
 * 管理玩家的武器升级和射击行为
 */
class WeaponSystem {
    /**
     * 武器系统构造函数
     * @param {Game} game - 游戏实例
     * @param {Player} player - 玩家实例
     */
    constructor(game, player) {
        this.game = game;
        this.player = player;
        this.level = 1;
        this.maxLevel = 3;
        this.lastShootTime = 0;
        this.shootInterval = 300; // 基础射击间隔(毫秒)
        this.bulletImages = {
            1: null, // 将在游戏加载时设置
            2: null,
            3: null
        };
    }
    
    /**
     * 设置子弹图片
     * @param {Object} images - 子弹图片对象
     */
    setBulletImages(images) {
        this.bulletImages = images;
    }
    
    /**
     * 升级武器
     * @returns {boolean} - 是否成功升级
     */
    upgrade() {
        if (this.level < this.maxLevel) {
            this.level++;
            // 每次升级减少射击间隔
            this.shootInterval = Math.max(100, 300 - (this.level - 1) * 50);
            return true;
        }
        return false;
    }
    
    /**
     * 获取当前武器等级
     * @returns {number} - 武器等级
     */
    getLevel() {
        return this.level;
    }
    
    /**
     * 重置武器系统
     */
    reset() {
        this.level = 1;
        this.shootInterval = 300;
        this.lastShootTime = 0;
    }
    
    /**
     * 发射子弹
     * @returns {Array<Bullet>} - 发射的子弹数组
     */
    shoot() {
        const now = performance.now();
        if (now - this.lastShootTime < this.shootInterval) {
            return [];
        }
        
        const bullets = [];
        const playerCenterX = this.player.x + this.player.width / 2;
        const bulletImage = this.bulletImages[this.level];
        
        // 根据武器等级创建不同的子弹模式
        switch (this.level) {
            case 1:
                // 单发直射子弹
                bullets.push(new Bullet(this.game, playerCenterX - 2.5, this.player.y, {
                    damage: 1,
                    color: '#00ffff',
                    glowColor: 'rgba(0, 255, 255, 0.3)',
                    image: bulletImage
                }));
                break;
                
            case 2:
                // 双发子弹
                bullets.push(new Bullet(this.game, playerCenterX - 15, this.player.y + 10, {
                    damage: 1,
                    color: '#00ffaa',
                    glowColor: 'rgba(0, 255, 170, 0.3)',
                    image: bulletImage
                }));
                bullets.push(new Bullet(this.game, playerCenterX + 10, this.player.y + 10, {
                    damage: 1,
                    color: '#00ffaa',
                    glowColor: 'rgba(0, 255, 170, 0.3)',
                    image: bulletImage
                }));
                break;
                
            case 3:
                // 三发子弹，中间直射，两侧斜射
                bullets.push(new Bullet(this.game, playerCenterX - 2.5, this.player.y, {
                    damage: 1.5,
                    color: '#00ffff',
                    glowColor: 'rgba(0, 255, 255, 0.3)',
                    image: bulletImage
                }));
                bullets.push(new Bullet(this.game, playerCenterX - 15, this.player.y + 10, {
                    damage: 1,
                    angle: -0.3, // 左斜
                    color: '#00ffaa',
                    glowColor: 'rgba(0, 255, 170, 0.3)',
                    image: bulletImage
                }));
                bullets.push(new Bullet(this.game, playerCenterX + 10, this.player.y + 10, {
                    damage: 1,
                    angle: 0.3, // 右斜
                    color: '#00ffaa',
                    glowColor: 'rgba(0, 255, 170, 0.3)',
                    image: bulletImage
                }));
                break;
        }
        
        this.lastShootTime = now;
        return bullets;
    }
}

/**
 * 能量道具类
 * 用于武器升级的掉落物品
 */
class PowerUp {
    /**
     * 能量道具构造函数
     * @param {Game} game - 游戏实例
     * @param {number} x - 道具x坐标
     * @param {number} y - 道具y坐标
     */
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 0.1;
        this.oscillationSpeed = 0.002;
        this.oscillationDistance = 10;
        this.startY = y;
        this.time = Math.random() * 1000; // 随机初始时间，使道具运动不同步
        this.image = game.assets.powerup;
        this.rotation = 0;
        this.rotationSpeed = 0.001;
    }
    
    /**
     * 更新道具状态
     * @param {number} deltaTime - 帧间隔时间
     */
    update(deltaTime) {
        this.y += this.speed * deltaTime;
        this.time += deltaTime;
        
        // 左右摆动
        this.x += Math.sin(this.time * this.oscillationSpeed) * 0.5;
        
        // 旋转效果
        this.rotation += this.rotationSpeed * deltaTime;
    }
    
    /**
     * 绘制道具
     */
    draw() {
        const ctx = this.game.ctx;
        
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        
        if (this.image) {
            ctx.drawImage(
                this.image,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
        } else {
            // 如果没有图片，绘制一个默认的能量道具
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制光晕
            const gradient = ctx.createRadialGradient(0, 0, this.width / 4, 0, 0, this.width);
            gradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, this.width, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
        
        // 添加闪烁效果
        if (Math.sin(this.time * 0.01) > 0.7) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    /**
     * 检查道具是否超出屏幕
     * @returns {boolean} - 是否超出屏幕
     */
    isOutOfBounds() {
        return this.y > this.game.canvas.height;
    }
}