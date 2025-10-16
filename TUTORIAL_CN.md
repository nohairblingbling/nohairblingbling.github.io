# 个人网站完整使用教程 📚

> 这是一个基于 React 的个人作品集网站模板，适合用于展示学术研究、项目经验和个人简介。本教程将手把手教你如何配置和部署自己的个人网站。

---

## 目录
1. [环境准备](#1-环境准备)
2. [获取项目代码](#2-获取项目代码)
3. [安装项目依赖](#3-安装项目依赖)
4. [个性化配置](#4-个性化配置)
5. [本地预览](#5-本地预览)
6. [部署到 GitHub Pages](#6-部署到-github-pages)
7. [自定义域名（可选）](#7-自定义域名可选)
8. [常见问题](#8-常见问题)

---

## 1. 环境准备

### 1.1 安装 Node.js

Node.js 是运行这个项目所必需的 JavaScript 运行环境。

#### Windows 用户：
1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载 LTS（长期支持）版本（推荐）
3. 运行下载的安装程序，按照提示完成安装
4. 安装完成后，打开命令提示符（cmd）或 PowerShell，输入以下命令验证：
   ```bash
   node --version
   npm --version
   ```
   如果显示版本号，说明安装成功。

#### macOS 用户：
1. 访问 [Node.js 官网](https://nodejs.org/) 下载安装包，或者使用 Homebrew：
   ```bash
   brew install node
   ```
2. 验证安装：
   ```bash
   node --version
   npm --version
   ```

#### Linux 用户：
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

### 1.2 安装 Git

Git 用于版本控制和代码管理。

#### Windows：
1. 访问 [Git 官网](https://git-scm.com/download/win)
2. 下载并安装
3. 验证：打开命令提示符，输入 `git --version`

#### macOS：
```bash
# 使用 Homebrew
brew install git

# 验证
git --version
```

#### Linux：
```bash
# Ubuntu/Debian
sudo apt-get install git

# 验证
git --version
```

### 1.3 安装代码编辑器（推荐 VS Code）

1. 访问 [VS Code 官网](https://code.visualstudio.com/)
2. 下载并安装适合你操作系统的版本
3. 安装完成后打开 VS Code

---

## 2. 获取项目代码

### 如果你已经有项目文件夹：
1. 用 VS Code 打开项目文件夹
2. 打开终端（VS Code 菜单：Terminal → New Terminal）

### 如果你是从 GitHub 克隆：
```bash
git clone <你的仓库地址>
cd <项目文件夹名称>
```

---

## 3. 安装项目依赖

在项目根目录下（就是包含 `package.json` 的文件夹），打开终端执行：

```bash
npm install
```

这个命令会安装所有项目所需的依赖包，可能需要几分钟时间。

**常见问题：**
- 如果遇到网络问题，可以使用国内镜像：
  ```bash
  npm config set registry https://registry.npmmirror.com
  npm install
  ```

---

## 4. 个性化配置

### 4.1 修改基本信息 ⭐ 最重要

打开文件：[src/content_option.js](src/content_option.js)

这是整个网站最核心的配置文件，包含了所有需要修改的个人信息。

#### 📝 修改网站标题和姓名
```javascript
const logotext = "你的姓名";  // 网站左上角显示的名字
const meta = {
  title: "你的姓名",  // 浏览器标签页标题
  description: "我是XXX，从事XXX领域研究",  // 网站描述
};
```

#### 📝 修改首页介绍
```javascript
const introdata = {
  title: "你的姓名",
  // 可以取消注释下面的内容添加首页介绍
  // animated: {
  //   first: "欢迎来到我的网站",
  //   second: "我是一名研究者",
  // },
  // description: "在这里写你的简介...",
  // your_img_url: "头像图片链接",
};
```

#### 📝 修改关于页面
```javascript
const dataabout = {
  title: "研究兴趣",  // 标题
  aboutme: "在这里写你的研究兴趣和方向...",
};
```

#### 📝 修改教育/工作经历
```javascript
const worktimeline = [
  {
    jobtitle: "学校或公司名称",
    where: "职位或学位",
    date: "时间段",
  },
  // 添加更多经历...
];
```

#### 📝 修改技能
```javascript
const skills = [
  {
    name: "Python",  // 技能名称
    value: 90,  // 熟练度（0-100）
  },
  {
    name: "React",
    value: 80,
  },
  // 添加更多技能...
];
```

#### 📝 修改研究经历
```javascript
const researchexperience = [
  {
    title: "项目标题",
    period: "时间段",
    description: "详细描述你的研究内容...",
  },
  // 添加更多研究经历...
];
```

#### 📝 修改论文发表
```javascript
const dataportfolio = [
  {
    img: "BiFocalNet",  // 图片名称（不含扩展名，图片放在 src/assets/research/ 文件夹）
    title: "论文标题",
    authors: "作者列表",
    // 或者使用数组格式标注合作作者：
    authors: [
      { name: "作者1*", bold: false },
      { name: "你的名字*", bold: true },  // bold: true 会加粗显示
      { name: "作者3", bold: false },
    ],
    conference: "会议或期刊名称",
    doi: "https://doi.org/xxx",  // 论文链接
    notes: "Under Revision",  // 可选：状态标注
    code: "https://github.com/xxx",  // 可选：代码链接
  },
  // 添加更多论文...
];
```

#### 📝 修改项目经历
```javascript
const projectportfolio = [
  {
    img: "paper",  // 图片名称（不含扩展名，图片放在 src/assets/project/ 文件夹）
    title: "项目标题",
    description: "项目描述...",
    github: "https://github.com/你的用户名/项目名",  // 可选
    website: "https://项目网址.com",  // 可选
  },
  // 添加更多项目...
];
```

#### 📝 修改联系方式
```javascript
const contactConfig = {
  YOUR_EMAIL: "your.email@example.com",  // 你的邮箱
  YOUR_FONE: "你的电话（或写 - 表示不显示）",
  description: "联系描述（可选）",

  // EmailJS 配置（用于联系表单）
  // 如果需要联系表单功能，需要在 https://www.emailjs.com/ 注册并获取这些ID
  YOUR_SERVICE_ID: "service_id",
  YOUR_TEMPLATE_ID: "template_id",
  YOUR_USER_ID: "user_id",
};
```

#### 📝 修改社交媒体链接
```javascript
const socialprofils = {
  github: "https://github.com/你的用户名",
  // 可以添加更多社交媒体：
  // linkedin: "https://www.linkedin.com/in/你的用户名/",
  // instagram: "https://www.instagram.com/你的用户名/",
  // scholar: "https://scholar.google.com/citations?user=你的ID",
};
```

### 4.2 替换图片

#### 头像图片
1. 准备你的头像图片（建议正方形，jpg/png 格式）
2. 重命名为 `icon.jpg`
3. 替换文件：[public/icon.jpg](public/icon.jpg)

#### 研究/论文配图
1. 准备你的研究项目图片
2. 放入文件夹：[src/assets/research/](src/assets/research/)
3. 在 `content_option.js` 中引用时使用文件名（不含扩展名）

#### 项目配图
1. 准备你的项目图片
2. 放入文件夹：[src/assets/project/](src/assets/project/)
3. 在 `content_option.js` 中引用时使用文件名（不含扩展名）

### 4.3 修改网站元信息

打开文件：[public/index.html](public/index.html)

```html
<meta name="author" content="你的姓名" />
```

### 4.4 配置部署地址

打开文件：[package.json](package.json)

找到这一行：
```json
"homepage": "https://你的GitHub用户名.github.io",
```

修改为你自己的 GitHub 用户名。

**重要提示：**
- 如果你要部署到 `https://你的用户名.github.io`，就这样写
- 如果你要部署到 `https://你的用户名.github.io/仓库名`，就写完整路径

---

## 5. 本地预览

在项目根目录下执行：

```bash
npm start
```

等待几秒钟后，浏览器会自动打开 `http://localhost:3000`，你就可以看到网站效果了。

**提示：**
- 修改代码后，页面会自动刷新
- 按 `Ctrl+C`（Mac: `Cmd+C`）停止开发服务器

---

## 6. 部署到 GitHub Pages

### 6.1 创建 GitHub 账号

如果你还没有 GitHub 账号：
1. 访问 [GitHub](https://github.com/)
2. 点击 "Sign up" 注册账号
3. 按照提示完成注册

### 6.2 创建仓库

#### 方式一：创建用户网站仓库（推荐）
1. 登录 GitHub
2. 点击右上角的 "+" → "New repository"
3. 仓库名称必须是：`你的用户名.github.io`（例如：`zhangsan.github.io`）
4. 选择 "Public"（公开）
5. 不要勾选 "Initialize this repository with a README"
6. 点击 "Create repository"

#### 方式二：创建项目网站仓库
1. 仓库名称可以自定义（例如：`my-portfolio`）
2. 其他步骤同上
3. 记得修改 `package.json` 中的 `homepage` 字段为：`https://你的用户名.github.io/仓库名`

### 6.3 关联本地仓库

#### 第一步：检查现有远程仓库

在项目根目录下执行：

```bash
# 查看当前的远程仓库
git remote -v
```

**情况一：如果显示了其他人的仓库地址（例如原模板作者的仓库）**
```bash
# 显示类似这样：
# origin  https://github.com/原作者/原仓库.git (fetch)
# origin  https://github.com/原作者/原仓库.git (push)
```

**解决方案：移除旧的远程仓库，添加你自己的**
```bash
# 1. 移除旧的远程仓库
git remote remove origin

# 2. 添加你自己的远程仓库
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 3. 验证是否添加成功
git remote -v
```

**情况二：如果提示 "not a git repository"（不是 Git 仓库）**
```bash
# 初始化 Git 仓库
git init

# 添加远程仓库
git remote add origin https://github.com/你的用户名/你的仓库名.git
```

**情况三：如果没有显示任何内容（没有远程仓库）**
```bash
# 直接添加远程仓库
git remote add origin https://github.com/你的用户名/你的仓库名.git
```

#### 第二步：提交并推送代码

```bash
# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: 个性化配置"

# 推送到 GitHub（第一次推送使用 -u 参数）
git push -u origin master
```

**如果推送时遇到错误：**
```bash
# 错误提示：refusing to merge unrelated histories
# 解决方案：强制合并
git pull origin master --allow-unrelated-histories
git push -u origin master
```

**如果推送到 main 分支（GitHub 新仓库默认分支）：**
```bash
# 检查当前分支
git branch

# 如果是 master 分支，需要推送到 main
git branch -M main
git push -u origin main
```

### 6.4 部署到 GitHub Pages

确保你已经在 [package.json](package.json) 中正确配置了 `homepage` 字段，然后执行：

```bash
npm run deploy
```

这个命令会：
1. 自动构建项目
2. 将构建后的文件推送到 `gh-pages` 分支
3. 自动部署到 GitHub Pages

等待 1-2 分钟后，访问你的网站：
- 用户网站：`https://你的用户名.github.io`
- 项目网站：`https://你的用户名.github.io/仓库名`

### 6.5 启用 GitHub Pages（如果自动部署不成功）

1. 进入你的 GitHub 仓库页面
2. 点击 "Settings"（设置）
3. 在左侧菜单找到 "Pages"
4. 在 "Source" 下拉菜单选择 "gh-pages" 分支
5. 点击 "Save"（保存）

---

## 7. 自定义域名（可选）

如果你有自己的域名（例如：`yuzhuojia.fun`），可以配置自定义域名。

### 7.1 在域名提供商配置 DNS

在你的域名提供商（例如：阿里云、腾讯云、GoDaddy 等）添加以下 DNS 记录：

#### 如果使用主域名（example.com）：
添加 4 条 A 记录：
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

#### 如果使用子域名（www.example.com）：
添加 CNAME 记录：
```
你的用户名.github.io
```

### 7.2 在项目中配置 CNAME

创建或修改文件：[CNAME](CNAME)

文件内容只写你的域名：
```
yourdomain.com
```

**注意：**
- 不要加 `http://` 或 `https://`
- 如果使用 `www`，写 `www.yourdomain.com`

### 7.3 在 GitHub 设置自定义域名

1. 进入仓库 Settings → Pages
2. 在 "Custom domain" 输入框填入你的域名
3. 勾选 "Enforce HTTPS"
4. 点击 "Save"

等待 DNS 生效（可能需要几分钟到几小时），然后就可以通过你的域名访问网站了。

---

## 8. 常见问题

### Q1: git remote add 提示 "already exists" 怎么办？

**原因：** 项目已经关联了一个远程仓库（通常是原模板作者的仓库）。

**解决方案：**
```bash
# 1. 先查看当前的远程仓库
git remote -v

# 2. 移除旧的远程仓库
git remote remove origin

# 3. 添加你自己的远程仓库
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 4. 验证是否添加成功
git remote -v
```

**完整的重新关联步骤：**
```bash
# 移除旧仓库
git remote remove origin

# 添加新仓库
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 提交代码
git add .
git commit -m "Initial commit: 个性化配置"

# 推送到新仓库
git push -u origin master
# 或者如果是 main 分支：
# git branch -M main
# git push -u origin main
```

### Q2: npm install 报错怎么办？

**解决方案：**
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 文件夹
rm -rf node_modules

# 使用国内镜像
npm config set registry https://registry.npmmirror.com

# 重新安装
npm install
```

### Q2: 部署后网站样式丢失或显示不正常？

**原因：** `package.json` 中的 `homepage` 配置不正确。

**解决方案：**
1. 检查 `homepage` 字段是否与你的 GitHub Pages 地址一致
2. 如果部署到 `https://username.github.io`，写：`"homepage": "https://username.github.io"`
3. 如果部署到 `https://username.github.io/repo-name`，写：`"homepage": "https://username.github.io/repo-name"`
4. 修改后重新执行 `npm run deploy`

### Q3: 图片显示不出来？

**检查清单：**
- [ ] 图片文件是否放在正确的文件夹（`src/assets/research/` 或 `src/assets/project/`）
- [ ] `content_option.js` 中的图片名称是否正确（不含扩展名）
- [ ] 图片文件名不要有空格或特殊字符
- [ ] 图片格式是否为 jpg/png/gif

### Q4: npm run deploy 报错 "Permission denied"？

**解决方案：**
```bash
# 重新配置 Git 用户信息
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"

# 确保已登录 GitHub（可能需要设置 Personal Access Token）
```

### Q5: 联系表单不工作？

这个模板使用 EmailJS 服务来处理联系表单。

**配置步骤：**
1. 访问 [EmailJS](https://www.emailjs.com/) 注册账号
2. 创建 Email Service
3. 创建 Email Template
4. 获取 Service ID、Template ID 和 User ID
5. 在 `content_option.js` 中填入这些 ID

**或者：**
如果不需要联系表单功能，可以直接删除或隐藏联系页面。

### Q6: 如何更新已部署的网站？

每次修改内容后：

```bash
# 1. 保存修改并提交到 Git
git add .
git commit -m "更新描述"
git push

# 2. 重新部署
npm run deploy
```

### Q7: 部署后多久能看到更新？

- GitHub Pages 通常在 1-5 分钟内更新
- 如果看不到更新，尝试清除浏览器缓存（Ctrl+F5 或 Cmd+Shift+R）

### Q8: 如何删除不需要的页面或功能？

**删除工作经历（Work Experience）：**
- 在 `content_option.js` 中，将 `workexperience` 数组设为空：`const workexperience = [];`

**删除奖项（Awards）：**
- 在 `content_option.js` 中，将 `awards` 数组设为空：`const awards = [];`

**删除服务经历（Services）：**
- 在 `content_option.js` 中，将 `services` 数组设为空：`const services = [];`

---

## 9. 更新和维护

### 日常更新流程

1. **修改内容**
   - 编辑 `src/content_option.js`
   - 替换图片

2. **本地预览**
   ```bash
   npm start
   ```

3. **确认无误后部署**
   ```bash
   npm run deploy
   ```

4. **提交代码到 GitHub**
   ```bash
   git add .
   git commit -m "更新内容"
   git push
   ```

### 添加新功能

如果你想添加新的页面或功能，需要学习一些 React 知识。推荐资源：
- [React 官方文档（中文）](https://zh-hans.react.dev/)
- [React 新手教程](https://react.docschina.org/learn)

---

## 10. 技术栈说明

这个项目使用了以下技术：

- **React 18** - 前端框架
- **React Router** - 页面路由
- **Bootstrap 5** - UI 样式框架
- **React Icons** - 图标库
- **EmailJS** - 邮件服务
- **TypeWriter Effect** - 打字机效果
- **GitHub Pages** - 免费托管

---

## 11. 需要帮助？

如果遇到问题：
1. 仔细阅读本教程和常见问题部分
2. 检查浏览器控制台的错误信息（按 F12 打开）
3. 搜索相关错误信息
4. 在 GitHub Issues 中查找类似问题

---

## 12. 重要文件说明

| 文件路径 | 说明 |
|---------|------|
| `src/content_option.js` | **最重要**：所有个人信息配置 |
| `package.json` | 项目配置，包含 homepage 部署地址 |
| `public/index.html` | HTML 模板，包含网站元信息 |
| `public/icon.jpg` | 网站图标（浏览器标签页显示） |
| `src/assets/research/` | 研究/论文配图文件夹 |
| `src/assets/project/` | 项目配图文件夹 |
| `CNAME` | 自定义域名配置（可选） |

---

## 快速开始检查清单 ✅

- [ ] 安装 Node.js 和 npm
- [ ] 安装 Git
- [ ] 克隆或打开项目
- [ ] 执行 `npm install` 安装依赖
- [ ] 修改 `src/content_option.js` 中的所有个人信息
- [ ] 替换 `public/icon.jpg` 头像
- [ ] 添加你的研究和项目图片到相应文件夹
- [ ] 修改 `package.json` 中的 `homepage` 字段
- [ ] 执行 `npm start` 本地预览
- [ ] 创建 GitHub 仓库
- [ ] 执行 `npm run deploy` 部署
- [ ] 访问你的网站查看效果

---

## 祝贺！🎉

你已经完成了个人网站的搭建！现在你可以向世界展示你的研究成果和项目经验了。

记得定期更新你的网站内容，保持信息的新鲜度。

**Good luck and happy coding! 🚀**
