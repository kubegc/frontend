<template>
  <div :style="{width: '1280px', height: '1600px'}">
    
    <div id="myChart" :style="{width: '1100px', height: '700px',float:'left'}"></div>
  </div>
</template>
<script>
import { getEchartsData } from "@/api/taskData";
let echarts = require("echarts");

export default {
  name: "test",
  props: {
    message: {
      type: String,
      default: "yy"
    }
  },
  data() {
    return {
      echartsData: {},
      containerSDK:
        "当前SDK： https://github.com/fabric8io/kubernetes-client，版本:4.6.3",
      childValue: "hh"
    };
  },
  mounted() {
  },
  watch: {
    message(val) {
        console.log(val)
        if(val == "aaa") {
           // console.log('hhhh')
            this.analyze()
        }
    }
    },
  methods: {
    analyze() {
        getEchartsData().then(response => {
      this.echartsData = response.data;
      console.log(response.data);
      //this.drawLine()
      for (let i = 0; i < 4; i++) {
        setTimeout(
          function() {
            this.drawLine(i);
          }.bind(this),
          i * 1000
        );
      }
      setTimeout(
        function() {
          this.$emit("childByValue", this.childValue);
          this.echartsData = {}
        }.bind(this),
        4 * 1000
      );
    });
      
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
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.setOption({
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove"
        },
        series: [
          {
            type: "tree",

            data: [this.echartsData],

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
