Vue Admin
=========

New design of Data-Driven Vue admin system base on iView-admin.

By @fish-ball &copy;2018

### 安装 Installation

\[TODO\]
#### 创建 vue 基础项目

跟正常的 vue 项目一样

```bash
vue init webpack
```

#### 初始化项目

注意，项目自动初始化脚本需要支持 Bash 运行环境，并且需要安装以下软件包：

```
git
yarn
```

确认之后我们只需要在项目文件夹下面执行这一条命令：

TODO: 还没想好

```bash
curl -s https://raw.githubusercontent.com/EaseCloud/vue-admin/master/src/init.sh | bash -
```

然后我们在项目文件夹上面调用脚本进行安装，这样会有如下几个效果：

1. 用 git 初始化当前项目；
2. 将 Vue-Admin 作为 Git 子模块添加到 `src` 目录下；
3. 将 Vue-Admin 样例代码复制到项目中；

完成之后，直接通过 `npm run dev` 或者 `yarn dev` 等方式就可以像正常的 

```bash
cd src/vue-admin
./init.sh
```

#### 开发环境的域名绑定问题

直接运行项目 `npm run dev` 之后，默认情况下主机名是被绑定在 `localhost` 的，\
这样的话，如果在开发的时候用其他域名绑定访问会得到 `Invalid Host Header` 提示，\
如果需要关掉域名检查，可以在主项目的 `/build/webpack.dev.conf.js` 里面找到 \
`devServer` 块，加入：

