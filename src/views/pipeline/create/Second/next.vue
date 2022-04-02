<template>
<div>
  <div class="projects-runtime-container">
    <div class="guide-container">
      <step :activeStep="2">
      </step>
      <div class="current-step-container">
        <div class="title-container">
          <span class="first">第三步</span>
          <div v-for="row in guideItems.rows"
               :key="row.index"
               :gutter="guideItems.gutter" class="second">
            <div v-for="item in row.items"
                 :key="item.index"
                 :span="item.span"
                 :title="item.description"><div v-if="item.type == 'span3'">{{item.description}}</div></div>
          </div>
        </div>
        <div class="no-content">
          <img src="@/assets/editor_nodata.jpg"
               alt="">
          <p v-if="services.length === 0">暂无服务，点击 <el-button size="mini"
                                                             icon="el-icon-plus"
                                                             @click="createService()"
                                                             plain
                                                             circle>
          </el-button> 创建服务</p>
          <p v-else-if="service.service_name==='服务列表' && services.length >0">请在左侧选择需要编辑的服务</p>
          <p v-else-if="!service.service_name && services.length >0">请在左侧选择需要编辑的服务</p>
        </div>

      </div>
    </div>
  </div>

  <div class="controls__wrap">
    <div class="controls__right">
      <router-link :to="`/t/t1/t6`">
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
import axios from 'axios'
import step from '../common/step.vue'
import JsonEditor from '@/components/JsonEditorSpecial/index'
export default {
  components: {
    step
  },

  data() {
    return {
      service:{},
      services: [],
      pipelineItems: [],
      dialogVisible: false,
      centerDialogVisible: false,
      lokiDialogTitle: false,
      jsonFileObj: {},
      dialogTitle: '',
      lokiLink: '',
      active: 0,
      salary: {
        id: '',
        basicSalary: ''
      },
      guideItems:[]
    }
  },

  computed: {
    projectName () {
      return this.$route.params.project_name
    }
  },

  mounted() {
    this.readPipeline()
      // this.lokiLink = getLokiLink()
  },
  methods: {
    handleClick(color, name) {
      this.dialogTitle = name
      this.dialogVisible = true
    },
    checkLoki(color, name) {
      this.dialogTitle = name
      this.lokiDialogTitle = true
      // this.lokiLink = getLokiLink()
    },
    createService () {
      this.$refs.serviceTree.createService('platform')
    },
    readGuideItems() {
      axios.get('/getDescription').then((response) => {
        if(response.data){
          this.guideItems = response.data.data
        }
      })
    }
  },

  mounted() {
    this.readGuideItems()
  }
}
</script>

<style lang="less">
.projects-runtime-container {
  position: relative;
  flex: 1;
  overflow: auto;
  background-color: #f5f7f7;

  .page-title-container {
    display: flex;
    padding: 0 20px;

    h1 {
      width: 100%;
      color: #4c4c4c;
      font-weight: 300;
      text-align: center;
    }
  }

  .guide-container {
    min-height: calc(~"100% - 70px");
    margin-top: 10px;

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
}

.controls__wrap {
  position: relative;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: -webkit-box;
  display: -ms-flexbox;
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

    .save-btn,
    .next-btn {
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

    .save-btn[disabled],
    .next-btn[disabled] {
      background-color: #9ac9f9;
      border: 1px solid #9ac9f9;
      cursor: not-allowed;
    }
  }
}

.el-card {
  box-shadow: 0px 1px 2px -2px rgba(0, 0, 0, 0.16),
  0px 3px 6px 0px rgba(0, 0, 0, 0.12), 0px 5px 12px 4px rgba(0, 0, 0, 0.09);
}

.el-card:hover {
  box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.08),
  0px 9px 28px 0px rgba(0, 0, 0, 0.05), 0px 12px 48px 16px rgba(0, 0, 0, 0.03);
  transform: translateY(-5px);
  color: yellowgreen;
  //border-top: #409EFF 1px solid;
  border: #409eff 1px solid;
}
.svg-middle {
  margin:0 auto;display:inline-block;
}
</style>
