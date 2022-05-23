<template>
  <el-dialog :fullscreen="true" custom-class="create-project"  :visible.sync="dialogVisible">
    <header class="project-contexts-modal__header">{{isEdit?'修改项目信息':'新建项目'}}</header>
    <section class="project-contexts-modal__content">
      <el-form
        :model="projectForm"
        :rules="rules"
        label-position="right"
        ref="projectForm"
        label-width="120px"
        class="demo-projectForm"
        inline-message
      >
        <el-form-item label="项目名称" prop="project_name">
<!--          <el-input @keyup.native="()=>projectForm.project_name=projectForm.project_name.trim()" v-model="projectForm.project_name"></el-input>-->
        </el-form-item>
        <el-form-item label="项目主键" prop="product_name" class="label-icon">
          <span slot="label">
            项目标识
            <el-tooltip effect="dark" content="项目标识是该项目资源的全局唯一标识符，用于该项目下所有资源的引用与更新，默认自动生成，同时支持手动指定，创建后不可更改" placement="top">
              <i class="el-icon-question" style="margin-left: 5px;"></i>
            </el-tooltip>
          </span>
          <el-input  v-model="projectForm.product_name"></el-input>
        </el-form-item>
        <el-form-item prop="desc" label="描述信息">
          <el-input type="textarea" :rows="1" placeholder="请输入描述信息" v-model="projectForm.desc"></el-input>
        </el-form-item>
        <el-form-item  label="项目类型">
<!--          <div class="project-type">-->
<!--            <div-->
<!--              class="project-type-item"-->
<!--              v-for="typeItem in projectTypeList"-->
<!--              :key="typeItem.type"-->
<!--              @click="switchType(typeItem.type)"-->
<!--              :class="{selected: projectType === typeItem.type}"-->
<!--            >-->
<!--              <i class="type-icon" :class="[projectType === typeItem.type ? 'el-icon-success selected' : typeItem.icon]"></i>-->
<!--              <div class="project-type-item__desc">-->
<!--                <div class="title">{{ typeItem.title }}</div>-->
<!--                <div class="desc">{{ typeItem.firstDesc }}</div>-->
<!--                <div class="desc">{{ typeItem.secondDesc }}</div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
        </el-form-item>
        <div  class="advanced-title">
          <el-button type="text" @click="showAdvanced = !showAdvanced">
            高级配置
            <i :class="{'el-icon-arrow-right': !showAdvanced, 'el-icon-arrow-down': showAdvanced }"></i>
          </el-button>
        </div>
        <div >
          <el-form-item label="访问权限" prop="public">
            <el-select v-model="projectForm.public" popper-class="access-permission">
              <el-option label="私有" :value="false">
                <div class="title">私有</div>
                <div class="desc">该项目对系统普通用户默认不可见，项目管理员可通过添加成员对特定用户添加相应权限。</div>
              </el-option>
              <el-option label="公开" :value="true">
                <div class="title">公开</div>
                <div class="desc">用户默认享有公开权限，可查看项目中的工作流、环境、服务、构建、测试等资源。</div>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </section>
    <footer class="project-contexts-modal__footer">
      <el-button type="primary" @click="submitForm('projectForm')">{{isEdit?'确认修改':'立即新建'}}</el-button>
    </footer>
  </el-dialog>
</template>
<script>
  // import {
  //   usersAPI,
  //   createProjectAPI,
  //   getSingleProjectAPI,
  //   updateSingleProjectAPI,
  //   getClusterListAPI
  // } from '@api'
  // const pinyin = require('pinyin')
  // const validateProductName = (rule, value, callback) => {
  //   if (typeof value === 'undefined' || value === '') {
  //     callback(new Error('填写项目主键'))
  //   } else {
  //     if (!/^[a-z0-9-]+$/.test(value)) {
  //       callback(new Error('项目主键只支持小写字母和数字，特殊字符只支持中划线'))
  //     } else {
  //       callback()
  //     }
  //   }
  // }
  export default {
    data () {
      return {
        dialogVisible: true,
        users: [],
        loading: false,
        editProjectName: false,
        radio: true,
        projectForm: {
          project_name: '',
          product_name: '',
          admins: [],
          cluster_ids: [],
          desc: '',
          enabled: true,
          public: false,
          product_feature: {
            basic_facility: 'kubernetes',
            deploy_type: 'k8s',
            create_env_type: 'system'
          }
        },
        rules: {
          project_name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ],
          product_name: [
            { required: true, trigger: 'change', validator: validateProductName }
          ],
        },
        allCluster: [],
        showAdvanced: false,
      }
    },
    methods: {},

    mounted () {}
  }
