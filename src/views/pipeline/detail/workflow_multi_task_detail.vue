<template>
    <div class="workflow-task-detail workflow-or-pipeline-task-detail">
      <!--start of workspace-tree-dialog-->
      <el-dialog :visible.sync="artifactModalVisible"
                 width="60%"
                 title="文件导出"
                 class="downloadArtifact-dialog">
        <artifact-download ref="downloadArtifact"
                          :workflowName="workflowName"
                          :taskId="taskID"
                          :showArtifact="artifactModalVisible"></artifact-download>
      </el-dialog>
      <!--end of workspace-tree-dialog-->
      <el-row>
        <el-col :span="6">

          <div class="section-head">
            基本信息
          </div>

          <el-form class="basic-info"
                   label-width="100px">
            <el-form-item label="状态">
              <el-tag size="small"
                      effect="dark"
                      :type="$utils.taskElTagType(taskDetail.status)"
                      close-transition>
                {{ myTranslate(taskDetail.status) }}
              </el-tag>
            </el-form-item>
            <el-form-item label="创建者">
              {{ taskDetail.task_creator }}
            </el-form-item>
            <el-form-item v-if="taskDetail.task_revoker"
                          label="取消者">
              {{ taskDetail.task_revoker }}
            </el-form-item>
            <el-form-item label="集成环境">
              {{ workflow.product_tmpl_name }} - {{ workflow.namespace }}
            </el-form-item>
            <el-form-item label="持续时间">
              {{ taskDetail.interval }}
              <el-tooltip v-if="taskDetail.intervalSec<0"
                          content="本地系统时间和服务端可能存在不一致，请同步。"
                          placement="top">
                <i class="el-icon-warning"
                   style="color: red;"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item v-if="versionList.length > 0 && taskDetail.status==='passed'"
                          label="交付清单">
              <router-link :to="`/v1/delivery/version/${versionList[0].versionInfo.id}`">
                <span class="version-link">{{ $utils.tailCut(versionList[0].versionInfo.id,8,'#')+
            versionList[0].versionInfo.version }}</span>
              </router-link>
            </el-form-item>
            <el-form-item v-if="showOperation()"
                          label="操作">
                <el-button v-if="taskDetail.status==='failed' || taskDetail.status==='cancelled' || taskDetail.status==='timeout'"
                           @click="rerun"
                           type="text"
                           size="medium">失败重试</el-button>
                <el-button v-if="taskDetail.status==='running'||taskDetail.status==='created'"
                           @click="cancel"
                           type="text"
                           size="medium">取消任务</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <el-col v-if="buildSummary.length > 0 || jenkinsSummary.length > 0"
                :span="14">
          <div class="section-head">
              构建信息
          </div>
          <div class="build-summary" v-if="buildSummary.length > 0">
            <el-table :data="buildSummary"
                      style="width: 100%;">
              <el-table-column label="服务"
                               width="160">
                <template slot-scope="scope">
                  {{scope.row.service_name}}
                </template>
              </el-table-column>
              <el-table-column label="代码"></el-table-column>
              <el-table-column label="Issue 追踪"
                               width="160">
                <template slot-scope="scope">
                  <span> 暂无 Issue </span>
                </template>
              </el-table-column>
              <el-table-column label="环境变量" width="100">
                <template slot-scope="{ row }">
                  <el-popover
                    placement="left"
                    width="400"
                    trigger="hover">
                    <el-table :data="row.envs">
                      <el-table-column property="key" label="Key"></el-table-column>
                      <el-table-column property="value" label="Value"></el-table-column>
                    </el-table>
                    <el-button slot="reference" type="text">查看</el-button>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="build-summary" v-if="jenkinsSummary.length > 0">
            <Etable :tableColumns="jenkinsBuildColumns" :tableData="jenkinsSummary" id="id" />
          </div>
        </el-col>
      </el-row>

      <template v-if="buildDeployArray.length > 0">
        <div class="section-head">
          环境更新
        </div>
        <el-alert class="description" v-if="jenkinsSummary.length > 0"
          show-icon
          title="使用 Zadig 构建将为您节省20%构建时间，建议您迁移构建过程到 Zadig"
           :closable="false"
          type="warning">
        </el-alert>
        <el-table :data="buildDeployArray"
                  row-key="_target"
                  :expand-row-keys="expandedBuildDeploys"
                  @expand-change="updateBuildDeployExpanded"
                  row-class-name="my-table-row"
                  empty-text="无"
                  class="build-deploy-table">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <task-detail-build :buildv2="scope.row.buildv2SubTask"
                                 :docker_build="scope.row.docker_buildSubTask"
                                 :isWorkflow="true"
                                 :serviceName="scope.row._target"
                                 :pipelineName="workflowName"
                                 :projectName="projectName"
                                 :taskID="taskID"
                                 ref="buildComp"></task-detail-build>
              <task-detail-deploy :deploys="scope.row.deploySubTasks"
                                  :pipelineName="workflowName"
                                  :taskID="taskID"></task-detail-deploy>
            </template>
          </el-table-column>

          <el-table-column prop="_target"
                           label="服务"
                           width="200px"></el-table-column>

          <el-table-column label="构建"
                           width="250px">
            <template slot-scope="scope">
              <span :class="scope.row.buildOverallColor">
                {{ scope.row.buildOverallStatusZh }}
              </span>
              {{ scope.row.buildOverallTimeZh }}
              <el-tooltip v-if="scope.row.buildOverallTimeZhSec<0"
                          content="本地系统时间和服务端可能存在不一致，请同步。"
                          placement="top">
                <i class="el-icon-warning"
                   style="color: red;"></i>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column>
            <template slot="header">
              部署
              <deploy-icons></deploy-icons>
            </template>
            <template slot-scope="scope">
              <div v-if="scope.row.buildv2SubTask.service_type==='pm'">
                <span>
                  <i class="iconfont iconwuliji"></i>
                  主机
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template v-if="artifactDeployArray.length > 0">
        <div class="section-head">
          环境更新
        </div>

        <el-table :data="artifactDeployArray"
                  row-key="_target"
                  :expand-row-keys="expandedArtifactDeploys"
                  @expand-change="updateArtifactDeployExpanded"
                  row-class-name="my-table-row"
                  empty-text="无"
                  class="build-deploy-table">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <task-detail-artifact-deploy :deploy="scope.row.deploySubTask">
              </task-detail-artifact-deploy>
            </template>
          </el-table-column>

          <el-table-column prop="_target"
                           label="服务"
                           width="200px"></el-table-column>
        </el-table>
      </template>

      <el-backtop target=".workflow-or-pipeline-task-detail"></el-backtop>
    </div>
