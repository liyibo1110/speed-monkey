const jobs = require('./jobs');
const springBuilder = require('./builder/spring');
const springBootBuilder = require('./builder/springboot');
const vueBuilder = require('./builder/vue');
const inquirer = require('inquirer');

const jobNames = getJobNames();

/**
 * 增加Ctrl+C妥善处理
 */
process.on('SIGINT', () => {
    console.log('EXIT NOW!');
    process.exit();
});

inquirer.prompt([
    {
      name : 'name', 
      type : 'list', 
      message : '选择要发布的项目',
      choices : jobNames,
    }
  ]).then(answer => {
    // console.log('进入answer')
    let jobObj = lookupJob(answer.name);
    jobObj.builder.build(jobObj.job);
  });

function getJobNames(){
  let jobNames = [];
  for(let job of jobs){
    jobNames.push(job.name);
  }
  return jobNames;
}

function lookupJob(name){
  for(let job of jobs){
    if(job.name === name && job.type === 'spring') {
      return {builder : springBuilder, job};
    }else if(job.name === name && job.type === 'springboot'){
      return {builder : springBootBuilder, job};
    }else if(job.name === name && job.type === 'vue'){
      return {builder : vueBuilder, job};
    }
  }
  return null;
}