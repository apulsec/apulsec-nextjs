# 个人主页项目交接文档

更新时间：2026-09-09  
项目目录：`C:\AmyCODE\.test\mynext-sui`

## 1. 项目概览

这是一个基于 Next.js App Router 的个人主页/博客项目，当前重点是个人主页的 Bento 卡片布局、半透明玻璃质感、浮动导航栏、主题切换以及几个交互式视觉组件。

主要技术栈：

- Next.js `16.2.6`
- React `19.2.4`
- TypeScript
- Tailwind CSS `4`
- shadcn/ui
- `next-themes`：明暗主题切换
- `motion`：浮动 Dock 和交互动画
- `cobe`：3D 地球
- Tabler Icons、Lucide Icons

项目使用 App Router。路由由 `app` 目录下的文件系统结构决定：

| 路径 | 页面文件 | 当前用途 |
| --- | --- | --- |
| `/` | `app/page.tsx` | 个人主页 Bento 布局 |
| `/blog` | `app/blog/page.tsx` | 博客占位页 |
| `/about` | `app/about/page.tsx` | 关于页占位页 |

## 2. 当前页面效果

### 2.1 全局布局

`app/layout.tsx` 是根布局，负责：

- 加载 Inter 和 Geist Mono 字体。
- 引入 `app/globals.css`。
- 通过 `ThemeProvider` 提供明暗主题。
- 在所有页面底部挂载 `SiteFloatingDock`。

### 2.2 浮动导航栏

导航栏由 `components/site-floating-dock.tsx` 配置，底层实现位于 `components/ui/floating-dock.tsx`。

当前导航项：

- Home：`/`
- Blog：`/blog`
- About：`/about`
- 末尾按钮：切换明暗主题

桌面端导航栏固定在页面底部居中，移动端固定在右下角。主题切换还支持键盘 `D` 快捷键，逻辑位于 `components/theme-provider.tsx`。

修改导航项时，优先编辑 `components/site-floating-dock.tsx` 中的 `navigationItems`，不要直接修改 UI 组件内部的默认菜单。

### 2.3 首页 Bento 网格

首页主要代码在 `app/page.tsx`。所有卡片共用 `cardClass`：

```tsx
const cardClass =
  "relative overflow-hidden rounded-3xl border border-border/60 bg-secondary/35 shadow-[0_18px_60px_rgb(23_77_132_/_0.08)] backdrop-blur-xl"
```

这套样式提供半透明背景、边框、阴影和毛玻璃效果。

页面使用 CSS Grid 的命名区域控制响应式位置：

- 手机：两列布局，内容按多行堆叠。
- `sm`：三列布局。
- `xl`：四列布局。

每个模块通过 `[grid-area:a]`、`[grid-area:b]` 等类名放入对应区域。调整模块位置时，需要同时检查三个断点下的 `[grid-template-areas:...]`。

当前模块：

| Grid 区域 | 内容 | 关键实现 |
| --- | --- | --- |
| `a` | 个人介绍和 `Light years.🍭` | `TypingAnimation` |
| `b` | 南京地球仪 | `LocationGlobe` |
| `c` | 正在构建 | 静态状态列表 |
| `d` | 最新文章 | 链接到 `/blog` |
| `e` | 今天的英文日期和时间 | `CalendarCard` |
| `f` | 技术栈图标云 | `IconCloud` |
| `g` | 关于这个主页 | 链接到 `/about` |
| `h` | Digital garden 宣传卡片 | 背景渐变 |
| `l` | 快速入口 | Blog/About 两个入口 |

## 3. 关键组件说明

### 3.1 日期与时间：`components/calendar-card.tsx`

这里已经不再使用日历选择器，而是展示：

- 英文星期、月份、日期和年份。
- 24 小时制时间，精确到秒。
- 使用浏览器本地时间，每秒通过 `setInterval` 更新。

首页的日期卡片使用 `aspect-square` 和 `items-center justify-center` 保持正方形并居中。如果调整内容大小，优先修改 `CalendarCard` 内部的字体和间距，不要给外层卡片增加固定高度。

### 3.2 南京地球仪：`components/location-globe.tsx`

该组件使用 `components/ui/globe.tsx` 中基于 Cobe 的实现。

当前配置：

- 仅显示南京一个坐标点：`[32.0615513, 118.7915619]`。
- 南京标记使用蓝色。
- 外边缘使用淡蓝色。
- `dark` 参数根据 `next-themes` 的 `resolvedTheme` 切换地图像素与地球底色的明暗关系。
- 地球在模块剩余空间中居中显示，最大宽度为 `340px`。

如果调整地球大小，主要修改 `LocationGlobe` 中 `Globe` 的 `w-[98%]` 和 `max-w-[340px]`。如果修改动画、拖拽或 Cobe 生命周期，则编辑 `components/ui/globe.tsx`。

### 3.3 技术栈图标云：`components/ui/icon-cloud.tsx`

该组件是客户端组件，使用 Canvas 绘制可旋转的 3D 图标云。

当前 `IconCloud` 支持三种传入方式：

- `icons`：一组 React 图标。
- `images`：一组图片 URL。
- `items`：React 图标和图片 URL 的混合数组。

首页使用 `items`，其中包含：

