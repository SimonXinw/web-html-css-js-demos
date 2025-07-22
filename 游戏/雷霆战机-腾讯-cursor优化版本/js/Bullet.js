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
        this.trail = []; // 子弹轨迹
        this.maxTrailLength = 5;
        
        // 根据类型设置子弹属性
        switch (type) {
            case 1: // 普通子弹
                this.width = 5;
                this.height = 15;
                this.speed = 7;
                this.damage = 1;
                this.color = '#f39c12';
                this.trailColor = '#e67e22';
                break;
            case 2: // 强化子弹
                this.width = 10;
                this.height = 20;
                this.speed = 8;
                this.damage = 2;
                this.color = '#3498db';
                this.trailColor = '#2980b9';
                break;
            case 3: // 高能子弹
                this.width = 15;
                this.height = 25;
                this.speed = 9;
                this.damage = 3;
                this.color = '#9b59b6';
                this.trailColor = '#8e44ad';
                break;
        }
    }
    
    /**
     * 更新子弹状态
     */
    update() {
        // 更新轨迹
        this.trail.push({ x: this.x + this.width / 2, y: this.y + this.height });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
        
        this.y -= this.speed;
    }
    
    /**
     * 绘制子弹
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    draw(ctx) {
        // 绘制子弹轨迹
        this.drawTrail(ctx);
        
        // 绘制子弹主体
        switch (this.type) {
            case 1:
                this.drawBasicBullet(ctx);
                break;
            case 2:
                this.drawEnhancedBullet(ctx);
                break;
            case 3:
                this.drawEnergyBullet(ctx);
                break;
        }
    }
    
    /**
     * 绘制子弹轨迹
     */
    drawTrail(ctx) {
        this.trail.forEach((point, index) => {
            const alpha = (index + 1) / this.trail.length;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2 * alpha, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    /**
     * 绘制基础子弹
     */
    drawBasicBullet(ctx) {
        // 子弹主体
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 子弹头部
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height * 0.3);
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.3);
        ctx.closePath();
        ctx.fill();
        
        // 子弹光芒
        ctx.strokeStyle = this.trailColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.stroke();
    }
    
    /**
     * 绘制强化子弹
     */
    drawEnhancedBullet(ctx) {
        // 子弹主体
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height / 2);
        ctx.closePath();
        ctx.fill();
        
        // 子弹中心
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 子弹光芒
        ctx.strokeStyle = this.trailColor;
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
    }
    
    /**
     * 绘制高能子弹
     */
    drawEnergyBullet(ctx) {
        // 子弹主体
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 子弹中心
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 子弹光芒
        ctx.strokeStyle = this.trailColor;
        ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
            const angle = Math.PI / 4 * i;
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
            ctx.lineTo(
                this.x + this.width / 2 + Math.cos(angle) * this.width * 1.5,
                this.y + this.height / 2 + Math.sin(angle) * this.width * 1.5
            );
            ctx.stroke();
        }
        
        // 能量波动效果
        const time = Date.now() * 0.01;
        const pulseRadius = this.width / 2 + Math.sin(time) * 3;
        ctx.strokeStyle = `rgba(155, 89, 182, ${0.5 + Math.sin(time * 2) * 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();
    }
} 