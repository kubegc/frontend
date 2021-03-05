<template>
  <div class="app-container">
    <!-- <div class="editor-custom-btn-container">
      <editorImage
        color="#1890ff"
        class="editor-upload-btn"
        @successCBK="imageSuccessCBK"
      />
    </div> -->
    <div class="tab-container">
      <el-tabs
        v-model="activeName"
        style="margin-top: 15px"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="item in tabMapOptions"
          :key="item.key"
          :label="item.label"
          :name="item.key"
        >
          <keep-alive>
            <div
              class="components-container"
              v-if="activeName == item.key"
              :type="item.key"
              :tabName="item.key"
            >
              <el-button
                type="primary"
                style="
                  float: left;
                  margin: 10px;
                  margin-top: 0px;
                  margin-left: 15px;
                "
                @click.native="analyze"
                >安装</el-button
              >
              <!-- <p style="line-height: 30px; height: 50px">
                当前SDK：{{ SDK }} &nbsp;&nbsp; 版本：{{ version }}
              </p> -->
              <p style="line-height: 30px; height: 50px">
                当前软件：{{ SDK }}
              </p>
              <api-analysis
                :message="parentMessage"
                v-show="test1 != test"
                v-on:childByValue="childByValue"
              />
              <el-row :gutter="20" style="margin: 5px">
                <el-col
                  :span="6"
                  v-for="(item, index) in value"
                  :key="item.metadata.name"
                  style="margin-bottom: 30px"
                >
                  <el-card class="box-card" :style="height">
                    <div slot="header" class="clearfix">
                      <span>
                        <p style="display: inline; font-size: 16px">
                          <strong>{{ value[index].metadata.name }}</strong>
                        </p>
                      </span>
                    </div>
                    <p style="font-size: 12px">{{ item.metadata.name }}</p>
                    <el-button
                      type="primary"
                      style="float: right; margin: 15px"
                      @click.native="showDialog(index)"
                      >查看/修改</el-button
                    >
                  </el-card>
                </el-col>
              </el-row>

              <el-dialog
                v-el-drag-dialog
                :visible.sync="dialogTableVisible"
                :title="title"
                @dragDialog="handleDrag"
              >
                <div class="card-editor-container">
                  <!-- <json-editor ref="EditableJson" v-model="value" /> -->
                  <EditableJson v-model="json" />
                </div>
                <div style="width: 100%; height: 50px">
                  <el-button
                    type="primary"
                    style="
                      float: right;
                      margin-top: 20px;
                      height: 40px;
                      display: inline;
                    "
                    @click.native="updateTemplate"
                    >确认</el-button
                  >
                  <!-- <el-button type="primary" style="float:right;margin-top:20px;height:40px;display:inline;margin-right:0px;" >取消</el-button> -->
                </div>
              </el-dialog>
            </div>
            <!-- <tab-pane v-if="activeName==item.key" :type="item.key" :tabName="item.key"/> -->
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import elDragDialog from "@/directive/el-drag-dialog"; // base on element-ui
import EditableJson from "@/components/EditableJson";
import {
  createResource,
  listResources,
  getResource,
  updateResource,
  getMeta,
} from "@/api/kubernetes";
import apiAnalysis from "@/views/config/apiAnalysis";
import editorImage from "./components/EditorImage";

