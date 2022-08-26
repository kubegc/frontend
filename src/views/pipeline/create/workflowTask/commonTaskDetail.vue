<template>
  <div class="task-detail-container" ref="task-detail-container">
    <el-card class="box-card" :body-style="{ padding: '0px', margin: '15px 0 0 0' }">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="12">
            <div class="bg-purple">
              <el-row :gutter="0">
                <el-col :span="5">
                  <div class="status item-title">状态</div>
                </el-col>
                <el-col :span="4">
                  <div class>
                    <el-tag :type="statusTag(taskDetail.status)" size="small" close-transition></el-tag>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="0">
                <el-col :span="5">
                  <div class="item-title">创建者</div>
                </el-col>
                <el-col :span="4">
                  <div class="item-desc"></div>
                </el-col>
              </el-row>
              <el-row  :gutter="0">
                <el-col :span="5">
                  <div class="item-title">取消者</div>
                </el-col>
                <el-col :span="4">
                  <div class="item-desc"></div>
                </el-col>
              </el-row>
              <el-row :gutter="0">
                <el-col :span="5">
                  <div class="item-title">持续时间</div>
                </el-col>
                <el-col :span="4">
                  <div v-if="taskDetail.status!=='running'" class="item-desc">
                    {{ $utils.timeFormat(taskDetail.end_time -
                    taskDetail.start_time) }}
                  </div>
                  <div v-else class="item-desc">
                    <el-tooltip  content="本地系统时间和服务端可能存在不一致，请同步。" placement="top">
                      <i class="el-icon-warning" style="color: red;"></i>
                    </el-tooltip>
                  </div>
                </el-col>
              </el-row>
              <el-row v-if="showOperation()" :gutter="0">
                <el-col :span="5">
                  <div class="item-title operation">操作</div>
                </el-col>
                <el-col :span="10">
                  <div class="item-desc">
                    <el-tooltip
                      v-if="(taskDetail.status!=='running' && taskDetail.status !=='created') && taskDetail.status!=='passed'"
                      effect="dark"
                      content="失败重试"
                      placement="top"
                    >
                      <span @click="taskOperation('restart',taskDetail.task_id,taskDetail.pipeline_name)" class="start-build">失败重试</span>
                    </el-tooltip>
                    <el-tooltip v-if="taskDetail.status==='running' || taskDetail.status ==='created'" effect="dark" content="取消任务" placement="top">
                      <span @click="taskOperation('cancel',taskDetail.task_id,taskDetail.pipeline_name)" class="start-build">取消任务</span>
                    </el-tooltip>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!--end of basic info-->

    <el-card
      v-if="!$utils.isEmpty(buildStage)"
      class="box-card task-process"
      :body-style="{ padding: '0px', margin: '15px 0 0 0' }"
    >
      <div slot="header" class="clearfix">
        <span>构建</span>
        <div v-if="buildStage.status==='running'" class="loader">
          <div class="ball-scale-multiple">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      <el-alert v-if="buildStage.error" title="错误信息" :description="buildStage.error" type="error" close-text="知道了"></el-alert>
      <div class="text item">
        <el-row :gutter="0">
          <el-col :span="6">
            <div class="item-title">
              <i class="iconfont iconzhuangtai"></i> 构建状态
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item-desc">
              <a :class="buildOverallColor" href="#buildv3-log"></a>
            </div>
          </el-col>
          <el-col v-if="buildStage.status!=='running'" :span="6">
            <div class="item-title">
              <i class="iconfont iconshijian"></i> 持续时间
            </div>
          </el-col>
          <el-col v-if="buildStage.status!=='running'" :span="6">
          </el-col>
        </el-row>
        <template >
          <el-row :gutter="0" v-for="(build,index) in buildStage.sub_tasks.job_ctx.builds" :key="index">
            <el-col :span="6">
              <div class="item-title">
                <i class="iconfont icondaima"></i>
                代码库
              </div>
            </el-col>
            <el-col :span="6">
              <div class="item-desc"></div>
            </el-col>
            <el-col :span="6">
              <div class="item-title">
                <i class="iconfont iconinfo"></i> 代码信息
              </div>
            </el-col>
          </el-row>
        </template>
      </div>
    </el-card>

    <el-card
      id="buildv3-log"
      v-if="!$utils.isEmpty(buildStage)"
      class="box-card task-process"
      :body-style="{ padding: '0px', margin: '15px 0 0 0' }"
    >
      <div class="log-container">
        <div class="log-content">
          <el-collapse @change="getBuildLog">
            <el-collapse-item id="log-container" title="查看构建日志">
              <XtermLog v-if="showBuildLog" @mouseleave.native="leaveLog" :id="buildStage.sub_tasks.service_name" :logs="buildv3AnyLog"/>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-card>

    <!-- end of buildv3 -->
    <el-card
      class="box-card task-process"
      :body-style="{ padding: '0px', margin: '15px 0 0 0' }"
    >
      <el-alert v-if="extensionStage.sub_tasks && extensionStage.sub_tasks.error" title="错误信息" :description="extensionStage.sub_tasks.error" type="error" close-text="知道了"></el-alert>
      <div slot="header" class="clearfix">
        <span>扩展</span>
        <div v-if="extensionStage.status==='running'" class="loader">
          <div class="ball-scale-multiple">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      <div class="text item">
        <el-row :gutter="0">
          <el-col :span="6">
            <div class="item-title">
              <i class="iconfont iconzhuangtai"></i> 状态
            </div>
          </el-col>
          <el-col :span="6">
            <div
              class="item-desc"
              :cla
              ss="colorTranslation(extensionStage.status,'pipeline','task')"
            ></div>
          </el-col>
          <el-col v-if="extensionStage.status!=='running'" :span="6">
            <div class="item-title">
              <i class="iconfont iconshijian"></i> 持续时间
            </div>
          </el-col>
          <el-col v-if="extensionStage.status!=='running'" :span="6">
            <span class="item-desc">
            </span>
          </el-col>
        </el-row>

        <el-row :gutter="0">
          <el-col :span="6">
            <div class="item-title">
              <i class="iconfont iconinfo"></i> 体验码
            </div>
          </el-col>
          <el-col :span="6">
            <!-- <QrcodeVue v-if="codeURL" :value="codeURL" class="item-desc"></QrcodeVue> -->
            <el-link v-if="codeURL" type="primary" :href="codeURL" target="_blank" rel="noopener noreferrer">{{codeURL}}</el-link>
            <div v-else class="item-desc">N/A</div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      taskDetail: {},
      buildStage: {},
      extensionStage: {},
      switchScroll: true,
      scrollTop: 0,
      buildv3AnyLog: [],
      wsBuildDataBuffer: [],
      showBuildLog: false,
      durationSet: {}
    }
  },
  computed: {

  },
  methods: {
    showOperation () {
      if (
        this.taskDetail.status !== 'running' &&
        this.taskDetail.status !== 'passed'
      ) {
        return true
      }
      if (this.taskDetail.status === 'running') {
        return true
      }
      return false
    },
    taskDuration (taskID, started) {
      const refresh = () => {
        const duration = Math.floor(Date.now() / 1000) - started
        this.$set(this.durationSet, taskID, duration)
      }
      setInterval(refresh, 1000)
      return ''
    },
    getBuildLog () {
      this.showBuildLog = true
    }
  },
  created () {

  },
  watch: {

  },
  components: {
  }
}
</script>

