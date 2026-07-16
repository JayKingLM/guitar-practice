# 谱行

一个本地优先的桌面吉他练习网站，把可编程曲谱、节拍器、音轨播放、播放光标和自动跟谱放在同一个界面中。

## 在线使用

[打开谱行](https://jaykinglm.github.io/guitar-practice/)

## 功能

- 导入 `.alphatex` 或 `.txt` 曲谱代码，保存在浏览器本地曲库中。
- alphaTab 渲染六线谱、和弦名称、完整和弦指法图、数字旋律与中文歌词。
- 空格播放/暂停，支持预备拍、节拍器、BPM 调整和全屏练习。
- 节拍器、数字旋律和吉他伴奏可分别开关并调节音量。
- 播放光标与声音共用时间线，并按设置的同屏行数自动跟谱。
- 点击进度线定位，拖拽选择小节范围进行选段练习。
- 在代码编辑器中实时预览并校正曲谱。

曲谱识别不在网站内进行。推荐先用支持视觉理解的工具把 PDF 转写为 alphaTex，再导入网站；渲染和练习过程可离线完成。

## 本地运行

需要 Node.js 20 或更高版本。

```powershell
npm install
npm run dev
```

默认开发地址为 `http://localhost:5173`。生产构建：

```powershell
npm run build
```

## 技术栈

- React、TypeScript、Vite
- alphaTab / alphaTex
- Dexie / IndexedDB
- Zustand

## 数据说明

导入的曲谱和练习设置保存在当前浏览器的 IndexedDB 中，不会上传到仓库或服务器。清理该站点的浏览器数据会同时清除本地曲库。

## 许可

源代码使用 [MIT License](LICENSE)。导入的曲谱、歌词和其他音乐内容仍由各自权利人所有。
