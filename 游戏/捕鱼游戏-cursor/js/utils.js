// 工具函数集合
const Utils = {
    // 计算两点之间的距离
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },

    // 计算两点之间的角度
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },

    // 角度转弧度
    toRadians(degrees) {
        return degrees * Math.PI / 180;
    },

    // 弧度转角度
    toDegrees(radians) {
        return radians * 180 / Math.PI;
    },

    // 在范围内生成随机数
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    // 生成随机整数
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // 检查两个圆形是否碰撞
    circleCollision(x1, y1, r1, x2, y2, r2) {
        const distance = this.distance(x1, y1, x2, y2);
        return distance < r1 + r2;
    },

    // 检查点是否在圆形内
    pointInCircle(px, py, cx, cy, radius) {
        return this.distance(px, py, cx, cy) <= radius;
    },

    // 限制数值在范围内
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    // 线性插值
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },

    // 从数组中随机选择一个元素
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    // 获取设备类型
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    // 创建涟漪效果
    createRipple(x, y, container) {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        ripple.style.left = x - 10 + 'px';
        ripple.style.top = y - 10 + 'px';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        container.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    },

    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// 游戏常量
const GameConfig = {
    // 游戏设置
    FPS: 60,
    CANVAS_WIDTH: window.innerWidth,
    CANVAS_HEIGHT: window.innerHeight,

    // 难度设置
    DIFFICULTY: {
        EASY: {
            fishSpeed: 0.5,
            fishSpawnRate: 0.02,
            maxFish: 8,
            scoreMultiplier: 1
        },
        MEDIUM: {
            fishSpeed: 1,
            fishSpawnRate: 0.025,
            maxFish: 12,
            scoreMultiplier: 1.5
        },
        HARD: {
            fishSpeed: 1.5,
            fishSpawnRate: 0.03,
            maxFish: 16,
            scoreMultiplier: 2
        }
    },

    // 鱼类配置
    FISH_TYPES: [
        { 
            name: 'small', 
            color: '#FFD700', 
            size: 20, 
            score: 10, 
            speed: 1,
            symbol: '🐟'
        },
        { 
            name: 'medium', 
            color: '#FF6B6B', 
            size: 35, 
            score: 25, 
            speed: 0.8,
            symbol: '🐠'
        },
        { 
            name: 'large', 
            color: '#4ECDC4', 
            size: 50, 
            score: 50, 
            speed: 0.6,
            symbol: '🐡'
        },
        { 
            name: 'shark', 
            color: '#95A5A6', 
            size: 80, 
            score: 100, 
            speed: 0.4,
            symbol: '🦈'
        },
        { 
            name: 'whale', 
            color: '#3498DB', 
            size: 120, 
            score: 200, 
            speed: 0.3,
            symbol: '🐋'
        }
    ],

    // 炮台配置
    CANNON: {
        width: 80,
        height: 100,
        x: 0, // 将在初始化时设置
        y: 0, // 将在初始化时设置
        maxAngle: Math.PI / 3, // 最大旋转角度 (60度)
        levels: [
            { cost: 10, power: 1, netSize: 30, color: '#3498DB' },
            { cost: 20, power: 2, netSize: 40, color: '#9B59B6' },
            { cost: 40, power: 3, netSize: 50, color: '#E74C3C' },
            { cost: 80, power: 4, netSize: 60, color: '#F39C12' },
            { cost: 160, power: 5, netSize: 70, color: '#1ABC9C' }
        ]
    },

    // 子弹配置
    BULLET: {
        speed: 8,
        radius: 5
    },

    // 渔网配置
    NET: {
        expandSpeed: 3,
        maxRadius: 100,
        duration: 1000 // 毫秒
    }
}; 