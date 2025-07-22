/**
 * 打飞机小游戏 - 面向对象实现（优化版）
 * 
 * 本游戏使用面向对象编程方式实现，主要包含以下类：
 * - Game: 游戏主类，负责初始化和管理游戏流程
 * - Player: 玩家飞机类（优化版）
 * - Enemy: 敌机类（优化版）
 * - Bullet: 子弹类（支持多种类型）
 * - Explosion: 爆炸效果类
 * - InputHandler: 输入处理类
 * - UI: 用户界面类
 */

// 等待DOM加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    // 创建游戏实例并初始化
    const game = new Game();
    game.init();
});

/**
 * 游戏主类
 * 负责初始化游戏、更新游戏状态和渲染游戏画面
 */
class Game {
    /**
     * 构造函数
     * 初始化游戏属性和对象
     */
    constructor() {
        // 游戏状态
        this.gameState = 'start'; // 'start', 'playing', 'gameOver'
        
        // 游戏画布和上下文
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏尺寸
        this.width = 480;
        this.height = 640;
        
        // 游戏对象
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.explosions = [];
        
        // 游戏数据
        this.score = 0;
        this.lives = 3;
        this.bulletType = 'normal'; // 子弹类型：'normal', 'spread', 'laser'
        this.powerLevel = 1; // 火力等级
        
        // 游戏计时器
        this.lastTime = 0;
        this.enemyTimer = 0;
        this.enemyInterval = 1000; // 敌机生成间隔（毫秒）
        
        // 输入处理器
        this.inputHandler = new InputHandler();
        
        // 用户界面
        this.ui = new UI(this);
        
        // 绑定方法到实例
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
    }
    
    /**
     * 初始化游戏
     * 设置画布尺寸、事件监听和初始状态
     */
    init() {
        // 设置画布尺寸
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // 初始化玩家飞机
        this.player = new Player(this);
        
        // 设置按钮事件监听
        document.getElementById('startButton').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('restartButton').addEventListener('click', () => {
            this.restartGame();
        });
        
        // 初始渲染
        this.render();
    }
    
