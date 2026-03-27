/**
 * map.js
 * Google Maps 地图管理：初始化、移动视角、渲染门店标记、渲染用户位置标记
 *
 * 对外暴露 MapManager 对象，供 modal.js 调用。
 */

const MapManager = (() => {
  /** Google Maps 实例 */
  let mapInstance = null;

  /** 门店标记缓存：{ [storeId]: AdvancedMarkerElement } */
  const storeMarkers = {};

  /** 用户位置标记 */
  let userMarker = null;

  /**
   * 初始化地图
   * 必须在 Google Maps 脚本加载完毕后调用
   *
   * @param {HTMLElement} container - 挂载容器
   * @param {{ lat: number, lng: number }} center - 初始中心
   * @param {number} zoom - 初始缩放
   */
  function init(container, center, zoom) {
    if (mapInstance) return;

    mapInstance = new google.maps.Map(container, {
      center,
      zoom,
      mapId: "DEMO_MAP_ID", // AdvancedMarkerElement 必须提供 mapId
      disableDefaultUI: false,
    });
  }

  /**
   * 移动地图中心并设置缩放级别
   *
   * @param {{ lat: number, lng: number }} center
   * @param {number} zoom
   */
  function panTo(center, zoom) {
    if (!mapInstance) return;

    mapInstance.panTo(center);

    if (zoom !== undefined) {
      mapInstance.setZoom(zoom);
    }
  }

  /**
   * 渲染/更新用户位置标记（蓝色圆点 + 脉冲动画）
   *
   * @param {{ lat: number, lng: number } | null} userAnchor
   */
  function renderUserMarker(userAnchor) {
    if (!mapInstance || !google.maps.marker) return;

    if (!userAnchor) {
      /* 清除已有标记 */
      if (userMarker) {
        userMarker.map = null;
        userMarker = null;
      }
      return;
    }

    if (userMarker) {
      /* 已有标记，只更新位置 */
      userMarker.position = userAnchor;
      return;
    }

    /* 自定义蓝点 DOM */
    const content = document.createElement("div");
    content.innerHTML = `
      <style>
        @keyframes userLocPulse {
          0%   { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      </style>
      <div style="position:relative;width:24px;height:24px;">
        <div style="
          position:absolute;top:-8px;left:-8px;right:-8px;bottom:-8px;
          background:rgba(66,133,244,0.2);
          border-radius:50%;
          animation:userLocPulse 2s infinite;
        "></div>
        <div style="
          width:24px;height:24px;
          background:#4285F4;
          border:3px solid #fff;
          border-radius:50%;
          box-shadow:0 0 6px rgba(0,0,0,0.5);
          position:relative;
          z-index:1;
        "></div>
      </div>
    `;

    userMarker = new google.maps.marker.AdvancedMarkerElement({
      map: mapInstance,
      position: userAnchor,
      content,
      title: "My Location",
      zIndex: 999,
    });
  }

  /**
   * 渲染/更新门店标记
   * - 新增：创建头像圆形标记
   * - 已有：更新激活状态样式
   * - 删除：移除不在 stores 列表中的旧标记
   *
   * @param {Array} stores - 门店列表
   * @param {string|null} activeStoreId - 当前激活的门店 ID
   * @param {function} onStoreClick - 点击标记回调 (storeId: string) => void
   */
  function renderStoreMarkers(stores, activeStoreId, onStoreClick) {
    if (!mapInstance || !google.maps.marker) return;

    /* 删除已不在列表中的旧标记 */
    const currentIds = stores.map((s) => s.id);

    Object.keys(storeMarkers).forEach((id) => {
      if (!currentIds.includes(id)) {
        storeMarkers[id].map = null;
        delete storeMarkers[id];
      }
    });

    /* 创建或更新标记 */
    stores.forEach((store) => {
      if (!storeMarkers[store.id]) {
        /* 自定义头像标记 */
        const content = document.createElement("div");
        content.className = "custom_store_marker";
        content.innerHTML = `
          <div class="marker_avatar" style="
            width:40px;height:40px;
            border-radius:50%;
            border:3px solid #fff;
            background-image:url(${store.avatar || "https://i.pravatar.cc/150"});
            background-size:cover;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
            cursor:pointer;
            transition:transform 0.2s,border-color 0.2s;
          "></div>
          <div style="
            width:0;height:0;
            border-left:6px solid transparent;
            border-right:6px solid transparent;
            border-top:8px solid #fff;
            margin:0 auto;
          "></div>
        `;

        content.addEventListener("click", () => onStoreClick(store.id));

        storeMarkers[store.id] = new google.maps.marker.AdvancedMarkerElement({
          map: mapInstance,
          position: { lat: store.lat, lng: store.lng },
          content,
          title: store.name,
        });
      }

      /* 更新激活状态样式 */
      const markerEl = storeMarkers[store.id].content;
      const avatar = markerEl.querySelector(".marker_avatar");

      if (avatar) {
        if (store.id === activeStoreId) {
          avatar.style.transform = "scale(1.25)";
          avatar.style.borderColor = "#4A90E2";
          storeMarkers[store.id].zIndex = 100;
        } else {
          avatar.style.transform = "scale(1)";
          avatar.style.borderColor = "#fff";
          storeMarkers[store.id].zIndex = 1;
        }
      }
    });
  }

  /**
   * 销毁地图（弹窗关闭时可选调用，此处不销毁以保留缓存）
   */
  function destroy() {
    Object.keys(storeMarkers).forEach((id) => {
      storeMarkers[id].map = null;
      delete storeMarkers[id];
    });

    if (userMarker) {
      userMarker.map = null;
      userMarker = null;
    }

    mapInstance = null;
  }

  return { init, panTo, renderUserMarker, renderStoreMarkers, destroy };
})();
