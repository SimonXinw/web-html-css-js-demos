// 主游戏类
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.state = 'menu'; // menu, playing, paused, gameOver
        this.difficulty = 'medium';
        this.score = 0;
        this.coins = 1000;
        this.lastTime = 0;
        
        // 游戏对象
        this.fishManager = null;
        this.cannon = null;
        this.projectileManager = null;
        this.uiManager = null;
        
        // 输入处理
        this.mouse = { x: 0, y: 0, isDown: false };
        this.touch = { x: 0, y: 0, isActive: false };
        
        // 初始化
        this.initializeCanvas();
        this.initializeUI();
        this.initializeGameObjects();
        this.bindEvents();
        
        // 开始游戏循环
        this.gameLoop();
    }

    initializeCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // 更新配置中的画布尺寸
        GameConfig.CANVAS_WIDTH = this.canvas.width;
        GameConfig.CANVAS_HEIGHT = this.canvas.height;
        
        // 更新炮台位置
        if (this.cannon) {
            this.cannon.setPosition(
                this.canvas.width / 2,
                this.canvas.height - 80
            );
        }
    }

    initializeUI() {
        this.uiManager = new UIManager();
        
        // 重写UI事件处理函数
        this.uiManager.onDifficultySelect = (difficulty) => this.startGame(difficulty);
        this.uiManager.onPauseClick = () => this.pauseGame();
        this.uiManager.onAddMoneyClick = () => this.addMoney();
        this.uiManager.onResumeClick = () => this.resumeGame();
        this.uiManager.onRestartClick = () => this.restartGame();
        this.uiManager.onBackToMenuClick = () => this.backToMenu();
        this.uiManager.onPlayAgainClick = () => this.restartGame();
        this.uiManager.onCannonLevelSelect = (level) => this.changeCannonLevel(level);
    }

    initializeGameObjects() {
        // 初始化炮台
        this.cannon = new Cannon(
            this.canvas.width / 2,
            this.canvas.height - 80
        );
        
        // 初始化弹药管理器
        this.projectileManager = new ProjectileManager();
        
        // 初始化鱼群管理器
        this.fishManager = new FishManager(this.difficulty);
    }

    bindEvents() {
        // 鼠标事件
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        // 触摸事件
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // 防止右键菜单
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // 键盘事件
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    // 游戏控制方法
    startGame(difficulty = 'medium') {
        this.difficulty = difficulty;
        this.state = 'playing';
        this.score = 0;
        this.coins = 1000;
        
        // 重置游戏对象
        this.cannon.reset();
        this.projectileManager.clear();
        this.fishManager.setDifficulty(difficulty);
        this.fishManager.clear();
        
        // 更新UI
        this.uiManager.showScreen('game');
        this.uiManager.updateCoins(this.coins);
        this.uiManager.updateCannonLevel(1);
        this.uiManager.updateCannonButtonAvailability(this.coins, GameConfig.CANNON.levels);
        
        this.uiManager.showMessage(`开始${this.getDifficultyName(difficulty)}模式！`, 'info');
    }

    pauseGame() {
        if (this.state === 'playing') {
            this.state = 'paused';
            this.uiManager.showScreen('pause');
        }
    }

    resumeGame() {
        if (this.state === 'paused') {
            this.state = 'playing';
            this.uiManager.showScreen('game');
        }
    }

    restartGame() {
        this.startGame(this.difficulty);
    }

    backToMenu() {
        this.state = 'menu';
        this.uiManager.showScreen('start');
        this.uiManager.cleanup();
    }

    gameOver() {
        this.state = 'gameOver';
        this.uiManager.updateFinalScore(this.score);
        this.uiManager.showScreen('gameOver');
    }

    // 游戏逻辑方法
    addMoney() {
        this.coins += 1000;
        this.uiManager.updateCoins(this.coins);
        this.uiManager.updateCannonButtonAvailability(this.coins, GameConfig.CANNON.levels);
        this.uiManager.showMessage('获得1000金币！', 'success');
    }

    changeCannonLevel(level) {
        const config = GameConfig.CANNON.levels[level - 1];
        if (this.coins >= config.cost) {
            this.cannon.upgradeLevel(level);
            this.uiManager.updateCannonLevel(level);
            this.uiManager.showMessage(`切换到${level}级炮弹！`, 'info');
        } else {
            this.uiManager.showMessage('金币不足！', 'error');
        }
    }

    shoot(targetX, targetY) {
        if (this.state !== 'playing') return;
        
        const cost = this.cannon.getShotCost();
        if (this.coins >= cost && this.cannon.canShootNow()) {
            if (this.cannon.shoot(this.projectileManager)) {
                this.coins -= cost;
                this.uiManager.updateCoins(this.coins);
                this.uiManager.updateCannonButtonAvailability(this.coins, GameConfig.CANNON.levels);
                
                // 创建点击涟漪效果
                Utils.createRipple(targetX, targetY, this.canvas.parentElement);
            }
        } else if (this.coins < cost) {
            this.uiManager.showMessage('金币不足！', 'error');
        }
    }

    // 输入处理
    handleMouseDown(e) {
        this.mouse.isDown = true;
        this.updateMousePosition(e);
        this.handleAimStart(this.mouse.x, this.mouse.y);
    }

    handleMouseMove(e) {
        this.updateMousePosition(e);
        if (this.mouse.isDown) {
            this.handleAiming(this.mouse.x, this.mouse.y);
        }
    }

    handleMouseUp(e) {
        this.mouse.isDown = false;
        this.updateMousePosition(e);
        this.handleShoot(this.mouse.x, this.mouse.y);
    }

    handleTouchStart(e) {
        e.preventDefault();
        this.touch.isActive = true;
        this.updateTouchPosition(e);
        this.handleAimStart(this.touch.x, this.touch.y);
    }

    handleTouchMove(e) {
        e.preventDefault();
        this.updateTouchPosition(e);
        if (this.touch.isActive) {
            this.handleAiming(this.touch.x, this.touch.y);
        }
    }

    handleTouchEnd(e) {
        e.preventDefault();
        this.touch.isActive = false;
        this.handleShoot(this.touch.x, this.touch.y);
    }

    handleKeyDown(e) {
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                if (this.state === 'playing') {
                    this.pauseGame();
                } else if (this.state === 'paused') {
                    this.resumeGame();
                }
                break;
            case 'Escape':
                if (this.state === 'playing' || this.state === 'paused') {
                    this.backToMenu();
                }
                break;
        }
    }

    updateMousePosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    updateTouchPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.touch.x = touch.clientX - rect.left;
        this.touch.y = touch.clientY - rect.top;
    }

    handleAimStart(x, y) {
        if (this.state === 'playing') {
            this.cannon.aimAt(x, y);
        }
    }

    handleAiming(x, y) {
        if (this.state === 'playing') {
            this.cannon.aimAt(x, y);
        }
    }

    handleShoot(x, y) {
        if (this.state === 'playing') {
            this.shoot(x, y);
            this.cannon.hideAimLine();
        }
    }

    // 游戏更新
    update(deltaTime) {
        if (this.state !== 'playing') return;

        // 更新游戏对象
        this.cannon.update(deltaTime);
        this.fishManager.update(deltaTime, this.canvas.width, this.canvas.height);
        this.projectileManager.update(deltaTime, this.canvas.width, this.canvas.height);

        // 检查捕获
        const caughtFish = this.projectileManager.checkNetCaptures(this.fishManager);
        if (caughtFish.length > 0) {
            this.handleFishCaught(caughtFish);
        }

        // 检查游戏结束条件
        if (this.coins <= 0 && this.projectileManager.getActiveBulletsCount() === 0) {
            this.gameOver();
        }
    }

    handleFishCaught(caughtFish) {
        let totalScore = 0;
        caughtFish.forEach(fish => {
            totalScore += fish.score;
            
            // 显示得分弹出
            this.uiManager.showScorePopup(
                fish.x, fish.y, fish.score,
                this.canvas.parentElement
            );
        });

        // 更新分数和金币
        this.score += totalScore;
        this.coins += totalScore;
        
        this.uiManager.updateCoins(this.coins);
        this.uiManager.updateCannonButtonAvailability(this.coins, GameConfig.CANNON.levels);
        
        if (caughtFish.length > 1) {
            this.uiManager.showMessage(`连击！获得${totalScore}分！`, 'success');
        }
    }

    // 渲染
    render() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.state === 'playing' || this.state === 'paused') {
            // 绘制海洋背景
            this.drawOceanBackground();
            
            // 绘制游戏对象
            this.fishManager.draw(this.ctx);
            this.projectileManager.draw(this.ctx);
            this.cannon.draw(this.ctx);
            
            // 如果暂停，添加暂停覆盖层
            if (this.state === 'paused') {
                this.drawPausedOverlay();
            }
        }
    }

    drawOceanBackground() {
        // 绘制海洋渐变背景
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.5, '#4682B4');
        gradient.addColorStop(1, '#191970');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制海底沙地
        const sandGradient = this.ctx.createLinearGradient(0, this.canvas.height - 100, 0, this.canvas.height);
        sandGradient.addColorStop(0, 'rgba(238, 203, 173, 0.3)');
        sandGradient.addColorStop(1, 'rgba(238, 203, 173, 0.8)');
        
        this.ctx.fillStyle = sandGradient;
        this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);
    }

    drawPausedOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏暂停', this.canvas.width / 2, this.canvas.height / 2);
    }

    // 游戏循环
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    // 工具方法
    getDifficultyName(difficulty) {
        const names = {
            easy: '简单',
            medium: '中等',
            hard: '困难'
        };
        return names[difficulty] || '中等';
    }
} 