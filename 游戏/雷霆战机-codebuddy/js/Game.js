/**
 * 雷霆战机游戏主类
 * 负责游戏的整体控制和协调
 */
class Game {
    /**
     * 游戏构造函数
     */
    constructor() {
        // 获取DOM元素
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('scoreValue');
        this.livesElement = document.getElementById('livesValue');
        this.weaponLevelElement = document.getElementById('weaponLevel');
        this.finalScoreElement = document.getElementById('finalScore');
        this.gameStartElement = document.getElementById('gameStart');
        this.gameOverElement = document.getElementById('gameOver');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        
        // 设置画布尺寸
        this.canvas.width = 480;
        this.canvas.height = 720;
        
        // 游戏状态
        this.isRunning = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.isPaused = false;
        
        // 游戏对象数组
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.enemyBullets = [];
        this.explosions = [];
        this.upgradeEffects = [];
        this.powerUps = [];
        
        // 游戏参数
        this.enemySpawnRate = 1500; // 敌机生成间隔(毫秒)
        this.lastEnemySpawn = 0;    // 上次生成敌机的时间
        this.lastFrameTime = 0;     // 上一帧的时间
        this.bossSpawnScore = 500;  // Boss出现分数
        this.bossActive = false;    // Boss是否激活
        
        // 背景效果
        this.stars = [];
        this.initStars();
        
        // 绑定事件处理
        this.bindEvents();
        
        // 音效系统（模拟）
        this.soundEnabled = true;
    }
    
