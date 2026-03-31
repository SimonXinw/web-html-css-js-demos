/**
 * modal.js
 * 弹窗主控制器，整合所有子模块：
 *  - 弹窗开关
 *  - 门店数据加载
 *  - 浏览器定位
 *  - 搜索框 Places Autocomplete
 *  - 侧边栏门店列表渲染
 *  - 地图联动
 *
 * 依赖（按 index.html 加载顺序）：config.js → utils.js → map.js → modal.js
 */

/* ============================================================
   状态
   ============================================================ */
const State = {
  isOpen: false,
  mapsReady: false,
  stores: [],
  activeStoreId: null,
  mapCenter: { ...getInitialMapCenter() },
  zoom: DEFAULT_ZOOM,
  /** 用于距离计算的用户锚点（搜索选中 / 定位） */
  userAnchor: null,
  /** { [storeId]: km } */
  distancesKm: {},
  /** Places Autocomplete Session Token（用于 API 计费分组） */
  sessionToken: null,
  /** 门店列表接口加载中 */
  storeListFetching: false,
  /** 选点 fetchFields、逆地理、距离重算等（与组件 isListAuxLoading 一致） */
  listAuxBusy: false,
};

/** 地图挂在 #googleMap（桌面）还是 #googleMapMobile（移动槽位），与 valerion 双容器策略一致 */
let mapLayoutMode = null;

/* ============================================================
   DOM 节点引用
   ============================================================ */
const $ = (id) => document.getElementById(id);

const Els = {
  openBtn: $("openStoreFinder"),
  modal: $("storeFinderModal"),
  overlay: $("modalOverlay"),
  closeBtn: $("closeModal"),
  storeList: $("storeList"),
  spinnerOverlay: $("spinnerOverlay"),
  mapLoading: $("mapLoading"),
  mapLoadingMobile: $("mapLoadingMobile"),
  searchInput: $("searchInput"),
  searchDropdown: $("searchDropdown"),
  locateBtn: $("locateBtn"),
  locationDeniedModal: $("locationDeniedModal"),
  locationDeniedClose: $("locationDeniedClose"),
  locationDeniedOverlay: $("locationDeniedOverlay"),
  gotItBtn: $("gotItBtn"),
  searchDesc: $("searchDesc"),
  modalTitle: $("modalTitle"),
  locationDeniedTitle: $("locationDeniedTitle"),
  locationDeniedDesc: $("locationDeniedDesc"),
};

/* ============================================================
   弹窗开关
   ============================================================ */

/** 打开弹窗 */
function openModal() {
  State.isOpen = true;
  Els.modal.classList.add("active");
  document.body.style.overflow = "hidden";

  /* 地图已就绪时：对齐当前视口容器并触发 resize（避免仅依赖 window.resize） */
  if (State.mapsReady) {
    syncMapToLayout();
  }

  loadStores();
  tryAutoLocate();
}

/** 关闭弹窗并重置部分状态 */
function closeModal() {
  State.isOpen = false;
  Els.modal.classList.remove("active");
  document.body.style.overflow = "";

  /* 重置搜索框 & 用户锚点 */
  Els.searchInput.value = "";
  Els.searchDropdown.classList.remove("visible");
  Els.searchDropdown.innerHTML = "";
  State.userAnchor = null;
  State.distancesKm = {};
  State.activeStoreId = null;
  State.storeListFetching = false;
  State.listAuxBusy = false;
  refreshListOverlay();

  State.mapCenter = { ...getInitialMapCenter() };
  State.zoom = DEFAULT_ZOOM;
  if (State.mapsReady) {
    MapManager.panTo(State.mapCenter, State.zoom);
  }

  MapManager.renderUserMarker(null);

  if (State.mapsReady) {
    MapManager.renderStoreMarkers(State.stores, null, getMapMarkerOptions());
  }
}

/* ============================================================
   门店数据加载
   ============================================================ */

async function loadStores() {
  setStoreListFetching(true);

  try {
    const stores = await fetchStores();
    State.stores = stores;
    renderSidebar();

    /* 地图已就绪则同步渲染标记 */
    if (State.mapsReady) {
      MapManager.renderStoreMarkers(stores, State.activeStoreId, getMapMarkerOptions());
    }

    if (State.userAnchor) {
      void recalcDistancesWithOverlay();
    }
  } catch (err) {
    console.error("[modal] loadStores failed:", err);
    renderSidebarError();
  } finally {
    setStoreListFetching(false);
  }
}

