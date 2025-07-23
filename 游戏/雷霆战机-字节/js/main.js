/**
 * 游戏入口文件
 * 负责初始化游戏并启动游戏循环
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 创建并初始化游戏实例
    const game = new Game();
    
    // 游戏初始化完成后，显示开始界面
    console.log('游戏初始化完成，等待玩家开始游戏');
});