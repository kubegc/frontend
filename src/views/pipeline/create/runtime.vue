<template>
  <div class="projects-runtime-container">
    <div class="guide-container">
      <step :activeStep="2" />
      <div class="current-step-container">
        <div class="title-container">
          <span class="first">第三步</span>
          <div v-for="row in guideItems.rows"
               :key="row.index"
               :gutter="guideItems.gutter" class="second">
            <div v-for="item in row.items"
                 :key="item.index"
                 :span="item.span"
                 :title="item.description"><div v-if="item.type == 'span3'">{{item.description}}</div></div>
          </div>
        </div>
        <div class="info-container block-list">
          <div class="title">
            <h4>环境准备</h4>
            <el-alert  type="warning" show-icon>
              <template v-slot:title>
                环境正在准备中，可点击 「下一步」 或者 <span class="view-env-btn" >查看环境状态</span>
                <i class="el-icon-loading"></i>
              </template>
            </el-alert>
          </div>
          <div class="info-block">
            <div class="info-block-item">
              <div class="info-block-item-card">
                <div class="integration-card__image">
                  <el-button
                             type="success"
                             icon="el-icon-check"
                             circle></el-button>
                </div>
                <div class="integration-card__info">
                  <div v-for="(env,index) in envStatus"
                       :key="index"
                       class="integration-details">
                    <template v-if="env.env_name==='dev'">
                      <span class="env-name">
                        开发环境：{{$store.state.tableData.name}}-dev
                      </span>
                      <span class="desc">，开发日常自测、业务联调</span>
<!--                      <el-link v-if="env.err_message!==''"-->
<!--                               type="warning">{{env.err_message}}</el-link>-->
                    </template>
                    <template v-if="env.env_name==='qa'"
                              class="env-item">
                      <span class="env-name">测试环境：{{$store.state.tableData.name}}-qa
                      </span>
                      <span class="desc">，自动化测试、业务验收</span>
<!--                      <el-link v-if="env.err_message!==''"-->
<!--                               type="warning">{{env.err_message}}</el-link>-->
                    </template>

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="title">
            <h4>工作流准备</h4>
          </div>
          <div class="info-block">
            <div class="info-block-item">
              <div class="info-block-item-card">
                <div class="integration-card__image">
                  <el-button type="success"
                             icon="el-icon-check"
                             circle></el-button>
                </div>
                <div class="integration-card__info">
                  <div class="integration-details">
                    开发工作流：{{$store.state.tableData.name}}-workflow-dev，应用日常升级，用于开发自测和联调
                  </div>
                  <div class="integration-details">
                    测试工作流：{{$store.state.tableData.name}}-workflow-qa，应用按需升级，用于自动化测试和业务验收
                  </div>
                  <div class="integration-details">
                    运维工作流：{{$store.state.tableData.name}}-ops-workflow，业务按需发布，用于版本升级和业务上线
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="controls__wrap">
      <div class="controls__right">
        <router-link :to="`/t/t1/t6`">
          <button type="primary"
                  class="save-btn"
                  plain>下一步</button>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
