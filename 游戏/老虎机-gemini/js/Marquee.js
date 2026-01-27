/**
 * 跑马灯逻辑控制
 */
export class Marquee {
    constructor(containerInfo, items) {
        this.containerInfo = containerInfo; // { top: el, right: el, bottom: el, left: el }
        this.items = items;
        this.cells = []; // 存储所有的 DOM 元素
        this.currentIndex = 0;
        this.totalCells = 24; // 8 top + 4 right + 8 bottom + 4 left
        
        this.init();
    }

    init() {
        // 布局设计：
        // Top: 8 cells
        // Right: 4 cells
        // Bottom: 8 cells (reversed order for visual loop)
        // Left: 4 cells (reversed order)
        
        // 这是一个环形，我们按顺时针顺序填充
        // Top row: 0-7 (Left to Right)
        // Right col: 8-11 (Top to Bottom)
        // Bottom row: 12-19 (Right to Left)
        // Left col: 20-23 (Bottom to Top)

        // 生成随机的布局数据，保证每个奖项都有出现，但低倍率的出现多一些
        const layout = this.generateLayout();
        
        this.renderRow(this.containerInfo.top, layout.slice(0, 8));
        this.renderCol(this.containerInfo.right, layout.slice(8, 12));
        // Bottom 需要反向渲染 DOM 才能在 flex-direction: row 中看起来是从右到左（或者我们在 CSS 里处理，或者这里倒序）
        // 为了简单，我们让 Bottom 是 flex-row-reverse 吗？或者直接按顺序插入 DOM
        // 这里我们按 DOM 顺序插入，但是在逻辑索引上它是 12-19
        // 视觉上 Bottom 是从右到左，所以 DOM 顺序应该是 19, 18 ... 12 ? 
        // 不，通常 HTML 顺序是从左到右。
        // 所以 19 是左下角，12 是右下角。
        // 顺时针：Top(L->R) -> Right(T->B) -> Bottom(R->L) -> Left(B->T)
        // 所以 Bottom 的 DOM 应该对应索引 19, 18, 17... 12
        this.renderRow(this.containerInfo.bottom, layout.slice(12, 20).reverse());
        
        // Left: 23, 22, 21, 20
        this.renderCol(this.containerInfo.left, layout.slice(20, 24).reverse());

        // 重新整理 this.cells 按顺时针索引顺序 0-23
        // 上面 render 方法里已经把元素 push 进去了，但是 push 的顺序不对
        // 我们需要重新查询或者在 render 时记录
        // 简单方法：给每个 cell 加 data-index
    }
    
    generateLayout() {
        // 简单填充：重复 items 直到填满 24 个
        // 确保高倍率的少
        let layout = [];
        // 8种物品，24个格子。
        // 分布建议：
        // Apple (2x): 6
        // Orange (5x): 5
        // Lemon (10x): 4
        // Bell (15x): 3
        // Watermelon (20x): 2
        // Grape (30x): 2
        // Bar (50x): 1
        // Seven (100x): 1
        
        const distribution = [
            'apple', 'apple', 'apple', 'apple', 'apple', 'apple',
            'orange', 'orange', 'orange', 'orange', 'orange',
            'lemon', 'lemon', 'lemon', 'lemon',
            'bell', 'bell', 'bell',
            'watermelon', 'watermelon',
            'grape', 'grape',
            'bar',
            'seven'
        ];
        
        // 打乱数组
        for (let i = distribution.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [distribution[i], distribution[j]] = [distribution[j], distribution[i]];
        }
        
        return distribution.map(id => this.items.find(item => item.id === id));
    }

    renderRow(container, items) {
        items.forEach(item => {
            const cell = this.createCell(item);
            container.appendChild(cell);
        });
    }

    renderCol(container, items) {
        items.forEach(item => {
            const cell = this.createCell(item);
            container.appendChild(cell);
        });
    }

    createCell(item) {
        const el = document.createElement('div');
        el.className = 'marquee-cell';
        el.innerHTML = `
            <span class="icon">${item.icon}</span>
            <span class="multiplier">x${item.rate}</span>
        `;
        el.dataset.id = item.id;
        // 暂存到数组，稍后排序
        this.cellsTemp = this.cellsTemp || [];
        this.cellsTemp.push(el);
        return el;
    }

    // 必须在 DOM 插入后调用，整理 cells 顺序
    reorderCells() {
        // 由于 DOM 插入顺序是 Top(L-R), Right(T-B), Bottom(L-R), Left(T-B)
        // 但我们需要逻辑顺序：Top(0-7), Right(8-11), Bottom(19-12), Left(23-20)
        
        // 目前 DOM 里的顺序：
        // Top: 0-7
        // Right: 8-11
        // Bottom: 19...12 (因为我是 reverse 后 append 的) -> 所以 DOM 里的第1个 Bottom 元素对应逻辑索引 19
        // Left: 23...20 -> DOM 第1个 Left 元素对应逻辑索引 23
        
        // 实际上我需要按逻辑索引访问 cells
        // 我们可以直接从 container 获取 children
        
        const topCells = Array.from(this.containerInfo.top.children);
        const rightCells = Array.from(this.containerInfo.right.children);
        const bottomCells = Array.from(this.containerInfo.bottom.children);
        const leftCells = Array.from(this.containerInfo.left.children);
        
        // 逻辑顺序 0-23
        this.cells = [
            ...topCells,                        // 0-7
            ...rightCells,                      // 8-11
            ...bottomCells.reverse(),           // 12-19 (DOM 是 19..12，reverse 回来就是 12..19)
            ...leftCells.reverse()              // 20-23 (DOM 是 23..20, reverse 回来就是 20..23)
        ];
        
        // 验证
        // console.log("Marquee Cells Initialized:", this.cells.length);
    }
    
    highlight(index) {
        // 清除上一个高亮
        if (this.lastActiveIndex !== undefined && this.cells[this.lastActiveIndex]) {
            this.cells[this.lastActiveIndex].classList.remove('active');
        }
        
        // 设置新的高亮
        const cell = this.cells[index];
        if (cell) {
            cell.classList.add('active');
            this.lastActiveIndex = index;
        }
    }
    
    getItemAt(index) {
        const cell = this.cells[index];
        return cell ? cell.dataset.id : null;
    }

    reset() {
        if (this.lastActiveIndex !== undefined) {
            this.cells[this.lastActiveIndex].classList.remove('active');
            this.lastActiveIndex = undefined;
        }
    }
}
