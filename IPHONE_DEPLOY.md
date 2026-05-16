# iPhone 云端使用部署说明

推荐用 GitHub Pages 部署，因为这个刷题软件是纯前端网页，上传后 iPhone 可以直接用 Safari 打开。

## 需要上传的文件

把下面这些文件上传到同一个 GitHub 仓库的根目录：

- `index.html`
- `styles.css`
- `app.js`
- `questions.js`
- `prediction_questions.js`
- `translation_questions.js`
- `sentence_translation_questions.js`
- `sentence_translation_extra_questions.js`
- `manifest.webmanifest`
- `sw.js`
- `app-icon.svg`

## GitHub Pages 开启方式

1. 新建一个 GitHub 仓库，例如 `mechanical-trainer`。
2. 上传上面的文件。
3. 进入仓库 `Settings`。
4. 打开 `Pages`。
5. `Build and deployment` 选择 `Deploy from a branch`。
6. `Branch` 选择 `main`，目录选择 `/root`。
7. 保存后等待 1-3 分钟。
8. GitHub 会生成一个网址，通常类似：
   `https://你的用户名.github.io/mechanical-trainer/`

## iPhone 使用方式

1. 用 Safari 打开 GitHub Pages 网址。
2. 点击底部分享按钮。
3. 选择“添加到主屏幕”。
4. 以后从主屏幕图标打开，体验会接近 App。

## 数据说明

学习记录保存在 iPhone Safari 本地，不会自动同步到电脑。

换手机或清理浏览器前，先在软件里的“数据备份”中导出备份文件；恢复时用“导入恢复”导入即可。
