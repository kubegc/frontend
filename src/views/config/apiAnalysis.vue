<template>
  <div :style="{ height: '1600px'}">
    <div id="myChart" :style="{width: '100%', height: '900px',float:'left'}"></div>
  </div>
</template>
<script>
import axios from "axios";

let echarts = require("echarts");

export default {
  name: "test",
  props: {
    message: {
      type: Array,
      default: []
      
    }
  },
  data() {
    return {
      echartsData: {},
      containerSDK:
        "当前SDK： https://github.com/fabric8io/kubernetes-client，版本:4.6.3",
      childValue: "hh",
      data: [],
      picData: {}
    };
  },
  mounted() {
  },
  watch: {
    message(val) {
        console.log(val)
        if(val != []) {
           // console.log('hhhh')
           this.data = val
            this.analyze()
        }
    }
    },
  methods: {
    analyze() {

      this.picData.name = this.data[0].type
      //this.picData.name = 'VirtualMachine'
      this.picData.children = []

      for(var i = 0; i < 50; i++) {
        var tmp = this.data[i].spec
        var key = Object.keys(tmp)[0]
        var param = tmp[key].lifecycle[key]
        var paramkey = Object.keys(param)
        var children = []
        for(var j = 0; j < paramkey.length; j++) {
          var kv = {name: paramkey[j], value: param[paramkey[j]]}
          children.push(kv)
        }
        var obj = {name: key, children: children}
        this.picData.children.push(obj)
      }

      for (let i = 0; i < 3; i++) {
        setTimeout(
          function() {
            this.drawLine(i);
          }.bind(this),
          i * 1000
        );
      }
    },

    validateRes(res) {
      if(res.code == 20000) {
        return 1
      }else {
        this.$notify({
          title: "error",
          message: res.data,
          type: "warning",
          duration: 3000
        });
        return 0
      }
    },

    drawLine(i) {
      let myChart = echarts.init(document.getElementById("myChart"));
      myChart.setOption({
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove"
        },
        series: [
          {
            type: "tree",
            draggable: true,
            data: [this.picData],

            left: "2%",
            right: "2%",
            top: "8%",
            bottom: "20%",

            symbol: "emptyCircle",

            orient: "vertical",

            expandAndCollapse: true,
            initialTreeDepth: i,

            label: {
              normal: {
                position: "top",
                rotate: -90,
                verticalAlign: "middle",
                align: "right",
                fontSize: 9
              }
            },

            leaves: {
              label: {
                normal: {
                  position: "bottom",
                  rotate: -90,
                  verticalAlign: "middle",
                  align: "left"
                }
              }
            },
            animationDurationUpdate: 750
          }
        ]
      });

    }
  }
};
</script>
