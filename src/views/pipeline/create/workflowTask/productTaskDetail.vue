<template>
  <div class="workflow-task-detail workflow-or-pipeline-task-detail">
    <div class="common-parcel-block">
      <div class="workflow-basic-info">
        <div class="basic-left">
          <div class="primary-title not-first-child">基本信息</div>
          <el-form class="secondary-form" label-width="100px" label-position="left">
            <el-form-item label="状态">
              <el-tag
                size="small"
                effect="dark"
                close-transition
              >等待</el-tag>
            </el-form-item>
            <el-form-item label="创建者"> admin </el-form-item>
            <el-form-item label="取消者"> admin </el-form-item>
            <el-form-item label="环境">44 - dev </el-form-item>
            <el-form-item label="持续时间">

              <el-tooltip content="本地系统时间和服务端可能存在不一致，请同步。" placement="top">
                <i class="el-icon-warning" style="color: red;"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item v-if="showOperation()" label="操作">
              <el-button
                v-if="taskDetail.status ==='failed' || taskDetail.status==='cancelled'|| taskDetail.status === 'timeout'"
                type="text"
                size="medium"
                @click="rerun"
              >失败重试</el-button>
              <el-button
                v-if="taskDetail.status === 'running' || taskDetail.status === 'created'"
                type="text"
                size="medium"
                @click="cancel"
              >取消任务</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="basic-right">
          <div class="primary-title not-first-child">构建信息</div>
          <div class="build-summary" >
            <el-table  style="width: 90%;" class="blank-background-header">
              <el-table-column label="服务" min-width="160">
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
        </div>

        <div class="basic-right version-info" >
          <div class="primary-title not-first-child">版本信息</div>
          <el-form class="secondary-form" label-width="100px" label-position="left">
            <el-form-item label="版本名称"></el-form-item>
            <el-form-item label="版本描述"></el-form-item>
            <el-form-item label="版本标签">
            </el-form-item>
          </el-form>
        </div>
      </div>

      <template >
        <div class="primary-title not-first-child">环境更新</div>
        <el-alert
          class="description"
          show-icon
          title="使用构建将为您节省时间"
          :closable="false"
          type="warning"
        ></el-alert>
        <div></div>
        <el-table

          row-key="_target"
          :expand-row-keys="expandedBuildDeploys"
          @expand-change="updateBuildDeployExpanded"
          row-class-name="my-table-row"
          empty-text="无"
          class="build-deploy-table"
        >
          <el-table-column type="expand">
          </el-table-column>

          <el-table-column prop="_target" label="服务" min-width="200px">
            <template slot-scope="scope">
              <span></span>
            </template>
          </el-table-column>

          <el-table-column label="构建" min-width="250px">
            <template slot-scope="scope">
              <span :class="scope.row.buildOverallColor"></span>
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
              <div >
                <template>
                  <span >
                    <span>
                      <span >
                        <i class="iconfont iconrongqifuwu"></i>
                      </span>
                      <span >
                        <i class="iconfont iconhelmrepo"></i>
                      </span>
                    </span>
                    <el-tooltip  content="本地系统时间和服务端可能存在不一致，请同步。" placement="top">
                      <i class="el-icon-warning" style="color: red;"></i>
                    </el-tooltip>
                  </span>
                </template>
              </div>
              <div >
                <span>
                  <i class="iconfont iconwuliji"></i>
                  主机
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template >
        <div class="primary-title not-first-child">环境更新</div>

        <el-table
          class="build-deploy-table"
          :data="tableData"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="item-title">构建</div>
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="资源信息">
                  <span>{{ props.row.shop }}</span>
                </el-form-item>
                <el-form-item label="持续时间">
                  <span>{{ props.row.shopId }}</span>
                </el-form-item>
                <el-form-item label="构建状态">
                  <span>{{ props.row.category }}</span>
                </el-form-item>
                <el-form-item label="描述">
                  <span>{{ props.row.address }}</span>
                </el-form-item>
              </el-form>
              <el-card class="box-card task-process"
                       :body-style="{padding:'8px 20px',margin: '5px 0 0 0' }">
                <div class="log-container">
                  <div class="log-content">
                    <iframe src="http://123.60.93.72:30001/ssh/host/192.168.0.249" width="100%" height="600px"></iframe>
                    <!--                  <el-link v-for="item in pageSpec.actions" :href="getExternalLink(scope.row.json, item)" target="_blank">{{-->
                    <!--                    getComplexOrDefValue(scope.row.json, item.row)-->
                    <!--                    }}</el-link>-->
                  </div>
                </div>
              </el-card>
            </template>
          </el-table-column>
          <el-table-column
            label="服务"
            prop="service">
          </el-table-column>
          <el-table-column
            label="构建"
            prop="pr">
          </el-table-column>
          <el-table-column
            label="部署"
            prop="deploy">
          </el-table-column>
        </el-table>
      </template>

