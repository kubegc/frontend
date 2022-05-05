<template>
  <div class="task-detail-build">
    <el-card class="box-card task-process"
             :body-style="{padding: '8px 20px', margin: '5px 0 0 0' }">
      <div slot="header"
           class="clearfix subtask-header">
        <span>构建</span>
        <div class="loader">
          <div class="ball-scale-multiple">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      <div class="error-wrapper">
        <el-alert title="错误信息"
                  :description="buildv2.error"
                  type="error"
                  close-text="知道了">
        </el-alert>
      </div>
      <div class="text item">
        <el-row :gutter="0">
          <el-col :span="6">
            <div class="grid-content item-title">
              <i class="iconfont iconzhuangtai"></i> 构建状态
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content item-desc">
              <a :class="buildOverallColor"
                 href="#buildv2-log">{{buildv2.status?buildOverallStatusZh:"未运行"}}</a>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content item-title">
              <i class="iconfont iconshijian"></i> 持续时间
            </div>
          </el-col>
          <el-col :span="6">
            <span class="item-desc">{{$utils.timeFormat(buildv2.end_time - buildv2.start_time)}}</span>
          </el-col>
        </el-row>
        <template >
          <el-row :gutter="0"
                  v-for="(build,index) in buildv2.job_ctx.builds"
                  :key="index">
            <el-col :span="6">
              <div class="grid-content item-title">
                <i class="iconfont icondaima"></i> 代码库({{build.source}})
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content item-desc">{{build.repo_name}}
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content item-title">
                <i class="iconfont iconinfo"></i> 构建信息
              </div>
            </el-col>
            <el-col :span="6">
              <el-tooltip :content="build.source==='gerrit'?`暂不支持在该类型上查看 Release`:`在 ${build.source} 上查看 Release`"
                          placement="top"
                          effect="dark">
                <span v-if="build.tag"
                      class="link">
                  <a :href="`${build.address}/${build.repo_owner}/${build.repo_name}/tags/${build.tag}`"
                     target="_blank">{{build.tag}}
                  </a>
                  <span v-if="build.source==='gerrit'">{{build.tag}}</span>
                </span>
              </el-tooltip>
              <el-tooltip :content="build.source==='gerrit'||build.source==='codehub'?`暂不支持在该类型上查看 Branch`:`在 ${build.source} 上查看 Branch`"
                          placement="top"
                          effect="dark">
                <span class="link">
                  <a v-if="build.source==='github'||build.source==='gitlab'"
                     :href="`${build.address}/${build.repo_owner}/${build.repo_name}/tree/${build.branch}`"
                     target="_blank">{{"Branch-"+build.branch}}
                  </a>
                  <span v-if="build.source==='gerrit'">{{"Branch-"+build.branch}}
                  </span>
                  <a v-if="!build.source"
                     :href="`${build.address}/${build.repo_owner}/${build.repo_name}/tree/${build.branch}`"
                     target="_blank">{{"Branch-"+build.branch}}
                  </a>
                  <span v-else-if="build.source ==='codehub'">{{"Branch-"+build.branch}}</span>
                </span>
              </el-tooltip>
              <el-tooltip :content="build.source==='gerrit'||build.source==='codehub'?`暂不支持在该类型上查看 Commit`:`在 ${build.source} 上查看 Commit`"
                          placement="top"
                          effect="dark">
                <span v-if="build.commit_id"
                      class="link">
                  <a v-if="build.source==='github'||build.source==='gitlab'"
                     :href="`${build.address}/${build.repo_owner}/${build.repo_name}/commit/${build.commit_id}`"
                     target="_blank">{{"Commit-"+build.commit_id.substring(0, 10)}}
                  </a>
                  <span
                        v-else-if="build.source==='gerrit'&& (!build.pr || build.pr===0)">{{'Commit-'+build.commit_id.substring(0, 8)}}</span>
                  <span v-else-if="build.source==='gerrit'&& build.pr && build.pr!==0"
                        class="link">
                    <a :href="`${build.address}/c/${build.repo_name}/+/${build.pr}`"
                       target="_blank">{{`Change-${build.pr}`}}
                    </a>
                    {{build.commit_id.substring(0, 8)}}
                  </span>
                  <span v-else-if="build.source==='codehub'">{{build.commit_id.substring(0, 8)}}</span>
                </span>
              </el-tooltip>
            </el-col>
          </el-row>
        </template>
        <el-row :gutter="0">
          <el-col :span="6">
            <div class="grid-content item-title">
              <i class="iconfont iconfuwu"></i> 服务名称
            </div>
          </el-col>
          <el-col :span="6">
            <span class="item-desc">{{buildv2.service_name}}</span>
          </el-col>
          <el-col v-if="serviceType!=='pm'"
                  :span="6">
            <div class="grid-content item-title">
              <i class="iconfont iconSliceCopy"></i> 镜像信息
            </div>
          </el-col>
          <el-col v-if="serviceType!=='pm' && buildv2.job_ctx"
                  :span="6">
            <el-tooltip effect="dark"
                        :content="buildv2.job_ctx.image"
                        placement="top">
              <span class="item-desc">{{buildv2.job_ctx.image.split('/').pop()}}</span>
            </el-tooltip>
          </el-col>
          <el-col v-if="buildv2.type=='jenkins_build' && buildv2.image"
                  :span="6">
            <el-tooltip effect="dark"
                        :content="buildv2.image"
                        placement="top">
              <span class="item-desc">{{buildv2.image.split('/').pop()}}</span>
            </el-tooltip>
          </el-col>
          <el-col v-if="serviceType==='pm'"
                  :span="6">
            <div class="grid-content item-title">
              <i class="iconfont iconbaoguanli"></i> 打包信息
            </div>
          </el-col>
          <el-col v-if="serviceType==='pm' && buildv2.job_ctx"
                  :span="6">
            <span class="item-desc">{{buildv2.job_ctx.package_file}}</span>
          </el-col>
        </el-row>
        <el-row v-if="!$utils.isEmpty(buildv2) && buildv2.job_ctx && buildv2.job_ctx.upload_pkg"
                :gutter="0">
          <el-col :span="6">
            <div class="grid-content item-title">
              <i class="iconfont iconbaoguanli"></i> 打包信息
            </div>
          </el-col>
          <el-col :span="6">
            <span class="item-desc">{{buildv2.job_ctx.package_file}}</span>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card id="buildv2-log"
             v-if="!$utils.isEmpty(buildv2)&&buildv2.enabled"
             class="box-card task-process"
             :body-style="{padding:'8px 20px',margin: '5px 0 0 0' }">
      <div class="log-container">
        <div class="log-content">
          <xterm-log :id="buildv2.service_name"
                     @mouseleave.native="leaveLog"
                     :logs="buildv2AnyLog"></xterm-log>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
