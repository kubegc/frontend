<template>
  <div class="service-container">
<!--    <el-dialog title="是否更新对应环境？"-->
<!--               :append-to-body="true"-->
<!--               v-if="envNameList.length"-->
<!--               :visible.sync="updateEnvDialogVisible"-->
<!--               width="40%">-->
<!--      <el-checkbox-group v-model="selectedEnvs">-->
<!--        <el-checkbox v-for="(env,index) in envNameList"-->
<!--                     :key="index"-->
<!--                     :label="env.envName"></el-checkbox>-->
<!--      </el-checkbox-group>-->
<!--      <span slot="footer"-->
<!--            class="dialog-footer">-->
<!--        <el-button size="small"-->
<!--                   type="primary"-->
<!--                   @click="autoUpgradeEnv">确 定</el-button>-->
<!--        <el-button size="small"-->
<!--                   @click="updateEnvDialogVisible = false">跳过</el-button>-->

<!--      </span>-->
<!--    </el-dialog>-->
<!--    start of workspace-tree-dialog-->
    <el-dialog :append-to-body="true"
               :visible.sync="workSpaceModalVisible"
               width="60%"
               title="请选择要同步的文件或文件目录"
               class="fileTree-dialog">
<!--      <gitfile-tree ref="worktree"-->
<!--                    :codehostId="source.codehostId"-->
<!--                    :repoName="source.repoName"-->
<!--                    :repoUUID="source.repoUUID"-->
<!--                    :repoOwner="source.repoOwner"-->
<!--                    :branchName="source.branchName"-->
<!--                    :remoteName="source.remoteName"-->
<!--                    :gitType="source.gitType"-->
<!--                    @getPreloadServices="getPreloadServices"-->
<!--                    :showTree="workSpaceModalVisible"></gitfile-tree>-->
    </el-dialog>
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
                 :rules="sourceRules"
                 ref="sourceForm"
                 label-width="140px">
          <div v-for="row in guideItems.rows"
               :key="row.index"
               :gutter="guideItems.gutter" class="second">
            <div v-for="item in row.items"
                 :key="item.index"
                 :span="item.span"
                 :title="item.description"><div v-if="item.type == 'span2'">{{item.description}}</div></div>
          <el-form-item label="托管平台"
                        prop="codehostId"
                        :rules="{required: true, message: '平台不能为空', trigger: 'change'}">
            <el-select v-model="source.codehostId"
                       size="small"
                       style="width: 100%;"
                       placeholder="请选择托管平台"
                       @change="getRepoOwnerById(source.codehostId)"
                       filterable>
              <el-option v-for="item in row.items"
                         :key="item.index"
                         :span="item.span"
                         :title="item.description">{{`${host.address}
                    ${host.type==='github'?'('+host.namespace+')':''}`}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="代码库拥有者"
                        prop="repoOwner"
                        :rules="{required: true, message: '代码库拥有者不能为空', trigger: 'change'}">
            <el-select v-model.trim="source.repoOwner"
                       size="small"
                       style="width: 100%;"
                       @change="getRepoNameById(source.codehostId,source.repoOwner)"
                       @clear="clearRepoOwner"
                       remote
                       :remote-method="searchRepoOwner"
                       :loading="searchRepoOwnerLoading"
                       allow-create
                       clearable
                       placeholder="请选择代码库拥有者"
                       filterable>
              <el-option v-for="(repo,index) in codeInfo['repoOwners']"
                         :key="index"
                         :label="repo.path"
                         :value="repo.path">
              </el-option>
            </el-select>
          </el-form-item>
          <template>
            <el-form-item label="代码库名称"
                          prop="repoName"
                          :rules="{required: true, message: '名称不能为空', trigger: 'change'}">
              <el-select @change="getBranchInfoById(source.codehostId,source.repoOwner,source.repoName)"
                         @clear="clearRepoName"
                         v-model.trim="source.repoName"
                         remote
                         :remote-method="searchRepoName"
                         :loading="searchRepoNameLoading"
                         style="width: 100%;"
                         allow-create
                         clearable
                         size="small"
                         placeholder="请选择代码库"
                         filterable>
                <el-option v-for="item in row.items"
                           :key="item.index"
                           :span="item.span"
                           :title="item.description">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分支"
                          prop="branchName"
                          :rules="{required: true, message: '分支不能为空', trigger: 'change'}">
              <el-select v-model.trim="source.branchName"
                         placeholder="请选择"
                         style="width: 100%;"
                         size="small"
                         filterable
                         allow-create
                         clearable>
                <el-option v-for="item in row.items"
                           :key="item.index"
                           :span="item.span"
                           :title="item.description">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="path"
                          label="文件路径："
                          :rules="{required: true, message: '请选择文件', trigger: 'change'}">
              {{ source.path}}
              <el-button v-if="showSelectPath"
                         @click="openFileTree"
                         :disabled="!showSelectFileBtn"
                         type="primary"
                         plain
                         size="mini"
                         round>选择文件目录</el-button>
              <span v-if="disabledReload"
                    class="preload-error">当前服务名称和选中的文件夹名称不符，请重新选择</span>

            </el-form-item>
          </template>
         </div>
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
                  <i class="iconfont el-icon-tickets"> </i>
                </el-radio-button>
              </el-tooltip>
              <el-tooltip effect="dark"
                          content="服务编排"
                          placement="top">
                <el-radio-button label="arrange">
                  <i class="iconfont el-icon-menu"></i>
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
              <el-button
                         size="mini"
                         icon="el-icon-plus"
                         @click="ImportFileVisible = true"
                         plain
                         circle>
              </el-button>
            </el-tooltip>
            <el-tooltip
                        effect="dark"
                        content="仓库托管"
                        placement="top">
              <el-button size="mini"
                         @click="dialogImportFileVisible = true"
                         icon="el-icon-share"
                         plain
                         circle></el-button>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="tree-container">
      <keep-alive>
        <el-tree v-if="mode==='edit'"
                 ref="serviceTree"
                 :data="filteredServices"
                 :show-checkbox="false"
                 node-key="service_name"
                 @node-click="selectService"
                 default-expand-all
                 highlight-current
                 check-on-click-node
                 :indent="0"
                 :expand-on-click-node="false">
          <span @mouseover="setHovered(data.service_name)"
                @mouseleave="unsetHovered(data.service_name)"
                class="service-mgr-tree-node"
                slot-scope="{ node, data }">
            <span class="service-status"
                  :class="data.status"></span>
            <i v-if="data.type==='k8s'"
               class="service-type iconfont iconrongqifuwu"></i>
            <el-tooltip v-if="data.type!=='kind' && data.visibility==='public' && data.product_name!==projectName"
                        effect="light"
                        placement="top">
            </el-tooltip>
            <span v-else
                  class="tree-service-name"
                  :class="{'kind':data.type==='kind'?true:false}">
              <span class="label">{{node.label}}</span>
            </span>
            <template>
              <el-tag v-if="data.visibility==='public'"
                      type="info"
                      effect="plain"
                      class="operation-container"
                      size="mini">共享
              </el-tag>
              <el-button v-if="data.status==='named' && data.type==='k8s'"
                         type="text"
                         size="mini"
                         class="operation-container"
                         icon="el-icon-edit-outline"
                         @click.stop="() => reEditServiceName(node, data)">
              </el-button>
              <span :style="{'visibility': showHover[data.service_name] ? 'visible': 'hidden'}"
                    class="operation-container">
                <el-button v-if="(data.product_name===projectName||data.status === 'named')"
                           type="text"
                           size="mini"
                           icon="el-icon-close"
                           @click.stop="() => deleteService(node, data)">
                </el-button>
                <el-button v-else-if="data.product_name!==projectName && data.type ==='k8s'"
                           type="text"
                           size="mini"
                           icon="el-icon-close"
                           @click.stop="() => deleteSharedService(node, data)">
                </el-button>
                <el-button v-if="data.source && (data.source === 'gerrit'|| data.source === 'gitlab' || data.source==='github' || data.source==='codehub' ) && data.type==='k8s' && data.product_name=== projectName "
                           type="text"
                           size="mini"
                           icon="el-icon-refresh"
                           @click="() => refreshService(node, data)">
                </el-button>
              </span>

            </template>

          </span>
        </el-tree>
      </keep-alive>
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
      <el-tree v-if="mode==='arrange' && deployType === 'k8s'"
               :data="serviceGroup"
               :show-checkbox="false"
               node-key="id"
               draggable
               :allow-drop="allowDrop"
               :allow-drag="allowDrag"
               @node-drop="handleDrop"
               @node-drag-start="startDrag"
               @node-drag-end="endDrag"
               default-expand-all
               :expand-on-click-node="false">
        <span class="service-mgr-tree-node"
              slot-scope="{ node, data }">
          <span class="service-status"
                :class="data.status"></span>
          <span class="tree-service-name">{{ node.label }}</span>
        </span>
      </el-tree>
      <div v-if="mode==='arrange' && showDragContainer"
           class="add-new-service drag-container">
      </div>
    </div>
    <div
         class="shared-services-container">
      <el-tree ref="serviceSharedTree"
               :data="filteredSharedServices"
               :show-checkbox="false"
               node-key="service_name"
               default-expand-all
               highlight-current
               check-on-click-node
               :indent="0"
               :expand-on-click-node="false">
        <span @mouseover="setHovered(data.service_name)"
              @mouseleave="unsetHovered(data.service_name)"
              class="service-mgr-tree-node"
              slot-scope="{ node, data }">
          <i v-if="data.type==='k8s'"
             class="service-type el-icon-share"></i>
          <el-tooltip v-if="node.label!=='共享服务列表'"
                      effect="light"
                      :content="`所属项目：${data.product_name}`"
                      placement="bottom">
            <span class="tree-service-name shared-list">
              {{`${node.label}`}}
            </span>
          </el-tooltip>
          <span v-else
                class="tree-service-name shared-list">
            {{`${node.label}`}}
          </span>
          <span v-if="data.label!=='共享服务列表' && showHover[data.service_name] "
                class="operation-container">
            <el-button v-if="data.product_name!==projectName"
                       type="text"
                       size="mini"
                       icon="el-icon-plus"
                       @click="() => addSharedService(node, data)">
            </el-button>
          </span>
        </span>
      </el-tree>

    </div>
    <div v-if="mode==='edit'"
         class="search-container">

      <el-input placeholder="搜索服务"
                size="small"
                clearable
                suffix-icon="el-icon-search"
                v-model="searchService">
      </el-input>
    </div>
  </div>

</template>

<script>
// import gitfileTree from '@/components/common/gitfile_tree.vue'
// import { deleteServiceTemplateAPI, autoUpgradeEnvAPI, getSingleProjectAPI, updateEnvTemplateAPI, getCodeSourceAPI, getRepoOwnerByIdAPI, getRepoNameByIdAPI, getBranchInfoByIdAPI, loadRepoServiceAPI, validPreloadService, getCodeSourceByAdminAPI } from '@api'
// import { mapGetters } from 'vuex'
import axios from 'axios'

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
      ImportFileVisible: false,
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
      sourceRules: {
        url: [{
          required: true,
          message: '请输入 URL 地址',
          trigger: 'blur'
        },
          {
            type: 'url',
            message: '请输入正确的 URL，包含协议',
            trigger: ['blur', 'change']
          }]
      },
      serviceRules: {
        newServiceName: [
          {
            type: 'string',
            required: true,
            validator: this.validateServiceName,
            trigger: ['blur', 'change']
          }
        ]
      },
      guideItems:[],
      previousNodeKey: ''
    }
  },

  methods: {
    readGuideItems() {
      axios.get('/getDescription').then((response) => {
        if(response.data){
          this.guideItems = response.data.data
        }
      })
    },
  },
  computed: {},
  watch: {
  },
  created () {
    // this.getProducts()
    // this.getServiceGroup()
  },
  mounted () {

      this.readGuideItems()
    // window.addEventListener('resize', this.listenResize)
  },
  beforeDestroy () {
    // window.removeEventListener('resize', this.listenResize)
  },
  components: {
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
    height: 300px;
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
