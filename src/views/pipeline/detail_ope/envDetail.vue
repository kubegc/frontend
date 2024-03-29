<template>
  <div class="env-detail-container" ref="envContainer">
        <PmHostList ref="pmHostList" :currentPmServiceData="currentPmServiceData" @success="refreshServiceList"></PmHostList>
        <el-dialog title="通过工作流升级服务" :visible.sync="showStartProductBuild" custom-class="run-workflow" width="60%">
          <run-workflow
            v-if="showStartProductBuild"
            :workflows="currentServiceWorkflows"
            :currentServiceMeta="currentServiceMeta"
            @success="hideProductTaskDialog"
          ></run-workflow>
        </el-dialog>
        <div class="envs-container">
          <ChromeTabs v-model="envName" :tabList="envNameList" :label="'name'" :name="'name'">
            <template v-slot="{ tab }">
              <span>
                <i v-if="tab.source==='helm'" class="iconfont iconhelmrepo"></i>
                <i v-else-if="tab.source==='spock'" class="el-icon-cloudy"></i>
                {{ $utils.tailCut(tab.name,14) }}
                <el-tag v-if="tab.production" effect="light" size="mini" type="danger">生产</el-tag>
                <el-tag v-if="tab.source==='external'" effect="light" size="mini" type="primary">托管</el-tag>
                <el-tag v-if="!_.isNil(tab.share_env_is_base) && tab.share_env_is_base" effect="light" size="mini" type="primary">基准环境</el-tag>
                <el-tag
                  v-if="!tab.share_env_is_base && !_.isNil(tab.share_env_base_env) && tab.share_env_base_env !==''"
                  effect="light"
                  size="mini"
                  type="primary"
                >子环境</el-tag>
              </span>
            </template>
          </ChromeTabs>
        </div>
    <div class="banner">
      <el-alert :closable="false" type="warning">
        <span slot="title">
          注意：使用基准环境
          <span class="bold">{{111}}</span>的访问地址，并在请求的 Header 中加上
          <span class="bold">{{222}}</span>即可将流量转发到当前环境中。
          <a href="https://docs.koderover.com/zadig/env/self-test-env/" target="_blank"
             rel="noopener noreferrer">如何操作？</a>
        </span>
      </el-alert>
      <el-alert
        :title="`注意：自测模式正在${shareEnvStatus.operation ==='enable'?'开启':'关闭'}，过程中服务会重启，短时间内会影响服务的正常访问，请耐心等待。`"
        :closable="false"
        type="warning"
      ></el-alert>
    </div>

    <div class="info-container">
      <!--start of basicinfo-->
      <div
        v-loading="envLoading"
        element-loading-text="正在获取环境基本信息"
        element-loading-spinner="el-icon-loading"
        class="common-parcel-block basic-info-content"
      >
        <el-row :gutter="10">
          <el-col v-if="!pmServiceList.length" :span="12">
            <div class="grid-title">K8s 集群</div>
            <div v-if="productInfo.is_local" class="grid-content">本地集群</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-title">更新时间</div>
            <div class="grid-content"></div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12" v-if="!pmServiceList.length">
            <div class="grid-title">K8s 命名空间</div>
            <div class="grid-content">{{ envText }}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-title">环境状态</div>
            <div class="grid-content">{{getProdStatus(productInfo.status,productStatus.updatable)}}</div>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <!-- pm and hosting project don't show registry -->
          <el-col v-if="!isPmService" :span="12">
            <div class="grid-title">镜像仓库</div>
            <div class="grid-content image-registry">
              <div v-if="editImageRegistry === false">
                <span>{{imageRegistryDesc}}</span>
                <i v-hasPermi="{projectName: projectName, action: 'config_environment'}"
                   class="icon el-icon-edit icon-primary" @click="editImageRegistry = true"></i>
              </div>
              <div v-else>
                <el-select v-model="productInfo.editRegistryID" size="mini">
                  <el-option
                    v-for="registry in imageRegistry"
                    :key="registry.id"
                    :label="registry.namespace?`${registry.reg_addr}/${registry.namespace}`:registry.reg_addr"
                    :value="registry.id"
                  ></el-option>
                </el-select>
                <i class="icon el-icon-circle-close icon-gray" @click="editEnvImageRegistry('cancel')">取消</i>
                <i class="icon el-icon-circle-check icon-primary" @click="editEnvImageRegistry('update')">保存</i>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-title">基本操作</div>
            <div class="grid-content operation">
              <el-tooltip
                v-hasPermi="{projectName: projectName, action: 'config_environment'}"
                v-if="checkEnvUpdate(productInfo.status) && productInfo.status!=='Disconnected' && (envSource===''||envSource==='spock'|| envSource==='helm')"
                content="更新环境中引用的变量"
                effect="dark"
                placement="top"
              >
                <el-button
                  v-if="productInfo.status!=='Creating'"
                  v-hasPermi="{projectName: projectName, action: 'config_environment'}"
                  type="primary"
                  @click="envSource==='helm' ? openUpdateHelmVar() : openUpdateK8sVar()"
                  size="mini"
                  plain
                >{{ envSource==='helm' ? '更新全局变量' : '更新环境变量' }}
                </el-button>
              </el-tooltip>
              <template v-if="productInfo.share_env_enable && productInfo.share_env_is_base">
                <router-link
                  :to="`/v1/projects/detail/${projectName}/envs/create?createShare=true&baseEnvName=${productInfo.env_name}&clusterId=${productInfo.cluster_id}`"
                >
                  <el-button v-hasPermi="{projectName: projectName, action: 'create_environment'}" type="primary"
                             size="mini" plain>创建子环境
                  </el-button>
                </router-link>
              </template>
              <template v-if="productInfo.status!=='Disconnected' && productInfo.status!=='Creating'">
                <el-dropdown v-if="envSource===''||envSource==='spock' || envSource==='helm'" trigger="click">
                  <el-button v-hasPermi="{projectName: projectName, action: 'config_environment'}" type="primary" plain>
                    管理服务
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="manageServices('add')">添加服务</el-dropdown-item>
                    <el-dropdown-item @click.native="manageServices('update')">更新服务</el-dropdown-item>
                    <el-dropdown-item @click.native="manageServices('delete')">删除服务</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-tooltip
                  v-else-if="showUpdate(productInfo,productStatus) && (!productInfo.is_prod && envSource==='pm')"
                  v-hasPermi="{projectName: projectName, action: 'config_environment'}"
                  content="根据最新环境配置更新，包括服务编排和服务配置的改动"
                  effect="dark"
                  placement="top"
                >
                  <el-button v-hasPermi="{projectName: projectName, action: 'config_environment'}" type="primary"
                             @click="updateK8sEnv(productInfo)" size="mini" plain>更新环境
                  </el-button>
                </el-tooltip>
              </template>
              <template v-if="envSource==='' || envSource==='spock' || envSource === 'helm'">
                <el-dropdown trigger="click">
                  <el-button v-hasPermi="{projectName: projectName, action: 'config_environment'}" type="primary" plain>
                    环境配置
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </el-dropdown>
              </template>
              <template v-if="productInfo.status!=='Disconnected' && productInfo.status!=='Creating'">
                <el-dropdown v-if="envSource===''||envSource==='spock'||envSource==='helm'" trigger="click">
                  <el-button
                    v-hasPermi="{projectName: projectName, actions: ['config_environment','delete_environment'],operator:'or'}"
                    type="primary" plain>
                    更多
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-hasPermi="{projectName: projectName, action: 'config_environment'}"
                                      v-if="!productInfo.share_env_enable" @click.native="shareEnv('enable')">开启自测模式
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-hasPermi="{projectName: projectName, action: 'config_environment'}"
                      v-if="productInfo.share_env_enable && productInfo.share_env_is_base"
                      @click.native="shareEnv('disable')"
                    >关闭自测模式
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-hasPermi="{projectName: projectName, action: 'delete_environment'}"
                      v-if="isShowDeleteEnv"
                      @click.native="deleteProduct(productInfo.product_name,productInfo.env_name)"
                    >删除环境
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button
                  v-hasPermi="{projectName: projectName, action: 'delete_environment'}"
                  v-else-if="isShowDeleteEnv && (envSource==='helm'||envSource==='pm') "
                  type="primary"
                  @click="deleteProduct(productInfo.product_name,productInfo.env_name)"
                  size="mini"
                  plain
                >删除环境
                </el-button>
              </template>
              <template v-if="envSource==='external'">
                <el-button
                  v-hasPermi="{projectName: projectName, action: 'config_environment'}"
                  @click="editExternalConfig(productInfo)"
                  type="primary"
                  size="mini"
                  plain
                >配置托管
                </el-button>
                <el-button
                  v-hasPermi="{projectName: projectName, action: 'delete_environment'}"
                  type="primary"
                  @click="deleteHostingEnv(productInfo.product_name,productInfo.env_name)"
                  size="mini"
                  plain
                >取消托管
                </el-button>
              </template>
            </div>
          </el-col>
        </el-row>
        <div v-if="productInfo.error && productInfo.error!==''">
          <div class="grid-title">错误信息</div>
          <div class="grid-content error-info">{{productInfo.error}}</div>
        </div>
      </div>
    </div>
    <!--end of basic info-->
    <div
      v-if="(envSource==='external'||envSource==='helm') && ingressList.length > 0"
      class="service-container"
      style="margin-bottom: 16px;"
    >
      <span class="service-count">环境入口</span>
      <div v-loading="serviceLoading" element-loading-text="正在获取环境信息" element-loading-spinner="el-icon-loading"
           class="ingress-container">
        <el-table :data="ingressList">
          <el-table-column prop="name" label="Ingress 名称"></el-table-column>
          <el-table-column label="地址">
            <template slot-scope="scope">
              <div v-if="scope.row.host_info && scope.row.host_info.length > 0">
                <div v-for="host of scope.row.host_info" :key="host.host">
                  <a :href="`http://${host.host}`" class="host-url" target="_blank">{{ host.host }}</a>
                </div>
              </div>
              <div v-else>无</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-loading="serviceLoading" element-loading-text="正在获取服务信息" element-loading-spinner="el-icon-loading"
         class="service-container">
      <div class="service-title">
        <el-input
          size="mini"
          class="search-input"
          clearable
          v-model="serviceSearch"
          placeholder="搜索服务"
          @keyup.enter.native="searchServicesByKeyword"
          @clear="searchServicesByKeyword"
        >
          <i class="el-icon-search el-input__icon" slot="prefix"></i>
        </el-input>
        <span v-show="!serviceLoading" class="service-count middle">
            服务总数
            <span class="service-number">{{ envTotal }}</span> 个
          </span>
        <el-button type="text" @click="refreshServiceList">刷新</el-button>
      </div>
      <el-table v-if="pmServiceList.length > 0" class="pm-service-container" :data="pmServiceList">
        <el-table-column label="服务名" width="250px">
          <template slot-scope="scope">
            <router-link :to="setPmRoute(scope)">
                <span class="service-name">
                  <i v-if="scope.row.type==='pm'" class="iconfont service-icon iconwuliji"></i>
                  {{ scope.row.service_name }}
                </span>
            </router-link>
            <template
              v-if=" serviceStatus[scope.row.service_name] && serviceStatus[scope.row.service_name]['tpl_updatable']">
              <el-tooltip
                v-hasPermi="{projectName: projectName, action: 'manage_environment'}"
                effect="dark"
                content="更新主机资源和探活配置"
                placement="top"
              >
                <i @click="updateService(scope.row)" class="iconfont icongengxin operation"></i>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <el-table-column align="left" label="状态" width="130px">
          <template slot="header">
            状态
            <el-tooltip effect="dark" placement="top">
              <div slot="content">实际正常运行的服务数量/预期正常运行服务数量</div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span>{{calcPmServiceStatus(scope.row.env_statuses)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" min-width="160px" label="主机资源">
          <template slot-scope="scope">
            <template v-if="scope.row.env_statuses && scope.row.env_statuses.length>0">
              <div v-if="scope.row.serviceHostStatusArr[0]">
                  <span
                    class="pm-service-status"
                    :class="scope.row.serviceHostStatusArr[0]['color']"
                  >{{scope.row.serviceHostStatusArr[0].host}}</span>
              </div>
              <div v-if="scope.row.serviceHostStatusArr[1]">
                  <span
                    class="pm-service-status"
                    :class="scope.row.serviceHostStatusArr[1]['color']"
                  >{{scope.row.serviceHostStatusArr[1].host}}</span>
              </div>
              <el-popover
                v-if="scope.row.serviceHostStatusArr.length > 2"
                placement="right"
                popper-class="pm-service-host-status-popover"
                trigger="hover"
              >
                <div v-for="(item,index) in _.drop(scope.row.serviceHostStatusArr,2)" :key="index">
                  <span class="pm-service-status" :class="item['color']">{{item.host}}</span>
                </div>
                <span slot="reference" class="add-host el-icon-more-outline"></span>
              </el-popover>
            </template>
            <div>
              <span class="add-host el-icon-edit-outline" @click="editHost(scope.row)"></span>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="150px">
          <template slot-scope="scope">
              <span class="operation">
                <el-tooltip
                  v-hasPermi="{projectName: projectName, action: 'manage_environment'}"
                  effect="dark"
                  content="通过工作流升级服务"
                  placement="top"
                >
                  <i
                    @click="upgradeServiceByWorkflow(projectName,envName,scope.row.service_name,scope.row.type)"
                    class="iconfont iconshengji"
                  ></i>
                </el-tooltip>
              </span>
            <span v-if="scope.row.status!=='Succeeded'" class="operation">
                <el-tooltip
                  v-hasPermi="{projectName: projectName, action: 'manage_environment'}"
                  effect="dark"
                  content="查看服务升级日志"
                  placement="top"
                >
                  <i @click="openPmServiceLog(envName,scope.row.service_name)" class="iconfont iconiconlog"></i>
                </el-tooltip>
              </span>
            <span class="operation">
                <el-tooltip
                  v-hasPermi="{projectName: projectName, action: 'manage_environment'}"
                  effect="dark"
                  content="查看服务配置"
                  placement="top"
                >
                  <router-link :to="setPmServiceConfigRoute(scope)">
                    <i class="iconfont iconfuwupeizhi"></i>
                  </router-link>
                </el-tooltip>
              </span>
          </template>
        </el-table-column>
      </el-table>
      <p v-if="!scrollGetFlag && !serviceLoading && !scrollFinish" class="scroll-finish-class">
        <i class="el-icon-loading"></i> 数据加载中 ~
      </p>
      <p v-if="scrollFinish && page > 2" class="scroll-finish-class">数据已加载完毕 ~</p>
    </div>
        <UpdateHelmVarDialog :fetchAllData="fetchAllData" ref="updateHelmVarDialog" :projectName="projectName" :envName="envName" />
        <UpdateK8sVarDialog :fetchAllData="fetchAllData" :productInfo="productInfo" ref="updateK8sVarDialog" />
        <PmServiceLog ref="pmServiceLog" />
        <ManageK8sServicesDialog :fetchAllData="fetchAllData" :productInfo="productInfo" ref="manageK8sServicesRef" />
        <ManageHelmServicesDialog
          :fetchAllData="fetchAllData"
          :productInfo="productInfo"
          ref="manageHelmServicesRef"
          :productStatus="productStatus"
        />
        <ShareEnvDialog
          :mode="shareEnvDialog.mode"
          :projectName="productInfo.product_name"
          :envName="productInfo.env_name"
          :clusterId="productInfo.cluster_id"
          @statusChange="shareEnvCallback"
          ref="shareEnvRef"
        />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        recycleDay: null,
        ctlCancel: null,
        envNameList: [],
        containerServiceList: [],
        pmServiceList: [],
        ingressList: [],
        currentServiceWorkflows: [],
        currentPmServiceData: {},
        selectVersion: '',
        selectVersionDialogVisible: false,
        updataK8sEnvVarLoading: false,
        updateK8sEnvVarDialogVisible: false,
        envLoading: false,
        serviceLoading: false,
        isPmService: false,
        isExternal: false,
        showStartProductBuild: false,
        helmChartDiffVisible: false,
        currentServiceMeta: null,
        serviceStatus: {},
        productInfo: {
          is_prod: false
        },
        productStatus: {
          updateble: false
        },
        shareEnvDialog: {
          title: '开启自测模式',
          mode: 'enable'
        },
        keyCheckRule: {
          key: [
            {
              type: 'string',
              required: true,
              validator: validateKey,
              trigger: 'blur'
            }
          ],
          value: [
            {
              type: 'string',
              required: false,
              message: 'value',
              trigger: 'blur'
            }
          ]
        },
        serviceTypeMap: serviceTypeMap,
        serviceSearch: '',
        page: 1,
        perPage: 20,
        envTotal: 0,
        scrollGetFlag: true,
        scrollFinish: false,
        editImageRegistry: false,
        imageRegistry: [],
        shareEnvStatus: null,
        shareEnvStatusId: null,
        filterChartName: '*'
      }
    },
    computed: {},
    methods: {},
    watch: {},
    components: {},
    props: {
      envBasePath: {
        type: String,
        required: true
      }
    }
  }