/* ============================================================
   浏览器自动定位（弹窗打开时静默触发）
   ============================================================ */

function tryAutoLocate() {
  if (
    typeof window === "undefined" ||
    !window.isSecureContext ||
    !navigator.geolocation
  ) {
    return;
  }

  /* 延迟 0ms 避免阻塞弹窗动画（与组件一致） */
  setTimeout(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        State.mapCenter = { lat, lng };
        State.zoom = 12;
        State.userAnchor = { lat, lng };

        if (State.mapsReady) {
          MapManager.panTo({ lat, lng }, 12);
          MapManager.renderUserMarker({ lat, lng });
        }

        setListAuxBusy(true);
        try {
          if (State.mapsReady) {
            const address = await geocodeLatLngToFormattedAddress(lat, lng);
            const displayText =
              address ||
              (STORE_FINDER_COPY.currentLocationText || "").trim() ||
              `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

            if (State.isOpen) {
              Els.searchInput.value = displayText;
            }
          }

          if (State.stores.length > 0) {
            State.distancesKm = computeAllDistancesKm(State.userAnchor, State.stores);
            renderSidebar();
          }
        } finally {
          setListAuxBusy(false);
        }
      },
      () => {
        /* 拒绝或超时：回退到当前 locale 默认城市（与 handleFallbackToLocaleCity 一致） */
        fallbackToLocaleCity();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, 0);
}

/* ============================================================
   定位按钮（手动触发）
   ============================================================ */

function handleLocateMe() {
  if (!navigator.geolocation) {
    alert("当前浏览器不支持地理位置。");
    return;
  }

  if (!window.isSecureContext) {
    alert("定位功能需要在 HTTPS 或 localhost 环境下使用。");
    return;
  }

  Els.locateBtn.classList.add("locating");
  setListAuxBusy(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      Els.locateBtn.classList.remove("locating");
      State.userAnchor = { lat, lng };
      State.mapCenter = { lat, lng };
      State.zoom = 12;

      if (State.mapsReady) {
        MapManager.panTo({ lat, lng }, 12);
        MapManager.renderUserMarker({ lat, lng });
      }

      try {
        if (State.mapsReady) {
          const address = await geocodeLatLngToFormattedAddress(lat, lng);
          const displayText =
            address ||
            (STORE_FINDER_COPY.currentLocationText || "").trim() ||
            `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

          Els.searchInput.value = displayText;
        } else {
          Els.searchInput.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }

        if (State.stores.length > 0) {
          State.distancesKm = computeAllDistancesKm(State.userAnchor, State.stores);
          renderSidebar();
        }
      } catch (geocodeErr) {
        console.error("[modal] Locate geocode error:", geocodeErr);
      } finally {
        setListAuxBusy(false);
      }
    },
    (err) => {
      Els.locateBtn.classList.remove("locating");
      setListAuxBusy(false);

      if (err.code === 1) {
        Els.locationDeniedModal.style.display = "flex";
        fallbackToLocaleCity();
      } else {
        console.warn("[modal] Geolocation error:", err.message);
      }
    },
    { enableHighAccuracy: false, timeout: 20000, maximumAge: 300000 }
  );
}

/* ============================================================
   Places Autocomplete 搜索框
   ============================================================ */

/** 获取或创建 Session Token */
async function getSessionToken() {
  if (!State.sessionToken) {
    const { AutocompleteSessionToken } = await google.maps.importLibrary("places");
    State.sessionToken = new AutocompleteSessionToken();
  }
  return State.sessionToken;
}

/** 输入框变化 → 请求 Places 预测建议 */
async function handleSearchInput(e) {
  const val = e.target.value.trim();

  if (!val) {
    hideSuggestions();
    return;
  }

  if (!State.mapsReady) return;

  try {
    const { AutocompleteSuggestion } = await google.maps.importLibrary("places");
    const sessionToken = await getSessionToken();
    const locale = getLocaleCode();
    const restrictCountries = ["de", "uk", "fr", "eu"];
    const requestOptions = { input: val, sessionToken };

    if (restrictCountries.includes(locale)) {
      if (locale === "eu") {
        requestOptions.includedRegionCodes = ["de", "fr", "it", "es", "nl"];
      } else {
        requestOptions.includedRegionCodes = [locale === "uk" ? "gb" : locale];
      }
    }

    const { suggestions } =
      await AutocompleteSuggestion.fetchAutocompleteSuggestions(requestOptions);

    if (suggestions && suggestions.length > 0) {
      renderSuggestions(suggestions);
    } else {
      hideSuggestions();
    }
  } catch (err) {
    console.error("[modal] Autocomplete error:", err);
    hideSuggestions();
  }
}