// import { getWorkflowHistoryBuildLogAPI } from '@api'

export default {
  data () {
    return {
      buildv2AnyLog: [],
      wsBuildDataBuffer: [],
      buildLogStarted: true
    }
  },
  computed: {
    build_running () {
      return this.buildv2 && this.buildv2.status === 'running'
    },
    build_done () {
      return this.isSubTaskDone(this.buildv2)
    },
    docker_build_running () {
      return this.docker_build && this.docker_build.status === 'running'
    },

    buildOverallStatus () {
      return this.$utils.calcOverallBuildStatus(this.buildv2, this.docker_build)
    },
    buildOverallStatusZh () {
      return this.$translate.translateTaskStatus(this.buildOverallStatus)
    },
    buildOverallColor () {
      return this.$translate.calcTaskStatusColor(this.buildOverallStatus)
    },
    serviceType () {
      return this.buildv2.service_type
    },
    envName () {
      return this.buildv2.env_name
    }
  },
  watch: {
    build_running (val, oldVal) {
      if (!oldVal && val && this.buildLogStarted) {
        this.openBuildLog('buildv2')
      }
      if (oldVal && !val) {
        this.killLog('buildv2')
      }
    },
    docker_build_running (val, oldVal) {
      if (!oldVal && val && this.buildLogStarted) {
        this.openBuildLog('docker_build')
      }
      if (oldVal && !val) {
        this.killLog('docker_build')
      }
    }
  },
  methods: {
    getBuildv2Log () {
      this.buildLogStarted = true
    },
    leaveLog () {
      const el = document.querySelector('.workflow-task-detail').style
      el.overflow = 'auto'
    },
    getHistoryBuildLog () {
      let type = 'buildv2'
      if (this.buildv2.type === 'jenkins_build') {
        type = 'jenkins_build'
      }
      return getWorkflowHistoryBuildLogAPI(this.pipelineName, this.taskID, this.serviceName, type).then(
        response => {
          this.buildv2AnyLog = (response.split('\n')).map(element => {
            return element + '\n'
          })
        }
      )
    }
  },
  beforeDestroy () {
    this.killLog('buildv2')
    this.killLog('docker_build')
  },
  mounted () {
    if (this.build_running) {
      if (this.buildv2.type === 'jenkins_build') {
        this.openBuildLog('jenkins_build')
      } else {
        this.openBuildLog('buildv2')
      }
    } else {
      if (this.build_done) {
        if (this.docker_build_running) {
          this.getHistoryBuildLog().then(() => {
            this.openBuildLog('docker_build')
          })
        } else {
          this.getHistoryBuildLog()
        }
      }
    }
  },
  mixins: [mixin]
}
</script>

