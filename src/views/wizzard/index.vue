<template>
  <div>
    <div class="app-container" style="margin-bottom: 20px">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item>
          <template slot="title">
            功能描述<i class="header-icon el-icon-info"/>
          </template>
          <div v-text="desc"/>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="app-container">
      <el-row>
        <el-steps :active="active" finish-status="success" simple>
          <el-step title="选择页面类型"/>
          <el-step title="选择资源类型"/>
          <el-step title="填写配置文件"/>
          <el-step title="设置菜单"/>
        </el-steps>
      </el-row>
      <el-row style="height: 50vh" :gutter="8">
        <el-col></el-col>
      </el-row>
      <el-row>
        <el-button style="margin-top: 12px" @click="next">上一步</el-button>
        <el-button style="margin-top: 12px" @click="next">下一步</el-button>
        <el-button style="margin-top: 12px" @click="next">提交</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getResource } from '@/api/k8sResource'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      activeName: '',
      active: 0,
      desc: '',
      kind: 'Wizzard'
    }
  },

  methods: {
    next() {
      if (this.active++ > 2) this.active = 0
    }
  },

  computed: {
    ...mapGetters(['token'])
  },

  created() {
    getResource({
      token: this.token,
      kind: 'Frontend',
      name: 'desc-' + this.kind.toLowerCase(),
      namespace: 'default'
    }).then((response) => {
      if (this.$valid(response)) {
        this.desc = response.data.spec.desc
      }
    })
  }
}
</script>