/** 渲染下拉建议列表 */
function renderSuggestions(suggestions) {
  Els.searchDropdown.innerHTML = "";

  suggestions.forEach((suggestion) => {
    const pred = suggestion.placePrediction;
    const li = document.createElement("li");
    li.className = "dropdown_item";
    li.innerHTML = `
      <span class="dropdown_pin">📍</span>
      <div class="dropdown_text">
        <span class="dropdown_main">${pred.mainText?.toString() || pred.text?.toString() || ""}</span>
        <span class="dropdown_secondary">${pred.secondaryText?.toString() || ""}</span>
      </div>
    `;
    li.addEventListener("mousedown", (e) => {
      /* mousedown 阻止 input blur 先触发 */
      e.preventDefault();
      handleSuggestionClick(suggestion);
    });
    Els.searchDropdown.appendChild(li);
  });

  Els.searchDropdown.classList.add("visible");
}

/** 点击下拉建议：获取详细坐标并移动地图 */
async function handleSuggestionClick(suggestion) {
  const pred = suggestion.placePrediction;
  Els.searchInput.value = pred.text?.toString() ?? "";
  hideSuggestions();

  /* Session Token 用完后重置 */
  State.sessionToken = null;

  setListAuxBusy(true);
  try {
    const place = pred.toPlace();
    await place.fetchFields({ fields: ["location", "formattedAddress", "displayName"] });

    const loc = place.location;
    if (!loc) {
      return;
    }

    const lat = typeof loc.lat === "function" ? loc.lat() : loc.lat;
    const lng = typeof loc.lng === "function" ? loc.lng() : loc.lng;

    State.mapCenter = { lat, lng };
    State.zoom = 12;
    State.userAnchor = { lat, lng };

    if (State.mapsReady) {
      MapManager.panTo({ lat, lng }, 12);
      MapManager.renderUserMarker({ lat, lng });
    }

    if (State.stores.length > 0) {
      State.distancesKm = computeAllDistancesKm(State.userAnchor, State.stores);
      renderSidebar();
    }
  } catch (err) {
    console.error("[modal] Place details error:", err);
  } finally {
    setListAuxBusy(false);
  }
}

function hideSuggestions() {
  Els.searchDropdown.classList.remove("visible");
  Els.searchDropdown.innerHTML = "";
}

/* ============================================================
   距离计算与门店列表排序
   ============================================================ */

/**
 * 定位失败/拒绝时：地图与锚点切到 locale 默认城市，搜索框填入城市名（与组件 handleFallbackToLocaleCity 一致）
 */
function fallbackToLocaleCity() {
  const { lat, lng, cityLabel } = getLocaleCityDefault();

  State.mapCenter = { lat, lng };
  State.zoom = 12;
  State.userAnchor = { lat, lng };
  Els.searchInput.value = cityLabel;

  if (State.mapsReady) {
    MapManager.panTo({ lat, lng }, 12);
    MapManager.renderUserMarker({ lat, lng });
    MapManager.renderStoreMarkers(State.stores, State.activeStoreId, getMapMarkerOptions());
  }

  if (State.stores.length > 0) {
    State.distancesKm = computeAllDistancesKm(State.userAnchor, State.stores);
    renderSidebar();
  }
}

function refreshListOverlay() {
  const busy = State.storeListFetching || State.listAuxBusy;

  Els.spinnerOverlay.style.display = busy ? "flex" : "none";
  Els.storeList.classList.toggle("loading", busy);
}

function setStoreListFetching(loading) {
  State.storeListFetching = loading;
  refreshListOverlay();
}

function setListAuxBusy(busy) {
  State.listAuxBusy = busy;
  refreshListOverlay();
}

