<template>
  <div class="projects-delivery-container">
    <div class="guide-container">
      <step :activeStep="3">
      </step>
      <div class="current-step-container">
        <div class="title-container">
          <span class="first">第四步</span>
          <span class="second">运行工作流触发服务的自动化交付</span>
        </div>
        <div class="account-integrations cf-block__list">
          <el-table v-loading="loading"
                    :data="mapWorkflows"
                    style="width: 100%;">
            <el-table-column label="工作流名称">
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
        <router-link >
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
import step from './common/step.vue'
export default {
  data () {
    return {
      loading: true,
      workflow: {},
      taskDialogVisible: false,
      mapWorkflows: []
    }
  },
  methods: {
    runCurrentTask (scope) {
      this.workflow = scope
      this.taskDialogVisible = true
    },
  },
  computed: {
    projectName () {
      return this.$route.params.project_name
    }
  },
  components: { step },
}
</script>

<style lang="less">
.projects-delivery-container {
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
          color: #4c4c4c;
          font-size: 13px;
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

        .env-name {
          color: #1989fa;
        }
      }
    }

    .other-operation {
      margin: 50px 30px 0 30px;

      .pipelines-aside-help__step-header {
        width: 100%;
        margin: 0;
        margin: 10px 0;
        color: #000;
        font-weight: bold;
        font-size: 14px;
        text-transform: uppercase;
      }

      .pipelines-aside-help__step-list {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: column;
        flex-direction: column;
        flex-shrink: 0;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        margin: 10px 0;
        padding: 0;
        list-style: none;
        -webkit-box-pack: start;
        -ms-flex-pack: start;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-negative: 0;

        .pipelines-aside-help__step-header {
          width: 100%;
          margin: 0;
          margin: 10px 0;
          color: #000;
          font-weight: bold;
          font-size: 12px;
          text-transform: uppercase;
        }

        .pipelines-aside-help__step-list-item {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          width: 100%;
          margin-bottom: 8px;
          -webkit-box-align: start;
          -ms-flex-align: start;
          -webkit-box-pack: start;
          -ms-flex-pack: start;

          ul {
            padding-left: 15px;
          }

          ul > li {
            color: #606266;
          }

          .pipelines-aside-help__step-list-item-counter {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            margin-right: 13px;
            color: #fff;
            font-weight: bold;
            font-size: 13px;
            background-color: #9b51e0;
            border-radius: 50%;
            -webkit-box-align: center;
            -ms-flex-align: center;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
          }

          .pipelines-aside-help__step-list-item-text {
            -ms-flex: 1;
            flex: 1;
            margin: 0;
            color: #000;
            font-size: 13px;
            line-height: 24px;
            -webkit-box-flex: 1;
          }

          .pipelines-aside-help__step-list-item-link,
          .pipelines-aside-help__step-list-item-link:hover,
          .pipelines-aside-help__step-list-item-link:focus,
          .pipelines-aside-help__step-list-item-link:active {
            color: #518ff6;
            text-decoration: none;

            .icon {
              margin-right: 5px;
            }

            .pipelines-aside-help__step-list-item-link-text {
              font-size: 12px;
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

    > * {
      margin-right: 10px;
    }

    .controls__right {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      align-items: center;
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
