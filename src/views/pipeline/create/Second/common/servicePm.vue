<template>
  <div class="projects-pm-service-container">
    <UpdateEnv ref="updateEnv"/>
    <div class="policy">
      <el-button type="primary" size="small" @click="showPolicyDrawer = true" plain>策略</el-button>
    </div>
    <div class="config-container-pm">
      <ServiceList
        ref="serviceList"
        :editService="editService"
        :addService="addService"
        :changeShowBuild="(value) =>showBuild = value"
      />
    </div>
    <div class="controls__wrap">
      <div class="controls__right">
        <el-button type="primary" size="small" @click="openDialog" :disabled="updateEnvDisabled">
          更新环境
        </el-button>
      </div>
    </div>
    <el-drawer title="策略" custom-class="policy-drawer" :visible.sync="showPolicyDrawer" direction="rtl" size="600px" destroy-on-close>
      <Policy />
    </el-drawer>
  </div>
</template>
<script>
// import ServiceList from '@/components/projects/common/pm/serviceList.vue'
// import PmConfig from '@/components/projects/common/pm/pmConfig.vue'
// import UpdateEnv from './pm/updateEnv'
// import Policy from './k8s/container/policy.vue'
export default {
  data () {
    return {

    }
  },
  methods: {},
  computed: {},
  components: {}
}
</script>

<style lang="less">
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

.projects-pm-service-container {
  position: relative;
  flex: 1;
  height: 100%;
  overflow: hidden;

  .policy {
    position: absolute;
    top: 15px;
    right: 10px;
    z-index: 1;

    .el-button {
      width: 30px;
      margin-bottom: -12px;
      padding: 12px 5px;
      white-space: initial;
    }
  }

  .config-container-pm {
    position: relative;
    display: flex;
    height: calc(~'100% - 80px') !important;
    margin-bottom: 0;
    padding: 15px 5px 10px 5px;
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
    padding: 0 10px;
    background-color: #fff;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05);

    > * {
      margin-right: 10px;
    }

    .controls__right {
      display: flex;
      align-items: center;
    }
  }

  .policy-drawer {
    .el-drawer__header {
      margin-bottom: 12px;
    }

    .el-drawer__body {
      box-sizing: border-box;
      padding: 0 10px 20px;
    }
  }
}
</style>
