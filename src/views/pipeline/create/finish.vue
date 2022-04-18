<template>
  <div class="projects-runtime-container">
    <div class="guide-container">
      <step :activeStep="3">
      </step>
      <div class="current-step-container">
        <div class="title-container">
          <span class="first">第四步</span>
          <div v-for="row in guideItems.rows"
               :key="row.index"
               :gutter="guideItems.gutter" class="second">
            <div v-for="item in row.items"
                 :key="item.index"
                 :span="item.span"
                 :title="item.description"><div v-if="item.type == 'span4'">{{item.description}}</div></div>
          </div>
        </div>
        <div class="account-integrations cf-block__list">
          <el-table v-loading="loading"
                    :data="mapWorkflows"
                    style="width: 100%;">
            <el-table-column label="工作流名称">
              <template slot-scope="scope">
                <span style="margin-left: 10px;">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column width="200px"
                             label="环境信息">
            </el-table-column>
            <el-table-column width="200px"
                             label="包含步骤">
              <template slot-scope="scope">
                <span>
                  <span>
                    <el-tag size="small">构建部署</el-tag>
                    <span class="step-arrow"><i class="el-icon-right"></i></span>
                  </span>
                  <span>
                    <el-tag size="small">交付物部署</el-tag>
                    <span class="step-arrow"><i class="el-icon-right"></i></span>
                  </span>
                  <span>
                    <el-tag size="small">测试</el-tag>
                    <span class="step-arrow"><i class="el-icon-right"></i></span>
                  </span>
                  <el-tag size="small">分发</el-tag>
                </span>
              </template>
            </el-table-column>
            <el-table-column width="150px"
                             label="更新信息（时间/操作人）">
            </el-table-column>
            <el-table-column width="120px"
                             label="操作">
              <template slot-scope="scope">
                <el-button type="success"
                           size="mini"
                           round
                           @click="runCurrentTask(scope.row)"
                           plain>点击运行</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <div class="controls__wrap">
      <div class="controls__right">
        <router-link :to="'/test/test2/test3'">
          <button type="primary"
                    size="small"
                    class="save-btn"
                    :disabled="loading"
                    plain>完成</button>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
// import bus from '@utils/event_bus'
import step from './common/step'
import axios from 'axios'
// import runWorkflow from '../../pipeline/common/run_workflow.vue'
// import { getProjectIngressAPI } from '@api'
export default {
  components: {
    step
  },
  data () {
    return {
      loading: true,
      workflow: {},
      taskDialogVisible: false,
      mapWorkflows: [],
      guideItems:[]
    }
  },

  mounted() {
    this.readGuideItems()
  },

  methods: {
    readGuideItems() {
      axios.get('/getDescription').then((response) => {
        if(response.data){
          this.guideItems = response.data.data
        }
      })
    }
  },

  computed: {
    projectName () {
      return this.$route.params.project_name
    }
  },

  created () {
    this.getWorkflows()
    bus.$emit('set-topbar-title', { title: '', breadcrumb: [{ title: '项目', url: '/v1/projects' }, { title: this.projectName, url: '' }] })
    bus.$emit('set-sub-sidebar-title', {
      title: '',
      routerList: []
    })
  },

  onboardingStatus: 0
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
    margin-bottom: 240px;

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

      .account-integrations {
        .el-alert--warning {
          .el-button--text {
            color: inherit;
          }
        }
      }

      .cf-block__list {
        -ms-flex: 1;
        flex: 1;
        margin-top: 15px;
        padding: 0 30px;
        overflow-y: auto;
        background-color: inherit;
        -webkit-box-flex: 1;

        .title {
          h4 {
            margin: 10px 0;
            color: #4c4c4c;
            font-weight: 400;
            text-decoration: underline;
          }

          a {
            color: inherit;
            text-decoration-color: inherit;
          }
        }

        .cf-block__item {
          min-height: 102px;

          .account-box-item {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 20px 30px;
            background-color: #fff;
            -webkit-box-shadow: 0 3px 2px 1px rgba(0, 0, 0, 0.05);
            box-shadow: 0 3px 2px 1px rgba(0, 0, 0, 0.05);
            filter: progid:dximagetransform.microsoft.dropshadow(OffX=0, OffY=3px, Color='#0D000000');
            -webkit-box-align: center;
            -ms-flex-align: center;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;

            .integration-card {
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              -webkit-box-align: center;
              -ms-flex-align: center;
              -webkit-box-pack: start;
              -ms-flex-pack: start;

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
              }
            }

            .integration-card > * {
              -ms-flex: 0 0 auto;
              flex: 0 0 auto;
              -webkit-box-flex: 0;
            }
          }
        }
      }
    }
  }

  .alert {
    display: flex;
    padding: 0 25px;

    .el-alert {
      margin-bottom: 35px;

      .el-alert__title {
        font-size: 15px;
      }
    }
  }

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

      .save-btn {
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

      .save-btn[disabled] {
        background-color: #9ac9f9;
        border: 1px solid #9ac9f9;
        cursor: not-allowed;
      }
    }
  }
}
</style>
