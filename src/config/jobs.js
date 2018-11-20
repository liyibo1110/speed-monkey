export default{
    config : [
              {
                name : 'elc_manager',
                type : 'spring',
                localDir : 'D:\\source\\elc_manager\\target',
                jarName : 'elc_manager.jar',
                remoteAddr : '192.168.1.186',
                remotePort : 22,
                username : 'root',
                password : 'eucita.com',
                remoteDir : '/opt/tomcat/tomcat-elc-manager-20010/webapps/ROOT/WEB-INF/lib'
              },
              {
                name : 'travel_manager_server',
                type : 'spring-boot',
                localDir : 'D:\\source\\travel_manager_server\\target',
                jarName : 'travel_manager_server.jar',
                remoteAddr : '192.168.1.186',
                remotePort : 22,
                username : 'root',
                password : 'eucita.com',
                remoteDir : '/opt/tomcat/travel_manager_server'
              }
        ]
}
