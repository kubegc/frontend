<template>
  <div class="projects-service-mgr">
    <div class="guide-container">
      <step :activeStep="1">
      </step>
      <div class="current-step-container">
        <div class="title-container">
          <span class="first">第二步</span>
          <div v-for="row in guideItems.rows"
               :key="row.index"
               :gutter="guideItems.gutter" class="second">
            <div v-for="item in row.items"
                 :key="item.index"
                 :span="item.span"
                 :title="item.description"><div v-if="item.type == 'span2'">{{item.description}}</div></div>
          </div>
        </div>
      </div>
    </div>

    <div class="pipeline onboarding">
      <div class="pipeline-workflow__wrap">
        <multipane class="vertical-panes"
                   layout="vertical">
          <div class="service-tree-container">
            <serviceTree></serviceTree>
          </div>
          <template v-if="service.service_name &&  services.length >0">
            <template v-if="service.type==='k8s'">
              <multipane-resizer></multipane-resizer>
              <div class="service-editor-container"
                   :style="{ minWidth: '300px', width: '500px'}"
                   :class="{'pm':service.type==='pm'}">
                <serviceEditorK8s ref="serviceEditor"
                                  :serviceInTree="service"
                                  :showNext.sync="showNext"
                                  @onParseKind="getYamlKind"
                                  @onRefreshService="getServices"
                                  @onRefreshSharedService="getSharedServices"
                                  @onUpdateService="onUpdateService"></serviceEditorK8s>
              </div>
              <multipane-resizer></multipane-resizer>
              <aside class="pipelines__aside pipelines__aside_right"
                     :style="{ flexGrow: 1 }">
                <serviceAsideK8s :service="service"
                                 :detectedEnvs="detectedEnvs"
                                 :detectedServices="detectedServices"
                                 :systemEnvs="systemEnvs"
                                 @getServiceModules="getServiceModules"> </serviceAsideK8s>
              </aside>
            </template>
          </template>
          <div
            class="no-content">
            <img src="@/assets/icons/editor_nodata.svg"
                 alt="">
            <p v-if="services.length === 0">暂无服务，点击 <el-button size="mini"
                                                               icon="el-icon-plus"
                                                               @click="createService()"
                                                               plain
                                                               circle>
            </el-button> 创建服务</p>
          </div>
          <div class = "aside__inner">
            <serviceAside></serviceAside>
          </div>
        </multipane>
      </div>
    </div>

    <div class="controls__wrap">
      <div class="controls__right">
        <router-link :to="`/t/t1/t5`">
          <button type="primary"
                  class="save-btn"
                  plain>下一步</button>
        </router-link>
        <div class="run-button">
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import step from '../common/step.vue'
  import serviceTree from '../common/service_tree'
  import serviceAside from './service_aside'
  import { Multipane, MultipaneResizer } from 'vue-multipane'
  import axios from 'axios'

  export default {
    components: {
      step, serviceTree, serviceAside, Multipane, MultipaneResizer
    },
    data () {
      return {
        service: {},
        services: [],
        sharedServices: [],
        detectedEnvs: [],
        detectedServices: [],
        systemEnvs: [],
        currentServiceYamlKinds: {},
        projectInfo: {},
        showNext: false,
        addCodeDrawer: false,
        guideItems:[]
      }
    },
    methods: {
      // createService () {
      //   this.$refs.serviceTree.createService('platform')
      // },
      //
      // getServices () {
      //   const projectName = this.projectName
      //   this.$set(this, 'service', {})
      //   getServiceTemplatesAPI(projectName).then((res) => {
      //     this.services = sortBy((res.data.map(service => {
      //       service.idStr = `${service.service_name}/${service.type}`
      //       service.status = 'added'
      //       return service
      //     })), 'service_name')
      //   })
      // },

      readGuideItems() {
        axios.get('/getDescription').then((response) => {
          if(response.data){
            this.guideItems = response.data.data
          }
        })
      },

      // getYamlKind (payload) {
      //   this.currentServiceYamlKinds = payload
      // },
      //
      // jumpToKind (payload) {
      //   this.$refs.serviceEditor.jumpToWord(`kind: ${payload.kind}`)
      // }
    },

    mounted() {
      // this.getServices()
      this.readGuideItems()
    }
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
    }

    .title {
      .el-alert {
        margin-bottom: 10px;
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
    overflow: auto;
    background-color: #f5f7f7;

    .project-name {
      color: #1989fa;
    }

    .guide-container {
      min-height: calc(~"100% - 150px");
      margin-top: 10px;

      &.not-closed-title {
        min-height: calc(~"100% - 150px");
      }

      .current-step-container {
        .title-container {
          margin-left: 20px;

          .first {
            display: inline-block;
            width: 110px;
            padding: 8px;
            color: #fff;
            font-weight: 300;
            font-size: 18px;
            text-align: center;
            background: #3289e4;
          }

          .second {
            display: inline-block;
            color: #4c4c4c;
            font-size: 13px;
          }
        }
      }
    }

    .pipeline {
      position: relative;
      display: flex;
      height: calc(~'100% - 70px');
      padding: 15px 5px 0 5px;

      &.onboarding {
        height: calc(~'100% - 245px');
      }
    }

    .pipeline-workflow__wrap {
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
        height: 550px;

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
        height: 100%;

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
          width: 100px;
          height: 100px;
        }

        p {
          color: #606266;
          font-size: 15px;
        }
      }

      .pipelines__aside_right {
        min-width: 372px;
        -webkit-transition: width 0.2s ease-out;
        transition: width 0.2s ease-out;
      }

      .pipelines__aside {
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
      margin: 0 5px;
      background-color: #fff;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05);

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
          font-weight: bold;
          font-size: 13px;
          text-decoration: none;
          background-color: #1989fa;
          border: 1px solid #1989fa;
          cursor: pointer;
          transition: background-color 300ms, color 300ms, border 300ms;
        }

        .save-btn[disabled] {
          background-color: #9ac9f9;
          border: 1px solid #9ac9f9;
          cursor: not-allowed;
        }
      }
    }
  }
</style>