    /**
     * 开始游戏
     * 从开始界面切换到游戏界面
     */
    startGame() {
        this.gameState = 'playing';
        document.getElementById('startScreen').classList.add('hidden');
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop);
    }
    
    /**
     * 重新开始游戏
     * 重置游戏状态并开始新游戏
     */
    restartGame() {
        // 重置游戏数据
        this.score = 0;
        this.lives = 3;
        this.bulletType = 'normal';
        this.powerLevel = 1;
        this.enemies = [];
        this.bullets = [];
        this.explosions = [];
        
        // 重置玩家位置
        this.player.reset();
        
        // 更新UI
        this.ui.updateScore(this.score);
        this.ui.updateLives(this.lives);
        this.ui.updatePowerLevel(this.powerLevel);
        this.ui.updateBulletType(this.bulletType);
        
        // 隐藏游戏结束界面
        document.getElementById('gameOverScreen').classList.add('hidden');
        
        // 开始新游戏
        this.gameState = 'playing';
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop);
    }
    
    /**
     * 游戏结束
     * 显示游戏结束界面
     */
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }
    
    /**
     * 游戏主循环
     * 处理游戏的更新和渲染
     * @param {number} timestamp - 当前时间戳
     */
    gameLoop(timestamp) {
        // 计算时间差
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // 清空画布
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // 更新游戏状态
        this.update(deltaTime);
        
        // 渲染游戏画面
        this.render();
        
        // 如果游戏仍在进行中，继续循环
        if (this.gameState === 'playing') {
            requestAnimationFrame(this.gameLoop);
        }
    }
    
    /**
     * 更新游戏状态
     * @param {number} deltaTime - 时间差（毫秒）
     */
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        // 更新玩家
        this.player.update(deltaTime, this.inputHandler.keys);
        
        // 生成敌机
        this.enemyTimer += deltaTime;
        if (this.enemyTimer > this.enemyInterval) {
            this.addEnemy();
            this.enemyTimer = 0;
            // 随着分数增加，敌机生成间隔减少（游戏难度增加）
            this.enemyInterval = Math.max(200, 1000 - this.score / 10);
        }
        
        // 更新敌机
        this.enemies.forEach((enemy, index) => {
            enemy.update(deltaTime);
            
            // 检测敌机是否飞出屏幕底部
            if (enemy.y > this.height) {
                this.enemies.splice(index, 1);
            }
            
            // 检测敌机与玩家碰撞
            if (this.checkCollision(enemy, this.player)) {
                this.enemies.splice(index, 1);
                this.explosions.push(new Explosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, this));
                this.lives--;
                this.ui.updateLives(this.lives);
                
                if (this.lives <= 0) {
                    this.gameOver();
                    return;
                }
            }
        });
        
        // 更新子弹
        this.bullets.forEach((bullet, bulletIndex) => {
            bullet.update();
            
            // 检测子弹是否飞出屏幕顶部
            if (bullet.y < -bullet.height) {
                this.bullets.splice(bulletIndex, 1);
                return;
            }
            
            // 检测子弹与敌机碰撞
            this.enemies.forEach((enemy, enemyIndex) => {
                if (this.checkCollision(bullet, enemy)) {
                    // 移除子弹和敌机
                    this.bullets.splice(bulletIndex, 1);
                    this.enemies.splice(enemyIndex, 1);
                    
                    // 添加爆炸效果
                    this.explosions.push(new Explosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, this));
                    
                    // 增加分数
                    this.score += 10;
                    this.ui.updateScore(this.score);
                    
                    // 每100分增加火力等级
                    if (this.score % 100 === 0 && this.powerLevel < 3) {
                        this.powerLevel++;
                        this.bulletType = this.getBulletTypeByPower();
                        this.ui.updatePowerLevel(this.powerLevel);
                        this.ui.updateBulletType(this.bulletType);
                    }
                }
            });
        });
        
        // 更新爆炸效果
        this.explosions.forEach((explosion, index) => {
            explosion.update(deltaTime);
            if (explosion.frame >= explosion.maxFrame) {
                this.explosions.splice(index, 1);
            }
        });
    }
    
    /**
     * 渲染游戏画面
     */
    render() {
        // 绘制背景
        this.drawBackground();
        
        // 绘制玩家
        this.player.draw(this.ctx);
        
        // 绘制敌机
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        
        // 绘制子弹
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        
        // 绘制爆炸效果
        this.explosions.forEach(explosion => explosion.draw(this.ctx));
    }
    
    /**
     * 绘制背景
     */
    drawBackground() {
        // 创建渐变背景
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#0a0a2a');
        gradient.addColorStop(0.5, '#1a1a4a');
        gradient.addColorStop(1, '#0a0a2a');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 绘制星星背景
        this.drawStars();
    }
    
    /**
     * 绘制星星背景
     */
    drawStars() {
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) {
            const x = (i * 37) % this.width;
            const y = (i * 73) % this.height;
            const size = (i % 3) + 1;
            this.ctx.fillRect(x, y, size, size);
        }
    }
    
    /**
     * 添加敌机
     */
    addEnemy() {
        const x = Math.random() * (this.width - 40);
        const y = -40;
        this.enemies.push(new Enemy(x, y, this));
    }
    
    /**
     * 添加子弹
     * @param {number} x - 子弹x坐标
     * @param {number} y - 子弹y坐标
     * @param {string} type - 子弹类型
     */
    addBullet(x, y, type = 'normal') {
        switch (type) {
            case 'spread':
                // 散射子弹
                for (let i = -1; i <= 1; i++) {
                    this.bullets.push(new Bullet(x + i * 10, y, this, 'spread', i * 0.3));
                }
                break;
            case 'laser':
                // 激光子弹
                this.bullets.push(new Bullet(x, y, this, 'laser'));
                break;
            default:
                // 普通子弹
                this.bullets.push(new Bullet(x, y, this, 'normal'));
                break;
        }
    }
    
    /**
     * 根据火力等级获取子弹类型
     * @returns {string} 子弹类型
     */
    getBulletTypeByPower() {
        switch (this.powerLevel) {
            case 1: return 'normal';
            case 2: return 'spread';
            case 3: return 'laser';
            default: return 'normal';
        }
    }
    
    /**
     * 检测碰撞
     * @param {Object} obj1 - 对象1
     * @param {Object} obj2 - 对象2
     * @returns {boolean} 是否碰撞
     */
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
}

/**
 * 玩家飞机类（优化版）
 * 处理玩家飞机的移动、绘制和射击
 */
class Player {
    /**
     * 构造函数
     * @param {Game} game - 游戏实例
     */
    constructor(game) {
        this.game = game;
        this.width = 60;
        this.height = 60;
        this.x = game.width / 2 - this.width / 2;
        this.y = game.height - this.height - 20;
        this.speed = 6;
        this.shootTimer = 0;
        this.shootInterval = 250; // 射击间隔（毫秒）
        this.engineTimer = 0; // 引擎动画计时器
    }
    