/** 距离重算并刷新列表（带列表遮罩，行为接近组件内 userAnchor effect） */
async function recalcDistancesWithOverlay() {
  if (!State.userAnchor || State.stores.length === 0) {
    State.distancesKm = {};
    renderSidebar();

    return;
  }

  setListAuxBusy(true);
  try {
    State.distancesKm = computeAllDistancesKm(State.userAnchor, State.stores);
    renderSidebar();
  } finally {
    setListAuxBusy(false);
  }
}

/* ============================================================
   侧边栏（门店列表）渲染
   ============================================================ */

/** 按距离排序后渲染门店卡片 */
function renderSidebar() {
  const sorted = [...State.stores].sort((a, b) => {
    const dA = State.distancesKm[a.id] ?? a.distance ?? Infinity;
    const dB = State.distancesKm[b.id] ?? b.distance ?? Infinity;
    return dA - dB;
  });

  if (sorted.length === 0) {
    renderSidebarEmpty();
    return;
  }

  Els.storeList.innerHTML = sorted
    .map((store) => buildStoreCardHTML(store))
    .join("");

  /* 绑定卡片点击事件 */
  Els.storeList.querySelectorAll(".store_card").forEach((card) => {
    card.addEventListener("click", () => handleStoreClick(card.dataset.id));
  });

  /* 绑定"Directions"按钮（阻止冒泡到卡片） */
  Els.storeList.querySelectorAll(".directions_btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openDirections(btn.dataset.id);
    });
  });
}

/** 构建单个门店卡片 HTML */
function buildStoreCardHTML(store) {
  const distanceKm = State.distancesKm[store.id];
  const isActive = store.id === State.activeStoreId;

  const distanceBadgeHtml =
    distanceKm !== undefined
      ? `<span class="distance_badge">${formatDistanceMilesFromKm(distanceKm)}</span>`
      : "";

  const avatarHtml = store.avatar
    ? `<img class="store_avatar" src="${store.avatar}" alt="${store.name}" />`
    : `<div class="store_avatar_placeholder">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
          <path d="M20 4H4C3.45 4 3 4.45 3 5v2c0 1.1.9 2 2 2h.08C5.03 9.33 5 9.67 5 10v9c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-9c0-.33-.03-.67-.08-1H19c1.1 0 2-.9 2-2V5c0-.55-.45-1-1-1zm-9 14H9v-5h2v5zm4 0h-2v-5h2v5zm2-9H7V7h10v2z"/>
        </svg>
      </div>`;

  const phoneHtml = store.phone
    ? `<div class="store_detail">
        <span class="detail_icon">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M10.5 8.27C9.66 8.27 8.85 8.13 8.1 7.88C7.85 7.79 7.57 7.85 7.38 8.04L6.13 9.29C4.46 8.44 3.55 7.53 2.71 5.87L3.96 4.62C4.15 4.43 4.21 4.15 4.12 3.9C3.87 3.14 3.73 2.33 3.73 1.5C3.73 1.1 3.4 0.77 3 0.77H0.77C0.37 0.77 0 1.03 0 1.5C0 6.94 5.06 12 10.5 12C10.97 12 11.23 11.63 11.23 11.23V9C11.23 8.6 10.9 8.27 10.5 8.27Z"/>
          </svg>
        </span>
        <span>${store.phone}</span>
      </div>`
    : "";

  return `
    <div class="store_card ${isActive ? "active" : ""}" data-id="${store.id}">
      ${avatarHtml}
      <div class="store_right_col">
        <div class="store_info">
          <div class="store_header">
            <span class="store_name">${store.name}</span>
            ${distanceBadgeHtml}
          </div>
          <div class="store_detail">
            <span class="detail_icon">
              <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
                <path d="M6 0C2.69 0 0 2.69 0 6C0 10.5 6 16 6 16C6 16 12 10.5 12 6C12 2.69 9.31 0 6 0ZM6 8.5C4.62 8.5 3.5 7.38 3.5 6C3.5 4.62 4.62 3.5 6 3.5C7.38 3.5 8.5 4.62 8.5 6C8.5 7.38 7.38 8.5 6 8.5Z"/>
              </svg>
            </span>
            <span>${store.address}</span>
          </div>
          ${phoneHtml}
        </div>
        <div class="action_area">
          <button class="directions_btn" data-id="${store.id}">${STORE_FINDER_COPY.storeListNavBtnText}</button>
        </div>
      </div>
    </div>
  `;
}

