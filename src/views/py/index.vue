<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18" :offset="3">
        <el-card>
          <el-col :span="18">
            <el-form :model="jsonObj" label-position="top">
              <el-form-item label="配置1"><el-input v-model="jsonObj.conf1"/></el-form-item>
              <el-form-item label="配置2"><el-input v-model="jsonObj.conf2"/></el-form-item>
              <el-form-item label="配置3"><el-input v-model="jsonObj.conf3"/></el-form-item>
              <el-form-item label="配置4"><el-input v-model="jsonObj.conf4"/></el-form-item>
              <el-form-item label="起止时间日期">
                <el-date-picker
                  v-model="jsonObj.time"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item><el-button type="primary" size="small" @click="save">保存配置</el-button></el-form-item>
            </el-form>
          </el-col>
          <el-col :span="6" style="text-align: center">
            <el-form style="margin-top: 100px">
              <el-form-item>
                <el-upload
                  action=""
                  :limit="1"
                  accept="application/json"
                  :on-exceed="handleExceed"
                  :auto-upload="false"
                  :on-change="handleSelect"
                >
                  <el-button type="primary" size="small">载入配置</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item><el-button type="success" size="small" @click="run">运行程序</el-button></el-form-item>
            </el-form>
          </el-col>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-image :src="src" />
    </el-row>
  </div>
</template>

<script>
import { execFunc, saveConfig } from '@/api/pypage'
export default {
  data() {
    return {
      jsonObj: {},
      src: undefined
    }
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning('只能选择一个文件')
    },
    handleSelect(file, fileList) {
      const reader = new FileReader()
      reader.onload = () => {
        this.jsonObj = JSON.parse(reader.result)
      }
      reader.readAsText(file.raw)
    },
    save() {
      saveConfig(this.jsonObj).then(
        response => {
          if (response.data === 'success') {
            console.log('hhhh')
          }
        }
      )
    },
    run() {
      execFunc().then(response => {
        if (response.data === 'success') {
          this.src = undefined
          this.src = 'http://localhost:5000/image'
        }
      })
    }
  }
} 
</script>

<style scoped>
</style>