    /**
     * 更新玩家状态
     * @param {number} deltaTime - 时间差（毫秒）
     * @param {Array} keys - 按下的按键
     */
    update(deltaTime, keys) {
        // 水平移动
        if ((keys.includes('ArrowLeft') || keys.includes('a') || keys.includes('A')) && this.x > 0) {
            this.x -= this.speed;
        }
        if ((keys.includes('ArrowRight') || keys.includes('d') || keys.includes('D')) && this.x < this.game.width - this.width) {
            this.x += this.speed;
        }
        
        // 垂直移动
        if ((keys.includes('ArrowUp') || keys.includes('w') || keys.includes('W')) && this.y > 0) {
            this.y -= this.speed;
        }
        if ((keys.includes('ArrowDown') || keys.includes('s') || keys.includes('S')) && this.y < this.game.height - this.height) {
            this.y += this.speed;
        }
        
        // 射击
        this.shootTimer += deltaTime;
        if ((keys.includes(' ') || keys.includes('j') || keys.includes('J')) && this.shootTimer > this.shootInterval) {
            this.shoot();
            this.shootTimer = 0;
        }
        
        // 更新引擎动画
        this.engineTimer += deltaTime;
    }
    
    /**
     * 绘制玩家飞机（优化版）
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    draw(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        // 绘制引擎火焰
        this.drawEngineFlame(ctx, centerX, this.y + this.height);
        
        // 绘制飞机主体
        this.drawPlaneBody(ctx, centerX, centerY);
        
        // 绘制飞机细节
        this.drawPlaneDetails(ctx, centerX, centerY);
    }
    
    /**
     * 绘制飞机主体
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     * @param {number} centerX - 中心x坐标
     * @param {number} centerY - 中心y坐标
     */
    drawPlaneBody(ctx, centerX, centerY) {
        // 创建渐变
        const gradient = ctx.createLinearGradient(centerX - 30, centerY - 30, centerX + 30, centerY + 30);
        gradient.addColorStop(0, '#4cd137');
        gradient.addColorStop(0.5, '#44bd32');
        gradient.addColorStop(1, '#2ecc71');
        
        ctx.fillStyle = gradient;
        
        // 绘制飞机主体（更复杂的形状）
        ctx.beginPath();
        ctx.moveTo(centerX, this.y);
        ctx.lineTo(centerX + 25, this.y + 15);
        ctx.lineTo(centerX + 20, this.y + 25);
        ctx.lineTo(centerX + 15, this.y + 35);
        ctx.lineTo(centerX + 10, this.y + 45);
        ctx.lineTo(centerX - 10, this.y + 45);
        ctx.lineTo(centerX - 15, this.y + 35);
        ctx.lineTo(centerX - 20, this.y + 25);
        ctx.lineTo(centerX - 25, this.y + 15);
        ctx.closePath();
        ctx.fill();
        
        // 绘制机翼
        ctx.beginPath();
        ctx.moveTo(centerX - 30, this.y + 20);
        ctx.lineTo(centerX - 35, this.y + 30);
        ctx.lineTo(centerX - 25, this.y + 35);
        ctx.lineTo(centerX - 20, this.y + 25);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(centerX + 30, this.y + 20);
        ctx.lineTo(centerX + 35, this.y + 30);
        ctx.lineTo(centerX + 25, this.y + 35);
        ctx.lineTo(centerX + 20, this.y + 25);
        ctx.closePath();
        ctx.fill();
    }
    
