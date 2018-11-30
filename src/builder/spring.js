const childProcess = require('child_process');
const sftpClient = require('ssh2-sftp-client');
const moment = require('moment');
const path = require("path");

async function build(job){
    console.log('1/2 开始本地打包...');
    packageJar(job);
    console.log('2/2 尝试备份原来的jar并上传本地最新的jar文件');
    await loginAndBackupJarAndUpload(job);
    console.log('上传完成');
}

function packageJar(job){
    let command = ['cd', '/d', job.localDir, '&&', 'mvn', 'clean', 'package', job.mvnParam || ''].join(' ');
    return childProcess.execSync(command).toString();
}

async function loginAndBackupJarAndUpload(job){
    let sftp = new sftpClient();
    await sftp.connect({
        host: job.remoteAddr,
        port: job.remotePort,
        username: job.username,
        password: job.password
    }).then(() => {
        let jarPath = job.remoteDir + job.jarName;
        let backupJarPath = job.remoteDir + getBackupName(job.jarName);
        return sftp.rename(jarPath, backupJarPath);
    }).then(data => {
        let localJarPath = job.localDir + path.sep + 'target' + path.sep + job.jarName;
        let targetJarPath = job.remoteDir + job.jarName;
        return sftp.put(localJarPath, targetJarPath);  
    }).then(data => {
        console.log(data);
        return sftp.end();
    }).catch(err =>{
        console.log(err);
        return sftp.end();
    });
}

/* async function loginAndUploadJar(job){
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
} */

function getBackupName(originName){
    return originName + '.bak' + moment().format('YYYYMMDDHHmmss');
}

exports.build = build;