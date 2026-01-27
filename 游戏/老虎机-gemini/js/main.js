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
            btn.innerHTML = `
                <span class="bet-amount">0</span>
                <span class="icon" style="color: ${item.color}">${item.icon}</span>
                <span class="rate">x${item.rate}</span>
            `;
            
            btn.addEventListener('click', () => this.placeBet(item.id));
            this.elBetGrid.appendChild(btn);
        });
    }

    bindEvents() {
        this.btnCoin.addEventListener('click', () => {
            this.addCredit(CONFIG.coinValue);
        });

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
        
        // 检查余额是否足够支付这次增加的押注
        // 我们采取“先扣款”还是“开始时扣款”？
        // 传统老虎机是先押注，余额减少，赢了再加回来。
        // 这里：点击押注时，从余额扣除？或者只记录押注额，开始时检查余额？
        // 逻辑：每次点击增加 betUnit
        
        const cost = this.betUnit;
        
        if (this.credit >= cost) {
            this.credit -= cost;
            this.bets[itemId] = (this.bets[itemId] || 0) + cost;
            this.totalBet += cost;
            this.updateUI();
            this.updateBetButton(itemId);
        } else {
            // 余额不足，尝试自动投币提示?
            // 简单闪烁一下余额
            this.elCredit.style.color = 'red';
            setTimeout(() => this.elCredit.style.color = '', 200);
        }
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
    }

    async startGame() {
        this.isRunning = true;
        this.updateUI(); // disable buttons
        this.marquee.reset();
        
        // 1. 决定结果
        // 跑马灯结果
        // 使用加权随机算法
        // 获取实际布局中的所有格子，随机选一个
        // 或者预定义概率：先决定中哪个水果，再找那个水果的格子
        const resultIndex = this.calculateMarqueeResult();
        const resultItem = this.marquee.getItemAt(resultIndex);
        
        // 滚轮结果
        // 简单随机
        const reelResults = [
            this.getRandomItem().id,
            this.getRandomItem().id,
            this.getRandomItem().id
        ];
        
        // 2. 开始动画
        // 跑马灯转圈
        const marqueePromise = this.runMarquee(resultIndex);
        
        // 滚轮转动
        const reelsPromise = this.reels.spin(reelResults);
        
        await Promise.all([marqueePromise, reelsPromise]);
        
        // 3. 结算
        this.settle(resultItem, reelResults);
        
        this.isRunning = false;
        
        // 清除押注（一轮一清？通常老虎机可以保留押注）
        // 这里我们设计为保留押注，如果余额足够，方便下一局
        // 但是我们需要检查余额是否足够保持当前押注
        if (this.credit < this.totalBet) {
            // 余额不足维持押注，清空押注或者不让开始
            // 简单做法：不做处理，下次点击开始时会检查
            // 为了用户体验，我们不自动清空押注，让用户自己决定是否加钱
        }
        
        this.updateUI();
    }
    
    getRandomItem() {
        return CONFIG.items[Math.floor(Math.random() * CONFIG.items.length)];
    }

    calculateMarqueeResult() {
        // 简单随机选一个格子
        // 更好的做法：根据赔率控制概率
        // 比如 totalWeight，random(0, totalWeight)
        // 这里简化：纯随机
        const count = this.marquee.cells.length;
        const rand = Math.floor(Math.random() * count);
        return rand;
    }

    runMarquee(targetIndex) {
        return new Promise(resolve => {
            let current = 0;
            let speed = 50; // initial speed ms
            let rounds = 3; // 至少转几圈
            let steps = rounds * this.marquee.cells.length + targetIndex;
            let currentStep = 0;
            
            const step = () => {
                // 计算当前高亮的格子索引 (0 - 23)
                const index = current % this.marquee.cells.length;
                this.marquee.highlight(index);
                
                current++;
                currentStep++;
                
                if (currentStep < steps) {
                    // 速度变化：前段快，后段慢
                    if (steps - currentStep < 10) {
                        speed += 30; // 减速
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
        } else {
            // msg.push(`结果是 ${itemConfig.icon}，可惜没押中。`);
        }
        
        // 2. 滚轮结算
        // 检查是否匹配 Jackpot
        const key = reelResultsIds.map(id => {
            return CONFIG.items.find(i => i.id === id).icon;
        }).join('-');
        
        // 也可以检查 id 组合
        // 比如 id 都是一样的
        if (reelResultsIds[0] === reelResultsIds[1] && reelResultsIds[1] === reelResultsIds[2]) {
            const tripletId = reelResultsIds[0];
            const tripletItem = CONFIG.items.find(i => i.id === tripletId);
            
            // 特殊奖励
            // 查表或者直接给一个大奖
            // 简单规则：3个一样的，奖励 50 * betUnit? 还是固定值？
            // 按照 Config 的 Jackpot
            const iconKey = `${tripletItem.icon}-${tripletItem.icon}-${tripletItem.icon}`;
            if (CONFIG.jackpot[iconKey]) {
                const jackpotWin = CONFIG.jackpot[iconKey];
                winAmount += jackpotWin;
                msg.push(`恭喜！触发大奖 ${iconKey}，额外获得 ${jackpotWin} 金币！`);
            } else {
                // 普通三连
                const bonus = 30;
                winAmount += bonus;
                msg.push(`不错哦！三连 ${tripletItem.icon}，额外获得 ${bonus} 金币！`);
            }
        }
        
        if (winAmount > 0) {
            this.addCredit(winAmount);
            // 播放中奖音效
            this.showMessage('恭喜发财', msg.join('<br>'));
        }
    }
    
    showMessage(title, text) {
        this.modalTitle.textContent = title;
        this.modalMsg.innerHTML = text;
        this.modal.classList.add('visible');
    }
}

// Start Game
window.game = new Game();