    /**
     * 绘制飞机细节
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     * @param {number} centerX - 中心x坐标
     * @param {number} centerY - 中心y坐标
     */
    drawPlaneDetails(ctx, centerX, centerY) {
        // 绘制驾驶舱
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制驾驶舱边框
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制武器系统
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(centerX - 2, this.y + 5, 4, 8);
        
        // 绘制装饰线条
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 15, this.y + 15);
        ctx.lineTo(centerX + 15, this.y + 15);
        ctx.stroke();
    }
    
    /**
     * 绘制引擎火焰
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     * @param {number} centerX - 中心x坐标
     * @param {number} bottomY - 底部y坐标
     */
    drawEngineFlame(ctx, centerX, bottomY) {
        const flameSize = 15 + Math.sin(this.engineTimer * 0.01) * 5;
        
        // 创建火焰渐变
        const flameGradient = ctx.createRadialGradient(centerX, bottomY, 0, centerX, bottomY, flameSize);
        flameGradient.addColorStop(0, '#ff6b35');
        flameGradient.addColorStop(0.5, '#f39c12');
        flameGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = flameGradient;
        ctx.beginPath();
        ctx.arc(centerX, bottomY, flameSize, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * 射击
     * 在飞机前方创建子弹
     */
    shoot() {
        const bulletX = this.x + this.width / 2 - 2.5;
        const bulletY = this.y;
        this.game.addBullet(bulletX, bulletY, this.game.bulletType);
    }
    
    /**
     * 重置玩家位置
     */
    reset() {
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.height - 20;
    }
}

/**
 * 敌机类（优化版）
 * 处理敌机的移动和绘制
 */
class Enemy {
    /**
     * 构造函数
     * @param {number} x - 敌机x坐标
     * @param {number} y - 敌机y坐标
     * @param {Game} game - 游戏实例
     */
    constructor(x, y, game) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = Math.random() * 2 + 1.5; // 随机速度
        this.type = Math.random() < 0.3 ? 'boss' : 'normal'; // 30%概率生成Boss敌机
        this.health = this.type === 'boss' ? 3 : 1;
        this.maxHealth = this.health;
        this.rotation = 0;
    }
    
    /**
     * 更新敌机状态
     * @param {number} deltaTime - 时间差（毫秒）
     */
    update(deltaTime) {
        // 向下移动
        this.y += this.speed;
        
        // 旋转动画
        this.rotation += 0.02;
    }
    
    /**
     * 绘制敌机（优化版）
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    draw(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);
        
        if (this.type === 'boss') {
            this.drawBossEnemy(ctx);
        } else {
            this.drawNormalEnemy(ctx);
        }
        
        ctx.restore();
        
        // 绘制血条（仅Boss敌机）
        if (this.type === 'boss') {
            this.drawHealthBar(ctx);
        }
    }
    
    /**
     * 绘制普通敌机
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    drawNormalEnemy(ctx) {
        // 创建渐变
        const gradient = ctx.createLinearGradient(-25, -25, 25, 25);
        gradient.addColorStop(0, '#e74c3c');
        gradient.addColorStop(0.5, '#c0392b');
        gradient.addColorStop(1, '#a93226');
        
        ctx.fillStyle = gradient;
        
        // 绘制敌机主体
        ctx.beginPath();
        ctx.moveTo(0, 25);
        ctx.lineTo(20, -15);
        ctx.lineTo(10, -25);
        ctx.lineTo(-10, -25);
        ctx.lineTo(-20, -15);
        ctx.closePath();
        ctx.fill();
        
        // 绘制驾驶舱
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制武器
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(-2, -15, 4, 10);
    }
    
    /**
     * 绘制Boss敌机
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    drawBossEnemy(ctx) {
        // 创建渐变
        const gradient = ctx.createLinearGradient(-30, -30, 30, 30);
        gradient.addColorStop(0, '#8e44ad');
        gradient.addColorStop(0.5, '#6c5ce7');
        gradient.addColorStop(1, '#5f27cd');
        
        ctx.fillStyle = gradient;
        
        // 绘制Boss主体
        ctx.beginPath();
        ctx.moveTo(0, 30);
        ctx.lineTo(25, -20);
        ctx.lineTo(15, -30);
        ctx.lineTo(-15, -30);
        ctx.lineTo(-25, -20);
        ctx.closePath();
        ctx.fill();
        
        // 绘制装甲板
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(-20, -10, 40, 5);
        ctx.fillRect(-15, 5, 30, 3);
        
        // 绘制驾驶舱
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制武器系统
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(-3, -25, 6, 15);
        ctx.fillRect(-15, -5, 8, 3);
        ctx.fillRect(7, -5, 8, 3);
    }
    
    /**
     * 绘制血条
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    drawHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 4;
        const barX = this.x;
        const barY = this.y - 10;
        
        // 背景
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // 血条
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#27ae60' : healthPercent > 0.25 ? '#f39c12' : '#e74c3c';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    }
    
    /**
     * 受到伤害
     * @returns {boolean} 是否被摧毁
     */
    takeDamage() {
        this.health--;
        return this.health <= 0;
    }
}

/**
 * 子弹类（支持多种类型）
 * 处理子弹的移动和绘制
 */
