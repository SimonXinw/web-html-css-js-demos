/**
 * map.js
 * Google Maps：初始化、用户标记、门店 AdvancedMarker（与 MapContent.tsx 对齐）
 * - 标记：店名浮层 + 圆形头像（可用 URL / 内联门店 SVG 回退）+ 三角 pin
 * - 选中：放大头像、蓝色描边、隐藏浮层店名；在标记上挂载详情卡片（关闭、地址、电话、导航）
 */

const SVG_NS = "http://www.w3.org/2000/svg";

const MapManager = (() => {
  let mapInstance = null;
  const storeMarkers = {};
  let userMarker = null;

  /** 当前挂在激活标记上的详情卡片根节点（与 createPortal 到 marker 节点一致） */
  let detailCardMount = null;

  function getUsableStoreAvatarUrl(store) {
    if (!isUsableStorePortrait(store.avatar)) {
      return null;
    }

    return store.avatar.trim();
  }

  /** 与 MapContent appendStoreIconSvg — 内联 store 图标，不依赖远程 ?url */
  function appendStoreIconSvg(avatarEl) {
    avatarEl.replaceChildren();
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("width", "22");
    svg.setAttribute("height", "22");
    svg.setAttribute("viewBox", "0 0 26 26");
    svg.setAttribute("fill", "none");
    const pathStore = document.createElementNS(SVG_NS, "path");
    pathStore.setAttribute(
      "d",
      "M22.3297 23.5507C22.3306 23.6373 22.3146 23.7232 22.2829 23.8034C22.2511 23.8837 22.2041 23.9566 22.1447 24.0181C22.0852 24.0796 22.0144 24.1283 21.9365 24.1615C21.8585 24.1948 21.7749 24.2118 21.6904 24.2116H3.82919C3.65891 24.2107 3.49593 24.1406 3.37606 24.0165C3.25619 23.8925 3.18924 23.7247 3.18992 23.55V17.0131H1.91393V23.55C1.91342 24.0717 2.11488 24.5721 2.47403 24.9415C2.83317 25.3108 3.3206 25.5188 3.82919 25.5196H21.6904C21.9424 25.5198 22.192 25.4689 22.4248 25.37C22.6575 25.271 22.869 25.1258 23.0469 24.9428C23.2249 24.7598 23.3658 24.5426 23.4617 24.3036C23.5576 24.0646 23.6065 23.8085 23.6057 23.55V17.0131H22.3297V23.55V23.5507ZM22.0905 14.2537C21.3446 14.523 20.5318 14.5253 19.7845 14.2603C19.0371 13.9954 18.3993 13.4787 17.9748 12.7945L16.7619 10.8354L15.7546 12.9123C15.4796 13.4854 15.0532 13.9677 14.5239 14.3044C13.9947 14.641 13.3839 14.8185 12.7611 14.8164C12.1382 14.8182 11.5274 14.6406 10.998 14.304C10.4686 13.9674 10.0419 13.4852 9.76635 12.9123L8.75832 10.8354L7.54677 12.7945C7.1232 13.4804 6.48497 13.9984 5.73672 14.2636C4.98847 14.5287 4.1746 14.5252 3.42853 14.2537C1.71105 13.4534 0.84274 11.3746 1.48839 9.53976L2.6993 6.09592L3.81834 1.58614C3.84641 1.46967 4.04802 1.3087 4.16541 1.3087H21.4033C21.5233 1.3087 21.7217 1.4664 21.7504 1.58614L22.8963 6.28699L24.0306 9.5306C24.6763 11.3667 23.8073 13.4482 22.0905 14.2537ZM25.2307 9.0863L24.134 5.96963L22.9881 1.26878C22.8178 0.567321 22.1077 0 21.4033 0H4.16477C3.46043 0 2.75034 0.571247 2.58 1.26944L1.53751 5.54561L1.49923 5.65096L0.287685 9.09546C-0.589555 11.5912 0.606682 14.4075 2.96152 15.4669C5.08412 16.2639 7.44023 15.4093 8.62434 13.4953C9.00727 14.2848 9.59726 14.949 10.328 15.4135C11.0588 15.8779 11.9014 16.1242 12.7611 16.1245C13.6208 16.1246 14.4635 15.8786 15.1943 15.4141C15.925 14.9496 16.5148 14.285 16.8972 13.4953C17.4819 14.4351 18.3614 15.1426 19.3907 15.501C20.42 15.8594 21.5377 15.8473 22.5594 15.4669C24.9136 14.4016 26.1105 11.5866 25.2307 9.08695"
    );
    pathStore.setAttribute("fill", "white");
    const pathLine = document.createElementNS(SVG_NS, "path");
    pathLine.setAttribute(
      "d",
      "M19.7771 7.85205H5.74249C5.57328 7.85205 5.411 7.92099 5.29136 8.04371C5.17171 8.16642 5.10449 8.33286 5.10449 8.5064C5.10449 8.67995 5.17171 8.84638 5.29136 8.9691C5.411 9.09181 5.57328 9.16075 5.74249 9.16075H19.7771C19.9463 9.16075 20.1085 9.09181 20.2282 8.9691C20.3478 8.84638 20.4151 8.67995 20.4151 8.5064C20.4151 8.33286 20.3478 8.16642 20.2282 8.04371C20.1085 7.92099 19.9463 7.85205 19.7771 7.85205Z"
    );
    pathLine.setAttribute("fill", "white");
    svg.appendChild(pathStore);
    svg.appendChild(pathLine);
    avatarEl.appendChild(svg);
  }

  /** 详情卡片内占位：28×28 图标，外层由 CSS 控制 56×56 区域 */
  function appendDetailCardStoreIconPlaceholder(wrapEl) {
    wrapEl.replaceChildren();
    wrapEl.classList.add("gmaps_detail_avatar_placeholder");
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("width", "28");
    svg.setAttribute("height", "28");
    svg.setAttribute("viewBox", "0 0 26 26");
    svg.setAttribute("fill", "none");
    const pathStore = document.createElementNS(SVG_NS, "path");
    pathStore.setAttribute(
      "d",
      "M22.3297 23.5507C22.3306 23.6373 22.3146 23.7232 22.2829 23.8034C22.2511 23.8837 22.2041 23.9566 22.1447 24.0181C22.0852 24.0796 22.0144 24.1283 21.9365 24.1615C21.8585 24.1948 21.7749 24.2118 21.6904 24.2116H3.82919C3.65891 24.2107 3.49593 24.1406 3.37606 24.0165C3.25619 23.8925 3.18924 23.7247 3.18992 23.55V17.0131H1.91393V23.55C1.91342 24.0717 2.11488 24.5721 2.47403 24.9415C2.83317 25.3108 3.3206 25.5188 3.82919 25.5196H21.6904C21.9424 25.5198 22.192 25.4689 22.4248 25.37C22.6575 25.271 22.869 25.1258 23.0469 24.9428C23.2249 24.7598 23.3658 24.5426 23.4617 24.3036C23.5576 24.0646 23.6065 23.8085 23.6057 23.55V17.0131H22.3297V23.55V23.5507ZM22.0905 14.2537C21.3446 14.523 20.5318 14.5253 19.7845 14.2603C19.0371 13.9954 18.3993 13.4787 17.9748 12.7945L16.7619 10.8354L15.7546 12.9123C15.4796 13.4854 15.0532 13.9677 14.5239 14.3044C13.9947 14.641 13.3839 14.8185 12.7611 14.8164C12.1382 14.8182 11.5274 14.6406 10.998 14.304C10.4686 13.9674 10.0419 13.4852 9.76635 12.9123L8.75832 10.8354L7.54677 12.7945C7.1232 13.4804 6.48497 13.9984 5.73672 14.2636C4.98847 14.5287 4.1746 14.5252 3.42853 14.2537C1.71105 13.4534 0.84274 11.3746 1.48839 9.53976L2.6993 6.09592L3.81834 1.58614C3.84641 1.46967 4.04802 1.3087 4.16541 1.3087H21.4033C21.5233 1.3087 21.7217 1.4664 21.7504 1.58614L22.8963 6.28699L24.0306 9.5306C24.6763 11.3667 23.8073 13.4482 22.0905 14.2537ZM25.2307 9.0863L24.134 5.96963L22.9881 1.26878C22.8178 0.567321 22.1077 0 21.4033 0H4.16477C3.46043 0 2.75034 0.571247 2.58 1.26944L1.53751 5.54561L1.49923 5.65096L0.287685 9.09546C-0.589555 11.5912 0.606682 14.4075 2.96152 15.4669C5.08412 16.2639 7.44023 15.4093 8.62434 13.4953C9.00727 14.2848 9.59726 14.949 10.328 15.4135C11.0588 15.8779 11.9014 16.1242 12.7611 16.1245C13.6208 16.1246 14.4635 15.8786 15.1943 15.4141C15.925 14.9496 16.5148 14.285 16.8972 13.4953C17.4819 14.4351 18.3614 15.1426 19.3907 15.501C20.42 15.8594 21.5377 15.8473 22.5594 15.4669C24.9136 14.4016 26.1105 11.5866 25.2307 9.08695"
    );
    pathStore.setAttribute("fill", "white");
    const pathLine = document.createElementNS(SVG_NS, "path");
    pathLine.setAttribute(
      "d",
      "M19.7771 7.85205H5.74249C5.57328 7.85205 5.411 7.92099 5.29136 8.04371C5.17171 8.16642 5.10449 8.33286 5.10449 8.5064C5.10449 8.67995 5.17171 8.84638 5.29136 8.9691C5.411 9.09181 5.57328 9.16075 5.74249 9.16075H19.7771C19.9463 9.16075 20.1085 9.09181 20.2282 8.9691C20.3478 8.84638 20.4151 8.67995 20.4151 8.5064C20.4151 8.33286 20.3478 8.16642 20.2282 8.04371C20.1085 7.92099 19.9463 7.85205 19.7771 7.85205Z"
    );
    pathLine.setAttribute("fill", "white");
    svg.appendChild(pathStore);
    svg.appendChild(pathLine);
    wrapEl.appendChild(svg);
  }

  /**
   * 与 MapContent buildStoreMarkerElement 一致
   */
  function buildStoreMarkerElement(store) {
    const root = document.createElement("div");
    root.className = "custom-marker";
    root.style.cssText =
      "position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;";
    root.setAttribute("aria-label", store.name);

    const titleLabel = document.createElement("div");
    titleLabel.className = "marker-title-label";
    titleLabel.textContent = store.name;
    titleLabel.style.cssText =
      "position:absolute;bottom:100%;left:50%;transform:translateX(-50%);margin-bottom:4px;" +
      "max-width:168px;padding:4px 10px;background:#ffffff;color:#17191c;" +
      "font-size:12px;font-weight:600;line-height:1.25;border-radius:8px;text-align:center;" +
      "white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" +
      "box-shadow:0 2px 8px rgba(0,0,0,0.28);font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;" +
      "pointer-events:none;";

    const avatar = document.createElement("div");
    avatar.className = "marker-avatar";
    avatar.style.cssText =
      "width:40px;height:40px;border-radius:50%;border:3px solid white;overflow:hidden;" +
      "background-color:#2c2f33;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;transition:transform 0.2s;" +
      "display:flex;align-items:center;justify-content:center;flex-shrink:0;";

    const avatarUrl = getUsableStoreAvatarUrl(store);

    if (avatarUrl) {
      const img = document.createElement("img");
      img.alt = "";
      img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
      img.src = avatarUrl;
      img.onerror = () => {
        img.remove();
        appendStoreIconSvg(avatar);
      };
      avatar.appendChild(img);
    } else {
      appendStoreIconSvg(avatar);
    }

    const pin = document.createElement("div");
    pin.className = "marker-pin";
    pin.style.cssText =
      "width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;" +
      "border-top:8px solid white;margin:0 auto;flex-shrink:0;";

    root.appendChild(titleLabel);
    root.appendChild(avatar);
    root.appendChild(pin);

    return root;
  }

  function removeDetailCard() {
    if (detailCardMount && detailCardMount.parentNode) {
      detailCardMount.parentNode.removeChild(detailCardMount);
    }

    detailCardMount = null;
  }

  /**
   * 与 StoreMapDetailCard 结构一致
   */
  function buildStoreMapDetailCard(store, options) {
    const { navButtonText, onDirections, onCloseStoreDetail } = options;

    const float = document.createElement("div");
    float.className = "gmaps_detail_card_float detail-card-ignore-click";
    float.setAttribute("role", "region");
    float.setAttribute("aria-label", store.name);

    const shell = document.createElement("div");
    shell.className = "gmaps_detail_card_shell";

    const card = document.createElement("div");
    card.className = "gmaps_map_detail_card";

    const avatarBlock = document.createElement("div");
    avatarBlock.className = "gmaps_detail_avatar_block";
    const avatarInner = document.createElement("div");
    avatarInner.className = "gmaps_detail_avatar_inner";

    if (getUsableStoreAvatarUrl(store)) {
      const img = document.createElement("img");
      img.className = "gmaps_detail_avatar_img";
      img.alt = "";
      img.src = store.avatar.trim();
      img.onerror = () => {
        img.remove();
        appendDetailCardStoreIconPlaceholder(avatarInner);
      };
      avatarInner.appendChild(img);
    } else {
      appendDetailCardStoreIconPlaceholder(avatarInner);
    }

    avatarBlock.appendChild(avatarInner);

    const title = document.createElement("h3");
    title.className = "gmaps_map_detail_title";
    title.textContent = store.name;

    if (typeof onCloseStoreDetail === "function") {
      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "gmaps_detail_close_btn";
      closeBtn.setAttribute("aria-label", "Close");
      closeBtn.textContent = "×";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        onCloseStoreDetail();
      });
      card.appendChild(closeBtn);
    }

    card.appendChild(avatarBlock);
    card.appendChild(title);

    const addressRow = document.createElement("div");
    addressRow.className = "gmaps_map_detail_row";
    addressRow.innerHTML = `
      <span class="gmaps_map_detail_icon" aria-hidden="true">
        <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 0C2.69 0 0 2.69 0 6C0 10.5 6 16 6 16C6 16 12 10.5 12 6C12 2.69 9.31 0 6 0ZM6 8.5C4.62 8.5 3.5 7.38 3.5 6C3.5 4.62 4.62 3.5 6 3.5C7.38 3.5 8.5 4.62 8.5 6C8.5 7.38 7.38 8.5 6 8.5Z" />
        </svg>
      </span>
    `;
    const addressText = document.createElement("span");
    addressText.className = "gmaps_map_detail_text";
    addressText.textContent = store.address;
    addressRow.appendChild(addressText);
    card.appendChild(addressRow);

    if (store.phone) {
      const phoneRow = document.createElement("div");
      phoneRow.className = "gmaps_map_detail_row";
      phoneRow.innerHTML = `
        <span class="gmaps_map_detail_icon" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 8.27C9.66 8.27 8.85 8.13 8.1 7.88C7.85 7.79 7.57 7.85 7.38 8.04L6.13 9.29C4.46 8.44 3.55 7.53 2.71 5.87L3.96 4.62C4.15 4.43 4.21 4.15 4.12 3.9C3.87 3.14 3.73 2.33 3.73 1.5C3.73 1.1 3.4 0.77 3 0.77H0.77C0.37 0.77 0 1.03 0 1.5C0 6.94 5.06 12 10.5 12C10.97 12 11.23 11.63 11.23 11.23V9C11.23 8.6 10.9 8.27 10.5 8.27Z" />
          </svg>
        </span>
      `;
      const phoneText = document.createElement("span");
      phoneText.className = "gmaps_map_detail_text";
      phoneText.textContent = store.phone;
      phoneRow.appendChild(phoneText);
      card.appendChild(phoneRow);
    }

    if (navButtonText && onDirections) {
      const navBtn = document.createElement("button");
      navBtn.type = "button";
      navBtn.className = "gmaps_map_detail_nav_btn";
      navBtn.textContent = navButtonText;
      navBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        onDirections(store);
      });
      card.appendChild(navBtn);
    }

    const arrow = document.createElement("div");
    arrow.className = "gmaps_detail_card_arrow";
    arrow.setAttribute("aria-hidden", "true");

    shell.appendChild(card);
    shell.appendChild(arrow);
    float.appendChild(shell);

    return float;
  }

  function maybePanForMobileDetail(activeStoreId) {
    if (!mapInstance || !activeStoreId) {
      return;
    }

    if (typeof window.matchMedia !== "function") {
      return;
    }

    if (!window.matchMedia("(max-width: 768px)").matches) {
      return;
    }

    window.setTimeout(() => {
      if (mapInstance?.panBy) {
        mapInstance.panBy(0, -110);
      }
    }, 100);
  }

  function init(container, center, zoom) {
    if (mapInstance || !container) {
      return;
    }

    mapInstance = new google.maps.Map(container, {
      center,
      zoom,
      mapId: "DEMO_MAP_ID",
      disableDefaultUI: false,
    });
  }

  function panTo(center, zoomLevel) {
    if (!mapInstance) {
      return;
    }

    mapInstance.panTo(center);

    if (zoomLevel !== undefined) {
      mapInstance.setZoom(zoomLevel);
    }
  }

  function renderUserMarker(userAnchor) {
    if (!mapInstance || !google.maps.marker) {
      return;
    }

    if (!userAnchor) {
      if (userMarker) {
        userMarker.map = null;
        userMarker = null;
      }

      return;
    }

    if (userMarker) {
      userMarker.position = userAnchor;

      return;
    }

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
   * @param {Array} stores
   * @param {string|null} activeStoreId
   * @param {{ onStoreClick: function, onDirections?: function, onCloseStoreDetail?: function, navButtonText?: string }} options
   */
  function renderStoreMarkers(stores, activeStoreId, options) {
    if (!mapInstance || !google.maps.marker) {
      return;
    }

    const onStoreClick = options && options.onStoreClick;
    const onDirections = options && options.onDirections;
    const onCloseStoreDetail = options && options.onCloseStoreDetail;
    const navButtonText = options && options.navButtonText;

    if (typeof onStoreClick !== "function") {
      return;
    }

    removeDetailCard();

    const currentIds = stores.map((s) => s.id);

    Object.keys(storeMarkers).forEach((id) => {
      if (!currentIds.includes(id)) {
        storeMarkers[id].map = null;
        delete storeMarkers[id];
      }
    });

    let activeMarkerRoot = null;

    stores.forEach((store) => {
      if (!storeMarkers[store.id]) {
        const content = buildStoreMarkerElement(store);

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: mapInstance,
          position: { lat: store.lat, lng: store.lng },
          content,
          title: "",
        });

        storeMarkers[store.id] = marker;

        content.addEventListener("click", (e) => {
          if (e.target.closest(".detail-card-ignore-click")) {
            return;
          }

          e.stopPropagation();
          onStoreClick(store.id);
        });
      }

      const markerEl = storeMarkers[store.id].content;
      const titleLabel = markerEl.querySelector(".marker-title-label");
      const avatar = markerEl.querySelector(".marker-avatar");

      if (titleLabel) {
        titleLabel.style.display =
          activeStoreId && store.id === activeStoreId ? "none" : "";
      }

      if (avatar) {
        if (store.id === activeStoreId) {
          avatar.style.transform = "scale(1.2)";
          avatar.style.borderColor = "#4A90E2";
          storeMarkers[store.id].zIndex = 100;
          activeMarkerRoot = markerEl;
        } else {
          avatar.style.transform = "scale(1)";
          avatar.style.borderColor = "white";
          storeMarkers[store.id].zIndex = 1;
        }
      }
    });

    if (activeStoreId && activeMarkerRoot) {
      const activeStore = stores.find((s) => s.id === activeStoreId);

      if (activeStore) {
        detailCardMount = buildStoreMapDetailCard(activeStore, {
          navButtonText,
          onDirections,
          onCloseStoreDetail,
        });
        activeMarkerRoot.appendChild(detailCardMount);
        maybePanForMobileDetail(activeStoreId);
      }
    }
  }

  function destroy() {
    removeDetailCard();

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

  function getMap() {
    return mapInstance;
  }

  return { init, panTo, renderUserMarker, renderStoreMarkers, destroy, getMap };
})();