/** 渲染空状态 */
function renderSidebarEmpty() {
  Els.storeList.innerHTML = `
    <div class="empty_state">
      <div class="empty_icon">
        <svg viewBox="0 0 56 56" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28 8V18" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M20 11L24 18" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M36 11L32 18" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M8 34H20L24 40H32L36 34H48" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12.4 21.6L8 34V44C8 45.1 8.9 46 10 46H46C47.1 46 48 45.1 48 44V34L43.6 21.6C43.24 20.64 42.32 20 41.3 20H14.7C13.68 20 12.76 20.64 12.4 21.6Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div>
        <p class="empty_title">No stores found</p>
        <p class="empty_desc">We couldn't find any stores near this location. Please try searching for a different area.</p>
      </div>
    </div>
  `;
}

/** 渲染错误状态 */
function renderSidebarError() {
  Els.storeList.innerHTML = `
    <div class="empty_state">
      <div class="empty_icon">
        <svg viewBox="0 0 56 56" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28 8V18" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M20 11L24 18" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M36 11L32 18" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M8 34H20L24 40H32L36 34H48" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12.4 21.6L8 34V44C8 45.1 8.9 46 10 46H46C47.1 46 48 45.1 48 44V34L43.6 21.6C43.24 20.64 42.32 20 41.3 20H14.7C13.68 20 12.76 20.64 12.4 21.6Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div>
        <p class="empty_title">${STORE_FINDER_COPY.storeListErrorTitle}</p>
        <p class="empty_desc">${STORE_FINDER_COPY.storeListErrorDesc}</p>
      </div>
    </div>
  `;
}

/* ============================================================
   门店点击：激活卡片 + 地图移动
   ============================================================ */

function handleStoreClick(storeId) {
  State.activeStoreId = storeId;

  const store = State.stores.find((s) => s.id === storeId);

  if (store) {
    State.mapCenter = { lat: store.lat, lng: store.lng };
    State.zoom = 14;
    MapManager.panTo({ lat: store.lat, lng: store.lng }, 14);
    MapManager.renderStoreMarkers(State.stores, storeId, getMapMarkerOptions());
  }

  /* 更新卡片激活样式（避免整体重渲染）*/
  Els.storeList.querySelectorAll(".store_card").forEach((card) => {
    card.classList.toggle("active", card.dataset.id === storeId);
  });
}

/* ============================================================
   打开 Google Maps 导航
   ============================================================ */

function openDirections(storeId) {
  const store = State.stores.find((s) => s.id === storeId);
  if (!store) return;

  let url = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;

  if (State.userAnchor) {
    url += `&origin=${State.userAnchor.lat},${State.userAnchor.lng}`;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

/** 关闭地图上的门店详情卡片并取消选中（对齐 MapContent onCloseStoreDetail） */
function handleCloseStoreDetail() {
  State.activeStoreId = null;

  if (State.mapsReady) {
    MapManager.renderStoreMarkers(State.stores, null, getMapMarkerOptions());
  }

  Els.storeList.querySelectorAll(".store_card").forEach((card) => {
    card.classList.remove("active");
  });
}

function getMapMarkerOptions() {
  return {
    onStoreClick: handleStoreClick,
    onDirections: (store) => openDirections(store.id),
    onCloseStoreDetail: handleCloseStoreDetail,
    navButtonText: STORE_FINDER_COPY.storeListNavBtnText,
  };
}

/* ============================================================
   loading 状态
   ============================================================ */

/* ============================================================
   地图容器：桌面 #googleMap / 移动侧栏 #googleMapMobile（对齐 valerion）
   ============================================================ */

function isMobileMapLayout() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function getMapSurfaceEl() {
  return isMobileMapLayout()
    ? document.getElementById("googleMapMobile")
    : document.getElementById("googleMap");
}

function triggerGoogleMapResize() {
  const map = MapManager.getMap();
  if (map && window.google?.maps?.event) {
    window.google.maps.event.trigger(map, "resize");
  }
}

function debounceMap(fn, ms) {
  let timerId = null;

  return (...args) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      fn.apply(null, args);
    }, ms);
  };
}

/**
 * 视口在桌面/移动之间切换时，销毁并挂到新容器（单实例 Map，与组件双挂载点行为一致）
 */
