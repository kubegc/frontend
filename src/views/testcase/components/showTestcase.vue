<template>
  <div class="container">
    <div class="components-container">
      <el-row :gutter="20" style="margin:30px;">
        <el-col
          :span="7"
          v-for="(item,index) in value.slice(0,3)"
          :key="item.name"
          style="margin-bottom:30px"
        >
          <el-card class="box-card" style="height:130px">
            <div slot="header" class="clearfix" style="height:10px;padding:0px">
              <span>
                <p style="display:inline;font-size:12px;">
                  <strong>{{ value[index].name }}</strong>
                </p>
              </span>
            </div>
            <p style="font-size:10px; margin:2px">此处配置项用于操作{{item.name}}</p>
            <el-button
              type="primary"
              size="mini"
              style="float:right;margin:2px;"
              @click.native="editTestcase(index)"
            >编辑配置</el-button>
          </el-card>
        </el-col>
      </el-row>

      <el-dialog
        v-el-drag-dialog
        :visible.sync="dialogTableVisible"
        :title="json.kind"
        @dragDialog="handleDrag"
      >
        <div class="card-editor-container">
          <!-- <json-editor ref="EditableJson" v-model="value" /> -->
          <EditableJson v-model="json" />
        </div>
        <div style="width:100%;height:50px;">
          <el-button
            type="primary"
            style="float:right;margin-top:20px;height:40px;display:inline;"
            @click.native="updateTestcase"
          >确认配置</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="filter-container" style="margin-left:40px">
      <div style="width:350px">
        <el-button class="filter-item" type="primary" style="margin-top:9px;" @click="fetchData">执行</el-button>
        <el-button
          class="filter-item"
          type="primary"
          style="margin-top:9px;"
          @click="deleteTestcase"
        >删除</el-button>

        <el-button
          class="filter-item"
          type="primary"
          style="margin-top:9px;"
          @click="fetchStatus"
        >刷新</el-button>
      </div>
      <div style="width:450px;float:left">
        <el-table :data="list" style="width: 400px;padding-top: 15px;">
          <el-table-column label="用例名称" width="150px">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <!-- <el-table-column label="调度策略" width="120px">
            <template>{{ this.tabName }}</template>
          </el-table-column>-->
          <el-table-column label="任务" width="150px" align="center">
            <template slot-scope="{row}">
              <el-tag
                style="margin-bottom:5px"
                v-for="item in row.podResults"
                :key="item.name"
              >{{ item.name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100px" align="center">
            <template slot-scope="{row}">
              <el-tag
                style="width:70px; margin-bottom:5px"
                v-for="item in row.podResults"
                :key="item.name"
                :type="item.deployed | statusFilter"
              >{{ item.deployed }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <iframe
        v-if="this.tabName == this.lazyImage"
        style="width:650px;height:400px;display:block;float:right"
        :src="monitor_rs"
      ></iframe>

      <iframe
        v-if="this.tabName == this.defaultImage"
        style="width:650px;height:400px;display:block;float:right"
        :src="monitor_rs"
      ></iframe>
      <div
        v-if="this.tabName != this.defaultImage && this.tabName != this.lazyImage && this.tabName != this.vmMigrate"
      >
        <div
          v-for="item in this.chart"
          :key="item.name"
          :id="item.name"
          :style="{width: '200px', height: '250px',float:'left'}"
        ></div>
      </div>
      <div
        :id="vmMigrate"
        v-if="this.tabName == this.vmMigrate"
        :style="{width: '500px', height: '250px',float:'right'}"
      ></div>
    </div>
  </div>
</template>

<script>
import {
  getJsonData,
  createSthFromTemplate,
  updateJsonData,
  deletSthFromTemplate,
  getSthFromTemplate,
  getObj,
  createObj,
  removeObj
} from "@/api/commonData";
import { mapGetters } from "vuex";
import elDragDialog from "@/directive/el-drag-dialog";
import EditableJson from "@/components/EditableJson";
import { getMonitorInfo } from "@/utils/getResource";

let echarts = require("echarts");

export default {
  name: "testcase",
  directives: { elDragDialog },
  components: {
    EditableJson
  },
  computed: {
    ...mapGetters(["name", "avatar", "roles"])
  },
  props: {
    tabName: {
      type: String,
      default: "defaultSched"
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: "success",
        false: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      chart: [],
      lazyImage: "lazyImagePull",
      defaultImage: "defaultImagePull",
      testData: {
        name: "",
        children: []
      },
      list: [],
      listLoading: true,
      value: "",
      json: [],
      dialogTableVisible: false,
      kind: "TestCase",
      index: 0,
      monitor_rs: "",
      nodeName: "",
      vmMigrate: "vmmigration",
      namespace: "default"
    };
  },
  mounted() {},
  created() {
    getObj({
      kind: this.kind,
      name: this.kind.toLowerCase() + '-' + this.tabName.toLowerCase(),
      namespace: this.namespace
    }).then(response => {
      if (this.validateRes(response) == 1) {
        this.value = response.data.spec.data.spec.testcases;
        this.chart = response.data.spec.data.spec.testcases;
      }
    });

    this.fetchStatus()

    this.monitor_rs = getMonitorInfo(this.kind, this.nodeName, null);
  },
  methods: {
    handleDrag() {
      this.$refs.select.blur();
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

    editTestcase(index) {
      this.dialogTableVisible = true;
      this.json = this.value[index];
      this.index = index;
    },
    updateTestcase() {
      this.dialogTableVisible = false;
      var res = this.toRawJson(this.json);
      updateJsonData({
        operator: "update",
        json: JSON.parse(res),
        kind: this.kind
      }).then(response => {
        console.log(response.code);
      });
    },

    toRawJson(val) {
      var str = JSON.stringify(val);
      str = str.replace(/ +/g, "");
      str = str.replace(/\\n/g, "");
      if (str[0] == '"') {
        str = str.substring(1, str.length - 1);
      }
      str = str.replace(/\\/g, "");
      return str;
    },

    fetchStatus() {
      if (
        this.tabName == "defaultImagePull" ||
        this.tabName == "lazyImagePull"
      ) {
        this.monitor_rs = getMonitorInfo(this.kind, this.nodeName);
        getObj({
          kind: this.kind,
          name: this.tabName.toLowerCase(),
          namespace: this.namespace
        }).then(response => {
          if (!response.hasOwnProperty("data")) {
            this.list = [];
          } else {
            if (response.data.spec.hasOwnProperty("results")) {
              var listtemp = [];
              var results = response.data.spec.results;
              for (let i = 0; i < results.length; i++) {
                if (results[i].status == "Complete") {
                  listtemp.push(results[i]);
                }
              }
              this.list = listtemp;
              console.log(this.list);
            } else {
              this.$message({
                message: "正在执行！",
                type: "success"
              });
            }
          }
        });
      } else if (
        this.tabName == "defaultSched" ||
        this.tabName == "prioritySched" ||
        this.tabName == "overpSched"
      ) {
        getObj({
          kind: this.kind,
          name: this.tabName.toLowerCase(),
          namespace: this.namespace
        }).then(response => {
          if (!response.hasOwnProperty("data")) {
            this.list = [];
          } else if (response.data.spec.hasOwnProperty("results")) {
            var listtemp = [];
            var results = response.data.spec.results;
            for (let i = 0; i < results.length; i++) {
              if (results[i].status == "Complete") {
                listtemp.push(results[i]);
                var children = results[i].podResults;
                for (let j = 0; j < children.length; j++) {
                  if (children[j].deployed == true) {
                    children[j].itemStyle = {
                      color: "#33cc33"
                    };
                  } else {
                    children[j].itemStyle = {
                      color: "#ff3300"
                    };
                  }
                }
                this.testData.name = results[i].name;
                this.testData.children = children;
                this.drawLine(this.testData);
              }
            }
            this.list = listtemp;
            console.log(this.list);
          } else {
            this.$message({
              message: "正在执行！",
              type: "success"
            });
          }
        });
      } else {
        getObj({
          kind: this.kind,
          name: this.tabName.toLowerCase(),
          namespace: this.namespace
        }).then(response => {
          if (response.data.spec.hasOwnProperty("results")) {
            var listtemp = [];
            var results = response.data.spec.results;
            for (let i = 0; i < results.length; i++) {
              if (results[i].status == "Complete") {
                listtemp.push(results[i]);
                var children = results[i].podResults;
                for (let j = 0; j < children.length; j++) {
                  if (children[j].deployed == true) {
                    children[j].itemStyle = {
                      color: "#33cc33"
                    };
                  } else {
                    children[j].itemStyle = {
                      color: "#ff3300"
                    };
                  }
                  if (children[j].deployed == true && children[j].x == 800) {
                    flag = 1;
                    this.testData.link = [
                      {
                        source: 0,
                        target: 1,
                        lineStyle: {
                          normal: {
                            width: 5,
                            curveness: 0.2
                          }
                        }
                      }
                    ];
                  } else {
                    var links = [
                      [
                        {
                          source: 0,
                          target: 1,
                          lineStyle: {
                            normal: {
                              width: 5,
                              curveness: 0.2
                            }
                          }
                        }
                      ],
                      []
                    ];
                  }
                }
                this.testData.children = children;
                setInterval(
                  function() {
                    var flag = 0;
                    this.testData.link = [links[i]];
                    this.migrateVM(this.testData);
                  }.bind(this),
                  500
                );
              }
            }
            this.list = listtemp;
            console.log(this.list);
          } else {
            this.$message({
              message: "正在执行！",
              type: "success"
            });
          }
        });
      }
    },

    deleteTestcase() {
      getObj({
        kind: this.kind,
        name: this.kind.toLowerCase() + '-' + this.tabName.toLowerCase(),
        namespace: this.namespace
      }).then(response => {
        removeObj({
          json: response.data.spec.data.spec.testcases[0].pods[0],
          kind: "Pod",
          namespace: this.namespace
        }).then(response => {
          this.fetchStatus();
        });
      });
    },

    fetchData() {
      this.$message({
        message: "开始测试！",
        type: "success"
      });
      getObj({
        kind: this.kind,
        name: this.kind.toLowerCase() + '-' + this.tabName.toLowerCase(),
        namespace: this.namespace
      }).then(response => {
        createObj({
          json: response.data.spec.data.spec.testcases[0].pods[0],
          kind: "Pod"
        }).then(response => {});
      });
    },

    drawLine(testData) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(testData.name));

      myChart.setOption({
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove"
        },
        series: [
          {
            type: "tree",

            data: [testData],

            left: "2%",
            right: "2%",
            top: "25%",
            bottom: "30%",

            symbol: "circle",
            symbolSize: 15,
            itemStyle: {
              color: "black",
              borderWidth: 0
            },

            orient: "vertical",

            expandAndCollapse: true,

            label: {
              normal: {
                position: "top",
                verticalAlign: "middle",
                align: "right",
                fontSize: 14
              }
            },

            leaves: {
              label: {
                normal: {
                  position: "bottom",
                  verticalAlign: "right",
                  align: "right",
                  rotate: -90
                }
              }
            },
            animationDurationUpdate: 750
          }
        ]
      });
    },

    migrateVM(testData) {
      // 基于准备好的dom，初始化echarts实例
      if (flag == 0) {
        flag++;
      } else {
        flag--;
      }

      let myChart = this.$echarts.init(document.getElementById(this.vmMigrate));

      myChart.setOption({
        animationDurationUpdate: 1500,
        animationEasingUpdate: "quinticInOut",
        series: [
          {
            type: "graph",
            layout: "none",
            symbolSize: 50,
            roam: true,
            label: {
              normal: {
                show: true
              }
            },
            edgeSymbol: ["circle", "arrow"],
            edgeSymbolSize: [4, 10],

            data: [testData.children],
            links: [testData.link]
          }
        ]
      });
    }
  }
};
</script>

<style scoped>
.link {
  color: red;
}
a:hover {
  text-decoration: underline;
}
input {
  height: 35px;
}
.el-card__header {
  padding: 5px 5px;
}
</style>