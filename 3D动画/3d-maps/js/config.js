/**
 * 3D 地图漫游的地点配置数据
 * 使用常量大写命名法，导出供应用使用。
 *
 * 字段说明：
 * id: 唯一标识符
 * name: 按钮显示的名称
 * center: 中心坐标点和海拔 (lat, lng, altitude)
 * heading: 旋转角度 (-180 到 180)
 * tilt: 倾斜角度 (0 到 90)
 * range: 相机距离目标的距离（单位：米）
 */
export const LOCATIONS = [
    {
        id: "tokyo_tower",
        name: "东京铁塔",
        center: { lat: 35.6585805, lng: 139.7454329, altitude: 0 },
        heading: 45,
        tilt: 65,
        range: 800
    },
    {
        id: "new_york",
        name: "纽约曼哈顿",
        center: { lat: 40.712743, lng: -74.005974, altitude: 0 },
        heading: 120,
        tilt: 60,
        range: 1500
    },
    {
        id: "fuji_mountain",
        name: "富士山 (地形)",
        center: { lat: 35.3606, lng: 138.7274, altitude: 3000 },
        heading: 0,
        tilt: 75,
        range: 15000 // 看山体需要将相机拉远一点
    },
    {
        id: "grand_canyon",
        name: "科罗拉多大峡谷",
        center: { lat: 36.1069, lng: -112.1129, altitude: 1000 },
        heading: -45,
        tilt: 65,
        range: 4000
    },
    {
        id: "paris",
        name: "巴黎埃菲尔铁塔",
        center: { lat: 48.8584, lng: 2.2945, altitude: 0 },
        heading: 90,
        tilt: 60,
        range: 1000
    }
];
