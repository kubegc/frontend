/* eslint-disable */
<template>
  <div>
    <el-row v-for="(item, i) in result.layout" :key="i" :gutter="10">
      <el-col v-for="n in item" :key="i + '-' + (n - 1)" :span="24/item" style="cursor: pointer" @mouseenter.native="enable(i, n)" @mouseleave.native="disable(i, n)">
        <el-card shadow="hover">
            <div v-if="f[i + '-' + (n - 1)]" slot="header" class="clearfix">
              <el-button style="float: right; padding: 3px 0" type="text" @click="goto(result.views[i + '-' + (n - 1)].link)">详情</el-button>
            </div>
          <div :id="i + '-' + (n - 1)" class="grid-content bg-purple" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { screenData } from '@/api/common'

export default {
  data() {
    return {
      result: {},
      f: []
    }
  },
  mounted() {
    screenData(this.$route.name).then((result) => {
      console.log(result)
      this.result = result
      this.$nextTick(() => {
        const containers = []
        for (let i = 0; i < this.result.layout.length; i++) {
          for (let j = 0; j < this.result.layout[i]; j++) {
            const obj = {}
            obj.key = i + '-' + j
            const curr = document.getElementById(obj.key)
            obj.value = echarts.init(curr)
            containers.push(obj)
          }
        }

        this.$nextTick(
          () => {
            for (let k = 0; k < containers.length; k++) {
              console.log(JSON.stringify(this.result.views[containers[k].key].data))
              console.log('---')
              containers[k].value.setOption(this.result.views[containers[k].key].data)
            }
          }
        )
      })
    })
  },
  methods: {
    goto(link) {
      !link | this.$router.push({ name: link })
    },
    enable(i, n) {
      this.f[i + '-' + (n - 1)] = true
      this.$forceUpdate()
    },
    disable(i, n) {
      this.f[i + '-' + (n - 1)] = false
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
   margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #FFFFFF;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 200px;
  max-height: 300px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
