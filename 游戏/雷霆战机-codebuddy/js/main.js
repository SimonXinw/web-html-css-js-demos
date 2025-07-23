/**
 * 雷霆战机游戏主入口文件
 * 负责初始化游戏和协调各个模块
 */

// 等待DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 创建并启动游戏
    const game = new Game();
    
    // 添加效果文字数组到游戏对象
    game.effectTexts = [];
    
    // 扩展游戏更新方法以包含效果文字
    const originalUpdate = game.update;
    game.update = function(deltaTime, currentTime) {
        // 调用原始更新方法
        originalUpdate.call(this, deltaTime, currentTime);
        
        // 更新效果文字
        for (let i = this.effectTexts.length - 1; i >= 0; i--) {
            this.effectTexts[i].update(deltaTime);
            if (this.effectTexts[i].isFinished) {
                this.effectTexts.splice(i, 1);
            }
        }
    };
    
    // 扩展游戏渲染方法以包含效果文字
    const originalRender = game.render;
    game.render = function() {
        // 调用原始渲染方法
        originalRender.call(this);
        
        // 渲染效果文字
        this.effectTexts.forEach(effectText => effectText.render(this.ctx));
    };
    
    // 添加全局键盘事件监听
    document.addEventListener('keydown', (e) => {
        // 防止某些按键的默认行为
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
            e.preventDefault();
        }
        
        // ESC键返回主菜单
        if (e.key === 'Escape' && game.isRunning) {
            game.isRunning = false;
            game.gameStartElement.style.display = 'flex';
        }
    });
    
    // 添加窗口失焦时自动暂停
    window.addEventListener('blur', () => {
        if (game.isRunning && !game.isPaused) {
            game.togglePause();
        }
    });
    
    // 添加性能监控
    let frameCount = 0;
    let lastFpsTime = performance.now();
    
    const originalGameLoop = game.gameLoop;
    game.gameLoop = function(currentTime) {
        frameCount++;
        
        // 每秒计算一次FPS
        if (currentTime - lastFpsTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastFpsTime));
            // 可以在这里显示FPS，或者进行性能优化
            frameCount = 0;
            lastFpsTime = currentTime;
        }
        
        // 调用原始游戏循环
        originalGameLoop.call(this, currentTime);
    };
    
    console.log('雷霆战机游戏已初始化完成！');
    console.log('操作说明：');
    console.log('- WASD或方向键：移动飞机');
    console.log('- 空格键：发射子弹');
    console.log('- P键：暂停/继续游戏');
    console.log('- ESC键：返回主菜单');
});