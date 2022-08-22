<template>
  <div class="project-home-container">
    <div class="project-header">
      <div class="header-start">
        <i class="el-icon-menu display-btn" @click="currentTab = 'grid'" :class="{'active':currentTab==='grid'}"></i>
        <i class="el-icon-s-fold display-btn" @click="currentTab = 'list'" :class="{'active':currentTab==='list'}"></i>
      </div>
      <div class="header-end">
        <el-button @click="$router.push('/t/t1/t2')" style="width: 132px; margin-right: 10px;" plain>
          <i class="el-icon-plus"></i>新建项目
        </el-button>
      </div>
    </div>

    <div
      v-if="currentTab==='grid'"
      class="projects-grid">
      <el-row :gutter="12">
        <el-col v-for="(Data,index) in $store.state.tableData" :key="index" :xs="12" :sm="8" :md="6" :lg="6" :xl="4">
          <el-card shadow="hover" class="project-card">
            <div class="operations">
              <el-dropdown @command="handleCommand" trigger="click">
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{action:'edit',projectName:Data.name}">修改</el-dropdown-item>
                  <el-dropdown-item :command="{action:'delete',projectName:Data.name}">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div @click="$router.push(`/project/detail/1`)" class="content-container">
              <h4 class="project-name">
                <el-tooltip effect="dark" :content="Data.name" placement="top">
                  <span class="name">{{111}}</span>
                </el-tooltip>
              </h4>
            </div>
            <div class="footer">
              <el-tooltip effect="dark" content="工作流" placement="top">
                <span class="icon iconfont el-icon-s-unfold"></span>
              </el-tooltip>
              <el-tooltip effect="dark" content="环境" placement="top">
                <span class="icon iconfont el-icon-orange"></span>
              </el-tooltip>
              <el-tooltip effect="dark" content="测试" placement="top">
                <span class="icon iconfont el-icon-s-platform"></span>
              </el-tooltip>
              <el-tooltip effect="dark" content="服务" placement="top">
                <span class="icon iconfont el-icon-box"></span>
              </el-tooltip>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!--      <div v-if="projectList.length === 0" class="empty-list">-->
      <!--        <img src="@assets/icons/illustration/project.svg" alt />-->
      <!--        <p>暂无可展示的项目，请手动添加项目</p>-->
      <!--      </div>-->
    </div>

        <el-row>
          <el-col :span="6">
            <div class="section-head">
              <div class="controls__wrap">
                <div class="controls__right">
    <!--              <router-link :to="`/t/t1/t2`">-->
                    <el-button type="primary"
                               class="save-btn"
                               @click="addParamsSetting"
                               v-model="tableData"
                            plain>新建流水线</el-button>
    <!--              </router-link>-->
                  <div class="run-button">
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
    <el-row
      v-for="row in pipelineItems.rows"
      :key="row.index"
      :gutter="pipelineItems.gutter"
    />
    <el-dialog
      :modal="true"
      :fullscreen="fullscreen"
      custom-class="dialog-custom"
      :visible.sync="dialog"
      width="90%"
      top="5vh"
    >
      <div>
        <pipeline/>
      </div>
    </el-dialog>

    <div
      v-if="currentTab==='list'"
      class="projects-list">
      <el-table
        :data="$store.state.tableData"
        style="width: 100%">
        <el-table-column prop="type" label="类型" min-width="40%">
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="80%">
        </el-table-column>
        <el-table-column prop="env" label="更新信息" min-width="80%">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="small">
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="small"
              @click.native.prevent="deleteRow(scope.$index)"
              v-model="tableData">
            </el-button>
          </template>
          <!--        <el-button-->
          <!--          type="danger"-->
          <!--          icon="el-icon-delete">取消-->
          <!--        </el-button>-->
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top:15px;">
        <el-pagination
          align='center'
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10,20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length">
        </el-pagination>
      </div>
    </div>

        <el-table
          :data="tableData"
          v-loading="tableLoading"
          style="width: 100%" >
          <el-table-column label="序号" prop="index" min-width="40%">
          </el-table-column>
          <el-table-column prop="type" label="类型" min-width="80%">
          </el-table-column>
          <el-table-column prop="name" label="名称" min-width="80%">
          </el-table-column>
          <el-table-column  label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="small">
              </el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="small"
                @click.native.prevent="deleteRow(scope.$index)"
                v-model="tableData">
              </el-button>
            </template>
            <el-button
              type="danger"
              icon="el-icon-delete">取消
            </el-button>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top:15px;">
          <el-pagination
            align='center'
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10,20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length">
          </el-pagination>
        </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { getUserList } from '../../../api/api'
  import pipeline from '../pipeline'

  export default {
    components: { pipeline },
    data() {
      return {
        pipelineItems: [],
        getUserList: [],
        tableData: [],
        currentTab: 'grid',
        dialog: false,
        fullscreen: false,
        currentPage: 1,
        total: 20,
        pageSize: 2
      }
    },
    mounted() {
      this.pipelinelength()
      // this.initPage()
    },
    methods: {
      createDialog() {
        this.dialog = true
      },
      pipelinelength() {
        axios.get('/getPipelineItems').then(response => {
          while (response.data < 100) {
            return response.data.data
          }
        })
      },

      next() {
        if (this.active++ > 3) this.active = 0
      },
      //
      // initPage() {
      //   getUserList().then(res => {
      //     if (res) {
      //       console.log('getUserListres', res.data.data)
      //       this.tableData = this.$store.state.tableData
      //     }
      //   })
      // },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.currentPage = 1
        this.pageSize = val
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.currentPage = val
      },

      findAllorder(name) {
        console.log(name)
      },
      addList() {
        this.tableData.push({
          index: '',
          type: '',
          name: ''
        })
      },
      addParamsSetting() {
        this.addList()
        this.submitForm()
      },
      deleteRow(index) {
        this.tableData.splice(index, 1)
      },
      handleCommand(command) {
        if (command.action === 'delete') {
          this.deleteRow(command.name)
        } else if (command.action === 'edit') {
          this.$router.push(`/test/test2/test3`)
        }
      }
    }
  }
