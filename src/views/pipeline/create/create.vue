<template>
  <div class="create-project">
    <el-dialog :fullscreen="true"
               custom-class="create-project"
               :visible.sync="dialogVisible">
      <div class="project-contexts-modal">
        <header class="project-contexts-modal__header">
        </header>
        <div class="project-contexts-modal__content">
          <h1 class="project-contexts-modal__content-title">{{'开始新建工作流'}}</h1>
          <div class="project-contexts-modal__content-container">
            <div class="project-settings__inputs-container">
              <el-tabs style="width: 100%;"    v-model="activeName">
                <el-tab-pane label="基本信息" name="base"></el-tab-pane>
                <el-tab-pane label="高级配置" name="advance"></el-tab-pane>
              </el-tabs>
              <el-form :model="tableData"
                       :rules="rules"
                       label-position="top"
                       re0f="addFormRef"
                       label-width="100px"
                       class="demo-projectForm">
                <el-form-item label="工作流名称"
                              v-show="$store.state.tableData "
                              prop="project_name">
                  <el-input v-model="$store.state.tableData"></el-input>
                </el-form-item>

                <el-form-item label="工作流标识"
                              prop="product_name">
                  <el-input v-model="$store.state.tableData"></el-input>
                </el-form-item>

                <el-form-item
                  v-show="activeName==='advance'"
                  label="服务部署超时（分钟）"
                  prop="timeout">
                  <el-input v-model="addForm.type"></el-input>
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
                            v-model="$store.state.tableData">
                  </el-input>

                </el-form-item>
                <el-form-item v-show="activeName !=='advance'"
                              label="工作流特点"
                              prop="desc">
                  <el-row :gutter="5">
                    <el-col :span="4">
                      <span>基础设施</span>
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
                      <span>环境创建方式</span>
                    </el-col>
                  </el-row>
                  <el-row v-if="projectForm.product_feature.basic_facility==='kubernetes'&&projectForm.product_feature.create_env_type==='system'" :gutter="5">
                    <el-col :span="4">
                      <span>服务部署方式
                        <el-tooltip placement="top">
                          <div slot="content">
                            K8s YAML 部署：使用 K8s 原生的 YAML配置方式部署服务<br />
                            Helm Chart 部署：使用 Helm 工具部署服务
                          </div>
                          <i class="icon el-icon-question"></i>
                        </el-tooltip>
                      </span>
                    </el-col>
                    <el-col :span="12">
                      <el-radio-group size="mini"
                                      v-model="projectForm.product_feature.deploy_type">
                        <el-radio border
                                  label="k8s">K8s YAML 部署</el-radio>
                        <el-radio border
                                  label="helm">Helm Chart 部署</el-radio>
                      </el-radio-group>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-row v-show="activeName !=='advance'"
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
        <router-link :to="`/t/t1/t3`" class="project-contexts-modal__footer">
          <el-button class="create-btn"
                     type="primary"
                     plain
                     @click="addParamsSetting">{{isEdit?'确认修改':'立即创建'}}
          </el-button>
        </router-link>

      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import axios from 'axios'
  import { getUserList } from '../../../api/api'
  import tableData from '../home/pipeline_add'

  export default {
    data () {
      return {
        tableData:[{
          type:'',
          name:'',
          env:''
        }],
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
        getUserList: [],
        addForm:{
          type: '',
          index:'',
          name:''
        },
        addFormRules:{
          type:[{require: true, message: '请输入', trigger: 'blur'}],
          index:[{require: true, message: '请输入', trigger: 'blur'}],
          name:[{require: true, message: '请输入', trigger: 'blur'}]
        }
      }
    },

    mounted() {
      this.pipelinelength()
      this.initPage()
      this.$refs.msg[0].findAllorder(this.activeName);
    },

    methods: {
      async resetForm(){
        const test = this.tableData
        console.log(test)
      },

      search () {
        console.log(this.tableData)
      },

      pipelinelength() {
        axios.get('/getPipelineItems').then(response => {
          while (response.data < 100) {
            return response.data.data
          }
        })
      },

      initPage() {
        getUserList().then(res => {
          if (res) {
            console.log('getUserListres', res.data.data)
            this.tableData = res.data.data
          }
        })
      },

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
      },

      addRow(addForm){
        this.$ref.addFormRef.validate(valid => {
          if (!valid) return this.get$message.warning('表单填写有误，请检查！')
          this.$message.success('添加成功！')
          console.log(addForm)
          this.$set(this.tableData, this.addForm.index, {type: this.addForm.type, index: this.addForm.index, name: this.addForm.name })
          this.addForm.type = ''
          this.addForm.index = ''
          this.addForm.name = ''
        })
      },
      handleClick(type, index) {
        console.log(type, index);
        this.$refs.msg[addForm.index].findAllorder(this.activeName);
      },
      addParamsSetting() {
        this.$store.state.tableData
      }
    },

    computed: {
      ...mapGetters([
        'signupStatus'
      ]),
      currentOrganizationId () {
        return this.$store.state.login.userinfo.organization.id
      },
    }
  }
</script>

<style lang="less">
  .create-project {
    .icon {
      cursor: pointer;
    }

    .el-dialog__headerbtn {
      font-size: 40px;
    }

    .el-dialog__body {
      padding: 5px 20px;
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
        width: 100%;
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

          .el-form {
            width: 100%;

            .el-form-item {
              margin-bottom: 5px;
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
      }
    }
  }
</style>
