<template>

  <div class="handle-box">
    <el-select v-model="jobName" clearable placeholder="请选择项目">
      <el-option v-for="job of this.jobsAllData"
        :key="job.name" :label="job.name" :value="job.name">
      </el-option>
    </el-select>

    <el-button type="primary" icon="search" @click="getData" :loading="loading">发布</el-button>
  </div>

</template>

<script>
  import fs from 'fs';
  import path from 'path';
  import jobs from '../config/jobs';
  
  export default {
    data() {
      return {
        jobsAllData: jobs.config,
        jobName : null,
        loading : false,
      }
    },

    created(){
      console.log('进入created');
      
    },

    methods: {
      getData(){
        console.log('getData中...');
      }
    }
}
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
    margin-top: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 200px;
    display: inline-block;
}
</style>