```
devServer: {
  // ...
  // 加入下面这项
  disableHostCheck: true,
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

Vue-Admin 提供了一系列的 mixins 方法以完成用户的登录、验证等工作，具体代码定位\
可以参照 `src/vue-admin/mixins/auth.js`

#### login (username, password)

实现用户登录，登录完成之后调用钩子 `action_after_login`，默认情况下转到首页。

具体登录动作实现可以通过钩子 `action_login` 进行覆盖，如未改写进行调用会报警告提示。

#### authenticate (reload = false)

获取当前已登录的用户信息，如果 `reload` 为 `false`，会直接返回 Vuex 中存储的用户信息，\
否则调用后台接口查询当前登录的用户对象，并且更新到 Vuex 状态。

如果获取成功，通过 Promise 返回当前用户对象 user。

如果获取失败，则试图通过后台接口获取登录用户，如果依然获取失败，返回 Promise 将被 reject。

具体的后台接口调用登录可以通过钩子 `action_authenticate` 进行覆盖。

#### requireLogin (reload = false, redirectTo)

直接调用 `authenticate(reload)` 获取当前已登录的用户信息，不同的是如果用户没有登录，\
会调用钩子　`action_goto_login(redirectTo)` 将页面转移到登录页面。

#### logout ()

退出当前的登录，同时退出后台 API 登录以及清空 Vuex 状态。

退出后台登录的操作需要通过 `action_logout` 实现，需要先退出后台登录获得成功 Promise \
之后才会清空 Vuex 状态。

### 全局 mixin

#### 函数

##### finalize (term, ...)

终结计算一个项的值，接受可变参数 arguments 的传入：

1. 如果 term 为函数，调用函数（传入 arguments 的后续变量），然后递归调用 finalize
2. 如果 term 为一个 Promise，直接返回
3. 否则，返回 Promise.resolve(term)

这个方法一般用于属性的求值，有些属性或者配置项的获取，其取值是多态的，也就是说，既支持\
一个固定的配置值或者作为一个求值的函数，这个时候，可以通过 finalize 归一化这类配置或者\
取值，最终得到运算获得的最终结果。

#### 属性


### 配置选项

Vue-Admin 框架提供了为数众多的配置选项供用户使用，在 `src/vue-admin/config/default` \
下面列出了所有的选项和默认值。用户需要定义 `src/config` 模块并且返回一个配置对象，\
项目的配置会覆盖到默认配置当中，并且最终生效。

另外，具体使用时，项目添加了全局 mixin，直接调用任意组件的 `vm.config` 即可获取已经\
计算完成的配置对象。

另外，在 `src/vue-admin/config/hooks` 模块里面定义了所有行为钩子的处理函数，通过 \
`config.hooks` 可以获取所有钩子函数的引用，用户同样可以在自定义的 `src/config` \
模块中覆写任意钩子函数的实现，以实现预期的业务目标。

#### name: 项目名称

当前项目的名称，会显示在适当的地方

**默认值**: `Vue Admin Project`

#### version: 项目版本

当前项目的版本，会显示在适当的地方

**默认值**: `1.0`

#### description: 项目描述

当前项目的简要描述，会显示在适当的地方

**默认值**: `Vue Admin Project`

#### api_root

使用 `vm.api(model, root, format)` 构造 RESTFUL 请求对象时的默认 API 根路径。

具体的 API 模块逻辑可以参考 *REST API Client* 一节

#### api_format

**默认值**: `{/id}{/action}/`

由于具体的方法请求会制定 Path params 去将一定参数混入路径，用此参数配置具体的路径格式。

具体协议可以参照 [RFC 6570 Template specification](http://tools.ietf.org/html/rfc6570)

模板解释使用了 npm 库 <https://github.com/bramstein/url-template>

#### axios_options

HTTP 请求默认使用 axios 库，用这个参数可以设定默认的 axios 选项。

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

#### main_routes

**默认值**: `[]`

主框架下的路由列表，会并入主框架 Main 下面的 children 主路由。

注意应该在此路由的[meta 信息](https://router.vuejs.org/zh-cn/advanced/meta.html)\
内加入 title 字段，此配置会影响打开页面所展开 TAB 的标题。

> TODO: 对于带参数的 title 信息显示需要考虑，例如某个元素的编辑页面

#### extra_routes

**默认值**: `[]`

额外注册的路由列表，会并入基础的路由列表。

#### login_route

**默认值**: `{name: 'passport_login'}`

登录页面组件的路由。

#### home_route

**默认值**: `{name: 'main_home'}`

登录成功之后跳转到的路由，在 `action_after_login` 调用。

#### menus

**默认值**: `[]`

获取主界面左侧菜单栏的菜单定义，菜单格式如下：

```
export default [{
  name: 'main_home',
  icon: 'key',
  title: '主界面',
  noTab: true,
  children: [
    name: 'main_home_dashboard',
    title: '仪表板',
    route: { name: 'main_home_dashboard' }
  ]
}]
```

如上，菜单分两级目录渲染，每个节点包含 `name`, `title` 和 `route` 属性，\
其中 `route` 属性指向一个支持被 `vm.$router.push` 操作的已定义路由对象，\
一级菜单项可以缺省 `route` 属性，这样会忽略点击的跳转。另外一级菜单支持 \
`icon` 属性指定图标一级通过 `children` 指定其下拉的二级菜单。

\[TODO] 国际化：如果菜单项不指定 `title` 而是指定了 `i18n` 属性，那么对应\
的标题渲染会依据这个属性计算国际化翻译得到。

另外可以设置 noTab，设置后菜单打开将不会出现标签栏中添加标签页。

### 钩子机制

一般我们定义三种钩子：动作钩子，过滤器钩子，以及函数钩子：

> 正常情况下的钩子调用，我们会通过 `vm.config.hooks.xxx.apply(vm, [...params])` \
的方式调用，于是，在钩子处理函数内部调用的 `this` 就可以获取到调起的组件实例，\
而无需将组件实例手动传入。

* 动作钩子：以 `action_` 为前缀，在指定阶段执行一定的动作，通过 return 参数或者\
  Promise 返回动作的结果。
* 过滤器钩子：以 `filter_` 为前缀，在第一个参数传入需要过滤的对象（后续参数可以）\
  作为附加设置项，然后将对象进行处理之后通过 return 同步返回，处理流程用这个返回\
  的对象继续原有的处理流程
* 函数钩子：能够支持同步返回计算结果值（而不是 Promise）的方法
  
#### action_root_mounted ()

根组件挂在之后执行的任务，一般用于执行某些初始化任务。

如果缺省，会将 localStorage 中保存的 `current_user` 用户载入 Vuex 的 state，这样 \
能够在离线环境下依然能够获取用户的登录状态。

#### action_get_menus ()

通过 Promise 返回展示的主界面侧栏菜单，获取之后替换 `config.menus` 配置，缺省情况下\
返回 `src/config/menus` 模块的内容，实际使用中，可以根据当前登录用户查询后台获取到\
实际的菜单格式再返回。

#### filter_before_menu_select (menuName)

用户点击主菜单项之后，会自动执行跳转，通过此过滤器可以拦截跳转动作。

输入值 `menuName` 为选中的菜单项名称。

返回一个 Promise，如果 reject，菜单跳转动作会被取消。

如果 resolve 一个字符串，则跳转行为会替换原有的 menuName。

默认情况下透明通过。

#### action_login (username, password)

实现一个函数，通过 Promise 返回一个 user 对象，表示已登录的用户信息。

一般实现是调用后台登录接口，并且返回用户信息。

Vue-Admin 在获取到用户信息之后，会将用户信息存放在 Vuex 的 \
`$store.user.current_user` 中，并且通过全局 mixin 的 `vm.me` \
可以获取到。

#### action_authenticate ()

调用后台接口查询当前登录的用户对象。

如果获取成功，通过 Promise 返回当前用户对象 user。

如果获取失败，返回的 Promise 将被 reject。

这个接口在 `src/vue-admin/mixins/auth` 模块中被调用，一般来说获取到后台登录用户之后，\
会自动将用户信息保存进 Vuex 状态。

#### action_logout ()

实现后台退出的动作并返回 Promise。

#### func_get_current_user_name ()

同步获取当前已登录用户的显示用户名，以便 UI 框架渲染当前已登录状态栏。

#### func_get_current_user_avatar_url ()

同步获取当前已登录用户的头像URL，以便 UI 框架渲染当前已登录状态栏。

#### filter_data_before_api_request (data)

实现 api 模块提交数据之前，转换 payload 格式

如果需要将提交格式转换成 FormData/json/x-urlencoded 的操作可以改写这个钩子

通过 this 可以获取到调用的 vm 组件