class Bullet {
    /**
     * 构造函数
     * @param {number} x - 子弹x坐标
     * @param {number} y - 子弹y坐标
     * @param {Game} game - 游戏实例
     * @param {string} type - 子弹类型
     * @param {number} angle - 子弹角度（用于散射）
     */
    constructor(x, y, game, type = 'normal', angle = 0) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.type = type;
        this.angle = angle;
        this.speed = this.getSpeedByType();
        this.width = this.getWidthByType();
        this.height = this.getHeightByType();
        this.color = this.getColorByType();
        this.trail = []; // 子弹轨迹
    }
    
    /**
     * 根据类型获取速度
     * @returns {number} 速度
     */
    getSpeedByType() {
        switch (this.type) {
            case 'laser': return 10;
            case 'spread': return 8;
            default: return 7;
        }
    }
    
    /**
     * 根据类型获取宽度
     * @returns {number} 宽度
     */
    getWidthByType() {
        switch (this.type) {
            case 'laser': return 3;
            case 'spread': return 4;
            default: return 5;
        }
    }
    
    /**
     * 根据类型获取高度
     * @returns {number} 高度
     */
    getHeightByType() {
        switch (this.type) {
            case 'laser': return 25;
            case 'spread': return 12;
            default: return 15;
        }
    }
    
    /**
     * 根据类型获取颜色
     * @returns {string} 颜色
     */
    getColorByType() {
        switch (this.type) {
            case 'laser': return '#00ff00';
            case 'spread': return '#ff6b35';
            default: return '#f39c12';
        }
    }
    
    /**
     * 更新子弹状态
     */
    update() {
        // 更新轨迹
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 5) {
            this.trail.shift();
        }
        
        // 根据类型移动
        switch (this.type) {
            case 'spread':
                this.x += Math.sin(this.angle) * this.speed;
                this.y -= Math.cos(this.angle) * this.speed;
                break;
            default:
                this.y -= this.speed;
                break;
        }
    }
    
    /**
     * 绘制子弹（优化版）
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    draw(ctx) {
        switch (this.type) {
            case 'laser':
                this.drawLaser(ctx);
                break;
            case 'spread':
                this.drawSpread(ctx);
                break;
            default:
                this.drawNormal(ctx);
                break;
        }
    }
    
    /**
     * 绘制普通子弹
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    drawNormal(ctx) {
        // 绘制轨迹
        this.trail.forEach((pos, index) => {
            const alpha = (index + 1) / this.trail.length;
            ctx.fillStyle = `rgba(243, 156, 18, ${alpha * 0.5})`;
            ctx.fillRect(pos.x, pos.y, this.width, this.height);
        });
        
        // 绘制子弹主体
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 绘制发光效果
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 5;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }
    
    /**
     * 绘制散射子弹
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    drawSpread(ctx) {
        // 绘制轨迹
        this.trail.forEach((pos, index) => {
            const alpha = (index + 1) / this.trail.length;
            ctx.fillStyle = `rgba(255, 107, 53, ${alpha * 0.5})`;
            ctx.fillRect(pos.x, pos.y, this.width, this.height);
        });
        
        // 绘制子弹主体
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 绘制发光效果
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }
    
    /**
     * 绘制激光子弹
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    drawLaser(ctx) {
        // 创建激光渐变
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#00ff00');
        gradient.addColorStop(0.5, '#00cc00');
        gradient.addColorStop(1, '#009900');
        
        ctx.fillStyle = gradient;
        
        // 绘制激光主体
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 绘制激光光晕
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 15;
        ctx.fillRect(this.x - 2, this.y, this.width + 4, this.height);
        ctx.shadowBlur = 0;
        
        // 绘制激光核心
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 1, this.y, 1, this.height);
    }
}

/**
 * 爆炸效果类（优化版）
 * 处理爆炸动画效果
 */
class Explosion {
    /**
     * 构造函数
     * @param {number} x - 爆炸中心x坐标
     * @param {number} y - 爆炸中心y坐标
     * @param {Game} game - 游戏实例
     */
    constructor(x, y, game) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.maxFrame = 8; // 爆炸动画帧数
        this.timer = 0;
        this.interval = 40; // 帧间隔（毫秒）
        this.radius = 40; // 爆炸半径
        this.particles = []; // 爆炸粒子
        
