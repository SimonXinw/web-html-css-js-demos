/**
 * Explosion 类、PowerUp 类、InputHandler 类和 UI 类的实现
 */

/**
 * 爆炸效果类
 * 处理爆炸动画
 */
class Explosion {
    /**
     * 构造函数
     * @param {number} x - 爆炸x坐标
     * @param {number} y - 爆炸y坐标
     * @param {Game} game - 游戏实例
     */
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.frame = 0;
        this.maxFrame = 5;
        this.frameTime = 0;
        this.frameInterval = 100; // 帧间隔（毫秒）
        this.radius = 30;
    }
    
    /**
     * 更新爆炸状态
     * @param {number} deltaTime - 时间差（毫秒）
     */
    update(deltaTime) {
        this.frameTime += deltaTime;
        if (this.frameTime > this.frameInterval) {
            this.frame++;
            this.frameTime = 0;
        }
    }
    
    /**
     * 绘制爆炸效果
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    draw(ctx) {
        // 爆炸中心
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * (1 - this.frame / this.maxFrame));
        gradient.addColorStop(0, '#f39c12');
        gradient.addColorStop(0.5, '#e74c3c');
        gradient.addColorStop(1, 'rgba(192, 57, 43, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * (1 - this.frame / this.maxFrame * 0.5), 0, Math.PI * 2);
        ctx.fill();
        
        // 爆炸光芒
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 3 * (1 - this.frame / this.maxFrame);
        for (let i = 0; i < 12; i++) {
            const angle = Math.PI * 2 / 12 * i;
            const length = (30 + Math.random() * 20) * (1 - this.frame / this.maxFrame * 0.5);
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x + Math.cos(angle) * length,
                this.y + Math.sin(angle) * length
            );
            ctx.stroke();
        }
    }
}

/**
 * 道具类
 * 处理道具的移动和效果
 */
class PowerUp {
    /**
     * 构造函数
     * @param {number} x - 道具x坐标
     * @param {number} y - 道具y坐标
     * @param {Game} game - 游戏实例
     * @param {string} type - 道具类型
     */
    constructor(x, y, game, type) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.type = type; // 'shield' 或 'weapon'
        this.width = 30;
        this.height = 30;
        this.speed = 2;
    }
    
    /**
     * 更新道具状态
     */
    update() {
        this.y += this.speed;
    }
    
    /**
     * 绘制道具
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    draw(ctx) {
        if (this.type === 'shield') {
            // 护盾道具
            // 道具主体
            ctx.fillStyle = '#3498db';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 道具图标
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#3498db';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 6, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // 武器升级道具
            // 道具主体
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 道具图标
            ctx.fillStyle = '#fff';
            ctx.fillRect(this.x + this.width / 3, this.y + this.height / 6, this.width / 3, this.height * 2/3);
            ctx.fillRect(this.x + this.width / 6, this.y + this.height / 3, this.width * 2/3, this.height / 3);
        }
    }
    
    /**
     * 激活道具效果
     */
    activate() {
        if (this.type === 'shield') {
            this.game.player.activateShield();
        } else {
            this.game.player.upgradeWeapon();
        }
    }
}

/**
 * 输入处理类
 * 处理键盘输入
 */
class InputHandler {
    /**
     * 构造函数
     * 初始化按键状态和事件监听
     */
    constructor() {
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            Space: false,
            ' ': false,
            w: false,
            a: false,
            s: false,
            d: false
        };
        
        // 按键按下事件
        window.addEventListener('keydown', e => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
            }
        });
        
        // 按键释放事件
        window.addEventListener('keyup', e => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
            }
        });
    }
}

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
    }
    
    /**
     * 更新分数显示
     * @param {number} score - 当前分数
     */
    updateScore(score) {
        this.scoreElement.textContent = score;
    }
    
    /**
     * 更新生命值显示
     * @param {number} lives - 当前生命值
     */
    updateLives(lives) {
        this.livesElement.textContent = lives;
    }
}