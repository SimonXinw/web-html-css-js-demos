/**
 * 玩家飞机类
 * 处理玩家飞机的移动、射击和状态
 */
class Player {
    /**
     * 构造函数
     * @param {Game} game - 游戏实例
     */
    constructor(game) {
        this.game = game;
        this.width = 50;
        this.height = 50;
        this.x = game.width / 2 - this.width / 2;
        this.y = game.height - this.height - 20;
        this.speed = 5;
        this.weaponLevel = 1;
        this.shootTimer = 0;
        this.shootInterval = 300; // 射击间隔（毫秒）
        this.shieldActive = false;
        this.shieldTimer = 0;
        this.shieldDuration = 5000; // 护盾持续时间（毫秒）
        this.invulnerable = false; // 无敌状态（碰撞后短暂无敌）
        this.invulnerableTimer = 0;
        this.invulnerableDuration = 2000; // 无敌持续时间（毫秒）
        this.engineParticles = []; // 引擎粒子效果
        this.maxEngineParticles = 10;
    }
    
    /**
     * 更新玩家状态
     * @param {number} deltaTime - 时间差（毫秒）
     * @param {Object} keys - 按键状态
     */
    update(deltaTime, keys) {
        // 处理移动
        if (keys.ArrowLeft || keys.a) {
            this.x = Math.max(0, this.x - this.speed);
        }
        if (keys.ArrowRight || keys.d) {
            this.x = Math.min(this.game.width - this.width, this.x + this.speed);
        }
        if (keys.ArrowUp || keys.w) {
            this.y = Math.max(0, this.y - this.speed);
        }
        if (keys.ArrowDown || keys.s) {
            this.y = Math.min(this.game.height - this.height, this.y + this.speed);
        }
        
        // 处理射击
        this.shootTimer += deltaTime;
        if ((keys.Space || keys[' ']) && this.shootTimer > this.shootInterval) {
            this.shoot();
            this.shootTimer = 0;
        }
        
        // 处理护盾
        if (this.shieldActive) {
            this.shieldTimer += deltaTime;
            if (this.shieldTimer > this.shieldDuration) {
                this.shieldActive = false;
                this.shieldTimer = 0;
            }
        }
        
        // 处理无敌状态
        if (this.invulnerable) {
            this.invulnerableTimer += deltaTime;
            if (this.invulnerableTimer > this.invulnerableDuration) {
                this.invulnerable = false;
                this.invulnerableTimer = 0;
            }
        }
        
        // 更新引擎粒子效果
        this.updateEngineParticles(deltaTime);
    }
    
    /**
     * 更新引擎粒子效果
     * @param {number} deltaTime - 时间差（毫秒）
     */
    updateEngineParticles(deltaTime) {
        // 添加新的粒子
        if (this.engineParticles.length < this.maxEngineParticles) {
            this.engineParticles.push({
                x: this.x + this.width * 0.4 + Math.random() * this.width * 0.2,
                y: this.y + this.height,
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 3 + 2,
                life: 1.0,
                maxLife: 1.0,
                size: Math.random() * 3 + 2
            });
        }
        
        // 更新现有粒子
        this.engineParticles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= deltaTime / 1000;
            
            if (particle.life <= 0) {
                this.engineParticles.splice(index, 1);
            }
        });
    }
    
    /**
     * 绘制玩家飞机
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    draw(ctx) {
        // 绘制引擎粒子效果
        this.engineParticles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            ctx.fillStyle = `rgba(243, 156, 18, ${alpha})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // 无敌状态闪烁效果
        if (this.invulnerable && Math.floor(Date.now() / 100) % 2) {
            return; // 跳过绘制，实现闪烁效果
        }
        
        // 绘制护盾
        if (this.shieldActive) {
            const shieldAlpha = Math.sin(Date.now() * 0.005) * 0.2 + 0.3;
            ctx.fillStyle = `rgba(52, 152, 219, ${shieldAlpha})`;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 + 10, 0, Math.PI * 2);
            ctx.fill();
            
            // 护盾外圈
            ctx.strokeStyle = `rgba(52, 152, 219, ${shieldAlpha + 0.2})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 + 15, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // 飞机主体
        ctx.fillStyle = '#4cd137';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.8);
        ctx.lineTo(this.x + this.width * 0.7, this.y + this.height * 0.7);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.3, this.y + this.height * 0.7);
        ctx.lineTo(this.x, this.y + this.height * 0.8);
        ctx.closePath();
        ctx.fill();
        
        // 飞机驾驶舱
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height * 0.4, this.width * 0.16, 0, Math.PI * 2);
        ctx.fill();
        
        // 飞机引擎
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.rect(this.x + this.width * 0.4, this.y + this.height * 0.8, this.width * 0.2, this.height * 0.1);
        ctx.fill();
        
        // 飞机尾焰
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.4, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.5, this.y + this.height + 10);
        ctx.lineTo(this.x + this.width * 0.6, this.y + this.height);
        ctx.closePath();
        ctx.fill();
    }
    
    /**
     * 射击
     */
    shoot() {
        switch (this.weaponLevel) {
            case 1:
                // 单发子弹
                this.game.addBullet(this.x + this.width / 2 - 2.5, this.y, 1);
                break;
            case 2:
                // 双发子弹
                this.game.addBullet(this.x + this.width * 0.3, this.y + 10, 1);
                this.game.addBullet(this.x + this.width * 0.7, this.y + 10, 1);
                break;
            case 3:
                // 三发子弹
                this.game.addBullet(this.x + this.width / 2 - 5, this.y, 2);
                this.game.addBullet(this.x + this.width * 0.2, this.y + 10, 1);
                this.game.addBullet(this.x + this.width * 0.8, this.y + 10, 1);
                break;
            case 4:
                // 高级武器
                this.game.addBullet(this.x + this.width / 2 - 7.5, this.y, 3);
                this.game.addBullet(this.x + this.width * 0.2, this.y + 10, 2);
                this.game.addBullet(this.x + this.width * 0.8, this.y + 10, 2);
                break;
        }
    }
    
    /**
     * 重置玩家状态
     */
    reset() {
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.height - 20;
        this.weaponLevel = 1;
        this.shieldActive = false;
        this.shieldTimer = 0;
        this.invulnerable = false;
        this.invulnerableTimer = 0;
        this.engineParticles = [];
    }
    
    /**
     * 激活护盾
     */
    activateShield() {
        this.shieldActive = true;
        this.shieldTimer = 0;
    }
    
    /**
     * 升级武器
     */
    upgradeWeapon() {
        this.weaponLevel = Math.min(4, this.weaponLevel + 1);
    }
    
    /**
     * 激活无敌状态
     */
    activateInvulnerable() {
        this.invulnerable = true;
        this.invulnerableTimer = 0;
    }
    
    /**
     * 检查是否可以被攻击
     */
    canBeHit() {
        return !this.shieldActive && !this.invulnerable;
    }
} 