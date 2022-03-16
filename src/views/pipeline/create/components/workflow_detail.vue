<template>
  <div class="workflow-detail">
    <el-card :body-style="{ padding: '0px', margin: '15px 0 0 0' }"
             class="box-card wide">
      <div slot="header"
           class="block-title">
        基本信息
      </div>
      <div class="text item">
        <el-row :gutter="0">
          <el-col :span="4">
            <div class="grid-content item-title"><i class="el-icon-user-solid"></i> 修改人</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content item-desc">{{ workflow.update_by }}</div>
          </el-col>
        </el-row>
        <el-row v-if="workflow.description"
                :gutter="0">
          <el-col :span="4">
            <div class="grid-content item-title"><i class="el-icon-chat-line-square"></i> 描述</div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content item-desc">{{ workflow.description }}</div>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="4">
            <div class="grid-content item-title"><i class="el-icon-time"></i> 更新时间</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content item-desc">
              {{ $utils.convertTimestamp(workflow.update_time) }}
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="4">
            <div class="grid-content item-title process"><i class="el-icon-finished"></i> 流程</div>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="4">
            <div class="grid-content item-title operation"><i class="el-icon-s-operation"></i> 操作
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content item-desc">
              <el-tooltip effect="dark"
                          content="执行"
                          placement="top">
                <i @click="startTask"
                   class="el-icon-video-play start-build"></i>
              </el-tooltip>
              <template>
                <el-tooltip effect="dark"
                            content="删除工作流"
                            placement="top">
                  <i @click="removeWorkflow"
                     class="el-icon-delete edit-pipeline"></i>
                </el-tooltip>
              </template>

            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card full"
             :body-style="{ padding: '0px', margin: '15px 0 30px 0' }">
      <div slot="header"
           class="block-title">
        历史任务
      </div>
    </el-card>

    <el-dialog :visible.sync="taskDialogVisible"
               title="运行 产品-工作流"
               custom-class="run-workflow"
               width="60%"
               class="dialog">
      <run-workflow v-if="taskDialogVisible"
                    :workflowName="workflowName"
                    :workflowMeta="workflow"
                    :targetProduct="workflow.product_tmpl_name"
                    :forcedUserInput="forcedUserInput"
                    @success="hideAndFetchHistory"></run-workflow>
    </el-dialog>
  </div>
</template>

<script>
// import { workflowAPI, deleteWorkflowAPI, workflowTaskListAPI } from '@api'
// import runWorkflow from './common/run_workflow.vue'
export default {
  components: {
  },
  data () {
    return {
      workflow: {},
      workflowTasks: [],
      total: 0,
      pageSize: 50,
      taskDialogVisible: false,
      durationSet: {},
      forcedUserInput: {},
      pageStart: 0,
      timerId: null,
      timeTimeoutFinishFlag: false,
      projectName: null
    }
  },
  computed: {
    workflowName () {
      return this.$route.params.workflow_name
    },
    testReportExists () {
      const items = []
      this.workflowTasks.forEach(element => {
        if (element.test_reports) {
          items.push(element.task_id)
        }
      })
      if (items.length > 0) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    async refreshHistoryTask () {
      const res = await workflowTaskListAPI(this.workflowName, this.pageStart, this.pageSize)
      this.processTestData(res)
      this.workflowTasks = res.data
      this.total = res.total
      if (!this.timeTimeoutFinishFlag) {
        this.timerId = setTimeout(this.refreshHistoryTask, 3000)// 保证内存中只有一个定时器
      }
    },
    processTestData (res) {
      res.data.forEach(element => {
        if (element.test_reports) {
          const testArray = []
          for (const testName in element.test_reports) {
            const val = element.test_reports[testName]
            if (typeof val === 'object') {
              const struct = {
                success: null,
                total: null,
                name: null,
                type: null,
                time: null,
                img_id: null
              }
              if (val.functionTestSuite) {
                struct.name = testName
                struct.type = 'function'
                struct.success = val.functionTestSuite.successes ? val.functionTestSuite.successes : (val.functionTestSuite.tests - val.functionTestSuite.failures - val.functionTestSuite.errors)
                struct.total = val.functionTestSuite.tests
                struct.time = val.functionTestSuite.time
              }
              testArray.push(struct)
            }
          }
          element.testSummary = testArray
        }
      })
    },
    fetchHistory (start, max) {
      workflowTaskListAPI(this.workflowName, start, max).then(res => {
        this.processTestData(res)
        this.workflowTasks = res.data
        this.total = res.total
      })
    },

    hideAndFetchHistory () {
      this.taskDialogVisible = false
      this.fetchHistory(0, this.pageSize)
    },

    startTask () {
      this.taskDialogVisible = true
      this.forcedUserInput = {}
    },
    removeWorkflow () {
      const name = this.workflowName
      this.$prompt('输入工作流名称确认', '删除工作流 ' + name, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'el-button el-button--danger',
        inputValidator: pipe_name => {
          if (pipe_name === name) {
            return true
          } else if (pipe_name === '') {
            return '请输入工作流名称'
          } else {
            return '名称不相符'
          }
        }
      }).then(({ value }) => {
        deleteWorkflowAPI(name).then(() => {
          this.$message.success('删除成功')
          this.$router.push(`/v1/projects/detail/${this.projectName}/pipelines`)
          this.$store.dispatch('refreshWorkflowList')
        })
      })
    },
    rerun (task) {
      this.taskDialogVisible = true

      const args = task.workflow_args
      this.forcedUserInput = {
        workflow_name: args.workflow_name,
        product_tmpl_name: args.product_tmpl_name,
        description: args.description,
        namespace: args.namespace,
        targets: args.targets,
        tests: args.tests
      }
      if (args.artifact_args && args.artifact_args.length > 0) {
        Object.assign(this.forcedUserInput, {
          artifactArgs: args.artifact_args,
          versionArgs: args.version_args,
          registryId: args.registry_id
        })
      }
    }
  },
  beforeDestroy () {
    this.timeTimeoutFinishFlag = true
    clearTimeout(this.timerId)
  },
  mounted () {
    workflowAPI(this.workflowName).then(res => {
      this.workflow = res
    })
    this.projectName = this.$route.params.project_name
    this.refreshHistoryTask()
    bus.$emit('set-topbar-title', {
      title: '',
      breadcrumb: [
        { title: '项目', url: '' },
        { title: this.projectName, url: `` },
        { title: '工作流', url: `` },
        { title: this.workflowName, url: '' }]
    })
    bus.$emit('set-sub-sidebar-title', {
      title: this.projectName,
      url: `/v1/projects/detail/${this.projectName}`,
      routerList: [
        { name: '工作流', url: `` },
        { name: '集成环境', url: `` },
        { name: '服务', url: `` },
        { name: '构建', url: `` },
        { name: '测试', url: `` }]
    })
  },
}
</script>

