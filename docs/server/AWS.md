# AWS EC2部署

记录自己AWS EC2部署学习历程

⭐请注意AWS免费一年期，过期后就会自动从信用卡扣款，长期不使用请停止或终止实例⭐

⭐当您使用的容量超过免费量也会自动从信用卡扣款，使用频繁的话建议多查看AWS账单⭐

## 背景

+ 前端开发者，熟悉linux基础命令，以前接触过服务器部署，但未实际操作过
+ 步骤：申请AWS个人服务器（免费一年试用期）-创建EC2实例-验证实例-安装nginx-部署自己开发的简单静态页面-使用jikens实现前端自动化（暂定）

## 过程记录

### 1. 申请AWS账号（个人）

申请国外账号需要绑定信用卡（请注意注销账号，超过免费期后自动扣款），第一次申请有免费一年的体验期[申请步骤](https://aws.amazon.com/cn/register-flow/?nc1=h_ls)

### 2. 创建EC2实例

登陆申请的账号，按照[使用ec2](https://www.cnblogs.com/huang0925/p/3870283.html)里面介绍的步骤，创建ec2实例，因为是使用免费的套餐，前面几步请选用默认选择的免费配置，一直到第六步之前请使用默认配置，第六步请参考如下配置

**第六步 配置安全组**

+ 开放80端口，提供http服务
+ 配置入站规则，使能ping通

<img src="/assets/img/AWS-6.png" style="border: 1px solid #000;"/>

配置完成以后，点击右下角审核和启动，继续右下角启动，然后会进入下载密钥的页面，选择新建密钥，起个名字如'AWSkey'，然后下载密钥，然后启动实例，请注意这里有个限制，就是不下载密钥是不能启动实例的，因为连接实例需要shh密钥。然后就进入启动状态页面，提示你启动完成了。so easy

参考官方[创建EC2实例](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/EC2_GetStarted.html)

**⭐需要注意密钥文件只能下载一次，一定要妥！善！保！管！⭐**

### 3. 查看实例

1. 继续上面的操作（或者每次登陆AWS）点击左上角服务-ec2，即可进入ec2 dashboard，如下图

<img src="/assets/img/3-AWS.png" />

2. 点击正在运行的实例，即进入实例页面，注意下面红框内是会用到的

<img src="/assets/img/3-2-AWS.png" />

### 4. 连接到实例

官方推荐连接到实例的方法[连接到您的 Linux 实例](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/AccessingInstances.html)

连接到实例的软件有很多，您可以根据官方提示使用任何一种方式，也可以按照您自己的习惯使用，需要指出的是，PuTTY可以将您下载的密钥转换成ppk格式，在使用winSCP传输文件的时候会用到，此步骤只需要连接到实例，所以不需要转换ppk格式

<img src="/assets/img/remote-ins.png" />

按照图中设置连接即可，红框内为您的实例公有ip和上面下载的.pem密钥文件，蓝框为自定义内容。（个人使用的是RLogin日语版）

### 5. 验证

按照[使用ec2](https://www.cnblogs.com/huang0925/p/3870283.html)里面介绍的步骤，最后是搭建一个web服务器，请按照里面的步骤操作即可。

对于上面教程里面步骤的提示：
+ 按照教程里面的步骤，是不能修改创建的index.html文件的，建议切换到root用户：sudo su，切换过来以后，就不用每个命令前面添加sudo了
+ 执行service httpd start时 提示Redirecting to /bin/systemctl start httpd.service，意思就是让你使用这个命令启动：/bin/systemctl start httpd.service

至此，已经可以从浏览器看到 hello world了，配图

<img src="/assets/img/result.png" />

### 6. 部署自己的静态页面

受第5步的验证启发，如果我们将我们自己的静态页面放在/var/www/html/文件夹下，这样不就是部署自己的静态页面成功了么。

所以，先将/var/www/html文件夹的权限改为所有人都有w权限，然后通过winSCp将自己打包后的项目文件上传到/var/www/html/目录下，结果就是部署成功。

虽然部署成功了，但是并没有达到自己学习服务器部署的目的，所以nginx的安装和jikens的使用将会另外详述。
