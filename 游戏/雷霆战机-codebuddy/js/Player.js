/**
 * 玩家飞机类
 */
class Player {
    /**
     * 玩家飞机构造函数
     * @param {number} x - 初始x坐标
     * @param {number} y - 初始y坐标
     * @param {Game} game - 游戏实例
     */
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 80;
        this.speed = 6;
        this.game = game;
        
        // 移动方向控制
        this.movingLeft = false;
        this.movingRight = false;
        this.movingUp = false;
        this.movingDown = false;
        
        // 射击控制
        this.isShooting = false;
        this.shootCooldown = 150; // 射击冷却时间(毫秒)
        this.lastShootTime = 0;   // 上次射击时间
        this.autoShoot = false;   // 自动射击模式
        
        // 触摸控制
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.isTouching = false;
        this.touchSensitivity = 1.5; // 触摸灵敏度
        
        // 武器系统
        this.weaponLevel = 1;     // 武器等级
        this.maxWeaponLevel = 5;  // 最大武器等级
        this.upgradeScore = 100;  // 升级所需分数
        
        // 生命值和护盾
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.shield = 0;
        this.maxShield = 50;
        
        // 动画效果
        this.engineFlame = 0;
        this.invulnerable = false;
        this.invulnerableTime = 0;
        
        // 检测移动端并启用自动射击
        this.detectMobile();
        this.setupTouchControls();
    }
    
    /**
     * 检测是否为移动端设备
     */
    detectMobile() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                        || window.innerWidth <= 768;
        if (isMobile) {
            this.autoShoot = true;
            this.isShooting = true; // 移动端自动开启射击
        }
    }
    
    /**
     * 设置触摸控制
     */
    setupTouchControls() {
        const canvas = this.game.canvas;
        
        // 触摸开始
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            this.touchStartX = touch.clientX - rect.left;
            this.touchStartY = touch.clientY - rect.top;
            this.isTouching = true;
        }, { passive: false });
        
        // 触摸移动
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!this.isTouching) return;
            
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const currentX = touch.clientX - rect.left;
            const currentY = touch.clientY - rect.top;
            
            // 计算移动距离
            const deltaX = (currentX - this.touchStartX) * this.touchSensitivity;
            const deltaY = (currentY - this.touchStartY) * this.touchSensitivity;
            
            // 更新玩家位置
            this.x += deltaX;
            this.y += deltaY;
            
            // 边界限制
            this.x = Math.max(0, Math.min(this.x, this.game.canvas.width - this.width));
            this.y = Math.max(0, Math.min(this.y, this.game.canvas.height - this.height));
            
            // 更新触摸起始位置
            this.touchStartX = currentX;
            this.touchStartY = currentY;
        }, { passive: false });
        
        // 触摸结束
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.isTouching = false;
        }, { passive: false });
        
        // 防止触摸时的默认行为
        canvas.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.isTouching = false;
        }, { passive: false });
    }
    
    /**
     * 处理键盘按下事件
     * @param {KeyboardEvent} e - 键盘事件
     */
    handleKeyDown(e) {
        switch (e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.movingLeft = true;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.movingRight = true;
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.movingUp = true;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.movingDown = true;
                break;
            case ' ': // 空格键射击
                this.isShooting = true;
                e.preventDefault();
                break;
        }
    }
    
    /**
     * 处理键盘释放事件
     * @param {KeyboardEvent} e - 键盘事件
     */
    handleKeyUp(e) {
        switch (e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.movingLeft = false;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.movingRight = false;
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.movingUp = false;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.movingDown = false;
                break;
            case ' ':
                this.isShooting = false;
                break;
        }
    }
    
    /**
     * 更新玩家状态
     * @param {number} deltaTime - 帧间隔时间
     */
    update(deltaTime) {
        // 移动控制
        if (this.movingLeft) {
            this.x -= this.speed;
        }
        if (this.movingRight) {
            this.x += this.speed;
        }
        if (this.movingUp) {
            this.y -= this.speed;
        }
        if (this.movingDown) {
            this.y += this.speed;
        }
        
        // 边界限制
        this.x = Math.max(0, Math.min(this.x, this.game.canvas.width - this.width));
        this.y = Math.max(0, Math.min(this.y, this.game.canvas.height - this.height));
        
        // 射击控制
        const currentTime = performance.now();
        if (this.isShooting && currentTime - this.lastShootTime > this.shootCooldown) {
            this.shoot();
            this.lastShootTime = currentTime;
        }
        
        // 更新引擎火焰动画
        this.engineFlame = (this.engineFlame + 0.3) % (Math.PI * 2);
        
        // 更新无敌时间
        if (this.invulnerable) {
            this.invulnerableTime -= deltaTime;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }
        
        // 检查武器升级
        this.checkWeaponUpgrade();
    }
    
    /**
     * 检查武器升级
     */
    checkWeaponUpgrade() {
        const requiredScore = this.weaponLevel * this.upgradeScore;
        if (this.game.score >= requiredScore && this.weaponLevel < this.maxWeaponLevel) {
            this.weaponLevel++;
            this.game.showUpgradeEffect();
        }
    }
    
    /**
     * 受到伤害
     * @param {number} damage - 伤害值
     */
    takeDamage(damage) {
        if (this.invulnerable) return false;
        
        // 护盾先承受伤害
        if (this.shield > 0) {
            this.shield = Math.max(0, this.shield - damage);
            damage = Math.max(0, damage - this.shield);
        }
        
        // 生命值承受剩余伤害
        this.health = Math.max(0, this.health - damage);
        
        // 设置无敌时间
        this.invulnerable = true;
        this.invulnerableTime = 1000; // 1秒无敌时间
        
        return this.health <= 0;
    }
    
    /**
     * 渲染玩家飞机
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    render(ctx) {
        ctx.save();
        
        // 无敌状态闪烁效果
        if (this.invulnerable) {
            ctx.globalAlpha = 0.5 + 0.5 * Math.sin(Date.now() * 0.01);
        }
        
        // 绘制引擎火焰
        this.renderEngineFlame(ctx);
        
        // 绘制飞机主体 - 更精美的设计
        this.renderAircraft(ctx);
        
        // 绘制护盾效果
        if (this.shield > 0) {
            this.renderShield(ctx);
        }
        
        ctx.restore();
    }
    
    /**
     * 渲染引擎火焰
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    renderEngineFlame(ctx) {
        const flameHeight = 20 + 10 * Math.sin(this.engineFlame);
        const gradient = ctx.createLinearGradient(0, this.y + this.height, 0, this.y + this.height + flameHeight);
        gradient.addColorStop(0, 'rgba(255, 100, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 200, 0, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 255, 100, 0.2)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.3, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.7, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.6, this.y + this.height + flameHeight * 0.7);
        ctx.lineTo(this.x + this.width * 0.5, this.y + this.height + flameHeight);
        ctx.lineTo(this.x + this.width * 0.4, this.y + this.height + flameHeight * 0.7);
        ctx.closePath();
        ctx.fill();
    }
    
    /**
     * 渲染飞机主体
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    renderAircraft(ctx) {
        // 主体渐变色
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#00aaff');
        gradient.addColorStop(0.3, '#0088cc');
        gradient.addColorStop(0.7, '#006699');
        gradient.addColorStop(1, '#004466');
        
        // 绘制飞机主体
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y); // 机头
        ctx.lineTo(this.x + this.width * 0.8, this.y + this.height * 0.3);
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.7);
        ctx.lineTo(this.x + this.width * 0.7, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.3, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height * 0.7);
        ctx.lineTo(this.x + this.width * 0.2, this.y + this.height * 0.3);
        ctx.closePath();
        ctx.fill();
        
        // 绘制机翼
        ctx.fillStyle = '#0066aa';
        ctx.fillRect(this.x + this.width * 0.1, this.y + this.height * 0.4, this.width * 0.8, this.height * 0.1);
        
        // 绘制驾驶舱
        ctx.fillStyle = '#88ccff';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height * 0.3, this.width * 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制武器等级指示器
        this.renderWeaponIndicator(ctx);
    }
    
    /**
     * 渲染武器等级指示器
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    renderWeaponIndicator(ctx) {
        for (let i = 0; i < this.weaponLevel; i++) {
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(this.x + 5 + i * 8, this.y - 10, 6, 3);
        }
    }
    
    /**
     * 渲染护盾效果
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    renderShield(ctx) {
        const shieldAlpha = this.shield / this.maxShield * 0.3;
        ctx.strokeStyle = `rgba(0, 255, 255, ${shieldAlpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width * 0.7, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    /**
     * 发射子弹
     */
    shoot() {
        const centerX = this.x + this.width / 2;
        const bulletY = this.y - 10;
        
        switch (this.weaponLevel) {
            case 1:
                // 单发子弹
                this.game.bullets.push(new Bullet(centerX - 2.5, bulletY, this.game, 'normal'));
                break;
            case 2:
                // 双发子弹
                this.game.bullets.push(new Bullet(centerX - 15, bulletY, this.game, 'normal'));
                this.game.bullets.push(new Bullet(centerX + 10, bulletY, this.game, 'normal'));
                break;
            case 3:
                // 三发子弹
                this.game.bullets.push(new Bullet(centerX - 20, bulletY, this.game, 'normal'));
                this.game.bullets.push(new Bullet(centerX - 2.5, bulletY, this.game, 'enhanced'));
                this.game.bullets.push(new Bullet(centerX + 15, bulletY, this.game, 'normal'));
                break;
            case 4:
                // 四发子弹 + 激光
                this.game.bullets.push(new Bullet(centerX - 25, bulletY, this.game, 'normal'));
                this.game.bullets.push(new Bullet(centerX - 8, bulletY, this.game, 'laser'));
                this.game.bullets.push(new Bullet(centerX + 3, bulletY, this.game, 'laser'));
                this.game.bullets.push(new Bullet(centerX + 20, bulletY, this.game, 'normal'));
                break;
            case 5:
                // 最强火力
                this.game.bullets.push(new Bullet(centerX - 30, bulletY, this.game, 'enhanced'));
                this.game.bullets.push(new Bullet(centerX - 15, bulletY, this.game, 'laser'));
                this.game.bullets.push(new Bullet(centerX - 2.5, bulletY, this.game, 'plasma'));
                this.game.bullets.push(new Bullet(centerX + 10, bulletY, this.game, 'laser'));
                this.game.bullets.push(new Bullet(centerX + 25, bulletY, this.game, 'enhanced'));
                break;
        }
    }
}