/**
 * 敌机类
 * 处理不同类型敌机的行为
 */
class Enemy {
    /**
     * 敌机构造函数
     * @param {Game} game - 游戏实例
     * @param {Object} options - 敌机配置选项
     */
    constructor(game, options = {}) {
        this.game = game;
        this.type = options.type || this.getRandomType();
        
        // 根据类型设置敌机属性
        switch (this.type) {
            case 'small':
                this.width = 30;
                this.height = 30;
                this.speed = 0.2 + Math.random() * 0.1;
                this.health = 1;
                this.score = 10;
                this.dropRate = 0.1; // 10%概率掉落能量道具
                break;
                
            case 'medium':
                this.width = 50;
                this.height = 50;
                this.speed = 0.15 + Math.random() * 0.05;
                this.health = 3;
                this.score = 20;
                this.dropRate = 0.3; // 30%概率掉落能量道具
                break;
                
            case 'large':
                this.width = 70;
                this.height = 70;
                this.speed = 0.1 + Math.random() * 0.03;
                this.health = 5;
                this.score = 50;
                this.dropRate = 0.7; // 70%概率掉落能量道具
                break;
        }
        
        // 设置敌机位置
        this.x = Math.random() * (game.canvas.width - this.width);
        this.y = -this.height;
        
        // 设置敌机行为模式
        this.behaviorPattern = options.behaviorPattern || this.getRandomBehaviorPattern();
        this.behaviorTime = 0;
        
        // 设置敌机图片
        this.image = game.assets.enemy[this.type];
        
        // 设置敌机颜色（如果没有图片）
        this.color = options.color || `hsl(${Math.random() * 360}, 70%, 50%)`;
    }
    
    /**
     * 获取随机敌机类型
     * @returns {string} - 敌机类型
     */
    getRandomType() {
        const rand = Math.random();
        if (rand < 0.6) return 'small';
        if (rand < 0.9) return 'medium';
        return 'large';
    }
    
    /**
     * 获取随机行为模式
     * @returns {string} - 行为模式
     */
    getRandomBehaviorPattern() {
        const patterns = ['straight', 'zigzag', 'sine'];
        return patterns[Math.floor(Math.random() * patterns.length)];
    }
    
    /**
     * 更新敌机状态
     * @param {number} deltaTime - 帧间隔时间
     */
    update(deltaTime) {
        this.behaviorTime += deltaTime;
        
        // 基础向下移动
        this.y += this.speed * deltaTime;
        
        // 根据行为模式调整移动
        switch (this.behaviorPattern) {
            case 'zigzag':
                // 锯齿形移动
                this.x += Math.sin(this.behaviorTime * 0.005) > 0 ? 1 : -1;
                break;
                
            case 'sine':
                // 正弦波形移动
                this.x += Math.sin(this.behaviorTime * 0.003) * 0.5;
                break;
                
            // 'straight'模式不需要额外处理
        }
        
        // 确保敌机不会移出屏幕左右边界
        this.x = Math.max(0, Math.min(this.game.canvas.width - this.width, this.x));
    }
    
    /**
     * 绘制敌机
     */
    draw() {
        const ctx = this.game.ctx;
        
        if (this.image) {
            // 绘制图片敌机
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            // 如果没有图片，绘制一个默认的敌机
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.closePath();
            ctx.fill();
            
            // 绘制敌机座舱
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.ellipse(
                this.x + this.width / 2,
                this.y + this.height / 3,
                this.width / 5,
                this.height / 8,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        
        // 如果敌机受伤，绘制血条
        if (this.health < this.getMaxHealth()) {
            const healthPercent = this.health / this.getMaxHealth();
            const barWidth = this.width * 0.8;
            const barHeight = 4;
            const barX = this.x + (this.width - barWidth) / 2;
            const barY = this.y - 10;
            
            // 血条背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // 血条
            ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        }
    }
    
    /**
     * 获取敌机最大生命值
     * @returns {number} - 最大生命值
     */
    getMaxHealth() {
        switch (this.type) {
            case 'small': return 1;
            case 'medium': return 3;
            case 'large': return 5;
            default: return 1;
        }
    }
    
    /**
     * 敌机受到伤害
     * @param {number} damage - 伤害值
     * @returns {boolean} - 敌机是否被摧毁
     */
    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }
    
    /**
     * 检查敌机是否应该掉落能量道具
     * @returns {boolean} - 是否掉落道具
     */
    shouldDropPowerUp() {
        return Math.random() < this.dropRate;
    }
    
    /**
     * 检查敌机是否超出屏幕
     * @returns {boolean} - 是否超出屏幕
     */
    isOutOfBounds() {
        return this.y > this.game.canvas.height;
    }
}