<style lang="less">
  .issue-popper {
    display: inline-block;
    font-size: 14px;

    p {
      margin: 0.5em 0;
    }

    .issue-url {
      color: #0066ff;
      cursor: pointer;
    }
  }

  .task-detail-container {
    position: relative;
    flex: 1;
    padding: 0 20px;
    overflow: auto;
    font-size: 13px;

    .el-breadcrumb {
      font-size: 16px;
      line-height: 1.35;

      .el-breadcrumb__item__inner a:hover,
      .el-breadcrumb__item__inner:hover {
        color: #0066ff;
        cursor: pointer;
      }
    }

    .text {
      font-size: 14px;
    }

    .item {
      padding: 10px 0;
      padding-left: 1px;

      .icon-color {
        color: #9ea3a9;
        cursor: pointer;

        &:hover {
          color: #0066ff;
        }
      }

      .icon-color-cancel {
        color: #ff4949;
        cursor: pointer;
      }

      .status {
        line-height: 24px;
      }
    }

    .clearfix::before,
    .clearfix::after {
      display: table;
      content: '';
    }

    .clearfix {
      span {
        color: #303133;
        font-size: 16px;
        line-height: 20px;
      }
    }

    .clearfix::after {
      clear: both;
    }

    .box-card {
      background-color: #fff;

      .item-title {
        color: #8d9199;
      }

      .item-desc {
        .start-build,
        .edit-pipeline {
          color: #0066ff;
          font-size: 13px;
          cursor: pointer;
        }
      }

      .color-passed {
        color: #6ac73c;
        font-weight: 500;
      }

      .color-failed {
        color: #ff1949;
        font-weight: 500;
      }

      .color-cancelled {
        color: #909399;
        font-weight: 500;
      }

      .color-timeout {
        color: #e6a23c;
        font-weight: 500;
      }

      .color-running {
        color: #0066ff;
        font-weight: 500;
      }

      .color-created {
        color: #cdb62c;
        font-weight: 500;
      }

      .color-notrunning {
        color: #303133;
        font-weight: 500;
      }

      .issue-tag {
        margin-right: 5px;
        margin-bottom: 5px;
        cursor: pointer;
      }

      .deploy_env {
        color: #0066ff;
      }

      .error-color {
        color: #fa6464;
      }

      .show-log {
        font-size: 1.33rem;
        cursor: pointer;

        &:hover {
          color: #0066ff;
        }
      }

      .show-test-result {
        color: #0066ff;
        cursor: pointer;
      }

      .show-log-title {
        line-height: 17px;
      }

      .operation {
        line-height: 16px;
      }
    }

    .box-card,
    .task-process {
      margin-top: 15px;
      border: none;
      box-shadow: none;
    }

    .task-process {
      width: 100%;
    }

    .el-card__header {
      padding-left: 0;
    }

    .el-row {
      margin-bottom: 15px;

      &:last-child {
        margin-bottom: 0;
      }
    }
    // .link {
    //   a {
    //     color: @themeColor;
    //     cursor: pointer;
    //   }
    // }
    a.item-desc {
      color: #0066ff;
      cursor: pointer;
    }

    .loader {
      display: inline-block;
      width: 25px;
      height: 25px;
      vertical-align: middle;

      .ball-scale-multiple {
        transform: none;

        div {
          top: 0;
          left: 0;
          width: 25px;
          height: 25px;
          background-color: #0066ff;
        }
      }
    }

    .log-container {
      padding-bottom: 15px;

      .log-content {
        .xterm {
          padding: 15px 10px;
        }

        .el-collapse-item__content {
          padding-bottom: 0;
        }

        .el-collapse-item__arrow {
          margin-right: 16px;
        }

        &.test {
          margin-bottom: 80px;
        }
      }
    }

    .pointer {
      cursor: pointer;
    }
  }
</style>