<style lang="less">
.workflow-detail {
  position: relative;
  flex: 1;
  padding: 0 30px;
  overflow: auto;
  font-size: 13px;
  background-color: #fff;

  .text {
    font-size: 13px;
  }

  .item {
    padding: 10px 0;
    padding-left: 1px;

    .icon-color {
      color: #9ea3a9;
      cursor: pointer;

      &:hover {
        color: #1989fa;
      }
    }

    .icon-color-cancel {
      color: #ff4949;
      cursor: pointer;
    }
  }

  .clearfix::before,
  .clearfix::after {
    display: table;
    content: "";
  }

  .block-title {
    color: #999;
    font-size: 16px;
    line-height: 20px;
  }

  .clearfix::after {
    clear: both;
  }

  .box-card {
    width: 600px;
    background-color: #fff;

    .item-title {
      color: #8d9199;
    }

    .operation {
      line-height: 18px;
    }

    .item-desc {
      .start-build,
      .edit-pipeline {
        margin-right: 0.3em;
        font-size: 1.3rem;
        cursor: pointer;

        &:hover {
          color: #1989fa;
        }
      }

      .favorite {
        display: inline-block;
        color: #69696bb3;
        cursor: pointer;

        &.liked {
          color: #f4e118;
        }

        &:hover {
          color: #f4e118;
        }
      }
    }

    .task-id,
    .report-link {
      color: #1989fa;
    }

    .process {
      line-height: 24px;

      ul {
        margin: 0;
        padding: 0;
        line-height: 1;

        li {
          display: inline-block;
          line-height: 24px;
          list-style: none;
          cursor: pointer;
        }

        .step-arrow {
          color: #409eff;
        }
      }

      .dot {
        width: 12px;
        height: 12px;
        vertical-align: middle;
        background: #d1d9e5;
        border-radius: 50%;
      }

      .active {
        background-color: #1989fa;
      }

      .build {
        background-color: #fa4c7e;
      }

      .deploy {
        background-color: #fdd243;
      }

      .test {
        background-color: #78da59;
      }

      .distribution {
        background-color: #166cd6;
      }
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
    }
  }

  .box-card,
  .box-card-stack {
    margin-top: 15px;
    border: none;
    box-shadow: none;
  }

  .wide {
    width: 65%;
  }

  .full {
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

  .pipeline-edit {
    .el-dialog__body {
      padding: 15px 20px;

      .el-form {
        .el-form-item {
          margin-bottom: 15px;
        }
      }
    }
  }

  .fileTree-dialog {
    .el-dialog__body {
      padding: 0 5px;
    }
  }

  .buildv2-edit-form {
    .el-form-item__label {
      padding: 0;
      font-size: 13px;
      line-height: 25px;
    }
  }

  .not-anchor {
    color: unset;
  }

  .run-workflow {
    .el-dialog__body {
      padding: 8px 10px;
      color: #606266;
      font-size: 14px;
    }
  }
}
</style>
