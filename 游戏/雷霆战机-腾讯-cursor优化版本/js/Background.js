/**
 * 背景类
 * 处理游戏背景的绘制和滚动
 */
class Background {
    /**
     * 构造函数
     * @param {Game} game - 游戏实例
     */
    constructor(game) {
        this.game = game;
        this.stars = game.stars;
        this.parallaxSpeed = 0.5; // 视差滚动速度
    }
    
    /**
     * 更新背景状态
     * @param {number} deltaTime - 时间差（毫秒）
     */
    update(deltaTime) {
        // 更新星星位置，实现视差滚动效果
        this.stars.forEach(star => {
            star.y += star.speed * this.parallaxSpeed;
            if (star.y > this.game.height) {
                star.y = -5;
                star.x = Math.random() * this.game.width;
                star.size = Math.random() * 2 + 1;
                star.speed = Math.random() * 0.5 + 0.1;
            }
        });
    }
    
    /**
     * 绘制背景
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    draw(ctx) {
        // 绘制深色渐变背景
        const gradient = ctx.createLinearGradient(0, 0, 0, this.game.height);
        gradient.addColorStop(0, '#0c0c2c');
        gradient.addColorStop(1, '#1a1a3a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.game.width, this.game.height);
        
        // 绘制星星，根据大小设置不同的亮度和闪烁效果
        this.stars.forEach(star => {
            const brightness = Math.random() * 0.3 + 0.7;
            const alpha = Math.sin(Date.now() * 0.001 + star.x) * 0.2 + 0.8;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${brightness * alpha})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            
            // 为较大的星星添加光晕效果
            if (star.size > 1.5) {
                ctx.fillStyle = `rgba(255, 255, 255, ${brightness * alpha * 0.3})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
} 