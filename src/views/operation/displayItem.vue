<template>
  <li>
    <el-card>
      <div slot="header" class="clearfix">
        <span style="font-size: 20px">{{speedup.metadata.name}} Cat-Fish BatchSize: 64</span>
        <el-tag style="float: right;" effect="dark">运行中</el-tag>
        <el-tag style="float: right;" type="success" effect="dark">已完成</el-tag>
      </div>
      <div :id=this.index style="height: 500px; width: 1000px"></div>
    </el-card>
  </li>
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
  methods: {

    drawBar(id) {
      let operationNames = []
      let speedups = []

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
      this.charts = echarts.init(document.getElementById(id));
      let option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
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
            },
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: speedups
          }
        ]
      }
      this.charts.setOption(option)




    }
  },

  created() {
    this.$nextTick(function() {
      this.drawBar(this.index)
    })
  }
}
</script>
<style>
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
//border-top: #409EFF 1px solid;
  border: #409EFF 1px solid;
}

</style>
