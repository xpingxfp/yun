# 云思 (yun)
## 分析软件

### 版本: 0.5.3（测试阶段）

- **类重命名**: `Node` 类已被重命名为 `Yun`（云），以避免冲突。
- **PWA支持**: 支持离线使用。设置保存位置后，即可将应用保存到本地，并在无网络连接时运行。
    > 优先加载本地资源。
    
### 运行环境

- 进入下列网站：
    - <https://xpingxfp.github.io/yun.github.io/>
<br>

- 使用Node.js运行服务器脚本:
    - 路径: `server/nodejs/http.js`
    - 端口: 2424

### 功能扩展建议

- 核心功能开发: 在`app/main/`文件夹中添加。
- 拓展功能开发: 利用`app/path/`文件夹。
- 自定义Yun类拓展: 在`app/path/yuns/`文件夹中创建。

> 提示：你可以使用`tool/versionFileGeneration.py`来构建`app/version.json`文件。

> 注意：更多详细指南参见`documents`文件夹中的文档（正在编辑）。

### 更新计划

接下来的工作重点是实现保存。

### 更新内容

- 增加`app/demo`文件夹，可以根据内容学习如何拓展开发。
- 完善传递事件系统。
- 添加撤销和重做功能。

### 开发进度

由于个人原因，尤其是毕业论文的压力，项目的进展受到了影响。感谢大家的理解和支持。