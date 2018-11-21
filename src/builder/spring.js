const childProcess = require('child_process');
const sftpClient = require('ssh2-sftp-client');
const moment = require('moment');
const path = require("path");

function build(job){
    console.log('1/3 开始本地打包...');
    packageJar(job);
    console.log('2/3 尝试修改服务器上jar文件的名字');
    loginAndBackupJar(job);
    console.log('3/3 开始上传本地最新的jar文件');
    loginAndUploadJar(job);
}

function packageJar(job){
    let command = ['cd', '/d', job.localDir, '&&', 'mvn', 'clean', 'package'].join(' ');
    return childProcess.execSync(command).toString();
}

function loginAndBackupJar(job){
    let sftp = new sftpClient();
    sftp.connect({
        host: job.remoteAddr,
        port: job.remotePort,
        username: job.username,
        password: job.password
    }).then(() => {
        let jarPath = job.remoteDir + job.jarName;
        let backupJarPath = job.remoteDir + getBackupName(job.jarName);
        return sftp.rename(jarPath, backupJarPath);
    }).then(data => {
        console.log(data);
        sftp.end();
    }).catch(err =>{
        console.log(err);
        sftp.end();
    });
}

function loginAndUploadJar(job){
    let sftp = new sftpClient();
    sftp.connect({
        host: job.remoteAddr,
        port: job.remotePort,
        username: job.username,
        password: job.password
    }).then(() => {
        let localJarPath = job.localDir + path.sep + 'target' + path.sep + job.jarName;
        let targetJarPath = job.remoteDir + job.jarName;
        return sftp.put(localJarPath, targetJarPath);
    }).then(data => {
        console.log(data);
        sftp.end();
    }).catch(err =>{
        console.log(err);
        sftp.end();
    });
}

function getBackupName(originName){
    return originName + '.bak' + moment().format('YYYYMMDDHHmmss');
}

exports.build = build;