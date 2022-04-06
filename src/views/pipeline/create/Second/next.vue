<template>
<div>
  <div class="projects-runtime-container">
    <div class="guide-container">
      <step :activeStep="2">
      </step>
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
        <div class="no-content">
          <img src="@/assets/editor_nodata.jpg"
               alt="">
          <p v-if="services.length === 0">暂无服务，点击 <el-button size="mini"
                                                             icon="el-icon-plus"
                                                             @click="createService()"
                                                             plain
                                                             circle>
          </el-button> 创建服务</p>
          <p v-else-if="service.service_name==='服务列表' && services.length >0">请在左侧选择需要编辑的服务</p>
          <p v-else-if="!service.service_name && services.length >0">请在左侧选择需要编辑的服务</p>
        </div>
        <div class="account-integrations cf-block__list">
          <div class="title">
            <h4>环境准备</h4>
            <el-alert v-if="envFailure.length > 0||timeOut"
                      type="warning">
              <template v-solt:title>
                环境正在准备中，可点击 “下一步” 或者
                <el-button type="text"
                           @click="jumpEnv">查看环境状态</el-button>
                <i v-if="jumpLoading"
                   class="el-icon-loading"></i>
              </template>
            </el-alert>
          </div>
          <div class="cf-block__item">
            <div class="account-box-item">
              <div class="account-box-item__info integration-card">
                <div class="integration-card__image">
                  <el-button v-if="envSuccess.length === 2"
                             type="success"
                             icon="el-icon-check"
                             circle></el-button>
                  <el-button v-else
                             icon="el-icon-loading"
                             circle></el-button>
                </div>
                <div class="integration-card__info">
                  <div v-for="(env,index) in envStatus"
                       :key="index"
                       class="integration-details">
                    <template v-if="env.env_name==='dev'">
                      <span class="env-name">
                        开发环境：{{projectName}}-dev
                      </span>
                      <span class="desc">，开发日常自测、业务联调</span>
                      <el-link v-if="env.err_message!==''"
                               type="warning">{{env.err_message}}</el-link>
                    </template>
                    <template v-if="env.env_name==='qa'"
                              class="env-item">
                      <span class="env-name">测试环境：{{projectName}}-qa
                      </span>
                      <span class="desc">，测试环境（自动化测试、业务验收）</span>
                      <el-link v-if="env.err_message!==''"
                               type="warning">{{env.err_message}}</el-link>
                    </template>

                  </div>
                </div>
              </div>
              <div class="account-box-item__controls">
              </div>
            </div>
          </div>
          <div class="title">
            <h4>工作流准备</h4>
            <el-alert v-if="pipeStatus.err_message"
                      :title="pipeStatus.err_message"
                      type="error">
            </el-alert>
          </div>
          <div class="cf-block__item">
            <div class="account-box-item">
              <div class="account-box-item__info integration-card">
                <div class="integration-card__image">
                  <el-button v-if="pipeStatus.status === 'success'"
                             type="success"
                             icon="el-icon-check"
                             circle></el-button>
                  <el-button v-else
                             icon="el-icon-loading"
                             circle></el-button>
                </div>
                <div class="integration-card__info">
                  <div class="integration-details">
                    开发工作流：{{projectName}}-workflow-dev，应用日常升级，用于开发自测和联调
                  </div>
                  <div class="integration-details">
                    测试工作流：{{projectName}}-workflow-qa，应用按需升级，用于自动化测试和业务验收
                  </div>
                  <div class="integration-details">
                    运维工作流：{{projectName}}-workflow-ops，业务按需发布，用于版本升级和业务上线
                  </div>
                </div>
              </div>
              <div class="account-box-item__controls">
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
      <div class="run-button">
      </div>
    </div>
  </div>
</div>
</template>
<script>
import axios from 'axios'
import step from '../common/step.vue'
// import { generateEnvAPI, generatePipeAPI } from '@api'
export default {
  components: {
    step
  },

  data() {
    return {
      dialogVisible: false,
      centerDialogVisible: false,
      lokiDialogTitle: false,
      jsonFileObj: {},
      dialogTitle: '',
      lokiLink: '',
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

  computed: {
    projectName () {
      return this.$route.params.project_name
    }
  },

  methods: {
    handleClick(color, name) {
      this.dialogTitle = name
      this.dialogVisible = true
    },
    checkLoki(color, name) {
      this.dialogTitle = name
      this.lokiDialogTitle = true
      // this.lokiLink = getLokiLink()
    },
    createService () {
      this.$refs.serviceTree.createService('platform')
    },
    readGuideItems() {
      axios.get('/getDescription').then((response) => {
        if(response.data){
          this.guideItems = response.data.data
        }
      })
    }
  },

  mounted() {
    this.readGuideItems()
  }
}
</script>

<style lang="less">
.projects-runtime-container {
  position: relative;
  flex: 1;
  overflow: auto;
  background-color: #f5f7f7;

  .page-title-container {
    display: flex;
    padding: 0 20px;

    h1 {
      width: 100%;
      color: #4c4c4c;
      font-weight: 300;
      text-align: center;
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
          width: 110px;
          padding: 8px;
          color: #fff;
          font-weight: 300;
          font-size: 18px;
          text-align: center;
          background: #3289e4;
        }

        .second {
          display: inline-block;
          color: #4c4c4c;
          font-size: 13px;
        }
      }
    }
  }
}

.controls__wrap {
  position: relative;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  margin: 0 15px;
  padding: 0 10px;
  background-color: #fff;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05);

  .controls__right {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    margin-right: 10px;
    -webkit-box-align: center;
    -ms-flex-align: center;

    .save-btn,
    .next-btn {
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

    .save-btn[disabled],
    .next-btn[disabled] {
      background-color: #9ac9f9;
      border: 1px solid #9ac9f9;
      cursor: not-allowed;
    }
  }
}

.el-card {
  box-shadow: 0px 1px 2px -2px rgba(0, 0, 0, 0.16),
  0px 3px 6px 0px rgba(0, 0, 0, 0.12), 0px 5px 12px 4px rgba(0, 0, 0, 0.09);
}

.el-card:hover {
  box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.08),
  0px 9px 28px 0px rgba(0, 0, 0, 0.05), 0px 12px 48px 16px rgba(0, 0, 0, 0.03);
  transform: translateY(-5px);
  color: yellowgreen;
  //border-top: #409EFF 1px solid;
  border: #409eff 1px solid;
}
.svg-middle {
  margin:0 auto;display:inline-block;
}
</style>
