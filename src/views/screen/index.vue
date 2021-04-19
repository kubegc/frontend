<template>
  <div>
    <el-row v-for="(item, i) in result.layout" :key="i" :gutter="10">
      <el-col v-for="n in item" :key="i + '-' + (n - 1)" :span="24/item" style="cursor: pointer" @mouseenter.native="enable(i, n)" @mouseleave.native="disable(i, n)">
        <el-card shadow="hover">
            <div v-if="f[i + '-' + (n - 1)]" slot="header" class="clearfix">
              <el-button style="float: right; padding: 3px 0" type="text" @click="goto">详情</el-button>
            </div>
          <div :id="i + '-' + (n - 1)" class="grid-content bg-purple" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  data() {
    return {
      result: {
        layout: [2, 3, 2],
        views: {
          '0-0': {
            'type': '',
            'data': {
              xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line'
              }]
            }
          },
          '0-1': {
            'type': '',
            'data': {
              legend: {
                data: ['高度(km)与气温(°C)变化关系']
              },
              tooltip: {
                trigger: 'axis',
                formatter: 'Temperature : <br/>{b}km : {c}°C'
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'value',
                axisLabel: {
                  formatter: '{value} °C'
                }
              },
              yAxis: {
                type: 'category',
                axisLine: { onZero: false },
                axisLabel: {
                  formatter: '{value} km'
                },
                boundaryGap: false,
                data: ['0', '10', '20', '30', '40', '50', '60', '70', '80']
              },
              series: [
                {
                  name: '高度(km)与气温(°C)变化关系',
                  type: 'line',
                  symbolSize: 10,
                  symbol: 'circle',
                  smooth: true,
                  lineStyle: {
                    width: 3,
                    shadowColor: 'rgba(0,0,0,0.3)',
                    shadowBlur: 10,
                    shadowOffsetY: 8
                  },
                  data: [15, -50, -56.5, -46.5, -22.1, -2.5, -27.7, -55.7, -76.5]
                }
              ]
            }
          },
          '1-0': {
            'type': '',
            'data': {
              title: {
                text: '基础雷达图'
              },
              tooltip: {},
              legend: {
                data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
              },
              radar: {
                // shape: 'circle',
                name: {
                  textStyle: {
                    color: '#fff',
                    backgroundColor: '#999',
                    borderRadius: 3,
                    padding: [3, 5]
                  }
                },
                indicator: [
                  { name: '销售（sales）', max: 6500 },
                  { name: '管理（Administration）', max: 16000 },
                  { name: '信息技术（Information Techology）', max: 30000 },
                  { name: '客服（Customer Support）', max: 38000 },
                  { name: '研发（Development）', max: 52000 },
                  { name: '市场（Marketing）', max: 25000 }
                ]
              },
              series: [{
                name: '预算 vs 开销（Budget vs spending）',
                type: 'radar',
                // areaStyle: {normal: {}},
                data: [
                  {
                    value: [4300, 10000, 28000, 35000, 50000, 19000],
                    name: '预算分配（Allocated Budget）'
                  },
                  {
                    value: [5000, 14000, 28000, 31000, 42000, 21000],
                    name: '实际开销（Actual Spending）'
                  }
                ]
              }]
            }
          },
          '1-1': {
            'type': '',
            'data': {
              xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line'
              }]
            }
          },
          '1-2': {
            'type': '',
            'data': {
              xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line'
              }]
            }
          },
          '2-0': {
            'type': '',
            'data': {
              xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line'
              }]
            }
          },
          '2-1': {
            'type': '',
            'data': {
              xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line'
              }]
            }
          }
        }
      },
      f: {}
    }
  },
  mounted() {
    const containers = []
    for (let i = 0; i < this.result.layout.length; i++) {
      for (let j = 0; j < this.result.layout[i]; j++) {
        const obj = {}
        obj.key = i + '-' + j
        const curr = document.getElementById(i + '-' + j)
        obj.value = echarts.init(curr)
        containers.push(obj)
      }
    }

    this.$nextTick(
      () => {
        for (let k = 0; k < containers.length; k++) {
          containers[k].value.setOption(this.result.views[containers[k].key].data)
        }
      }
    )
  },
  methods: {
    goto() {
      this.$router.push({ name: 'Pod' })
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
  min-height: 300px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
