import { CONFIG } from './Config.js';
import { Marquee } from './Marquee.js';
import { Reels } from './Reels.js';

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
            this.modal.classList.remove('visible');
        });
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
            // 减少金额 = 最小是 betUnit，如果剩余不足 betUnit 则全部退回
            // 或者：逻辑上是每次减少 betUnit。
            // 如果 currentBet < betUnit (例如修改了倍率), 则减去 currentBet
            
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
        
        // 游戏结束后是否保持押注？
        // 如果我们保持押注，需要确保余额足够下一次。
        // 但目前的逻辑是“已押注”的钱已经从 credit 扣除了。
        // 所以下一次开始不需要再扣除（因为钱已经在桌上了）。
        // 除非我们采用“每局结束清空”或者“每局开始时扣除”的模式。
        // 当前模式：点击押注即扣费。所以这里不需要做任何 credit 检查。
        // 只有当用户想*增加*押注时才检查 credit。
        // 下一局可以直接点开始（用桌上的筹码玩），或者继续加注。
        // 等等，传统老虎机每一局是消耗掉押注的。
        // 如果赢了，钱加回 credit。
        // 那么桌上的筹码（totalBet）在这一局结束时应该被视为“已消耗”。
        // 下一局开始前，用户需要重新下注？
        // 通常老虎机有一个“重复下注”或者保留上次下注的功能。
        // 这里最简单的逻辑：
        // 结算完成后，清空桌上的 bets（视觉上清空），totalBet 归零。
        // 如果要保留“重复下注”，则需要从 credit 里再自动扣除 totalBet。
        
        // 目前代码逻辑：
        // placeBet -> credit 减少, totalBet 增加。
        // startGame -> 运行。
        // settle -> 赢的钱加回 credit。
        
        // 关键问题：这一局结束后，totalBet 怎么办？
        // 肯定是没了（输给机器了）。
        // 所以应该清空 bets。
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
        
        // 1. 跑马灯结算
        const betAmount = this.bets[marqueeResultId] || 0;
        const itemConfig = CONFIG.items.find(i => i.id === marqueeResultId);
        
        if (betAmount > 0) {
            const win = betAmount * itemConfig.rate;
            winAmount += win;
            msg.push(`选中 ${itemConfig.icon}，赢得 ${win} 金币！`);
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
        }
        
        if (winAmount > 0) {
            this.addCredit(winAmount);
            this.showMessage('恭喜发财', msg.join('<br>'));
        }
    }
    
    showMessage(title, text) {
        this.modalTitle.textContent = title;
        this.modalMsg.innerHTML = text;
        this.modal.classList.add('visible');
    }
}

window.game = new Game();
