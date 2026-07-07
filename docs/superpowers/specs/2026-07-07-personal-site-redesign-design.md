# 个人网站重设计 — 设计文档（Quiet Signal v3.0）

日期：2026-07-07
状态：已经用户确认（方向 A · Quiet Signal + 单页滚动，含 TargetCursor）

## 1. 背景与目标

yuzhuojia.fun（仓库 nohairblingbling.github.io）现为 CRA + Bootstrap 的作品集模板站。目标：为计算机方向研究者 Yuzhuo Jia 重建个人主页。

设计关键词：**暗色、高级、克制、科技感、轻赛博**。赛博感来自细节（HUD 角标、等宽字体标签、坐标状态栏、单一电光青强调色），不靠满屏霓虹和故障效果。杜绝模板感。

约束：

- 语言：英文
- 头衔现状：Research Assistant @ Tsinghua University（用户当前身份；此文案必须是 `content.ts` 中的一行字符串，便于转博后修改）
- 保留自定义域名 yuzhuojia.fun 与 GitHub Pages 部署方式
- 内容全部来自旧站 `content_option.js` 的真实数据，不虚构

## 2. 技术栈

| 项 | 选择 | 说明 |
|---|---|---|
| 脚手架 | Vite + React + TypeScript | 替换已停止维护的 react-scripts |
| 样式 | Tailwind CSS v4（@tailwindcss/vite） | 替换 Bootstrap |
| 动效 | reactbits.dev 组件（TS + Tailwind 变体） | 经 `npx shadcn@latest add https://reactbits.dev/r/<Component>-TS-TW` 拷贝源码到 `src/components/reactbits/`，可自由改参 |
| 动效运行时 | motion / gsap / ogl | 按所选组件的实际依赖安装，不多装 |
| 字体 | @fontsource-variable/inter + @fontsource-variable/jetbrains-mono | 自托管，无 Google Fonts 运行时请求（国内可访问性） |
| 路由 | 无 | 单页锚点滚动 |
| 部署 | gh-pages 推 `dist` | `CNAME` 放入 `public/`（修复旧站 CNAME 不在部署产物内的问题） |

## 3. 信息架构（单页六段）

顶部导航：自制固定细条 — 毛玻璃背景 + 底部发丝线，左侧 `YZ_J` 标识，右侧等宽字体锚点链接（About / Research / Publications / Projects / Contact，与页面区块顺序一致）+ 当前区块高亮；移动端折叠为简单菜单。

### 3.1 Hero
- 背景：`Particles`（低密度、小粒径、慢速漂移、青色微光；仅此一处 WebGL）
- 等宽小标：`01 / HCI × EMBODIED AI`
- 姓名 "Yuzhuo Jia"：`DecryptedText` 入场解码一次
- Tagline：一句话研究定位（HCI、Robotics、MR、wearables、AI Agents，取自旧站 aboutme）
- 现职行：`Research Assistant @ Tsinghua University`（content.ts 单行配置）
- 主 CTA（`StarBorder`）：View Research（锚点）；次链接：GitHub / Email
- 底部滚动提示 + 状态点 `● OPEN TO COLLABORATION`

### 3.2 About（编号 02）
- 短 bio（源自旧站 dataabout.aboutme）
- 头像 touxian.jpg：黑白滤镜，hover 恢复彩色
- 教育/经历时间线（源自 worktimeline）：Tsinghua RA (2025.2–) → USYD MS (2023.2–2025.3) → Nanfang College BS (2017.9–2021.6)
- 研究关键词等宽 chips：HCI / Robotics / Mixed Reality / Wearables / AI Agents 等
- 数据行（`CountUp`，滚动触发一次）：4 publications · 6 research projects · 3 institutions
- 明确移除：旧站技能百分比进度条

### 3.3 Research（编号 03）
- 6 段研究经历（源自 researchexperience，全部保留）：Adaptive Reading System / Embodied Intelligence Group / MathAdventure / BiFocalNet / FODAP / SPD-YOLOv7
- 形式：编号（01–06）+ 标题 + 时间段 + 描述的列表行；`AnimatedContent` 逐条浮现（一次性）；hover 显示青色四角括号
- 描述较长：默认 `line-clamp-2` 截断为两行，整行可点击展开/收起（桌面与移动端行为一致）

