/**
 * 工具函数模块
 * 提供游戏中使用的通用工具函数
 */

/**
 * 检测两个矩形是否碰撞
 * @param {Object} rect1 - 第一个矩形对象，包含x, y, width, height属性
 * @param {Object} rect2 - 第二个矩形对象，包含x, y, width, height属性
 * @returns {boolean} - 是否碰撞
 */
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

/**
 * 生成指定范围内的随机数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} - 随机数
 */
function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * 预加载图片资源
 * @param {string} src - 图片路径
 * @returns {Promise} - Promise对象，图片加载完成后resolve
 */
function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

/**
 * 批量预加载图片资源
 * @param {Array<string>} sources - 图片路径数组
 * @param {Function} progressCallback - 进度回调函数
 * @returns {Promise} - Promise对象，所有图片加载完成后resolve
 */
function preloadImages(sources, progressCallback) {
    let loaded = 0;
    const total = sources.length;
    
    return Promise.all(sources.map(src => {
        return preloadImage(src).then(img => {
            loaded++;
            if (progressCallback) {
                progressCallback(loaded / total);
            }
            return img;
        });
    }));
}

/**
 * 创建游戏资源对象
 * @returns {Object} - 包含所有游戏资源路径的对象
 */
function createGameAssets() {
    return {
        player: {
            level1: 'img/player/player1.png',
            level2: 'img/player/player2.png',
            level3: 'img/player/player3.png'
        },
        enemy: {
            small: 'img/enemy/enemy1.png',
            medium: 'img/enemy/enemy2.png',
            large: 'img/enemy/enemy3.png'
        },
        bullet: {
            level1: 'img/bullet/bullet1.png',
            level2: 'img/bullet/bullet2.png',
            level3: 'img/bullet/bullet3.png'
        },
        powerup: 'img/powerup.png',
        explosion: 'img/explosion.png',
        background: 'img/bg.jpg'
    };
}

/**
 * 获取所有资源路径的数组
 * @param {Object} assets - 资源对象
 * @returns {Array<string>} - 资源路径数组
 */
function getAllAssetPaths(assets) {
    const paths = [];
    
    function extractPaths(obj) {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                paths.push(obj[key]);
            } else if (typeof obj[key] === 'object') {
                extractPaths(obj[key]);
            }
        }
    }
    
    extractPaths(assets);
    return paths;
}