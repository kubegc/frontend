<template>
  <div class="container">
    <el-form label-position="top">
      <el-form-item label="云服务类型">
        <el-select
          filterable
          style="float: left"
          v-model="value"
          placeholder="请选择"
          @change="handle(value)"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="版本1：">
        <el-input :rows="6" type="textarea" v-model="form.v1" />
      </el-form-item>
      <el-form-item label="版本2：">
        <el-input :rows="6" type="textarea" v-model="form.v2" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">差异分析</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <div :style="{ height: '1000px' }">
      <div
        id="myChart"
        :style="{ width: '100%', height: '900px', float: 'left' }"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import JsonEditor from "@/components/JsonEditorSpecial/index";
import {
  createResource,
  getResource,
  updateResource,
  listResources,
  getMeta,
  execDiff,
} from "@/api/k8sResource";
import axios from "axios";

let echarts = require("echarts");

export default {
  name: "Dashboard",
  components: { JsonEditor },
  computed: {
    ...mapGetters(["name", "role"]),
  },
  data() {
    return {
      options: [],
      value: "",
      form: {
        v1: "",
        v2: "",
      },
      jsonObj: {},
      resTemp: [],
      id: "",
      picData: {},
    };
  },
  mounted() {
    listResources({
      kind: "Account",
      page: 1,
      limit: 1000,
      labels: {},
    }).then((response) => {
      var res = response.data.items;
      this.resTemp = response.data.items;
      for (var i = 0; i < res.length; i++) {
        var obj = res[i].spec.kind;
        var temp = { value: obj, label: obj };
        this.options.push(temp);
      }
    });
  },
  methods: {
    handle(value) {
      for (var i = 0; i < this.resTemp.length; i++) {
        var obj = this.resTemp[i].spec;
        var key = Object.keys(obj)[0];
        if (value == key) {
          this.form.desc = JSON.stringify(obj[value].lifecycle[value], null, 4);
          this.requestPara = obj;
          break;
        }
      }
    },
    onSubmit() {
      execDiff({
        v1: JSON.parse(this.form.v1),
        v2: JSON.parse(this.form.v2),
      }).then((response) => {
        var v1 = JSON.parse(this.form.v1).version;
        var v2 = JSON.parse(this.form.v2).version;
        this.picData.name = this.value;
        this.picData.children = [];
        this.picData.itemStyle = {color: 'black',  borderColor: 'black'}

        this.jsonObj = response.data.changedAPI;
        var changeAPI = Object.keys(this.jsonObj);
        for (var i = 0; i < changeAPI.length; i++) {
           
          var obj1 = this.jsonObj[changeAPI[i]][v1].lifecycle[changeAPI[i]]
          var obj2 = this.jsonObj[changeAPI[i]][v2].lifecycle[changeAPI[i]]

          var paramkey1 = Object.keys(obj1);
          var paramkey2 = Object.keys(obj2);
          let a = new Set(paramkey1);
          let b = new Set(paramkey2);
          let union = new Set([...a, ...b])
          union = Array.from(union)
          var children = [];
          for(let ele in union) {
              //删除的
              if(paramkey1.includes(union[ele]) && !paramkey2.includes(union[ele])) {
                  var kv = { name: union[ele], value: obj2[union[ele]], itemStyle: {color: 'red', borderColor: 'red', borderType: 'dotted'}, lineStyle: {color: 'red'} };

              //新增的
              }else if(!paramkey1.includes(union[ele]) && paramkey2.includes(union[ele])) {
                  var kv = { name: union[ele], value: obj2[union[ele]], itemStyle: {color: 'green',  borderColor: 'green'}, lineStyle: {color: 'green'} };

              //不变的
              }else {
                  var kv = { name: union[ele], value: obj2[union[ele]], itemStyle: {color: 'black',  borderColor: 'black'}};
              }
              children.push(kv);
          }

          var obj = { name: changeAPI[i], children: children, itemStyle: {color: 'black',  borderColor: 'black'} };
          this.picData.children.push(obj);
        }

        this.drawLine();
      });
    },

    drawLine() {
      let myChart = echarts.init(document.getElementById("myChart"));
      myChart.setOption({
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
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

            label: {
              normal: {
                position: "top",
                rotate: -90,
                verticalAlign: "middle",
                align: "right",
                fontSize: 9,
              },
            },

            leaves: {
              label: {
                normal: {
                  position: "bottom",
                  rotate: -90,
                  verticalAlign: "middle",
                  align: "left",
                },
              },
            },
            animationDurationUpdate: 750,
          },
        ],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.iframe {
  width: 100%;
  height: 1000px;
  border: 0ch;
}
</style>
