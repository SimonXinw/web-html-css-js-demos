/**
 * 敌机类
 */
class Enemy {
    /**
     * 敌机构造函数
     * @param {number} x - 初始x坐标
     * @param {number} y - 初始y坐标
     * @param {Game} game - 游戏实例
     * @param {string} type - 敌机类型
     */
    constructor(x, y, game, type = 'normal') {
        this.x = x;
        this.y = y;
        this.game = game;
        this.type = type;
        
        // 根据类型设置属性
        this.setupEnemyType();
        
        // 动画和移动
        this.animationFrame = 0;
        this.movePattern = Math.random() * 3; // 移动模式
        this.originalX = x;
        this.health = this.maxHealth;
        
        // 射击系统（部分敌机会射击）
        this.canShoot = this.type !== 'normal';
        this.lastShootTime = 0;
        this.shootCooldown = 2000 + Math.random() * 1000;
    }
    
    /**
     * 设置敌机类型属性
     */
    setupEnemyType() {
        switch (this.type) {
            case 'normal':
                this.width = 40;
                this.height = 40;
                this.speed = 2 + Math.random() * 2;
                this.maxHealth = 10;
                this.scoreValue = 10;
                this.color = '#ff3030';
                break;
            case 'fast':
                this.width = 35;
                this.height = 35;
                this.speed = 4 + Math.random() * 2;
                this.maxHealth = 15;
                this.scoreValue = 20;
                this.color = '#ff8030';
                break;
            case 'heavy':
                this.width = 60;
                this.height = 50;
                this.speed = 1 + Math.random();
                this.maxHealth = 50;
                this.scoreValue = 50;
                this.color = '#8030ff';
                break;
            case 'boss':
                this.width = 100;
                this.height = 80;
                this.speed = 1;
                this.maxHealth = 200;
                this.scoreValue = 200;
                this.color = '#ff3080';
                break;
        }
    }
    
    /**
     * 更新敌机状态
     * @param {number} deltaTime - 帧间隔时间
     */
    update(deltaTime) {
        // 基础向下移动
        this.y += this.speed;
        
        // 根据移动模式添加横向移动
        this.updateMovement();
        
        // 更新动画帧
        this.animationFrame += 0.1;
        
        // 敌机射击
        if (this.canShoot) {
            this.updateShooting();
        }
        
        // 边界检查
        this.x = Math.max(0, Math.min(this.x, this.game.canvas.width - this.width));
    }
    
    /**
     * 更新移动模式
     */
    updateMovement() {
        const time = Date.now() * 0.001;
        
        switch (Math.floor(this.movePattern)) {
            case 0: // 直线下降
                break;
            case 1: // 左右摆动
                this.x = this.originalX + Math.sin(time * 2) * 30;
                break;
            case 2: // Z字形移动
                this.x += Math.sin(time * 3) * 2;
                break;
        }
    }
    
    /**
     * 更新射击
     */
    updateShooting() {
        const currentTime = performance.now();
        if (currentTime - this.lastShootTime > this.shootCooldown) {
            this.shoot();
            this.lastShootTime = currentTime;
        }
    }
    
    /**
     * 敌机射击
     */
    shoot() {
        const bullet = new EnemyBullet(
            this.x + this.width / 2 - 2,
            this.y + this.height,
            this.game
        );
        this.game.enemyBullets.push(bullet);
    }
    
