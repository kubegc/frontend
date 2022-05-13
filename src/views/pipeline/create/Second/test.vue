<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="构建名称">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="构建服务">
      <el-select v-model="form.region" placeholder="请选择活动区域">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="构建超时">
      <el-col :span="11">
        <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
      </el-col>
      <el-col class="line" :span="2">-</el-col>
      <el-col :span="11">
        <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
      </el-col>
    </el-form-item>
    <el-form-item label="即时">
      <el-switch v-model="form.delivery"></el-switch>
    </el-form-item>
    <el-form-item label="代码信息">
      <el-checkbox-group v-model="form.type">
        <el-checkbox label="平台" name="type"></el-checkbox>
        <el-checkbox label="拥有者" name="type"></el-checkbox>
        <el-checkbox label="名称" name="type"></el-checkbox>
        <el-checkbox label="分支" name="type"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="特殊资源">
      <el-radio-group v-model="form.resource">
        <el-radio label="环境变量"></el-radio>
        <el-radio label="环境策略"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="构建脚本">
      <el-input type="textarea" v-model="form.desc"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
// import { getBuildConfigDetailAPI, getAllAppsAPI, getImgListAPI, getCodeSourceAPI, createBuildConfigAPI, updateBuildConfigAPI, getServiceTargetsAPI, queryJenkinsJob, queryJenkinsParams } from '@api'
// import qs from 'qs'
// import Editor from 'vue2-ace-bind'
// import Resize from '@/components/common/resize.vue'
// const validateBuildConfigName = (rule, value, callback) => {
//   if (value === '') {
//     callback(new Error('请输入构建名称'))
//   } else {
//     if (!/^[a-z0-9-]+$/.test(value)) {
//       callback(new Error('名称只支持小写字母和数字，特殊字符只支持中划线'))
//     } else {
//       callback()
//     }
//   }
// }
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    },
    // async addBuild (item) {
    //   const res = await getCodeSourceByAdminAPI(1)
    //   if (res && res.length > 0) {
    //     this.$router.push(`${this.buildBaseUrl}?rightbar=build&service_name=${item.name}&build_add=true`)
    //   } else {
    //     this.addCodeDrawer = true
    //   }
    // },
    // saveBuildConfig () {
    //   this.$refs.buildRef.updateBuildConfig()
    // },
    // getServiceModules () {
    //   this.$emit('getServiceModules')
    // },
    getProject () {
      const projectName = this.projectName
      getSingleProjectAPI(projectName).then((res) => {
        this.projectForm = res
        this.customEnvs = res.vars
        if (res.team_id === 0) {
          this.projectForm.team_id = null
        }
      })
    },
    // getServiceTemplateWithConfig () {
    //   if (this.service && this.service.type === 'k8s' && this.service.status === 'added') {
    //     this.changeRoute('var')
    //     serviceTemplateWithConfigAPI(this.service.service_name, this.projectNameOfService).then(res => {
    //       this.serviceModules = res.service_module
    //       this.sysEnvs = res.system_variable
    //     })
    //   }
    // },
    // changeRoute (step) {
    //   this.$route.query.service_project_name && (delete this.$route.query.service_project_name)
    //   this.$route.query.build_name && (delete this.$route.query.build_name)
    //   this.$router.replace({
    //     query: Object.assign(
    //       {},
    //       this.$route.query,
    //       {
    //         rightbar: step
    //       })
    //   })
    // },

    checkExistVars () {
      return new Promise((resolve, reject) => {
        const isDuplicate = this.detectedEnvs.map((item) => { return item.key }).some((item, idx) => {
          return this.detectedEnvs.map((item) => { return item.key }).indexOf(item) !== idx
        })
        if (isDuplicate) {
          this.$message({
            message: '变量列表中存在相同的 Key 请检查后再保存',
            type: 'warning'
          })
          reject(new Error('cancel save'))
        } else {
          resolve()
        }
      })
    },
    updateEnvTemplate (projectName, payload, verbose) {
      updateEnvTemplateAPI(projectName, payload).then((res) => {
        bus.$emit('refresh-service')
        if (verbose) {
          this.$notify({
            title: '保存成功',
            message: '变量列表保存成功',
            type: 'success'
          })
        }
      })
    },
    addRenderKey () {
      if (this.addKeyData[0].key !== '') {
        this.$refs.addKeyForm.validate(valid => {
          if (valid) {
            this.customEnvs.push(this.$utils.cloneObj(this.addKeyData[0]))
            this.projectForm.vars = this.customEnvs
            this.checkExistVars()
              .then(() => {
                this.updateEnvTemplate(this.projectName, this.projectForm)
                this.addKeyData[0].key = ''
                this.addKeyData[0].value = ''
              })
              .catch(() => {
                this.addKeyData[0].key = ''
                this.addKeyData[0].value = ''
                this.$refs.addKeyForm.resetFields()
                this.$refs.addValueForm.resetFields()
                this.addKeyInputVisable = false
                console.log('error')
              })
          } else {
            return false
          }
        })
      }
    },
    editRenderKey (index, state) {
      this.$set(this.editEnvIndex, index, true)
    },
    saveRenderKey (index, state) {
      this.$set(this.editEnvIndex, index, false)
      this.projectForm.vars = this.customEnvs
      this.updateEnvTemplate(this.projectName, this.projectForm)
    },
    deleteRenderKey (index, state) {
      if (state === 'present') {
        this.$confirm('该 Key 被产品引用，确定删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.customEnvs.splice(index, 1)
          this.projectForm.vars = this.customEnvs
          this.updateEnvTemplate(this.projectName, this.projectForm)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.customEnvs.splice(index, 1)
        this.projectForm.vars = this.customEnvs
        this.updateEnvTemplate(this.projectName, this.projectForm)
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .scrollBar() {
    ::-webkit-scrollbar-track {
      width: 5px;
      height: 5px;
      background-color: #f5f5f5;
      border-radius: 6px;
    }

    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background-color: #f5f5f5;
    }

    ::-webkit-scrollbar-thumb {
      width: 5px;
      height: 5px;
      background-color: #b7b8b9;
      border-radius: 6px;
    }
  }

.el-input-group {
  vertical-align: middle;
}

.deploy-script {
  margin-top: 10px;
  margin-bottom: 10px;

  .ace_editor.ace-xcode {
    &:hover {
      .scrollBar();
    }
  }
}

.params-dialog {
  display: inline-block;
  margin-bottom: 10px;
  padding: 10px;
  background: #f5f5f5;

  .delete-param {
    float: right;
    margin-top: -18px;
    color: #ff4949;
    font-size: 18px;
    cursor: pointer;
  }
}

.create-footer {
  position: fixed;
  right: 130px;
  bottom: 0;
  z-index: 5;
  box-sizing: border-box;
  width: 400px;
  padding: 10px 10px 10px 10px;
  text-align: left;
  background-color: transparent;
  border-radius: 4px;

  .btn-primary {
    color: #1989fa;
    background-color: rgba(25, 137, 250, 0.04);
    border-color: rgba(25, 137, 250, 0.4);

    &:hover {
      color: #fff;
      background-color: #1989fa;
      border-color: #1989fa;
    }
  }

  .grid-content {
    min-height: 36px;
    border-radius: 4px;

    .description {
      line-height: 36px;

      p {
        margin: 0;
        color: #676767;
        font-size: 16px;
        line-height: 36px;
        text-align: left;
      }
    }

    &.button-container {
      float: right;
    }
  }
}

.build-config-container {
  position: relative;
  flex: 1;
  padding: 15px 15px 0 15px;
  overflow: auto;
  font-size: 13px;

  .divider {
    width: 100%;
    height: 1px;
    margin: 5px 0 15px 0;
    background-color: #dfe0e6;

    &.item {
      width: 30%;
    }
  }

  .breadcrumb {
    .el-breadcrumb {
      font-size: 16px;
      line-height: 1.35;

      .el-breadcrumb__item__inner a:hover,
      .el-breadcrumb__item__inner:hover {
        color: #1989fa;
        cursor: pointer;
      }
    }
  }

  .section {
    margin-bottom: 15px;
  }

  .el-form {
    .item-title {
      font-size: 15px;
    }

    .variable {
      color: #409eff;
      font-size: 13px;
      cursor: pointer;
    }
  }

  .form-style1 {
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .app-operation {
    .el-button + .el-button {
      margin-left: 0;
    }
  }

  .operation-container {
    margin: 20px 0;

    .text {
      margin-right: 25px;
      color: #8d9199;
    }
  }
}
</style>