- Python
- PyTorch
- Next.js
- JavaScript
- TypeScript
- C++
- Git
- Docker
- GPT/OpenAI
- React
- MATLAB

PyTorch 和 MATLAB 的静态 SVG 位于：

- `public/icons/pytorch.svg`
- `public/icons/matlab.svg`

在页面中通过根路径引用：

```tsx
"/icons/pytorch.svg"
"/icons/matlab.svg"
```

Next.js 会把 `public` 目录直接映射到网站根路径。

当前尺寸相关参数：

```tsx
// components/ui/icon-cloud.tsx
const ICON_CANVAS_SIZE = 48
const CLOUD_RADIUS = 125
```

- `ICON_CANVAS_SIZE` 控制 Canvas 中单个图标的绘制尺寸。
- `CLOUD_RADIUS` 控制图标在球体上的分布范围。
- 首页中每个 Tabler 图标使用 `size={80}`。
- 首页外层缩放为手机 `0.46`、`sm` `0.54`、`xl` `0.75`。

首页通过 Canvas 过滤器实现黑白效果：

- 日间模式：图标为黑色。
- 夜间模式：图标为白色。

如果继续放大图标，建议同时观察卡片尺寸，因为 Canvas 当前是 `400 × 400`，过度放大可能导致图标超出卡片可视区域。

## 4. 页面尺寸与位置调整方法

### 调整卡片高度

在 `app/page.tsx` 中查找对应卡片的 `className`：

```tsx
min-h-[160px]
min-h-[180px]
min-h-[240px]
sm:min-h-[270px]
xl:min-h-[300px]
```

`min-h-*` 是最直接的高度控制方式。带有 `aspect-square` 的模块会优先保持正方形，修改高度时需要同步考虑是否移除或保留 `aspect-square`。

### 调整卡片位置

位置由两部分共同决定：

1. 卡片自身的 `[grid-area:...]`。
2. section 上三个断点的 `grid-template-areas`。

只修改其中一处，可能导致网格重排、空白区域或模块重叠。

### 调整左右边距和模块间距

首页最外层使用：

```tsx
px-5 sm:px-6
```

网格使用：

```tsx
gap-6
```

需要让页面更宽或更窄时，优先修改 `px-*` 和 `max-w-*`；需要调整卡片间隔时修改 `gap-6`。

## 5. 开发与验证

在项目根目录执行：

```bash
pnpm dev
```

常用检查命令：

```bash
pnpm typecheck
pnpm lint -- app/page.tsx
pnpm build
```

当前已验证：

- `pnpm typecheck`：通过。
- `pnpm lint -- app/page.tsx`：通过。
- `git diff --check`：通过。

注意：`components/ui/icon-cloud.tsx` 当前仍有两个已有的 `react-hooks/set-state-in-effect` lint 错误，分别来自：

- 根据 `prefers-reduced-motion` 初始化 `isPaused`。
- 在 effect 中生成并设置 `iconPositions`。

这两个问题不是本次 SVG 接入新增的类型错误，但后续可以通过 `useMemo`、更合适的初始化方式或调整 lint 规则修复。修复时要确保不破坏 Canvas 动画和无障碍减弱动画逻辑。

## 6. 当前未提交变更

当前工作区存在未提交修改，提交前请先检查完整 diff：

```bash
git status --short
git diff
```

当前涉及的文件：

- `HANDOFF.md`
- `app/page.tsx`
- `components/location-globe.tsx`
- `components/site-floating-dock.tsx`
- `components/ui/floating-dock.tsx`
- `components/ui/globe.tsx`
- `components/ui/icon-cloud.tsx`
- `public/icons/pytorch.svg`
- `public/icons/matlab.svg`

这些修改包含此前的主页布局、浮动导航、主题、地球仪和图标云迭代。不要在不了解变更来源的情况下使用 `git reset --hard` 或 `git checkout --` 覆盖工作区。

## 7. 推荐的后续工作

按优先级建议：

1. 启动开发服务器，分别检查手机、平板和桌面宽度下的 Bento 网格。
2. 检查日间/夜间模式下地球、图标云、浮动导航的颜色和边界。
3. 修复 `icon-cloud.tsx` 中的两个 lint 问题，并测试减少动画设置。
4. 将 `app/blog/page.tsx` 从占位内容扩展为真实文章列表，必要时引入 MDX 或 CMS。
5. 为博客文章增加动态路由，例如 `app/blog/[slug]/page.tsx`。
6. 将首页卡片数据抽离成配置数组或独立组件，降低 `app/page.tsx` 的维护成本。
7. 为地球仪、图标云和日期时间组件补充更明确的键盘/屏幕阅读器体验。

## 8. 接手时的快速入口

如果只需要快速定位问题：

- 首页布局或模块位置：`app/page.tsx`
- 导航栏：`components/site-floating-dock.tsx`
- 导航栏动画实现：`components/ui/floating-dock.tsx`
- 地球显示和南京标记：`components/location-globe.tsx`
- 地球 Canvas 实现：`components/ui/globe.tsx`
- 日期和时间：`components/calendar-card.tsx`
- 技术栈图标云：`components/ui/icon-cloud.tsx`
- 全局颜色、圆角、字体和主题变量：`app/globals.css`
- 根布局和主题 Provider：`app/layout.tsx`、`components/theme-provider.tsx`
