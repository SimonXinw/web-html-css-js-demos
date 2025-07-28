// 鱼类基类
class Fish {
    constructor(x, y, type, difficulty = 'medium') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.difficulty = difficulty;
        
        // 根据类型设置属性
        const fishConfig = GameConfig.FISH_TYPES.find(f => f.name === type) || GameConfig.FISH_TYPES[0];
        this.color = fishConfig.color;
        this.size = fishConfig.size;
        this.score = Math.floor(fishConfig.score * GameConfig.DIFFICULTY[difficulty.toUpperCase()].scoreMultiplier);
        this.baseSpeed = fishConfig.speed * GameConfig.DIFFICULTY[difficulty.toUpperCase()].fishSpeed;
        this.symbol = fishConfig.symbol;
        
        // 移动属性
        this.angle = Utils.random(0, Math.PI * 2);
        this.speed = this.baseSpeed + Utils.random(-0.2, 0.2);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        
        // 状态属性
        this.alive = true;
        this.caught = false;
        this.opacity = 1;
        
        // 动画属性
        this.animationOffset = Utils.random(0, Math.PI * 2);
        this.scaleOffset = Utils.random(0.8, 1.2);
        
        // 路径变化
        this.pathChangeTimer = 0;
        this.pathChangeInterval = Utils.random(60, 180); // 1-3秒改变方向
        
