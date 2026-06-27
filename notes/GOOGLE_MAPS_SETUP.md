# Google Maps API 开通指南（拍拍专用）

**最后更新**: 2026-06-26
**黑客松场地**: Google Japan — Shibuya Stream, 东京涩谷

---

## 结论：只需开 3 个（按技术栈二选一）

Google Cloud Console → **APIs & Services → Library**，搜索并 **Enable**：

### 方案 A — Expo / React Native APP（推荐）

| API 名称 | 必须？ | 用途 |
|----------|--------|------|
| **Maps SDK for Android** | ✅ | Android 上显示地图 |
| **Maps SDK for iOS** | ✅ | iPhone 上显示地图（现场 demo 机是 iOS 则必开） |
| **Places API (New)** | ✅ | 搜索/展示 POI（涩谷 Stream、附近打卡点） |

### 方案 B — Web PWA（开发最快，2 人一天更稳）

| API 名称 | 必须？ | 用途 |
|----------|--------|------|
| **Maps JavaScript API** | ✅ | 网页地图 |
| **Places API (New)** | ✅ | 地点搜索与详情 |

---

## 不需要开的 API（别浪费时间）

以下对拍拍 demo **用不上**，开了也浪费配额：

- Directions API / Routes API — 不做导航
- Distance Matrix API — 不算路程
- Geolocation API — 用手机 GPS 即可
- Street View Static API — 不做街景
- Maps Embed API — 用 SDK 不用 embed
- Roads API / Elevation API — 无关
- Time Zone API — 无关
- Places API (旧版) — 优先用 **Places API (New)**，别两个都开

### 可选（有余力再开）

| API | 场景 |
|-----|------|
| Geocoding API | 地址 ↔ 坐标互转（可手写坐标跳过） |

---

## OAuth 品牌信息 — 要不要填？

**结论：拍拍 demo 用 API Key 就够了，OAuth 可以先跳过。**

| 认证方式 | 用途 | 拍拍需要吗 |
|----------|------|------------|
| **API Key** | 地图显示、Places 查询 | ✅ 需要 |
| **OAuth 同意屏幕** | 「用 Google 账号登录」、读用户邮箱/日历等 | ❌ **不需要** |

Console 里弹出「必须完成应用信息配置 / OAuth 权限请求」，多半是：
- 你点进了 **Google Auth Platform → 品牌塑造** 页面（截图里就是这个）
- 或新建项目时的通用引导

**和 Maps 三个 API 不是一回事。** API Key 在 **凭据 (Credentials)** 里创建，不依赖 OAuth 填完。

### 如果页面关不掉、非要填（随便填合法值即可）

黑客松 **24 小时 demo**，不是上架产品，名字不用纠结：

| 字段 | 填什么 |
|------|--------|
| **应用名称** | `拍拍 Paipai` 或 `Paipai Hackathon Demo` |
| **用户支持邮箱** | 你自己的 Gmail（下拉选一个） |
| **受众群体** | 选 **外部 (External)** → 测试 (Testing) |
| **作用域 (Scopes)** | **不添加** — 我们不读用户 Google 数据 |
| **测试用户** | 可跳过，或加自己邮箱 |

填完不影响 Maps API Key 使用；只是项目里多了一条 OAuth 配置记录。

### 你现在该做的（正确路径）

1. **取消** OAuth 页面，或填完点创建都行
2. 去 **API 和服务 → 凭据 → 创建凭据 → API 密钥**
3. 复制 Key → 写入 `src/.env`：

```
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...你的Key
```

---

## API Key 创建步骤（按 Console 实际规则）

> **重要更正**（来自团队实测）：
> - 每个 Key **只能限制 1 个 API**，不能三个勾在一起 → 要建 **3 个 Key**
> - 应用限制里 **Android 和 iOS 只能二选一**，不能同时绑
> - Expo Go 演示阶段建议应用限制全选 **「无」**

### 服务账号那行要勾吗？

**不要勾。**

「通过服务账号对 API 调用进行身份验证」是给 Vertex AI 等后端服务用的。拍拍手机 App 用 **API Key** 调地图，不走服务账号。

---

### 建 3 个 Key（各对应 1 个 API）

重复 3 次：**凭据 → 创建凭据 → API 密钥 → 限制密钥**

| Key 名称（备注用） | API 限制（只选 1 个） | 应用限制 |
|-------------------|----------------------|----------|
| `paipai-maps-android` | Maps SDK for **Android** | **无** |
| `paipai-maps-ios` | Maps SDK for **iOS** | **无** |
| `paipai-places` | Places API **(New)** | **无** |

每个 Key 创建界面：
1. API 限制 → **限制密钥** → 只勾选上表那 1 个 API
2. 应用限制 → 选 **无**（不要选 Android/iOS，否则 Expo Go 另一台机子用不了）
3. 服务账号复选框 → **不勾**
4. 点 **创建** → 复制 Key

### 为什么应用限制选「无」？

| 若选 Android 应用 | 问题 |
|-------------------|------|
| 只能绑 Android，iOS 得再建一个 Key | 本来就 3 个 Key 了，更乱 |
| 要填包名 + SHA-1 指纹 | Expo Go 包名是 `host.exp.exponent`，不是 `com.paipai.hackathon` |
| 现场换手机可能挂 | 黑客松不值得赌 |

**无** = 开发最快、Expo Go 安卓/iOS 都能用。Key 别提交 GitHub 即可。

### 写入 `src/.env`

```bash
EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY=AIza...android
EXPO_PUBLIC_GOOGLE_MAPS_IOS_KEY=AIza...ios
EXPO_PUBLIC_GOOGLE_PLACES_KEY=AIza...places

# 兜底：只配了一个 Key 时也能跑
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...ios
```

---

## 免费额度（够用）

Google Maps Platform 每月有 **$200 免费抵扣**（按 SKU 计费）。黑客松一天 demo 流量极小，正常不会超。

Places API (New) 常见调用：
- Nearby Search — 按请求计费
- Place Details — 按请求计费

**省钱技巧**：把涩谷 Stream 等 demo 点位 **写死在 `locations.json`**，现场不反复调 Places。

---

## 在拍拍项目里怎么用

```
地图页        → Maps SDK / Maps JavaScript API
显示 POI 名称  → 本地 JSON 为主，Places API 为辅（搜附近热点）
照片绑地点     → 自己存 lat/lng，不依赖 Maps API
```

### Expo 配置示例

```json
// app.json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": { "apiKey": "YOUR_ANDROID_KEY" }
      }
    },
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_IOS_KEY"
      }
    }
  }
}
```

环境变量（勿提交 git）：

```
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=xxx
```

---

## 现场 Checklist

- [ ] 3 个 API 已 Enable
- [ ] API Key 已生成，团队共享（.env，不进 git）
- [ ] 手机有网，Key 无 IP 限制冲突
- [ ] 备用：地图页截图 `demo/screenshots/map-shibuya.png`