### 3.4 Publications（编号 04）
- 4 篇（源自 dataportfolio，全部保留）：BiFocalNet（TGRS，Under Revision）/ FODAP（BIBM 2024，arXiv 链接）/ YOLOv5 行人检测（ICIPIC，DOI）/ CHI'26 在投（Balancing Automation and Agency）
- 形式：`SpotlightCard` 双列网格（移动端单列）：缩略图（旧站 assets/research/ 迁移）+ 标题 + 作者列表（Yuzhuo Jia 高亮，保留 * 共同一作标记）+ venue + 状态徽章（Under Revision / In Submission）+ DOI/arXiv 外链
- 无链接时显示 "Code coming soon" 等灰态文字，不放死链

### 3.5 Projects（编号 05）
- 3 个（源自 projectportfolio）：Paper Review Assistant / Interview Assistant / DCD AR Training
- 形式：与 Publications 同一卡片体系（`SpotlightCard`），标签换色区分；图片迁移自 assets/project/；GitHub 外链（DCD 无链接则不显示按钮）

### 3.6 Contact / Footer（编号 06）
- 大号邮箱链接：hover 时 `DecryptedText` 解码效果；邮箱值 = 旧站 yjia8942@uni.sydney.edu.au（content.ts 单行可改；已提醒用户此邮箱可能随毕业失效）
- 社交：GitHub（nohairblingbling）、Instagram（lorcanxoo）、Google Scholar（content.ts 留空位，为空则不渲染）
- 等宽坐标行：`● BEIJING — 39.99°N 116.32°E`、版权行、返回顶部
- 明确移除：emailjs 联系表单（旧站配置为占位符，从未工作）

## 4. 视觉系统

| Token | 值 | 用途 |
|---|---|---|
| bg-base | #050608 | 页面底色 |
| bg-raised | #0A0E12 | 卡片 |
| border-hairline | #16232C | 发丝线边框 |
| accent | #2DD4E8 | 唯一强调色：小标签、角标、hover、状态点、徽章描边 |
| text-primary | #E8EDF2 | 标题正文 |
| text-secondary | #8FA0AD | 次要文字 |
| text-muted | #5B6976 | 弱化文字、坐标行 |

- 字体：Inter Variable（正文/标题），JetBrains Mono（编号、chips、状态栏、徽章、导航锚点）
- 圆角 2px（近直角，技术感）；卡片 1px 发丝线边框
- 区块标题格式：`02 / ABOUT` 等宽编号 + 大号标题；内容最大宽度约 max-w-5xl，区块纵向留白充足（py-24～32）
- 强调色使用纪律：大面积永远是黑/灰白，青色只做点缀

## 5. 动效清单与降级规则

| 位置 | 组件 | 行为 |
|---|---|---|
| Hero 背景 | Particles | 持续、低密度慢漂移 |
| 姓名 | DecryptedText | 入场一次 |
| 区块标题 | ScrollReveal | 滚动到位从模糊变清晰，一次 |
| 内容浮现 | AnimatedContent / FadeContent | 一次性 |
| 论文/项目卡 | SpotlightCard | 仅 hover |
| 主 CTA | StarBorder | 全站唯一常驻循环动效 |
| 光标 | TargetCursor | 仅桌面端（pointer: fine），四角框锁定交互元素；已确认默认加入，验收时可再评估 |
| 邮箱 | DecryptedText | hover 触发 |

降级规则（硬性）：

1. `prefers-reduced-motion: reduce` → Particles 不渲染、文字动效直接呈现最终态、StarBorder 静态边框、TargetCursor 关闭
2. 移动端/触屏（pointer: coarse 或窄视口）→ Particles 关闭或大幅降密度、TargetCursor 关闭
3. 内容区入场动效只播放一次，不做滚动反向回放
4. WebGL 仅存在于 Hero 一处

## 6. 工程结构