</template>

<script>
// import { workflowTaskDetailAPI, workflowTaskDetailSSEAPI, restartWorkflowAPI, cancelWorkflowAPI, getVersionListAPI } from '@api'
export default {
  data () {
    return {
      workflow: {
      },
      taskDetail: {
        stages: []
      },

      argColumns: [
        {
          prop: 'name',
          label: 'name'
        },
        {
          prop: 'value',
          label: 'value'
        }
      ],
      inputTagVisible: false,
      inputValue: '',
      artifactModalVisible: false,
      versionList: [],
      expandedBuildDeploys: [],
      expandedArtifactDeploys: [],
      expandedTests: []
    }
  },
  computed: {
    workflowName () {
      return this.$route.params.workflow_name
    },
    currentOrganizationId () {
      return this.$store.state.login.userinfo.organization.id
    },
    taskID () {
      return this.$route.params.task_id
    },
    status () {
      return this.$route.query.status
    },
    workflowProductTemplate () {
      return this.workflow.product_tmpl_name
    },
    projectName () {
      return this.$route.params.project_name ? this.$route.params.project_name : this.workflowProductTemplate
    },
    artifactDeployMap () {
      const map = {}
      const stage = this.taskDetail.stages.find(stage => stage.type === 'artifact')
      if (stage) {
        this.collectSubTask(map, 'deploy')
      }
      return map
    },
    artifactDeployArray () {
      const arr = this.$utils.mapToArray(this.artifactDeployMap, '_target')
      for (const target of arr) {
        target.buildOverallStatusZh = this.myTranslate(target.deploySubTask.status)
        target.buildOverallColor = this.colorTranslation(target.deploySubTask.status, 'pipeline', 'task')
        target.buildOverallTimeZhSec = this.calcElapsedTimeNum(target.deploySubTask)
        target.buildOverallTimeZh = this.$utils.timeFormat(target.buildOverallTimeZhSec)
      }
      return arr
    },
    buildDeployMap () {
      const map = {}
      this.collectBuildDeploySubTask(map)
      this.collectSubTask(map, 'docker_build')
      return map
    },
    buildDeployArray () {
      const arr = this.$utils.mapToArray(this.buildDeployMap, '_target')
      for (const target of arr) {
        target.buildOverallStatus = this.$utils.calcOverallBuildStatus(
          target.buildv2SubTask, target.docker_buildSubTask
        )
        target.buildOverallStatusZh = this.myTranslate(target.buildOverallStatus)
        target.buildOverallColor = this.colorTranslation(target.buildOverallStatus, 'pipeline', 'task')
        target.buildOverallTimeZhSec = this.calcElapsedTimeNum(target.buildv2SubTask) + this.calcElapsedTimeNum(target.docker_buildSubTask)
        target.buildOverallTimeZh = this.$utils.timeFormat(target.buildOverallTimeZhSec)
      }
      return arr
    },
    buildSummary () {
      const map = {}
      this.collectSubTask(map, 'jira')
      const taskArr = this.$utils.mapToArray(map, 'service_name')
      const jiraIssues = []
      taskArr.forEach(element => {
        if (element.jiraSubTask.issues) {
          jiraIssues.push({
            service_name: element.service_name,
            issues: element.jiraSubTask.issues
          })
        }
      })
      const buildArr = this.$utils.mapToArray(this.buildDeployMap, '_target').filter(item => item.buildv2SubTask.type === 'buildv2')
      const envs = {}
      this.workflow.targets && this.workflow.targets.forEach(target => {
        envs[target.name] = target.envs
      })
      const summary = buildArr.map(element => {
        let currentIssues = jiraIssues.find(item => { return item.service_name === element._target })
        if (!currentIssues) {
          currentIssues = null
        }
        return {
          service_name: element._target,
          builds: _.get(element, 'buildv2SubTask.job_ctx.builds', ''),
          issues: currentIssues ? currentIssues.issues : [],
          envs: envs[element._target] || []
        }
      })
      return summary
    },
    jenkinsSummary () {
      const map = {}
      this.collectSubTask(map, 'jira')
      const taskArr = this.$utils.mapToArray(map, 'service_name')
      const jiraIssues = []
      taskArr.forEach(element => {
        if (element.jiraSubTask.issues) {
          jiraIssues.push({
            service_name: element.service_name,
            issues: element.jiraSubTask.issues
          })
        }
      })
      const buildArr = this.$utils.mapToArray(this.buildDeployMap, '_target').filter(item => item.buildv2SubTask.type === 'jenkins_build')
      const summary = buildArr.map(element => {
        let currentIssues = jiraIssues.find(item => { return item.service_name === element._target })
        if (!currentIssues) {
          currentIssues = null
        }
        return {
          service_name: element._target,
          builds: _.get(element, 'buildv2SubTask.job_ctx', ''),
          jenkins_build_args: _.get(element, 'buildv2SubTask.jenkins_build_args', '')
        }
      })
      return summary
    },
    distributeMap () {
      const map = {}
      this.collectSubTask(map, 'distribute2kodo')
      this.collectSubTask(map, 'release_image')
      this.collectSubTask(map, 'distribute')
      return map
    },
    distributeArray () {
      const arr = this.$utils.mapToArray(this.distributeMap, '_target')
      for (const item of arr) {
        if (item.distribute2kodoSubTask) {
          item.distribute2kodoSubTask.distribute2kodoPath = item.distribute2kodoSubTask.remote_file_key
        }
        if (item.release_imageSubTask) {
          item.release_imageSubTask._image = item.release_imageSubTask.image_release
            ? item.release_imageSubTask.image_release.split('/')[2]
            : '*'
        }
      }
      return arr
    },
    distributeArrayExpanded () {
      const wanted = ['distribute2kodoSubTask', 'release_imageSubTask', 'distributeSubTask']

      const outputKeys = {
        distribute2kodoSubTask: 'package_file',
        release_imageSubTask: '_image',
        distributeSubTask: 'package_file'
      }
      const locationKeys = {
        distribute2kodoSubTask: 'distribute2kodoPath',
        release_imageSubTask: 'image_repo',
        distributeSubTask: 'dist_host'
      }

      const twoD = this.distributeArray.map(map => {
        let typeCount = 0
        const arr = []
        for (const key of wanted) {
          if (key in map) {
            typeCount++
            const item = map[key]
            item._target = map._target
            item.output = item[outputKeys[key]]
            if (key === 'release_imageSubTask') {
              item.location = item.releases ? item.releases : item.image_release
            } else {
              item.location = item[locationKeys[key]]
            }
            arr.push(item)
          }
        }
        arr[0].typeCount = typeCount
        return arr
      })
      return this.$utils.flattenArray(twoD)
    }
  },
  methods: {
    isStageDone (name) {
      if (this.taskDetail.stages.length > 0) {
        const stage = this.taskDetail.stages.find(element => {
          return element.type === name
        })
        return stage ? stage.status === 'passed' : false
      }
    },
    rerun () {
      const taskUrl = `/v1/projects/detail/${this.projectName}/pipelines/multi/${this.workflowName}/${this.taskID}`
      restartWorkflowAPI(this.workflowName, this.taskID).then(res => {
        this.$message.success('任务已重新启动')
        this.$router.push(taskUrl)
      })
    },
    cancel () {
      cancelWorkflowAPI(this.workflowName, this.taskID).then(res => {
        if (this.$refs && this.$refs.buildComp) {
          this.$refs.buildComp.killLog('buildv2')
          this.$refs.buildComp.killLog('docker_build')
        }
        if (this.$refs && this.$refs.testComp) {
          this.$refs.testComp.killLog('test')
        }
        this.$message.success('任务取消成功')
      })
    },
    checkDeliveryList () {
      const orgId = this.currentOrganizationId
      const workflowName = this.workflowName
      const taskId = this.taskID
      getVersionListAPI(orgId, workflowName, '', taskId).then((res) => {
        this.versionList = res
      })
    },
    collectSubTask (map, typeName) {
      const stage = this.taskDetail.stages.find(stage => stage.type === typeName)
      if (stage) {
        for (const target in stage.sub_tasks) {
          if (!(target in map)) {
            map[target] = {}
          }
          map[target][`${typeName}SubTask`] = stage.sub_tasks[target]
        }
      }
    },

    fetchTaskDetail () {
      return workflowTaskDetailSSEAPI(this.workflowName, this.taskID).then(res => {
        this.adaptTaskDetail(res.data)
        this.taskDetail = res.data
        this.workflow = res.data.workflow_args
      }).closeWhenDestroy(this)
    },
    fetchOldTaskDetail () {
      workflowTaskDetailAPI(this.workflowName, this.taskID).then(res => {
        this.adaptTaskDetail(res)
        this.taskDetail = res
        this.workflow = res.workflow_args
      })
    },
    adaptTaskDetail (detail) {
      detail.intervalSec = (detail.status === 'running' ? Math.round((new Date()).getTime() / 1000) : detail.end_time) - detail.start_time
      detail.interval = this.$utils.timeFormat(detail.intervalSec)
    },
    repoID (repo) {
      return `${repo.source}/${repo.repo_owner}/${repo.repo_name}`
    },

    myTranslate (word) {
      return wordTranslate(word, 'pipeline', 'task')
    },
    colorTranslation (word, category, subitem) {
      return colorTranslate(word, category, subitem)
    },
    calcElapsedTimeNum (subTask) {
      if (this.$utils.isEmpty(subTask) || subTask.status === '') {
        return 0
      }
      const endTime = subTask.status === 'running' ? Math.floor(Date.now() / 1000) : subTask.end_time
      return endTime - subTask.start_time
    },

    updateBuildDeployExpanded (row, expandedRows) {
      this.expandedBuildDeploys = expandedRows.map(r => r._target)
    },
    updateArtifactDeployExpanded (row, expandedRows) {
      this.expandedBuildDeploys = expandedRows.map(r => r._target)
    },
    showOperation () {
      if (this.taskDetail.status === 'failed' || this.taskDetail.status === 'cancelled' || this.taskDetail.status === 'timeout') {
        return true
      }
      if (this.taskDetail.status === 'running' || this.taskDetail.status === 'created') {
        return true
      }

      if (this.taskDetail.status === 'passed' && this.distributeArrayExpanded.length > 0) {
        return true
      }

      return false
    },
  },
  watch: {
    $route (to, from) {
      this.checkDeliveryList()
      this.setTitleBar()
      if (this.$route.query.status === 'passed' || this.$route.query.status === 'failed' || this.$route.query.status === 'timeout' || this.$route.query.status === 'cancelled') {
        this.fetchOldTaskDetail()
      } else {
        this.fetchTaskDetail()
      }
    }
  },
  created () {
    this.checkDeliveryList()
    this.setTitleBar()
    if (this.$route.query.status === 'passed' || this.$route.query.status === 'failed' || this.$route.query.status === 'timeout' || this.$route.query.status === 'cancelled') {
      this.fetchOldTaskDetail()
    } else {
      this.fetchTaskDetail()
    }
  },
  components: {}
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
    color: #1989fa;
    cursor: pointer;
  }
}