export default {
  name: "Template",
  directives: { elDragDialog },
  components: {
    EditableJson,
    apiAnalysis,
    editorImage,
  },
  props: {
    tabName: {
      type: String,
      default: "VirtualMachine",
    },
  },
  data() {
    return {
      schedulingType: "未选择",
      test: "hhh",
      test1: "hhh",
      parentMessage: [],
      dialogTableVisible: false,
      options: [{ value: "", label: "" }],
      modelType: "",
      value: [],
      json: {},
      kind: "Container",
      catalog_kind: "catalog",
      frontend_kind: "Frontend",
      catalog_operator: "lifecycle",
      //catalog_operator: "install",
      lifecycle_kind: "Template",
      lifecycle_operator: "container",
      api_kind: "api",
      height: "height: 200px",
      title: "",
      activeName: "",
      tabMapOptions: [],
      SDK: "",
      version: "",
      sdkJson: {},
      catalogJson: {},
      namespace: "default",
      cloud_kind: "AliyunECS",
      dataTemp: [],
      templateKind: "Template"
    };
  },

  mounted() {},
  created() {
    getResource({
      kind: this.frontend_kind,
      name: this.catalog_kind + "-" + this.catalog_operator,
      namespace: this.namespace,
    }).then((response) => {
      if (this.validateRes(response) == 1) {
        this.catalogJson = response.data;
        this.tabMapOptions = response.data.spec.data.tabMapOptions;
        this.activeName = response.data.spec.data.activeName;

        getResource({
          kind: this.frontend_kind,
          name: this.api_kind + "-" + this.activeName,
          namespace: this.namespace,
        }).then((response) => {
          if (this.validateRes(response) == 1) {
            this.sdkJson = response.data;
            //this.SDK = response.data.spec.data.git;
             this.SDK = this.activeName
            // this.version = response.data.spec.data.version;
            // this.kind = response.data.spec.data.kind;

            listResources({
              kind: this.templateKind,
              page: 1,
              limit: 1000,
              labels: {

              },
            }).then((response) => {
              if (this.validateRes(response) == 1) {
                //this.value = response.data.items;
                this.dataTemp = response.data.items;
               // console.log(this.value);
              }
            });
          }
        });
      }
    });
  },

  methods: {
    validateRes(res) {
      if (res.code == 20000) {
        return 1;
      } else {
        this.$notify({
          title: "error",
          message: res.data,
          type: "warning",
          duration: 3000,
        });
        return 0;
      }
    },
    analyze() {
      this.value = [];
      this.parentMessage = this.dataTemp;
      this.test = "hh";
    },
    childByValue: function (childValue) {
      console.log(childValue);
      if (childValue == "hh") {
        this.test = "hhh";
        this.analyzeTemplete();
      }
    },
    analyzeTemplete() {
       listResources({
              kind: "Template",
              page: 1,
              limit: 1000,
              labels: {
                type: this.cloud_kind,
              },
            }).then((response) => {
              if (this.validateRes(response) == 1) {
                this.value = response.data.items;
                console.log(this.value);
              }
            });
      this.parentMessage = [];
    },

    handleClick(tab, event) {
      console.log(tab.name, event);
      getResource({
        kind: this.frontend_kind,
        name: this.api_kind + "-" + this.activeName,
        namespace: this.namespace,
      }).then((response) => {
        //this.SDK = response.data.spec.data.git;
        this.SDK = this.activeName;
        // this.version = response.data.spec.data.version;
        // listResources({
        //   kind: this.activeName + this.lifecycle_kind,
        //   namespace: this.namespace,
        // }).then((response) => {
        //   this.value = response.data;
        //   if (this.activeName == "virtualmachine") {
        //     this.height = "height: 240px";
        //   } else if (this.activeName == "container") {
        //     this.height = "height: 190px";
        //   }
        //   console.log(this.value);
        // });
      });
    },
    showDialog(index) {
      this.dialogTableVisible = true;
      this.json = this.value[index];
      this.title = this.value[index].name;
    },
    updateTemplate() {
      this.dialogTableVisible = false;
      updateResource({
        json: this.json,
        kind: this.kind,
        namespace: this.namespace,
      }).then((response) => {
        console.log(response.code);
      });
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      this.$refs.select.blur();
    },
    toRawJson(val) {
      var str = JSON.stringify(val);
      str = str.replace(/ +/g, "");
      str = str.replace(/\\n/g, "");
      str = str.substring(1, str.length - 1);
      str = str.replace(/\\/g, "");
      return str;
    },
    imageSuccessCBK(data) {
      //向后台发送请求，新增一个sdk
      console.log(data);
      this.catalogJson.spec.data.tabMapOptions.push({
        label: data.name,
        key: data.name,
      });
      updateResource({
        json: this.catalogJson,
        kind: this.frontend_kind,
        namespace: this.namespace,
      }).then((response) => {});
      console.log(this.sdkJson);
      this.sdkJson.metadata.name = this.api_kind + "-" + data.name;
      this.sdkJson.spec.data.git = data.git;
      // this.sdkJson.spec.data.version = data.version;

      createResource({
        json: this.sdkJson,
        kind: this.frontend_kind,
      }).then((response) => {});
    },
  },
};
</script>

<style lang="scss">
.board {
  margin-left: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4a9ff9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}

.card-editor-container {
  position: relative;
  width: 100%;
  height: 70%;
}
</style>

