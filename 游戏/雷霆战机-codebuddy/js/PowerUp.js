/**
 * 道具类
 */
class PowerUp {
    /**
     * 道具构造函数
     * @param {number} x - 初始x坐标
     * @param {number} y - 初始y坐标
     * @param {Game} game - 游戏实例
     */
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.width = 30;
        this.height = 30;
        this.speed = 2;
        
        // 随机选择道具类型
        const types = ['health', 'shield', 'weapon', 'speed', 'multishot'];
        this.type = types[Math.floor(Math.random() * types.length)];
        
        // 根据类型设置属性
        this.setupPowerUpType();
        
        // 动画效果
        this.animationFrame = 0;
        this.pulseScale = 1;
    }
    
    /**
     * 设置道具类型属性
     */
    setupPowerUpType() {
        switch (this.type) {
            case 'health':
                this.color = '#00ff00';
                this.symbol = '+';
                this.description = '生命恢复';
                break;
            case 'shield':
                this.color = '#00ffff';
                this.symbol = '◊';
                this.description = '护盾强化';
                break;
            case 'weapon':
                this.color = '#ffff00';
                this.symbol = '↑';
                this.description = '武器升级';
                break;
            case 'speed':
                this.color = '#ff8800';
                this.symbol = '»';
                this.description = '速度提升';
                break;
            case 'multishot':
                this.color = '#ff00ff';
                this.symbol = '※';
                this.description = '多重射击';
                break;
        }
    }
    
    /**
     * 更新道具状态
     * @param {number} deltaTime - 帧间隔时间
     */
    update(deltaTime) {
        this.y += this.speed;
        this.animationFrame += 0.1;
        this.pulseScale = 1 + 0.2 * Math.sin(this.animationFrame * 3);
    }
    
    /**
     * 渲染道具
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    render(ctx) {
        ctx.save();
        
        // 绘制光环效果
        this.renderAura(ctx);
        
        // 绘制道具主体
        this.renderPowerUp(ctx);
        
        ctx.restore();
    }
    
    /**
     * 渲染光环效果
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    renderAura(ctx) {
        const auraRadius = this.width * this.pulseScale;
        const gradient = ctx.createRadialGradient(
            this.x + this.width / 2, this.y + this.height / 2, 0,
            this.x + this.width / 2, this.y + this.height / 2, auraRadius
        );
        gradient.addColorStop(0, `${this.color}80`);
        gradient.addColorStop(0.7, `${this.color}40`);
        gradient.addColorStop(1, `${this.color}00`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, auraRadius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * 渲染道具主体
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    renderPowerUp(ctx) {
        // 绘制道具背景
        const gradient = ctx.createRadialGradient(
            this.x + this.width / 2, this.y + this.height / 2, 0,
            this.x + this.width / 2, this.y + this.height / 2, this.width / 2
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, this.color);
        gradient.addColorStop(1, '#333333');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制边框
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制符号
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            this.symbol,
            this.x + this.width / 2,
            this.y + this.height / 2
        );
    }
    
    /**
     * 应用道具效果
     * @param {Player} player - 玩家对象
     */
    applyEffect(player) {
        switch (this.type) {
            case 'health':
                player.health = Math.min(player.maxHealth, player.health + 30);
                this.showEffectText('生命 +30', '#00ff00');
                break;
            case 'shield':
                player.shield = Math.min(player.maxShield, player.shield + 25);
                this.showEffectText('护盾 +25', '#00ffff');
                break;
            case 'weapon':
                if (player.weaponLevel < player.maxWeaponLevel) {
                    player.weaponLevel++;
                    this.showEffectText('武器升级!', '#ffff00');
                    this.game.showUpgradeEffect();
                } else {
                    // 武器已满级，给予分数奖励
                    this.game.score += 50;
                    this.showEffectText('分数 +50', '#ffff00');
                }
                break;
            case 'speed':
                player.speed = Math.min(8, player.speed + 1);
                this.showEffectText('速度提升!', '#ff8800');
                break;
            case 'multishot':
                // 临时多重射击效果
                player.shootCooldown = Math.max(50, player.shootCooldown - 20);
                this.showEffectText('射速提升!', '#ff00ff');
                break;
        }
    }
    
    /**
     * 显示效果文字
     * @param {string} text - 显示的文字
     * @param {string} color - 文字颜色
     */
    showEffectText(text, color) {
        const effectText = new EffectText(
            this.x + this.width / 2,
            this.y,
            text,
            color
        );
        this.game.effectTexts = this.game.effectTexts || [];
        this.game.effectTexts.push(effectText);
    }
}

/**
 * 效果文字类
 */
class EffectText {
    /**
     * 效果文字构造函数
     * @param {number} x - x坐标
     * @param {number} y - y坐标
     * @param {string} text - 显示文字
     * @param {string} color - 文字颜色
     */
    constructor(x, y, text, color) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.opacity = 1;
        this.speed = 2;
        this.duration = 0;
        this.maxDuration = 1500;
        this.isFinished = false;
    }
    
    /**
     * 更新效果文字
     * @param {number} deltaTime - 帧间隔时间
     */
    update(deltaTime) {
        this.y -= this.speed;
        this.duration += deltaTime;
        this.opacity = 1 - (this.duration / this.maxDuration);
        
        if (this.duration >= this.maxDuration) {
            this.isFinished = true;
        }
    }
    
    /**
     * 渲染效果文字
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeText(this.text, this.x, this.y);
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}