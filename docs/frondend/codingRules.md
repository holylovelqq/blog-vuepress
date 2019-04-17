# 前端代码规范

记录自己常用的代码规范，由于现在的项目开发基本都是使用vue，所以部分是针对vue，细节有待完善

### 每个开发者都应该有自己的一套开发规范

个人开发使用

### 每个项目开始前都应该定制一套代码规范

项目中使用，有些时候临时组建起来的团队很容易就会忽略制定代码规范，尤其项目进度压力大的时候，这个时候就需要开发人员主动提起并商定。请注意，任何项目（团队）都需要一套代码规范，无一例外

### 个人规范服从项目规范

新团队新项目的情况下，代码规范可以一起商定，一般前端和后台分别有自己的代码规范

老团队的话，一般都有一套自己的代码规范，且适用于老成员；老项目也都有自己的代码规范，请保持一致性；这两种情况下个人规范应该服从项目规范

#### 1.基本規則

[vue-style-guide](https://cn.vuejs.org/v2/style-guide/)

[Eslint-plugin-vue规则](https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention)

[Eslint-plugin-standard规则](https://github.com/standard/eslint-plugin-standard)

#### 2.命名規則

##### CSS命名

[BEM命名規則](http://getbem.com/naming/)----国际通用规范之一

命名是比较困扰的，每个有自己样式的标签都应该有一个类名（非常不建议使用标签名来做选择器，执行效率低于其他任何一种方式），所以当标签较多的时候，命名就成了一种负担，尤其像我们这种英语水平有限的

例：.block--hidden  .form__input

##### JSの命名

camelCase-驼峰命名

尽可能使用准确易懂的英语，多个单词的情况动词在前较多

例：init() getData() deleteData()

#### 3.文字编码

utf-8 ---国际通用

#### 4.版权标记copyright

一般项目都会需要版权标记

将版权标记放在需要注明版权的文件的第一行

```js
// (C) 2019 L-HOLY PERSONAL
...
...
...
...
```

#### 5.注释comment

注释语言应该根据项目而定，国内项目一般为汉语或英语

##### HTML

```html
<!-- (C) 2019 L-HOLY PERSONAL -->
```

##### CSSとJS

###### 段落注释

```js
/**
 * 获取当前视口的宽度，判断默认样式
 * @params size，Num类型，大于0
 * @returns true<1025<=false
 */
checkWidth(size){
  ...
}
```

###### 一般单行注释

```js
// 获取数据
getData(){
    ...
}
```

```css
/* 全局样式，因本项目是测试教程项目，样式简化在此处 */
.title {
  ...
}
```

###### 行尾注释

```js
-webkit-transition: left .3s ease-in-out; // sidebarの開閉
```

#### 6.其他

换行符：LF  --或者CRLF，具体根据项目情况制定