/**
 * 雷霆战机 - 面向对象实现
 * 
 * 本游戏使用面向对象编程方式实现，主要包含以下类：
 * - Game: 游戏主类，负责初始化和管理游戏流程
 * - Player: 玩家飞机类
 * - Enemy: 敌机类
 * - Bullet: 子弹类
 * - Explosion: 爆炸效果类
 * - PowerUp: 道具类
 * - InputHandler: 输入处理类
 * - UI: 用户界面类
 * - Background: 背景类
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
        this.powerUps = [];
        this.stars = [];
        
        // 游戏数据
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        
        // 游戏计时器
        this.lastTime = 0;
        this.enemyTimer = 0;
        this.enemyInterval = 1000; // 敌机生成间隔（毫秒）
        this.powerUpTimer = 0;
        this.powerUpInterval = 10000; // 道具生成间隔（毫秒）
        
        // 输入处理器
        this.inputHandler = new InputHandler();
        
        // 用户界面
        this.ui = new UI(this);
        
        // 背景
        this.background = new Background(this);
        
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
        
        // 初始化背景星星
        this.initStars();
        
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
     * 初始化背景星星
     */
    initStars() {
        const starCount = 100;
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.5 + 0.1
            });
        }
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
        this.level = 1;
        this.enemies = [];
        this.bullets = [];
        this.explosions = [];
        this.powerUps = [];
        
        // 重置玩家位置和状态
        this.player.reset();
        
        // 更新UI
        this.ui.updateScore(this.score);
        this.ui.updateLives(this.lives);
        
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
        
        // 更新背景
        this.background.update(deltaTime);
        
        // 更新玩家
        this.player.update(deltaTime, this.inputHandler.keys);
        
        // 生成敌机
        this.enemyTimer += deltaTime;
        if (this.enemyTimer > this.enemyInterval) {
            this.addEnemy();
            this.enemyTimer = 0;
            // 随着分数增加，敌机生成间隔减少（游戏难度增加）
            this.enemyInterval = Math.max(200, 1000 - this.score / 20);
        }
        
        // 生成道具
        this.powerUpTimer += deltaTime;
        if (this.powerUpTimer > this.powerUpInterval) {
            this.addPowerUp();
            this.powerUpTimer = 0;
        }
        
        // 更新敌机
        this.enemies.forEach((enemy, index) => {
            enemy.update(deltaTime);
            
            // 检测敌机是否飞出屏幕底部
            if (enemy.y > this.height) {
                this.enemies.splice(index, 1);
            }
            
            // 检测敌机与玩家碰撞
            if (this.checkCollision(enemy, this.player) && !this.player.shieldActive) {
                this.enemies.splice(index, 1);
                this.explosions.push(new Explosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, this));
                this.lives--;
                this.ui.updateLives(this.lives);
                
                // 检查游戏是否结束
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        });
        
        // 更新子弹
        this.bullets.forEach((bullet, bulletIndex) => {
            bullet.update();
            
            // 检测子弹是否飞出屏幕顶部
            if (bullet.y < -bullet.height) {
                this.bullets.splice(bulletIndex, 1);
            }
            
            // 检测子弹与敌机碰撞
            this.enemies.forEach((enemy, enemyIndex) => {
                if (this.checkCollision(bullet, enemy)) {
                    // 减少敌机生命值
                    enemy.health -= bullet.damage;
                    
                    // 如果敌机生命值为0，移除敌机
                    if (enemy.health <= 0) {
                        this.enemies.splice(enemyIndex, 1);
                        
                        // 创建爆炸效果
                        this.explosions.push(new Explosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, this));
                        
                        // 增加分数
                        this.score += enemy.score;
                        this.ui.updateScore(this.score);
                        
                        // 升级检查
                        if (this.score >= this.level * 500) {
                            this.level++;
                            this.player.weaponLevel = Math.min(3, this.level);
                        }
                    }
                    
                    // 移除子弹
                    this.bullets.splice(bulletIndex, 1);
                }
            });
        });
        
        // 更新道具
        this.powerUps.forEach((powerUp, index) => {
            powerUp.update();
            
            // 检测道具是否飞出屏幕底部
            if (powerUp.y > this.height) {
                this.powerUps.splice(index, 1);
            }
            
            // 检测道具与玩家碰撞
            if (this.checkCollision(powerUp, this.player)) {
                powerUp.activate();
                this.powerUps.splice(index, 1);
            }
        });
        
        // 更新爆炸效果
        this.explosions.forEach((explosion, index) => {
            explosion.update(deltaTime);
            if (explosion.frame > explosion.maxFrame) {
                this.explosions.splice(index, 1);
            }
        });
    }
    
    /**
     * 渲染游戏画面
     */
    render() {
        // 绘制背景
        this.background.draw(this.ctx);
        
        // 绘制玩家
        if (this.player) {
            this.player.draw(this.ctx);
        }
        
        // 绘制敌机
        this.enemies.forEach(enemy => {
            enemy.draw(this.ctx);
        });
        
        // 绘制子弹
        this.bullets.forEach(bullet => {
            bullet.draw(this.ctx);
        });
        
        // 绘制道具
        this.powerUps.forEach(powerUp => {
            powerUp.draw(this.ctx);
        });
        
        // 绘制爆炸效果
        this.explosions.forEach(explosion => {
            explosion.draw(this.ctx);
        });
    }
    
    /**
     * 添加敌机
     */
    addEnemy() {
        // 随机生成敌机位置
        const x = Math.random() * (this.width - 40);
        
        // 根据分数决定敌机类型
        let enemyType = 1;
        if (this.score > 500) enemyType = Math.random() < 0.7 ? 1 : 2;
        if (this.score > 1000) enemyType = Math.random() < 0.6 ? 1 : (Math.random() < 0.7 ? 2 : 3);
        
        const enemy = new Enemy(x, -50, this, enemyType);
        this.enemies.push(enemy);
    }
    
    /**
     * 添加道具
     */
    addPowerUp() {
        // 随机生成道具位置
        const x = Math.random() * (this.width - 30);
        
        // 随机决定道具类型
        const type = Math.random() < 0.5 ? 'shield' : 'weapon';
        
        const powerUp = new PowerUp(x, -30, this, type);
        this.powerUps.push(powerUp);
    }
    
    /**
     * 添加子弹
     * @param {number} x - 子弹x坐标
     * @param {number} y - 子弹y坐标
     * @param {number} type - 子弹类型
     */
    addBullet(x, y, type = 1) {
        const bullet = new Bullet(x, y, this, type);
        this.bullets.push(bullet);
    }
    
    /**
     * 碰撞检测
     * @param {Object} obj1 - 第一个对象
     * @param {Object} obj2 - 第二个对象
     * @returns {boolean} - 是否碰撞
     */
    checkCollision(obj1, obj2) {
        return (
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
        );
    }
}

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
    }
    
    /**
     * 更新背景状态
     * @param {number} deltaTime - 时间差（毫秒）
     */
    update(deltaTime) {
        // 更新星星位置
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.game.height) {
                star.y = 0;
                star.x = Math.random() * this.game.width;
            }
        });
    }
    
    /**
     * 绘制背景
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    draw(ctx) {
        // 绘制深色背景
        ctx.fillStyle = '#0c0c2c';
        ctx.fillRect(0, 0, this.game.width, this.game.height);
        
        // 绘制星星
        this.stars.forEach(star => {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.7})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

/**
 * 玩家飞机类
 * 处理玩家飞机的移动、射击和状态
 */
