# AWS部署

记录自己AWS部署学习历程

**静态网站部署**

主要参考[学习在AWS上进行构建网站](https://aws.amazon.com/cn/getting-started/use-cases/websites/?csl_l2b_ws)中的
[托管静态网站](https://aws.amazon.com/cn/getting-started/projects/host-static-website/?c_1)

## 背景

+ 前端开发者，熟悉linux基础命令，以前接触过服务器部署，但未实际操作过
+ 预定计划：申请AWS个人服务器（免费一年试用期）-安装nginx-部署静态页面-使用jikens实现前端自动化（暂定）

## 过程记录

### 1. 申请AWS账号（个人）

申请国外账号需要绑定信用卡（请注意注销账号，超过免费期后自动扣款），第一次申请有免费一年的体验期[申请步骤](https://aws.amazon.com/cn/register-flow/?nc1=h_ls)

### 2. 创建EC2实例

登陆申请的账号，[创建EC2实例](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/EC2_GetStarted.html)

⭐需要注意密钥文件只能下载一次，一定要妥！善！保！管！⭐