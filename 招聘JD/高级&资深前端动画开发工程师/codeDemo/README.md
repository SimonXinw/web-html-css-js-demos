# 动画交互 Code Demos

这是我针对 **高级&资深前端动画开发工程师** 职位准备的动画技术演示。代码中包含详细注释，解释了实现原理、数学公式及性能优化策略。

## 目录

### 1. [Lerp Mouse Follow (物理平滑跟随)](./lerp-mouse-follow.html)
- **难度**: ⭐ (简单)
- **核心技术**: 
  - `requestAnimationFrame` 渲染循环
  - `Lerp` (Linear Interpolation) 线性插值公式
  - `translate3d` 开启 GPU 硬件加速 (Composite Layer)
- **说明**: 基础的鼠标跟随效果，但通过分离“实时点”和“阻尼圈”，演示了物理感动画的基本原理。

### 2. [Apple-style Scroll Sequence (Canvas 序列帧)](./canvas-scroll-sequence.html)
- **难度**: ⭐⭐⭐ (复杂)
- **核心技术**: 
  - Canvas 2D 绘图性能优化
  - 图片资源预加载策略 (Promise based)
  - 滚动位置到帧索引的映射算法
- **说明**: 模拟 Apple 官网常见的产品滚动展示效果（如 AirPods Pro 页面）。解决了图片加载闪烁、滚动流畅度等问题。

### 3. [SVG Path Drawing (SVG 描边动画)](./svg-scroll-draw.html)
- **难度**: ⭐⭐ (中等)
- **核心技术**: 
  - SVG `stroke-dasharray` & `stroke-dashoffset` 原理
  - `path.getTotalLength()` API
  - 滚动进度归一化计算
- **说明**: 经典的“手写签名”或“线条生长”效果，完全基于原生 JS 和 SVG 属性实现。

### 4. [Complex Parallax & Scrollytelling (视差滚动叙事)](./complex-parallax.html)
- **难度**: ⭐⭐⭐ (复杂)
- **核心技术**: 
  - CSS 3D Transforms (`perspective`, `translateZ`) 实现高性能背景视差
  - JS 驱动的前景交互 (结合 `IntersectionObserver` 优化)
  - `position: sticky` 粘性布局应用
- **说明**: 结合了 CSS 纯视觉视差和 JS 逻辑控制，展示了复杂的页面叙事结构。

### 5. [Clip-Path Reveal (遮罩放大转场)](./clip-path-reveal.html)
- **难度**: ⭐⭐ (进阶)
- **核心技术**: 
  - 勾股定理计算圆半径
  - `clip-path: circle()`
  - 坐标空间转换
- **说明**: 模拟 Material Design 风格的点击扩散转场，精确计算覆盖全屏所需的最小半径。

### 6. [Spring Physics vs Easing (弹簧物理 vs 贝塞尔)](./spring-physics.html)
- **难度**: ⭐⭐ (进阶)
- **核心技术**: 
  - 简易物理引擎实现 (Hooke's Law)
  - 动量连续性 (Momentum Conservation)
  - 交互中断 (Interruption) 对比
- **说明**: 直观对比传统 CSS Easing 与基于物理的 Spring 动画在交互中断时的手感差异。

### 7. [Batch Animation & Stagger (批量动画性能优化)](./batch-stagger.html)
- **难度**: ⭐⭐ (中等)
- **核心技术**: 
  - DocumentFragment 批量插入
  - Time Slicing (时间分片) 渲染
  - `will-change` 优化
- **说明**: 展示当处理 2000+ 元素动画时，如何通过 JS 分时处理 (Stagger) 来避免主线程阻塞导致的掉帧。

---

## 性能优化清单 (Checklist)

在所有 Demo 中，我都遵循了以下性能原则：
1. **避免 Layout Thrashing (布局抖动)**: 读写 DOM 属性分离。
2. **Promote to Composite Layer**: 对动画元素使用 `will-change: transform` 或 `translate3d`。
3. **60FPS 目标**: 使用 `requestAnimationFrame` 而非 `setTimeout`。
4. **资源管理**: 对重型资源（如序列帧）进行预加载。