    /**
     * 受到伤害
     * @param {number} damage - 伤害值
     * @returns {boolean} - 是否被摧毁
     */
    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }
    
    /**
     * 渲染敌机
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    render(ctx) {
        ctx.save();
        
        // 受伤闪烁效果
        if (this.health < this.maxHealth * 0.3) {
            ctx.globalAlpha = 0.7 + 0.3 * Math.sin(this.animationFrame * 10);
        }
        
        switch (this.type) {
            case 'normal':
                this.renderNormalEnemy(ctx);
                break;
            case 'fast':
                this.renderFastEnemy(ctx);
                break;
            case 'heavy':
                this.renderHeavyEnemy(ctx);
                break;
            case 'boss':
                this.renderBossEnemy(ctx);
                break;
        }
        
        // 渲染血条
        if (this.health < this.maxHealth) {
            this.renderHealthBar(ctx);
        }
        
        ctx.restore();
    }
    
    /**
     * 渲染普通敌机
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    renderNormalEnemy(ctx) {
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#ff6060');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, '#cc0000');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + this.height); // 底部中点
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.3); // 右上
        ctx.lineTo(this.x + this.width * 0.7, this.y); // 右机头
        ctx.lineTo(this.x + this.width * 0.3, this.y); // 左机头
        ctx.lineTo(this.x, this.y + this.height * 0.3); // 左上
        ctx.closePath();
        ctx.fill();
        
        // 驾驶舱
        ctx.fillStyle = '#ff9000';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height * 0.4, 6, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * 渲染快速敌机
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    renderFastEnemy(ctx) {
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#ffaa60');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, '#cc4400');
        
        // 更流线型的设计
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y); // 机头
        ctx.lineTo(this.x + this.width * 0.9, this.y + this.height * 0.4);
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.8);
        ctx.lineTo(this.x + this.width * 0.6, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.4, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height * 0.8);
        ctx.lineTo(this.x + this.width * 0.1, this.y + this.height * 0.4);
        ctx.closePath();
        ctx.fill();
        
        // 引擎光效
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(this.x + this.width * 0.2, this.y + this.height * 0.8, this.width * 0.6, 4);
    }
    
    /**
     * 渲染重型敌机
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    renderHeavyEnemy(ctx) {
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#aa60ff');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, '#4400cc');
        
        // 厚重的设计
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x + this.width * 0.1, this.y, this.width * 0.8, this.height);
        
        // 装甲板
        ctx.fillStyle = '#6040aa';
        ctx.fillRect(this.x, this.y + this.height * 0.2, this.width, this.height * 0.6);
        
        // 武器系统
        ctx.fillStyle = '#ff6060';
        ctx.fillRect(this.x + this.width * 0.1, this.y + this.height * 0.7, this.width * 0.2, this.height * 0.2);
        ctx.fillRect(this.x + this.width * 0.7, this.y + this.height * 0.7, this.width * 0.2, this.height * 0.2);
    }
    
    /**
     * 渲染Boss敌机
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    renderBossEnemy(ctx) {
        const pulse = 0.8 + 0.2 * Math.sin(this.animationFrame * 2);
        
        // 主体渐变
        const gradient = ctx.createRadialGradient(
            this.x + this.width / 2, this.y + this.height / 2, 0,
            this.x + this.width / 2, this.y + this.height / 2, this.width / 2
        );
        gradient.addColorStop(0, '#ff60aa');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, '#aa0044');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 能量核心
        ctx.fillStyle = `rgba(255, 255, 0, ${pulse})`;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 15 * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // 武器炮塔
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + this.animationFrame;
            const turretX = this.x + this.width / 2 + Math.cos(angle) * 30;
            const turretY = this.y + this.height / 2 + Math.sin(angle) * 20;
            
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(turretX, turretY, 8, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    /**
     * 渲染血条
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    renderHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 4;
        const barX = this.x;
        const barY = this.y - 8;
        
        // 背景
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // 血量
        const healthPercent = this.health / this.maxHealth;
        const healthColor = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.2 ? '#ffff00' : '#ff0000';
        ctx.fillStyle = healthColor;
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    }
}

/**
 * 敌机子弹类
 */
class EnemyBullet {
    /**
     * 敌机子弹构造函数
     * @param {number} x - 初始x坐标
     * @param {number} y - 初始y坐标
     * @param {Game} game - 游戏实例
     */
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 10;
        this.speed = 6;
        this.game = game;
        this.damage = 20;
        this.color = '#ff0000';
    }
    
    /**
     * 更新敌机子弹状态
     * @param {number} deltaTime - 帧间隔时间
     */
    update(deltaTime) {
        this.y += this.speed;
    }
    
    /**
     * 渲染敌机子弹
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    render(ctx) {
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#ff6060');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, '#cc0000');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 光晕效果
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 3;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}