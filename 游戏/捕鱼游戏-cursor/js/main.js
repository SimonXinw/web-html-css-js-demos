// 游戏初始化和启动
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎣 捕鱼游戏正在加载...');
    
    // 检查浏览器兼容性
    if (!checkBrowserCompatibility()) {
        showCompatibilityError();
        return;
    }
    
    // 等待所有资源加载完成
    window.addEventListener('load', function() {
        try {
            // 初始化游戏
            const game = new Game();
            
            // 将游戏实例暴露到全局，方便调试
            window.fishingGame = game;
            
            console.log('🎯 捕鱼游戏加载完成！');
            
            // 显示加载完成消息
            setTimeout(() => {
                console.log('🌊 欢迎来到捕鱼达人的世界！');
            }, 1000);
            
        } catch (error) {
            console.error('❌ 游戏初始化失败:', error);
            showGameError(error);
        }
    });
});

// 检查浏览器兼容性
function checkBrowserCompatibility() {
    // 检查Canvas支持
    const canvas = document.createElement('canvas');
    if (!canvas.getContext) {
        console.error('❌ 浏览器不支持Canvas');
        return false;
    }
    
    // 检查2D上下文支持
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('❌ 浏览器不支持Canvas 2D渲染');
        return false;
    }
    
    // 检查requestAnimationFrame支持
    if (!window.requestAnimationFrame) {
        console.error('❌ 浏览器不支持requestAnimationFrame');
        return false;
    }
    
    // 检查现代JavaScript特性
    try {
        // 检查ES6类支持
        eval('class TestClass {}');
        
        // 检查箭头函数支持
        eval('() => {}');
        
        // 检查const/let支持
        eval('const test = 1; let test2 = 2;');
        
    } catch (e) {
        console.error('❌ 浏览器不支持现代JavaScript特性');
        return false;
    }
    
    return true;
}

// 显示兼容性错误
function showCompatibilityError() {
    const errorMessage = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #f8d7da;
            color: #721c24;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            font-family: Arial, sans-serif;
            border: 1px solid #f5c6cb;
            max-width: 500px;
            z-index: 10000;
        ">
            <h2>⚠️ 浏览器不兼容</h2>
            <p>抱歉，您的浏览器不支持运行此游戏。</p>
            <p>请使用以下现代浏览器：</p>
            <ul style="text-align: left; margin-top: 15px;">
                <li>Chrome 60+</li>
                <li>Firefox 55+</li>
                <li>Safari 11+</li>
                <li>Edge 79+</li>
            </ul>
            <p style="margin-top: 15px;">
                <small>或者升级您当前的浏览器到最新版本</small>
            </p>
        </div>
    `;
    
    document.body.innerHTML = errorMessage;
}

// 显示游戏错误
function showGameError(error) {
    const errorMessage = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #f8d7da;
            color: #721c24;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            font-family: Arial, sans-serif;
            border: 1px solid #f5c6cb;
            max-width: 500px;
            z-index: 10000;
        ">
            <h2>❌ 游戏加载失败</h2>
            <p>游戏在初始化过程中遇到了问题。</p>
            <details style="margin-top: 15px; text-align: left;">
                <summary style="cursor: pointer;">查看错误详情</summary>
                <pre style="
                    background: #fff;
                    padding: 10px;
                    border-radius: 5px;
                    margin-top: 10px;
                    font-size: 12px;
                    overflow: auto;
                    max-height: 200px;
                ">${error.stack || error.message}</pre>
            </details>
            <button onclick="location.reload()" style="
                margin-top: 15px;
                padding: 10px 20px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            ">重新加载游戏</button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', errorMessage);
}

// 性能监控（开发模式）
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function monitorPerformance() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
            console.log(`🎮 FPS: ${fps}`);
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(monitorPerformance);
    }
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            console.log('📊 开始性能监控...');
            monitorPerformance();
        }, 2000);
    });
}

// 移动端优化
if (Utils && Utils.isMobile()) {
    document.addEventListener('DOMContentLoaded', function() {
        // 禁用移动端缩放
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
        
        // 隐藏地址栏
        setTimeout(() => {
            window.scrollTo(0, 1);
        }, 100);
        
        console.log('📱 移动端优化已启用');
    });
}

// 全局错误处理
window.addEventListener('error', function(e) {
    console.error('🚨 全局错误:', e.error);
    
    // 避免显示太多错误弹窗
    if (!window.gameErrorShown) {
        window.gameErrorShown = true;
        showGameError(e.error);
    }
});

// 未处理的Promise错误
window.addEventListener('unhandledrejection', function(e) {
    console.error('🚨 未处理的Promise错误:', e.reason);
    e.preventDefault();
});

// 游戏统计（可选）
window.gameStats = {
    startTime: Date.now(),
    
    getPlayTime() {
        return Date.now() - this.startTime;
    },
    
    getPlayTimeString() {
        const seconds = Math.floor(this.getPlayTime() / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}小时${minutes % 60}分钟`;
        } else if (minutes > 0) {
            return `${minutes}分钟${seconds % 60}秒`;
        } else {
            return `${seconds}秒`;
        }
    }
};

console.log(`
🎣 捕鱼达人游戏
====================
版本: 1.0.0
作者: AI助手
构建时间: ${new Date().toLocaleString()}
====================
准备就绪，等待用户操作...
`); 