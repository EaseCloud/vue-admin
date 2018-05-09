Vue Admin
=========

New design of Data-Driven Vue admin system base on iView-admin.

By @fish-ball &copy;2018

### 安装 Installation

\[TODO\]
##### 创建 vue 基础项目

跟正常的 vue 项目一样

```bash
vue init webpack
```

##### 替换 iview-admin 中的 `@` 路径

由于 iview-admin 项目中的引用 webpack 模块有很多地方使用了 `@` 的绝对路径，\
在引入 vue-admin 的时候，为了能够完整引用 iview-admin 而不是混入代码，我们\
必须让出项目中的根目录位置，这样才能实现代码的分层和正交。

> 其实个人觉得这是 iview-admin 设计上的欠考虑，但估计是没有考虑到会有这种玩法吧。

因此，**我们在业务代码中禁止使用 @ 作为路径前缀**，此外，需要\
修改 `webpack.base.conf.js` 文件代码：

```javascript
module.exports = {
  // ...
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      // 修改下面这行
      '@': resolve('src'),
    }
  },
  // ...
}
```

改为：

```javascript
module.exports = {
  // ...
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      // 改为这一行
      '@': resolve('src/vue-admin/iview-admin/src'),
    }
  },
  // ...
}
```

##### 初始化

这一步，我们需要将 iview-admin 的依赖库全部展开安装到我们的主项目中，并且\
执行 iview-admin 的 `npm run init` 初始化脚本。

> iview-admin 初始化完成之后，iview-admin 文件夹的 build 文件夹中会出现一个 `env.js` 文件。\
如果提示缺少 env 文件很可能是少了这一步。

这里的操作已经用 bash 脚本写好，只需要执行一次脚本即可：

```bash
cd src/vue-admin
./init.sh
```

##### 问题处置：`$export is not a function`

参考：<https://stackoverflow.com/a/36404784/2544762>

打开 `webpack.base.conf.js`，在 `下面加上

```javascript
{
  // ...
  loader: 'babel-loader',
  // 添加下面这一行
  exclude: /node_modules/
  // ...
}
```

### 配置 Configuration

\[TODO\]

### 设定路由

\[TODO\]

### REST API Client

\[TODO\]

### ListViewTable

\[TODO\]

### ListViewTable

\[TODO\]

### EmbedForm

\[TODO\]

### EditView

\[TODO\]

### 页面组件机制

### 用户登录验证机制

### 配置选项

Vue-Admin 框架提供了为数众多的配置选项供用户使用，在 `src/vue-admin/config/default` \
下面列出了所有的选项和默认值。用户需要定义 `src/config` 模块并且返回一个配置对象，\
项目的配置会覆盖到默认配置当中，并且最终生效。

另外，具体使用时，项目添加了全局 mixin，直接调用任意组件的 `vm.config` 即可获取已经\
计算完成的配置对象。

另外，在 `src/vue-admin/config/hooks` 模块里面定义了所有行为钩子的处理函数，约定以 \
`hook_` 作为前缀混入整个 `config` 配置中，用户同样可以在自定义的 `src/config` 模块中覆写\
任意钩子函数的实现，以实现预期的业务目标。

#### name: 项目名称

当前项目的名称，会显示在适当的地方

**默认值**: `Vue Admin Project`

#### version: 项目版本

当前项目的版本，会显示在适当的地方

**默认值**: `1.0`

#### description: 项目描述

当前项目的简要描述，会显示在适当的地方

**默认值**: `Vue Admin Project`

#### router_options

**默认值**: `{}`

启动整个 VueRouter 时的配置选项，参考 <https://router.vuejs.org/zh-cn/api/options.html>。

例如：

```
router_options: {
  routes: [...], // 不建议在这里注入 routes 配置，因为后面有专门管理的地方
  mode: 'hash', // hash | history | abstract
  base: '/manage/',
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  fallback: true
}
```

#### extra_routes

**默认值**: `[]`

额外注册的路由列表，会并入基础的路由列表。

#### login_route

**默认值**: `login`

登录页面组件的路由名称。

### 钩子机制

#### hook_login (username, password)

实现一个函数，通过 Promise 返回一个 user 对象，表示已登录的用户信息。

一般实现是调用后台登录接口，并且返回用户信息。

Vue-Admin 在获取到用户信息之后，会将用户信息存放在 Vuex 的 \
`$store.user.current_user` 中，并且通过全局 mixin 的 `vm.me` \
可以获取到。

#### hook_authenticate (reload = True)


