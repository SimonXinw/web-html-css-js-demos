/**
 * 子弹类
 * 处理不同类型的子弹行为
 */
class Bullet {
    /**
     * 子弹构造函数
     * @param {Game} game - 游戏实例
     * @param {number} x - 子弹x坐标
     * @param {number} y - 子弹y坐标
     * @param {Object} options - 子弹配置选项
     */
    constructor(game, x, y, options = {}) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = options.width || 5;
        this.height = options.height || 15;
        this.speed = options.speed || 0.7;
        this.damage = options.damage || 1;
        this.color = options.color || '#00ffff';
        this.glowColor = options.glowColor || 'rgba(0, 255, 255, 0.3)';
        this.type = options.type || 'normal';
        this.angle = options.angle || 0; // 子弹飞行角度，0表示向上
        this.image = options.image || null;
    }
    
    /**
     * 更新子弹状态
     * @param {number} deltaTime - 帧间隔时间
     */
    update(deltaTime) {
        // 根据角度计算x和y方向的速度分量
        this.x += Math.sin(this.angle) * this.speed * deltaTime;
        this.y -= Math.cos(this.angle) * this.speed * deltaTime;
        
        // 特殊子弹类型的行为
        if (this.type === 'homing' && this.game.enemies.length > 0) {
            // 追踪最近的敌机
            let closestEnemy = null;
            let minDistance = Infinity;
            
            for (const enemy of this.game.enemies) {
                const dx = enemy.x + enemy.width / 2 - (this.x + this.width / 2);
                const dy = enemy.y + enemy.height / 2 - (this.y + this.height / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestEnemy = enemy;
                }
            }
            
            if (closestEnemy) {
                // 计算目标角度
                const dx = closestEnemy.x + closestEnemy.width / 2 - (this.x + this.width / 2);
                const dy = closestEnemy.y + closestEnemy.height / 2 - (this.y + this.height / 2);
                const targetAngle = Math.atan2(dx, -dy);
                
                // 逐渐调整角度朝向目标
                const angleDiff = targetAngle - this.angle;
                const turnSpeed = 0.003 * deltaTime;
                
                // 确保角度差在-PI到PI之间
                const normalizedAngleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
                this.angle += normalizedAngleDiff * turnSpeed;
            }
        } else if (this.type === 'wave') {
            // 波浪形运动
            this.x += Math.sin(this.y * 0.05) * 0.5;
        }
    }
    
    /**
     * 绘制子弹
     */
    draw() {
        const ctx = this.game.ctx;
        
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        
        if (this.image) {
            // 绘制图片子弹
            ctx.drawImage(
                this.image,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
        } else {
            // 绘制子弹光晕
            ctx.fillStyle = this.glowColor;
            ctx.beginPath();
            ctx.ellipse(
                0,
                0,
                this.width * 2,
                this.height,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // 绘制子弹主体
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }
        
        ctx.restore();
    }
    
    /**
     * 检查子弹是否超出屏幕
     * @returns {boolean} - 是否超出屏幕
     */
    isOutOfBounds() {
        return this.y < -this.height || 
               this.y > this.game.canvas.height + this.height ||
               this.x < -this.width ||
               this.x > this.game.canvas.width + this.width;
    }
}