```
src/
  content.ts            # 全部可编辑内容（文案、论文、项目、链接、邮箱、头衔）
  main.tsx / App.tsx
  index.css             # Tailwind + 设计 token（CSS 变量）
  components/
    reactbits/          # CLI 拷入的动效组件源码
    ui/                 # SectionHeader、Badge、CornerBrackets 等
    Nav.tsx  Hero.tsx  About.tsx  Research.tsx
    Publications.tsx  Projects.tsx  Contact.tsx  Footer.tsx
  assets/               # 迁移的论文/项目/头像图片
public/
  CNAME                 # yuzhuojia.fun
  favicon.svg           # 极简 YJ 等宽风格
```

- SEO：index.html 内 title（Yuzhuo Jia — HCI Researcher）、description、OG 标签
- 清理：删除旧 `src/`、`build/`、`.history/`、`TUTORIAL_CN.md`、所有 `.DS_Store`；重写 `.gitignore`（node_modules、dist、.DS_Store、.history）
- 分支策略：全部工作在 `redesign` 分支，用户验收后合并 master 并部署；线上旧站期间不受影响

## 7. 验证标准

1. `npm run build` 无错误无类型告警
2. 本地 dev + 浏览器预览逐段检查：桌面（1280）与移动（375）视口截图
3. `prefers-reduced-motion` 模拟下无循环动效、内容完整可读
4. 移动视口无横向滚动条；触屏无自定义光标
5. 所有外链（DOI、arXiv、GitHub、Instagram）与旧站一致且可点
6. `npm run preview` 构建产物检查通过；`dist/` 内含 CNAME
7. 部署动作（gh-pages / 合并 master）仅在用户明确同意后执行

## 8. 明确排除项（YAGNI）

- 不做多语言/语言切换
- 不做浅色主题与主题切换（暗色即品牌）
- 不做博客/CMS
- 不做联系表单（mailto 足够）
- 不做路由分页

## 9. 修订记录（2026-07-07 晚，用户确认）

按用户最新简历（CV_of_YuzhuoJia.pdf）与"学术主页第一屏信息密集"诉求做以下修订：

- **首屏合并**：Hero 与 About 合并为双栏首屏——左栏 kicker/姓名/头衔/研究简介/方向 chips/CTA（View Research、GitHub、Email、CV），右栏照片（黑白 hover 彩色 + 角标）+ EDUCATION 竖排（3 条），底部发丝线上方为 CountUp 数据行（6/6/3）+ 状态点。独立 About 区块取消，导航移除 ABOUT，区块重编号：02 Research / 03 Publications / 04 Projects / 05 Contact
- **内容全量更新**：邮箱改为 yuzhuojia.cs@gmail.com；研究定位改为 Agentic AI × LLM × HCI（当前方向：LLM 具身认知）；论文 4→6 篇（CHI'26 Poster 已 Accepted 并更新题目与作者、新增 LUMOS RO-MAN 2026、新增 Nature MI in preparation、BIBM 换正式 DOI）；研究经历新增 LLM Bodily Representations（清华）、移除玉米害虫检测；项目新增 Fine-tuning LLMs for Struggling Student Simulation（GitHub 链接待用户补充）、移除 Paper Review Assistant；教育时间按简历修正
- **CV 下载**：public/cv.pdf，首屏 CTA 提供 CV ↗ 外链
- **卡片变体**：Publication/Project 卡支持无图（LUMOS、NMI、LLM 微调项目）；Project 卡显示时间段
- **确认排除**：简历中 Awards & Activities 与 Skills 不上站（CV 链接可达）

## 10. 修订记录二（2026-07-07 深夜，用户逐项指定）

