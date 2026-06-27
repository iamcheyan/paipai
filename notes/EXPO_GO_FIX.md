# Expo Go 版本不兼容 & 预览说明（已解决）

**当前状态（2026-06-26）**: ✅ 项目已升级到 **Expo SDK 54**，使用 App Store 最新版 Expo Go 即可在真机直接扫码。真实照片已替换，相机叠图引导可用。

**历史问题**: 之前降到 SDK 52，后 App Store Expo Go 更新到 54，出现不兼容提示。

**解决方案**: 项目已升级到 54（见 src/package.json）。不再需要降级。

**详细预览方式**请直接阅读：
- `HOW_TO_CONTINUE.md` → “如何预览 / 运行” 章节
- `src/README.md` → 快速预览三种方式

## 快速命令参考

### Web
```bash
cd src
npx expo start --web
```

### 真机（Expo Go）
```bash
cd src
npx expo start -c
```
手机 Expo Go 扫码（同一 WiFi + 授权相机/位置）。

### 模拟器
```bash
cd src
npx expo start --ios
```

---

## 方案 A — TestFlight 装新版 Expo Go（推荐，5 分钟）

1. iPhone 打开：https://testflight.apple.com/join/GZJxxfUU
2. 安装 **Expo Go（SDK 56 测试版）**
3. 电脑重新 `npx expo start`
4. 用 **TestFlight 里的 Expo Go** 扫码（不是 App Store 旧版）

明天黑客松：让组员都装这个 TestFlight 版，最省事。

---

## 方案 B — App Store 先更新

1. App Store → 搜 **Expo Go** → 更新到最新
2. 若仍报同样错误 → 必须用 **方案 A（TestFlight）**

> 截至 2026 年 5 月，SDK 55/56 的 Expo Go 曾卡在 App Store 审核，TestFlight 更稳。

---

## 方案 C — Mac 上用 iOS 模拟器（无真机时）

```bash
cd src
npx expo start --ios
```

需安装 Xcode。模拟器**能测地图和导航**，相机要用真机。

---

## 方案 D — 降级项目到 SDK 52（全队 App Store Expo Go）

若 TestFlight 不方便（全员 Android 等），可把项目降到 SDK 52，让 App Store Expo Go 直接能用。需要开发改 `package.json`，说一声让 AI 做。

---

## 验证成功

扫码后应看到拍拍首页：「发现拍照热点」+ 地图 + Google 涩谷办公室列表。