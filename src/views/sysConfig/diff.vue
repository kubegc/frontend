<template>
  <div class="container">
    <el-form label-position="top">
      <el-form-item label="云服务版本1">
        <el-select
          filterable
          style="float: left"
          v-model="value1"
          placeholder="请选择"
          @change="handle(value1)"
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

      <el-form-item label="云服务版本2">
        <el-select
          filterable
          style="float: left"
          v-model="value2"
          placeholder="请选择"
          @change="handle2(value2)"
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

      <!-- <el-form-item label="版本1：">
        <el-input :rows="6" type="textarea" v-model="form.v1" />
      </el-form-item>
      <el-form-item label="版本2：">
        <el-input :rows="6" type="textarea" v-model="form.v2" />
      </el-form-item> -->
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
  diffResource,
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
      value1: "",
      value2: "",
      name1: "",
      name2: "",
      jsonObj: {},
      resTemp: [],
      id: "",
      picData: {},
    };
  },
  mounted() {
    listResources({
      kind: "Template",
      page: 1,
      limit: 25,
      labels: {},
    }).then((response) => {
      var res = response.data.items;
      this.resTemp = response.data.items;
      for (var i = 0; i < res.length; i++) {
        var obj = res[i].metadata.name;
        var temp = { value: obj, label: obj };
        this.options.push(temp);
      }
    });
  },
  methods: {
    handle(value1) {
      this.name1 = value1
      
    },
    handle2(value2) {
      this.name2 = value2
      
    },
    onSubmit() {
      diffResource({
        kind1: 'Template',
        namespace1: 'default',
        kind2: 'Template',
        namespace2: 'default',
        name1: this.name1,
        name2: this.name2
      }).then((response) => {
        
        this.picData.name = this.value;
        this.picData.children = [];
        this.picData.itemStyle = {color: 'black',  borderColor: 'black'}

        //this.jsonObj = response.data.changedAPI;
        this.jsonObj1 = response.data.depreactedAPI;
        this.jsonObj2 = response.data.newAPI;
       
        
          //var children = [];
          for(let ele in this.jsonObj1) {
              //删除的
            
                  let kv = { name: this.jsonObj1[ele], value: this.jsonObj1[ele], itemStyle: {color: 'red', borderColor: 'red', borderType: 'dotted'}, lineStyle: {color: 'red', width: 2} };

             
              this.picData.children.push(kv);
          }
          for(let ele in this.jsonObj2) {
             
                  let kv = { name: this.jsonObj2[ele], value: this.jsonObj2[ele], itemStyle: {color: 'green',  borderColor: 'green', borderWidth: 4}, lineStyle: {color: 'green', width: 2}, label: {color: 'green', fontSize: 14} };
this.picData.children.push(kv);
              //不变的
              }
              
          
//this.picData.children = children
         
        

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