function syncMapToLayout() {
  if (!State.mapsReady || !mapLayoutMode) {
    return;
  }

  const nextMode = isMobileMapLayout() ? "mobile" : "desktop";

  if (nextMode === mapLayoutMode) {
    triggerGoogleMapResize();

    return;
  }

  const surface = getMapSurfaceEl();
  if (!surface) {
    return;
  }

  mapLayoutMode = nextMode;
  MapManager.destroy();
  MapManager.init(surface, State.mapCenter, State.zoom);

  if (State.stores.length > 0) {
    MapManager.renderStoreMarkers(State.stores, State.activeStoreId, getMapMarkerOptions());
  }

  if (State.userAnchor) {
    MapManager.renderUserMarker(State.userAnchor);
  }

  Els.mapLoading.classList.add("hidden");
  if (Els.mapLoadingMobile) {
    Els.mapLoadingMobile.classList.add("hidden");
  }

  triggerGoogleMapResize();
}

/* ============================================================
   Google Maps 脚本加载就绪回调
   ============================================================ */

function onMapsReady() {
  const surface = getMapSurfaceEl();
  if (!surface) {
    return;
  }

  State.mapsReady = true;
  mapLayoutMode = isMobileMapLayout() ? "mobile" : "desktop";

  MapManager.init(surface, State.mapCenter, State.zoom);

  Els.mapLoading.classList.add("hidden");
  if (Els.mapLoadingMobile) {
    Els.mapLoadingMobile.classList.add("hidden");
  }

  if (State.stores.length > 0) {
    MapManager.renderStoreMarkers(State.stores, State.activeStoreId, getMapMarkerOptions());
  }

  if (State.userAnchor) {
    MapManager.renderUserMarker(State.userAnchor);
  }

  triggerGoogleMapResize();
}

/* ============================================================
   事件绑定
   ============================================================ */

function bindEvents() {
  /* 打开弹窗 */
  Els.openBtn.addEventListener("click", openModal);

  /* 关闭弹窗（按钮 + 背景遮罩） */
  Els.closeBtn.addEventListener("click", closeModal);
  Els.overlay.addEventListener("click", closeModal);

  /* ESC：先关闭地图详情卡片，再关弹窗（与常见地图弹窗交互一致） */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !State.isOpen) {
      return;
    }

    if (State.activeStoreId) {
      handleCloseStoreDetail();
    } else {
      closeModal();
    }
  });

  /* 搜索框输入 */
  Els.searchInput.addEventListener("input", handleSearchInput);

  /* 搜索框失焦时隐藏下拉（mousedown 已用 preventDefault 延迟，所以 blur 可安全隐藏） */
  Els.searchInput.addEventListener("blur", () => {
    setTimeout(hideSuggestions, 150);
  });

  /* 定位按钮 */
  Els.locateBtn.addEventListener("click", handleLocateMe);

  /* 定位被拒弹窗关闭 */
  Els.locationDeniedClose.addEventListener("click", () => {
    Els.locationDeniedModal.style.display = "none";
  });
  Els.locationDeniedOverlay.addEventListener("click", () => {
    Els.locationDeniedModal.style.display = "none";
  });
  Els.gotItBtn.addEventListener("click", () => {
    Els.locationDeniedModal.style.display = "none";
  });

  /* Google Maps 脚本加载完成事件（由 index.html 的 callback 触发） */
  document.addEventListener("googlemapsready", onMapsReady);

  window.addEventListener("resize", debounceMap(syncMapToLayout, 200));
}

/* ============================================================
   文案注入（与 resolveStoreFinderCopy / resolveDeniedLocationCopy 结果一致）
   ============================================================ */

function applyUiCopy() {
  const c = STORE_FINDER_COPY;
  const d = DENIED_LOCATION_COPY;

  Els.modalTitle.textContent = c.modalTitle;
  Els.searchInput.placeholder = c.searchPlaceholder;
  Els.searchDesc.textContent = c.searchHint;
  Els.locationDeniedTitle.textContent = d.modalTitle;
  Els.locationDeniedDesc.textContent = d.description;
  Els.gotItBtn.textContent = d.closeButtonLabel;
}

/* ============================================================
   初始化入口
   ============================================================ */
applyUiCopy();
bindEvents();
