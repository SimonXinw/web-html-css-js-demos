// UI管理类
class UIManager {
    constructor() {
        this.elements = this.initializeElements();
        this.cannonButtons = document.querySelectorAll('.cannon-btn');
        this.difficultyButtons = document.querySelectorAll('.difficulty-btn');
        
        this.bindEvents();
        this.initializeUI();
    }

    initializeElements() {
        return {
            startScreen: document.getElementById('startScreen'),
            gameScreen: document.getElementById('gameScreen'),
            pauseScreen: document.getElementById('pauseScreen'),
            gameOverScreen: document.getElementById('gameOverScreen'),
            coins: document.getElementById('coins'),
            cannonLevel: document.getElementById('cannonLevel'),
            finalScore: document.getElementById('finalScore'),
            pauseBtn: document.getElementById('pauseBtn'),
            addMoneyBtn: document.getElementById('addMoneyBtn'),
            resumeBtn: document.getElementById('resumeBtn'),
            restartBtn: document.getElementById('restartBtn'),
            backToMenuBtn: document.getElementById('backToMenuBtn'),
            playAgainBtn: document.getElementById('playAgainBtn'),
            backToMenuBtn2: document.getElementById('backToMenuBtn2')
        };
    }

    bindEvents() {
        // 难度选择
        this.difficultyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = e.target.getAttribute('data-difficulty');
                this.onDifficultySelect(difficulty);
            });
        });

        // 游戏控制
        this.elements.pauseBtn.addEventListener('click', () => this.onPauseClick());
        this.elements.addMoneyBtn.addEventListener('click', () => this.onAddMoneyClick());
        this.elements.resumeBtn.addEventListener('click', () => this.onResumeClick());
        this.elements.restartBtn.addEventListener('click', () => this.onRestartClick());
        this.elements.backToMenuBtn.addEventListener('click', () => this.onBackToMenuClick());
        this.elements.playAgainBtn.addEventListener('click', () => this.onPlayAgainClick());
        this.elements.backToMenuBtn2.addEventListener('click', () => this.onBackToMenuClick());

        // 炮台等级
        this.cannonButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = parseInt(e.target.getAttribute('data-level'));
                this.onCannonLevelSelect(level);
            });
        });

        // 移动端优化
        if (Utils.isMobile()) {
            this.setupMobileOptimizations();
        }
    }

    setupMobileOptimizations() {
        document.addEventListener('contextmenu', e => e.preventDefault());
        
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        this.cannonButtons.forEach(btn => {
            btn.style.minHeight = '44px';
            btn.style.minWidth = '44px';
        });
    }

    initializeUI() {
        this.updateCannonLevelButtons(1);
        this.showScreen('start');
        this.updateCoins(1000);
    }

    // 屏幕管理
    showScreen(screenName) {
        Object.values(this.elements).forEach(element => {
            if (element && element.classList && element.classList.contains('screen')) {
                element.classList.add('hidden');
            }
        });

        switch (screenName) {
            case 'start':
                this.elements.startScreen.classList.remove('hidden');
                break;
            case 'game':
                this.elements.gameScreen.classList.remove('hidden');
                break;
            case 'pause':
                this.elements.pauseScreen.classList.remove('hidden');
                break;
            case 'gameOver':
                this.elements.gameOverScreen.classList.remove('hidden');
                break;
        }
    }

    // 更新显示
    updateCoins(amount) {
        if (this.elements.coins) {
            this.elements.coins.textContent = amount.toLocaleString();
            this.elements.coins.parentElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                if (this.elements.coins.parentElement) {
                    this.elements.coins.parentElement.style.transform = 'scale(1)';
                }
            }, 200);
        }
    }

    updateCannonLevel(level) {
        if (this.elements.cannonLevel) {
            this.elements.cannonLevel.textContent = level;
        }
        this.updateCannonLevelButtons(level);
    }

    updateCannonLevelButtons(currentLevel) {
        this.cannonButtons.forEach(btn => {
            const btnLevel = parseInt(btn.getAttribute('data-level'));
            btn.classList.toggle('active', btnLevel === currentLevel);
        });
    }

    updateFinalScore(score) {
        if (this.elements.finalScore) {
            this.elements.finalScore.textContent = score.toLocaleString();
        }
    }

    updateCannonButtonAvailability(playerCoins, cannonConfigs) {
        this.cannonButtons.forEach(btn => {
            const level = parseInt(btn.getAttribute('data-level'));
            const config = cannonConfigs[level - 1];
            const canAfford = playerCoins >= config.cost;
            
            btn.disabled = !canAfford;
            btn.style.opacity = canAfford ? '1' : '0.6';
            
            if (!btn.querySelector('.cost')) {
                const costSpan = document.createElement('span');
                costSpan.className = 'cost';
                costSpan.style.cssText = 'display: block; font-size: 0.8em; opacity: 0.8;';
                btn.appendChild(costSpan);
            }
            btn.querySelector('.cost').textContent = `$${config.cost}`;
        });
    }

    // 特效
    showScorePopup(x, y, score, container) {
        const popup = document.createElement('div');
        popup.textContent = `+${score}`;
        popup.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            color: #FFD700;
            font-weight: bold;
            font-size: 18px;
            pointer-events: none;
            z-index: 1000;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            animation: scoreFloat 1s ease-out forwards;
        `;

        if (!document.querySelector('#scoreAnimationStyle')) {
            const style = document.createElement('style');
            style.id = 'scoreAnimationStyle';
            style.textContent = `
                @keyframes scoreFloat {
                    0% { opacity: 1; transform: translateY(0) scale(1); }
                    50% { transform: translateY(-30px) scale(1.2); }
                    100% { opacity: 0; transform: translateY(-60px) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }

        container.appendChild(popup);
        setTimeout(() => {
            if (popup.parentNode) popup.parentNode.removeChild(popup);
        }, 1000);
    }

    showMessage(message, type = 'info') {
        const colors = { info: '#3498db', success: '#27ae60', warning: '#f39c12', error: '#e74c3c' };
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: ${colors[type]}; color: white; padding: 12px 24px;
            border-radius: 25px; font-weight: bold; z-index: 10000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: messageSlide 3s ease-out forwards;
        `;

        if (!document.querySelector('#messageAnimationStyle')) {
            const style = document.createElement('style');
            style.id = 'messageAnimationStyle';
            style.textContent = `
                @keyframes messageSlide {
                    0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                    10%, 90% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(messageEl);
        setTimeout(() => {
            if (messageEl.parentNode) messageEl.parentNode.removeChild(messageEl);
        }, 3000);
    }

    cleanup() {
        document.querySelectorAll('.score-popup, .game-message').forEach(el => {
            if (el.parentNode) el.parentNode.removeChild(el);
        });
    }

         // 事件回调函数 - 将被Game类重写
     onDifficultySelect(difficulty) { console.log('Difficulty selected:', difficulty); }
     onPauseClick() { console.log('Pause clicked'); }
     onAddMoneyClick() { console.log('Add money clicked'); }
     onResumeClick() { console.log('Resume clicked'); }
     onRestartClick() { console.log('Restart clicked'); }
     onBackToMenuClick() { console.log('Back to menu clicked'); }
     onPlayAgainClick() { console.log('Play again clicked'); }
     onCannonLevelSelect(level) { console.log('Cannon level selected:', level); }
 } 