</script>

<style lang="less">
  .project-home-container {
    position: relative;
    flex: 1;
    height: 100%;
    overflow: auto;
    background-color: #f6f6f6;

    .empty-list {
      display: flex;
      flex-direction: column;
      align-content: center;
      align-items: center;
      justify-content: center;
      height: 70%;

      img {
        width: 400px;
        height: 400px;
      }

      p {
        color: #606266;
        font-size: 15px;
      }
    }

    .project-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      padding-right: 80px;
      padding-left: 26px;
      background: #fff;

      .header-start {
        flex: 0 0 auto;
        padding: 5px 10px;
        font-size: 20px;
        background-color: #fff;
        border: 1px solid #d2d7dc;
        border-radius: 4px;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

        .display-btn {
          color: #888888;
          cursor: pointer;

          &:not(:last-child) {
            margin-right: 8px;
          }

          &:hover,
          &.active {
            color: #0066ff;
          }
        }
      }

      .header-end {
        .el-button {
          padding: 10px 15px;
          color: #0066ff;
          font-weight: 400;
          font-size: 14px;
          background-color: #fff;
          border: 1px solid #0066ff;
          border-radius: 4px;
          box-shadow: 0 4px 4px rgba(0, 0, 0, 0.05);
          cursor: pointer;
        }

        .iconfont {
          font-size: 14px;
        }
      }
    }

    .projects-list {
      height: calc(~'100% - 60px');
      padding: 0 20px;

      .el-table {
        .project-name {
          color: #121212;
          font-weight: 400;
          font-size: 16px;
          line-height: 22px;
          text-align: left;

          .iconprivate::before {
            color: #c8c9cc;
          }
        }

        .operation {
          margin-right: 10px;
          color: #606266;

          &:hover {
            color: #0066ff;
          }
        }
      }
    }

    .projects-grid {
      height: calc(~'100% - 84px');
      padding: 12px;

      .project-card {
        height: 142px;
        margin-bottom: 12px;
        border: 2px solid #fff;
        border-radius: 6px;
        box-shadow: 1px 1px 10px rgba(0,0,0,0.15) !important;

        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }

        .el-card__body {
          position: relative;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          height: 100%;
          padding: 15px;

          &.add {
            font-size: 30px;
            text-align: center;

            .text {
              margin: auto 0;
              padding: 40px;

              a {
                color: #7a8599;
              }

              span {
                cursor: pointer;
              }
            }
          }

          .operations {
            position: absolute;
            top: 8px;
            right: 15px;
            display: flex;
            cursor: pointer;

            i {
              color: #888;
              font-size: 20px;
              line-height: 25px;
            }
          }

          .footer {
            display: flex;
            flex-direction: row;
            align-self: flex-end;
            justify-content: flex-end;
            width: 100%;
            height: 28px;

            .icon {
              margin-left: 18px;
              color: #0066ff;
              font-size: 18px;
              line-height: 35px;
              cursor: pointer;
            }

            .operation {
              border-left: 2px solid #ebeef5;
            }
          }

          .content-container {
            flex: 1;
            height: calc(~'100% - 35px');

            .divider {
              width: 278px;
              height: 1px;
              margin-top: 14px;
              margin-bottom: 8px;
              background-color: #ccc;
            }

            .project-name {
              margin: 0;
              padding: 0;
              padding-right: 15px;
              color: #121212;
              font-weight: 400;
              font-size: 18px;
              line-height: 22px;
              cursor: pointer;

              .type-icon {
                margin-right: 6px;
                color: #0066ff;
                font-size: 20px;
                vertical-align: top;
              }

              .name {
                display: inline-block;
                max-width: calc(100% - 40px);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }

              .iconprivate::before {
                color: #c8c9cc;
              }
            }

            .icon {
              margin-left: 6px;
              color: #888888;
              vertical-align: top;
            }

            .project-desc {
              max-height: calc(100% - 32px);
              overflow: auto;
              font-size: 12px;
              line-height: 22px;
            }
          }
        }
      }
    }
  }

  .el-message-box.product-prompt {
    width: 40%;

    .el-message-box__content {
      max-height: 300px;
      overflow-y: auto;
    }
  }

  .el-dropdown-menu.el-popper.template-config {
    margin-top: 2px;

    .el-dropdown-menu__item {
      margin: 0 10px;
      padding: 0 10px;
      font-weight: 400;
      border-radius: 6px;
    }

    .popper__arrow {
      display: none;
    }
  }
</style>
