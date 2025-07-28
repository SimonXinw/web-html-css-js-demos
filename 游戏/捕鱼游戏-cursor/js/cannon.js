// 炮台类
class Cannon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.level = 1;
        this.angle = -Math.PI / 2; // 初始朝上
        this.targetAngle = this.angle;
        
        // 炮台配置
        this.config = GameConfig.CANNON;
        this.width = this.config.width;
        this.height = this.config.height;
        this.maxAngle = this.config.maxAngle;
        
        // 动画属性
        this.rotationSpeed = 0.1;
        this.recoilOffset = 0;
        this.recoilSpeed = 0;
        this.maxRecoil = 15;
        
        // 瞄准线
        this.aimLineLength = 150;
        this.showAimLine = false;
        this.aimX = 0;
        this.aimY = 0;
        
        // 射击相关
        this.lastShotTime = 0;
        this.shotCooldown = 300; // 毫秒
        this.canShoot = true;
        
        // 特效
        this.muzzleFlash = {
            active: false,
            duration: 100,
            startTime: 0
        };
    }

    update(deltaTime) {
        // 平滑旋转到目标角度
        if (Math.abs(this.angle - this.targetAngle) > 0.01) {
            const angleDiff = this.targetAngle - this.angle;
            
            // 处理角度环绕
            let shortestAngle = angleDiff;
            if (shortestAngle > Math.PI) {
                shortestAngle -= Math.PI * 2;
            } else if (shortestAngle < -Math.PI) {
                shortestAngle += Math.PI * 2;
            }
            
            this.angle += shortestAngle * this.rotationSpeed;
        }

        // 更新后坐力动画
        if (this.recoilOffset > 0) {
            this.recoilOffset -= this.recoilSpeed;
            if (this.recoilOffset < 0) {
                this.recoilOffset = 0;
            }
        }

        // 更新射击冷却
        const currentTime = Date.now();
        this.canShoot = currentTime - this.lastShotTime >= this.shotCooldown;

        // 更新枪口闪光
        if (this.muzzleFlash.active) {
            if (currentTime - this.muzzleFlash.startTime >= this.muzzleFlash.duration) {
                this.muzzleFlash.active = false;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // 绘制炮台底座
        this.drawBase(ctx);
        
        // 绘制炮管
        this.drawBarrel(ctx);
        
        // 绘制瞄准线
        if (this.showAimLine) {
            this.drawAimLine(ctx);
        }
        
        // 绘制枪口闪光
        if (this.muzzleFlash.active) {
            this.drawMuzzleFlash(ctx);
        }

        ctx.restore();
    }

    drawBase(ctx) {
        const currentConfig = this.config.levels[this.level - 1];
        
        // 底座阴影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(2, 2, this.width * 0.6, this.width * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // 底座主体
        const baseGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width * 0.6);
        baseGradient.addColorStop(0, '#4A4A4A');
        baseGradient.addColorStop(0.7, '#2C2C2C');
        baseGradient.addColorStop(1, '#1A1A1A');
        
        ctx.fillStyle = baseGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width * 0.6, this.width * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // 底座边框
        ctx.strokeStyle = currentConfig.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width * 0.6, this.width * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 中心装饰
        ctx.fillStyle = currentConfig.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.width * 0.15, 0, Math.PI * 2);
        ctx.fill();

        // 等级标识
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${this.width * 0.2}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.level.toString(), 0, 0);
    }

    drawBarrel(ctx) {
        const currentConfig = this.config.levels[this.level - 1];
        
        ctx.save();
        ctx.rotate(this.angle);
        ctx.translate(0, -this.recoilOffset);

        // 炮管阴影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(-this.width * 0.15 + 2, -this.height * 0.8 + 2, this.width * 0.3, this.height * 0.8);

        // 炮管主体
        const barrelGradient = ctx.createLinearGradient(-this.width * 0.15, 0, this.width * 0.15, 0);
        barrelGradient.addColorStop(0, '#3A3A3A');
        barrelGradient.addColorStop(0.5, '#5A5A5A');
        barrelGradient.addColorStop(1, '#3A3A3A');
        
        ctx.fillStyle = barrelGradient;
        ctx.fillRect(-this.width * 0.15, -this.height * 0.8, this.width * 0.3, this.height * 0.8);

        // 炮管装饰环
        ctx.fillStyle = currentConfig.color;
        for (let i = 0; i < 3; i++) {
            const y = -this.height * 0.2 - i * this.height * 0.15;
            ctx.fillRect(-this.width * 0.18, y, this.width * 0.36, this.width * 0.08);
        }

        // 炮口
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath();
        ctx.ellipse(0, -this.height * 0.8, this.width * 0.12, this.width * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = currentConfig.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    drawAimLine(ctx) {
        ctx.save();
        ctx.rotate(this.angle);
        
        // 瞄准线
        const gradient = ctx.createLinearGradient(0, 0, 0, -this.aimLineLength);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, -this.height * 0.4);
        ctx.lineTo(0, -this.aimLineLength);
        ctx.stroke();
        ctx.setLineDash([]);

        // 瞄准十字
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.lineWidth = 2;
        const crossSize = 10;
        const crossY = -this.aimLineLength;
        
        ctx.beginPath();
        ctx.moveTo(-crossSize, crossY);
        ctx.lineTo(crossSize, crossY);
        ctx.moveTo(0, crossY - crossSize);
        ctx.lineTo(0, crossY + crossSize);
        ctx.stroke();

        ctx.restore();
    }

    drawMuzzleFlash(ctx) {
        const currentConfig = this.config.levels[this.level - 1];
        const flashProgress = (Date.now() - this.muzzleFlash.startTime) / this.muzzleFlash.duration;
        const flashAlpha = 1 - flashProgress;
        
        ctx.save();
        ctx.rotate(this.angle);
        ctx.globalAlpha = flashAlpha;

        // 闪光主体
        const flashGradient = ctx.createRadialGradient(0, -this.height * 0.8, 0, 0, -this.height * 0.8, 30);
        flashGradient.addColorStop(0, currentConfig.color);
        flashGradient.addColorStop(0.5, '#FFFF00');
        flashGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = flashGradient;
        ctx.beginPath();
        ctx.arc(0, -this.height * 0.8, 25 * (1 - flashProgress), 0, Math.PI * 2);
        ctx.fill();

        // 闪光射线
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const length = 20 * (1 - flashProgress);
            ctx.beginPath();
            ctx.moveTo(0, -this.height * 0.8);
            ctx.lineTo(
                Math.cos(angle) * length,
                -this.height * 0.8 + Math.sin(angle) * length
            );
            ctx.stroke();
        }

        ctx.restore();
    }

    // 瞄准目标位置
    aimAt(targetX, targetY) {
        this.aimX = targetX;
        this.aimY = targetY;
        
        // 计算目标角度
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        let targetAngle = Math.atan2(dy, dx) - Math.PI / 2;
        
        // 限制角度范围
        const maxAngle = this.maxAngle;
        targetAngle = Utils.clamp(targetAngle, -Math.PI / 2 - maxAngle, -Math.PI / 2 + maxAngle);
        
        this.targetAngle = targetAngle;
        this.showAimLine = true;
    }

    // 隐藏瞄准线
    hideAimLine() {
        this.showAimLine = false;
    }

    // 射击
    shoot(projectileManager) {
        if (!this.canShoot) return false;

        // 计算发射位置
        const barrelLength = this.height * 0.8;
        const shootX = this.x + Math.sin(this.angle) * barrelLength;
        const shootY = this.y - Math.cos(this.angle) * barrelLength;

        // 发射子弹
        projectileManager.shootBullet(shootX, shootY, this.aimX, this.aimY, this.level);

        // 触发后坐力和特效
        this.recoilOffset = this.maxRecoil;
        this.recoilSpeed = 2;
        this.lastShotTime = Date.now();
        
        // 触发枪口闪光
        this.muzzleFlash.active = true;
        this.muzzleFlash.startTime = Date.now();

        return true;
    }

    // 升级炮台
    upgradeLevel(level) {
        if (level >= 1 && level <= 5) {
            this.level = level;
            // 调整射击冷却时间
            this.shotCooldown = 400 - level * 20; // 等级越高，射击越快
            return true;
        }
        return false;
    }

    // 获取当前等级配置
    getCurrentConfig() {
        return this.config.levels[this.level - 1];
    }

    // 获取发射成本
    getShotCost() {
        return this.getCurrentConfig().cost;
    }

    // 获取炮台威力
    getPower() {
        return this.getCurrentConfig().power;
    }

    // 检查是否可以射击
    canShootNow() {
        return this.canShoot;
    }

    // 获取瞄准方向的单位向量
    getAimDirection() {
        return {
            x: Math.sin(this.angle),
            y: -Math.cos(this.angle)
        };
    }

    // 设置位置
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    // 重置炮台状态
    reset() {
        this.level = 1;
        this.angle = -Math.PI / 2;
        this.targetAngle = this.angle;
        this.recoilOffset = 0;
        this.showAimLine = false;
        this.lastShotTime = 0;
        this.muzzleFlash.active = false;
    }
} 