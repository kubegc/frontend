<template>
  <div id="root">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="任务名称">
        <el-input v-model="task.name"></el-input>
      </el-form-item>
      <el-form-item label="任务类型">
        <el-radio-group v-model="task.taskType">
          <el-radio-button label="AlexNet"></el-radio-button>
          <el-radio-button label="GoogleNet"></el-radio-button>
          <el-radio-button label="ResNet-50"></el-radio-button>
          <el-radio-button label="VGG-19"></el-radio-button>
          <el-radio-button label="Inception-v3"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="数据集">
        <el-radio-group v-model="task.dataset">
          <el-radio-button label="Cat-Fish"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <el-tag>{{task.name}}</el-tag>
    <el-tag type="success">{{task.taskType}}</el-tag>
    <el-tag type="info">{{task.dataset}}</el-tag>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        task: {
          name: '',
          taskType: '',
          dataset: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log(this.$data.task.name)
      }
    }
  }
</script>
