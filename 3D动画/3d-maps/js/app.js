import { LOCATIONS } from "./config.js";

// DOM 元素引用
const mapContainer = document.getElementById("map-container");
const locationButtonsContainer = document.getElementById("location-buttons");
const headingSlider = document.getElementById("heading-slider");
const tiltSlider = document.getElementById("tilt-slider");
const rangeSlider = document.getElementById("range-slider");
const headingValue = document.getElementById("heading-value");
const tiltValue = document.getElementById("tilt-value");
const rangeValue = document.getElementById("range-value");

let map3DElement = null;
let isAnimating = false;

/**
 * 初始化 3D 地图应用
 */
const initApp = async () => {
    try {
        // 动态导入 3D Maps 库 (需要 alpha 版本的 API)
        const { Map3DElement } = await google.maps.importLibrary("maps3d");

        // 创建 3D 地图实例 (默认使用配置中的第一个地点)
        const defaultLocation = LOCATIONS[0];
        
        map3DElement = new Map3DElement({
            center: defaultLocation.center,
            heading: defaultLocation.heading,
            tilt: defaultLocation.tilt,
            range: defaultLocation.range,
        });

        // 将地图挂载到容器中
        mapContainer.appendChild(map3DElement);

        // 绑定事件和 UI
        setupUI();
        setupMapEvents();

    } catch (error) {
        console.error("加载 3D 地图失败:", error);
        mapContainer.innerHTML = `
            <div style="color: white; padding: 20px; font-family: sans-serif;">
                <h3>加载地图失败</h3>
                <p>请确保您的 API Key 启用了 Photorealistic 3D Maps，并且使用了 alpha 版本的 API。</p>
                <p style="color: #ff5252">错误信息: ${error.message}</p>
            </div>
        `;
    }
};

/**
 * 渲染按钮和绑定滑动条事件
 */
const setupUI = () => {
    // 1. 渲染地点切换按钮
    LOCATIONS.forEach((location, index) => {
        const btn = document.createElement("button");
        btn.className = `location-btn ${index === 0 ? "active" : ""}`;
        btn.textContent = location.name;
        
        btn.addEventListener("click", () => {
            // 更新活跃状态
            document.querySelectorAll(".location-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // 飞向新地点
            flyToLocation(location);
        });

        locationButtonsContainer.appendChild(btn);
    });

    // 2. 绑定滑动条事件 (修改视角)
    const updateCameraFromSliders = () => {
        if (!map3DElement) return;
        
        const heading = parseFloat(headingSlider.value);
        const tilt = parseFloat(tiltSlider.value);
        const range = parseFloat(rangeSlider.value);

        // 更新文本显示
        headingValue.textContent = `${heading}°`;
        tiltValue.textContent = `${tilt}°`;
        rangeValue.textContent = `${range}m`;

        // 直接更新地图参数实现即时响应
        map3DElement.heading = heading;
        map3DElement.tilt = tilt;
        map3DElement.range = range;
    };

    // 使用 input 事件实现拖拽时的实时更新
    headingSlider.addEventListener("input", updateCameraFromSliders);
    tiltSlider.addEventListener("input", updateCameraFromSliders);
    rangeSlider.addEventListener("input", updateCameraFromSliders);
};

/**
 * 飞行动画 (3D 过渡)
 * @param {Object} location 目标地点配置
 */
const flyToLocation = (location) => {
    if (!map3DElement) return;

    // 标记正在动画中，避免地图内部事件冲突修改滑动条
    isAnimating = true;

    // 更新滑动条 UI 以匹配新地点
    headingSlider.value = location.heading;
    tiltSlider.value = location.tilt;
    rangeSlider.value = location.range;
    
    headingValue.textContent = `${location.heading}°`;
    tiltValue.textContent = `${location.tilt}°`;
    rangeValue.textContent = `${location.range}m`;

    // 使用 flyCameraTo 方法实现平滑的 3D 飞行过渡
    map3DElement.flyCameraTo({
        endCamera: {
            center: location.center,
            heading: location.heading,
            tilt: location.tilt,
            range: location.range
        },
        durationMillis: 3000 // 飞行持续时间 3 秒
    });

    // 动画结束后解除标记
    setTimeout(() => {
        isAnimating = false;
    }, 3100);
};

/**
 * 监听用户在地图上的鼠标交互，反向更新左侧的滑动条
 */
const setupMapEvents = () => {
    if (!map3DElement) return;

    const updateUIFromCamera = () => {
        // 如果正在执行代码触发的飞行动画，则不覆盖滑动条状态
        if (isAnimating) return;

        const currentHeading = Math.round(map3DElement.heading || 0);
        const currentTilt = Math.round(map3DElement.tilt || 0);
        const currentRange = Math.round(map3DElement.range || 0);

        // 更新滑动条和文本
        headingSlider.value = currentHeading;
        tiltSlider.value = currentTilt;
        rangeSlider.value = currentRange;

        headingValue.textContent = `${currentHeading}°`;
        tiltValue.textContent = `${currentTilt}°`;
        rangeValue.textContent = `${currentRange}m`;
    };

    // 监听视角变化相关的几个核心事件
    map3DElement.addEventListener("gmp-headingchange", updateUIFromCamera);
    map3DElement.addEventListener("gmp-tiltchange", updateUIFromCamera);
    map3DElement.addEventListener("gmp-rangechange", updateUIFromCamera);
};

// 启动应用
initApp();