.workflow-task-detail {
  position: relative;
  flex: 1;
  padding: 0 20px;
  overflow: auto;

  .el-breadcrumb {
    font-size: 16px;
  }

  .version-summary {
    .title {
      color: #606266;
      font-size: 14px;
      line-height: 40px;
    }

    .content {
      color: #333;
      font-size: 14px;
    }
  }

  .section-head {
    width: 222px;
    height: 28px;
    margin-top: 25px;
    color: #303133;
    font-size: 16px;
    line-height: 28px;
    border-bottom: 1px solid #eee;
  }

  .section-title {
    display: inline-block;
    margin-top: 20px;
    margin-left: 15px;
    color: #666;
    font-size: 13px;
  }

  .version-link,
  .download-artifact-link {
    color: #1989fa;
    cursor: pointer;
  }

  .basic-info,
  .build-deploy-table,
  .test-table,
  .release-table {
    margin-top: 10px;
  }

  .el-form-item {
    margin-bottom: 0;
  }

  .el-form-item__label {
    text-align: left;
  }

  .build-deploy-table,
  .test-table,
  .release-table {
    span[class^="color-"] {
      margin-right: 8px;
    }

    .icon {
      font-size: 18px;
      cursor: pointer;
    }

    .error {
      color: #ff1989;
    }
  }

  .security-table,
  .release-table {
    margin-left: 48px;
  }

  .show-test-result {
    a {
      color: #1989fa;
      cursor: pointer;
    }
  }

  .el-table__expanded-cell {
    padding: 0;
  }

  .my-table-row {
    background-color: #f5faff;
  }

  .issue-name-wrapper {
    display: block;

    a {
      margin-right: 4px;
      color: #1989fa;
    }
  }

  .build-summary {
    .repo-name {
      font-size: 15px;
    }

    .link a {
      color: #1989fa;
      cursor: pointer;
    }

    .el-row {
      margin-bottom: 5px;
    }
  }
}

.description {
  margin-top: 10px;
  color: #606266;
  font-size: 14px;
}
</style>
