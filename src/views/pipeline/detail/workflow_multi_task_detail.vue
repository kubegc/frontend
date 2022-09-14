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
          title="使用构建将为您节省20%构建时间"
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
          </el-table-column>

          <el-table-column prop="_target"
                           label="服务"
                           width="200px"></el-table-column>
        </el-table>
      </template>

      <el-backtop target=".workflow-or-pipeline-task-detail"></el-backtop>
            <el-dialog el-dialog title="请选择代码库平台"
                       @close="closeSelectRepo"
                       center
                       :append-to-body="true"
                       :close-on-click-modal="false"
                       custom-class="dialog-source"
                       :visible.sync="ImportFileVisible"
                       class="add-new-service">
              <el-form :model="service"
                       :rules="serviceRules"
                       ref="newServiceNameForm"
                       @submit.native.prevent>
                <el-form-item label=""
                              prop="newServiceName">
                  <span class="service-status new"></span>
                  <i class="service-type iconfont iconrongqifuwu"></i>
                  <el-input v-model="service.newServiceName"
                            size="mini"
                            autofocus
                            ref="serviceNamedRef"
                            @blur="inputServiceNameDoneWhenBlur"
                            @keyup.enter.native="inputServiceNameDoneWhenBlur"
                            placeholder="请输入服务名称"></el-input>
                </el-form-item>

              </el-form>
            </el-dialog>
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
    }
  },
  watch: {

  },
  created () {

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
