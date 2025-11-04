# GitHub Pages 部署问题排查指南

## 问题分析

如果你的 GitHub Pages 显示 404 错误，可能的原因包括：

1. **GitHub Pages 设置未正确配置**
2. **工作流权限不足**
3. **仓库名称格式问题**
4. **部署分支未正确设置**

## 解决方案

### 步骤 1: 检查 GitHub Pages 设置

1. 进入你的 GitHub 仓库
2. 点击 **Settings**（设置）
3. 在左侧菜单中找到 **Pages**（页面）
4. 在 **Source**（源）部分，选择：
   - **Deploy from a branch**（从分支部署）
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
5. 点击 **Save**（保存）

### 步骤 2: 检查仓库名称

根据你的 URL `https://lyzbcy.github.io/-lyzbcy-Corporate-Website.github.io`：

- **如果是用户/组织页面**：仓库名应该是 `lyzbcy.github.io`，访问地址是 `https://lyzbcy.github.io`
- **如果是项目页面**：仓库名可以是任何名称（如 `Corporate-Website`），访问地址是 `https://lyzbcy.github.io/-lyzbcy-Corporate-Website.github.io`

**注意**：仓库名不应以 `-` 开头。如果当前仓库名包含 `-` 前缀，建议重命名仓库。

### 步骤 3: 配置 _config.yml

根据你的仓库类型，更新 `_config.yml`：

**如果是用户/组织页面**（仓库名：`lyzbcy.github.io`）：
```yaml
url    : "https://lyzbcy.github.io"
baseurl: ""
```

**如果是项目页面**（仓库名：`-lyzbcy-Corporate-Website.github.io`）：
```yaml
url    : "https://lyzbcy.github.io"
baseurl: "/-lyzbcy-Corporate-Website.github.io"
```

**当前配置**（适用于大多数情况）：
```yaml
url    : ""
baseurl: ""
```

### 步骤 4: 推送代码并触发部署

1. 确保你的代码在 `main` 分支上
2. 推送代码到 GitHub：
   ```bash
   git add .
   git commit -m "Fix GitHub Pages deployment"
   git push origin main
   ```
3. 查看 GitHub Actions 日志：
   - 进入仓库的 **Actions**（操作）标签
   - 查看最新的工作流运行状态
   - 如果失败，查看错误日志

### 步骤 5: 等待部署完成

- 首次部署可能需要几分钟
- 部署完成后，访问你的网站地址
- 如果仍然显示 404，等待 5-10 分钟后刷新

## 工作流文件说明

已更新的 `.github/workflows/deploy-site.yml` 包含：

1. **权限设置**：确保工作流可以写入 GitHub Pages
2. **自动部署**：当代码推送到 `main` 分支时自动部署
3. **构建配置**：自动构建 Jekyll 网站并部署到 `gh-pages` 分支

## 常见问题

### Q: 工作流运行成功但网站仍然 404？
A: 
- 检查 GitHub Pages 设置中的源分支是否为 `gh-pages`
- 确认 `gh-pages` 分支存在且包含 `_site` 目录的内容
- 等待几分钟后刷新页面

### Q: 仓库名称包含特殊字符？
A: 
- 避免使用以 `-` 开头的仓库名
- 建议使用简洁的仓库名，如 `Corporate-Website` 或 `corporate-website`

### Q: 如何查看部署日志？
A:
- 进入仓库的 **Actions** 标签
- 点击最新的工作流运行
- 查看各步骤的日志输出

## 验证部署

部署成功后，你应该能够：
1. 访问 `https://lyzbcy.github.io/[仓库名]`（项目页面）
2. 或访问 `https://lyzbcy.github.io`（用户/组织页面）
3. 看到你的网站内容而不是 404 错误

## 需要帮助？

如果问题仍然存在：
1. 检查 GitHub Actions 日志中的错误信息
2. 确认仓库设置中的 Pages 配置
3. 验证 `gh-pages` 分支是否存在且包含网站文件

