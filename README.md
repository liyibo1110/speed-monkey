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
            name : 'project1',
            type : 'spring',
            localDir : 'D:\\source\\project1',
            jarName : 'project1.jar',
            remoteAddr : '192.168.1.100',
            remotePort : 22,
            username : 'tester',
            password : '123456',
            remoteDir : '/opt/tomcat/project1/webapps/ROOT/WEB-INF/lib/'
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
