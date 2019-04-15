# VUE-UnitTest

+ 本文将大致介绍vue单元测试的写法，详细请参考github代码[仓库](https://github.com/holylovelqq/vue-unit-test-with-jest)
+ 单元测试写法参考[Vue Test Utils](https://vue-test-utils.vuejs.org/zh/),这是vue官方的单元测试实用工具库
+ 使用的是[jest](https://jestjs.io/docs/zh-Hans/getting-started),Facebook 开发的测试运行器
+ 本文的想定读者：使用vue作为项目的开发框架，对vue有一定的理解，要写单元测试
+ 开发环境，需要特别指出
  + Vue-Cli：v3.3.0
  + "vue": "^2.6.6"

其他，请参见package.json文件

+ 特别说明
  + **免责声明**
  本文所述内容是否适用于您的项目，判断权在您，使用与否的决定权也在您自己，故因使用本文中知识所造成的一切损失，均由使用者自己负责，笔者概不负责
  + **版权声明**
  未经笔者同意不得用于商业用途，违者必究。个人引用请标明出处

## 为什么要写单元测试

组件的单元测试有很多好处：

1. 提供描述组件行为的文档
2. 节省手动测试的时间
3. 减少研发新特性时产生的 bug
4. 改进设计
5. 促进重构

自动化测试使得大团队中的开发者可以维护复杂的基础代码。

以上是官方说法，就个人而言，除了以上的好处以外，单元测试还能够

+ 规范代码
+ 个人成就感，100%测试覆盖率（装b利器）
+ 全周期工程师必备技能（设计-编程-测试-release-部署-维护）
+ 如果项目是个人项目，个人测试是不可或缺的（你难道不想有一个自己的项目么）

## 本文提到的单元测试

### Template标签内

本标签内主要是DOM结构，可以使用jest的snapshot功能进行测试，也可进行精确测试，即断言某DOM元素存在与否

+ v-on（依赖函数存在于script标签内）
+ v-bind（依赖变量存在于script标签内）
+ slot（vue2.6.0以上版本更新了此语法，本文完成时并未影响到测试）
+ v-if/v-show（依赖变量存在于script标签内）
+ filter（依赖函数存在于script标签内）

测试要配合script标签的内容进行

### Script标签

本标签内主要是逻辑实现，可能出现的内容有

+ Props（⭐必须进行测试）
+ Data（一般配合v-bind/v-if/v-show等一起测试）
+ Filters（⭐必须进行测试）
+ Methods（⭐必须进行测试）
+ $emit（⭐必须进行测试）
+ eventHub（空vue实例，用于分发事件，在使用的组件内进行测试）
+ watch（⭐必须进行测试）
+ computed（⭐必须进行测试）
+ router（⭐必须进行测试）
+ axios（⭐必须进行测试）
+ vuex（⭐必须进行测试）

其他插件：element-ui/momentJS等插件本身不需要我们进行测试，开发者已经测试过，但是被测试组件如果使用了此插件的话，需要我们挂载在临时vue上，避免测试时报错

## 常用的断言语句

+ toBe()----测试具体的值
+ toEqual()----测试对象类型的值
+ toBeCalled()----测试函数被调用
+ toHaveBeenCalledTimes()----测试函数被调用的次数
+ toHaveBeenCalledWith()----测试函数被调用时的参数
+ toBeNull()----结果是null
+ toBeUndefined()----结果是undefined
+ toBeDefined()----结果是defined
+ toBeTruthy()----结果是true
+ toBeFalsy()----结果是false
+ toContain()----数组匹配，检查是否包含
+ toMatch()----匹配字符型规则，支持正则
+ toBeCloseTo()----浮点数
+ toThrow()----支持字符串，浮点数，变量
+ toMatchSnapshot()----jest特有的快照测试
+ .not.+matcher，eg. .not.toBe()----前面加上.not就是否定形式，

以上只是一部分matcher，更多请查看[jest官方文档](https://jestjs.io/docs/zh-Hans/expect#expectextendmatchers)

## 项目结构

一目了然的文件树结构，能给人一种逻辑清晰的第一印象，体现了开发者的基本素养

下面是作者的文件分类方式

### 组件分类

组件分类不仅有利于测试，更重要的是性能优化，组件尽可能分类细化有利于快速更新视图、渲染页面、提高用户体验

前端组件分类一般分为两类

+ Presentation Component
+ Container Component

#### Presentation Component

这类组件的主要功能是DOM展示，数据一般是通过props获取数据，然后展示出来

基本特征：

+ 不依赖其他组件，与store和router无关联
+ 不进行CRUD操作（如果必要可使用$emit在夫组件内操作）
+ 尽量不使用生命周期函数
+ 尽量具有可复用性

#### Container Component

这类组件的主要功能是数据操作（API联调）

基本特征：

+ 子组件的状态改变（props、$emit）
+ CRUD操作、store内数据操作、router切换

### 文件树构成

基于组件分类方式，把不同的组件放在不同的文件夹内

```text
-src
  -assets------CSS，JS，image，icon
  -basics------基础组件（不含其他组件，便于复用）
  -components--大型组件（含其他组件，会被复用）
  -containers--容器组件（包含其他组件，不会被复用，数据处理，通常用于复杂页面分担views压力）
  -views--------页面组件（路由切换使用，展示页面用，数据处理）
    -App.vue
  -main.js
...其他
```

下面相应讲解一下每个文件夹内对应的组件类别

+ Bsics文件夹内存放的一般是最小的组件单元和可复用的组件，比如：按钮组件AppButton.vue、输入框组件AppInput.vue 等等，属于presentation component
+ Components文件夹内存放的是集合了basics或者components组件的父组件，属于presentation component
+ Containers文件夹内存放的是比自身组件小的组件basics或者components组件的父组件，主要是给子组件传递props等数据，属于containers component
+ views文件夹内存放的是页面组件，内涵页面内所有子组件，主要是操作数据和路由切换，属于containers component

※ ***实际请根据项目的需求构建自己的文件树***

## 单元测试的写法

以下会列举一些单元测试的写法，源码来自于github[仓库](https://github.com/holylovelqq/vue-unit-test-with-jest)，.vue文件并未展示，如遇不理解之处请参考源码

### Snapshot测试

目前来说是jest专有的测试方法，测试整体的html有没有更改，每一个文件都应该进行该测试。

※ 更改html后，该测试会失败，删除保存在__snapshots__文件夹内对应的.snap文件后，重新测试（或者根据实际情况在测试命令后加 -u）

```js
// 测试内容：snapshot->概括的测试DOM结构
it('matches snapshot', () => {
  const wrapper = shallowMount(AppButton)
  expect(wrapper.html()).toMatchSnapshot()
  wrapper.destroy()
})

```

### 精确DOM结构测试

断言指定节点对象是否存在，视项目情况而定需不需要进行此测试

```js
// 测试内容：精准DOM结构测试示例
it('DOM test', () => {
  const wrapper = shallowMount(AppButton)
  expect(wrapper.contains('button')).toBeTruthy()
  wrapper.destroy()
})

```

### v-on

+ 以click事件为例
+ 测试思路：点击，断言对应函数是否被触发，触发几次，参数是否为预期参数（如果有参数）
+ 注意被断言的函数必须为mock函数，不然会报错

```js
/** 测试内容：func测试
  *点击按钮组件时，正确触发点击事件
*/
it('click button onClick is clled', () => {
  const wrapper = shallowMount(AppButton)
  // 创建mock函数
  const mockFn = jest.fn()
  // 设置 Wrapper vm 的方法并强制更新。
  wrapper.setMethods({
  onClick:mockFn
      })
  // 获取buttonDOM元素
  const button = wrapper.find('button')
  // 测试点击按钮后有没有正确触发函数
  button.trigger('click')
  // 断言函数被触发，且被触发一次
  expect(mockFn).toBeCalled()
  expect(mockFn).toHaveBeenCalledTimes(1)

  wrapper.destroy()
})

```

### v-bind(Data)

大多数情况下都可以不写此测试

```js
/**
 * 测试内容：data v-bind
 * 断言data中变量的值
*/
it('data test', () => {
  // 断言默认值
  expect(wrapper.vm.name).toBe('admin')
  expect(wrapper.vm.collapse).toBeTruthy()
  // 更改后
  wrapper.vm.name = 'holy'
  expect(wrapper.find('.el-dropdown-link').text()).toBe('holy')
})

```

### slot

+ vue2.6.0以上版本更新了此语法，本文完成时并未影响到测试

+ slots分为普通插槽、具名插槽和作用域插槽，以下分别示例

```js
/**
 * 测试内容：slots 普通插槽
 * 测试默认值（当slot有默认值时）
*/
it('slots default value test', () => {
  const wrapper = shallowMount(AppButton)
  const button = wrapper.find('button')
  expect(button.text()).toBe('submit')
  wrapper.destroy()
})

/** 测试内容：slots 普通插槽
 * mount时传入自定义的内容作为slots，然后再断言自定义的内容存在与否
 * 自定义的内容可能会是text，html，componets等允许的内容
*/
it('slots test', () => {
  const wrapper = shallowMount(AppButton, {
    slots: {
    default:'i am slots text'// 自定义slots内容
      }
  })
  const button = wrapper.find('button')
  expect(button.text()).toBe('i am slots text')

  wrapper.destroy()
  })

/** 测试内容：slots具名插槽
 * vue2.6更新后的新语法v-slots，3.0中会延续使用，并废除旧语法
 * 测试方法与slots普通插槽相同，此处传入为html,
 * 当传入组件时，只需断言wrapper中是否包含组件的DOM元素即可
 * expect(wrapper.contains('.container')).toBe(true)
*/
it('named slots test', () => {
const wrapper = shallowMount(AppButton, {
slots: {
namedSlot:`<span>i am slots html</span>`// 自定义slots内容
      }
    })
const button = wrapper.find('button')
expect(button.contains('span')).toBe(true)
const span = wrapper.find('button span')
expect(span.text()).toBe('i am slots html')

wrapper.destroy()
  })

/** 测试内容：slots作用域插槽
 * vue2.6更新后的新语法v-slots，3.0中会延续使用，并废除旧语法
 * 测试方法与slots具名插槽相同，此处传入为html,
 * 当传入组件时，只需断言wrapper中是否包含组件的DOM元素即可
 * expect(wrapper.contains('.container')).toBe(true)
*/
it('scoped slots test', () => {
const wrapper = shallowMount(AppButton, {
scopedSlots: {
scopedSlot:`<span slot-scope="foo">{{ foo.user.lastName }}</span>`// 自定义slots内容
      }
    })
const button = wrapper.find('button')
expect(button.contains('span')).toBe(true)
constspan = wrapper.find('button span')
expect(span.text()).toBe('holy')

wrapper.destroy()
  })


```

### v-if/v-show

```js
/**
 * 测试内容：v-show/v-if测试，与v-bind的测试思路基本相同
 * 设置变量的值，断言对应的DOM结构显示与否
*/
it('v-show test', () => {
  // true时显示的div
  const truediv = wrapper.find('.text.format')
  // false时显示的div
  const falsediv = wrapper.find('.text.noformat')
  // toggleShow默认值为true
  expect(truediv.isVisible()).toBe(true)
  expect(falsediv.isVisible()).toBe(false)
  // 设置为false
  wrapper.vm.toggleShow = false
  expect(truediv.isVisible()).toBe(false)
  expect(falsediv.isVisible()).toBe(true)
})

```

### filter过滤器

+ 过滤器的测试与其他略有不同，参见下方代码

```js
import { shallowMount, createLocalVue } from '@vue/test-utils'
import FilterTest from '@/components/FilterTest.vue'
...
...
...
/** 测试内容：filter过滤器
 * filter不能通过wrapper或者vm获取，只能通过组件获取
 * filter需要测试函数的所有可能性
*/
it('filter test', () => {
  // console.log(FilterTest.filters)
  expect(FilterTest.filters.formatText('12345678')).toBe('12...78')
  expect(FilterTest.filters.formatText('12345')).toBe('12345')
  expect(FilterTest.filters.formatText()).toBe('')
  })

```

### props

+ 复杂组件的props也会较复杂，但只要思路清晰，套路都是一样的

```js
/** 测试内容：props
 * 自定义props传递给AppButton组件，判断组件有获取到props
 * 请注意props是否存在默认值
*/
it('props test', () => {
  const buttonProps = {
    type:'danger',
    size:'lg',
    disabled:true
  }
  const wrapper = shallowMount(AppButton, {
    propsData:buttonProps
  })
  // 断言已经获取到props
  expect(wrapper.props().size).toBe('lg')
  expect(wrapper.props().type).toBe('danger')
  expect(wrapper.props().disabled).toBe(true)
  // 每个it最后都应该销毁wrapper
  wrapper.destroy()
})

```

### Methods（func函数测试）

+ 主动触发函数，断言执行结果是否符合预期

```js
/** 测试内容：changeShow()函数
 * changeShow()函数被调用时，能正确执行
*/
it('called changeShow()', () => {
  // 手动将变量的值设置为false,默认值是true
  wrapper.vm.toggleShow = false
  // 执行函数
  wrapper.vm.changeShow()
  // 期望结果
  expect(wrapper.vm.toggleShow).toBe(true)
  // 再次执行函数
  wrapper.vm.changeShow()
  // 期望结果
  expect(wrapper.vm.toggleShow).toBe(false)
})

```

### $emit

+ 子组件内触发父组件内的函数，组件结构越复杂，使用的越多
+ 区别于eventHub，此$emit非彼$emit

```js
/** 测试内容：$emit
 * 包含$emit的函数被触发后，emit的函数也会被触发
*/
it('when onClick is called $emit is called', () => {
  const wrapper = shallowMount(AppButton)
  // 测试$emmit函数被正确触发
  // mock函数替代点击按钮后$emit的函数，此处函数名相同，依然为click
  const mockFn1 = jest.fn()
  wrapper.vm.$on('click', mockFn1)
  // 测试mock函数是否被触发，触发的次数,以及参数
  wrapper.vm.onClick()
  expect(mockFn1).toBeCalled()
  expect(mockFn1).toHaveBeenCalledTimes(1)
  expect(mockFn1).toHaveBeenCalledWith('i am params')
  // 第二次点击button，依然测试mock函数是否被触发，触发的次数
  wrapper.vm.onClick()
  expect(mockFn1).toBeCalled()
  expect(mockFn1).toHaveBeenCalledTimes(2)
  expect(mockFn1).toHaveBeenCalledWith('i am params')

  wrapper.destroy()
})

```

### watch

+ 下例内，侦听器内仅执行了console.log()

```js
/** 测试内容：watch
 * 更改watch的data的值，断言操作是否与预期相同
*/
it('watch test', () => {
  // mock掉console.log
  const spy = jest.spyOn(console,'log')
  // 手动将变量的值设置为false,默认值是true
  wrapper.vm.toggleShow = '自定义'
  // 断言函数是否执行
  expect(spy).toBeCalled()
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('自定义')
  // 清除掉mock
  spy.mockClear()
})

```

### computed

⭐要注意计算属性不是函数，是变量，测试时很容易看着组件内写法按照函数测试

```js
/** 测试内容：computed
 * 要注意计算属性不是函数，是变量，测试时很容易看着组件内写法按照函数测试
 * 改变props的type，size，disable值时，cssClasses的值也会跟着改变
*/
it('computed test', () => {
  const wrapper = shallowMount(AppButton)
  // 设置props 断言computed计算属性（注意props有default值）
  wrapper.setProps({ type:'danger' })
  expect(wrapper.vm.cssClasses).toBe('app-button app-button--md app-button--danger')
  wrapper.setProps({ size:'lg' })
  expect(wrapper.vm.cssClasses).toBe('app-button app-button--lg app-button--danger')
  wrapper.setProps({ disabled:true })
  expect(wrapper.vm.cssClasses).toBe('app-button app-button--lg app-button--disabled')

  wrapper.destroy()
})

```

### router

+ 本文建议使用mock的$route和$router

```js
import { shallowMount } from '@vue/test-utils'
import RouterTest from '@/components/RouterTest.vue'

/** vue-router测试
 * 不建议直接在localVue上挂载vue-router
 * 使用mock的$route和$router更加灵活，方便测试
*/
const $route = {
  path:'/some'
  // ...其他属性
}
const mockPush = jest.fn()
const $router = {
  push:mockPush
  // ... 其他属性
}

describe('RouterTest.vue', () => {
  // wrapper.vm是组件实例，包含该实例的所有方法和属性
  letwrapper
  beforeEach(() => {
  wrapper = shallowMount(RouterTest, {
  stubs: ['app-button'],
  mocks: {
  $route,
  $router
        }
      })
    })

  afterEach(() => {
  wrapper.destroy()
  })

  // 测试内容：goVIPs()被调用->触发mock的push函数
  it('goVIPs() is called', () => {
    // 执行函数
    wrapper.vm.goVIPs()
    // 期望结果
    expect(mockPush).toBeCalled()
  })
})

```

### axios

1. mock掉整个axios，返回值可以在此时定义也可以在使用时定义
2. .vue文件内使用axios函数内需要配合添加return，便于测试
3. reject的情况也需要测试

```js
/**
 * AxiosTest.vue组件
 * 测试内容包括以下
 * 自定义func
 * axios
 */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import AxiosTest from '@/components/AxiosTest.vue'
import axios from 'axios'

// mock掉整个axios模块
// 返回值在使用的时候自定义
jest.mock('axios')

// 创建临时Vue实例，挂载组件中使用的插件
const localVue = createLocalVue()
localVue.prototype.$axios = axios// 挂载axios

describe('AxiosTest.vue', () => {
  let wrapper
  beforeEach(() => {
  axios.mockClear()
  wrapper = shallowMount(AxiosTest, { localVue,
  stubs: ['app-button']
      })
    })

  afterEach(() => {
  wrapper.destroy()
  })

  // 测试内容：func ->getData()
  // 点击按钮函数被触发(注意此处的click事件是子组件(按钮组件$emit)的事件,
  // 在父组件内不属于DOM原生事件,所以触发方式不能使用trigger,而应该使用$emit)
  it('when button is clicked getData will be called', () => {
    // 创建mock函数
    const mockFn = jest.fn()
    // 设置 Wrapper vm 的方法并强制更新。
    wrapper.setMethods({ getData:mockFn })
    // 获取对应按钮
    const axiosButton = wrapper.find('.axios app-button-stub')
    // 点击按钮->注意触发方式不能使用trigger
    axiosButton.vm.$emit('click')
    // 断言函数被触发且只触发一次
    expect(mockFn).toBeCalled()
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  // 测试内容：axios->getData()函数
  // 为了配合axios测试,需要在组件代码的两处增加return,参见AxiosTest组件
  it('axios test', () => {
    // 此处只是使用了get,post/patch/delete/...与get相同
    // 自定义get的返回值
    const mockData = { data: { name:'Bob' } }
    axios.get.mockResolvedValue(mockData)
    return wrapper.vm.getData().then(result=> {
      expect(result).toEqual(mockData)
      expect(wrapper.vm.usersInfo).toEqual(mockData.data)
    })
  })

  // 测试内容：axios->getData()函数请求rejeced的情况
  it('axios test', () => {
    // 自定义get被拒绝时返回值
    axios.get.mockRejectedValue('error')
    return wrapper.vm.getData().catch(e=>expect(e).toMatch('error'))
  })
})

```

### vuex

+ 伪造vuex内的所有
+ 测试伪造的函数能否被正确触发

```js
/**
 * VuexTest.vue组件
 * 测试内容包括以下
* 临时vue实例上挂载element-ui
 * func
 * vuex store内的state mutations actions getters
 */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VuexTest from '@/components/VuexTest.vue'
import Vuex from 'vuex'

// 创建临时Vue实例，挂载组件中使用的插件
const localVue = createLocalVue()
localVue.use(Vuex)

describe('VuexTest.vue', () => {
  // wrapper.vm是组件实例，包含该实例的所有方法和属性
  let wrapper
  let actions
  let state
  let getters
  let mutations
  let store
  beforeEach(() => {
    // 伪造actions state getters mutations
    actions = {
      increment:jest.fn(),
      decrement:jest.fn()
    }
    mutations = {
      increment:jest.fn(),
      decrement:jest.fn()
    }
    state = {
      count:0
    }
    getters = {
      evenOrOdd: () =>'gettersVal'// 伪造的越简单越好
    }
    // 伪造store
    store = newVuex.Store({
      state,
      actions,
      mutations,
      getters
    })
    // 挂载store
    wrapper = shallowMount(VuexTest, {
      localVue,
      store,
      stubs: ['app-button']
    })
  })

  afterEach(() => {
    wrapper.destroy()
    })

  // 测试内容：state
  // 只需测试伪造的state值是否存在于dom中
  it('getters test', () => {
    const text = wrapper.find('.text')
    expect(text.text()).toContain(state.count)
  })

  // 测试内容：actions-通过点击按钮直接调用
  // 点击按钮测试伪造的函数是否被调用
  it('actions test', () => {
    const buttonAdd = wrapper.find('.add')
    const buttonMinus = wrapper.find('.minus')
    buttonAdd.vm.$emit('click')
    expect(actions.increment).toHaveBeenCalled()
    expect(actions.increment).toHaveBeenCalledTimes(1)
    buttonMinus.vm.$emit('click')
    expect(actions.decrement).toHaveBeenCalled()
    expect(actions.decrement).toHaveBeenCalledTimes(1)
  })

  // 测试内容：dispatchIncrement()
  // 点击按钮测试函数dispatchIncrement()是否被调用
  it('dispatchIncrement test', () => {
    const dispatchAdd = wrapper.find('.dispatchAdd')
    const mockAdd = jest.fn()
    wrapper.setMethods({
      dispatchIncrement:mockAdd
    })
    dispatchAdd.vm.$emit('click')
    expect(mockAdd).toHaveBeenCalled()
    expect(mockAdd).toHaveBeenCalledTimes(1)
  })

  // 测试内容：actions--通过dispatch调用
  // 调用函数测试伪造的函数是否被调用
  it('dispatch actions test', () => {
    wrapper.vm.dispatchIncrement()
    expect(actions.increment).toHaveBeenCalled()
    expect(actions.increment).toHaveBeenCalledTimes(1)
  })

  // 测试内容：mutationsDecrement()
  // 点击按钮测试函数mutationsDecrement()是否被调用
  it('mutationsDecrement test', () => {
    const mutationsMinus = wrapper.find('.mutationsMinus')
    const mockMinus = jest.fn()
    wrapper.setMethods({
      mutationsDecrement:mockMinus
    })
    mutationsMinus.vm.$emit('click')
    expect(mockMinus).toHaveBeenCalled()
    expect(mockMinus).toHaveBeenCalledTimes(1)
  })

  // 测试内容：mutations
  // 调用函数测试伪造的函数是否被调用
  it('mutations test', () => {
    wrapper.vm.mutationsDecrement()
    expect(mutations.decrement).toHaveBeenCalled()
    expect(mutations.decrement).toHaveBeenCalledTimes(1)
  })

  // 测试内容：getters
  // 只需测试伪造的getters值是否存在于dom中
  it('getters test', () => {
    const text = wrapper.find('.text')
    expect(text.text()).toContain(getters.evenOrOdd())
  })
})

```

### store.js

+ 测试vuex内的各个函数
+ 当测试其中任一函数时，其他依赖全部使用mock函数
+ 该测试方法为官方推荐方法之一，官方推荐了两种测试方法，各有优劣，详情参阅[官方说明](https://vue-test-utils.vuejs.org/zh/guides/#%E5%9C%A8%E7%BB%84%E4%BB%B6%E4%B8%AD%E6%B5%8B%E8%AF%95-vuex)

```js
/**
 * store.js
 * 测试内容包括以下
 * 测试思路：mutations/getters/actions 分别测试，测试其中一个的时候，其他依赖伪造mock
* 本质还是测试方法（官网列出了两种测试方法，我们选择简单易懂便于测试的）
*/
import { mutations, getters, actions } from '@/store.js'

describe('store.js', () => {
  // 测试内容：mutations
  // 伪造（mock）state 测试mutations下的方法
  it('mutations test', () => {
    const state = {
      count:0
    }
    mutations.increment(state)
    expect(state.count).toBe(1)
    mutations.decrement(state)
    expect(state.count).toBe(0)
  })

  // 测试内容：getters
  // 伪造（mock）state 测试evenOrOdd的值
  it('getters test even', () => {
    const state = {
    count:0
        }
    expect(getters.evenOrOdd(state)).toBe('even')
  })

  // 测试内容：getters
  // 伪造（mock）state 测试evenOrOdd的值
  it('getters test odd', () => {
    const state = {
    count:1
        }
    expect(getters.evenOrOdd(state)).toBe('odd')
  })

  // 测试内容：actions 比前两个测试要稍微复杂
  // 伪造（mock）commit 测试mutations下的方法
  it('actions test', () => {
    // 伪造commit
    const commit = jest.fn()
    // increment
    actions.increment({ commit })
    expect(commit).toBeCalled()
    expect(commit).toBeCalledWith('increment')
    // decrement
    actions.decrement({ commit })
    expect(commit).toBeCalled()
    expect(commit).toBeCalledWith('decrement')
  })
})

```