- 首屏教育经历不显示本科（南方学院）条目，仅清华 RA + 悉大 MSc
- 移除数据统计行（6/6/3 CountUp）
- 照片默认彩色（黑白默认在中文语境不吉利），去掉灰度滤镜
- 姓名 DecryptedText 增加 `both` 模式：入场解码一次 + hover 可重复触发
- Research 精简为 3 条：Bodily Representations / Adaptive Reading / MathAdventure（删除 Embodied Intelligence Group、BiFocalNet、FODAP）
- Publications 精简为 3 篇：CHI'26 / LUMOS（配用户提供的实验图 lumos.jpg）/ Nature MI in prep（删除 BiFocalNet、FODAP、YOLOv5）
- Projects 区块整体移除（导航同步），Contact 编号 04
- TargetCursor 性能优化：目标矩形改为锁定时缓存 + scroll/resize 刷新（消除每帧 getBoundingClientRect 强制布局）；小圆点即时跟随（去 lerp 拖尾），仅四角保留缓动
- 清理不再使用的图片资产（BiFocalNet/bibm1/yolo5/interview/dcd）

## 11. 修订记录三（2026-07-07 深夜二，"暗房"艺术层，用户确认 A+B 混合）

背景：用户是摄影师，希望在保留暗色/克制/轻赛博骨架上更艺术。确认方案 = 暗房冲印隐喻全套 + 衬线斜体点缀字；明确否决 ScrollVelocity 滚动字带。

- **胶片颗粒**：新增 `Noise`（reactbits 等效自写，canvas 图案平铺 + 限频刷新），fixed 全屏 z-[45]（导航之上、光标之下），透明度约 5%；reduced-motion / 触屏降级为静态颗粒
- **相纸暗角**：Hero 区径向渐变 vignette 叠层
- **双色调显影**：论文配图默认灰度 + `mix-blend-color` 青蓝罩色（双色调），hover 700ms 过渡"显影"为彩色；进场用新增 Reveal `develop` 变体（模糊+过曝→清晰）
- **帧编号语言**：区块标签从 `02 / RESEARCH` 改为 `FR.02 — RESEARCH`，Hero kicker 同步 `FR.01 — …`
- **EXIF 签名**：页脚新增 `ISO 400 · ƒ/1.4 · 1/125` 等宽字符行（content.ts 可改）
- **衬线点缀字**：引入 @fontsource/instrument-serif（400 + italic），`--font-serif` token；区块标题末词（Selected *research* / *Publications* / Get in *touch*）与 Hero bio 中 2-3 个关键词（content.ts 用 *星号* 标记，Hero 解析渲染）用衬线斜体、淡青 #bfe6ee
- **保持不变**：结构、内容、Particles、DecryptedText、TargetCursor、照片彩色

## 12. 修订记录四（2026-07-07 深夜三，多页化 + 胶卷画廊，用户确认）

- **多页架构**：Vite 多入口（`index.html` / `publications/index.html` / `gallery/index.html`），无路由库，干净 URL；共享 `mount.tsx` + `Layout`（Noise/TargetCursor/Nav/Footer）；页面进场 0.45s 淡入（reduced-motion 关闭）
- **首页**＝About：Hero 首屏（右栏新增 GET IN TOUCH：邮箱 hover 解码 + GitHub/Instagram，即用户所说 "inscribe"）+ 精选论文 2 篇（`featured` 标记）+ `ALL PUBLICATIONS →`；Research 区块与独立 Contact 区块删除（ResearchEntry 数据一并移除）；CTA 行改为 View publications / GALLERY / CV
- **/publications/**：全部论文；**/gallery/**：胶卷画廊——横向滚动长条、齿孔（repeating-gradient）、胶片边缘刻字（`YZJ 400 · 01A · ZYD03689`，帧号用原始文件名）、鼠标拖拽 + 滚轮横滑（touch 走原生 pan-x）、逐帧显影进场
- **灰 hover**：论文图静置改纯灰度（去青蓝 mix-blend 罩色），hover 显影彩色；SpotlightCard 光斑从青色改中性灰白
- **照片资产**：4 张 ZYD 系列压至 1600px/q80（26MB → 1.16MB），`src/assets/gallery/`
- **CDN 决议**：Cloudflare 代理 yuzhuojia.fun（DNS 托管 + 橙云），整站走边缘缓存；代码侧仅做本地压缩与懒加载，不改图片 URL
- **导航**：ABOUT(/) / PUBLICATIONS(/publications/) / GALLERY(/gallery/)，按 pathname 高亮
