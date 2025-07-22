/**
 * 用户界面类
 * 处理游戏UI的更新和显示
 */
class UI {
    /**
     * 构造函数
     * @param {Game} game - 游戏实例
     */
    constructor(game) {
        this.game = game;
        this.scoreElement = document.getElementById('scoreValue');
        this.livesElement = document.getElementById('livesValue');
        this.levelElement = document.getElementById('levelValue');
        this.finalScoreElement = document.getElementById('finalScore');
        this.finalLevelElement = document.getElementById('finalLevel');
        
        // 分数动画
        this.scoreAnimation = {
            current: 0,
            target: 0,
            speed: 0.1
        };
    }
    
    /**
     * 更新分数显示
     * @param {number} score - 当前分数
     */
    updateScore(score) {
        this.scoreAnimation.target = score;
    }
    
    /**
     * 更新生命值显示
     * @param {number} lives - 当前生命值
     */
    updateLives(lives) {
        this.livesElement.textContent = lives;
        
        // 生命值颜色变化
        if (lives <= 1) {
            this.livesElement.style.color = '#e74c3c';
        } else if (lives <= 2) {
            this.livesElement.style.color = '#f39c12';
        } else {
            this.livesElement.style.color = '#2ecc71';
        }
    }
    
    /**
     * 更新等级显示
     * @param {number} level - 当前等级
     */
    updateLevel(level) {
        this.levelElement.textContent = level;
    }
    
    /**
     * 更新最终分数
     * @param {number} score - 最终分数
     */
    updateFinalScore(score) {
        this.finalScoreElement.textContent = score;
    }
    
    /**
     * 更新最终等级
     * @param {number} level - 最终等级
     */
    updateFinalLevel(level) {
        this.finalLevelElement.textContent = level;
    }
    
    /**
     * 显示暂停界面
     */
    showPauseScreen() {
        document.getElementById('pauseScreen').classList.remove('hidden');
    }
    
    /**
     * 隐藏暂停界面
     */
    hidePauseScreen() {
        document.getElementById('pauseScreen').classList.add('hidden');
    }
    
    /**
     * 显示游戏结束界面
     */
    showGameOverScreen() {
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }
    
    /**
     * 隐藏游戏结束界面
     */
    hideGameOverScreen() {
        document.getElementById('gameOverScreen').classList.add('hidden');
    }
    
    /**
     * 显示开始界面
     */
    showStartScreen() {
        document.getElementById('startScreen').classList.remove('hidden');
    }
    
    /**
     * 隐藏开始界面
     */
    hideStartScreen() {
        document.getElementById('startScreen').classList.add('hidden');
    }
    
    /**
     * 更新分数动画
     */
    updateScoreAnimation() {
        if (this.scoreAnimation.current < this.scoreAnimation.target) {
            this.scoreAnimation.current += (this.scoreAnimation.target - this.scoreAnimation.current) * this.scoreAnimation.speed;
            this.scoreElement.textContent = Math.floor(this.scoreAnimation.current);
        }
    }
    
    /**
     * 显示升级提示
     * @param {string} message - 提示信息
     */
    showUpgradeMessage(message) {
        // 创建临时提示元素
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(52, 152, 219, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 18px;
            z-index: 10;
            animation: fadeInOut 2s ease-in-out;
        `;
        
        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(messageElement);
        
        // 2秒后移除提示
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 2000);
    }
} 