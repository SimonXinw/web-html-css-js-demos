/**
 * 成语连连看游戏主类
 * 负责游戏的整体控制和逻辑
 */
class IdiomGame {
    constructor() {
        // 获取DOM元素
        this.mahjongArea = document.getElementById('mahjongArea');
        this.idiomDisplay = document.getElementById('idiomDisplay');
        this.idiomMeaning = document.getElementById('idiomMeaning');
        this.levelValue = document.getElementById('levelValue');
        this.scoreValue = document.getElementById('scoreValue');
        this.timeValue = document.getElementById('timeValue');
        this.gameStart = document.getElementById('gameStart');
        this.gameOver = document.getElementById('gameOver');
        this.levelComplete = document.getElementById('levelComplete');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.nextLevelButton = document.getElementById('nextLevelButton');
        this.continueButton = document.getElementById('continueButton');
        this.finalScore = document.getElementById('finalScore');
        this.finalLevel = document.getElementById('finalLevel');
        this.finalTime = document.getElementById('finalTime');
        this.completedLevel = document.getElementById('completedLevel');
        this.gameOverTitle = document.getElementById('gameOverTitle');
        
        // 游戏状态
        this.currentLevel = 1;
        this.score = 0;
        this.timeLeft = 60;
        this.isGameRunning = false;
        this.isPaused = false;
        this.gameTimer = null;
        
        // 当前关卡数据
        this.currentIdioms = [];
        this.currentIdiomIndex = 0;
        this.selectedChars = [false, false, false, false]; // 当前成语已选择的字符位置
        this.mahjongTiles = [];
        this.usedTileIndices = new Set(); // 已使用的麻将牌索引
        
        // 游戏配置
        this.gridRows = 6;
        this.gridCols = 8;
        this.totalTiles = this.gridRows * this.gridCols;
        this.baseScore = 100;
        this.timeBonus = 10;
        this.levelTimeLimit = 60;
        
        // 绑定事件
        this.bindEvents();
        
        console.log('成语连连看游戏初始化完成');
    }
    
