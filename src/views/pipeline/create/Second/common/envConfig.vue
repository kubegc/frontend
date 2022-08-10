<template>
  <div class="env-config-container">
    <div class="primary-title" :style="{ 'margin-bottom' : showConfig ? '14px' : '0'}">
      <span>环境配置</span>
      <i
        style="margin-left: 10px; cursor: pointer;"
        :class="[showConfig ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"
        @click="showConfig = !showConfig"
      ></i>
    </div>
    <div v-if="showConfig">
      <el-table v-show="configInfo.length" :data="configInfo" style="width: 90%; max-width: 800px; margin-bottom: 18px;">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <el-button type="text" @click="editConfig(row)">编辑</el-button>
            <el-button type="text" @click="configInfo.splice($index, 1)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-button type="primary" size="small" @click="addEnvConfig" plain>添加</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="60%" custom-class="env-config-dialog" append-to-body>
      <ImportConfig :importRepoInfo="repoConfig"></ImportConfig>
      <div slot="footer">
        <el-button size="small" @click="handleConfig(false)">取 消</el-button>
        <el-button size="small" type="primary" @click="handleConfig(true)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import ImportConfig from '@/components/projects/common/importConfig/index.vue'
export default {
  data () {
    return {
      configInfo: [],
      repoConfig: {},
      dialogVisible: false,
      showConfig: false
    }
  },
  methods: {
    handleConfig (save) {
      this.dialogVisible = false
      if (save) {
        this.repoConfig.initYaml = this.repoConfig.overrideYaml
      } else {
        this.repoConfig.overrideYaml = this.repoConfig.initYaml
      }
    },
    editConfig (current) {
      this.dialogVisible = true
      this.repoConfig = current
    },
    addEnvConfig () {
      const index = this.configInfo.index || 1
      const next = {
        name: `配置 ${index}`,
        overrideYaml: '',
        initYaml: ''
      }
      this.configInfo.push(next)
      this.configInfo.index = index + 1
      this.editConfig(next)
    },
    getAllYaml () {
      return this.configInfo.map(info => info.initYaml).filter(info => info)
    }
  },
  components: {
    ImportConfig
  }
}
</script>

<style lang="less">
.env-config-dialog {
  .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 20px;
  }
}
</style>