</script>

<style lang="less">
  .diff-popper {
    pre {
      display: inline-block;
      width: 100%;
      margin: 0;
    }

    .diff-container {
      padding-left: 20px;
    }

    .diff-content {
      height: 600px;
      overflow-y: auto;

      .added {
        display: block;
        background-color: #b4e2b4;
      }

      .removed {
        display: block;
        background-color: #ffb6ba;
      }
    }
  }

  .pm-service-host-status-popover {
    .pm-service-status {
      display: block;

      &.Running,
      &.green {
        color: #67c23a;
      }

      &.Error,
      &.red {
        color: #ff1949;
      }

      &.yellow {
        color: #e6a23c;
      }
    }
  }

  .grant-dialog {
    .label {
      display: block;
      padding-bottom: 10px;
      font-size: 13px;
    }
  }

  .env-detail-container {
    position: relative;
    flex: 1;
    overflow: auto;
    font-weight: 300;
    font-size: 14px;

    .rollback-dialog {
      .el-select {
        width: 100%;
      }

      .el-input__inner {
        width: 100%;
      }
    }

    .env-sharing-dialog,
    .env-recycle-dialog {
      .el-form-item {
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .env-sharing-dialog {
      .el-dialog__body {
        padding-top: 0;
      }

      .auth-footer {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
      }

      .el-form-item .select {
        width: 100%;
      }
    }

    .env-recycle-dialog {
      .el-dialog__body {
        padding: 0 20px;

        .tips {
          margin: 0;
          padding: 0;
          line-height: 40px;
        }
      }
    }

    .pm-log-dialog {
      .el-dialog__body {
        padding-top: 15px;
      }

      .modal-title {
        font-size: 16px;

        .unimportant {
          color: #999;
        }
      }
    }

    .banner,
    .info-container {
      padding: 0 20px;

      .el-alert {
        .el-alert__title {
          color: #dc901d;
          font-weight: 400;

          .bold {
            font-weight: 600;
          }
        }
      }
    }

    .service-container {
      // min-height: 400px;
      margin-top: 20px;
      margin-bottom: 20px;

      .service-title {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .middle {
          flex: 1 1 auto;
        }

        .el-button.el-button--text {
          padding: 0;
        }
      }

      .env-service-list-content {
        display: flex;

        .left,
        .right {
          background: white;
          transition: width 0.3s;
        }

        .right {
          flex: 1;
          overflow: auto;
        }
      }

      .service-count {
        display: inline-block;
        margin-left: 14px;
        color: #a0a0a0;
        font-size: 14px;
        line-height: 22px;

        .service-number {
          display: inline-block;
          padding: 0 5px;
          color: #000;
        }
      }

      .status-icon {
        margin-left: 2px;
        color: #a0a0a0;
      }

      .scroll-finish-class {
        color: #5e6166;
        line-height: 2;
        text-align: center;
      }

      .search-input {
        width: 250px;
        line-height: 2;
      }

      .service-icon {
        color: #0066ff;
        font-size: 16px;
      }

      .service-name {
        margin-left: 3px;
        color: #0066ff;
      }

      .service-updatable {
        color: #909399;
        font-size: 12px;

        .icon {
          color: #0066ff;
          cursor: pointer;
        }
      }

      .view-detail {
        color: #0066ff;
        font-size: 16px;
        cursor: pointer;
      }

      .ingress-url {
        display: block;

        a {
          color: #0066ff;
        }
      }

      .pm-service-container {
        margin-top: 20px;
      }

      .pm-service-status {
        display: block;

        &.Running,
        &.green {
          color: #67c23a;
        }

        &.Error,
        &.red {
          color: #ff1949;
        }

        &.yellow {
          color: #e6a23c;
        }
      }

      .operation {
        padding: 0 3px;
        color: #0066ff;
        font-size: 20px;
        cursor: pointer;

        a {
          color: #0066ff;
        }

        i {
          font-size: 20px;
        }
      }

      .service-not-running {
        color: #ff4949;
      }
    }

    .basic-info-content {
      padding-bottom: 0;

      .icon-color {
        color: #9ea3a9;
        cursor: pointer;

        &:hover {
          color: #0066ff;
        }
      }

      .icon-color-cancel {
        color: #ff4949;
        cursor: pointer;
      }

      .grid-title,
      .grid-content {
        display: inline-block;
        margin-bottom: 16px;
        font-weight: 300;
        font-size: 14px;
        line-height: 22px;
        vertical-align: top;
      }

      .grid-title {
        width: 120px;
        color: #a0a0a0;
      }

      .grid-content {
        width: calc(~'100% - 125px');
        color: #4a4a4a;

        &.operation {
          white-space: nowrap;

          .el-button {
            padding: 5px 16px;
            font-size: 13px;
          }

          .change-renderSet {
            margin-left: 10px;
            color: #0066ff;
            font-size: 18px;
            cursor: pointer;
          }
        }

        &.error-info {
          color: #ff1949;
        }

        &.warning-info {
          color: #e6a23c;
        }
      }
    }

    .envs-container {
      margin-bottom: 24px;

      .el-tabs__header {
        position: relative;
        padding: 0;

        /* margin: 0 0 15px; */
        .el-tabs__item {
          height: 35px;
        }
      }

      .el-tabs__nav-wrap::after {
        display: none;
      }
    }

    .update-policy-container {
      margin-top: 10px;

      .el-radio {
        margin-right: 20px;
      }
    }

    .el-card__header {
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 0;
    }

    .ingress-container {
      .host-url {
        color: #0066ff;
      }
    }

    .el-breadcrumb {
      font-size: 16px;
      line-height: 1.35;

      .el-breadcrumb__item__inner a:hover,
      .el-breadcrumb__item__inner:hover {
        color: #0066ff;
        cursor: pointer;
      }
    }
  }

  .pop-ingress {
    padding: 0;

    .el-card {
      max-width: 300px;
      background: #fff;
      border: none;

      .el-card__body {
        .info-wrap {
          padding: 12px 10px;
          text-align: center;

          .service-name {
            color: #0066ff;
          }

          .domain-info-container {
            p {
              margin: 0;
              padding: 5px 0;
              color: #5e6166;
            }

            .text-center {
              color: #5e6166;
              text-align: center;

              .left {
                float: left;
                width: 45px;
                text-align: right;
              }

              .right {
                display: block;
                margin-left: 45px;

                a {
                  color: #0066ff;
                }
              }
            }
          }
        }
      }
    }
  }

</style>
