/**
 * utils.js
 * 工具函数：Haversine 直线距离 + 逆地理编码 + 门店头像字段校验（与 isUsableStorePortrait 一致）
 */

const INVALID_PORTRAIT_PLACEHOLDERS = new Set([
  "null",
  "undefined",
  "none",
  "-",
  "n/a",
  "na",
]);

/**
 * 接口 avatar 是否为可用的图片地址（排除空值与常见占位符）
 * 对齐 valerion components/google-maps-modal/isUsableStorePortrait.ts
 *
 * @param {string|undefined|null} value
 * @returns {boolean}
 */
function isUsableStorePortrait(value) {
  const raw = typeof value === "string" ? value.trim() : "";

  if (!raw) {
    return false;
  }

  return !INVALID_PORTRAIT_PLACEHOLDERS.has(raw.toLowerCase());
}

/**
 * Haversine 公式：计算两点间球面直线距离（km）
 * 不依赖 Google API，可离线使用
 *
 * @param {{ lat: number, lng: number }} a - 起点
 * @param {{ lat: number, lng: number }} b - 终点
 * @returns {number} 距离（km）
 */
function haversineDistanceKm(a, b) {
  const EARTH_RADIUS_KM = 6371;

  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const s =
    sinDLat * sinDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(s)));
}

/**
 * 将 km 转换为英里并格式化为 "x.x mi" 字符串
 *
 * @param {number} km
 * @returns {string} 例如 "3.2 mi"
 */
function formatDistanceMilesFromKm(km) {
  const mi = km * KM_TO_MILES;
  const rounded = Math.round(mi * 10) / 10;

  return `${Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)} mi`;
}

/**
 * 逆地理编码：经纬度 → 可读地址字符串
 * 依赖 Google Maps Geocoding API（需已加载 maps 脚本）
 *
 * @param {number} lat
 * @param {number} lng
 * @returns {Promise<string|undefined>} 格式化地址，失败时返回 undefined
 */
function geocodeLatLngToFormattedAddress(lat, lng) {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.google?.maps?.Geocoder) {
      resolve(undefined);
      return;
    }

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.[0]?.formatted_address) {
        resolve(results[0].formatted_address);
      } else {
        resolve(undefined);
      }
    });
  });
}

/**
 * 批量计算用户到各门店的距离（km）
 * 逻辑：
 * 1. 优先使用 Google Maps DistanceMatrixService 请求真实距离。
 * 2. 如果请求不到或部分失败，回退到直线距离（Haversine）。
 * 3. 都没有的话就不返回该 store 的距离。
 *
 * @param {{ lat: number, lng: number }} userAnchor - 用户位置
 * @param {Array} stores - 门店数组
 * @returns {Promise<Object>} { [storeId]: distanceKm }
 */
async function computeAllDistancesKmAsync(userAnchor, stores) {
  const result = {};

  if (!userAnchor || typeof userAnchor.lat !== "number" || typeof userAnchor.lng !== "number") {
    return result;
  }

  let googleDistances = {};

  // 尝试调用 Google Distance Matrix API
  if (typeof window !== "undefined" && window.google?.maps?.DistanceMatrixService) {
    try {
      const service = new google.maps.DistanceMatrixService();
      const destinations = stores.filter(s => typeof s.lat === "number" && typeof s.lng === "number");
      
      // Google API 每次最多 25 个目的地
      const CHUNK_SIZE = 25;
      const chunks = [];
      for (let i = 0; i < destinations.length; i += CHUNK_SIZE) {
        chunks.push(destinations.slice(i, i + CHUNK_SIZE));
      }

      await Promise.all(chunks.map(async (chunk) => {
        try {
          const response = await new Promise((resolve, reject) => {
            service.getDistanceMatrix(
              {
                origins: [userAnchor],
                destinations: chunk.map(s => ({ lat: s.lat, lng: s.lng })),
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
              },
              (res, status) => {
                if (status === "OK") resolve(res);
                else reject(new Error("DistanceMatrix status: " + status));
              }
            );
          });

          const elements = response.rows[0].elements;
          elements.forEach((el, idx) => {
            if (el.status === "OK" && el.distance) {
              googleDistances[chunk[idx].id] = el.distance.value / 1000; // 转换为 km
            }
          });
        } catch (e) {
          console.warn("[utils] DistanceMatrixService chunk error:", e);
        }
      }));
    } catch (err) {
      console.warn("[utils] DistanceMatrixService error:", err);
    }
  }

  // 综合填充结果
  stores.forEach((store) => {
    if (googleDistances[store.id] !== undefined) {
      result[store.id] = googleDistances[store.id];
    } else if (typeof store.lat === "number" && typeof store.lng === "number") {
      result[store.id] = haversineDistanceKm(userAnchor, {
        lat: store.lat,
        lng: store.lng,
      });
    }
  });

  return result;
}
