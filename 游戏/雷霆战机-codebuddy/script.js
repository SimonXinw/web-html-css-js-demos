/**
 * 雷霆战机游戏
 * 面向对象实现的打飞机游戏
 */

// 等待DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 游戏主类
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
            this.finalScoreElement = document.getElementById('finalScore');
            this.gameStartElement = document.getElementById('gameStart');
            this.gameOverElement = document.getElementById('gameOver');
            this.startButton = document.getElementById('startButton');
            this.restartButton = document.getElementById('restartButton');
            
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
            this.explosions = [];
            
            // 游戏参数
            this.enemySpawnRate = 1500; // 敌机生成间隔(毫秒)
            this.lastEnemySpawn = 0;    // 上次生成敌机的时间
            this.lastFrameTime = 0;     // 上一帧的时间
            
            // 绑定事件处理
            this.bindEvents();
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
                if (this.player) {
                    this.player.handleKeyDown(e);
                }
            });
            
            window.addEventListener('keyup', (e) => {
                if (this.player) {
                    this.player.handleKeyUp(e);
                }
            });
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
            this.score = 0;
            this.lives = 3;
            this.enemies = [];
            this.bullets = [];
            this.explosions = [];
            
            // 更新UI
            this.scoreElement.textContent = this.score;
            this.livesElement.textContent = this.lives;
            
            // 创建玩家飞机
            this.player = new Player(
                this.canvas.width / 2 - 25,
                this.canvas.height - 100,
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
         * 游戏结束
         */
        gameOver() {
            this.isRunning = false;
            this.finalScoreElement.textContent = this.score;
            this.gameOverElement.style.display = 'flex';
        }
        
        /**
         * 游戏主循环
         * @param {number} currentTime - 当前时间戳
         */
        gameLoop(currentTime) {
            // 计算帧间隔时间
            const deltaTime = currentTime - this.lastFrameTime;
            this.lastFrameTime = currentTime;
            
            // 清空画布
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            if (this.isRunning) {
                // 更新和绘制游戏对象
                this.update(deltaTime);
                this.render();
                
                // 继续游戏循环
                requestAnimationFrame(this.gameLoop.bind(this));
            }
        }
        
        /**
         * 更新游戏状态
         * @param {number} deltaTime - 帧间隔时间
         */
        update(deltaTime) {
            // 生成敌机
            const currentTime = performance.now();
            if (currentTime - this.lastEnemySpawn > this.enemySpawnRate) {
                this.spawnEnemy();
                this.lastEnemySpawn = currentTime;
                
                // 随着游戏进行，逐渐增加难度
                this.enemySpawnRate = Math.max(500, this.enemySpawnRate - 10);
            }
            
            // 更新玩家
            if (this.player) {
                this.player.update(deltaTime);
            }
            
            // 更新子弹
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                this.bullets[i].update(deltaTime);
                
                // 移除超出屏幕的子弹
                if (this.bullets[i].y < -this.bullets[i].height) {
                    this.bullets.splice(i, 1);
                }
            }
            
            // 更新敌机
            for (let i = this.enemies.length - 1; i >= 0; i--) {
                this.enemies[i].update(deltaTime);
                
                // 移除超出屏幕的敌机
                if (this.enemies[i].y > this.canvas.height) {
                    this.enemies.splice(i, 1);
                    continue;
                }
                
                // 检测敌机与玩家碰撞
                if (this.player && this.checkCollision(this.enemies[i], this.player)) {
                    this.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
                    this.lives--;
                    this.livesElement.textContent = this.lives;
                    this.enemies.splice(i, 1);
                    
                    if (this.lives <= 0) {
                        this.gameOver();
                    }
                    continue;
                }
                
                // 检测敌机与子弹碰撞
                for (let j = this.bullets.length - 1; j >= 0; j--) {
                    if (this.checkCollision(this.enemies[i], this.bullets[j])) {
                        this.createExplosion(this.enemies[i].x + this.enemies[i].width / 2, this.enemies[i].y + this.enemies[i].height / 2);
                        this.score += 10;
                        this.scoreElement.textContent = this.score;
                        this.enemies.splice(i, 1);
                        this.bullets.splice(j, 1);
                        break;
                    }
                }
            }
            
            // 更新爆炸效果
            for (let i = this.explosions.length - 1; i >= 0; i--) {
                this.explosions[i].update(deltaTime);
                if (this.explosions[i].isFinished) {
                    this.explosions.splice(i, 1);
                }
            }
        }
        
        /**
         * 渲染游戏画面
         */
        render() {
            // 绘制背景
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // 绘制玩家
            if (this.player) {
                this.player.render(this.ctx);
            }
            
            // 绘制子弹
            this.bullets.forEach(bullet => {
                bullet.render(this.ctx);
            });
            
            // 绘制敌机
            this.enemies.forEach(enemy => {
                enemy.render(this.ctx);
            });
            
            // 绘制爆炸效果
            this.explosions.forEach(explosion => {
                explosion.render(this.ctx);
            });
        }
        
        /**
         * 生成敌机
         */
        spawnEnemy() {
            const x = Math.random() * (this.canvas.width - 40);
            const enemy = new Enemy(x, -50, this);
            this.enemies.push(enemy);
        }
        
        /**
         * 创建爆炸效果
         * @param {number} x - 爆炸中心x坐标
         * @param {number} y - 爆炸中心y坐标
         */
        createExplosion(x, y) {
            const explosion = new Explosion(x, y);
            this.explosions.push(explosion);
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
    
    /**
     * 玩家飞机类
     */
    class Player {
        /**
         * 玩家飞机构造函数
         * @param {number} x - 初始x坐标
         * @param {number} y - 初始y坐标
         * @param {Game} game - 游戏实例
         */
        constructor(x, y, game) {
            this.x = x;
            this.y = y;
            this.width = 50;
            this.height = 50;
            this.speed = 5;
            this.game = game;
            
            // 移动方向控制
            this.movingLeft = false;
            this.movingRight = false;
            this.movingUp = false;
            this.movingDown = false;
            
            // 射击控制
            this.isShooting = false;
            this.shootCooldown = 200; // 射击冷却时间(毫秒)
            this.lastShootTime = 0;   // 上次射击时间
            
            // 飞机颜色
            this.color = '#0096ff';
        }
        
        /**
         * 处理键盘按下事件
         * @param {KeyboardEvent} e - 键盘事件
         */
        handleKeyDown(e) {
            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.movingLeft = true;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.movingRight = true;
                    break;
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.movingUp = true;
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.movingDown = true;
                    break;
                case ' ': // 空格键射击
                    this.isShooting = true;
                    break;
            }
        }
        
        /**
         * 处理键盘释放事件
         * @param {KeyboardEvent} e - 键盘事件
         */
        handleKeyUp(e) {
            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.movingLeft = false;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.movingRight = false;
                    break;
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.movingUp = false;
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.movingDown = false;
                    break;
                case ' ':
                    this.isShooting = false;
                    break;
            }
        }
        
        /**
         * 更新玩家状态
         * @param {number} deltaTime - 帧间隔时间
         */
        update(deltaTime) {
            // 移动控制
            if (this.movingLeft) {
                this.x -= this.speed;
            }
            if (this.movingRight) {
                this.x += this.speed;
            }
            if (this.movingUp) {
                this.y -= this.speed;
            }
            if (this.movingDown) {
                this.y += this.speed;
            }
            
            // 边界限制
            this.x = Math.max(0, Math.min(this.x, this.game.canvas.width - this.width));
            this.y = Math.max(0, Math.min(this.y, this.game.canvas.height - this.height));
            
            // 射击控制
            const currentTime = performance.now();
            if (this.isShooting && currentTime - this.lastShootTime > this.shootCooldown) {
                this.shoot();
                this.lastShootTime = currentTime;
            }
        }
        
        /**
         * 渲染玩家飞机
         * @param {CanvasRenderingContext2D} ctx - 画布上下文
         */
        render(ctx) {
            // 绘制飞机主体
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y); // 飞机头部
            ctx.lineTo(this.x + this.width, this.y + this.height); // 右下角
            ctx.lineTo(this.x, this.y + this.height); // 左下角
            ctx.closePath();
            ctx.fill();
            
            // 绘制飞机引擎
            ctx.fillStyle = '#ff3030';
            ctx.fillRect(this.x + this.width / 2 - 5, this.y + this.height - 10, 10, 15);
        }
        
        /**
         * 发射子弹
         */
        shoot() {
            const bullet = new Bullet(
                this.x + this.width / 2 - 2.5,
                this.y - 10,
                this.game
            );
            this.game.bullets.push(bullet);
        }
    }
    
    /**
     * 子弹类
     */
    class Bullet {
        /**
         * 子弹构造函数
         * @param {number} x - 初始x坐标
         * @param {number} y - 初始y坐标
         * @param {Game} game - 游戏实例
         */
        constructor(x, y, game) {
            this.x = x;
            this.y = y;
            this.width = 5;
            this.height = 15;
            this.speed = 10;
            this.game = game;
            this.color = '#ffff00';
        }
        
        /**
         * 更新子弹状态
         * @param {number} deltaTime - 帧间隔时间
         */
        update(deltaTime) {
            this.y -= this.speed;
        }
        
        /**
         * 渲染子弹
         * @param {CanvasRenderingContext2D} ctx - 画布上下文
         */
        render(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    
    /**
     * 敌机类
     */
    class Enemy {
        /**
         * 敌机构造函数
         * @param {number} x - 初始x坐标
         * @param {number} y - 初始y坐标
         * @param {Game} game - 游戏实例
         */
        constructor(x, y, game) {
            this.x = x;
            this.y = y;
            this.width = 40;
            this.height = 40;
            this.speed = 2 + Math.random() * 2; // 随机速度
            this.game = game;
            this.color = '#ff3030';
        }
        
        /**
         * 更新敌机状态
         * @param {number} deltaTime - 帧间隔时间
         */
        update(deltaTime) {
            this.y += this.speed;
        }
        
        /**
         * 渲染敌机
         * @param {CanvasRenderingContext2D} ctx - 画布上下文
         */
        render(ctx) {
            // 绘制敌机主体
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y + this.height); // 底部中点
            ctx.lineTo(this.x + this.width, this.y); // 右上角
            ctx.lineTo(this.x, this.y); // 左上角
            ctx.closePath();
            ctx.fill();
            
            // 绘制敌机细节
            ctx.fillStyle = '#ff9000';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 8, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    /**
     * 爆炸效果类
     */
    class Explosion {
        /**
         * 爆炸效果构造函数
         * @param {number} x - 爆炸中心x坐标
         * @param {number} y - 爆炸中心y坐标
         */
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = 5;
            this.maxRadius = 30;
            this.expandSpeed = 1;
            this.opacity = 1;
            this.isFinished = false;
        }
        
        /**
         * 更新爆炸效果状态
         * @param {number} deltaTime - 帧间隔时间
         */
        update(deltaTime) {
            this.radius += this.expandSpeed;
            this.opacity -= 0.03;
            
            if (this.radius >= this.maxRadius || this.opacity <= 0) {
                this.isFinished = true;
            }
        }
        
        /**
         * 渲染爆炸效果
         * @param {CanvasRenderingContext2D} ctx - 画布上下文
         */
        render(ctx) {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            
            // 绘制爆炸外圈
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 100, 0, 0.5)';
            ctx.fill();
            
            // 绘制爆炸内圈
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 200, 0, 0.8)';
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    // 创建并启动游戏
    const game = new Game();
    
    // 修复游戏循环中的错误
    const originalGameLoop = game.gameLoop;
    game.gameLoop = function(currentTime) {
        // 计算帧间隔时间
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.isRunning) {
            // 生成敌机
            if (currentTime - this.lastEnemySpawn > this.enemySpawnRate) {
                this.spawnEnemy();
                this.lastEnemySpawn = currentTime;
                
                // 随着游戏进行，逐渐增加难度
                this.enemySpawnRate = Math.max(500, this.enemySpawnRate - 10);
            }
            
            // 更新和绘制游戏对象
            this.update(deltaTime);
            this.render();
            
            // 继续游戏循环
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    };
});