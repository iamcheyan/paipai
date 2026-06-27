# HOW_TO_CONTINUE - 拍拍 Hackathon Project

**最后更新**: 2026-06-26
**当前状态**: ✅ 真机 Expo Go 跑通 happy path（SDK 54 + App Store 版 Expo Go）。真实照片已替换 mock 占位符。Web 预览可用，相机叠图引导在真机可用。明天可同步给团队。

## 项目概述（快速恢复）
- 项目名：**拍拍**
- 性质：黑客松 APP demo
- 核心要求：明天现场把 demo 跑起来并演示
- 重要共识：**不需要写完整代码**。mock 数据、预录视频、幻灯片 + live demo 均可。
- 详细规格：`notes/PRODUCT_SPEC.md`

## 两大核心功能
1. **智能取景引导** — 打卡拍照时，提示 + 参考叠图帮用户找到黄金角度
2. **地点拍照社交** — Google Maps 绑地点，此地照片榜 + 点赞留言（类大众点评晒图）

## 如何预览 / 运行（团队必读）

**重要**：所有预览前先确保：
- Google Maps Keys 已内置（demo，实际使用请替换）。**LLM key** 已切换到 keyllm 配置（见代码中 LLM_* 常量）。
  - .env.example 已更新。创建 src/.env 并填入或直接使用内置 key。
  - 没有 key 或 key 无效时，Gemini 分析会失败或显示“暂时不可用”。
  - 重启 `npx expo start -c` 后生效。
- `npm install` 已执行

### 1. Web 预览（最快，UI + 列表 + 真实照片）
```bash
cd src
npx expo start --web
```
浏览器打开 http://localhost:8081 （或终端显示的地址）

### 2. iOS 模拟器（看真实地图 marker）
```bash
cd src
npx expo start --ios
```
需安装 Xcode。

### 3. 真机（推荐，用 Expo Go 看完整效果：地图 + 相机叠图 + Gemini AI）
1. 手机和电脑连**同一个 WiFi**
2. 手机安装 **Expo Go**（App Store 最新版即可，项目已升级到 SDK 54）
3. 电脑执行：
   ```bash
   cd src
   npx expo start -c
   ```
4. 手机打开 Expo Go，扫描终端二维码
5. 第一次会要求允许**相机**和**位置**权限

**Gemini 集成（强制 Google Cloud 项，使用成熟开源）**：
- 在跟拍预览页点击“用 Gemini AI 分析”按钮 → 使用官方 @google/generative-ai SDK（GitHub/npm 成熟方案）调用 Gemini 1.5 Flash（视觉模型）分析照片，给出动态构图建议。
- 没有自己写 fetch，直接复用官方库。
- 这直接满足了必须使用 Gemini API / Google Cloud 的要求。
- 分析结果会显示在预览页，可用于上传时的文案或展示。

**Happy Path 测试**：
- 首页看到地图 + 两个热点（Google 涩谷办公室带 DEMO）
- 点击 Google 卡片 → 进入榜单（已显示真实建筑照片）
- 右下角点「📷 跟拍」 → 相机打开 + 叠图引导
- 拍照 → 点击 Gemini AI 分析 → 上传 → 返回榜单更新

**注意**：
- Web 版地图是占位符（因为 react-native-maps 不支持 web）
- 真机才能完整测试相机 overlay 和 Gemini 视觉分析
- **Web 保底预览**：Web 端可调用前置摄像头（已设 facing="user"）。如实时相机问题，相机页面有“模拟拍照 (示例照片)”按钮，使用真实示例图片，流程（Gemini 分析 + 上传）继续。最终 Demo 可 Web 预览 + 提前录制真机视频。
- **部署要求（强制项）**：必须部署并提交链接。
  - 为了真机体验，**不部署整个 App**，而是部署 AI 后端服务（Gemini 照片分析）。
    - 目录：deploy/gemini-service/
    - 包含 index.js（用 Gemini SDK）、package.json、Dockerfile。
    - 部署命令：
      ```
      cd deploy/gemini-service
      gcloud run deploy paipai-gemini --source . --port 8080 --allow-unauthenticated --region asia-northeast1
      ```
    - 部署后得到 https URL，填入 camera/[id].tsx 的 DEPLOYED_URL，然后 App 会调用部署的服务。
    - 提交这个 Cloud Run URL（满足 Google Cloud + 部署要求）。
  - 如果需要 Agent：用 Antigravity 部署更多 agent 逻辑，提交对应链接。
- **办公室 WiFi 问题**：Google 办公楼网络常有设备隔离，LAN (exp://192.0.0.x) 连不上。
  - 开发/真机体验用 `--tunnel`：`npx expo start -c --tunnel`
  - 用终端给出的 tunnel URL（不是本地IP）在手机 Safari 打开，Expo Go 会加载完整真机 App（地图 + 相机 + Gemini 分析）。
  - 部署后用公开链接预览，解决本地网络问题。这是解决今天预览问题的最好办法，同时满足提交要求。

## 当前任务
1. 读 `PRODUCT_SPEC.md` + `DEMO_SCRIPT.md` + `CORE_VS_MOCK.md` 恢复上下文
2. **已知信息**（2026-06-26 更新）：
   - 场地：Google Japan, Shibuya Stream, 东京涩谷
   - Demo 点位：Google 办公楼门口（主）+ 涩谷十字路口（副）
   - 团队 5 人：见 `notes/TEAM.md`
   - Maps API：开 3 个，见 `notes/GOOGLE_MAPS_SETUP.md`
3. **已完成**：
   - 项目升级到 Expo SDK 54（匹配当前 App Store Expo Go）
   - `src/` Expo 骨架 + 真实照片 mock + 相机叠图可用
   - 真机 happy path 已跑通
4. **可继续执行**：
   - 拍摄 demo 点位参考图 → `demo/screenshots/`
   - 录 backup demo 视频 → `demo/videos/`
   - 做幻灯片（按 `PITCH_OUTLINE.md`）
   - 团队同步后继续优化 UI / 加动画 / 完善相机引导

## 已完成
- [x] 目录结构 `demo/` `notes/` `src/`
- [x] 产品规格 `notes/PRODUCT_SPEC.md`
- [x] 演示脚本 `notes/DEMO_SCRIPT.md`
- [x] 真做/mock 分工 `notes/CORE_VS_MOCK.md`
- [x] Pitch 大纲 `notes/PITCH_OUTLINE.md`
- [x] Mock 数据 `demo/mock-data/*.json`（真实照片已替换）
- [x] 时间线 `notes/TIMELINE.md`
- [x] 项目升级到 SDK 54 + 真机 happy path 跑通
- [x] 预览文档（HOW_TO_CONTINUE + src/README）已完善，方便团队同步

## 推荐目录
- `demo/` — mock 数据、截图、参考图、backup 视频
- `notes/` — 规格、脚本、待办
- `src/` — APP 代码

## Happy Path（演示必通）
```
地图选点 → 地点榜单 → 点「跟拍」→ 相机叠图引导 → 拍照 → 上传 → 榜单更新
```

## 注意事项
- 只做 **1–2 个点位** 的真取景引导，其余 mock
- 社交后端可先本地 JSON，榜单 UI 优先
- 相机 overlay 是杀手锏，必须有 backup 视频

---

**重要**：新 AI / 队友拿到文件夹后，**必须先读**：
1. 本文件（HOW_TO_CONTINUE.md）—— 包含最新状态 + **详细预览命令**
2. `PROJECT_CONTEXT.md`
3. `src/README.md`（快速启动）

明天把整个 `paipai-hackathon` 文件夹发给队友，让他们先跑一遍预览再讨论优化。