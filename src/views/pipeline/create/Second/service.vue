<template>
  <div class="projects-guide-service-container">
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

<!--    <div class="projects-guide-service-container">-->
<!--      <el-drawer title="代码源集成"-->
<!--                 :visible.sync="integrationCodeDrawer"-->
<!--                 direction="rtl">-->
<!--        <add-code @cancel="integrationCodeDrawer = false"></add-code>-->
<!--      </el-drawer>-->
<!--      <div class="guide-container">-->
<!--        <div class="current-step-container">-->
<!--          <div class="title-container">-->
<!--            <span class="first">第二步</span>-->
<!--            <span class="second">创建服务模板，后续均可在项目中重新配置</span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <ServiceK8s />-->
<!--    </div>-->

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
import serviceAsideK8s from './service_aside'
import serviceAside from './service_aside'
import { Multipane, MultipaneResizer } from 'vue-multipane'
import axios from 'axios'

export default {
  components: {
    step, serviceTree, serviceAside, Multipane, MultipaneResizer ,serviceAsideK8s
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
    createService () {
      this.$refs.serviceTree.createService('platform')
    },

    getServices () {
      const projectName = this.projectName
      this.$set(this, 'service', {})
      getServiceTemplatesAPI(projectName).then((res) => {
        this.services = sortBy((res.data.map(service => {
          service.idStr = `${service.service_name}/${service.type}`
          service.status = 'added'
          return service
        })), 'service_name')
      })
    },

    readGuideItems() {
      axios.get('/getDescription').then((response) => {
        if(response.data){
          this.guideItems = response.data.data
        }
      })
    },

    getYamlKind (payload) {
      this.currentServiceYamlKinds = payload
    },

    jumpToKind (payload) {
      this.$refs.serviceEditor.jumpToWord(`kind: ${payload.kind}`)
    }
  },

  mounted() {
    // this.getServices()
    this.readGuideItems()
  }
}
</script>

<style lang="less">
  .projects-guide-service-container {
    height: calc(~'100% - 40px');

    /deep/ .projects-service-mgr {
      .service-wrap {
        height: calc(~'100% - 255px');
      }
    }

    .guide-container {
      margin-top: 10px;

      .current-step-container {
        .title-container {
          margin-left: 20px;

          .first {
            display: inline-block;
            width: 130px;
            padding: 8px;
            color: #fff;
            font-weight: 300;
            font-size: 16px;
            text-align: center;
            background: #0066ff;
          }

          .second {
            color: #4c4c4c;
            font-size: 13px;
          }
        }
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
      height: 60px;
      margin: 0 15px;
      padding: 0 10px;
      background-color: #fff;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05);

      .controls__right {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        align-items: center;
        margin-right: 10px;
        -webkit-box-align: center;
        -ms-flex-align: center;

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
