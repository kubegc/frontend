<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18" :offset="3">
        <el-card>
          <el-col :span="18">
            <el-form :model="jsonObj">
              <el-form-item label="配置1"><el-input v-model="jsonObj.conf1"/></el-form-item>
              <el-form-item label="配置2"><el-input v-model="jsonObj.conf2"/></el-form-item>
              <el-form-item label="配置3"><el-input v-model="jsonObj.conf3"/></el-form-item>
              <el-form-item label="配置4"><el-input v-model="jsonObj.conf4"/></el-form-item>
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
                  <div slot="tip" class="el-upload__tip">上传json文件</div>
                </el-upload>
              </el-form-item>
              <el-form-item><el-button type="success" size="small">运行程序</el-button></el-form-item>
            </el-form>
          </el-col>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { saveAs } from 'file-saver'
export default {
  data() {
    return {
      jsonObj: {}
    }
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning('只能选择一个文件')
    },
    handleSelect(file, fileList) {
      const reader = new FileReader()
      reader.onload = () => {
        console.log(reader.result)
        this.jsonObj = JSON.parse(reader.result)
      }
      reader.readAsText(file.raw)
    },
    save() {
      const blob = new Blob([JSON.stringify(this.jsonObj, null, 2)], { type: 'application/json;charset=utf-8'})
      saveAs(blob, 'config.json')
    }
  }
}
</script>

<style scoped>
</style>
