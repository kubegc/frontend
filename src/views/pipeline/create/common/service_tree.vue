<template>
  <div class="service-container">
    <!--end of workspace-tree-dialog-->
    <el-dialog title="请选择代码库平台"
               @close="closeSelectRepo"
               center
               :append-to-body="true"
               :close-on-click-modal="false"
               custom-class="dialog-source"
               :visible.sync="dialogImportFileVisible">
      <div class="from-code-container">

        <el-form :model="source"
                 ref="sourceForm"
                 label-width="140px">
          <el-form-item label="托管平台"
                        prop="codehostId">
            <el-select v-model="source.codehostId"
                       size="small"
                       style="width: 100%;"
                       placeholder="请选择托管平台"
                       @change="getRepoOwnerById(source.codehostId)"
                       filterable>
            </el-select>
          </el-form-item>
          <el-form-item label="代码库拥有者"
                        prop="repoOwner">
            <el-select v-model.trim="source.repoOwner"
                       size="small"
                       style="width: 100%;"
                       remote
                       :loading="searchRepoOwnerLoading"
                       allow-create
                       clearable
                       placeholder="请选择代码库拥有者"
                       filterable>
            </el-select>
          </el-form-item>
          <template>
            <el-form-item label="代码库名称"
                          prop="repoName">
              <el-select @change="getBranchInfoById(source.codehostId,source.repoOwner,source.repoName)"
                         @clear="clearRepoName"
                         remote
                         :remote-method="searchRepoName"
                         :loading="searchRepoNameLoading"
                         style="width: 100%;"
                         allow-create
                         clearable
                         size="small"
                         placeholder="请选择代码库"
                         filterable>
              </el-select>
            </el-form-item>
            <el-form-item label="分支"
                          prop="branchName">
              <el-select v-model.trim="source.branchName"
                         placeholder="请选择"
                         style="width: 100%;"
                         size="small"
                         filterable
                         allow-create
                         clearable>
              </el-select>
            </el-form-item>
            <el-form-item prop="path"
                          label="文件路径：">
              {{ source.path}}
              <el-button @click="openFileTree"
                         :disabled="!showSelectFileBtn"
                         type="primary"
                         plain
                         size="mini"
                         round>选择文件目录</el-button>
              <span class="preload-error">当前服务名称和选中的文件夹名称不符，请重新选择</span>
              <div class="preload-container">
                <span class="contains">
                  包含服务:
                </span>
                <span :key="index"
                      class="service-name">
                  {{service}}
                </span>
              </div>

            </el-form-item>
          </template>

        </el-form>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button size="small"
                   :loading="importLoading"
                   :disabled="disabledReload"
                   @click="loadRepoService()"
                   plain>加载</el-button>
      </span>
    </el-dialog>
    <div class="menu-container">
      <el-row>
        <el-col :span="10">
          <div class="source-dropdown">
            <el-radio-group v-model="mode"
                            size="mini">
              <el-tooltip effect="dark"
                          content="服务管理"
                          placement="top">
                <el-radio-button label="edit">
                  <i class="iconfont iconiconlog"> </i>
                </el-radio-button>
              </el-tooltip>
              <el-tooltip effect="dark"
                          content="服务编排"
                          placement="top">
                <el-radio-button label="arrange">
                  <i class="iconfont iconfuwu"></i>
                </el-radio-button>
              </el-tooltip>
            </el-radio-group>
          </div>
        </el-col>
        <el-col :span="14"
                class="text-right">
          <div style="line-height: 32px;">
            <el-tooltip effect="dark"
                        content="创建服务"
                        placement="top">
              <el-button size="mini"
                         icon="el-icon-plus"
                         @click="createService('platform')"
                         plain
                         circle>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark"
                        content="仓库托管"
                        placement="top">
              <el-button size="mini"
                         @click="createService('repo')"
                         icon="iconfont icon icongit"
                         plain
                         circle></el-button>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="tree-container">
      <div class="add-new-service">
        <el-form :model="service"
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
                      placeholder="请输入服务名称"></el-input>
          </el-form-item>

        </el-form>
      </div>

    </div>
  </div>

</template>

