/**
 * 成语连连看游戏主入口文件
 * 负责初始化游戏和启动
 */

// 等待DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，开始初始化游戏');
    
    // 检查关键DOM元素是否存在
    const requiredElements = [
        'gameStart', 'gameOver', 'levelComplete', 'mahjongArea', 
        'startButton', 'restartButton', 'nextLevelButton', 'continueButton'
    ];
    
    let missingElements = [];
    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            missingElements.push(id);
        }
    });
    
    if (missingElements.length > 0) {
        console.error('缺少必要的DOM元素:', missingElements);
        alert('游戏初始化失败，缺少必要的页面元素');
        return;
    }
    
    console.log('所有必要的DOM元素都存在，创建游戏实例');
    
    // 创建游戏实例
    const game = new IdiomGame();
    
    // 添加页面加载动画
    document.body.classList.add('fade-in');
    
    // 增强的移动端和Safari兼容性处理
    function initMobileSupport() {
        // 检测是否为移动设备
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        if (isMobile || 'ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            // iOS Safari特殊处理
            if (isIOS) {
                document.body.classList.add('ios-device');
                
                // 防止iOS Safari的橡皮筋效果
                document.addEventListener('touchmove', (e) => {
                    if (e.target.closest('.mahjong-area')) {
                        e.preventDefault();
                    }
                }, { passive: false });
                
                // 防止iOS Safari双击缩放
                let lastTouchTime = 0;
                document.addEventListener('touchend', (e) => {
                    const currentTime = new Date().getTime();
                    const tapLength = currentTime - lastTouchTime;
                    if (tapLength < 500 && tapLength > 0) {
                        e.preventDefault();
                    }
                    lastTouchTime = currentTime;
                });
            }
            
            // Safari特殊处理
            if (isSafari) {
                document.body.classList.add('safari-browser');
                
                // Safari内存管理优化
                const optimizeSafariPerformance = () => {
                    // 强制垃圾回收（Safari特有）
                    if (window.gc && typeof window.gc === 'function') {
                        window.gc();
                    }
                };
                
                // 每30秒执行一次内存优化
                setInterval(optimizeSafariPerformance, 30000);
            }
            
            // 增强的触摸事件处理
            let touchTimeout;
            
            document.addEventListener('touchstart', (e) => {
                const target = e.target;
                
                if (target.classList.contains('mahjong-tile')) {
                    // 防止默认行为
                    e.preventDefault();
                    
                    // 添加触摸反馈
                    target.classList.add('touch-active');
                    
                    // 触觉反馈（支持的设备）
                    if (navigator.vibrate) {
                        navigator.vibrate(50); // 轻微震动50ms
                    }
                    
                    // 清除之前的超时
                    if (touchTimeout) {
                        clearTimeout(touchTimeout);
                    }
                    
                    // 设置超时移除触摸状态
                    touchTimeout = setTimeout(() => {
                        target.classList.remove('touch-active');
                    }, 300);
                }
            }, { passive: false });
            
            document.addEventListener('touchend', (e) => {
                const target = e.target;
                
                if (target.classList.contains('mahjong-tile')) {
                    // 延迟移除触摸状态以显示反馈
                    setTimeout(() => {
                        target.classList.remove('touch-active');
                    }, 150);
                }
            });
            
            document.addEventListener('touchcancel', (e) => {
                // 处理触摸取消事件
                const target = e.target;
                if (target.classList.contains('mahjong-tile')) {
                    target.classList.remove('touch-active');
                }
            });
            
            // 防止意外的触摸滚动
            document.addEventListener('touchmove', (e) => {
                // 只在麻将牌区域防止滚动
                if (e.target.classList.contains('mahjong-tile') || 
                    e.target.closest('.mahjong-area')) {
                    e.preventDefault();
                }
            }, { passive: false });
            
        }
        
        console.log('移动端支持初始化完成', {
            isMobile,
            isSafari,
            isIOS,
            touchSupport: 'ontouchstart' in window
        });
    }
    
    // 初始化移动端支持
    initMobileSupport();
    
    // 添加键盘快捷键支持
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'Enter':
                // 回车键开始游戏或继续
                if (game.gameStart.style.display !== 'none') {
                    game.startGame();
                } else if (game.levelComplete.style.display !== 'none') {
                    game.continueGame();
                } else if (game.gameOver.style.display !== 'none') {
                    game.restartGame();
                }
                break;
            case ' ':
                // 空格键暂停/继续
                if (game.isGameRunning) {
                    game.pauseGame();
                }
                e.preventDefault();
                break;
            case 'r':
            case 'R':
                // R键重新开始
                if (game.isGameRunning) {
                    game.restartGame();
                }
                break;
        }
    });
    
    // 添加窗口失焦时自动暂停
    window.addEventListener('blur', () => {
        if (game.isGameRunning && !game.isPaused) {
            game.pauseGame();
        }
    });
    
    // 添加窗口大小变化处理
    window.addEventListener('resize', () => {
        // 延迟执行以确保布局稳定
        setTimeout(() => {
            adjustGameLayout();
        }, 100);
    });
    
    // 调整游戏布局以适应不同屏幕尺寸
    function adjustGameLayout() {
        const container = document.querySelector('.game-container');
        const mahjongArea = document.getElementById('mahjongArea');
        
        if (window.innerWidth <= 768) {
            // 移动端布局调整
            container.style.padding = '5px';
            mahjongArea.style.gridTemplateColumns = 'repeat(6, 1fr)';
            mahjongArea.style.gridTemplateRows = 'repeat(8, 1fr)';
        } else {
            // 桌面端布局
            container.style.padding = '10px';
            mahjongArea.style.gridTemplateColumns = 'repeat(8, 1fr)';
            mahjongArea.style.gridTemplateRows = 'repeat(6, 1fr)';
        }
    }
    
    // 初始布局调整
    adjustGameLayout();
    
    // 添加性能监控
    let frameCount = 0;
    let lastTime = performance.now();
    
    function performanceMonitor() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // 如果帧率过低，可以进行优化
            if (fps < 30) {
                console.warn('游戏帧率较低:', fps, 'FPS');
                // 可以在这里添加性能优化逻辑
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(performanceMonitor);
    }
    
    // 启动性能监控
    performanceMonitor();
    
    // 添加错误处理
    window.addEventListener('error', (e) => {
        console.error('游戏运行错误:', e.error);
        
        // 显示用户友好的错误信息
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            text-align: center;
            font-size: 16px;
        `;
        errorDiv.innerHTML = `
            <h3>游戏出现错误</h3>
            <p>请刷新页面重新开始游戏</p>
            <button onclick="location.reload()" style="
                margin-top: 10px;
                padding: 8px 16px;
                background: white;
                color: red;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            ">刷新页面</button>
        `;
        
        document.body.appendChild(errorDiv);
        
        // 5秒后自动移除错误提示
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 5000);
    });
    
    // 添加游戏统计功能
    const gameStats = {
        gamesPlayed: 0,
        totalScore: 0,
        bestScore: 0,
        totalTime: 0,
        levelsCompleted: 0
    };
    
    // 从本地存储加载统计数据
    function loadStats() {
        const saved = localStorage.getItem('idiomGameStats');
        if (saved) {
            Object.assign(gameStats, JSON.parse(saved));
        }
    }
    
    // 保存统计数据到本地存储
    function saveStats() {
        localStorage.setItem('idiomGameStats', JSON.stringify(gameStats));
    }
    
    // 更新统计数据
    function updateStats(score, level, time) {
        gameStats.gamesPlayed++;
        gameStats.totalScore += score;
        gameStats.bestScore = Math.max(gameStats.bestScore, score);
        gameStats.totalTime += time;
        gameStats.levelsCompleted = Math.max(gameStats.levelsCompleted, level);
        saveStats();
    }
    
    // 加载统计数据
    loadStats();
    
    // 扩展游戏对象以支持统计
    const originalGameOverHandler = game.gameOverHandler;
    if (originalGameOverHandler) {
        game.gameOverHandler = function() {
            updateStats(this.score, this.currentLevel, this.levelTimeLimit - this.timeLeft);
            originalGameOverHandler.call(this);
        };
    }
    
    const originalGameWin = game.gameWin;
    if (originalGameWin) {
        game.gameWin = function() {
            updateStats(this.score, this.currentLevel - 1, this.levelTimeLimit - this.timeLeft);
            originalGameWin.call(this);
        };
    }
    
    // 添加调试模式（开发时使用）
    if (window.location.search.includes('debug=true')) {
        console.log('调试模式已启用');
        
        // 添加调试信息显示
        const debugInfo = document.createElement('div');
        debugInfo.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 1000;
        `;
        document.body.appendChild(debugInfo);
        
        // 更新调试信息
        setInterval(() => {
            debugInfo.innerHTML = `
                <div>关卡: ${game.currentLevel}</div>
                <div>成语: ${game.currentIdiomIndex + 1}/${game.currentIdioms.length}</div>
                <div>分数: ${game.score}</div>
                <div>时间: ${game.timeLeft}</div>
                <div>已用牌: ${game.usedTileIndices.size}</div>
            `;
        }, 100);
        
        // 添加调试快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch (e.key) {
                    case '1':
                        // Ctrl+1: 跳过当前成语
                        if (game.isGameRunning) {
                            game.completeCurrentIdiom();
                        }
                        break;
                    case '2':
                        // Ctrl+2: 增加时间
                        if (game.isGameRunning) {
                            game.timeLeft += 30;
                            game.updateUI();
                        }
                        break;
                    case '3':
                        // Ctrl+3: 增加分数
                        if (game.isGameRunning) {
                            game.score += 1000;
                            game.updateUI();
                        }
                        break;
                }
            }
        });
    }
    
    console.log('🀄 成语连连看游戏已初始化完成！');
    console.log('📖 游戏包含', getTotalLevels(), '个关卡');
    console.log('🎮 操作说明：');
    console.log('- 点击麻将牌选择汉字');
    console.log('- 按顺序完成成语');
    console.log('- 回车键：开始/继续游戏');
    console.log('- 空格键：暂停/继续游戏');
    console.log('- R键：重新开始游戏');
    console.log('- ESC键：暂停游戏');
    
    // 显示统计信息
    if (gameStats.gamesPlayed > 0) {
        console.log('📊 游戏统计：');
        console.log('- 游戏次数：', gameStats.gamesPlayed);
        console.log('- 最高分数：', gameStats.bestScore);
        console.log('- 最高关卡：', gameStats.levelsCompleted);
    }
});

// 添加全局工具函数
window.IdiomGameUtils = {
    // 获取游戏统计
    getStats: () => {
        const saved = localStorage.getItem('idiomGameStats');
        return saved ? JSON.parse(saved) : null;
    },
    
    // 清除游戏统计
    clearStats: () => {
        localStorage.removeItem('idiomGameStats');
        console.log('游戏统计已清除');
    },
    
    // 导出游戏数据
    exportData: () => {
        const data = {
            stats: localStorage.getItem('idiomGameStats'),
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'idiom-game-data.json';
        a.click();
        
        URL.revokeObjectURL(url);
    }
};