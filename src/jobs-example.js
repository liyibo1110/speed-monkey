module.exports = 
    [
        {
            name : 'spring-project',  //选择时显示的名称，一般是项目名称
            type : 'spring',    //不同的type会找不同的builder，最终执行不同的build函数
            localDir : 'D:\\source\\spring-project',  //本地Java项目的目录
            jarName : 'spring-project.jar',   //本地mvn clean package打包后的jar文件名称
            mvnParam : '-P production', //可选配置，mvn clean package追加的后续参数
            remoteAddr : '192.168.1.100',   //服务器的ssh的IP
            remotePort : 22,    //服务器的ssh的端口
            username : 'tester',    //服务器的ssh登录用户名
            password : '123456',    //服务器的ssh登录密码
            remoteDir : '/opt/tomcat/spring-project-tomcat/webapps/ROOT/WEB-INF/lib/'    //服务器项目lib目录
        },
        {
            name : 'springboot-project',
            type : 'springboot',
            localDir : 'D:\\source\\springboot-project',
            jarName : 'springboot-project.jar',
            mvnParam : '-P production', 
            remoteAddr : '192.168.1.101',
            remotePort : 22,
            username : 'tester',
            password : '123456',
            remoteDir : '/opt/be/springboot-project/'
        },
        {
            name : 'vue-project',
            type : 'vue',
            localDir : 'D:\\source\\vue-project',
            remoteAddr : '192.168.1.102',
            remotePort : 22,
            username : 'tester',
            password : '123456',
            remoteDir : '/opt/fe/vue-project/'
        }
    ];