        // 初始化粒子
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                decay: Math.random() * 0.02 + 0.01
            });
        }
    }
    
    /**
     * 更新爆炸状态
     * @param {number} deltaTime - 时间差（毫秒）
     */
    update(deltaTime) {
        this.timer += deltaTime;
        if (this.timer > this.interval) {
            this.frame++;
            this.timer = 0;
        }
        
        // 更新粒子
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
        });
    }
    
    /**
     * 绘制爆炸效果（优化版）
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    draw(ctx) {
        // 绘制爆炸圆圈
        const size = this.radius * (1 - this.frame / this.maxFrame);
        const alpha = 1 - this.frame / this.maxFrame;
        
        // 创建爆炸渐变
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, size);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        gradient.addColorStop(0.3, `rgba(255, 193, 7, ${alpha})`);
        gradient.addColorStop(0.6, `rgba(255, 87, 34, ${alpha})`);
        gradient.addColorStop(1, `rgba(244, 67, 54, ${alpha})`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制爆炸光芒
        for (let i = 0; i < 12; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            const angle = Math.PI * 2 / 12 * i;
            const rayLength = size * 1.8;
            ctx.lineTo(
                this.x + Math.cos(angle) * rayLength,
                this.y + Math.sin(angle) * rayLength
            );
            ctx.lineWidth = 4;
            ctx.strokeStyle = `rgba(255, 193, 7, ${alpha})`;
            ctx.stroke();
        }
        
        // 绘制粒子
        this.particles.forEach(particle => {
            if (particle.life > 0) {
                ctx.fillStyle = `rgba(255, 193, 7, ${particle.life})`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
}

/**
 * 输入处理类
 * 处理键盘输入
 */
class InputHandler {
    /**
     * 构造函数
     * 设置键盘事件监听
     */
    constructor() {
        this.keys = [];
        
        // 按键按下事件
        window.addEventListener('keydown', e => {
            // 防止空格键滚动页面
            if (e.key === ' ') {
                e.preventDefault();
            }
            
            // 添加按键到数组（如果不存在）
            if (
                (e.key === 'ArrowLeft' ||
                 e.key === 'ArrowRight' ||
                 e.key === 'ArrowUp' ||
                 e.key === 'ArrowDown' ||
                 e.key === ' ' ||
                 e.key === 'a' || e.key === 'A' ||
                 e.key === 'd' || e.key === 'D' ||
                 e.key === 'w' || e.key === 'W' ||
                 e.key === 's' || e.key === 'S' ||
                 e.key === 'j' || e.key === 'J') &&
                this.keys.indexOf(e.key) === -1
            ) {
                this.keys.push(e.key);
            }
        });
        
        // 按键释放事件
        window.addEventListener('keyup', e => {
            // 从数组中移除按键
            if (
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowDown' ||
                e.key === ' ' ||
                e.key === 'a' || e.key === 'A' ||
                e.key === 'd' || e.key === 'D' ||
                e.key === 'w' || e.key === 'W' ||
                e.key === 's' || e.key === 'S' ||
                e.key === 'j' || e.key === 'J'
            ) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
    }
}

/**
 * 用户界面类
 * 处理游戏UI的更新
 */
class UI {
    /**
     * 构造函数
     * @param {Game} game - 游戏实例
     */
    constructor(game) {
        this.game = game;
        this.scoreElement = document.getElementById('scoreValue');
        this.livesElement = document.getElementById('livesValue');
        this.finalScoreElement = document.getElementById('finalScore');
    }
    
    /**
     * 更新分数显示
     * @param {number} score - 当前分数
     */
    updateScore(score) {
        this.scoreElement.textContent = score;
    }
    
    /**
     * 更新生命值显示
     * @param {number} lives - 当前生命值
     */
    updateLives(lives) {
        this.livesElement.textContent = lives;
    }
    
    /**
     * 更新火力等级显示
     * @param {number} powerLevel - 当前火力等级
     */
    updatePowerLevel(powerLevel) {
        const powerElement = document.getElementById('powerValue');
        if (powerElement) {
            powerElement.textContent = powerLevel;
        }
    }
    
    /**
     * 更新子弹类型显示
     * @param {string} bulletType - 当前子弹类型
     */
    updateBulletType(bulletType) {
        const bulletTypeElement = document.getElementById('bulletTypeValue');
        if (bulletTypeElement) {
            const typeNames = {
                'normal': '普通',
                'spread': '散射',
                'laser': '激光'
            };
            bulletTypeElement.textContent = typeNames[bulletType] || '普通';
        }
    }
}