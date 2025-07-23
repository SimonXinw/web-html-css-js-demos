/**
 * 雷霆战机游戏
 * 一个基于Canvas的飞机射击游戏
 * 采用面向对象的方式实现
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 游戏主类
    class Game {
        /**
         * 游戏构造函数
         */
        constructor() {
            // 获取DOM元素
            this.canvas = document.getElementById('game-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.startScreen = document.querySelector('.game-start');
            this.gameOverScreen = document.querySelector('.game-over');
            this.scoreElement = document.getElementById('score');
            this.livesElement = document.getElementById('lives');
            this.finalScoreElement = document.getElementById('final-score');
            this.startBtn = document.getElementById('start-btn');
            this.restartBtn = document.getElementById('restart-btn');
            
            // 设置画布尺寸
            this.canvas.width = 400;
            this.canvas.height = 600;
            
            // 游戏状态
            this.isRunning = false;
            this.score = 0;
            this.lives = 3;
            
            // 游戏对象
            this.player = null;
            this.enemies = [];
            this.bullets = [];
            this.particles = [];
            
            // 游戏计时器和难度控制
            this.lastEnemySpawn = 0;
            this.enemySpawnInterval = 1500; // 敌机生成间隔(毫秒)
            this.lastFrameTime = 0;
            this.deltaTime = 0;
            
            // 绑定事件处理方法
            this.bindEvents();
        }
        
        /**
         * 绑定游戏事件
         */
        bindEvents() {
            // 开始游戏按钮点击事件
            this.startBtn.addEventListener('click', () => {
                this.start();
            });
            
            // 重新开始按钮点击事件
            this.restartBtn.addEventListener('click', () => {
                this.restart();
            });
            
            // 鼠标移动控制玩家飞机
            this.canvas.addEventListener('mousemove', (e) => {
                if (this.player && this.isRunning) {
                    const rect = this.canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    this.player.moveTo(x, y);
                }
            });
            
            // 点击发射子弹
            this.canvas.addEventListener('click', () => {
                if (this.player && this.isRunning) {
                    this.player.shoot();
                }
            });
        }
        
        /**
         * 开始游戏
         */
        start() {
            this.isRunning = true;
            this.score = 0;
            this.lives = 3;
            this.enemies = [];
            this.bullets = [];
            this.particles = [];
            
            // 创建玩家飞机
            this.player = new Player(this);
            
            // 隐藏开始界面
            this.startScreen.classList.add('hidden');
            this.gameOverScreen.classList.add('hidden');
            
            // 更新分数和生命显示
            this.updateUI();
            
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
         * 游戏结束
         */
        gameOver() {
            this.isRunning = false;
            this.finalScoreElement.textContent = this.score;
            this.gameOverScreen.classList.remove('hidden');
        }
        
        /**
         * 更新UI显示
         */
        updateUI() {
            this.scoreElement.textContent = this.score;
            this.livesElement.textContent = this.lives;
        }
        
        /**
         * 游戏主循环
         * @param {number} timestamp - 当前时间戳
         */
        gameLoop(timestamp) {
            // 计算帧间隔时间
            this.deltaTime = timestamp - this.lastFrameTime;
            this.lastFrameTime = timestamp;
            
            // 清空画布
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // 绘制背景
            this.drawBackground();
            
            if (this.isRunning) {
                // 生成敌机
                this.spawnEnemies(timestamp);
                
                // 更新和绘制玩家
                if (this.player) {
                    this.player.update(this.deltaTime);
                    this.player.draw();
                }
                
                // 更新和绘制子弹
                this.updateBullets();
                
                // 更新和绘制敌机
                this.updateEnemies();
                
                // 更新和绘制粒子效果
                this.updateParticles();
                
                // 检测碰撞
                this.checkCollisions();
                
                // 请求下一帧
                requestAnimationFrame(this.gameLoop.bind(this));
            }
        }
        
        /**
         * 绘制游戏背景
         */
        drawBackground() {
            // 创建星空背景
            this.ctx.fillStyle = '#111';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // 绘制星星
            this.ctx.fillStyle = 'white';
            for (let i = 0; i < 100; i++) {
                const x = Math.random() * this.canvas.width;
                const y = (Math.random() * this.canvas.height + this.lastFrameTime * 0.01) % this.canvas.height;
                const size = Math.random() * 2;
                this.ctx.fillRect(x, y, size, size);
            }
        }
        
        /**
         * 生成敌机
         * @param {number} timestamp - 当前时间戳
         */
        spawnEnemies(timestamp) {
            if (timestamp - this.lastEnemySpawn > this.enemySpawnInterval) {
                // 创建新敌机
                const enemy = new Enemy(this);
                this.enemies.push(enemy);
                
                // 更新生成时间
                this.lastEnemySpawn = timestamp;
                
                // 随着分数增加，减少敌机生成间隔，增加难度
                this.enemySpawnInterval = Math.max(300, 1500 - this.score / 10);
            }
        }
        
        /**
         * 更新所有子弹
         */
        updateBullets() {
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                const bullet = this.bullets[i];
                bullet.update(this.deltaTime);
                bullet.draw();
                
                // 移除超出屏幕的子弹
                if (bullet.y < -bullet.height) {
                    this.bullets.splice(i, 1);
                }
            }
        }
        
        /**
         * 更新所有敌机
         */
        updateEnemies() {
            for (let i = this.enemies.length - 1; i >= 0; i--) {
                const enemy = this.enemies[i];
                enemy.update(this.deltaTime);
                enemy.draw();
                
                // 移除超出屏幕的敌机
                if (enemy.y > this.canvas.height) {
                    this.enemies.splice(i, 1);
                    // 敌机逃脱，扣分
                    this.score = Math.max(0, this.score - 5);
                    this.updateUI();
                }
            }
        }
        
        /**
         * 更新所有粒子效果
         */
        updateParticles() {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const particle = this.particles[i];
                particle.update(this.deltaTime);
                particle.draw();
                
                // 移除生命周期结束的粒子
                if (particle.life <= 0) {
                    this.particles.splice(i, 1);
                }
            }
        }
        
        /**
         * 检测碰撞
         */
        checkCollisions() {
            // 检测子弹与敌机的碰撞
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                const bullet = this.bullets[i];
                
                for (let j = this.enemies.length - 1; j >= 0; j--) {
                    const enemy = this.enemies[j];
                    
                    // 简单的矩形碰撞检测
                    if (bullet.x < enemy.x + enemy.width &&
                        bullet.x + bullet.width > enemy.x &&
                        bullet.y < enemy.y + enemy.height &&
                        bullet.y + bullet.height > enemy.y) {
                        
                        // 创建爆炸效果
                        this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                        
                        // 移除子弹和敌机
                        this.bullets.splice(i, 1);
                        this.enemies.splice(j, 1);
                        
                        // 增加分数
                        this.score += 10;
                        this.updateUI();
                        
                        // 跳出内层循环，因为当前子弹已被移除
                        break;
                    }
                }
            }
            
            // 检测玩家与敌机的碰撞
            if (this.player) {
                for (let i = this.enemies.length - 1; i >= 0; i--) {
                    const enemy = this.enemies[i];
                    
                    // 简单的矩形碰撞检测
                    if (this.player.x < enemy.x + enemy.width &&
                        this.player.x + this.player.width > enemy.x &&
                        this.player.y < enemy.y + enemy.height &&
                        this.player.y + this.player.height > enemy.y) {
                        
                        // 创建爆炸效果
                        this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                        
                        // 移除敌机
                        this.enemies.splice(i, 1);
                        
                        // 减少生命值
                        this.lives--;
                        this.updateUI();
                        
                        // 检查游戏是否结束
                        if (this.lives <= 0) {
                            // 创建玩家爆炸效果
                            this.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, true);
                            this.gameOver();
                        }
                    }
                }
            }
        }
        
        /**
         * 创建爆炸效果
         * @param {number} x - 爆炸中心x坐标
         * @param {number} y - 爆炸中心y坐标
         * @param {boolean} isPlayer - 是否是玩家爆炸
         */
        createExplosion(x, y, isPlayer = false) {
            const particleCount = isPlayer ? 50 : 20;
            const colors = isPlayer ? ['#ff0000', '#ff5500', '#ffaa00', '#ffffff'] : ['#ffaa00', '#ff5500', '#ff0000', '#ffffff'];
            
            for (let i = 0; i < particleCount; i++) {
                const particle = new Particle(
                    this,
                    x,
                    y,
                    colors[Math.floor(Math.random() * colors.length)],
                    isPlayer ? 1000 : 500
                );
                this.particles.push(particle);
            }
        }
    }
    
    /**
     * 玩家飞机类
     */
    class Player {
        /**
         * 玩家飞机构造函数
         * @param {Game} game - 游戏实例
         */
        constructor(game) {
            this.game = game;
            this.width = 40;
            this.height = 50;
            this.x = game.canvas.width / 2 - this.width / 2;
            this.y = game.canvas.height - this.height - 20;
            this.speed = 0.3; // 移动速度系数
            this.targetX = this.x;
            this.targetY = this.y;
            this.lastShootTime = 0;
            this.shootInterval = 300; // 射击间隔(毫秒)
        }
        
        /**
         * 更新玩家状态
         * @param {number} deltaTime - 帧间隔时间
         */
        update(deltaTime) {
            // 平滑移动到目标位置
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            this.x += dx * this.speed * (deltaTime / 16);
            this.y += dy * this.speed * (deltaTime / 16);
            
            // 确保玩家不会移出屏幕
            this.x = Math.max(0, Math.min(this.game.canvas.width - this.width, this.x));
            this.y = Math.max(0, Math.min(this.game.canvas.height - this.height, this.y));
        }
        
        /**
         * 绘制玩家飞机
         */
        draw() {
            const ctx = this.game.ctx;
            
            // 绘制飞机主体
            ctx.fillStyle = '#0066cc';
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.closePath();
            ctx.fill();
            
            // 绘制飞机座舱
            ctx.fillStyle = '#00aaff';
            ctx.beginPath();
            ctx.ellipse(
                this.x + this.width / 2,
                this.y + this.height / 3,
                this.width / 4,
                this.height / 6,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // 绘制引擎火焰
            ctx.fillStyle = '#ff5500';
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2 - 10, this.y + this.height);
            ctx.lineTo(this.x + this.width / 2, this.y + this.height + 15);
            ctx.lineTo(this.x + this.width / 2 + 10, this.y + this.height);
            ctx.closePath();
            ctx.fill();
        }
        
        /**
         * 移动到指定位置
         * @param {number} x - 目标x坐标
         * @param {number} y - 目标y坐标
         */
        moveTo(x, y) {
            this.targetX = x - this.width / 2;
            this.targetY = y - this.height / 2;
        }
        
        /**
         * 发射子弹
         */
        shoot() {
            const now = performance.now();
            if (now - this.lastShootTime > this.shootInterval) {
                // 创建新子弹
                const bullet = new Bullet(
                    this.game,
                    this.x + this.width / 2 - 2.5,
                    this.y
                );
                this.game.bullets.push(bullet);
                
                // 更新射击时间
                this.lastShootTime = now;
            }
        }
    }
    
    /**
     * 子弹类
     */
    class Bullet {
        /**
         * 子弹构造函数
         * @param {Game} game - 游戏实例
         * @param {number} x - 子弹x坐标
         * @param {number} y - 子弹y坐标
         */
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 5;
            this.height = 15;
            this.speed = 0.7; // 子弹速度系数
        }
        
        /**
         * 更新子弹状态
         * @param {number} deltaTime - 帧间隔时间
         */
        update(deltaTime) {
            this.y -= this.speed * deltaTime;
        }
        
        /**
         * 绘制子弹
         */
        draw() {
            const ctx = this.game.ctx;
            
            // 绘制子弹主体
            ctx.fillStyle = '#00ffff';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // 绘制子弹光晕
            ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.ellipse(
                this.x + this.width / 2,
                this.y + this.height / 2,
                this.width * 2,
                this.height,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }
    
    /**
     * 敌机类
     */
    class Enemy {
        /**
         * 敌机构造函数
         * @param {Game} game - 游戏实例
         */
        constructor(game) {
            this.game = game;
            this.width = 30 + Math.random() * 20; // 随机宽度
            this.height = this.width * 1.2;
            this.x = Math.random() * (game.canvas.width - this.width);
            this.y = -this.height;
            this.speed = 0.1 + Math.random() * 0.2; // 随机速度
            this.color = `hsl(${Math.random() * 360}, 70%, 50%)`; // 随机颜色
        }
        
        /**
         * 更新敌机状态
         * @param {number} deltaTime - 帧间隔时间
         */
        update(deltaTime) {
            this.y += this.speed * deltaTime;
            
            // 左右小幅度摆动
            this.x += Math.sin(this.y * 0.01) * 0.5;
        }
        
        /**
         * 绘制敌机
         */
        draw() {
            const ctx = this.game.ctx;
            
            // 绘制敌机主体
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y + this.height);
            ctx.lineTo(this.x, this.y);
            ctx.lineTo(this.x + this.width, this.y);
            ctx.closePath();
            ctx.fill();
            
            // 绘制敌机座舱
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.ellipse(
                this.x + this.width / 2,
                this.y + this.height / 3,
                this.width / 5,
                this.height / 8,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }
    
    /**
     * 粒子效果类
     */
    class Particle {
        /**
         * 粒子构造函数
         * @param {Game} game - 游戏实例
         * @param {number} x - 粒子x坐标
         * @param {number} y - 粒子y坐标
         * @param {string} color - 粒子颜色
         * @param {number} maxLife - 粒子最大生命周期
         */
        constructor(game, x, y, color, maxLife) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.size = 1 + Math.random() * 3;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = color;
            this.maxLife = maxLife;
            this.life = maxLife;
        }
        
        /**
         * 更新粒子状态
         * @param {number} deltaTime - 帧间隔时间
         */
        update(deltaTime) {
            this.x += this.speedX * deltaTime;
            this.y += this.speedY * deltaTime;
            this.life -= deltaTime;
        }
        
        /**
         * 绘制粒子
         */
        draw() {
            const ctx = this.game.ctx;
            const alpha = this.life / this.maxLife;
            
            ctx.fillStyle = this.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    // 创建并初始化游戏实例
    const game = new Game();
});