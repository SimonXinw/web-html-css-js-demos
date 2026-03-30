/**
 * config.js
 * 全局配置：API Key、地图默认中心、Mock 门店数据、与 valerion google-maps-modal 对齐的文案与 locale 回退
 *
 * 实际使用时将 GOOGLE_MAPS_API_KEY 替换为自己的 Key，
 * 并将 MOCK_STORES 替换为真实 API 请求（见 fetchStores）。
 *
 * URL 参数 ?locale=de|uk|fr|eu|us 可切换「定位失败/拒绝」时的默认城市与 Places 区域限制（与组件内 getLatestNextLocale 行为类似）。
 */

/* ---- Google Maps API Key ---- */
const GOOGLE_MAPS_API_KEY = "AIzaSyAOavTIWq4qRgppoQYzktYy5j0Yshb3HRI";

/**
 * 与 valerion components/google-maps-modal/index.tsx LOCALE_CITY_DEFAULTS / DEFAULT_CITY 对齐
 */
const LOCALE_CITY_DEFAULTS = {
  de: { lat: 52.52, lng: 13.405, cityLabel: "Berlin, Germany" },
  uk: { lat: 51.5074, lng: -0.1278, cityLabel: "London, United Kingdom" },
  fr: { lat: 48.8566, lng: 2.3522, cityLabel: "Paris, France" },
  eu: { lat: 50.8503, lng: 4.3517, cityLabel: "Brussels, Belgium" },
};

const DEFAULT_CITY = {
  lat: 38.9072,
  lng: -77.0369,
  cityLabel: "Washington, D.C., USA",
};

/**
 * 从 URL 读取 locale，缺省为 us（使用 DEFAULT_CITY）
 */
function getLocaleCode() {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = (params.get("locale") || "us").toLowerCase();

    return raw;
  } catch {
    return "us";
  }
}

function getLocaleCityDefault() {
  const locale = getLocaleCode();

  return LOCALE_CITY_DEFAULTS[locale] ?? DEFAULT_CITY;
}

/** 与组件 getInitialMapCenter 一致：按当前 locale 默认城市 */
function getInitialMapCenter() {
  const { lat, lng } = getLocaleCityDefault();

  return { lat, lng };
}

/* ---- 默认地图中心（脚本加载时的兜底，弹窗内优先用 getInitialMapCenter） ---- */
const DEFAULT_MAP_CENTER = { lat: DEFAULT_CITY.lat, lng: DEFAULT_CITY.lng };
const DEFAULT_ZOOM = 5;

/**
 * 与 valerion resolveStoreFinderCopy / resolveDeniedLocationCopy 默认值对齐（演示页无 CMS，写死对象）
 */
const STORE_FINDER_COPY = {
  modalTitle: "Select store",
  searchPlaceholder: "Enter your zip code, city, address",
  searchHint:
    "Enter a city, ZIP code, or address to find nearby stores, or tap the location icon on the right to use your current location.",
  currentLocationText: "",
  storeListNavBtnText: "Anreise",
  storeListErrorTitle: "Sorry, we can't load stores right now.",
  storeListErrorDesc:
    "This may be due to a network issue or a temporary error. Please try again later.",
  googleMapsErrorTitle: "Something went wrong while loading the map. Please retry.",
  googleMapsRetryBtnText: "Retry",
};

const DENIED_LOCATION_COPY = {
  modalTitle: "Location Access",
  description: `Please follow these steps to enable location access:

1. Open your browser settings
2. Navigate to Privacy & Security/Site Settings
3. Enable location access permission
4. Refresh this page to try again`,
  closeButtonLabel: "Got it",
};

/* ---- 1km = X 英里 ---- */
const KM_TO_MILES = 0.621371192;

/**
 * Mock 门店数据
 * 字段与原始 StoreLocation 类型对齐：id, name, address, phone, lat, lng, avatar
 *
 * 替换为真实 API 时可删除此对象，修改 fetchStores() 即可。
 */
const MOCK_STORES = [
  {
    id: "1",
    name: "VALERION NEW YORK FLAGSHIP",
    address: "650 5th Ave, New York, NY 10019",
    phone: "+1 (212) 555-0101",
    lat: 40.7589,
    lng: -73.9781,
    avatar: "https://i.pravatar.cc/150?u=store-ny",
  },
  {
    id: "2",
    name: "VALERION LOS ANGELES",
    address: "8500 Beverly Blvd, Los Angeles, CA 90048",
    phone: "+1 (310) 555-0202",
    lat: 34.0736,
    lng: -118.3808,
    avatar: "https://i.pravatar.cc/150?u=store-la",
  },
  {
    id: "3",
    name: "VALERION CHICAGO",
    address: "900 N Michigan Ave, Chicago, IL 60611",
    phone: "+1 (312) 555-0303",
    lat: 41.8978,
    lng: -87.6244,
    avatar: "https://i.pravatar.cc/150?u=store-chi",
  },
  {
    id: "4",
    name: "VALERION MIAMI",
    address: "701 Collins Ave, Miami Beach, FL 33139",
    phone: "+1 (305) 555-0404",
    lat: 25.7907,
    lng: -80.1300,
    avatar: "https://i.pravatar.cc/150?u=store-mia",
  },
  {
    id: "5",
    name: "VALERION SAN FRANCISCO",
    address: "340 Post St, San Francisco, CA 94108",
    phone: "+1 (415) 555-0505",
    lat: 37.7882,
    lng: -122.4075,
    avatar: "https://i.pravatar.cc/150?u=store-sf",
  },
  {
    id: "6",
    name: "VALERION SEATTLE",
    address: "1600 Pike Place, Seattle, WA 98101",
    phone: "+1 (206) 555-0606",
    lat: 47.6097,
    lng: -122.3422,
    avatar: "https://i.pravatar.cc/150?u=store-sea",
  },
  {
    id: "7",
    name: "VALERION BOSTON",
    address: "800 Boylston St, Boston, MA 02199",
    phone: "+1 (617) 555-0707",
    lat: 42.3484,
    lng: -71.0849,
    avatar: "https://i.pravatar.cc/150?u=store-bos",
  },
  {
    id: "8",
    name: "VALERION DALLAS",
    address: "8687 N Central Expy, Dallas, TX 75225",
    phone: "+1 (214) 555-0808",
    lat: 32.8685,
    lng: -96.7702,
    avatar: "https://i.pravatar.cc/150?u=store-dal",
  },
];

/**
 * 获取门店列表
 * 当前返回 Mock 数据；替换为真实 API 时改写此函数：
 *
 * async function fetchStores() {
 *   const res = await fetch("/prod-api/client/offlineStore/list?brand=valerion&pageSize=100");
 *   const data = await res.json();
 *   return data.rows.map(mapRawStore);
 * }
 */
async function fetchStores() {
  /* 模拟网络延迟 300ms */
  await new Promise((resolve) => setTimeout(resolve, 300));

  return MOCK_STORES;
}
