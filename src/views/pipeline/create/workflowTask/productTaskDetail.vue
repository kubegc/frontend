<template>
  <div class="workflow-task-detail workflow-or-pipeline-task-detail">
    <el-dialog :visible.sync="artifactModalVisible" width="60%" title="文件导出" class="downloadArtifact-dialog">
      <ArtifactDownload ref="downloadArtifact" :workflowName="workflowName" :taskId="taskID" :showArtifact="artifactModalVisible" />
    </el-dialog>
    <div class="common-parcel-block">
      <div class="workflow-basic-info">
        <div class="basic-left">
          <div class="primary-title not-first-child">基本信息</div>
          <el-form class="secondary-form" label-width="100px" label-position="left">
            <el-form-item label="状态">
              <el-tag
                size="small"
                effect="dark"
                :type="$utils.taskElTagType(taskDetail.status)"
                close-transition
              >{{ myTranslate(taskDetail.status) }}</el-tag>
            </el-form-item>
            <el-form-item label="创建者">{{ taskDetail.task_creator }}</el-form-item>
            <el-form-item v-if="taskDetail.task_revoker" label="取消者">{{ taskDetail.task_revoker }}</el-form-item>
            <el-form-item label="环境">{{ workflow.product_tmpl_name }} - {{ workflow.namespace }}</el-form-item>
            <el-form-item label="持续时间">
              {{ taskDetail.interval }}
              <el-tooltip v-if="taskDetail.intervalSec<0" content="本地系统时间和服务端可能存在不一致，请同步。" placement="top">
                <i class="el-icon-warning" style="color: red;"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item v-if="taskDetail.releases.length > 0 && taskDetail.status==='passed'" label="交付清单">
              <router-link
                :to="`/v1/delivery/version/detail/${projectName}/${taskDetail.releases[0].id}?version=${taskDetail.releases[0].version}&type=k8s`"
              >
                <span class="version-link">
                  {{ $utils.tailCut(taskDetail.releases[0].id,8,'#')+
                  taskDetail.releases[0].version }}
                </span>
              </router-link>
            </el-form-item>
            <el-form-item v-hasPermi="{projectName: projectName, action: 'run_workflow'}" v-if="showOperation()" label="操作">
              <el-button
                v-if="taskDetail.status==='failed' || taskDetail.status==='cancelled' || taskDetail.status==='timeout'"
                @click="rerun"
                type="text"
                size="medium"
              >失败重试</el-button>
              <el-button
                v-hasPermi="{projectName: projectName, action: 'run_workflow'}"
                v-if="taskDetail.status==='running'||taskDetail.status==='created'"
                @click="cancel"
                type="text"
                size="medium"
              >取消任务</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="basic-right" v-if="buildSummary.length > 0 || jenkinsSummary.length > 0">
          <div class="primary-title not-first-child">构建信息</div>
          <div class="build-summary" v-if="buildSummary.length > 0">
            <el-table :data="buildSummary" style="width: 90%;" class="blank-background-header">
              <el-table-column label="服务" min-width="160">
                <template slot-scope="scope">{{$utils.showServiceName(scope.row.service_name)}}</template>
              </el-table-column>
              <el-table-column label="代码" min-width="160">
                <template slot-scope="scope">
                  <div v-if="scope.row.builds.length > 0">
                    <el-row :gutter="0" v-for="(build,index) in scope.row.builds" :key="index">
                      <el-col :span="24">
                        <RepoJump :build="build" :showCommit="false" showIcon />
                      </el-col>
                    </el-row>
                  </div>
                  <span v-else>暂无代码</span>
                </template>
              </el-table-column>
              <el-table-column label="Issue 追踪" width="160">
                <template slot-scope="scope">
                  <div v-if="scope.row.issues.length > 0">
                    <el-popover
                      v-for="(issue,index) in scope.row.issues"
                      :key="index"
                      trigger="hover"
                      placement="top"
                      popper-class="issue-popper"
                    >
                      <p>标题: {{issue.summary?issue.summary:'*'}}</p>
                      <p>报告人: {{issue.reporter?issue.reporter:'*'}}</p>
                      <p>分配给: {{issue.assignee?issue.assignee:'*'}}</p>
                      <p>优先级: {{issue.priority?issue.priority:'*'}}</p>
                      <span slot="reference" class="issue-name-wrapper text-center">
                        <a :href="issue.url" target="_blank">{{`${issue.key} ${$utils.tailCut(issue.summary,12)}`}}</a>
                      </span>
                    </el-popover>
                  </div>
                  <span v-else>暂无 Issue</span>
                </template>
              </el-table-column>
              <el-table-column label="环境变量" width="100">
                <template slot-scope="{ row }">
                  <el-popover placement="left" width="400" trigger="hover">
                    <el-table :data="row.envs" class="blank-background-header">
                      <el-table-column prop="key" label="Key"></el-table-column>
                      <el-table-column prop="value" label="Value"></el-table-column>
                    </el-table>
                    <el-button slot="reference" type="text">查看</el-button>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="build-summary" v-if="jenkinsSummary.length > 0">
            <Etable class="blank-background-header" :tableColumns="jenkinsBuildColumns" :tableData="jenkinsSummary" id="id" />
          </div>
        </div>
        <div class="basic-right version-info" v-if="taskDetail.workflow_args && taskDetail.workflow_args.version_args">
          <div class="primary-title not-first-child">版本信息</div>
          <el-form class="secondary-form" label-width="100px" label-position="left">
            <el-form-item label="版本名称">{{taskDetail.workflow_args.version_args.version}}</el-form-item>
            <el-form-item label="版本描述">{{taskDetail.workflow_args.version_args.desc}}</el-form-item>
            <el-form-item label="版本标签">
              <span v-for="(label,index) in taskDetail.workflow_args.version_args.labels" :key="index" style="margin-right: 3px;">
                <el-tag size="small">{{label}}</el-tag>
              </span>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <template v-if="buildDeployArray.length > 0">
        <div class="primary-title not-first-child">环境更新</div>
        <el-alert
          class="description"
          v-if="jenkinsSummary.length > 0"
          show-icon
          title="使用 Zadig 构建将为您节省20%构建时间，建议您迁移构建过程到 Zadig"
          :closable="false"
          type="warning"
        ></el-alert>
        <div></div>
        <el-table
          :data="buildDeployArray"
          row-key="_target"
          :expand-row-keys="expandedBuildDeploys"
          @expand-change="updateBuildDeployExpanded"
          row-class-name="my-table-row"
          empty-text="无"
          class="build-deploy-table"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <TaskDetailBuild
                :buildv2="scope.row.buildv2SubTask"
                :docker_build="scope.row.docker_buildSubTask"
                :isWorkflow="true"
                :serviceName="scope.row._target"
                :pipelineName="workflowName"
                :projectName="projectName"
                :taskID="taskID"
                ref="buildComp"
              />
              <TaskDetailDeploy :deploys="scope.row.deploySubTasks" :pipelineName="workflowName" :taskID="taskID" />
            </template>
          </el-table-column>

          <el-table-column prop="_target" label="服务" min-width="200px">
            <template slot-scope="scope">
              <span>{{$utils.showServiceName(scope.row._target)}}</span>
            </template>
          </el-table-column>

          <el-table-column label="构建" min-width="250px">
            <template slot-scope="scope">
              <span :class="scope.row.buildOverallColor">{{ scope.row.buildOverallStatusZh }}</span>
              {{ scope.row.buildOverallTimeZh }}
              <el-tooltip v-if="scope.row.buildOverallTimeZhSec<0" content="本地系统时间和服务端可能存在不一致，请同步。" placement="top">
                <i class="el-icon-warning" style="color: red;"></i>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column min-width="250">
            <template slot="header">
              部署
              <DeployIcons />
            </template>
            <template slot-scope="scope">
              <div v-if="scope.row.deploySubTasks">
                <template>
                  <span v-for="(task,index) in scope.row.deploySubTasks" :key="index">
                    <span :class="colorTranslation(task.status, 'pipeline', 'task')">
                      <span v-if="task.service_type === 'k8s'">
                        <i class="iconfont iconrongqifuwu"></i>
                        {{task.service_name}}
                      </span>
                      <span v-else-if="task.service_type === 'helm'">
                        <i class="iconfont iconhelmrepo"></i>
                        {{task.service_name}}
                      </span>
                      {{':'+ myTranslate(task.status)}}
                    </span>
                    {{ makePrettyElapsedTime(task) }}
                    <el-tooltip v-if="calcElapsedTimeNum(task)<0" content="本地系统时间和服务端可能存在不一致，请同步。" placement="top">
                      <i class="el-icon-warning" style="color: red;"></i>
                    </el-tooltip>
                  </span>
                </template>
              </div>
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
        <div class="primary-title not-first-child">环境更新</div>

        <el-table
          :data="artifactDeployArray"
          row-key="_target"
          :expand-row-keys="expandedArtifactDeploys"
          @expand-change="updateArtifactDeployExpanded"
          row-class-name="my-table-row"
          empty-text="无"
          class="build-deploy-table"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <TaskDetailArtifactDeploy :deploy="scope.row.deploySubTask" />
            </template>
          </el-table-column>

          <el-table-column prop="_target" label="服务" min-width="200px">
            <template slot-scope="scope">
              <span>{{$utils.showServiceName(scope.row._target)}}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="200px">
            <template slot="header">交付物部署</template>
            <template slot-scope="scope">
              <span :class="scope.row.buildOverallColor">{{ scope.row.buildOverallStatusZh }}</span>
              {{ scope.row.buildOverallTimeZh }}
              <el-tooltip v-if="scope.row.buildOverallTimeZhSec<0" content="本地系统时间和服务端可能存在不一致，请同步。" placement="top">
                <i class="el-icon-warning" style="color: red;"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template v-if="artifact_deployArray.length > 0">
        <div class="primary-title not-first-child">环境更新</div>

        <el-table
          :data="artifact_deployArray"
          row-key="_target"
          :expand-row-keys="expandedArtifactDeploys"
          @expand-change="updateArtifactDeployExpanded"
          row-class-name="my-table-row"
          empty-text="无"
          class="build-deploy-table"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <TaskDetailArtifactDeploy :deploy="scope.row.artifact_deploySubTask" :workflowName="workflowName" :taskID="taskID" />
            </template>
          </el-table-column>

          <el-table-column prop="_target" label="服务" min-width="200px">
            <template slot-scope="scope">
              <span>{{$utils.showServiceName(scope.row._target)}}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="200px">
            <template slot="header">交付物部署</template>
            <template slot-scope="scope">
              <span :class="scope.row.buildOverallColor">{{ scope.row.buildOverallStatusZh }}</span>
              {{ scope.row.buildOverallTimeZh }}
              <el-tooltip v-if="scope.row.buildOverallTimeZhSec<0" content="本地系统时间和服务端可能存在不一致，请同步。" placement="top">
                <i class="el-icon-warning" style="color: red;"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div v-if="testArray.length > 0" class="primary-title not-first-child">产品测试</div>
      <template v-if="testArray.length > 0">
        <span class="secondary-title">自动化测试</span>
        <el-table
          :data="testArray"
          row-key="_target"
          :expand-row-keys="expandedTests"
          @expand-change="updateTestExpanded"
          row-class-name="my-table-row"
          empty-text="无"
          class="test-table"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <TaskDetailTest
                :testingv2="scope.row.testingv2SubTask"
                :serviceName="scope.row._target"
                :pipelineName="workflowName"
                ref="testComp"
                :taskID="taskID"
              />
            </template>
          </el-table-column>

          <el-table-column prop="_target" label="名称" width="200px">
            <template slot-scope="scope">
              <span>{{$utils.showServiceName(scope.row._target)}}</span>
            </template>
          </el-table-column>

          <el-table-column label="运行状态">
            <template slot-scope="scope">
              <span
                :class="colorTranslation(scope.row.testingv2SubTask.status, 'pipeline', 'task')"
              >{{ myTranslate(scope.row.testingv2SubTask.status) }}</span>
              {{ makePrettyElapsedTime(scope.row.testingv2SubTask) }}
              <el-tooltip v-if="calcElapsedTimeNum(scope.row.testingv2SubTask)<0" content="本地系统时间和服务端可能存在不一致，请同步。" placement="top">
                <i class="el-icon-warning" style="color: red;"></i>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column label="测试报告">
            <template slot-scope="scope">
              <span v-if="scope.row.testingv2SubTask.report_ready === true" class="show-test-result">
                <router-link :to="getTestReport(scope.row.testingv2SubTask, scope.row._target)">查看</router-link>
              </span>
            </template>
          </el-table-column>

          <el-table-column label="文件导出">
            <template slot-scope="scope">
              <span
                v-if="scope.row.testingv2SubTask.job_ctx.is_has_artifact"
                @click="artifactModalVisible=true"
                class="download-artifact-link"
              >下载</span>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template v-if="distributeArray.length > 0">
        <div class="primary-title not-first-child">分发部署</div>

        <el-table
          :data="distributeArray"
          row-class-name="my-table-row"
          row-key="_target"
          :expand-row-keys="expandedDistributeDeploys"
          @expand-change="updateDistributeDeployExpanded"
          empty-text="无"
          style="width: 100%;"
          class="release-table"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <TaskDetailDistributeDeploy
                :distributeDeploy="scope.row"
                :serviceName="scope.row._target"
                :projectName="projectName"
                ref="distributeDeployComp"
              />
            </template>
          </el-table-column>
          <el-table-column prop="_target" label="服务" min-width="200px">
            <template slot-scope="scope">
              <span>{{$utils.showServiceName(scope.row._target)}}</span>
            </template>
          </el-table-column>

        </el-table>
      </template>
      <el-backtop target=".workflow-or-pipeline-task-detail"></el-backtop>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      workflow: {},
      taskDetail: {
        stages: []
      },
      rules: {
        version: [
          { required: true, message: '请填写版本名称', trigger: 'blur' }
        ]
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
      expandedBuildDeploys: [],
      expandedArtifactDeploys: [],
      expandedDistributeDeploys: [],
      expandedTests: []
    }
  },
  computed: {

  },
  methods: {

  },
  watch: {

  },
  created () {

  },
  components: {

  }
}
</script>

<style lang="less" scoped>

</style>