</script>

<style lang="less" scoped>

  .tooltip-key {
    display: inline-block;
    width: 130px;
  }
  /deep/.el-dialog__header {
    padding: 0;
  }
  /deep/.el-dialog__body {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    min-height: calc(~'100% - 20px');
    padding: 15px 20px 10px;
  }
  .create-project {
    .icon {
      cursor: pointer;
    }
    .project-contexts-modal__header {
      width: 80%;
      min-width: 800px;
      margin: 0 auto 16px;
      padding-bottom: 14px;
      font-weight: 300;
      font-size: 18px;
      line-height: 22px;
      text-align: center;
      border-bottom: 1px solid rgba(210, 210, 210, 0.5);
    }
    .project-contexts-modal__content {
      flex: 1 0 auto;
      margin-left: calc(~'50% - 300px');
      /deep/.el-form {
        &.demo-projectForm {
          .el-input,
          .el-select,
          .el-textarea {

            font-weight: 300;
            .el-input {
              width: 100%;
            }
            .el-textarea__inner {
              height: 40px;
              line-height: 30px;
            }
          }
        }
        .el-form-item__label {
          font-weight: 300;
        }
        .el-form-item {
          margin-bottom: 8px;
          font-weight: 300;
          .el-form-item__content {
            line-height: 38px;
            .type-link {
              line-height: 22px;
              .icon {
                margin-right: 5px;
                color: #a0a0a0;
                font-size: 16px;
                vertical-align: text-bottom;
              }
              .el-link {
                font-weight: 300;
                font-size: 12px;
              }
            }
          }
        }
        .edit-btn {
          display: inline-block;
          margin-left: 6px;
          padding: 0 8px;
          font-size: 16px;
          line-height: 28px;
          border: 1px solid rgba(118, 122, 200, 0.5);
          border-radius: 4px;
          cursor: pointer;
        }
        .project-type {
          box-sizing: border-box;

          padding: 8px;
          line-height: 22px;
          background: rgba(160, 160, 255, 0.01);
          border: 1px solid rgba(210, 215, 220, 0.3);
          border-radius: 4px;
          .project-type-item {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding: 8px 0;
            border: 1px solid transparent;
            border-radius: 4px;
            cursor: pointer;
            &:not(:last-child) {
              margin-bottom: 2px;
            }
            .project-type-item__desc {
              .title {
                margin-bottom: 5px;
                color: #000;
                font-size: 14px;
              }
              .desc {
                color: #a0a0a0;
                font-size: 12px;
                line-height: 20px;
              }
            }
            .type-icon {
              flex: 0 0 74px;
              font-size: 24px;
              text-align: center;
              &.selected {

              }
            }
            &:hover {
              background: #fafafc;
            }
            &.selected {
              background: #fafafc;

              .project-type-item__desc {
                .title {

                }
                .desc {
                  color: #4a4a4a;
                }
              }
              .icon {

                font-size: 20px;
              }
            }
          }
        }
        .advanced-title {
          .el-button {
            padding: 6px 0;
            font-weight: 300;
          }
        }
      }
      .small-title {
        color: #ccc;
        font-size: 12px;
      }
      .el-radio--mini {
        &.is-bordered {
          width: 135px;
          margin-right: 0;
        }
      }
    }
    .project-contexts-modal__footer {
      width: 80%;
      min-width: 800px;
      margin: 16px auto 0;
      padding-top: 14px;
      text-align: center;
      border-top: 1px solid rgba(210, 210, 210, 0.5);
    }
  }
</style>

<style lang="less">

  .access-permission {

    .el-select-dropdown__item {
      height: auto;
      padding: 8px 20px;
      font-weight: 400;
      line-height: 22px;
      white-space: normal;
      &:not(:last-child) {
        border-bottom: 1px solid rgba(210, 210, 210, 0.5);
      }
      .title {
        font-size: 14px;
      }
      .desc {
        margin-top: 8px;
        color: #a0a0a0;
        font-size: 12px;
      }
      &.selected {

        .desc {
          color: inherit;
        }
      }
    }
  }
</style>
