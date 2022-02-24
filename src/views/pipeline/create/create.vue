<template>
  <div class="create-project">
    <el-dialog :fullscreen="true"
               custom-class="create-project"
               :visible.sync="dialogVisible">
      <div class="project-contexts-modal">
        <header class="project-contexts-modal__header">
        </header>
        <div class="project-contexts-modal__content">
          <h1 class="project-contexts-modal__content-title">{{'开始新建项目'}}</h1>
          <div class="project-contexts-modal__content-container">
            <div class="project-settings__inputs-container">
              <el-tabs style="width: 100%;"    v-model="activeName">
                <el-tab-pane label="基本信息" name="base"></el-tab-pane>
                <el-tab-pane label="高级配置" name="advance"></el-tab-pane>
              </el-tabs>
              <el-form :model="projectForm"
                       :rules="rules"
                       label-position="top"
                       ref="projectForm"
                       label-width="100px"
                       class="demo-projectForm">
                <el-form-item label="项目名称"
                              v-show="activeName !=='advance'"
                              prop="project_name">
                  <el-input @keyup.native="()=>projectForm.project_name=projectForm.project_name.trim()"
                            v-model="projectForm.project_name"></el-input>
                </el-form-item>

                <el-form-item label="项目主键"
                              v-show="activeName !=='advance'"
                              prop="product_name">
                  <span slot="label">项目主键
                    <el-tooltip effect="dark"
                                content="项目主键是该项目资源的全局唯一标识符，用于该项目下所有资源的引用与更新，默认自动生成，同时支持手动指定，创建后不可更改"
                                placement="top">
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                    <el-button v-if="!editProductName"
                               @click="editProductName=true"
                               type="text">编辑</el-button>
                    <el-button v-if="!isEdit&&editProductName"
                               @click="editProductName=false"
                               type="text">完成</el-button>
                  </span>
                  <el-input :disabled="!showProductName"
                            v-model="projectForm.product_name"></el-input>
                </el-form-item>

                <el-form-item
                              v-show="activeName==='advance'"
                              label="服务部署超时（分钟）"
                              prop="timeout">
                  <el-input v-model.number="projectForm.timeout"></el-input>
                </el-form-item>
                <el-form-item
                              v-show="activeName==='advance'"
                              label="自定义交付物名称">
                      <span slot="label">自定义交付物名称
                        <el-tooltip effect="dark"
                                  placement="top">
                          <i class="el-icon-question"></i>
                        </el-tooltip>
                      </span>
                </el-form-item >
                <el-form-item label="描述信息"
                              v-show="activeName !=='advance'"
                              prop="desc">
                  <el-input type="textarea"
                            :rows="2"
                            placeholder="请输入描述信息"
                            v-model="projectForm.desc">
                  </el-input>

                </el-form-item>
                <el-form-item v-if="!isEdit"
                              v-show="activeName !=='advance'"
                              label="项目特点"
                              prop="desc">
                  <el-row :gutter="5">
                      <el-col :span="4">
                        <span>基础设施
                          <el-tooltip placement="top">
                            <div slot="content">
                              Kubernetes：包括自建 K8s 和云厂商提供容器云服务<br />
                            </div>
                            <i class="icon el-icon-question"></i>
                          </el-tooltip>
                        </span>
                      </el-col>
                      <el-col :span="10">
                        <el-radio-group size="mini"
                                        v-model="projectForm.product_feature.basic_facility">
                          <el-radio border
                                    label="kubernetes">Kubernetes</el-radio>
                          <el-radio border
                                    label="cloud_host">主机</el-radio>
                        </el-radio-group>
                      </el-col>
                  </el-row>
                  <el-row :gutter="5" v-if="projectForm.product_feature.basic_facility==='kubernetes'">
                    <el-col :span="4">
                      <span>
                        环境创建方式
                        <el-tooltip placement="top">
                            <div slot="content">
                              新建集成环境：在现有的 Kubernetes 集群新建环境<br />
                            </div>
                            <i class="icon el-icon-question"></i>
                        </el-tooltip>
                      </span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-row v-if="isEdit"
                        v-show="activeName !=='advance'"
                        :gutter="5">
                  <el-col :span="24">
                    <el-form-item label="项目管理员"
                                  prop="user_ids">
                      <el-select v-model="projectForm.user_ids"
                                 style="width: 100%;"
                                 filterable
                                 multiple
                                 remote
                                 :remote-method="remoteMethod"
                                 :loading="loading"
                                 placeholder="请输入用户名搜索用户">
                        <el-option v-for="(user,index) in users"
                                   :key="index"
                                   :label="user.name"
                                   :value="user.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>

          </div>
        </div>
        <footer class="project-contexts-modal__footer">
          <el-button class="create-btn"
                     type="primary"
                     plain
                     @click="submitForm('projectForm')">{{isEdit?'确认修改':'立即创建'}}
          </el-button>
        </footer>

      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

const validateProductName = (rule, value, callback) => {
  if (typeof value === 'undefined' || value === '') {
    callback(new Error('填写项目主键'))
  } else {
    if (!/^[a-z0-9-]+$/.test(value)) {
      callback(new Error('项目主键只支持小写字母和数字，特殊字符只支持中划线'))
    } else {
      callback()
    }
  }
}
const validateDeployTimeout = (rule, value, callback) => {
  const reg = /^[0-9]+.?[0-9]*/
  if (!reg.test(value)) {
    callback(new Error('时间应为数字'))
  } else {
    if (value > 0) {
      callback()
    } else {
      callback(new Error('请输入正确的时间范围'))
    }
  }
}
export default {
  data () {
    return {
      activeName: 'base',
      dialogVisible: true,
      users: [],
      loading: false,
      editProductName: false,
      radio: true,
      projectForm: {
        project_name: '',
        product_name: '',
        user_ids: [],
        team_id: null,
        timeout: null,
        desc: '',
        visibility: 'public',
        enabled: true,
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
        user_ids: [
          { type: 'array', required: true, message: '请选择项目管理员', trigger: 'change' }
        ],
        visibility: [
          { type: 'string', required: true, message: '请选择项目可见范围', trigger: 'change' }
        ],
        enabled: [
          { type: 'boolean', required: true, message: '请选择项目是否启用项目', trigger: 'change' }
        ],
        timeout: [
          { required: true, trigger: 'change', validator: validateDeployTimeout }
        ]
      }
    }
  },
  methods: {
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        const orgId = this.currentOrganizationId
        usersAPI(orgId, '', 0, 0, query).then((res) => {
          this.loading = false
          this.users = this.$utils.deepSortOn(res.data, 'name')
        })
      } else {
        this.users = []
      }
    },

    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  computed: {
    ...mapGetters([
      'signupStatus'
    ]),
    currentOrganizationId () {
      return this.$store.state.login.userinfo.organization.id
    },

    showProductName () {
      return !this.isEdit && this.editProductName
    }
  }
}
</script>

<style lang="less">

.create-project {
  .icon {
    cursor: pointer;
  }


  .create-btn {
    color: #1989fa;
    background: #fff;
    border-color: #1989fa;

    &:hover {
      color: #fff;
      background: #1989fa;
      border-color: #1989fa;
    }
  }

  .project-contexts-modal {
    height: 100%;

    .project-contexts-modal__header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 0 50px;
    }

    .project-contexts-modal__footer {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
    }

    .project-contexts-modal__content {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .project-contexts-modal__content-title {
        margin: 0;
        margin-bottom: 20px;
        color: #000;
        font-weight: bold;
        font-size: 27px;
        text-align: center;
      }

      .project-settings__inputs-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        width: 800px;
      }
    }
  }
}
</style>
