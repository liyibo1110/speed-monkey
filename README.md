# speed-monkey

## 安装依赖
```
npm install
```

### 运行命令
```
npm run start
```

### 配置文件说明
```
在src目录应增加一个jobs.js配置文件，内容格式为：
module.exports = 
    [
        {
            name : 'project1',  //选择时显示的名称，一般是项目名称
            type : 'spring',    //不同的type会找不同的builder，最终执行不同的build函数
            localDir : 'D:\\source\\project1',  //本地Java项目的目录
            jarName : 'project1.jar',   //本地mvn clean package打包后的jar文件名称
            remoteAddr : '192.168.1.100',   //服务器的ssh的IP
            remotePort : 22,    //服务器的ssh的端口
            username : 'tester',    //服务器的ssh登录用户名
            password : '123456',    //服务器的ssh登录密码
            remoteDir : '/opt/tomcat/project1/webapps/ROOT/WEB-INF/lib/'    //服务器项目lib目录
        },
        {
            name : 'project2',
            type : 'springboot',
            localDir : 'D:\\source\\project2',
            jarName : 'project2.jar',
            remoteAddr : '192.168.1.101',
            remotePort : 22,
            username : 'tester',
            password : '123456',
            remoteDir : '/opt/tomcat/project2/'
        }
    ];
```
