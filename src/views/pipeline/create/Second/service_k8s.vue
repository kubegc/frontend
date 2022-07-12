<template>
    <div class="projects-service-mgr">
      <el-drawer title="代码源集成"
                 :visible.sync="addCodeDrawer"
                 direction="rtl">
      </el-drawer>
      <el-dialog title="是否更新对应环境？"
                 custom-class="dialog-upgrade-env"
                 :visible.sync="updateEnvDialogVisible"
                 width="40%">
        <div class="title">
          <el-alert title="勾选需要更新的环境，点击确定之后，该服务将自动在对应的环境中进行更新"
                    :closable="false"
                    type="warning">
          </el-alert>
        </div>
      </el-dialog>
      <div class="service-wrap">
        <div class="service-container">
          <Multipane class="vertical-panes"
                     layout="vertical">
            <div class="service-tree-container">
<!--              <ServiceTree />-->
            </div>
            <template >
              <MultipaneResizer/>
              <div class="service-editor-container"
                   :style="{ minWidth: '300px', width: '500px' }">
                <ServiceEditor  />
              </div>
              <MultipaneResizer/>
            </template>
            <div class="no-content">
<!--              <img src="@assets/icons/illustration/editorNoService.svg"-->
<!--                   alt="">-->
              <p >暂无服务，点击 <el-button size="mini"
                                                                 icon="el-icon-plus"
                                                                 @click="createService()"
                                                                 plain
                                                                 circle>
              </el-button> 创建服务</p>
              <p >请在左侧选择需要编辑的服务</p>
              <p >请在左侧选择需要编辑的服务</p>
            </div>
          </Multipane>
        </div>
      </div>
<!--      <div class="pipeline">-->
<!--        <div class="pipeline-workflow__wrap">-->
<!--          <multipane class="vertical-panes"-->
<!--                     layout="vertical">-->

<!--            <div-->
<!--                 class="no-content">-->
<!--&lt;!&ndash;              <img src="@assets/icons/illustration/editor_nodata.svg"&ndash;&gt;-->
<!--&lt;!&ndash;                   alt="">&ndash;&gt;-->
<!--              <p >暂无服务，点击 <el-button size="mini"-->
<!--                           icon="el-icon-plus"-->
<!--                           @click="createService()"-->
<!--                           plain-->
<!--                           circle>-->
<!--                </el-button> 创建服务</p>-->
<!--              <p >请在左侧选择需要编辑的服务</p>-->
<!--              <p >请在左侧选择需要编辑的服务</p>-->
<!--            </div>-->
<!--          </multipane>-->
<!--        </div>-->
<!--      </div>-->
      <div class="controls__wrap">

      </div>
    </div>
</template>
<script>
import ServiceTree from './container/service_tree'
import { Multipane, MultipaneResizer } from 'vue-multipane'

export default {
  data () {
    return {
      projectInfo: {},
      service: {}
    }
  },
  methods: {

  },
  watch: {

  },
  mounted () {

  },
  components: { ServiceTree,    Multipane, MultipaneResizer },
}
</script>

<style lang="less">
  .fileTree-dialog {
    .el-dialog__body {
      padding: 0 5px;
    }
  }

  .dialog-upgrade-env {
    .el-dialog__body {
      padding: 10px 20px;

      .tip-desc {
        margin-top: 10px;
        color: #f56c6c;
        font-size: 13px;
      }
    }

    .title {
      .el-alert {
        margin-bottom: 10px;
      }
    }

    .env-tabs {
      margin-top: 10px;

      .desc {
        display: block;
        margin: 15px 0;
        color: #909399;
      }
    }

    .update-policy-container {
      margin-top: 15px;

      span {
        color: #4c4c4c;
        font-size: 14px;
      }
    }
  }

  .projects-service-mgr {
    position: relative;
    flex: 1;
    height: 100%;
    overflow: hidden;
    background-color: #f6f6f6;

    .project-name {
      color: #0066ff;
    }

    .service-wrap {
      position: relative;
      display: flex;
      height: calc(~'100% - 10px');
      padding: 10px 5px 0 5px;

      &.onboarding {
        height: calc(~'100% - 245px');
      }
    }

    .service-container {
      display: flex;
      justify-content: space-between;
      width: 100%;
      border-bottom: 1px solid #ccc;

      .service-tree-container {
        display: flex;
        flex-direction: column;
        min-width: 250px;
        max-width: 480px;
        height: 100%;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05);
      }

      .vertical-panes {
        width: 100%;

        .multipane-resizer {
          position: relative;
          left: 0;
          width: 10px;
          margin: 0;

          &::before {
            position: absolute;
            top: 50%;
            left: 50%;
            display: block;
            width: 8px;
            height: 55px;
            margin-top: -20px;
            margin-left: -5.5px;
            background-color: #fff;
            border: 1px solid #dbdbdb;
            border-radius: 5px;
            content: '';
          }

          &:hover {
            &::before {
              border-color: #999;
            }
          }
        }
      }

      .service-editor-container {
        position: relative;
        height: 100%;

        .service-editor-content {
          position: relative;
          z-index: 0;
        }

        .modal-block {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 1;
          padding: 14px;
          background: rgba(234, 234, 234, 0.92);
          cursor: not-allowed;
        }

        &.pm {
          width: 100%;
        }
      }

      .no-content {
        display: flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;

        img {
          width: 200px;
          height: 200px;
        }

        p {
          color: #606266;
          font-size: 15px;
        }
      }

      .service-aside-right {
        min-width: 372px;
        -webkit-transition: width 0.2s ease-out;
        transition: width 0.2s ease-out;
      }

      .service-aside {
        display: flex;
        flex: 1;
        flex-direction: column;
      }
    }

    .controls__wrap {
      position: relative;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 55px;
      background-color: #fff;

      > * {
        margin-right: 10px;
      }

      .controls__right {
        display: flex;
        align-items: center;
        padding: 0 15px;

        .save-btn {
          margin-right: 15px;
          padding: 10px 17px;
          color: #fff;
          font-size: 13px;
          text-decoration: none;
          background-color: #0066ff;
          border: 1px solid #0066ff;
          cursor: pointer;
          transition: background-color 300ms, color 300ms, border 300ms;
        }

        .save-btn[disabled] {
          color: #fff;
          background-color: rgb(170, 170, 255);
          border-color: rgb(170, 170, 255);
          cursor: not-allowed;
        }
      }
    }
  }
</style>
