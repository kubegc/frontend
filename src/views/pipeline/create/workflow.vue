<template>
  <div class="workflow-task-detail">
    <el-row>
      <el-col :span="6">

        <div class="section-head">
          基本信息
        </div>

        <el-form class="basic-info"
                 label-width="100px">
          <el-form-item label="状态">
            正常
          </el-form-item>
          <el-form-item label="创建者">
            {{ loginForm.username }}
          </el-form-item>
          <el-form-item label="集成环境" />
          <el-form-item label="持续时间" />
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
      </el-col>

      <el-col :span="14">
        <div class="section-head">构建信息</div>
        <div class="build-summary">
          <el-table style="width: 100%;">
            <el-table-column label="服务" width="160" />
            <el-table-column label="代码"><span> 暂无代码 </span></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <div class="section-head">
      环境更新
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
    </div>
  </div>
</template>

<script>
  import { handleCreateTemplateChange, getTextValue, getComplexOrDefValue } from '@/api/common'
  export default {
    data() {
      return {
        loginForm: {
          username: 'admin'
        },
        taskDetail: {
          status: 'failed'
        },
        tableData: [{
          service: '123',
          pr: '123',
          category: '123',
          deploy: '123',
          address: '123',
          shop: '123',
          shopId: '123'
        }],
        pageSpec: {
          description: {
            activeName: '1',
            activeDesc: ''
          },

          // formSearch
          formSearch: {
            formSearchJson: {},
            formSearchVisible: false
          },

          // table
          table: {
            tableData: [],
            tableLoading: true,
            tableItems: {},
            tableColumns: [],
            tableItemsSize: 0
          },

          // action
          actions: []
        }
      }
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
      },
      handleCreateTemplateChange,
      getTextValue,
      getComplexOrDefValue
    }
  }
</script>

<style lang="less">
  .workflow-task-detail {
    margin-bottom: 350px;
    position: relative;
    flex: 1;
    padding: 0 20px;
    overflow: auto;
    .box-card,
    .basic-info,
    .build-deploy-table{
      margin-top: 10px;
    }
    .section-head {
      margin-top: 30px;
      color: #303133;
      font-size: 20px;
      line-height: 20px;
      border-bottom: 1px solid #eee;
      .item-title {
        margin-bottom: 10px;
      }
    }
    .build-summary {
      .link a {
        color: #1989fa;
        cursor: pointer;
      }
    }

    .el-form-item{
      margin-bottom: 0;
    }

    .el-form-item__label {
      text-align: left;
    }
    .demo-table-expand {
      font-size: 0;
    }
    .demo-table-expand label {
      width: 90px;
      color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
    .task-process {
      padding: 0 40px;
      background-color: #fff;
    }

    .log-container {
      padding-bottom: 15px;

      .log-content {
        .el-collapse-item__content {
          padding-bottom: 0;
        }

        .el-collapse-item__arrow {
          margin-right: 16px;
        }

        /*pre {*/
        /*  clear: left;*/
        /*  min-height: 42px;*/
        /*  margin-top: 0;*/
        /*  margin-bottom: 0;*/
        /*  padding: 15px 10px;*/
        /*  padding-top: 8px;*/
        /*  color: #f1f1f1;*/
        /*  font-size: 12px;*/
        /*  font-family: Monaco, monospace;*/
        /*  line-height: 18px;*/
        /*  white-space: pre-wrap;*/
        /*  word-wrap: break-word;*/
        /*  background-color: #222;*/
        /*  transform: translateZ(0); //trig GPU*/
        /*  counter-reset: line-numbering;*/

        /*  p {*/
        /*    min-height: 16px;*/
        /*    margin: 0;*/
        /*    padding: 0 15px 0 16px;*/
        /*    cursor: pointer;*/

        /*    &:hover {*/
        /*      background-color: #444;*/
        /*    }*/
        /*  }*/
        /*}*/
      }
    }
  }
</style>
