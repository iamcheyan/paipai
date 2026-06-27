# 拍拍 App（Expo SDK 54）

地点智能取景 + 拍照社交榜单 — 黑客松 demo。

> **当前状态**：SDK 54（匹配 2026 年 6 月 App Store 最新 Expo Go）。真机已跑通 happy path，真实照片已替换占位符。

## 快速预览（三种方式）

**前提**：Google Maps Keys 已内置在 app.config.ts（仅用于本次 demo）。如需覆盖可创建 .env（见 .env.example）。

### 1. Web 预览（最快）
```bash
cd src
npx expo start --web
```
浏览器打开 http://localhost:8081

（地图是占位符，列表和照片已真实）

### 2. iOS 模拟器（看真实地图）
```bash
cd src
npx expo start --ios
```
需要 Xcode。

### 3. 真机（完整体验，推荐）
```bash
cd src
npx expo start -c
```
1. 手机和电脑在**同一个 WiFi**
2. 手机安装 **Expo Go**（App Store 最新版）
3. 用 Expo Go 扫终端二维码
4. 授权**相机**和**位置**权限

**Happy Path**：
1. 首页点击「Google 涩谷办公室」（带 DEMO）
2. 进入榜单（已显示真实建筑照片）
3. 右下角点「📷 跟拍」
4. 按提示对齐 → 拍照 → 上传 → 榜单更新

## 页面结构

| 路由 | 功能 |
|------|------|
| `/` | 地图 + 附近热点列表 |
| `/location/[id]` | 地点榜单 + 点赞 |
| `/camera/[id]` | 跟拍模式（相机叠图 + 提示 → 拍照 → 上传） |

## 页面结构

| 路由 | 功能 |
|------|------|
| `/` | 地图 + 附近热点列表 |
| `/location/[id]` | 地点榜单 + 点赞 |
| `/camera/[id]` | 跟拍模式（相机叠图 + 提示 → 拍照 → 上传） |

## Happy Path

1. 首页点 **Google 涩谷办公室**（DEMO 标记）
2. 查看此地榜单，点赞
3. 点 **跟拍** → 授权相机 → 按提示对齐 → 拍照 → 上传
4. 返回榜单，你的照片出现在第一位

## 环境变量

```
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=你的Key
```

## 部署要求（Hackathon 强制）

必须部署并提交链接（Agent Runtime 或 Cloud Run），否则无资格。

**为了真机体验，不部署 Web 版**：
- 部署 AI 后端（Gemini 照片分析服务）：见根目录 deploy/gemini-service/
- 部署命令：
  ```
  cd deploy/gemini-service
  gcloud run deploy paipai-gemini --source . --port 8080 --allow-unauthenticated
  ```
- 得到 URL 后，填入 src/app/camera/[id].tsx 的 DEPLOYED_URL，App 会调用部署的服务（使用 Google Cloud Gemini）。
- 提交这个 Cloud Run URL。

这样最终 Demo 用真机版（Expo Go + tunnel），同时满足部署要求。

**Gemini 分析需要 key**：
- 创建 Gemini API key: https://aistudio.google.com/app/apikey
- ⚠️ 关键：创建时必须在上方项目选择器里先切到 “AI-Architect-Pro” 项目（有正常 billing 的那个）
- 如果直接点创建，key 会落在默认 “Gemini API” 项目（gen-lang-client-0157960504），免费层级经常没 vision 配额或提示需要设置结算信息，导致分析失败。
- 加到 .env: EXPO_PUBLIC_GEMINI_API_KEY=你的key
- 否则分析会失败。

**Web 保底预览**：Web 可调用前置摄像头。如相机实时有问题，相机页有“模拟拍照 (示例照片)”按钮，使用示例图片，Gemini 分析和上传流程不变。最终可 Web 预览 + 录制真机视频。

## 团队分工

- **开发 A**：地图页、地点页、导航
- **开发 B**：相机 overlay、拍照上传
- **设计师**：替换 placeholder 为真实参考图
- **你 + AI**：接 mock 数据、修 UI、救火

## 注意

- iOS 地图默认 Apple Maps；已配 `googleMapsApiKey` 可切 Google
- 样例照片目前是 placeholder，设计师素材放进 `assets/` 后替换 `data/mock.ts`
- 社交数据存在内存中，重启 App 会清空本地上传（demo 够用）