<!--      <template v-if="artifact_deployArray.length > 0">-->
<!--        <div class="primary-title not-first-child">环境更新</div>-->

<!--        <el-table-->
<!--          :data="artifact_deployArray"-->
<!--          row-key="_target"-->
<!--          :expand-row-keys="expandedArtifactDeploys"-->
<!--          @expand-change="updateArtifactDeployExpanded"-->
<!--          row-class-name="my-table-row"-->
<!--          empty-text="无"-->
<!--          class="build-deploy-table"-->
<!--        >-->
<!--          <el-table-column type="expand">-->
<!--            <template slot-scope="scope">-->
<!--              <TaskDetailArtifactDeploy :deploy="scope.row.artifact_deploySubTask" :workflowName="workflowName" :taskID="taskID" />-->
<!--            </template>-->
<!--          </el-table-column>-->

<!--          <el-table-column prop="_target" label="服务" min-width="200px">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{$utils.showServiceName(scope.row._target)}}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->

<!--          <el-table-column min-width="200px">-->
<!--            <template slot="header">交付物部署</template>-->
<!--            <template slot-scope="scope">-->
<!--              <span :class="scope.row.buildOverallColor">{{ scope.row.buildOverallStatusZh }}</span>-->
<!--              {{ scope.row.buildOverallTimeZh }}-->
<!--              <el-tooltip v-if="scope.row.buildOverallTimeZhSec<0" content="本地系统时间和服务端可能存在不一致，请同步。" placement="top">-->
<!--                <i class="el-icon-warning" style="color: red;"></i>-->
<!--              </el-tooltip>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--        </el-table>-->
<!--      </template>-->

<!--      <div v-if="testArray.length > 0" class="primary-title not-first-child">产品测试</div>-->

      <template >
        <span class="secondary-title">自动化测试</span>
        <el-table
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
              <span></span>
            </template>
          </el-table-column>

          <el-table-column label="运行状态">
            <template slot-scope="scope">
              <span></span>
              <el-tooltip  content="本地系统时间和服务端可能存在不一致，请同步。" placement="top">
                <i class="el-icon-warning" style="color: red;"></i>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column label="测试报告">
            <template slot-scope="scope">
              <span  class="show-test-result">
                <router-link >查看</router-link>
              </span>
            </template>
          </el-table-column>

          <el-table-column label="文件导出">
            <template slot-scope="scope">
              <span
                @click="artifactModalVisible=true"
                class="download-artifact-link"
              >下载</span>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template >
        <div class="primary-title not-first-child">分发部署</div>

        <el-table
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

            </template>
          </el-table-column>
          <el-table-column prop="_target" label="服务" min-width="200px">
            <template slot-scope="scope">
              <span></span>
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
        status: 'failed'
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
    showOperation() {
      if (this.taskDetail.status === 'failed') {
        return true
      }
    },
    rerun() {
      this.$message.success('任务已重新启动')
    },
    cancel() {
      this.$message.success('任务取消成功')
    },
    getTerminalAddr(json, item) {
      const params = item.row.split(',')
      const len = params.length
      let addr = item.link
      for (let i = 0; i < len; i++) {
        const currParam = this.getTextValue(json, params[i])
        addr = addr.replace('{' + (i + 1) + '}', currParam)
      }
      return addr
    },
    getExternalLink(json, item) {
      if (item['link'].startsWith('@')) {
        return getTextValue(json, item['link'].substring(1))
      } else {
        let linkUrl = item['link']
        const tags = item['tag'].split(',')
        const len = tags.length
        for (let i = 0; i < len; i++) {
          const tag = this.getComplexOrDefValue(json, tags[i])
          linkUrl = linkUrl.replace('{' + (i + 1) + '}', tag)
        }
        return linkUrl
      }
    }

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
  .workflow-task-detail {
    position: relative;
    flex: 1;
    box-sizing: border-box;
    height: 100%;
    padding: 24px 30px;
    overflow: auto;

    .workflow-basic-info {
      display: flex;

      .basic-left {
        flex: 0 1 30%;
      }

      .basic-right {
        flex: 1 1 70%;

        &.version-info {
          flex-basis: 50%;
          margin-left: 18%;
        }
      }
    }

    /deep/.el-form {
      .el-form-item__content {
        color: #4a4a4a;
      }
    }

    .version-link,
    .download-artifact-link {
      color: #0066ff;
      cursor: pointer;
    }

    .build-deploy-table,
    .test-table,
    .release-table {
      span[class^='color-'] {
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

    .show-test-result {
      a {
        color: #0066ff;
        cursor: pointer;
      }
    }

    .issue-name-wrapper {
      display: block;

      a {
        margin-right: 4px;
        color: #0066ff;
      }
    }

    .build-summary {
      .repo-name {
        font-size: 15px;
      }

      .link a {
        cursor: pointer;
      }

      .el-row {
        margin-bottom: 5px;
      }
    }
  }

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

  .description {
    margin-top: 10px;
    color: #606266;
    font-size: 14px;
  }
  
</style>

