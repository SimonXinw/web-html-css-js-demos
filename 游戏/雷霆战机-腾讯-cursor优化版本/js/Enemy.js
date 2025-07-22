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
        this.originalHealth = 0;
        
        // 根据类型设置敌机属性
        switch (type) {
            case 1: // 小型敌机
                this.width = 40;
                this.height = 40;
                this.speed = 2 + Math.random();
                this.health = 1;
                this.originalHealth = 1;
                this.score = 10;
                this.color = '#e74c3c';
                break;
            case 2: // 中型敌机
                this.width = 50;
                this.height = 50;
                this.speed = 1.5 + Math.random() * 0.5;
                this.health = 3;
                this.originalHealth = 3;
                this.score = 30;
                this.color = '#9b59b6';
                break;
            case 3: // 大型敌机（Boss）
                this.width = 80;
                this.height = 80;
                this.speed = 1 + Math.random() * 0.3;
                this.health = 10;
                this.originalHealth = 10;
                this.score = 100;
                this.color = '#2c3e50';
                break;
        }
        
        // 添加移动模式
        this.movementPattern = this.getMovementPattern();
        this.movementTimer = 0;
        this.originalX = x;
        this.originalY = y;
    }
    
    /**
     * 获取移动模式
     */
    getMovementPattern() {
        const patterns = [
            'straight',      // 直线下降
            'zigzag',        // 之字形
            'circle',        // 圆形移动
            'wave'           // 波浪形
        ];
        return patterns[Math.floor(Math.random() * patterns.length)];
    }
    
    /**
     * 更新敌机状态
     * @param {number} deltaTime - 时间差（毫秒）
     */
    update(deltaTime) {
        this.movementTimer += deltaTime;
        
        switch (this.movementPattern) {
            case 'straight':
                this.y += this.speed;
                break;
            case 'zigzag':
                this.y += this.speed;
                this.x = this.originalX + Math.sin(this.movementTimer * 0.005) * 50;
                break;
            case 'circle':
                this.y += this.speed * 0.7;
                const radius = 30;
                this.x = this.originalX + Math.cos(this.movementTimer * 0.003) * radius;
                break;
            case 'wave':
                this.y += this.speed * 0.8;
                this.x = this.originalX + Math.sin(this.movementTimer * 0.008) * 40;
                break;
        }
    }
    
    /**
     * 绘制敌机
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    draw(ctx) {
        // 受伤闪烁效果
        if (this.health < this.originalHealth && Math.floor(Date.now() / 50) % 2) {
            ctx.globalAlpha = 0.5;
        }
        
        switch (this.type) {
            case 1: // 小型敌机
                this.drawSmallEnemy(ctx);
                break;
            case 2: // 中型敌机
                this.drawMediumEnemy(ctx);
                break;
            case 3: // 大型敌机（Boss）
                this.drawLargeEnemy(ctx);
                break;
        }
        
        ctx.globalAlpha = 1.0;
        
        // 绘制生命值条（仅对中型和大型敌机）
        if (this.type > 1) {
            this.drawHealthBar(ctx);
        }
    }
    
    /**
     * 绘制小型敌机
     */
    drawSmallEnemy(ctx) {
        // 敌机主体
        ctx.fillStyle = this.color;
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
        
        // 敌机武器
        ctx.fillStyle = '#c0392b';
        ctx.beginPath();
        ctx.rect(this.x + this.width * 0.3, this.y + this.height * 0.6, this.width * 0.4, this.height * 0.1);
        ctx.fill();
    }
    
    /**
     * 绘制中型敌机
     */
    drawMediumEnemy(ctx) {
        // 敌机主体
        ctx.fillStyle = this.color;
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
        
        // 敌机引擎
        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath();
        ctx.rect(this.x + this.width * 0.35, this.y + this.height * 0.8, this.width * 0.3, this.height * 0.15);
        ctx.fill();
    }
    
    /**
     * 绘制大型敌机
     */
    drawLargeEnemy(ctx) {
        // 敌机主体
        ctx.fillStyle = this.color;
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
        
        // 敌机引擎
        ctx.fillStyle = '#34495e';
        ctx.beginPath();
        ctx.rect(this.x + this.width * 0.2, this.y + this.height * 0.85, this.width * 0.6, this.height * 0.1);
        ctx.fill();
    }
    
    /**
     * 绘制生命值条
     */
    drawHealthBar(ctx) {
        const maxHealth = this.originalHealth;
        const healthPercent = this.health / maxHealth;
        
        // 背景
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(this.x, this.y - 10, this.width, 5);
        
        // 生命值
        let healthColor;
        if (healthPercent > 0.6) {
            healthColor = '#2ecc71';
        } else if (healthPercent > 0.3) {
            healthColor = '#f39c12';
        } else {
            healthColor = '#e74c3c';
        }
        
        ctx.fillStyle = healthColor;
        ctx.fillRect(this.x, this.y - 10, this.width * healthPercent, 5);
        
        // 边框
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y - 10, this.width, 5);
    }
    
    /**
     * 受到伤害
     */
    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }
} 