        // 边界反弹
        this.bounceCount = 0;
        this.maxBounces = Utils.randomInt(2, 5);
    }

    update(deltaTime, canvasWidth, canvasHeight) {
        if (!this.alive) return;

        // 更新路径变化计时器
        this.pathChangeTimer++;
        if (this.pathChangeTimer >= this.pathChangeInterval) {
            this.changeDirection();
            this.pathChangeTimer = 0;
        }

        // 更新位置
        this.x += this.vx;
        this.y += this.vy;

        // 边界检测和反弹
        this.handleBoundaries(canvasWidth, canvasHeight);

        // 更新动画
        this.animationOffset += 0.1;
    }

    changeDirection() {
        // 随机改变方向
        const angleChange = Utils.random(-Math.PI / 4, Math.PI / 4);
        this.angle += angleChange;
        
        // 限制角度范围，避免鱼游出屏幕太远
        if (this.x < 100 && Math.cos(this.angle) < 0) {
            this.angle = Utils.random(-Math.PI / 6, Math.PI / 6);
        } else if (this.x > GameConfig.CANVAS_WIDTH - 100 && Math.cos(this.angle) > 0) {
            this.angle = Utils.random(Math.PI - Math.PI / 6, Math.PI + Math.PI / 6);
        }
        
        if (this.y < 100 && Math.sin(this.angle) < 0) {
            this.angle = Utils.random(-Math.PI / 6, Math.PI - Math.PI / 6);
        } else if (this.y > GameConfig.CANVAS_HEIGHT - 200 && Math.sin(this.angle) > 0) {
            this.angle = Utils.random(-Math.PI + Math.PI / 6, -Math.PI / 6);
        }

        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
    }

    handleBoundaries(canvasWidth, canvasHeight) {
        let bounced = false;

        // 水平边界
        if (this.x <= this.size || this.x >= canvasWidth - this.size) {
            if (this.bounceCount < this.maxBounces) {
                this.vx = -this.vx;
                this.angle = Math.atan2(this.vy, this.vx);
                this.bounceCount++;
                bounced = true;
            } else {
                // 达到最大反弹次数，重新生成
                this.respawn(canvasWidth, canvasHeight);
                return;
            }
        }

        // 垂直边界 (避免游到底部炮台区域)
        if (this.y <= this.size || this.y >= canvasHeight - 150) {
            if (this.bounceCount < this.maxBounces) {
                this.vy = -this.vy;
                this.angle = Math.atan2(this.vy, this.vx);
                this.bounceCount++;
                bounced = true;
            } else {
                this.respawn(canvasWidth, canvasHeight);
                return;
            }
        }

        // 确保鱼在边界内
        this.x = Utils.clamp(this.x, this.size, canvasWidth - this.size);
        this.y = Utils.clamp(this.y, this.size, canvasHeight - 150);

        if (bounced) {
            this.pathChangeTimer = 0;
            this.pathChangeInterval = Utils.random(60, 180);
        }
    }

    respawn(canvasWidth, canvasHeight) {
        // 从屏幕边缘重新生成
        const side = Utils.randomInt(0, 3);
        switch (side) {
            case 0: // 左边
                this.x = -this.size;
                this.y = Utils.random(this.size, canvasHeight - 200);
                this.angle = Utils.random(-Math.PI / 4, Math.PI / 4);
                break;
            case 1: // 右边
                this.x = canvasWidth + this.size;
                this.y = Utils.random(this.size, canvasHeight - 200);
                this.angle = Utils.random(Math.PI - Math.PI / 4, Math.PI + Math.PI / 4);
                break;
            case 2: // 上边
                this.x = Utils.random(this.size, canvasWidth - this.size);
                this.y = -this.size;
                this.angle = Utils.random(Math.PI / 4, Math.PI - Math.PI / 4);
                break;
            case 3: // 下边 (较少使用)
                this.x = Utils.random(this.size, canvasWidth - this.size);
                this.y = canvasHeight - 120;
                this.angle = Utils.random(-Math.PI + Math.PI / 4, -Math.PI / 4);
                break;
        }

        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.bounceCount = 0;
        this.pathChangeTimer = 0;
    }

    draw(ctx) {
        if (!this.alive) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // 绘制鱼的身体
        const currentScale = this.scaleOffset + Math.sin(this.animationOffset) * 0.1;
        ctx.scale(currentScale, currentScale);

        // 设置透明度
        ctx.globalAlpha = this.opacity;

        // 绘制鱼的阴影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(2, 2, this.size * 0.8, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 绘制鱼的身体
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.8, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 绘制鱼的花纹
        ctx.fillStyle = this.getDarkerColor(this.color);
        ctx.beginPath();
        ctx.ellipse(this.size * 0.3, 0, this.size * 0.2, this.size * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // 绘制鱼尾
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.8, 0);
        ctx.lineTo(-this.size * 1.3, -this.size * 0.4);
        ctx.lineTo(-this.size * 1.1, 0);
        ctx.lineTo(-this.size * 1.3, this.size * 0.4);
        ctx.closePath();
        ctx.fill();

        // 绘制鱼鳍
        ctx.fillStyle = this.getDarkerColor(this.color);
        ctx.beginPath();
        ctx.ellipse(0, -this.size * 0.3, this.size * 0.3, this.size * 0.2, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(0, this.size * 0.3, this.size * 0.3, this.size * 0.2, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        // 绘制眼睛
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.size * 0.4, -this.size * 0.15, this.size * 0.12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.size * 0.45, -this.size * 0.15, this.size * 0.06, 0, Math.PI * 2);
        ctx.fill();

        // 绘制高光
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.size * 0.47, -this.size * 0.17, this.size * 0.02, 0, Math.PI * 2);
        ctx.fill();

        // 绘制分数标识
        if (this.size > 30) {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = `bold ${this.size * 0.3}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(this.score.toString(), 0, this.size * 0.1);
        }

        ctx.restore();
    }

    getDarkerColor(color) {
        // 简单的颜色变暗方法
        const darkerColors = {
            '#FFD700': '#DAA520',
            '#FF6B6B': '#DC143C',
            '#4ECDC4': '#20B2AA',
            '#95A5A6': '#7F8C8D',
            '#3498DB': '#2980B9'
        };
        return darkerColors[color] || '#666666';
    }

    // 被捕获时的动画
    getCaught() {
        this.caught = true;
        this.alive = false;
        
        // 创建消失动画
        const fadeOut = () => {
            this.opacity -= 0.05;
            if (this.opacity > 0) {
                requestAnimationFrame(fadeOut);
            }
        };
        fadeOut();
    }

    // 检查是否与点击位置碰撞
    isClicked(x, y) {
        return Utils.pointInCircle(x, y, this.x, this.y, this.size);
    }

    // 检查是否与渔网碰撞
    isInNet(netX, netY, netRadius) {
        return Utils.circleCollision(this.x, this.y, this.size * 0.8, netX, netY, netRadius);
    }
}

// 鱼群管理器
class FishManager {
    constructor(difficulty = 'medium') {
        this.fish = [];
        this.difficulty = difficulty;
        this.spawnTimer = 0;
        this.config = GameConfig.DIFFICULTY[difficulty.toUpperCase()];
    }

    update(deltaTime, canvasWidth, canvasHeight) {
        // 更新所有鱼
        this.fish.forEach(fish => fish.update(deltaTime, canvasWidth, canvasHeight));

        // 移除死亡的鱼
        this.fish = this.fish.filter(fish => fish.alive);

        // 生成新鱼
        this.spawnTimer++;
        if (this.fish.length < this.config.maxFish && Math.random() < this.config.fishSpawnRate) {
            this.spawnFish(canvasWidth, canvasHeight);
        }
    }

    spawnFish(canvasWidth, canvasHeight) {
        // 随机选择鱼的类型，大鱼出现概率较低
        const fishTypeWeights = [40, 30, 20, 8, 2]; // 小鱼出现概率最高
        const totalWeight = fishTypeWeights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        let typeIndex = 0;

        for (let i = 0; i < fishTypeWeights.length; i++) {
            random -= fishTypeWeights[i];
            if (random <= 0) {
                typeIndex = i;
                break;
            }
        }

        const fishType = GameConfig.FISH_TYPES[typeIndex];
        
        // 从屏幕边缘生成鱼
        let x, y;
        const side = Utils.randomInt(0, 3);
        switch (side) {
            case 0: // 左边
                x = -fishType.size;
                y = Utils.random(fishType.size, canvasHeight - 200);
                break;
            case 1: // 右边
                x = canvasWidth + fishType.size;
                y = Utils.random(fishType.size, canvasHeight - 200);
                break;
            case 2: // 上边
                x = Utils.random(fishType.size, canvasWidth - fishType.size);
                y = -fishType.size;
                break;
            case 3: // 下边
                x = Utils.random(fishType.size, canvasWidth - fishType.size);
                y = canvasHeight - 120;
                break;
        }

        const fish = new Fish(x, y, fishType.name, this.difficulty);
        this.fish.push(fish);
    }

    draw(ctx) {
        this.fish.forEach(fish => fish.draw(ctx));
    }

    // 检查鱼是否被点击
    checkClick(x, y) {
        for (let i = this.fish.length - 1; i >= 0; i--) {
            if (this.fish[i].isClicked(x, y)) {
                return this.fish[i];
            }
        }
        return null;
    }

    // 检查渔网捕获
    checkNetCapture(netX, netY, netRadius) {
        const caughtFish = [];
        for (let i = this.fish.length - 1; i >= 0; i--) {
            if (this.fish[i].isInNet(netX, netY, netRadius)) {
                caughtFish.push(this.fish[i]);
                this.fish[i].getCaught();
            }
        }
        return caughtFish;
    }

    // 清空所有鱼
    clear() {
        this.fish = [];
    }

    // 设置难度
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.config = GameConfig.DIFFICULTY[difficulty.toUpperCase()];
    }
} 