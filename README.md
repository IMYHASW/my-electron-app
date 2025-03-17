# electron操作sqlite数据库环境配置以及其他步骤

## 环境配置（最好按顺序安装或执行）

**概括：** 项目通过better-sqlite3工具对sqlite数据库进行操作。前期准备包括node、python2、vs build tools集成工具、sqlite模块安装（不用单独安装数据库）、better-sqlite3模块等的配置和安装

#### 1.node、npm安装及相关配置

1. 最好下载一个nvm对node进行管理，便于切换版本
2. 本人使用的node版本为`22.14.0`，对应的npm版本为`10.9.2`。可以直接`nvm install lts`安装最新的长期支持（LTS）版本的 Node.js
3. 设置好nvm、npm镜像。

nvm 镜像设置：找到安装目录（如：D:\nvm）的settings.txt文件，在里面直接添加添加配置。如下

```text
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

npm 镜像设置：cmd执行命令

```bash
npm config set registry https://registry.npmmirror.com
```

验证 npm 镜像

```bash
npm config get registry
```

#### 2.python2安装

系统运行需要python2的distutils库，本人使用的为Python 2.7.18，可供参考。 
可以通过 npm 配置项指定使用的 Python 解释器路径，避免使用错误的 Python 版本。 

```bash
npm config set python /path/to/python
```

执行上面的命令可能会报错：

```text
C:\Users\HUAWEI>npm config set python C:\Python27\python.exe
npm error `python` is not a valid npm option
npm error A complete log of this run can be found in: C:\Users\HUAWEI\AppData\Local\npm-cache\_logs\2025-03-16T11_25_49_126Z-debug-0.log
```

解决办法有两种：

1. 使用 .npmrc 文件指定 Python 路径
在用户主目录（Windows 下一般是 C:\Users\你的用户名 ）或者项目根目录下创建或编辑 .npmrc 文件，添加以下内容：
`python=C:\Python27\python.exe`

2. 通过环境变量指定 Python 路径
   可以设置 npm_config_python 环境变量来指定 Python 解释器的路径。

    将其添加到系统环境变量中。操作步骤如下：  
    a.右键点击 “此电脑”，选择 “属性”。  
    b.点击 “高级系统设置”，在弹出的窗口中选择 “环境变量”。  
    c.在 “系统变量” 区域，点击 “新建”，变量名输入 npm_config_python，变量值输入python安装地址，如 C:\Python27\python.exe，然后点击 “确定” 保存设置。  

#### 3.初始化一个electron项目

参考官网或其他，**后面的模块安装需要在项目根目录下执行**。

electron版本我用的是：35.0.2

#### 4.SQLite相关依赖

无需单独安装SQLite软件‌：sqlite3模块已集成嵌入式数据库。安装sqlite3模块就行。

```bash
npm install sqlite3 --save
```

如果网络超时：`npm error RequestError: connect ETIMEDOUT 198.18.0.7:443`

多设置几个npm源，多下载几次，或者先下载electron：`npm install electron --save-dev`，再下载sqlite3

npm源设置方法：找到npm的配置文件`.npmrc`，修改配置。

1. 执行：`npm config list`，会显示位置以及配置
2. 添加`registry=https://registry.npmmirror.com`、`electron_mirror=https://npmmirror.com/mirrors/electron/`

```text
registry=https://registry.npmmirror.com
python=D:\python 2.7.18\python.exe
electron_mirror=https://npmmirror.com/mirrors/electron/
```

#### 5.Visual Studio构建工具

> 这个可能会安装失败，或许不安装也行，可以先执行后面的6步骤在直接运行，看是否能成功。 
> 如果安装失败，可以执行node安装文件夹下的install_tools.bat文件试一试。 
> 我是执行了bat文件，再执行命令（命令执行失败）。 
> bat文件会自动下载visual studio installer，且安装了“visual studio生成工具2019”，并配置了“使用C++的桌面开发”模块。可能在这一步相关环境已经配好了。

Windows系统需安装 ‌Visual Studio 2022 Build Tools‌（包含C++编译环境）‌

或通过以下命令自动安装：`npm install --global windows-build-tools`。**大概率会安装失败，不安装也行**

#### 6.编译配置与Electron兼容性处理

修复原生模块编译问题

1. 安装electron-rebuild：`npm install electron-rebuild --save-dev`
2. 重新编译原生模块（需在项目根目录执行）：
3. `npx electron-rebuild -v`  v是指定Electron版本号，如`npx electron-rebuild -v 35.0.2`

‌编译失败排查‌
若报错node-gyp缺失：`npm install -g node-gyp`

## 运行与调试

### 启动应用

```bash
npm start
```

### 开发调试

主进程调试：Chrome浏览器访问 chrome://inspect

渲染进程调试：Ctrl+Shift+I 打开DevTools
