const childProcess = require('child_process');
const sftpClient = require('ssh2-sftp-client');
//const sftpClient = require('node-ssh');
const moment = require('moment');
const path = require("path");
const fs = require("fs");

async function build(job){
    console.log('1/3 开始本地打包...');
    packageDist(job);
    await loginAndBackupDist(job);
    console.log('2/3 尝试备份原来的dist目录');
    
    //putAllToRemote(job, 'dist');
}

function packageDist(job){
    let command = ['cd', '/d', job.localDir, '&&', 'npm', 'run', 'build'].join(' ');
    childProcess.execSync(command);
}

async function loginAndBackupDist(job){
    let sftp = new sftpClient();
    await sftp.connect({
        host: job.remoteAddr,
        port: job.remotePort,
        username: job.username,
        password: job.password
    }).then(() => {
        let distPath = job.remoteDir + "/dist";
        let backupDistPath = getBackupName(distPath);
        return sftp.rename(distPath, backupDistPath);
    }).then(data => {
        console.log(data);
        return sftp.end();
    }).catch(err =>{
        console.log(err);
        return sftp.end();
    });
}

/* function putAllToRemote(job, localPath){
    //console.log('3/3 将本地dist目录递归上传服务器...');
    let localDistPath = job.localDir + path.sep + localPath;
    let remoteDistPath = job.remoteDir + '/' + localPath.replace(/\\/g, '/');
    let files = fs.readdirSync(localDistPath);
    files.forEach((file) => {
        //console.log(file);
        let stat = fs.statSync(localDistPath + path.sep + file);
        if(stat.isFile()){
            //是文件则PUT上传
            putSingleToRemote(job, localDistPath + path.sep + file, remoteDistPath + '/' + file);
            srcFiles.push(localDistPath + path.sep + file);
            destFiles.push(remoteDistPath + '/' + file);
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
} */

/* function putSingleToRemote(job, srcFile, destFile){
    console.log('进来了');
    srcFiles.push(srcFile);
    destFiles.push(destFile);
    console.log('变成了：' + srcFiles.length);
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
} */

function getBackupName(originDist){
    return originDist + moment().format('YYYYMMDDHHmmss');
}

exports.build = build;