/**
 * 子弹类
 */
class Bullet {
    /**
     * 子弹构造函数
     * @param {number} x - 初始x坐标
     * @param {number} y - 初始y坐标
     * @param {Game} game - 游戏实例
     * @param {string} type - 子弹类型
     */
    constructor(x, y, game, type = 'normal') {
        this.x = x;
        this.y = y;
        this.game = game;
        this.type = type;
        
        // 根据类型设置属性
        this.setupBulletType();
        
        // 动画效果
        this.animationFrame = 0;
    }
    
    /**
     * 设置子弹类型属性
     */
    setupBulletType() {
        switch (this.type) {
            case 'normal':
                this.width = 4;
                this.height = 12;
                this.speed = 12;
                this.damage = 10;
                this.color = '#ffff00';
                break;
            case 'enhanced':
                this.width = 6;
                this.height = 16;
                this.speed = 14;
                this.damage = 20;
                this.color = '#ff8800';
                break;
            case 'laser':
                this.width = 3;
                this.height = 20;
                this.speed = 18;
                this.damage = 15;
                this.color = '#00ff00';
                break;
            case 'plasma':
                this.width = 8;
                this.height = 18;
                this.speed = 16;
                this.damage = 30;
                this.color = '#ff00ff';
                break;
        }
    }
    
    /**
     * 更新子弹状态
     * @param {number} deltaTime - 帧间隔时间
     */
    update(deltaTime) {
        this.y -= this.speed;
        this.animationFrame += 0.2;
    }
    
    /**
     * 渲染子弹
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    render(ctx) {
        ctx.save();
        
        switch (this.type) {
            case 'normal':
                this.renderNormalBullet(ctx);
                break;
            case 'enhanced':
                this.renderEnhancedBullet(ctx);
                break;
            case 'laser':
                this.renderLaserBullet(ctx);
                break;
            case 'plasma':
                this.renderPlasmaBullet(ctx);
                break;
        }
        
        ctx.restore();
    }
    
    /**
     * 渲染普通子弹
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    renderNormalBullet(ctx) {
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, '#ffaa00');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 添加光晕效果
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 5;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    /**
     * 渲染强化子弹
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    renderEnhancedBullet(ctx) {
        const gradient = ctx.createRadialGradient(
            this.x + this.width / 2, this.y + this.height / 2, 0,
            this.x + this.width / 2, this.y + this.height / 2, this.width
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, '#cc4400');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加火花效果
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.fill();
    }
    
    /**
     * 渲染激光子弹
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    renderLaserBullet(ctx) {
        const alpha = 0.8 + 0.2 * Math.sin(this.animationFrame);
        ctx.globalAlpha = alpha;
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.stroke();
        
        // 内部亮线
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = this.width / 3;
        ctx.stroke();
    }
    
    /**
     * 渲染等离子子弹
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    renderPlasmaBullet(ctx) {
        const pulseSize = 1 + 0.3 * Math.sin(this.animationFrame * 2);
        
        // 外层光环
        const outerGradient = ctx.createRadialGradient(
            this.x + this.width / 2, this.y + this.height / 2, 0,
            this.x + this.width / 2, this.y + this.height / 2, this.width * pulseSize
        );
        outerGradient.addColorStop(0, 'rgba(255, 0, 255, 0.8)');
        outerGradient.addColorStop(0.7, 'rgba(255, 0, 255, 0.3)');
        outerGradient.addColorStop(1, 'rgba(255, 0, 255, 0)');
        
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width * pulseSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 内核
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 3, 0, Math.PI * 2);
        ctx.fill();
    }
}