# 单词学习 App - Vocabulary Learning App

基于词根词缀法的英语单词学习应用，每天25个单词，高效记忆。

## 功能特性

- **每日25词**：按天分组学习，共5天125个核心词汇
- **词根词缀法**：通过拆解单词结构，理解记忆而非死记硬背
- **智能测验**：学完每天单词后可进行专项测验，未掌握的自动标记复习
- **自定义词库**：支持导入 Excel 词库扩展学习范围
- **进度追踪**：可视化学习进度，清晰掌握学习状态

## 技术栈

- **前端**：React 18 + TypeScript + Vite
- **UI 组件**：Ant Design 5 + Tailwind CSS
- **后端/数据库**：Supabase (认证 + PostgreSQL)
- **部署**：Vercel

## 内置词库（按词根词缀分组）

| Day | 词根 | 主题 | 示例单词 |
|-----|------|------|----------|
| 1 | spect- (看) | 视觉相关 | inspect, respect, perspective, spectator |
| 2 | port- (携带) | 运输相关 | transport, export, portable, passport |
| 3 | dict- (说) | 语言相关 | predict, contradict, dedicate, verdict |
| 4 | tract- (拉/拖) | 牵引相关 | attract, contract, distract, extract |
| 5 | press- (按压) | 压力相关 | compress, express, depress, suppress |

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，填入你的 Supabase 配置：

```bash
cp .env.example .env
```

### 3. 运行开发服务器

```bash
npm run dev
```

### 4. 构建生产版本

```bash
npm run build
```

## Supabase 数据库配置

在 Supabase Dashboard 的 SQL Editor 中执行 `supabase/migrations/` 目录下的 SQL 文件：

1. `20240101000000_init_schema.sql` - 初始化表结构
2. `20240101000001_add_user_trigger.sql` - 用户注册触发器

## 学习流程

```
选择天数 → 学习25个单词（翻卡模式）→ 自评认识/不认识
    ↓
全部学完 → 进入测验模式（选择题）
    ↓
查看结果 → 未掌握的单词自动标记 → 返回复习
    ↓
全部掌握 → 进入下一天学习
```

## License

MIT