<style lang="less">
.xterm {
  padding: 15px 10px;

  .xterm-viewport {
    border-radius: 5px;
  }
}

.workflow-or-pipeline-task-detail {
  .box-card,
  .task-process {
    width: 100%;
    margin-top: 15px;
    border: none;
    box-shadow: none !important;
  }

  .clearfix::before,
  .clearfix::after {
    display: table;
    content: '';
  }

  .clearfix::after {
    clear: both;
  }

  .task-process {
    padding: 0 40px;
    background-color: #fff;

    .item-title {
      color: #8d9199;
    }

    .item-desc {
      .start-build,
      .edit-pipeline {
        color: #1989fa;
        font-size: 13px;
        cursor: pointer;
      }
    }

    .issue-tag {
      margin-right: 5px;
      margin-bottom: 5px;
      cursor: pointer;
    }

    .deploy_env {
      color: #1989fa;
    }

    .error-color {
      color: #fa6464;
    }

    .show-log {
      font-size: 1.33rem;
      cursor: pointer;

      &:hover {
        color: #1989fa;
      }
    }

    .show-log-title {
      line-height: 17px;
    }

    .operation {
      line-height: 16px;
    }

    .error-wrapper {
      .el-alert {
        margin-bottom: 20px;
      }
    }
  }

  .subtask-header {
    span {
      color: #999;
      font-size: 16px;
      line-height: 20px;
    }
  }

  .el-row {
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .link {
    a {
      color: #1989fa;
      cursor: pointer;
    }
  }

  .show-test-result {
    color: #1989fa;
    cursor: pointer;
  }

  .loader {
    display: inline-block;

    /* background: black; */
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
        background-color: #1989fa;
      }
    }
  }

  .log-container {
    padding-bottom: 15px;

    .process-name {
      margin-left: 10px;
    }

    .process-name.failed {
      color: #ff4949;
    }

    .process-time {
      float: right;
      margin-right: 15px;
      font-weight: 300;
    }

    .log-header {
      margin: 0;
      padding: 1em 0;
      text-align: right;
      background-color: #dfe5ec;
    }

    .log-content {
      .el-collapse-item__content {
        padding-bottom: 0;
      }

      .el-collapse-item__arrow {
        margin-right: 16px;
      }

      pre {
        clear: left;
        min-height: 42px;
        margin-top: 0;
        margin-bottom: 0;
        padding: 15px 10px;
        padding-top: 8px;
        color: #f1f1f1;
        font-size: 12px;
        font-family: Monaco, monospace;
        line-height: 18px;
        white-space: pre-wrap;
        word-wrap: break-word;
        background-color: #222;
        transform: translateZ(0); //trig GPU
        counter-reset: line-numbering;

        p {
          min-height: 16px;
          margin: 0;
          padding: 0 15px 0 16px;
          cursor: pointer;

          &:hover {
            background-color: #444;
          }
        }
      }
    }
  }

  .ansi {
    .black {
      color: #4e4e4e;
    }

    .black.bold {
      color: #7c7c7c;
    }

    .red {
      color: #f55;
    }

    .red.bold {
      color: #ff9b93;
    }

    .green {
      color: #1989fa;
    }

    .green.bold {
      color: #b1fd79;
    }

    .yellow {
      color: #f1fa8c;
    }

    .yellow.bold {
      color: #f1fa8c;
    }

    .blue {
      color: #8be9fd;
    }

    .blue.bold {
      color: #b5dcfe;
    }

    .magenta {
      color: #ff73fd;
    }

    .magenta.bold {
      color: #ff9cfe;
    }

    .cyan {
      color: #5ff;
    }

    .white {
      color: #eee;
    }

    .white.bold {
      color: #fff;
    }

    .grey {
      color: #969696;
    }

    .bg-black {
      background-color: #4e4e4e;
    }

    .bg-red {
      background-color: #ff6c60;
    }

    .bg-green {
      background-color: #0a0;
    }

    .bg-yellow {
      background-color: #ffffb6;
    }

    .bg-blue {
      background-color: #96cbfe;
    }

    .bg-magenta {
      background-color: #ff73fd;
    }

    .bg-cyan {
      background-color: #0aa;
    }

    .bg-white {
      background-color: #eee;
    }
  }
}

.task-detail-build {
  .viewlog {
    font-size: 14px;
  }
}
</style>
