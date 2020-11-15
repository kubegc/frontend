<template>
  <el-row>
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{index}}.{{speedup.metadata.name}}</span>
        <el-button style="float: right; padding: 3px 0" type="primary">已完成</el-button>
<!--        <el-button style="float: right; padding: 3px 0" type="success">运行中</el-button>-->
      </div>
      <div :id=this.index style="height: 500px; width: 1300px"></div>
    </el-card>
  </el-row>
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    speedup: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },

  created() {
    this.$nextTick(function() {
      this.drawBar(this.index)
    })
  },
  methods: {

    drawBar(id) {
      const operationNames = []
      const speedups = []

      this.speedup.data.speedups.sort((a, b) => {
        return Object.values(a) - Object.values(b)
      })
      // console.log(this.speedup.speedups)
      for (var i = 0; i < this.speedup.data.speedups.length; i++) {
        // console.log(Object.keys(this.speedup.speedups[i])[0])
        operationNames.push(Object.keys(this.speedup.data.speedups[i])[0])
        speedups.push(Object.values(this.speedup.data.speedups[i])[0])
      }
      // console.log(operationNames)
      this.charts = echarts.init(document.getElementById(id))
      const option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: operationNames,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              rotate: 30
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '加速比',
            type: 'bar',
            barWidth: '60%',
            data: speedups
          }
        ]
      }
      this.charts.setOption(option)
    }
  }
}
</script>
<style scoped>
.el-card {
  box-shadow: 0px 1px 2px -2px rgba(0, 0, 0, 0.16),
  0px 3px 6px 0px rgba(0, 0, 0, 0.12),
  0px 5px 12px 4px rgba(0, 0, 0, 0.09);
  margin-top: 20px;
}

.el-card:hover {
  box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.08),
  0px 9px 28px 0px rgba(0, 0, 0, 0.05),
  0px 12px 48px 16px rgba(0, 0, 0, 0.03);
  transform: translateY(-5px);
  border-top: #409EFF 1px solid;
  /*border: #409EFF 1px solid;*/
}
</style>