<script>
export default {
  data () {
    return {
      mode: 'edit',
      service: {
        newServiceName: ''
      },
      showHover: {},
      searchService: '',
      serviceGroup: [],
      allCodeHosts: [],
      selectedEnvs: [],
      updateEnvDialogVisible: false,
      importLoading: false,
      searchRepoNameLoading: false,
      searchRepoOwnerLoading: false,
      workSpaceModalVisible: false,
      dialogImportFileVisible: false,
      showNewServiceInput: false,
      showDragContainer: false,
      showSelectPath: true,
      disabledReload: false,
      codeInfo: {
        repoOwners: [],
        repos: [],
        branches: []
      },
      source: {
        codehostId: null,
        repoOwner: '',
        repoUUID: '',
        repoName: '',
        branchName: '',
        remoteName: '',
        gitType: '',
        services: [],
        path: '',
        isDir: false
      },

      previousNodeKey: ''
    }
  },

  methods: {
    async getProducts() {
      await this.$store.dispatch('getProductList')
    },
    openFileTree() {
      if (this.showSelectFileBtn) {
        this.workSpaceModalVisible = true
      }
    },

    closeSelectRepo() {
      this.source = {
        codehostId: null,
        repoOwner: '',
        repoUUID: '',
        repoName: '',
        branchName: '',
        remoteName: '',
        gitType: ''
      }
      this.showSelectPath = true
      this.$refs.sourceForm.resetFields()
    },
  },

  watch: {
    filteredServices: {
      handler (val, old_val) {
        this.$nextTick(() => {
          let data = null
          const serviceInRoute = val.find(d => d.service_name === this.queryServiceName)
          if (serviceInRoute) {
            data = serviceInRoute
          } else {
            data = val[0]
          }
          if (data && !this.showNewServiceInput) {
            this.setServiceSelected(data.service_name)
            this.$router.replace({ query: { service_name: data.service_name, rightbar: (data.status === 'named' ? 'help' : 'var') } })
            this.$emit('onSelectServiceChange', data)
          }
        })
        this.$nextTick(() => {
          this.listenResize()
        })
      }
    },
    filteredSharedServices: {
      handler (val, old_val) {
        this.$nextTick(() => {
          this.listenResize()
        })
      },
      immediate: true
    },
  },
  created () {
    this.getProducts()
  }
}
</script>

<style lang="less" >
  .dialog-source {
    .el-dialog__footer {
      padding: 0 20px 20px;
    }

    .el-dialog__body {
      padding: 0 25px 0;
    }

    .preload-error {
      color: #ff1949;
      font-size: 12px;
    }

    .preload-container {
      .service-name,
      .contains {
        color: #909399;
        font-size: 13px;
      }

      .service-name {
        color: #303133;
      }
    }
  }

  .service-tree-container {
    position: relative;
    padding: 0 5px;
    overflow: auto;
    font-size: 13px;
    background-color: #fff;

    .service-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .menu-container {
      display: flex;
      flex: 0 0 auto;

      .el-row {
        width: 100%;
        margin-top: 4px;
      }

      .icon {
        font-size: 12px;
      }
    }

    .tree-container {
      display: flex;
      flex: 1 0 auto;
      flex-direction: column;
      height: calc(~'100% - 400px');

      .el-tree {
        overflow: auto;

        .el-tree__empty-block {
          display: none;
        }
      }
    }

    .search-container,
    .shared-services-container {
      flex: 0 0 auto;
      padding: 10px 0;
    }

    .shared-services-container {
      height: 150px;
      border-top: 1px solid #c0c4cc;
      border-bottom: 1px solid #c0c4cc;

      .el-tree {
        max-height: 150px;
        overflow: auto;
      }
    }

    .el-tree-node {
      margin: 5px 0;

      .el-tree-node__content {
        .el-tree-node__expand-icon {
          padding: 0;
        }
      }

      .service-mgr-tree-node {
        position: relative;
        display: inline-block;
        width: 100%;
        line-height: 30px;

        .service-status {
          display: inline-block;
          width: 6px;
          height: 6px;
          vertical-align: middle;
          border-radius: 50%;

          &.new,
          &.named {
            background: #1989fa;
          }

          &.error {
            background: #ff1949;
          }
        }

        .service-type {
          vertical-align: middle;
        }

        .tree-service-name {
          display: inline-block;
          width: calc(~'100% - 115px');
          overflow-x: hidden;
          font-size: 13px;
          text-overflow: ellipsis;
          vertical-align: middle;

          &.kind {
            width: 200px;
            margin-left: 20px;
          }

          &.shared-list {
            width: 180px;
          }
        }

        .operation-container {
          display: inline-block;
          vertical-align: middle;

          .el-button + .el-button {
            margin-left: 3px;
          }
        }

        .basic-info {
          float: right;
          padding-right: 40px;

          .mod-time,
          .size {
            padding-left: 35px;
            color: #c0c4cc;
          }
        }
      }
    }

    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
      background-color: #1989fa33;
    }

    .add-new-service {
      margin-top: 10px;
      padding-left: 20px;
      color: #606266;
      vertical-align: middle;

      .el-input {
        width: 150px;
      }

      &.drag-container {
        height: 60px;
        background: #ebeef570;
        border: 1px dashed #ccc;
        border-radius: 3px;
      }
    }
  }

.text-right {
  text-align: right;
}
</style>
