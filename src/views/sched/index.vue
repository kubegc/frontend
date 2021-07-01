<template>
  <div>
    <el-button
      type="primary"
      style="display: block; margin-left: 20px; margin-top: 20px"
      @click="execute()"
    >调度过程回放
    </el-button>
    <!-- <p style="margin-left: 20px">
      注意：index必须从1开始且连续，注意任务应用关联性！
    </p> -->
    <div
      class="card-editor-container"
      style="
        width: 5%;
        height: 10px;
        float: left;
      "
    >
      <!-- <json-editor ref="EditableJson" v-model="value" /> -->
      <EditableJson v-model="json" v-show="false" />
    </div>
    <div id="myChart" style="width: 95%; height: 350px; float: left" />
  </div>
</template>
<script>
import { getResource, getScheduleData } from '@/api/kubernetes'
import { setInterval } from 'timers'
import elDragDialog from '@/directive/el-drag-dialog'
import EditableJson from '@/components/EditableJson'
import { mapGetters } from 'vuex'
const echarts = require('echarts')

export default {
  name: 'Schedule',
  directives: { elDragDialog },
  components: {
    EditableJson
  },
  data() {
    return {
      echartsData: [],
      symbol: [],
      categories: [],
      tipData: [],
      data: [],
      json: {},
      colors: [],
      failure: [],
      animations: [],
      counter: 0,
      testData: {
        name: 'flare',

        children: [
          {
            name: 'flex',
            value: 4116,
            collapsed: true
          }
        ]
      }
    }
  },
  mounted() {
    getResource({
      token: this.token,
      kind: 'MCMF',
      name: 'simpleparameter',
      namespace: 'default'
    }).then((response) => {
      if (this.$valid(response)) {
        this.json = response.data.spec.data
      }
    })
  },
  computed: {
    ...mapGetters(['token', 'name'])
  },
  methods: {
    validateRes(res) {
      if (res.code == 20000) {
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
    },
    execute() {
      //                 AgetScheduleData().then(response => {
      //           console.log(response.data)

      //           this.failure = response.data.failure
      //           this.tipData = response.data.tipData
      //           this.symbol = response.data.symbol
      //             this.echartsData = response.data.links
      //                 for(let i = 0;i<response.data.links.length;i++) {

      //                     setTimeout(function(){
      //                         this.drawLine(i)
      //                     }.bind(this)
      // , i*200)
      //         }
      //       })
      //       setTimeout(function(){
      //                         this.$message({
      //         message: '经过分析，是微服务场景！',
      //         type: 'success'
      //       })}.bind(this),5000)

      // this.color = ["#ff9999", "#67b55b", "MediumTurquoise", "#0399d3"];
      getScheduleData(JSON.parse(this.json)).then((response) => {
        // this.failure = response.data.failure
        // this.tipData = response.data.tipData
        this.symbol = []
        this.echartsData = []
        this.animations = []
        this.symbol = response.data.dm.data
        this.echartsData = response.data.dm.links
        this.animations = response.data.dm.animations
        this.categories = response.data.dm.categories
        this.colors = response.data.dm.colors
        this.counter = 0
        this.drawLine()
        setInterval(
          function() {
            if (this.counter < this.animations.length) {
              var temp = this.animations[this.counter]
              if (temp.type == 'link' && temp.action == 'reset') {
                for (var j = 0; j < this.echartsData.length; j++) {
                  if (
                    this.echartsData[j].source == temp.link.source &&
                    this.echartsData[j].target == temp.link.target
                  ) {
                    this.echartsData[j] = temp.link
                    this.drawLine()
                    break
                  }
                }
              }
              if (temp.type == 'link' && temp.action == 'add') {
                this.echartsData.push(temp.link)
                this.drawLine()
              }
              if (temp.type == 'data' && temp.action == 'add') {
                this.symbol.push(temp.data)
                console.log(this.symbol)
                this.drawLine()
              }
              if (temp.type == 'data' && temp.action == 'reset') {
                for (var j = 0; j < this.symbol.length; j++) {
                  if (this.symbol[j].name == temp.data.name) {
                    this.symbol[j].symbolSize = temp.data.symbolSize
                    this.drawLine()
                    break
                  }
                }
              }
              this.counter++
            }
          }.bind(this),
          500
        )
      })
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('myChart'))

      myChart.setOption(
        {
          title: {
            text: ''
          },
          color: this.colors,
          legend: [
            {
              data: this.categories.map(function(a) {
                return a
              }),
              itemWidth: 30,
              itemHeight: 20,
              textStyle: {
                fontSize: 16
              }
            }
          ],
          animationDurationUpdate: 1000,
          animationEasingUpdate: 'quadraticOut',
          // graphic: [
          //   {
          //     type: "group",
          //     bounding: "raw",
          //     right: 110,
          //     top: 110,
          //     z: 100,
          //     children: [
          //       {
          //         type: "text",
          //         left: "center",
          //         top: "center",
          //         z: 100,
          //         style: {
          //           fill: "black",
          //           text:
          //             "平均调度时间：" +
          //             this.tipData[i][0] +
          //             "ms" +
          //             "\n" +
          //             "\n" +
          //             "最长调度时间：" +
          //             this.tipData[i][1] +
          //             "ms" +
          //             "\n" +
          //             "\n" +
          //             "最短调度时间：" +
          //             this.tipData[i][2] +
          //             "ms" +
          //             "\n" +
          //             "\n" +
          //             "成功数:" +
          //             this.tipData[i][3] +
          //             "\n" +
          //             "\n" +
          //             "失败数:" +
          //             this.tipData[i][4],
          //           font: "bold 18px Microsoft YaHei"
          //         }
          //       }
          //     ]
          //   }
          // ],

          series: [
            {
              type: 'graph',
              symbolSize: 50,
              roam: true,
              categories: this.categories,
              label: {
                normal: {
                  show: true,
                  fontSize: 12
                }
              },
              edgeSymbol: ['circle', 'arrow'],
              lineStyle: {
                width: 2.5,
                color: '#33cc33'
                // shadowColor: 'black',
                // shadowOffsetX: 1,
                // shadowOffsetY: 1,
                // shadowBlur: 5
              },
              data: this.symbol,
              links: this.echartsData
            }
          ]
        },
        true
      )
    }
  }
}
</script>
