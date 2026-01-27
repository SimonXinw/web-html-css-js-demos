/**
 * 游戏配置数据
 */

export const CONFIG = {
    // 基础倍率
    items: [
        { id: 'apple', icon: '🍎', rate: 2, color: '#ff5252' },
        { id: 'orange', icon: '🍊', rate: 5, color: '#ff9800' },
        { id: 'lemon', icon: '🍋', rate: 10, color: '#ffeb3b' },
        { id: 'bell', icon: '🔔', rate: 15, color: '#ffd700' },
        { id: 'watermelon', icon: '🍉', rate: 20, color: '#4caf50' },
        { id: 'grape', icon: '🍇', rate: 30, color: '#9c27b0' },
        { id: 'bar', icon: '🎰', rate: 50, color: '#2196f3' },
        { id: 'seven', icon: '💎', rate: 100, color: '#00bcd4' }
    ],
    
    // 跑马灯的顺序 (逆时针或顺时针排列，对应面板上的格子)
    // 这里我们定义24个格子（根据HTML布局调整）
    // 假设布局是：上行8个，右列4个，下行8个，左列4个，共24个
    // 实际根据布局动态生成，这里主要定义概率权重
    // 简单起见，我们预设一个包含所有物品的数组，通过权重控制最终停下的位置
    
    // 面板尺寸 (格子数量)
    gridSize: 24, 
    
    // 初始金币
    initialCredit: 0,
    
    // 投币一次增加的金币
    coinValue: 10,
    
    // 中间滚轮的奖励组合
    jackpot: {
        '💎-💎-💎': 500,
        '🎰-🎰-🎰': 200,
        '🔔-🔔-🔔': 100,
        '🍊-🍊-🍊': 50
    }
};

export const SOUNDS = {
    // 这里可以预留音效
};
