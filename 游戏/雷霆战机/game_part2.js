/**
 * Enemy 类和 Bullet 类的实现
 */

/**
 * 敌机类
 * 处理敌机的移动和状态
 */
class Enemy {
    /**
     * 构造函数
     * @param {number} x - 敌机x坐标
     * @param {number} y - 敌机y坐标
     * @param {Game} game - 游戏实例
     * @param {number} type - 敌机类型
     */
    constructor(x, y, game, type = 1) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.type = type;
        
        // 根据类型设置敌机属性
        switch (type) {
            case 1: // 小型敌机
                this.width = 40;
                this.height = 40;
                this.speed = 2 + Math.random();
                this.health = 1;
                this.score = 10;
                break;
            case 2: // 中型敌机
                this.width = 50;
                this.height = 50;
                this.speed = 1.5 + Math.random() * 0.5;
                this.health = 3;
                this.score = 30;
                break;
            case 3: // 大型敌机（Boss）
                this.width = 80;
                this.height = 80;
                this.speed = 1 + Math.random() * 0.3;
                this.health = 10;
                this.score = 100;
                break;
        }
    }
    
    /**
     * 更新敌机状态
     * @param {number} deltaTime - 时间差（毫秒）
     */
    update(deltaTime) {
        this.y += this.speed;
    }
    
    /**
     * 绘制敌机
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    draw(ctx) {
        switch (this.type) {
            case 1: // 小型敌机
                // 敌机主体
                ctx.fillStyle = '#e74c3c';
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2, this.y);
                ctx.lineTo(this.x + this.width, this.y + this.height * 0.75);
                ctx.lineTo(this.x + this.width / 2, this.y + this.height);
                ctx.lineTo(this.x, this.y + this.height * 0.75);
                ctx.closePath();
                ctx.fill();
                
                // 敌机驾驶舱
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(this.x + this.width / 2, this.y + this.height * 0.4, this.width * 0.12, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 2: // 中型敌机
                // 敌机主体
                ctx.fillStyle = '#9b59b6';
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2, this.y);
                ctx.lineTo(this.x + this.width, this.y + this.height * 0.4);
                ctx.lineTo(this.x + this.width * 0.8, this.y + this.height);
                ctx.lineTo(this.x + this.width * 0.2, this.y + this.height);
                ctx.lineTo(this.x, this.y + this.height * 0.4);
                ctx.closePath();
                ctx.fill();
                
                // 敌机驾驶舱
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(this.x + this.width / 2, this.y + this.height * 0.4, this.width * 0.16, 0, Math.PI * 2);
                ctx.fill();
                
                // 敌机武器
                ctx.fillStyle = '#e74c3c';
                ctx.beginPath();
                ctx.rect(this.x + this.width * 0.2, this.y + this.height * 0.6, this.width * 0.2, this.height * 0.1);
                ctx.rect(this.x + this.width * 0.6, this.y + this.height * 0.6, this.width * 0.2, this.height * 0.1);
                ctx.fill();
                break;
                
            case 3: // 大型敌机（Boss）
                // 敌机主体
                ctx.fillStyle = '#2c3e50';
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2, this.y);
                ctx.lineTo(this.x + this.width * 0.9, this.y + this.height * 0.4);
                ctx.lineTo(this.x + this.width * 0.75, this.y + this.height * 0.9);
                ctx.lineTo(this.x + this.width * 0.25, this.y + this.height * 0.9);
                ctx.lineTo(this.x + this.width * 0.1, this.y + this.height * 0.4);
                ctx.closePath();
                ctx.fill();
                
                // 敌机驾驶舱
                ctx.fillStyle = '#e74c3c';
                ctx.beginPath();
                ctx.arc(this.x + this.width / 2, this.y + this.height * 0.4, this.width * 0.15, 0, Math.PI * 2);
                ctx.fill();
                
                // 敌机武器
                ctx.fillStyle = '#7f8c8d';
                ctx.beginPath();
                ctx.rect(this.x + this.width * 0.1, this.y + this.height * 0.5, this.width * 0.2, this.height * 0.12);
                ctx.rect(this.x + this.width * 0.7, this.y + this.height * 0.5, this.width * 0.2, this.height * 0.12);
                ctx.rect(this.x + this.width * 0.35, this.y + this.height * 0.75, this.width * 0.3, this.height * 0.15);
                ctx.fill();
                break;
        }
        
        // 绘制生命值条（仅对中型和大型敌机）
        if (this.type > 1) {
            const maxHealth = this.type === 2 ? 3 : 10;
            const healthPercent = this.health / maxHealth;
            
            // 背景
            ctx.fillStyle = '#7f8c8d';
            ctx.fillRect(this.x, this.y - 10, this.width, 5);
            
            // 生命值
            ctx.fillStyle = healthPercent > 0.5 ? '#2ecc71' : (healthPercent > 0.25 ? '#f39c12' : '#e74c3c');
            ctx.fillRect(this.x, this.y - 10, this.width * healthPercent, 5);
        }
    }
}

/**
 * 子弹类
 * 处理子弹的移动和状态
 */
class Bullet {
    /**
     * 构造函数
     * @param {number} x - 子弹x坐标
     * @param {number} y - 子弹y坐标
     * @param {Game} game - 游戏实例
     * @param {number} type - 子弹类型
     */
    constructor(x, y, game, type = 1) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.type = type;
        
        // 根据类型设置子弹属性
        switch (type) {
            case 1: // 普通子弹
                this.width = 5;
                this.height = 15;
                this.speed = 7;
                this.damage = 1;
                break;
            case 2: // 强化子弹
                this.width = 10;
                this.height = 20;
                this.speed = 8;
                this.damage = 2;
                break;
            case 3: // 高能子弹
                this.width = 15;
                this.height = 25;
                this.speed = 9;
                this.damage = 3;
                break;
        }
    }
    
    /**
     * 更新子弹状态
     */
    update() {
        this.y -= this.speed;
    }
    
    /**
     * 绘制子弹
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    draw(ctx) {
        switch (this.type) {
            case 1: // 普通子弹
                ctx.fillStyle = '#f39c12';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                break;
                
            case 2: // 强化子弹
                ctx.fillStyle = '#3498db';
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2, this.y);
                ctx.lineTo(this.x + this.width, this.y + this.height / 2);
                ctx.lineTo(this.x + this.width / 2, this.y + this.height);
                ctx.lineTo(this.x, this.y + this.height / 2);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 3: // 高能子弹
                // 子弹主体
                ctx.fillStyle = '#9b59b6';
                ctx.beginPath();
                ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
                ctx.fill();
                
                // 子弹光芒
                ctx.strokeStyle = '#8e44ad';
                ctx.lineWidth = 2;
                for (let i = 0; i < 4; i++) {
                    const angle = Math.PI / 2 * i;
                    ctx.beginPath();
                    ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
                    ctx.lineTo(
                        this.x + this.width / 2 + Math.cos(angle) * this.width,
                        this.y + this.height / 2 + Math.sin(angle) * this.width
                    );
                    ctx.stroke();
                }
                break;
        }
    }
}