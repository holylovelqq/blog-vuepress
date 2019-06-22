# Vue+NuxtJS+TS

本章将会介绍vue项目使用NuxtJS和TS开发的基础环境配置

## NuxtJS和TypeScript介绍

+ 请参阅[Nuxt官网](https://zh.nuxtjs.org/guide)以及Vue官网中对[NuxtJS介绍](https://cn.vuejs.org/v2/guide/ssr.html#Nuxt-js)

+ 请参阅[TypeScript官网](https://www.tslang.cn/)及vue中使用TS的仓库[TypeScript-Vue-Starter](https://github.com/Microsoft/TypeScript-Vue-Starter#typescript-vue-starter)

## 为什么要使用NuxtJS和TS

+ 先说TS，首先nuxtJS本身就是支持TS的，其次vue在3.0开始也将更加友好地支持TS，业界整体看大部分的框架都支持TS或者在向支持TS的方向发展，所以TS将会是一门拿得出手的技术
+ 再说Nuxt.js，如果你看了上面的vue官网对Nuxt.js的介绍，你就会注意到服务端渲染（SSR）这个词，Nuxt.js就是一个实现vue应用服务端渲染的高层框架，理解了什么是SSR，为什么要使用SSR以后，就能明白Nuxt.js的重要性了，必看[Vue SSR指南](https://ssr.vuejs.org/zh/#%E4%BB%80%E4%B9%88%E6%98%AF%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E6%B8%B2%E6%9F%93-ssr-%EF%BC%9F)，链接内的介绍篇是必读
+ 多说一句，如果你上面的内容没看懂，或者觉得难懂的话，可以自己去百度

## NuxtJS和TS用法

介绍里面的链接内都有两者的详细教程文档，首先应该浏览一遍，大致了解都有哪些API和常见的用法，然后在实际开发中遇到相应需求的时候能想到看哪里的文档。这里就不赘述。

## 开发环境搭建

参照Nuxt.js官网有详细的说明如何搭建一个Nuxt.js的vue项目的架构，并支持TypeScript，有兴趣的可以按照步骤实践，官网说明非常详细在此不再过多说明。

以下是记录个人在开发时候使用的环境搭建流程。

::: tip

+ 实际开发中建议使用官网的环境搭建方法，能更简单方便快捷的生成项目。
+ ts的写法建议尽可能使用'''export default Vue.extend({...})''' 。因为该写法更类似于js写法。特殊情况下只能使用'''export default Class componet extend Vue({...})'''，比如多个mixin存在时

:::

### 准备工作

安装vue-cli3。

```sh
npm i -g @vue/cli # or `yarn global add @vue/cli`
```

为了能使用`vue init` 命令，安装以下。

```sh
npm i -g  @vue/cli-init # or `yarn global add @vue/cli-init`
```

### 搭建项目的基本架构

搭建项目雏形。

```sh
$ vue init nuxt-community/typescript-template nuxt-typescript

? Project name nuxt-typescript
? Project description Nuxt.js TypeScript project
? Author holy <holylqq@gmail.com>
```

安装依赖。

```sh
cd nuxt-typescript
npm i # or `yarn`
```

2018/09/25 安装现在最新版本v2.0.0 的Nuxt.js。

```sh
npm i nuxt # or `yarn add nuxt`
```

Nuxt.js v2.0.0 对应 ts-loader 版本低于4 时无法使用，所以更新至最新版本。

```sh
npm i --save-dev ts-loder # or `yarn add -D ts-loader`
```

`modules/typescript.js` 适用以下修正。（修正前的代码对应 Nuxt v1 ，修正后对应V2）  
https://github.com/nuxt-community/typescript-template/pull/47/files

### 启动开发环境

启动开发环境。

```sh
npm run dev # or `yarn dev`
```

然后、打开浏览器 http://localhost:3000 。  
能正常显示ok。

### 生成项目的文件树结构

```sh
$ tree -L 1
.
├── assets/        # 通用文件-img/css
├── components/    # 不会自动生成路由的Vue组件
├── layouts/       # 应用布局文件
├── middleware/    # 中间件
├── modules/       # 自定义依赖模块，存放项目启动时想要执行的依赖（函数）
├── node_modules/
├── pages/         # 页面组件，会自动生成路由配置的页面组件
├── plugins/       # 后期手动添加文件夹，非默认生成。
├── static/        # 静态文件
├── store/         # Vuex相关文件
├── README.md
├── index.d.ts     # TS类型定义文件，参考TS官网配置介绍
├── nuxt.config.js # Nuxt配置文件，head&build等的设置
├── package.json
├── tsconfig.json  # TS设置文件，编译设置等
└── yarn.lock
```

>按照步骤此时生成的文件树内应该不存在`plugins`文件夹，这是后期自己添加的，主要用于向客户端和服务器端注入插件，参考[注入 $root 和 context](https://zh.nuxtjs.org/guide/plugins/#%E6%B3%A8%E5%85%A5-root-%E5%92%8C-context)，本文[仓库](https://github.com/holylovelqq/vue-nuxt-ts-sample)代码中用于全局过滤器的定义，因为在后面介绍全局过滤器的写法时会提到，所以此处也一并介绍。

本文涉及到的有、`components` 和 `pages`以及`plugins`。其他文件夹的详细信息请参考[Nuxt-目录结构](https://zh.nuxtjs.org/guide/directory-structure)

#### pages

Nuxt.js 会根据 `pages` 文件夹内的 `*.vue` 文件、自动生成对应的router。

最初的 `pages` 文件夹内只有 `index.vue` 一个文件、对应router `/`。  
为了实际动手学习，新建文件 `pages/hello.vue` 内容如下。（内容会在后面做说明）

```html
<template>
  <div>
    <h1>Hello World!</h1>
    <p>こんにちは、世界！</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"

@Component
export default class Hello extends Vue {
}
</script>

<style scoped>
</style>
```

保存、在浏览器中打开 http://localhost:3000/hello 。  
确认是否生成了 `/hello` 路由。

这也意味着在nuxt项目中不需要自己定义router相关文件，但是`pages`内文件结构至关重要,
`pages` 文件夹内的自动路由生成规则，参考[Nuxt-路由](https://zh.nuxtjs.org/guide/routing)

#### components

`components` 文件夹虽然也是存放Vue组件文件，但是Nuxt不会对该文件夹下的文件自动生成路由，也不会有其他特别操作。一般来说、`components` 文件夹下存放的是与路由无关的组件。

#### plugins

`plugins`文件夹是后期按需添加的文件夹，用来存放自定义插件或者安装的插件，这些插件一般都是要挂载在Vue实例上或者服务器端实例上，所以这下面的文件会在vue实例化之前运行。参考[Nuxt-插件](https://zh.nuxtjs.org/guide/plugins/)

### 浏览既存的typescript代码

请看刚才新建的 `hello.vue` 中的代码。是用TypeScript 语法写的。

```html
<template>
  <!-- 写法与普通vue写法一样 -->
  <div>
    <h1>Hello World!</h1>
    <p>こんにちは、世界！</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"

// @Component 声明以下class为Vue组件
// 必须继承Vue
@Component
export default class Hello extends Vue {
}
</script>

<style scoped>
/* style 写法也与普通 Vue.js 相同 */
</style>
```

## 学习nuxt-property-decorator typescript的特有写法

:::tip

+ 做成本文时Vue 3.x还未发布，所以vue 3.x 以后的写法**可能**会发生改变
+ 这里首先推荐浏览以下仓库：[TypeScript-Vue-Starter](https://github.com/Microsoft/TypeScript-Vue-Starter#typescript-vue-starter)、[nuxt-property-decorator](https://github.com/nuxt-community/nuxt-property-decorator)、[vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)

:::

为了更方便学习，JavaScript 写法，与 TypeScript 写法比较。

### `data`

`data` 写作class的属性。

template

```html
<template>
  <div>
    <h1>Hello World!</h1>
    <p>{{ message }}</p>
  </div>
</template>
```

JavaScript

```js
export default {
  data: () => ({
    message: 'こんにちは、世界！',
  }),
};
```

TypeScript

```ts
import { Component, Vue } from "nuxt-property-decorator"

@Component
export default class Hello extends Vue {
  private message: string = 'こんにちは、世界！';
}
```

### `methods`

`methods`写作class的方法。

template

```html
<template>
  <div>
    <h1>Hello World!</h1>
    <p>{{ message }}</p>
    <p><button @click="reverseMessage">reverseMessage</button></p>
  </div>
</template>
```

JavaScript

```js
export default {
  data: () => ({
    message: 'こんにちは、世界！',
  }),

  methods: {
    reverseMessage() {
      this.message = this.message.split('').reverse().join('');
    }
  }
};
```

TypeScript

```ts
import { Component, Vue } from "nuxt-property-decorator"

@Component
export default class Hello extends Vue {
  private message: string = 'こんにちは、世界！';

  private reverseMessage() {
    this.message = this.message.split('').reverse().join('');
  }
}
```

### `computed`（计算属性）

`computed` 写做class的 getter, setter 。

template

```html
<template>
  <div>
    <h1>Hello World!</h1>
    <p>{{ message }}</p>
    <p><button @click="reverseMessage">reverseMessage</button></p>

    <h2>mammoth</h2>
    <p>{{ replacedMammoth }}</p>
  </div>
</template>
```

JavaScript

```js
export default {
  data: () => ({
    message: 'こんにちは、世界！',
  }),

  computed: {
    replacedMammoth() {
      return this.message.replace(/ます/, 'マンモス');
    },
  }.

  methods: {
    reverseMessage() {
      this.message = this.message.split('').reverse().join('');
    }
  }
};
```

TypeScript

```ts
import { Component, Vue } from "nuxt-property-decorator"

@Component
export default class Hello extends Vue {
  private message: string = 'こんにちは、世界！ありがとうございます！！';

  private get replacedMammoth() {
    return this.message.includes("こんにちは")
      ? this.message.replace(/こんにちは/, "マンモス")
      : this.message.replace(/はちにんこ/, "スモンマ");
  }

  private reverseMessage() {
    this.message = this.message.split('').reverse().join('');
  }
}
```

### 生命周期函数

生命周期函数的写法、写做「方法名 ＝ 生命周期名」。  
以下例、定义`mounted` 生命周期函数。

JavaScript

```js
export default {
  data: () => ({
    message: 'こんにちは、世界！',
  }),

  computed: {
    replacedMammoth() {
      return this.message.replace(/ます/, 'マンモス');
    },
  }.

  async mounted() {
    const people = await this.$axios.$get('./random-data.json');
    const ramdomPerson = people[Math.floor( Math.random() * people.length )]
    this.message = `こんにちは、${ramdomPerson.first_name} さん。いつもありがとうございます！`;
  }

  methods: {
    reverseMessage() {
      this.message = this.message.split('').reverse().join('');
    }
  }
};
```

TypeScript

```ts
import { Component, Vue } from "nuxt-property-decorator"

@Component
export default class Hello extends Vue {
  private message: string = 'こんにちは、世界！';

  private get replacedMammoth() {
    return this.message.includes("こんにちは")
      ? this.message.replace(/こんにちは/, "マンモス")
      : this.message.replace(/はちにんこ/, "スモンマ");
  }

  private async mounted() {
    const people = await this.$axios.$get('./random-data.json');
    const ramdomPerson = people[Math.floor( Math.random() * people.length )]
    this.message = `こんにちは、${ramdomPerson.first_name} さん。いつもありがとうございます！`;
  }

  private reverseMessage() {
    this.message = this.message.split('').reverse().join('');
  }
}
```

### `components`和过滤器

`components` 在 `@Component` decorator中声明。
※ 组件内过滤器也是在 `@Component` decorator中声明,见代码[仓库](https://github.com/holylovelqq/vue-nuxt-ts-sample)
※ 全局过滤器需要挂载在Vue上，见`plugins/filter.js`，如果是声明在一个单独的文件内的话，需要在使用的地方引入，理论上引入一次，永久生效，所以也可以在类似app.js的组件内引用。代码中是在`layouts/default.vue`中引入。

template

```html
<template>
  <div>
    <h1>Hello World!</h1>
    <p>{{ message |filter }}</p>
    <p>{{ title | format}}</p>

    <p>
      <button @click="reverseMessage">reverseMessage</button>
    </p>

    <h2>mammoth</h2>
    <p>{{ replacedMammoth }}</p>

    <card v-if="person" :person="person" :title="person.first_name"/>
  </div>
</template>
```

JavaScript

```js
import Card from "../components/Card.vue";

export default {
  components: {
    Card,
  },

  filters:{
    format:function(val:string):string {
      return val+'　filtered'
    }
  }，

  data: () => ({
    message: 'こんにちは、世界！',
    person: null,
  }),

  computed: {
    replacedMammoth() {
      return this.message.replace(/ます/, 'マンモス');
    },
  }.

  async mounted() {
    const people = await this.$axios.$get('./random-data.json');
    const ramdomPerson = people[Math.floor( Math.random() * people.length )]
    this.person = ramdomPerson;
    this.message = `こんにちは、${ramdomPerson.first_name} さん。いつもありがとうございます！`;
  }

  methods: {
    reverseMessage() {
      this.message = this.message.split('').reverse().join('');
    }
  }
};
```

TypeScript（内容比js稍多，自己理解吧，参考代码[仓库](https://github.com/holylovelqq/vue-nuxt-ts-sample)）

```ts
import { Component, Vue, Prop, Watch } from "nuxt-property-decorator";
import Card from "../components/Card.vue";
import { Person } from "~/types";
// import '~/plugins/filter.js' //自定义的全局过滤器引入

@Component({
  components: {
    Card
  },
  //filter
  filters:{
    format:function(val:string):string {
      return val+'　filtered'
    }
  }
})
export default class Hello extends Vue {
  // data
  private message: string = "こんにちは、世界！";
  private person: any = null;

  // methods
  private reverseMessage() {
    this.message = this.message
      .split("")
      .reverse()
      .join("");
  }
  // computed
  private get replacedMammoth() {
    return this.message.includes("こんにちは")
      ? this.message.replace(/こんにちは/, "マンモス")
      : this.message.replace(/はちにんこ/, "スモンマ");
  }
  // lifecycle: mounted
  private async mounted() {
    const people = await this.$axios.$get("./random-data.json");
    const randomPerson = people[Math.floor(Math.random() * people.length)];
    this.person = randomPerson;
    this.message = `こんにちは、${
      randomPerson.first_name
    } さん。いつもありがとうございます！`;
  }
  // lifecycle: created
  private created() {
    this.message = "never give up";
  }
  // props
  @Prop({ default: "default propsTitle" }) title!: string;
  // watch
  @Watch("message")
  onMessageChanged(val: string, oldVal: string) {
    alert("Message changed");
  }
  @Watch("person", { immediate: true, deep: true })
  onPersonChanged(val: Person, oldVal: Person) {
    console.log("person is changed to " + (val&&val.first_name));
  }
  
}
```

实际上，`data`, `methods`等全部都可以写在decorator里面，但是非常不推荐,因为this的指向会改变

### `props`, `watch` 等

`props`, `watch` 等其他属性可以使用decorator写法，同component。  
详情参照 [nuxt-property-decorator](https://github.com/nuxt-community/nuxt-property-decorator)

## 总结：看完本文应该学会什么

+ Nuxt.js和TypeScript的介绍
+ Nuxt.js 的开发环境准备（基于 vue-cli ）
+ Nuxt.js 的项目基本结构及说明
+ 在Vue项目中使用TypeScript 的写法

## 其他推荐安装的环境（根据自己需求选择）

+ [prettier](https://prettier.io/)
+ [TSLint](https://palantir.github.io/tslint/)
+ [stylelint](https://stylelint.io/)
+ Unit Test (推荐 [Jest](https://jestjs.io/ja/)，具体写法教学下一篇中会讲到，推荐参考)
+ tsconfig 和 Lint 的设置根据项目需求。