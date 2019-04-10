---
sidebarDepth: 1
---
# VUE踩坑总结

本章记录在实际使用vue的过程中踩过的坑，以及解决办法

## VUE项目部署后的路径

### 1、vue项目部署在服务器后刷新时会出现404的错误

解决办法见[vue-router官网说明](https://router.vuejs.org/zh/guide/essentials/history-mode.html),需要后台配置和服务器设置

#### nginx服务器解决方案：修改.conf  配置文件

有两种解决方案

##### 方案一

``` js
location / {
  try_files $uri $uri/ @router;
  index index.html;
}
location @router {
  rewrite ^.*$ /index.html last;
}
```

##### 方案二

```js
location / {
  error_page  404  /index.html;
  #try_file $uri $uri/ /index.html =404;
}
```

#### apach服务器解决方案(假设放在csdn目录下)分以下几步

1.配置路由：使用history模式，并且配置base

2.在config/index.js文件里的assetsPublicPath改成你放在服务器的文件路径里，根目录就是‘/’  如果是放在某个文件夹，例： /csdn/‘’

3.修改Apache的httpd.conf文件，使其支持   .htaccess

4.在对应的文件夹项目下添加.htaccess文件,（这里需要注意的是因为windows不支持无文件名的格式 即  .***, 所以需要先新建一个文本文档，把内容写好，然后ftp上传到对应目录，然后重命名，这里重命名后会看不到，需要把ftp设置为可以查看隐藏文件）

```txt
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /csd/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /csd/index.html [L]
</IfModule>
```

5.重启服务器
这里也是在网上搜到的方法，nginx的亲测可用，Apache未亲测

---

配置以后可能仍然会报错，仔细查看发现是路径问题

```js
// config/index.js

build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/', //部署时一定不能改成./ 会导致多层嵌套路由刷新时路径出错
```

关于上面的路径问题，需要特别说明一下，vuecli的版本[3.xx](https://cli.vuejs.org/zh/config/#publicpath)开始没必要手动配置上面的路径，2.xx版本的默认也是不需要配置的，但是网上有很多教程会告诉你那里的'/'要改成'./'，才能在本地不报错，服务器部署时请一定记得改回来

### 2、vue项目打包部署后icon不能正常显示的问题

(虽未实测，该问题貌似在vuecli 3.xx版本不存在,所以个人强烈建议使用[3.xx](https://cli.vuejs.org/zh/))

方法一：在build/utils文件中的下图所示位置添加../../公共路径

```js
  if (options.extract) {
    return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
        publicPath:'../../' //解决部署时img路径问题
    })
    } else {
    return ['vue-style-loader'].concat(loaders)
    }
}
```

方法二和三[请点这里](https://github.com/vuejs/vue-cli/issues/179)

style-loder 无法自己设置publicpath, 所以只能在ExtractTextPlugin后的css目录路径 和 webpack.base.conf做文章的，

方法二：是在webpack.base.conf 里设置assetsPublicPath:'/' 根目录，assetsSubDirectory: './在服务器中的相对路径/static',
  
config/index.js

```js
  assetsSubDirectory: 'AbsolutePath/projectPath/static',
  assetsPublicPath: '/'，
```

方法三：是在ExtractTextPlugin,css目录路径，把脱离出来的css路径裸在项目路径，在webpack.prod.conf中设置

```js
	// 不需要提到static/css 中
	//new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css')),  
	new ExtractTextPlugin('[name].[contenthash].css'),
```

  config/index.js

  ```js
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
  ```

#### 总结
以上三种方法都可以解决img在部署时的路径问题，首推方法一，在知道项目的绝对路径时可以用方法二，不知道项目的绝对路径可以用方法三，（只是css文件裸在youproject中，看起来很low)

## 实现动态修改服务器URL方法

需求：服务器地址（API的base_url）可以手动修改

实现方法可能不止一种，下面是个人觉得最简单最易理解的一种

1、在public文件夹内创建settings.json文件

这个文件就是需要手动更改的服务器地址，因为在public文件夹内，所以不会被webpack打包，只会被复制到build后的dist文件夹内

```json
{
    "api_baseURL":"http://172.16.75.170"
}
```

2、main.js内，vue实例化部分代码，其他无关代码略

当settings.json文件内地址更改后，刷新页面就会按照新地址重新配置axios的baseURL，即每次实例化vue之前都会获取当时设置的api_baseURLapi地址

```js
const getConfigJson = function () {
  Axios.get('/settings.json').then(res => {
    // 挂载到vue上，成为全局属性
    // Vue.prototype.api_baseURL = res.data.api_baseURL
    // 设置为每次请求的base_url
    Axios.defaults.baseURL = res.data.api_baseURL + '/api/'
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      store,
      components: {
        App
      },
      // template: '<App/>'
      render: h => h(App)
    })
  }).catch(err => console.log(err))
}
getConfigJson()
```