    /**
     * 初始化星空背景
     */
    initStars() {
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speed: 0.5 + Math.random() * 2,
                size: Math.random() * 2,
                opacity: 0.3 + Math.random() * 0.7
            });
        }
    }
    
    /**
     * 绑定游戏事件
     */
    bindEvents() {
        // 开始按钮点击事件
        this.startButton.addEventListener('click', () => {
            this.start();
        });
        
        // 重新开始按钮点击事件
        this.restartButton.addEventListener('click', () => {
            this.restart();
        });
        
        // 键盘控制
        window.addEventListener('keydown', (e) => {
            if (this.player && this.isRunning) {
                this.player.handleKeyDown(e);
            }
            
            // 暂停功能
            if (e.key === 'p' || e.key === 'P') {
                this.togglePause();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            if (this.player && this.isRunning) {
                this.player.handleKeyUp(e);
            }
        });
        
        // 防止页面滚动
        window.addEventListener('keydown', (e) => {
            if(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
                e.preventDefault();
            }
        }, false);
    }
    
    /**
     * 开始游戏
     */
    start() {
        // 隐藏开始界面
        this.gameStartElement.style.display = 'none';
        this.gameOverElement.style.display = 'none';
        
        // 初始化游戏状态
        this.isRunning = true;
        this.isPaused = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.bossActive = false;
        
        // 清空游戏对象数组
        this.enemies = [];
        this.bullets = [];
        this.enemyBullets = [];
        this.explosions = [];
        this.upgradeEffects = [];
        this.powerUps = [];
        
        // 重置游戏参数
        this.enemySpawnRate = 1500;
        this.lastEnemySpawn = 0;
        
        // 更新UI
        this.updateUI();
        
        // 创建玩家飞机
        this.player = new Player(
            this.canvas.width / 2 - 30,
            this.canvas.height - 120,
            this
        );
        
        // 开始游戏循环
        this.lastFrameTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    /**
     * 重新开始游戏
     */
    restart() {
        this.start();
    }
    
    /**
     * 暂停/恢复游戏
     */
    togglePause() {
        if (!this.isRunning) return;
        
        this.isPaused = !this.isPaused;
        if (!this.isPaused) {
            this.lastFrameTime = performance.now();
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }
    
    /**
     * 游戏结束
     */
    gameOver() {
        this.isRunning = false;
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.style.display = 'flex';
    }
    
    /**
     * 更新UI显示
     */
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.livesElement.textContent = this.lives;
        if (this.weaponLevelElement) {
            this.weaponLevelElement.textContent = this.player ? this.player.weaponLevel : 1;
        }
    }
    
    /**
     * 游戏主循环
     * @param {number} currentTime - 当前时间戳
     */
    gameLoop(currentTime) {
        if (this.isPaused) return;
        
        // 计算帧间隔时间
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.isRunning) {
            // 更新和绘制游戏
            this.update(deltaTime, currentTime);
            this.render();
            
            // 继续游戏循环
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }
    
    /**
     * 更新游戏状态
     * @param {number} deltaTime - 帧间隔时间
     * @param {number} currentTime - 当前时间戳
     */
    update(deltaTime, currentTime) {
        // 更新背景星空
        this.updateStars();
        
        // 生成敌机
        this.spawnEnemies(currentTime);
        
        // 更新玩家
        if (this.player) {
            this.player.update(deltaTime);
        }
        
        // 更新游戏对象
        this.updateBullets(deltaTime);
        this.updateEnemies(deltaTime);
        this.updateEnemyBullets(deltaTime);
        this.updateExplosions(deltaTime);
        this.updateUpgradeEffects(deltaTime);
        this.updatePowerUps(deltaTime);
        
        // 碰撞检测
        this.checkCollisions();
        
        // 更新游戏难度
        this.updateDifficulty();
        
        // 更新UI
        this.updateUI();
    }
    
    /**
     * 更新背景星空
     */
    updateStars() {
        for (let star of this.stars) {
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = -5;
                star.x = Math.random() * this.canvas.width;
            }
        }
    }
    
    /**
     * 生成敌机
     * @param {number} currentTime - 当前时间戳
     */
    spawnEnemies(currentTime) {
        if (currentTime - this.lastEnemySpawn > this.enemySpawnRate) {
            // 检查是否生成Boss
            if (this.score >= this.bossSpawnScore && !this.bossActive) {
                this.spawnBoss();
                this.bossActive = true;
                this.bossSpawnScore += 1000; // 下次Boss出现分数
            } else if (!this.bossActive) {
                this.spawnRandomEnemy();
            }
            
            this.lastEnemySpawn = currentTime;
        }
    }
    
    /**
     * 生成随机敌机
     */
    spawnRandomEnemy() {
        const x = Math.random() * (this.canvas.width - 60);
        const rand = Math.random();
        let enemyType = 'normal';
        
        if (rand < 0.1) {
            enemyType = 'heavy';
        } else if (rand < 0.3) {
            enemyType = 'fast';
        }
        
        const enemy = new Enemy(x, -60, this, enemyType);
        this.enemies.push(enemy);
        
        // 随着游戏进行，逐渐增加难度
        this.enemySpawnRate = Math.max(300, this.enemySpawnRate - 5);
    }
    
    /**
     * 生成Boss
     */
    spawnBoss() {
        const x = this.canvas.width / 2 - 50;
        const boss = new Enemy(x, -100, this, 'boss');
        this.enemies.push(boss);
    }
    
    /**
     * 更新子弹
     * @param {number} deltaTime - 帧间隔时间
     */
    updateBullets(deltaTime) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update(deltaTime);
            
            // 移除超出屏幕的子弹
            if (this.bullets[i].y < -this.bullets[i].height) {
                this.bullets.splice(i, 1);
            }
        }
    }
    
    /**
     * 更新敌机
     * @param {number} deltaTime - 帧间隔时间
     */
    updateEnemies(deltaTime) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].update(deltaTime);
            
            // 移除超出屏幕的敌机
            if (this.enemies[i].y > this.canvas.height + 50) {
                if (this.enemies[i].type === 'boss') {
                    this.bossActive = false;
                }
                this.enemies.splice(i, 1);
            }
        }
    }
    
    /**
     * 更新敌机子弹
     * @param {number} deltaTime - 帧间隔时间
     */
    updateEnemyBullets(deltaTime) {
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            this.enemyBullets[i].update(deltaTime);
            
            // 移除超出屏幕的子弹
            if (this.enemyBullets[i].y > this.canvas.height) {
                this.enemyBullets.splice(i, 1);
            }
        }
    }
    
    /**
     * 更新爆炸效果
     * @param {number} deltaTime - 帧间隔时间
     */
    updateExplosions(deltaTime) {
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            this.explosions[i].update(deltaTime);
            if (this.explosions[i].isFinished) {
                this.explosions.splice(i, 1);
            }
        }
    }
    
    /**
     * 更新升级特效
     * @param {number} deltaTime - 帧间隔时间
     */
    updateUpgradeEffects(deltaTime) {
        for (let i = this.upgradeEffects.length - 1; i >= 0; i--) {
            this.upgradeEffects[i].update(deltaTime);
            if (this.upgradeEffects[i].isFinished) {
                this.upgradeEffects.splice(i, 1);
            }
        }
    }
    
    /**
     * 更新道具
     * @param {number} deltaTime - 帧间隔时间
     */
    updatePowerUps(deltaTime) {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            this.powerUps[i].update(deltaTime);
            
            // 移除超出屏幕的道具
            if (this.powerUps[i].y > this.canvas.height) {
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    /**
     * 碰撞检测
     */
    checkCollisions() {
        if (!this.player) return;
        
        // 玩家子弹与敌机碰撞
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                if (this.checkCollision(this.bullets[i], this.enemies[j])) {
                    const enemy = this.enemies[j];
                    const bullet = this.bullets[i];
                    
                    // 敌机受伤
                    if (enemy.takeDamage(bullet.damage)) {
                        // 敌机被摧毁
                        this.createExplosion(
                            enemy.x + enemy.width / 2,
                            enemy.y + enemy.height / 2,
                            enemy.type === 'boss' ? 'large' : 'normal'
                        );
                        
                        this.score += enemy.scoreValue;
                        
                        // Boss被击败
                        if (enemy.type === 'boss') {
                            this.bossActive = false;
                            this.level++;
                        }
                        
                        // 随机掉落道具
                        if (Math.random() < 0.2) {
                            this.spawnPowerUp(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                        }
                        
                        this.enemies.splice(j, 1);
                    }
                    
                    this.bullets.splice(i, 1);
                    break;
                }
            }
        }
        
        // 敌机与玩家碰撞
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            if (this.checkCollision(this.enemies[i], this.player)) {
                this.createExplosion(
                    this.player.x + this.player.width / 2,
                    this.player.y + this.player.height / 2,
                    'normal'
                );
                
                if (this.player.takeDamage(30)) {
                    this.lives--;
                    if (this.lives <= 0) {
                        this.gameOver();
                        return;
                    }
                    // 重置玩家位置和状态
                    this.player.x = this.canvas.width / 2 - 30;
                    this.player.y = this.canvas.height - 120;
                    this.player.health = this.player.maxHealth;
                }
                
                this.enemies.splice(i, 1);
            }
        }
        
        // 敌机子弹与玩家碰撞
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            if (this.checkCollision(this.enemyBullets[i], this.player)) {
                if (this.player.takeDamage(this.enemyBullets[i].damage)) {
                    this.lives--;
                    if (this.lives <= 0) {
                        this.gameOver();
                        return;
                    }
                    // 重置玩家
                    this.player.x = this.canvas.width / 2 - 30;
                    this.player.y = this.canvas.height - 120;
                    this.player.health = this.player.maxHealth;
                }
                
                this.enemyBullets.splice(i, 1);
            }
        }
        
        // 玩家与道具碰撞
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            if (this.checkCollision(this.powerUps[i], this.player)) {
                this.powerUps[i].applyEffect(this.player);
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    /**
     * 更新游戏难度
     */
    updateDifficulty() {
        // 根据分数调整难度
        const newLevel = Math.floor(this.score / 200) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            // 可以在这里添加难度提升的效果
        }
    }
    
    /**
     * 渲染游戏画面
     */
    render() {
        // 绘制背景
        this.renderBackground();
        
        // 绘制游戏对象
        if (this.player) {
            this.player.render(this.ctx);
        }
        
        this.bullets.forEach(bullet => bullet.render(this.ctx));
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        this.enemyBullets.forEach(bullet => bullet.render(this.ctx));
        this.explosions.forEach(explosion => explosion.render(this.ctx));
        this.upgradeEffects.forEach(effect => effect.render(this.ctx));
        this.powerUps.forEach(powerUp => powerUp.render(this.ctx));
        
        // 绘制UI元素
        this.renderUI();
        
        // 绘制暂停提示
        if (this.isPaused) {
            this.renderPauseScreen();
        }
    }
    
    /**
     * 渲染背景
     */
    renderBackground() {
        // 渐变背景
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#000011');
        gradient.addColorStop(0.5, '#000033');
        gradient.addColorStop(1, '#000055');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制星空
        this.ctx.fillStyle = '#ffffff';
        for (let star of this.stars) {
            this.ctx.globalAlpha = star.opacity;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }
    
    /**
     * 渲染UI元素
     */
    renderUI() {
        // 可以在这里添加额外的UI元素，如血条、武器指示器等
        if (this.player) {
            this.renderPlayerHealthBar();
        }
        
        // 渲染关卡信息
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`关卡: ${this.level}`, this.canvas.width - 100, 30);
    }
    
    /**
     * 渲染玩家血条
     */
    renderPlayerHealthBar() {
        const barWidth = 200;
        const barHeight = 8;
        const barX = 10;
        const barY = this.canvas.height - 30;
        
        // 背景
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // 血量
        const healthPercent = this.player.health / this.player.maxHealth;
        const healthColor = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.2 ? '#ffff00' : '#ff0000';
        this.ctx.fillStyle = healthColor;
        this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // 护盾
        if (this.player.shield > 0) {
            const shieldPercent = this.player.shield / this.player.maxShield;
            this.ctx.fillStyle = '#00ffff';
            this.ctx.fillRect(barX, barY - 12, barWidth * shieldPercent, 4);
        }
    }
    
    /**
     * 渲染暂停界面
     */
    renderPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏暂停', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('按P键继续游戏', this.canvas.width / 2, this.canvas.height / 2 + 50);
        this.ctx.textAlign = 'left';
    }
    
    /**
     * 创建爆炸效果
     * @param {number} x - 爆炸中心x坐标
     * @param {number} y - 爆炸中心y坐标
     * @param {string} type - 爆炸类型
     */
    createExplosion(x, y, type = 'normal') {
        const explosion = new Explosion(x, y, type);
        this.explosions.push(explosion);
    }
    
    /**
     * 显示升级特效
     */
    showUpgradeEffect() {
        if (this.player) {
            const effect = new UpgradeEffect(
                this.player.x + this.player.width / 2,
                this.player.y + this.player.height / 2
            );
            this.upgradeEffects.push(effect);
        }
    }
    
    /**
     * 生成道具
     * @param {number} x - x坐标
     * @param {number} y - y坐标
     */
    spawnPowerUp(x, y) {
        const powerUp = new PowerUp(x, y, this);
        this.powerUps.push(powerUp);
    }
    
    /**
     * 检测两个对象之间的碰撞
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