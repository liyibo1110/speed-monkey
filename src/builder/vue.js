const childProcess = require('child_process');
const sftpClient = require('ssh2-sftp-client');
const moment = require('moment');
const path = require("path");
const fs = require("fs");

function build(job){
    
    packageDist(job);
    loginAndBackupDistAndUpload(job);
    //putAllToRemote(job, 'dist');
}

function packageDist(job){
    console.log('1/2 开始本地打包...');
    let command = ['cd', '/d', job.localDir, '&&', 'npm', 'run', 'build'].join(' ');
    return childProcess.execSync(command).toString();
}

function loginAndBackupDistAndUpload(job){
    console.log('2/2 尝试备份原来的dist目录，然后开始递归上传目录');
    let sftp = new sftpClient();
    sftp.connect({
        host: job.remoteAddr,
        port: job.remotePort,
        username: job.username,
        password: job.password
    }).then(() => {
        let distPath = job.remoteDir + "/dist";
        //console.log(distPath);
        let backupDistPath = getBackupName(distPath);
        //console.log(backupDistPath);
        return sftp.rename(distPath, backupDistPath);
    }).then(data => {
        return sftp.mkdir(job.remoteDir + "/dist");  
    })
    .then(data => {
        console.log(data);
        sftp.end();
    })
    .then(data => {
        putAllToRemote(job, 'dist');
    }) 
    .catch(err =>{
        console.log(err);
        sftp.end();
    });
}

function putAllToRemote(job, localPath){
    //console.log('3/3 将本地dist目录递归上传服务器...');
    let localDistPath = job.localDir + path.sep + localPath;
    let remoteDistPath = job.remoteDir + '/' + localPath.replace(/\\/g, '/');
    fs.readdir(localDistPath, (err, files) => {
        files.forEach((file) => {
            //console.log(file);
            let stat = fs.statSync(localDistPath + path.sep + file);
            if(stat.isFile()){
                //是文件则PUT上传
                putSingleToRemote(job, localDistPath + path.sep + file, remoteDistPath + '/' + file);
            }else{
                //是目录则先建立目录，然后递归调用
                let sftp = new sftpClient();
                sftp.connect({
                    host: job.remoteAddr,
                    port: job.remotePort,
                    username: job.username,
                    password: job.password
                }).then(data => {
                    return sftp.mkdir(job.remoteDir + '/' + localPath.replace(/\\/g, '/') + '/' + file, true);    
                }).then(data => {
                    putAllToRemote(job, localPath + path.sep + file);
                    sftp.end();
                }).catch(data => {
                    console.log(data);
                    sftp.end();
                });
            }
        });
    });
}

function putSingleToRemote(job, srcFile, destFile){
    let sftp = new sftpClient();
    sftp.connect({
        host: job.remoteAddr,
        port: job.remotePort,
        username: job.username,
        password: job.password
    }).then(data => {
        return sftp.put(srcFile, destFile);  
    }).then(data => {
        console.log(data);
        sftp.end();
    }).catch(err =>{
        console.log(err);
        sftp.end();
    });
}

function getBackupName(originDist){
    return originDist + moment().format('YYYYMMDDHHmmss');
}

exports.build = build;