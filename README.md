# 数字游民之家 (dnh001.com)

> 面向全球数字游民的社区平台，提供城市评分、社区交流、聚会活动等服务。

## 技术栈

### 前端
- **框架**: Taro 4 + React
- **样式**: TailwindCSS 4
- **构建**: Vite
- **部署**: Cloudflare Pages

### 后端
- **框架**: Hono (Cloudflare Workers)
- **数据库**: Cloudflare D1 (SQLite)
- **部署**: Cloudflare Workers

## 项目结构

```
dnh001/
├── src/                    # 前端源码
│   ├── pages/             # 页面组件
│   │   ├── index/         # 首页
│   │   ├── cities/        # 城市列表
│   │   └── city-detail/   # 城市详情
│   ├── api/               # API 客户端
│   ├── types/             # TypeScript 类型
│   └── i18n/             # 国际化资源
├── api/                   # 后端源码
│   ├── src/
│   │   ├── routes/       # API 路由
│   │   └── data/         # Mock 数据
│   └── wrangler.toml     # Cloudflare Workers 配置
└── config/                # Taro 构建配置
```

## 快速开始

### 前端开发
```bash
cd dnh001
npm install
npm run dev:h5    # 开发 H5
npm run dev:weapp # 开发小程序
```

### 后端开发
```bash
cd dnh001/api
npm install
npm run dev       # 本地开发 (wrangler dev)
```

### 部署

#### 前端 (Cloudflare Pages)
```bash
# 使用 Wrangler CLI
wrangler pages deploy dist --project-name=dnh001
```

#### 后端 (Cloudflare Workers)
```bash
cd api
wrangler deploy
```

## 环境变量

### 前端 (.env)
```
API_BASE=https://api.dnh001.com
```

### 后端 (wrangler secrets)
```bash
wrangler secret put DATABASE_URL
wrangler secret put R2_BUCKET
```

## 功能模块

- [x] 首页 - 热门城市推荐
- [x] 城市列表 - 筛选、排序
- [x] 城市详情 - 评分、评论
- [ ] 城市评分 API
- [ ] 用户系统
- [ ] 聚会活动
- [ ] 社区动态
- [ ] 攻略文章
- [ ] 国际化（中英文）
- [ ] AI 推荐

## License

MIT
