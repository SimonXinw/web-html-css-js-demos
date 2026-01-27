/**
 * 中间滚轮逻辑
 */
export class Reels {
    constructor(containers, items) {
        this.containers = containers; // [el, el, el] - 3个 .reel-strip
        this.items = items;
        this.stripHeight = 0;
        this.itemHeight = 0; // 单个图标高度
        this.positions = [0, 0, 0]; // 当前3个滚轮的位置索引
        
        this.init();
    }
    
    init() {
        // 为每个滚轮生成内容
        // 为了模拟无限滚动，我们需要重复这些 items 很多次
        // 或者使用 translateY 并在动画结束后重置
        
        this.containers.forEach((strip, i) => {
            // 生成足够长的列表，例如重复 5 次 items
            let html = '';
            // 为了确定的结果，我们可以在列表末尾追加特定的目标元素
            // 但简单的做法是：随机生成一大长串，然后通过 CSS transform 移动到指定位置
            
            // 构建一个包含 50 个图标的 strip
            const stripItems = [];
            for(let j=0; j<30; j++) {
                const randomItem = this.items[Math.floor(Math.random() * this.items.length)];
                stripItems.push(randomItem);
            }
            
            // 渲染
            strip.innerHTML = stripItems.map(item => `
                <div class="reel-item" data-id="${item.id}">${item.icon}</div>
            `).join('');
            
            // 记录这些随机生成的 items，以便后续知道结果
            // 这里我们采取另一种策略：
            // 每次旋转时，我们在 strip 顶部追加新的元素，然后往下移动
            // 或者：直接移动 strip，当数值很大时重置
            
            // 简单方案：
            // Strip 里始终保持 items 序列。
            // 每次转动，计算目标位置。
        });
        
        // 延迟获取高度，确保 DOM 渲染完成
        setTimeout(() => {
            const firstItem = this.containers[0].querySelector('.reel-item');
            if(firstItem) {
                this.itemHeight = firstItem.offsetHeight;
            }
        }, 100);
    }
    
    /**
     * 开始转动
     * @param {Array} results - 预定的结果 [id1, id2, id3]
     * @returns {Promise} 动画结束
     */
    async spin(results) {
        const promises = this.containers.map((strip, index) => {
            return new Promise(resolve => {
                const targetId = results[index];
                
                // 1. 在当前 strip 下方追加一批新的随机图标 + 目标图标
                // 为了视觉上的“快速滚动”，我们追加比如 20 个图标，最后一个是目标图标
                // 并且为了平滑，要确保追加后的第一个和原来显示的最后一个视觉上连贯（其实不用太在意，因为速度快）
                
                const extraCount = 20 + index * 5; // 每个滚轮转的圈数不一样，制造错落感
                const newItemsFragment = document.createDocumentFragment();
                
                for(let k=0; k<extraCount; k++) {
                    const randomItem = this.items[Math.floor(Math.random() * this.items.length)];
                    const div = document.createElement('div');
                    div.className = 'reel-item';
                    div.textContent = randomItem.icon;
                    div.dataset.id = randomItem.id;
                    newItemsFragment.appendChild(div);
                }
                
                // 最后一个必须是目标图标
                const targetItem = this.items.find(i => i.id === targetId);
                const targetDiv = document.createElement('div');
                targetDiv.className = 'reel-item';
                targetDiv.textContent = targetItem.icon;
                targetDiv.dataset.id = targetId;
                newItemsFragment.appendChild(targetDiv);
                
                // 再加一个垫底的，防止边缘显示问题（可选）
                
                strip.appendChild(newItemsFragment);
                
                // 2. 计算滚动距离
                // 当前 translateY 是 0 (或者上次的位置)
                // 实际上我们可以每次转动前重置 strip：
                // 把 strip 里的内容清空，只保留当前显示的那个（作为第一个），然后在下面追加新的
                
                // 获取当前显示的元素（上一次的目标）
                // 我们可以简单粗暴地清空，除了最后一个，然后瞬间重置 transform
                
                // 更好的策略：
                // 每次 spin 都是从 currentY = 0 开始（通过重置 DOM）
                
                // 获取当前显示的最后一个元素的内容，作为新 strip 的第一个
                // 如果是第一次运行，随机选一个
                let currentIcon = '🍎'; // default
                const children = strip.querySelectorAll('.reel-item');
                if (children.length > 0) {
                    // 上次滚动结束，最后一个元素是目标
                    currentIcon = children[children.length - 1].textContent;
                }
                
                // 重建 DOM
                strip.innerHTML = '';
                strip.style.transition = 'none';
                strip.style.transform = 'translateY(0)';
                
                // 第一个元素：保持视觉连贯
                const firstDiv = document.createElement('div');
                firstDiv.className = 'reel-item';
                firstDiv.textContent = currentIcon;
                strip.appendChild(firstDiv);
                
                // 追加滚动序列
                strip.appendChild(newItemsFragment);
                
                // 强制重绘
                strip.offsetHeight; 
                
                // 3. 执行动画
                // 目标是移动到 (totalChildren - 1) * itemHeight 的位置
                // 但是因为我们实际上显示的是窗口里的内容。
                // 假设窗口高度是 150px (约2-3个item)。我们需要目标元素停在中间。
                // 实际上我们只要让 strip 向上移动，直到 目标元素 位于窗口中心。
                
                // 我们简单的让 目标元素 成为 strip 的最后一个（或倒数第二个），
                // 然后移动 strip 使得目标元素对齐窗口中间。
                // 假设 .reel-window overflow:hidden.
                // strip 绝对定位 top:0.
                // 窗口高度 H_win. Item 高度 H_item.
                // 目标元素索引 index_target (从0开始).
                // 目标位置 Y = index_target * H_item.
                // 我们希望目标元素的中心 = 窗口中心。
                // Y + H_item/2 = H_win/2  => Y = H_win/2 - H_item/2
                // Strip 的 translateY 应该为 -Y + offset?
                // Strip 初始 top:0. 要把内容往上推，translateY 是负值。
                // Strip 移动距离 = - (index_target * H_item - (H_win - H_item)/2)
                
                const totalItems = strip.children.length;
                const targetIndex = totalItems - 1; // 也就是我们要展示的那个
                
                const windowHeight = strip.parentElement.offsetHeight;
                const itemHeight = this.itemHeight || 60; // fallback
                
                // 计算目标 translate Y
                // 我们希望 targetIndex 的那个元素位于中间
                // 偏移量 = (WindowHeight - ItemHeight) / 2
                const offset = (windowHeight - itemHeight) / 2;
                const targetY = -(targetIndex * itemHeight - offset);
                
                // 动画配置
                const duration = 2000 + index * 500; // 2s, 2.5s, 3s
                strip.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
                strip.style.transform = `translateY(${targetY}px)`;
                
                // 监听结束
                setTimeout(() => {
                    resolve();
                }, duration);
            });
        });
        
        return Promise.all(promises);
    }
}
