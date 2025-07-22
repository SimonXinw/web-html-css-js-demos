/**
 * 道具类
 * 处理道具的移动和效果
 */
class PowerUp {
    /**
     * 构造函数
     * @param {number} x - 道具x坐标
     * @param {number} y - 道具y坐标
     * @param {Game} game - 游戏实例
     * @param {string} type - 道具类型
     */
    constructor(x, y, game, type) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.type = type; // 'shield', 'weapon', 'life', 'bomb'
        this.width = 30;
        this.height = 30;
        this.speed = 2;
        this.rotation = 0;
        this.rotationSpeed = 0.02;
        this.pulseTimer = 0;
        this.pulseSpeed = 0.005;
    }
    
    /**
     * 更新道具状态
     */
    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        this.pulseTimer += this.pulseSpeed;
    }
    
    /**
     * 绘制道具
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        
        // 脉冲效果
        const pulse = Math.sin(this.pulseTimer) * 0.2 + 1;
        ctx.scale(pulse, pulse);
        
        switch (this.type) {
            case 'shield':
                this.drawShieldPowerUp(ctx);
                break;
            case 'weapon':
                this.drawWeaponPowerUp(ctx);
                break;
            case 'life':
                this.drawLifePowerUp(ctx);
                break;
            case 'bomb':
                this.drawBombPowerUp(ctx);
                break;
        }
        
        ctx.restore();
        
        // 绘制光晕效果
        this.drawGlow(ctx);
    }
    
    /**
     * 绘制护盾道具
     */
    drawShieldPowerUp(ctx) {
        // 道具主体
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 道具图标
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 6, 0, Math.PI * 2);
        ctx.fill();
        
        // 护盾标志
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 4, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    /**
     * 绘制武器道具
     */
    drawWeaponPowerUp(ctx) {
        // 道具主体
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 道具图标
        ctx.fillStyle = '#fff';
        ctx.fillRect(-this.width / 6, -this.height / 3, this.width / 3, this.height * 2/3);
        ctx.fillRect(-this.width / 3, -this.height / 6, this.width * 2/3, this.height / 3);
        
        // 武器标志
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-this.width / 4, -this.height / 4);
        ctx.lineTo(this.width / 4, this.height / 4);
        ctx.moveTo(-this.width / 4, this.height / 4);
        ctx.lineTo(this.width / 4, -this.height / 4);
        ctx.stroke();
    }
    
    /**
     * 绘制生命道具
     */
    drawLifePowerUp(ctx) {
        // 道具主体
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 心形图标
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(0, this.height / 6);
        ctx.bezierCurveTo(
            -this.width / 4, -this.height / 6,
            -this.width / 4, -this.height / 3,
            0, -this.height / 6
        );
        ctx.bezierCurveTo(
            this.width / 4, -this.height / 3,
            this.width / 4, -this.height / 6,
            0, this.height / 6
        );
        ctx.fill();
    }
    
    /**
     * 绘制炸弹道具
     */
    drawBombPowerUp(ctx) {
        // 道具主体
        ctx.fillStyle = '#9b59b6';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 炸弹图标
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 炸弹引线
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 4);
        ctx.lineTo(0, -this.height / 2);
        ctx.lineTo(this.width / 6, -this.height / 2);
        ctx.stroke();
    }
    
    /**
     * 绘制光晕效果
     */
    drawGlow(ctx) {
        const glowRadius = this.width / 2 + 10;
        const gradient = ctx.createRadialGradient(
            this.x + this.width / 2, this.y + this.height / 2, 0,
            this.x + this.width / 2, this.y + this.height / 2, glowRadius
        );
        
        let glowColor;
        switch (this.type) {
            case 'shield':
                glowColor = '#3498db';
                break;
            case 'weapon':
                glowColor = '#e74c3c';
                break;
            case 'life':
                glowColor = '#2ecc71';
                break;
            case 'bomb':
                glowColor = '#9b59b6';
                break;
        }
        
        gradient.addColorStop(0, `${glowColor}40`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, glowRadius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * 激活道具效果
     */
    activate() {
        switch (this.type) {
            case 'shield':
                this.game.player.activateShield();
                break;
            case 'weapon':
                this.game.player.upgradeWeapon();
                break;
            case 'life':
                this.game.lives = Math.min(5, this.game.lives + 1);
                this.game.ui.updateLives(this.game.lives);
                break;
            case 'bomb':
                this.activateBomb();
                break;
        }
    }
    
    /**
     * 激活炸弹效果
     */
    activateBomb() {
        // 清除屏幕上所有敌机
        this.game.enemies.forEach(enemy => {
            this.game.explosions.push(new Explosion(
                enemy.x + enemy.width / 2,
                enemy.y + enemy.height / 2,
                this.game,
                1.5
            ));
            this.game.score += enemy.score;
        });
        this.game.enemies = [];
        this.game.ui.updateScore(this.game.score);
    }
} 