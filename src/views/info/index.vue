<template>
  <div class="app-container" style="height: 100%">
    <el-row :gutter="20">
      <el-col :span="13" style="margin-bottom: 32px">
        <el-card>
          <span
            style="
              display: inline-block;
              margin-bottom: 10px;
              fontsize: 16px;
              font-weight: bold;
            "
          >yaml配置</span>
          <div class="card-editor-container">
            <json-editor ref="jsonEditor" v-model="value" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="11" style="margin-bottom: 32px">
        <el-card>
          <span
            style="
              display: inline-block;
              margin-bottom: 10px;
              fontsize: 16px;
              font-weight: bold;
            "
          >监控信息</span>
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="24">
              <iframe class="rate_iframe" :src="monitor_rs.cpu" />
            </el-col>
          </el-row>
        </el-card>
        <el-card>
          <el-row type="flex" class="row-bg">
            <el-col :span="24">
              <iframe class="rate_iframe" :src="monitor_rs.memory" />
            </el-col>
          </el-row>
        </el-card>
        <el-card>
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="24">
              <iframe class="rate_iframe" :src="monitor_rs.fs" />
            </el-col>
          </el-row>
        </el-card>
        <el-card>
          <el-row>
            <el-col :span="24">
              <iframe class="IO_iframe" :src="monitor_rs.network" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMonitorInfo } from '@/utils/getResource'
import JsonEditor from '@/components/JsonEditor'
import { getResource } from '@/api/kubernetes'

export default {
  name: 'Info',
  components: { JsonEditor },
  data() {
    return {
      kind: '',
      name: '',
      namespace: '',
      monitor_rs: {},
      value: ''
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'roles'])
  },
  created() {
    this.kind = this.$route.query.kind
    this.name = this.$route.query.name
    this.namespace = this.$route.query.namespace

    this.monitor_rs = getMonitorInfo(
      '',
      this.name,
      this.namespace
    )

    getResource({
      name: this.name,
      kind: this.tabName,
      namespace: this.namespace
    }).then((response) => {
      if (this.validateRes(response) === 1) {
        this.value = response.data
      }
    })
  },
  mounted() {},
  methods: {
    validateRes(res) {
      if (res.code === 20000) {
        return 1
      } else {
        this.$notify({
          title: 'error',
          message: res.data,
          type: 'warning',
          duration: 3000
        })
        return 0
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.iframe {
  width: 100%;
  height: 220px;
  border: 0ch;
}
.rate_iframe {
  width: 100%;
  height: 220px;
  border: 0ch;
}
.IO_iframe {
  width: 100%;
  height: 220px;
  border: 0ch;
}
.board {
  margin-left: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.card-editor-container {
  position: relative;
  width: 100%;
  height: 70%;
}
</style>
