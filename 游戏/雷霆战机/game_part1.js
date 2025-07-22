/**
 * Background 类的 draw 方法和 Player 类的实现
 */

// Background 类的 draw 方法
Background.prototype.draw = function(ctx) {
    // 绘制深色背景
    ctx.fillStyle = '#0c0c2c';
    ctx.fillRect(0, 0, this.game.width, this.game.height);
    
    // 绘制星星
    this.stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.7})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
};

/**
 * 玩家飞机类
 * 处理玩家飞机的移动、射击和状态
 */
class Player {
    /**
     * 构造函数
     * @param {Game} game - 游戏实例
     */
    constructor(game) {
        this.game = game;
        this.width = 50;
        this.height = 50;
        this.x = game.width / 2 - this.width / 2;
        this.y = game.height - this.height - 20;
        this.speed = 5;
        this.weaponLevel = 1;
        this.shootTimer = 0;
        this.shootInterval = 300; // 射击间隔（毫秒）
        this.shieldActive = false;
        this.shieldTimer = 0;
        this.shieldDuration = 5000; // 护盾持续时间（毫秒）
    }
    
    /**
     * 更新玩家状态
     * @param {number} deltaTime - 时间差（毫秒）
     * @param {Object} keys - 按键状态
     */
    update(deltaTime, keys) {
        // 处理移动
        if (keys.ArrowLeft || keys.a) {
            this.x = Math.max(0, this.x - this.speed);
        }
        if (keys.ArrowRight || keys.d) {
            this.x = Math.min(this.game.width - this.width, this.x + this.speed);
        }
        if (keys.ArrowUp || keys.w) {
            this.y = Math.max(0, this.y - this.speed);
        }
        if (keys.ArrowDown || keys.s) {
            this.y = Math.min(this.game.height - this.height, this.y + this.speed);
        }
        
        // 处理射击
        this.shootTimer += deltaTime;
        if ((keys.Space || keys[' ']) && this.shootTimer > this.shootInterval) {
            this.shoot();
            this.shootTimer = 0;
        }
        
        // 处理护盾
        if (this.shieldActive) {
            this.shieldTimer += deltaTime;
            if (this.shieldTimer > this.shieldDuration) {
                this.shieldActive = false;
                this.shieldTimer = 0;
            }
        }
    }
    
    /**
     * 绘制玩家飞机
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    draw(ctx) {
        // 绘制飞机
        if (this.shieldActive) {
            // 绘制护盾
            ctx.fillStyle = 'rgba(52, 152, 219, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 + 10, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 飞机主体
        ctx.fillStyle = '#4cd137';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.8);
        ctx.lineTo(this.x + this.width * 0.7, this.y + this.height * 0.7);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.3, this.y + this.height * 0.7);
        ctx.lineTo(this.x, this.y + this.height * 0.8);
        ctx.closePath();
        ctx.fill();
        
        // 飞机驾驶舱
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height * 0.4, this.width * 0.16, 0, Math.PI * 2);
        ctx.fill();
        
        // 飞机引擎
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.rect(this.x + this.width * 0.4, this.y + this.height * 0.8, this.width * 0.2, this.height * 0.1);
        ctx.fill();
        
        // 飞机尾焰
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.4, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.5, this.y + this.height + 10);
        ctx.lineTo(this.x + this.width * 0.6, this.y + this.height);
        ctx.closePath();
        ctx.fill();
    }
    
    /**
     * 射击
     */
    shoot() {
        switch (this.weaponLevel) {
            case 1:
                // 单发子弹
                this.game.addBullet(this.x + this.width / 2 - 2.5, this.y, 1);
                break;
            case 2:
                // 双发子弹
                this.game.addBullet(this.x + this.width * 0.3, this.y + 10, 1);
                this.game.addBullet(this.x + this.width * 0.7, this.y + 10, 1);
                break;
            case 3:
                // 三发子弹
                this.game.addBullet(this.x + this.width / 2 - 5, this.y, 2);
                this.game.addBullet(this.x + this.width * 0.2, this.y + 10, 1);
                this.game.addBullet(this.x + this.width * 0.8, this.y + 10, 1);
                break;
            case 4:
                // 高级武器
                this.game.addBullet(this.x + this.width / 2 - 7.5, this.y, 3);
                break;
        }
    }
    
    /**
     * 重置玩家状态
     */
    reset() {
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.height - 20;
        this.weaponLevel = 1;
        this.shieldActive = false;
        this.shieldTimer = 0;
    }
    
    /**
     * 激活护盾
     */
    activateShield() {
        this.shieldActive = true;
        this.shieldTimer = 0;
    }
    
    /**
     * 升级武器
     */
    upgradeWeapon() {
        this.weaponLevel = Math.min(4, this.weaponLevel + 1);
    }
}