<template>
  <div class="projects-container">
    <SubTopbar :comp="comp" :projectName="projectName" />
    <router-view @injectComp="injectComp" ></router-view>

    <div class="init-resource">
      <header><i class="theme-color iconfont iconvery-handshake"></i>管理员为您配置了以下工作流和环境</header>
      <section>
        <article>
          <div class="title">
            <i class="iconfont icongongzuoliucheng"></i>工作流
          </div>
          <div class="detail-item">
            <div class="item-name">{{ workflow.name }}</div>
          </div>
        </article>
        <article  style="margin-top: 30px;">
          <div class="title">
            <i class="iconfont iconvery-environ"></i>环境
          </div>
          <div  class="detail-item display-flex">
            <div>
              <div class="item-name">{{ env.name }}</div>
            </div>
            <el-button type="primary" plain size="small" >环境变量</el-button>
          </div>
        </article>

        <footer>
          <el-button type="primary" size="small" icon="confirm-icon iconfont iconvery-confirm"  round>确认</el-button>
        </footer>
      </section>
    </div>

      <template>
        <el-dialog :title="`设置环境变量`" :visible.sync="dialogVisible" width="850px">
          <div>
            <VarList :variables="variables" class="var-list-container"></VarList>
          </div>
          <div slot="footer">
            <el-button size="small" type="primary" @click="getEnvInfo">确 定</el-button>
          </div>
        </el-dialog>
      </template>

  </div>
</template>
<script>
import SubTopbar from '../home/subTopbar'
export default {
  data () {
    return {
      comp: null,
      currentInfo: Object
    }
  },
  components: {
    SubTopbar
  },
  computed: {
    projectName () {
      return this.$route.params.project_name
    },
    dialogVisible: {
      get() {
        return this.visible
      },
    }
  },
  methods: {
    injectComp (comp) {
      this.comp = comp
    },
    getEnvInfo () {
      if (this.deployType === 'k8s') {
        this.currentInfo.vars = cloneDeep(this.variables)
      } else {
        const {
          envInfo,
          chartInfo
        } = this.$refs.helmEnvTemplateRef.getAllInfo()
        this.currentInfo.defaultValues = envInfo.DEFAULT || ''
        this.currentInfo.chartValues = chartInfo
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>

.projects-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(~'100% - 40px');
  background-color: #f6f6f6;
}
</style>