class Player {
    /**
     * 构造函数
     * @param {Game} game - 游戏实例
     */
    constructor(game) {
        this.game = game;
        this.width = 50;
        this.height = 50;
        this.x = game.width / 2 - this.width / 2;
        this.y = game.height - this.height - 20;
        this.speed = 5;
        this.weaponLevel = 1;
        this.shootTimer = 0;
        this.shootInterval = 300; // 射击间隔（毫秒）
        this.shieldActive = false;
        this.shieldTimer = 0;
        this.shieldDuration = 5000; // 护盾持续时间（毫秒）
    }
    
    /**
     * 更新玩家状态
     * @param {number} deltaTime - 时间差（毫秒）
     * @param {Object} keys - 按键状态
     */
    update(deltaTime, keys) {
        // 处理移动
        if (keys.ArrowLeft || keys.a) {
            this.x = Math.max(0, this.x - this.speed);
        }
        if (keys.ArrowRight || keys.d) {
            this.x = Math.min(this.game.width - this.width, this.x + this.speed);
        }
        if (keys.ArrowUp || keys.w) {
            this.y = Math.max(0, this.y - this.speed);
        }
        if (keys.ArrowDown || keys.s) {
            this.y = Math.min(this.game.height - this.height, this.y + this.speed);
        }
        
        // 处理射击
        this.shootTimer += deltaTime;
        if ((keys.Space || keys[' ']) && this.shootTimer > this.shootInterval) {
            this.shoot();
            this.shootTimer = 0;
        }
        
        // 处理护盾
        if (this.shieldActive) {
            this.shieldTimer += deltaTime;
            if (this.shieldTimer > this.shieldDuration) {
                this.shieldActive = false;
                this.shieldTimer = 0;
            }
        }
    }
    
