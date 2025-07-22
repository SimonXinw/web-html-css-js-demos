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
            d: false,
            Escape: false,
            p: false
        };
        
        this.game = null;
        
        // 按键按下事件
        window.addEventListener('keydown', e => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
                e.preventDefault(); // 防止默认行为
            }
        });
        
        // 按键释放事件
        window.addEventListener('keyup', e => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
                e.preventDefault(); // 防止默认行为
            }
        });
        
        // 防止右键菜单
        window.addEventListener('contextmenu', e => {
            e.preventDefault();
        });
        
        // 防止页面滚动
        window.addEventListener('scroll', e => {
            e.preventDefault();
        });
    }
    
    /**
     * 设置游戏实例
     * @param {Game} game - 游戏实例
     */
    setGame(game) {
        this.game = game;
    }
    
    /**
     * 检查暂停键
     */
    checkPauseKey() {
        if (this.keys.Escape || this.keys.p) {
            this.keys.Escape = false;
            this.keys.p = false;
            return true;
        }
        return false;
    }
    
    /**
     * 重置所有按键状态
     */
    resetKeys() {
        Object.keys(this.keys).forEach(key => {
            this.keys[key] = false;
        });
    }
} 