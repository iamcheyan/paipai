# 拍拍 (Paipai) - Hackathon Project

**临时项目名**: 拍拍

这是一个黑客松 APP demo 项目。**拍拍** = 地点智能取景教练 + 拍照社交榜单。

**当前状态**: 已升级到 Expo SDK 54，真机 Expo Go happy path 已跑通（地图 + 真实照片榜单 + 相机叠图引导）。Web 预览可用。

## 核心功能
1. **智能取景引导** — 打卡时提示最佳角度，参考叠图帮用户拍出大片
2. **地点拍照社交** — Google Maps 绑地点，此地照片榜 + 点赞留言

## 项目目标
- 明天现场把 APP demo 跑起来并演示
- 一条 happy path 真做，其余 mock
- 详见 `notes/PRODUCT_SPEC.md`

## 接手方式（扔文件夹协议）
任何队友或 AI 拿到文件夹后，**必须先读**：

1. `HOW_TO_CONTINUE.md` （最新状态 + **如何预览**）
2. `PROJECT_CONTEXT.md`
3. `src/README.md` （快速启动 + 预览命令）

## 如何快速预览（写给队友）
详见 `HOW_TO_CONTINUE.md` 中的“如何预览 / 运行”章节，或 `src/README.md`。

简版：
- **Web**：`cd src && npx expo start --web`
- **真机**：`cd src && npx expo start -c` → 用手机 Expo Go 扫码（同一 WiFi）
- **模拟器**：`npx expo start --ios`

**前提**：复制 `src/.env.example` 为 `.env` 并填 Google Maps Key。

## 目录结构
- `demo/` - 演示材料、mock、视频、截图
- `notes/` - 规格、脚本、API Key 开通指南
- `src/` - 源代码（Expo 项目）
- `README.md` - 本文件
- `HOW_TO_CONTINUE.md` - **最重要**，包含预览说明
- `PROJECT_CONTEXT.md` - 背景
- `AI_WORKFLOW.md` - 多 AI 协作

**注意**：Google Maps API Keys 已内置在 app.config.ts 中（仅 demo）。不需要额外配置 .env 即可运行。

## 明天团队同步建议
- 把整个 `paipai-hackathon` 文件夹发给队友
- 让他们先读 `HOW_TO_CONTINUE.md`
- 每个人先跑一遍真机预览
- 分工见 `notes/TEAM.md` + `src/README.md`

更多细节见 PROJECT_CONTEXT.md。