    /**
     * 绘制玩家飞机
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    draw(ctx) {
        // 绘制飞机
        if (this.shieldActive) {
            // 绘制护盾
            ctx.fillStyle = 'rgba(52, 152, 219, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 + 10, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 飞机主体
        ctx.fillStyle = '#4cd137';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.8);
        ctx.lineTo(this.x + this.width * 0.7, this.y + this.height * 0.7);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.3, this.y + this.height * 0.7);
        ctx.lineTo(this.x, this.y + this.height * 0.8);
        ctx.closePath();
        ctx.fill();
        
        // 飞机驾驶舱
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height * 0.4, this.width * 0.16, 0, Math.PI * 2);
        ctx.fill();
        
        // 飞机引擎
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.rect(this.x + this.width * 0.4, this.y + this.height * 0.8, this.width * 0.2, this.height * 0.1);
        ctx.fill();
        
        // 飞机尾焰
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.4, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.5, this.y + this.height + 10);
        ctx.lineTo(this.x + this.width * 0.6, this.y + this.height);
        ctx.closePath();
        ctx.fill();
    }
    
    /**
     * 射击
     */
    shoot() {
        switch (this.weaponLevel) {
            case 1:
                // 单发子弹
                this.game.addBullet(this.x + this.width / 2 - 2.5, this.y, 1);
                break;
            case 2:
                // 双发子弹
                this.game.addBullet(this.x + this.width * 0.3, this.y + 10, 1);
                this.game.addBullet(this.x + this.width * 0.7, this.y + 10, 1);
                break;
            case 3:
                // 三发子弹
                this.game.addBullet(this.x + this.width / 2 - 5, this.y, 2);
                this.game.addBullet(this.x + this.width * 0.2, this.y + 10, 1);
                this.game.addBullet(this.x + this.width * 0.8, this.y + 10, 1);
                break;
            case 4:
                // 高级武器
                this.game.addBullet(this.x + this.width / 2 - 7.5, this.y, 3);
                break;
        }
    }
    
    /**
     * 重置玩家状态
     */
    reset() {
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.height - 20;
        this.weaponLevel = 1;
        this.shieldActive = false;
        this.shieldTimer = 0;
    }
    
    /**
     * 激活护盾
     */
    activateShield() {
        this.shieldActive = true;
        this.shieldTimer = 0;
    }
    
    /**
     * 升级武器
     */
    upgradeWeapon() {
        this.weaponLevel = Math.min(4, this.weaponLevel + 1);
    }
}