    /**
     * 绑定游戏事件
     */
    bindEvents() {
        if (this.startButton) {
            this.startButton.addEventListener('click', () => this.startGame());
        }
        if (this.restartButton) {
            this.restartButton.addEventListener('click', () => this.restartGame());
        }
        if (this.nextLevelButton) {
            this.nextLevelButton.addEventListener('click', () => this.nextLevel());
        }
        if (this.continueButton) {
            this.continueButton.addEventListener('click', () => this.continueGame());
        }
        
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isGameRunning) {
                this.pauseGame();
            }
        });
    }
    
    /**
     * 开始游戏
     */
    startGame() {
        console.log('开始游戏');
        
        // 检查DOM元素
        if (!this.gameStart || !this.gameOver || !this.levelComplete) {
            console.error('游戏界面元素未找到');
            return;
        }
        
        this.gameStart.style.display = 'none';
        this.gameOver.style.display = 'none';
        this.levelComplete.style.display = 'none';
        
        this.currentLevel = 1;
        this.score = 0;
        this.isGameRunning = true;
        this.isPaused = false;
        
        this.initLevel();
        this.updateUI();
        this.startTimer();
    }
    
    /**
     * 重新开始游戏
     */
    restartGame() {
        this.stopTimer();
        this.startGame();
    }
    
    /**
     * 下一关
     */
    nextLevel() {
        this.currentLevel++;
        if (this.levelComplete) {
            this.levelComplete.style.display = 'none';
        }
        
        if (this.currentLevel > getTotalLevels()) {
            this.gameWin();
            return;
        }
        
        this.initLevel();
        this.updateUI();
        this.startTimer();
    }
    
    /**
     * 继续游戏
     */
    continueGame() {
        if (this.levelComplete) {
            this.levelComplete.style.display = 'none';
        }
        this.isPaused = false;
        this.startTimer();
    }
    
    /**
     * 初始化关卡
     */
    initLevel() {
        console.log('初始化关卡', this.currentLevel);
        
        // 获取当前关卡的成语数据
        this.currentIdioms = getLevelIdioms(this.currentLevel);
        this.currentIdiomIndex = 0;
        this.selectedChars = [false, false, false, false];
        this.usedTileIndices.clear();
        
        // 重置时间
        this.timeLeft = this.levelTimeLimit;
        
        // 生成麻将牌
        this.generateMahjongTiles();
        
        // 显示第一个成语
        this.showCurrentIdiom();
    }
    
    /**
     * 生成麻将牌
     */
    generateMahjongTiles() {
        if (!this.mahjongArea) {
            console.error('麻将区域元素未找到');
            return;
        }
        
        // 生成包含成语字符和干扰字符的数组
        const chars = generateMahjongChars(this.currentIdioms, this.totalTiles);
        
        // 清空麻将区域
        this.mahjongArea.innerHTML = '';
        this.mahjongTiles = [];
        
        // 创建麻将牌
        chars.forEach((char, index) => {
            const tile = document.createElement('div');
            tile.className = 'mahjong-tile';
            tile.textContent = char;
            tile.dataset.index = index;
            tile.dataset.char = char;
            
            // 添加点击事件
            tile.addEventListener('click', () => this.handleTileClick(tile, index, char));
            
            this.mahjongArea.appendChild(tile);
            this.mahjongTiles.push(tile);
        });
        
        console.log('生成了', chars.length, '个麻将牌');
    }
    
    /**
     * 显示当前成语
     */
    showCurrentIdiom() {
        if (this.currentIdiomIndex >= this.currentIdioms.length) {
            this.completeLevelHandler();
            return;
        }
        
        const currentIdiom = this.currentIdioms[this.currentIdiomIndex];
        console.log('显示成语:', currentIdiom.idiom);
        
        // 重置选择状态
        this.selectedChars = [false, false, false, false];
        
        // 更新成语显示
        for (let i = 0; i < 4; i++) {
            const charSlot = document.getElementById(`char${i + 1}`);
            if (charSlot) {
                charSlot.textContent = '?';
                charSlot.classList.remove('filled');
            }
        }
        
        // 显示成语含义提示
        if (this.idiomMeaning) {
            this.idiomMeaning.textContent = currentIdiom.hint;
        }
    }
    
    /**
     * 处理麻将牌点击
     */
    handleTileClick(tile, index, char) {
        console.log('点击了麻将牌:', char);
        
        // 检查牌是否已被使用
        if (this.usedTileIndices.has(index) || tile.classList.contains('used')) {
            return;
        }
        
        const currentIdiom = this.currentIdioms[this.currentIdiomIndex];
        
        // 获取下一个需要的字符
        const nextRequired = this.getNextRequiredChar(currentIdiom, this.selectedChars);
        
        if (!nextRequired) {
            return; // 成语已完成
        }
        
        console.log('需要的字符:', nextRequired.char, '点击的字符:', char);
        
        // 检查点击的字符是否正确
        if (char === nextRequired.char) {
            // 正确选择
            this.handleCorrectSelection(tile, index, char, nextRequired.position);
        } else {
            // 错误选择
            this.handleWrongSelection(tile);
        }
    }
    
    /**
     * 获取下一个需要的字符
     */
    getNextRequiredChar(idiom, selectedChars) {
        for (let i = 0; i < 4; i++) {
            if (!selectedChars[i]) {
                return {
                    char: idiom.chars[i],
                    position: i
                };
            }
        }
        return null; // 成语已完成
    }
    
    /**
     * 处理正确选择
     */
    handleCorrectSelection(tile, index, char, position) {
        console.log('正确选择:', char, '位置:', position);
        
        // 标记字符已选择
        this.selectedChars[position] = true;
        
        // 更新显示
        const charSlot = document.getElementById(`char${position + 1}`);
        if (charSlot) {
            charSlot.textContent = char;
            charSlot.classList.add('filled');
        }
        
        // 标记麻将牌为正确
        tile.classList.add('correct');
        
        // 延迟标记为已使用
        setTimeout(() => {
            tile.classList.remove('correct');
            tile.classList.add('used');
            this.usedTileIndices.add(index);
        }, 600);
        
        // 检查成语是否完成
        if (this.selectedChars.every(selected => selected)) {
            this.completeCurrentIdiom();
        }
        
        // 播放成功音效（模拟）
        this.playSound('correct');
    }
    
    /**
     * 处理错误选择
     */
    handleWrongSelection(tile) {
        console.log('错误选择');
        
        // 添加错误动画
        tile.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            tile.style.animation = '';
        }, 500);
        
        // 扣分
        this.score = Math.max(0, this.score - 10);
        this.updateUI();
        
        // 播放错误音效（模拟）
        this.playSound('wrong');
    }
    
    /**
     * 完成当前成语
     */
    completeCurrentIdiom() {
        const currentIdiom = this.currentIdioms[this.currentIdiomIndex];
        console.log('完成成语:', currentIdiom.idiom);
        
        // 计算得分
        const basePoints = this.baseScore;
        const timeBonus = Math.floor(this.timeLeft * this.timeBonus / 10);
        const totalPoints = basePoints + timeBonus;
        
        this.score += totalPoints;
        
        // 显示完整成语含义
        if (this.idiomMeaning) {
            this.idiomMeaning.textContent = `${currentIdiom.idiom} - ${currentIdiom.meaning}`;
        }
        
        // 播放完成音效
        this.playSound('complete');
        
        // 延迟进入下一个成语
        setTimeout(() => {
            this.currentIdiomIndex++;
            this.showCurrentIdiom();
            this.updateUI();
        }, 2000);
    }
    
    /**
     * 关卡完成处理器
     */
    completeLevelHandler() {
        console.log('关卡完成');
        this.stopTimer();
        this.isPaused = true;
        
        // 关卡完成奖励
        const levelBonus = this.currentLevel * 500;
        this.score += levelBonus;
        
        if (this.completedLevel) {
            this.completedLevel.textContent = this.currentLevel;
        }
        if (this.levelComplete) {
            this.levelComplete.style.display = 'flex';
        }
        
        this.updateUI();
        this.playSound('levelComplete');
    }
    
    /**
     * 游戏胜利
     */
    gameWin() {
        console.log('游戏胜利');
        this.isGameRunning = false;
        this.stopTimer();
        
        if (this.gameOverTitle) {
            this.gameOverTitle.textContent = '🎉 恭喜通关! 🎉';
        }
        if (this.finalScore) {
            this.finalScore.textContent = this.score;
        }
        if (this.finalLevel) {
            this.finalLevel.textContent = this.currentLevel - 1;
        }
        if (this.finalTime) {
            this.finalTime.textContent = this.levelTimeLimit - this.timeLeft;
        }
        
        if (this.nextLevelButton) {
            this.nextLevelButton.style.display = 'none';
        }
        if (this.gameOver) {
            this.gameOver.style.display = 'flex';
        }
        
        this.playSound('gameWin');
    }
    
    /**
     * 游戏失败
     */
    gameOver() {
        console.log('游戏结束');
        this.isGameRunning = false;
        this.stopTimer();
        
        if (this.gameOverTitle) {
            this.gameOverTitle.textContent = '⏰ 时间到! ⏰';
        }
        if (this.finalScore) {
            this.finalScore.textContent = this.score;
        }
        if (this.finalLevel) {
            this.finalLevel.textContent = this.currentLevel;
        }
        if (this.finalTime) {
            this.finalTime.textContent = this.levelTimeLimit;
        }
        
        if (this.nextLevelButton) {
            this.nextLevelButton.style.display = 'none';
        }
        if (this.gameOver) {
            this.gameOver.style.display = 'flex';
        }
        
        this.playSound('gameOver');
    }
    
    /**
     * 暂停游戏
     */
    pauseGame() {
        if (!this.isGameRunning) return;
        
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    }
    
    /**
     * 开始计时器
     */
    startTimer() {
        this.stopTimer();
        
        this.gameTimer = setInterval(() => {
            if (!this.isPaused && this.isGameRunning) {
                this.timeLeft--;
                this.updateUI();
                
                if (this.timeLeft <= 0) {
                    this.gameOver();
                }
            }
        }, 1000);
    }
    
    /**
     * 停止计时器
     */
    stopTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }
    
    /**
     * 更新UI显示
     */
    updateUI() {
        if (this.levelValue) {
            this.levelValue.textContent = this.currentLevel;
        }
        if (this.scoreValue) {
            this.scoreValue.textContent = this.score;
        }
        if (this.timeValue) {
            this.timeValue.textContent = this.timeLeft;
            
            // 时间警告效果
            if (this.timeLeft <= 10) {
                this.timeValue.style.color = '#ff4444';
                this.timeValue.style.animation = 'pulse 1s infinite';
            } else {
                this.timeValue.style.color = '#ffd700';
                this.timeValue.style.animation = '';
            }
        }
    }
    
    /**
     * 播放音效（模拟）
     */
    playSound(type) {
        console.log(`播放音效: ${type}`);
        
        // 简单的视觉反馈
        switch (type) {
            case 'correct':
                document.body.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                setTimeout(() => {
                    document.body.style.backgroundColor = '';
                }, 200);
                break;
            case 'wrong':
                document.body.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
                setTimeout(() => {
                    document.body.style.backgroundColor = '';
                }, 200);
                break;
            case 'complete':
                // 成语完成的庆祝效果
                this.createCelebrationEffect();
                break;
        }
    }
    
    /**
     * 创建庆祝效果
     */
    createCelebrationEffect() {
        // 创建简单的粒子效果
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '10px';
            particle.style.height = '10px';
            particle.style.backgroundColor = '#ffd700';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            document.body.appendChild(particle);
            
            // 动画效果
            particle.animate([
                { transform: 'scale(0) rotate(0deg)', opacity: 1 },
                { transform: 'scale(1) rotate(180deg)', opacity: 0.5 },
                { transform: 'scale(0) rotate(360deg)', opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => {
                if (document.body.contains(particle)) {
                    document.body.removeChild(particle);
                }
            };
        }
    }
}

// 添加震动动画的CSS
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;
document.head.appendChild(shakeStyle);