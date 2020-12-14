<template>
  <div class="container">
    <div
        id="keyChart"
        :style="{ width: '40%', height: '700px', float: 'left' }"
      ></div>
    <div :style="{ height: '1000px' }">
      <div
        id="myChart"
        :style="{ width: '100%', height: '900px', float: 'left' }"
      ></div>
    </div>
    <el-dialog
      :visible.sync="createDialogVisible"
      :title="this.createResource"
      @dragDialog="handleDrag"
    >
    <el-form label-position="top" :model="dynamicValidateForm">
      <el-form-item label="云服务类型">
        <el-select
          filterable
          style="float: left"
          v-model="dynamicValidateForm.value"
          placeholder="请选择"
          @change="handle(dynamicValidateForm.value)"
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

      <el-form-item 
      v-for="(domain, index) in dynamicValidateForm.domains"
    :label="'版本' + index"
    :key="domain.value">
        <el-input :rows="6" type="textarea" v-model="domain.value" />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="addDomain">新增</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
      
    </el-dialog>
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
      dynamicValidateForm: {
          domains: [{
            value: ''
          }],
          value: ''
        },
      form: {
        v1: "",
        v2: "",
      },
      jsonObj: {},
      resTemp: [],
      id: "",
      picData: {},
      apiNum: "123",
      createDialogVisible: false,
      createResource: "配置SDK",
      data: []
    };
  },
  mounted() {
      let keyChart = echarts.init(document.getElementById("keyChart"));
      keyChart.setOption({
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
        },
         series: [
        {
            type: 'graph',
            layout: 'none',
            symbolSize: 50,
            roam: true,
            label: {
                show: true
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
                fontSize: 20
            },
            data: [{
                name: '节点1',
                x: 300,
                y: 500,
                symbol: 'rect',
                symbolSize: [100, 50]
            }, {
                name: 'API数量：' + this.apiNum,
                x: 700,
                y: 500,
                symbol: 'rect',
                symbolSize: [100, 50]
            }, {
                name: '节点3',
                x: 500,
                y: 700,
                symbol: 'rect',
                symbolSize: [100, 50]
            }],
            // links: [],
            links: [{
                source: 0,
                target: 1,
                symbolSize: [5, 20],
                label: {
                    show: true
                },
                lineStyle: {
                    width: 5,
                    curveness: 0.3
                }
            }, {
                source: 1,
                target: 2,
                label: {
                    show: true
                },
                lineStyle: {
                    width: 5,
                    curveness: 0.3
                }
            }, {
                source: 2,
                target: 0,
                 label: {
                    show: true
                },
                lineStyle: {
                    width: 5,
                    curveness: 0.3
                }
            }
              ],
            lineStyle: {
                opacity: 0.9,
                width: 2,
                curveness: 0
            }
        }
    ]
      });

      //解决this作用域的问题
        let _self = this

      keyChart.on('click', function (params) {
    if (params.dataIndex === 1) {
         _self.analyze()
        
    }else if(params.dataIndex === 0) {
        _self.createDialogVisible = true
    }
    
});
  

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

      handleDrag() {
      this.$refs.select.blur()
    },
      
      addDomain() {
        this.dynamicValidateForm.domains.push({
          value: '',
          key: Date.now()
        });
      },

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
     analyze() {

         this.picData = {}
         listResources({
              kind: "Template",
              page: 1,
              limit: 1000,
              labels: {
                type: this.dynamicValidateForm.value,
              },
            }).then((response) => {
                //this.value = response.data.items;
                this.data = response.data.items;
                this.picData.name = this.data[0].type
                this.picData.children = []

      for(var i = 0; i < this.data.length; i++) {
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

 for (let i = 0; i < 2; i++) {
        setTimeout(
          function() {
            this.drawLineSingle(i)
          }.bind(this),
          i * 1000
        );
      }
      
               
            
            });

      
    },

    onSubmit() {
        if(this.dynamicValidateForm.domains.length == 1) {
            this.apiNum = '1000'
            this.createDialogVisible = false

        }else {
            execDiff({
        v1: JSON.parse(this.dynamicValidateForm.domains[0].value),
        v2: JSON.parse(this.dynamicValidateForm.domains[1].value),
      }).then((response) => {
        var v1 = JSON.parse(this.dynamicValidateForm.domains[0].value).version;
        var v2 = JSON.parse(this.dynamicValidateForm.domains[1].value).version;
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
                  var kv = { name: union[ele], value: obj2[union[ele]], itemStyle: {color: 'red', borderColor: 'red', borderType: 'dotted'}, lineStyle: {color: 'red', width: 4} };

              //新增的
              }else if(!paramkey1.includes(union[ele]) && paramkey2.includes(union[ele])) {
                  var kv = { name: union[ele], value: obj2[union[ele]], itemStyle: {color: 'green',  borderColor: 'green', borderWidth: 4}, lineStyle: {color: 'green', width: 4}, label: {color: 'green', fontSize: 14} };

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
        this.createDialogVisible = false
      });
        }
      
    },

    drawLineSingle(i) {
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
