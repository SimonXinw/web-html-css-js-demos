import { CONFIG } from './Config.js';
import { Marquee } from './Marquee.js';
import { Reels } from './Reels.js';
import { Fireworks } from './Fireworks.js';

class Game {
    constructor() {
        this.credit = CONFIG.initialCredit;
        this.totalBet = 0;
        this.bets = {}; // { apple: 0, orange: 10 ... }
        this.betUnit = 1; // 当前单注倍率
        this.isRunning = false;
        
        // DOM Elements
        this.elCredit = document.getElementById('credit-display');
        this.elTotalBet = document.getElementById('total-bet-display');
        this.elBetGrid = document.getElementById('betting-grid');
        this.btnStart = document.getElementById('btn-start');
        this.btnCoin = document.getElementById('btn-coin');
        this.btnClear = document.getElementById('btn-clear');
        this.btnBetMinus = document.getElementById('btn-bet-minus');
        this.btnBetPlus = document.getElementById('btn-bet-plus');
        this.elCurrentBetVal = document.getElementById('current-bet-val');
        
        this.modal = document.getElementById('message-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMsg = document.getElementById('modal-msg');
        this.modalClose = document.getElementById('modal-close');

        // Init Components
        this.marquee = new Marquee({
            top: document.getElementById('row-top'),
            right: document.getElementById('col-right'),
            bottom: document.getElementById('row-bottom'),
            left: document.getElementById('col-left')
        }, CONFIG.items);
        
        this.reels = new Reels([
            document.getElementById('reel-1'),
            document.getElementById('reel-2'),
            document.getElementById('reel-3')
        ], CONFIG.items);

        this.fireworks = new Fireworks();

        this.init();
    }

    init() {
        this.updateUI();
        this.renderBettingPanel();
        this.bindEvents();
        
        // Marquee DOM is ready, reorder logical cells
        setTimeout(() => this.marquee.reorderCells(), 100);
    }

    renderBettingPanel() {
        this.elBetGrid.innerHTML = '';
        CONFIG.items.forEach(item => {
            const btn = document.createElement('div');
            btn.className = 'bet-btn';
            btn.dataset.id = item.id;
            // 增加 bet-decrease 按钮
            btn.innerHTML = `
                <span class="bet-decrease">-</span>
                <span class="bet-amount">0</span>
                <span class="icon" style="color: ${item.color}">${item.icon}</span>
                <span class="rate">x${item.rate}</span>
            `;
            
            // 减少押注事件
            const decreaseBtn = btn.querySelector('.bet-decrease');
            decreaseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.decreaseBet(item.id);
            });

            // 增加押注事件
            btn.addEventListener('click', () => this.placeBet(item.id));
            this.elBetGrid.appendChild(btn);
        });
    }

    bindEvents() {
        this.btnCoin.addEventListener('click', () => {
            this.addCredit(CONFIG.coinValue);
        });
        
        if(this.btnClear) {
            this.btnClear.addEventListener('click', () => {
                this.clearBets();
            });
        }

        this.btnBetMinus.addEventListener('click', () => {
            if (this.betUnit > 1) {
                this.betUnit--;
                this.elCurrentBetVal.textContent = this.betUnit;
            }
        });

        this.btnBetPlus.addEventListener('click', () => {
            this.betUnit++;
            this.elCurrentBetVal.textContent = this.betUnit;
        });

        this.btnStart.addEventListener('click', () => {
            if (!this.isRunning && this.totalBet > 0 && this.credit >= this.totalBet) {
                this.startGame();
            } else if (this.totalBet === 0) {
                this.showMessage('提示', '请先押注水果！');
            } else if (this.credit < this.totalBet) {
                this.showMessage('余额不足', '请投币！');
            }
        });
        
        this.modalClose.addEventListener('click', () => {
            this.closeModal();
        });
        
        // 点击蒙层关闭弹窗
        this.modal.addEventListener('click', (e) => {
            // 如果点击的是 modal 本身（背景），而不是内容区域
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        this.modal.classList.remove('visible');
        // this.fireworks.stop(); // 烟花已经停止了，不需要再停
    }

    placeBet(itemId) {
        if (this.isRunning) return;
        
        const cost = this.betUnit;
        
        if (this.credit >= cost) {
            this.credit -= cost;
            this.bets[itemId] = (this.bets[itemId] || 0) + cost;
            this.totalBet += cost;
            this.updateUI();
            this.updateBetButton(itemId);
        } else {
            this.elCredit.style.color = 'red';
            setTimeout(() => this.elCredit.style.color = '', 200);
        }
    }

    decreaseBet(itemId) {
        if (this.isRunning) return;
        
        const currentBet = this.bets[itemId] || 0;
        if (currentBet > 0) {
            const decreaseAmount = Math.min(currentBet, this.betUnit);
            
            this.credit += decreaseAmount;
            this.bets[itemId] -= decreaseAmount;
            this.totalBet -= decreaseAmount;
            
            if (this.bets[itemId] <= 0) {
                delete this.bets[itemId];
            }
            
            this.updateUI();
            this.updateBetButton(itemId);
        }
    }
    
    clearBets() {
        if (this.isRunning) return;
        if (this.totalBet === 0) return;
        
        // 退钱
        this.credit += this.totalBet;
        this.totalBet = 0;
        
        // 清空所有押注记录
        const itemsToUpdate = Object.keys(this.bets);
        this.bets = {};
        
        this.updateUI();
        
        // 更新受影响的按钮
        itemsToUpdate.forEach(id => this.updateBetButton(id));
    }

    updateBetButton(itemId) {
        const btn = this.elBetGrid.querySelector(`.bet-btn[data-id="${itemId}"]`);
        if (btn) {
            const amountEl = btn.querySelector('.bet-amount');
            const amount = this.bets[itemId] || 0;
            amountEl.textContent = amount;
            if (amount > 0) {
                btn.classList.add('has-bet');
            } else {
                btn.classList.remove('has-bet');
            }
        }
    }

    addCredit(amount) {
        this.credit += amount;
        this.updateUI();
    }

    updateUI() {
        this.elCredit.textContent = this.credit;
        this.elTotalBet.textContent = this.totalBet;
        this.btnStart.disabled = this.totalBet === 0 || this.isRunning;
        if(this.btnClear) {
            this.btnClear.disabled = this.totalBet === 0 || this.isRunning;
        }
    }

    async startGame() {
        this.isRunning = true;
        this.updateUI(); // disable buttons
        this.marquee.reset();
        
        // 1. 决定结果
        const resultIndex = this.calculateMarqueeResult();
        const resultItem = this.marquee.getItemAt(resultIndex);
        
        const reelResults = [
            this.getRandomItem().id,
            this.getRandomItem().id,
            this.getRandomItem().id
        ];
        
        // 2. 开始动画
        const marqueePromise = this.runMarquee(resultIndex);
        const reelsPromise = this.reels.spin(reelResults);
        
        await Promise.all([marqueePromise, reelsPromise]);
        
        // 3. 结算
        this.settle(resultItem, reelResults);
        
        this.isRunning = false;
        
        this.resetRound();
        
        this.updateUI();
    }
    
    resetRound() {
        // 清空押注显示，准备下一局
        this.totalBet = 0;
        const itemsToUpdate = Object.keys(this.bets);
        this.bets = {};
        itemsToUpdate.forEach(id => this.updateBetButton(id));
    }
    
    getRandomItem() {
        return CONFIG.items[Math.floor(Math.random() * CONFIG.items.length)];
    }

    calculateMarqueeResult() {
        const count = this.marquee.cells.length;
        const rand = Math.floor(Math.random() * count);
        return rand;
    }

    runMarquee(targetIndex) {
        return new Promise(resolve => {
            let current = 0;
            let speed = 50; 
            let rounds = 3; 
            let steps = rounds * this.marquee.cells.length + targetIndex;
            let currentStep = 0;
            
            const step = () => {
                const index = current % this.marquee.cells.length;
                this.marquee.highlight(index);
                
                current++;
                currentStep++;
                
                if (currentStep < steps) {
                    if (steps - currentStep < 10) {
                        speed += 30; 
                    } else if (steps - currentStep < 20) {
                        speed += 10;
                    }
                    setTimeout(step, speed);
                } else {
                    resolve();
                }
            };
            step();
        });
    }

    settle(marqueeResultId, reelResultsIds) {
        let winAmount = 0;
        let msg = [];
        let isWin = false;
        
        // 1. 跑马灯结算
        const betAmount = this.bets[marqueeResultId] || 0;
        const itemConfig = CONFIG.items.find(i => i.id === marqueeResultId);
        
        if (betAmount > 0) {
            const win = betAmount * itemConfig.rate;
            winAmount += win;
            msg.push(`选中 ${itemConfig.icon}，赢得 ${win} 金币！`);
            isWin = true;
        }
        
        // 2. 滚轮结算
        if (reelResultsIds[0] === reelResultsIds[1] && reelResultsIds[1] === reelResultsIds[2]) {
            const tripletId = reelResultsIds[0];
            const tripletItem = CONFIG.items.find(i => i.id === tripletId);
            
            const iconKey = `${tripletItem.icon}-${tripletItem.icon}-${tripletItem.icon}`;
            if (CONFIG.jackpot[iconKey]) {
                const jackpotWin = CONFIG.jackpot[iconKey];
                winAmount += jackpotWin;
                msg.push(`恭喜！触发大奖 ${iconKey}，额外获得 ${jackpotWin} 金币！`);
            } else {
                const bonus = 30;
                winAmount += bonus;
                msg.push(`不错哦！三连 ${tripletItem.icon}，额外获得 ${bonus} 金币！`);
            }
            isWin = true;
        }
        
        if (winAmount > 0) {
            this.addCredit(winAmount);
            
            // 播放烟花
            this.fireworks.start();
            
            // 2秒后直接弹窗（烟花只发射一次，会自动结束）
            setTimeout(() => {
                this.showMessage('恭喜发财', msg.join('<br>'));
            }, 2000);
        }
    }
    
    showMessage(title, text) {
        this.modalTitle.textContent = title;
        this.modalMsg.innerHTML = text;
        this.modal.classList.add('visible');
    }
}

window.game = new Game();
