# Web Img Collector 2

## 推荐的 IDE 设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (并禁用 Vetur).

## 类型支持 TS 中的“.vue”导入

默认情况下，TypeScript 无法处理`.vue`导入的类型信息，因此我们将 `tsc` CLI 替换为`vue-tsc`来进行类型检查。在编辑器中，我们需要 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 来让 TypeScript 语言服务识别 `.vue` 类型。

## 定制配置

详情见 [Vite 配置参考](https://vitejs.dev/config/).

## 安装依赖

```sh
yarn
```

### 编译和热重载以进行开发

```sh
yarn dev
```

### 为生产环境进行类型检查、编译和缩小

```sh
yarn build
```

### 使用 [ESLint]（https://eslint.org/）

```sh
yarn lint
```
