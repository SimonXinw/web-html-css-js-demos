/**
 * 游戏主类
 * 管理游戏的主要逻辑和状态
 */
class Game {
    /**
     * 游戏构造函数
     */
    constructor() {
        // 获取DOM元素
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.startScreen = document.querySelector('.game-start');
        this.pauseScreen = document.querySelector('.game-pause');
        this.gameOverScreen = document.querySelector('.game-over');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.weaponLevelElement = document.getElementById('weapon-level');
        this.finalScoreElement = document.getElementById('final-score');
        this.enemiesDestroyedElement = document.getElementById('enemies-destroyed');
        this.maxWeaponLevelElement = document.getElementById('max-weapon-level');
        this.startBtn = document.getElementById('start-btn');
        this.resumeBtn = document.getElementById('resume-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.restartBtnPause = document.getElementById('restart-btn-pause');
        
        // 设置画布尺寸
        this.canvas.width = 400;
        this.canvas.height = 600;
        
        // 游戏状态
        this.isRunning = false;
        this.isPaused = false;
        this.score = 0;
        this.lives = 3;
        this.enemiesDestroyed = 0;
        
        // 游戏对象
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.particles = [];
        this.powerUps = [];
        
        // 游戏计时器和难度控制
        this.lastEnemySpawn = 0;
        this.enemySpawnInterval = 1500; // 敌机生成间隔(毫秒)
        this.lastFrameTime = 0;
        this.deltaTime = 0;
        this.gameTime = 0; // 游戏运行时间
        
        // 游戏资源
        this.assets = null;
        this.assetsLoaded = false;
        
        // 背景滚动
        this.backgroundY = 0;
        this.backgroundSpeed = 0.05;
        
        // 绑定事件处理方法
        this.bindEvents();
        
        // 加载游戏资源
        this.loadAssets();
    }
    
    /**
     * 加载游戏资源
     */
    loadAssets() {
        // 创建资源对象
        this.assets = createGameAssets();
        
        // 获取所有资源路径
        const assetPaths = getAllAssetPaths(this.assets);
        
        // 显示加载进度
        this.startBtn.textContent = '加载中...';
        this.startBtn.disabled = true;
        
        // 预加载所有图片
        preloadImages(assetPaths, progress => {
            this.startBtn.textContent = `加载中... ${Math.floor(progress * 100)}%`;
        }).then(images => {
            // 所有图片加载完成
            this.assetsLoaded = true;
            this.startBtn.textContent = '开始游戏';
            this.startBtn.disabled = false;
            
            // 设置资源引用
            let imageIndex = 0;
            
            // 设置玩家飞机图片
            this.assets.player.level1 = images[imageIndex++];
            this.assets.player.level2 = images[imageIndex++];
            this.assets.player.level3 = images[imageIndex++];
            
            // 设置敌机图片
            this.assets.enemy.small = images[imageIndex++];
            this.assets.enemy.medium = images[imageIndex++];
            this.assets.enemy.large = images[imageIndex++];
            
            // 设置子弹图片
            this.assets.bullet.level1 = images[imageIndex++];
            this.assets.bullet.level2 = images[imageIndex++];
            this.assets.bullet.level3