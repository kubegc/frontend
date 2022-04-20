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
    <el-form-item label="构建时间">
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
        <el-radio label="使用工作空间缓存"></el-radio>
        <el-radio label="缓存自定义目录"></el-radio>
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
      source: 'zadig',
      orginOptions: [{
        value: 'zadig',
        label: 'Zadig 构建'
      },
        {
          value: 'jenkins',
          label: 'Jenkins 构建'
        }],
      jenkinsJobList: [],
      jenkinsBuild: {
        name: '',
        desc: '',
        targets: [],
        timeout: 60,
        jenkins_build: {
          job_name: '',
          jenkins_build_params: []
        },
        pre_build: {
          res_req: 'low'
        }
      },
      buildConfig: {
        timeout: 60,
        name: '',
        desc: '',
        repos: [],
        pre_build: {
          clean_workspace: false,
          res_req: 'low',
          build_os: 'xenial',
          image_id: '',
          image_from: '',
          installs: [],
          envs: [],
          enable_proxy: false,
          enable_gocov: false,
          parameters: []
        },
        scripts: '#!/bin/bash\nset -e',
        main_file: '',
        post_build: {
        },
        targets: []
      },
      stcov_enabled: false,
      docker_enabled: false,
      binary_enabled: false,
      post_script_enabled: false,
      allApps: [],
      serviceTargets: [],
      allCodeHosts: [],
      showBuildAdvancedSetting: {},
      createRules: {
        name: [
          {
            type: 'string',
            required: true,
            validator: validateBuildConfigName,
            trigger: 'blur'
          }
        ],
        'pre_build.image_id': [
          {
            type: 'string',
            required: true,
            message: '请选择构建系统',
            trigger: 'blur'
          }
        ]
      },
      docker_rules: {
        work_dir: [
          {
            type: 'string',
            message: '请填写镜像构建目录',
            required: true,
            trigger: 'blur'
          }
        ],
        docker_file: [
          {
            type: 'string',
            message: '请填写Dockerfile路径',
            required: true,
            trigger: 'blur'
          }
        ]
      },
      stcov_rules: {
        main_file: [
          {
            type: 'string',
            message: '请填写main文件路径',
            required: true,
            trigger: 'blur'
          }
        ]
      },
      file_archive_rules: {
        file_location: [
          {
            type: 'string',
            message: '请填写文件路径',
            required: true,
            trigger: 'blur'
          }
        ]
      },
      systems: [],

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