// import bus from '@utils/event_bus'
import step from './common/step.vue'
import axios from 'axios'
// import { generateEnvAPI, generatePipeAPI } from '@api'
export default {
  data () {
    return {
      envStatus: [{ env_name: 'dev' }, { env_name: 'qa' }],
      pipeStatus: {},
      getResult: false,
      envTimer: 0,
      pipeTimer: 0,
      secondCount: 0,
      timeOut: 0,
      jumpLoading: false,
      guideItems:[]
    }
  },
  methods: {
    readGuideItems() {
      axios.get('/getDescription').then((response) => {
        if(response.data){
          this.guideItems = response.data.data
        }
      })
    },
    viewEnvStatus () {
      this.$confirm('跳出后进入项目将不再进入向导流程', '确认跳出项目初始化向导？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.exitLoading = true
        this.saveOnboardingStatus(this.projectName, 0).then((res) => {
          this.$router.push(`/v1/projects/detail/${this.projectName}/envs`)
        }).catch(() => {
          this.exitLoading = false
        })
      }).catch(() => {
        this.$message.info('取消跳转')
      })
    },
    // generateEnv (projectName, envType) {
    //   const getEnv = new Promise((resolve, reject) => {
    //     generateEnvAPI(projectName, envType).then((res) => {
    //       this.$set(this, 'envStatus', res)
    //       resolve(res)
    //     }).catch((err) => {
    //       console.log(err)
    //     })
    //   })
    //   getEnv.then((env_res) => {
    //     const successResult = env_res.filter(env => env.status === 'Running')
    //     const failureResult = env_res.filter(env => (env.err_message && env.err_message !== ''))
    //     if (successResult.length === 2) {
    //       clearInterval(this.envTimer)
    //       this.timeOut = false
    //       this.getResult = true
    //     }
    //     if (failureResult.length >= 1) {
    //       clearInterval(this.envTimer)
    //       this.timeOut = false
    //       this.getResult = true
    //     }
    //     if (this.secondCount === 60) {
    //       clearInterval(this.envTimer)
    //       this.timeOut = true
    //       this.getResult = true
    //     }
    //     this.workflowTimer = setInterval(() => {
    //       this.generateWorkflow(this.projectName)
    //     }, 1000)
    //   })
    // },
    // generateWorkflow (projectName) {
    //   if (this.workflowStatus.status === 'success') {
    //     clearInterval(this.workflowTimer)
    //   } else {
    //     generateWorkflowAPI(projectName).then((res) => {
    //       this.$set(this, 'workflowStatus', res)
    //     })
    //   }
    // }
  },
  computed: {
    // projectName () {
    //   return this.$route.params.project_name
    // },
    // envSuccess () {
    //   const result = this.envStatus.filter(env => env.status === 'Running')
    //   return result
    // },
    // envType () {
    //   return this.$route.query.serviceType
    // },
    // envFailure () {
    //   const result = this.envStatus.filter(env => (env.err_message && env.err_message !== ''))
    //   return result
    // }
  },
  created () {
    // if (this.envTimer) {
    //   clearInterval(this.envTimer)
    // } else {
    //   this.envTimer = setInterval(() => {
    //     this.secondCount++
    //     this.generateEnv(this.projectName, this.envType)
    //   }, 1000)
    // };
    // bus.$emit('set-topbar-title', { title: '', breadcrumb: [{ title: '项目', url: '/v1/projects' }, { title: this.projectName, isProjectName: true, url: '' }] })
  },
  // beforeDestroy () {
  //   clearInterval(this.envTimer)
  //   clearInterval(this.workflowTimer)
  // },
  components: {
    step
  },
  mounted() {
    this.readGuideItems()
  },
  onboardingStatus: 3
}
</script>

<style lang="less">
  .projects-runtime-container {
    position: relative;
    flex: 1;
    overflow: auto;
    background-color: #f6f6f6;

    .controls__wrap {
      position: relative;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      padding: 0 20px;
      background-color: #fff;

      & > * {
        margin-right: 10px;
      }

      .controls__right {
        display: flex;
        align-items: center;

        a {
          margin-right: 15px;
        }
      }

      .save-btn {
        margin-bottom: 10px;
        margin-right: 15px;
        padding: 10px 17px;
        color: #fff;
        font-weight: bold;
        font-size: 13px;
        text-decoration: none;
        background-color: #1989fa;
        border: 1px solid #1989fa;
        cursor: pointer;
        transition: background-color 300ms, color 300ms, border 300ms;
      }
    }

    .guide-container {
      min-height: calc(~"100% - 70px");
      margin-top: 10px;

      .current-step-container {
        .title-container {
          margin-left: 20px;

          .first {
            display: inline-block;
            width: 130px;
            padding: 8px;
            color: #fff;
            font-weight: 300;
            font-size: 16px;
            text-align: center;
            background: #0066ff;
          }

          .second {
            display: inline-block;
            color: #4c4c4c;
            font-size: 13px;
          }
        }

        .info-container {
          .el-alert--warning {
            padding-left: 8px;
          }

          .view-env-btn {
            color: #0066ff;
            cursor: pointer;
          }
        }

        .block-list {
          flex: 1;
          margin-top: 15px;
          padding: 0 30px;
          overflow-y: auto;
          background-color: inherit;

          .title {
            h4 {
              margin: 10px 0;
              color: #4c4c4c;
              font-weight: 400;
            }

            a {
              color: inherit;
              text-decoration-color: inherit;
            }
          }

          .info-block {
            min-height: 102px;

            .info-block-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 10px;
              padding: 20px 30px;
              background-color: #fff;
              border-radius: 6px;

              .info-block-item-card {
                display: flex;
                align-items: center;
                justify-content: flex-start;

                .integration-card__image {
                  width: 64px;

                  .el-button.is-circle {
                    padding: 6px;
                    border-radius: 50%;
                  }
                }

                .cf-sub-title {
                  color: #2f2f2f;
                  font-weight: bold;
                  font-size: 16px;
                  text-align: left;
                }

                .integration-details {
                  margin-bottom: 5px;
                  color: #4c4c4c;
                  font-size: 14px;
                  line-height: 20px;

                  .env-name {
                    display: inline-block;
                  }

                  .desc {
                    display: inline-block;
                    width: 250px;
                  }

                  &:last-child {
                    margin-bottom: 0;
                  }
                }
              }

              .info-block-item-card > * {
                flex: 0 0 auto;
              }
            }
          }
        }
      }
    }
  }
</style>
