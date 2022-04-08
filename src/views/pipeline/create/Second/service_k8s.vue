<template>
    <div class="projects-service-mgr">
      <el-drawer title="代码源集成"
                 :visible.sync="addCodeDrawer"
                 direction="rtl">
        <add-code @cancel="addCodeDrawer = false"></add-code>
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
          <el-checkbox-group v-model="checkedEnvList">
            <el-checkbox v-for="(env,index) in envNameList"
                         :key="index"
                         :label="env.envName"></el-checkbox>
          </el-checkbox-group>
        </div>
        <span slot="footer"
              class="dialog-footer">
          <el-button size="small"
                     type="primary"
                     @click="autoUpgradeEnv">确 定</el-button>
          <el-button size="small"
                     @click="skipUpdate">跳过</el-button>

        </span>
      </el-dialog>
      <div class="pipeline">
        <div class="pipeline-workflow__wrap">
          <multipane class="vertical-panes"
                     layout="vertical">

            <div v-else
                 class="no-content">
              <img src="@assets/icons/illustration/editor_nodata.svg"
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
          </multipane>
        </div>
      </div>
      <div class="controls__wrap">
          <div class="controls__right">
            <el-button type="primary"
                       size="small"
                       class="save-btn"
                       @click="toNext"
                       :disabled="!showNext || !envNameList.length"
                       plain>环境更新</el-button>
          </div>
      </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      projectInfo: {},
      service: {}
    }
  },
  methods: {
    async getProducts() {
      await this.$store.dispatch('getProductList')
    },
    async checkProjectFeature() {
      const projectName = this.projectName
      this.projectInfo = await getSingleProjectAPI(projectName)
    }
  },
  computed: {
    currentOrganizationId () {
      return this.$store.state.login.userinfo.organization.id
    },
    envNameList () {
      const envNameList = []
      this.productList.forEach(element => {
        if (element.product_name === this.projectName && element.source !== 'external') {
          envNameList.push({
            envName: element.env_name
          })
        }
      })
      return envNameList
    },
    projectName () {
      return this.$route.params.project_name
    },
    serviceName () {
      return this.$route.query.service_name
    }
  },
  watch: {

  },
  mounted () {
    this.getProducts()
    this.checkProjectFeature()
  },
  components: { },
  mixins: [mixin]
}
</script>

<style lang="less">

</style>
