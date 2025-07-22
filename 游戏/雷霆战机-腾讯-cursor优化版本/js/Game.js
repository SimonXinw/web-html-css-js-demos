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
        this.gameState = 'start'; // 'start', 'playing', 'paused', 'gameOver'
        
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
        this.maxLevel = 10;
        
        // 游戏计时器
        this.lastTime = 0;
        this.enemyTimer = 0;
        this.enemyInterval = 1000; // 敌机生成间隔（毫秒）
        this.powerUpTimer = 0;
        this.powerUpInterval = 15000; // 道具生成间隔（毫秒）
        
        // 输入处理器
        this.inputHandler = new InputHandler();
        this.inputHandler.setGame(this);
        
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
        this.ui.hideStartScreen();
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
        this.ui.updateLevel(this.level);
        
        // 隐藏游戏结束界面
        this.ui.hideGameOverScreen();
        
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
        this.ui.updateFinalScore(this.score);
        this.ui.updateFinalLevel(this.level);
        this.ui.showGameOverScreen();
    }
    
    /**
     * 暂停游戏
     */
    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.ui.showPauseScreen();
        }
    }
    
    /**
     * 恢复游戏
     */
    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.ui.hidePauseScreen();
            this.lastTime = performance.now();
            requestAnimationFrame(this.gameLoop);
        }
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
        
        // 检查暂停键
        if (this.inputHandler.checkPauseKey()) {
            this.pauseGame();
            return;
        }
        
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
            this.enemyInterval = Math.max(200, 1000 - this.score / 50);
        }
        
        // 生成道具
        this.powerUpTimer += deltaTime;
        if (this.powerUpTimer > this.powerUpInterval) {
            this.addPowerUp();
            this.powerUpTimer = 0;
        }
        
        // 更新敌机
        this.updateEnemies(deltaTime);
        
        // 更新子弹
        this.updateBullets(deltaTime);
        
        // 更新道具
        this.updatePowerUps();
        
        // 更新爆炸效果
        this.updateExplosions(deltaTime);
        
        // 更新UI动画
        this.ui.updateScoreAnimation();
    }
    
    /**
     * 更新敌机
     */
    updateEnemies(deltaTime) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(deltaTime);
            
            // 检测敌机是否飞出屏幕底部
            if (enemy.y > this.height) {
                this.enemies.splice(i, 1);
                continue;
            }
            
            // 检测敌机与玩家碰撞
            if (this.checkCollision(enemy, this.player) && this.player.canBeHit()) {
                this.enemies.splice(i, 1);
                this.explosions.push(new Explosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, this));
                this.lives--;
                this.ui.updateLives(this.lives);
                
                // 激活玩家无敌状态
                this.player.activateInvulnerable();
                
                // 检查游戏是否结束
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        }
    }
    
    /**
     * 更新子弹
     */
    updateBullets(deltaTime) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update();
            
            // 检测子弹是否飞出屏幕顶部
            if (bullet.y < -bullet.height) {
                this.bullets.splice(i, 1);
                continue;
            }
            
            // 检测子弹与敌机碰撞
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                if (this.checkCollision(bullet, enemy)) {
                    // 减少敌机生命值
                    const isDestroyed = enemy.takeDamage(bullet.damage);
                    
                    // 如果敌机生命值为0，移除敌机
                    if (isDestroyed) {
                        this.enemies.splice(j, 1);
                        
                        // 创建爆炸效果
                        this.explosions.push(new Explosion(
                            enemy.x + enemy.width / 2,
                            enemy.y + enemy.height / 2,
                            this,
                            enemy.type
                        ));
                        
                        // 增加分数
                        this.score += enemy.score;
                        this.ui.updateScore(this.score);
                        
                        // 升级检查
                        const newLevel = Math.floor(this.score / 500) + 1;
                        if (newLevel > this.level && newLevel <= this.maxLevel) {
                            this.level = newLevel;
                            this.player.weaponLevel = Math.min(4, this.level);
                            this.ui.updateLevel(this.level);
                            this.ui.showUpgradeMessage(`升级到 ${this.level} 级！`);
                        }
                    }
                    
                    // 移除子弹
                    this.bullets.splice(i, 1);
                    break;
                }
            }
        }
    }
    
    /**
     * 更新道具
     */
    updatePowerUps() {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            powerUp.update();
            
            // 检测道具是否飞出屏幕底部
            if (powerUp.y > this.height) {
                this.powerUps.splice(i, 1);
                continue;
            }
            
            // 检测道具与玩家碰撞
            if (this.checkCollision(powerUp, this.player)) {
                powerUp.activate();
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    /**
     * 更新爆炸效果
     */
    updateExplosions(deltaTime) {
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            explosion.update(deltaTime);
            if (explosion.frame > explosion.maxFrame) {
                this.explosions.splice(i, 1);
            }
        }
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
        
        // 根据分数和等级决定敌机类型
        let enemyType = 1;
        const random = Math.random();
        
        if (this.score > 500 && random < 0.7) enemyType = 2;
        if (this.score > 1000 && random < 0.5) enemyType = 2;
        if (this.score > 2000 && random < 0.3) enemyType = 3;
        
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
        const random = Math.random();
        let type;
        
        if (random < 0.4) {
            type = 'shield';
        } else if (random < 0.7) {
            type = 'weapon';
        } else if (random < 0.9) {
            type = 'life';
        } else {
            type = 'bomb';
        }
        
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

// 等待DOM加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    // 创建游戏实例并初始化
    const game = new Game();
    game.init();
    
    // 添加键盘事件监听器用于暂停/恢复
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'p') {
            if (game.gameState === 'playing') {
                game.pauseGame();
            } else if (game.gameState === 'paused') {
                game.resumeGame();
            }
        }
    });
}); 