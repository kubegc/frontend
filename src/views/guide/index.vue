<template>
  <div class="app-container">
    <el-row :gutter="15">
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="130px"
      >
        <el-col :span="16">
          <el-form-item label="页面类型" prop="chosenPageType">
            <el-select
              v-model="formData.chosenPageType"
              placeholder="请选择"
              filterable
              @change="handleGuideTypeChange"
            >
              <el-option
                v-for="(value, key) in pageTypes"
                :key="key"
                :label="value.label"
                :value="key"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col v-if="canEdit" :span="16">
          <el-form-item label="资源名称" prop="resource" >
            <el-select
              v-model="formData.resource"
              placeholder="请选择"
              filterable
              @change="handleResourceChange"
            >
              <el-option
                v-for="item in resourceOptions"
                :key="item.label"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col v-if="canEdit" :span="13">
          <el-form-item
            v-for="item in editTemplates"
            :key="item.key"
            :label="item.label"
          >
            <el-popover v-if="item.show" placement="right" trigger="hover">
              <el-image
                style="width: 800px; height: 350px"
                :src="
                  require('../../assets/' +
                    formData.chosenPageType.toLowerCase() +
                    '-' +
                    item.key +
                    '.jpg')
                "
              />
              <el-button
                slot="reference"
                type="text"
                icon="el-icon-edit"
                size="medium"
                @click="item.dialogVisible = true"
              >
                点击编辑
              </el-button>
            </el-popover>

            <el-button
              v-else
              type="text"
              icon="el-icon-edit"
              size="medium"
              @click="item.dialogVisible = true"
            >
              点击编辑
            </el-button>

            <el-dialog :visible.sync="item.dialogVisible" width="70%">
              <json-editor
                :value="JSON.stringify(item.jsonFileObj, null, 2)"
                @input="item.jsonFileObj = JSON.parse($event)"
              />
              <div slot="footer" class="dialog-footer">
                <el-button @click="item.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="item.dialogVisible = false"
                  >确 定</el-button
                >
              </div>
            </el-dialog>
          </el-form-item>
        </el-col>

        <el-col v-if="canEdit" :span="13">
          <el-form-item label="路由">
            <routes-tree-view
              v-model="routesFile"
              :resource-name="formData.resource"
              :comp="comp"
              :page-type="formData.chosenPageType"
            />
          </el-form-item>
        </el-col>

        <el-col v-if="canEdit" :span="24">
          <el-form-item size="large">
            <el-button type="primary" round @click="submitForm">提交</el-button>
            <el-button round @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>


<script>
import JsonEditor from "@/components/JsonEditorSpecial/index";
import RoutesTreeView from "@/components/RoutesTreeView/index";

import {
  createResource,
  getResource,
  updateResource,
  getMeta,
} from "@/api/k8sResource";
import { mapGetters } from "vuex";

export default {
  components: { RoutesTreeView, JsonEditor },
  data() {
    return {
      formData: {
        resource: "",
        chosenPageType: "",
      },
      
      comp: "",
      
      rules: {
        resource: [
          {
            required: true,
            message: "请选择资源名称",
            trigger: "blur",
          },
        ],
        chosenPageType: [
          {
            required: true,
            message: "请选择页面类型",
            trigger: "blur",
          },
        ],
      },
      canEdit: false,
      editTemplates: [],
      pageTypes: [],
      routeVisible: false,
      routesFile: {},
      resourceOptions: undefined,
    };
  },
  watch: {
    "formData.chosenPageType": function (newVal) {
      this.comp = this.pageTypes[this.formData.chosenPageType].component;
    },
  },

  created() {
    getResource({
      token: this.token,
      kind: "Frontend",
      name: "routes-" + this.name,
      namespace: "default",
    }).then((response) => {
      if (this.$valid(response)) {
        this.routesFile = response.data;
      }
    });
    getResource({ kind: "Frontend", name: "pages", namespace: "default" }).then(
      (response) => {
        if (this.$valid(response)) {
          this.pageTypes = response.data.spec.pageTypes;
        }
      }
    );
  },

  computed: {
    ...mapGetters(["token", "name"]),
  },

  methods: {
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // if valid
        const alreadyCreate = [];
        try {
          this.editTemplates.forEach((item) => {
            console.log(item.jsonFileObj)
            createResource({ token: this.token, json: item.jsonFileObj }).then(
              (response) => {
                if (this.$valid(response)) {
                  alreadyCreate.push(item.jsonFileObj);
                } else {
                  throw Error;
                }
              }
            );
          });
          updateResource({ token: this.token, json: this.routesFile }).then(
            (response) => {
              if (this.$valid(response)) {
                this.$message({
                  message: "创建资源页面成功",
                  type: "success",
                  duration: 2000,
                });
              }
            }
          );
        } catch (e) {
          this.$message({
            message: "创建资源页面失败",
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    handleResourceChange(value) {
      for (const item of this.editTemplates) {
        item.jsonFileObj.metadata.name =
          item.key.toLowerCase() + "-" + value.toLowerCase();
      }
    },
    handleGuideTypeChange(value) {
      this.canEdit = false;
      getResource({
        kind: "Frontend",
        name: "wizard-" + value.toLowerCase(),
        namespace: "default",
      }).then((response) => {
        if (this.$valid(response)) {
          const info = response.data.spec.data;
          this.editTemplates = [];
          for (const key in info.keys) {
            const temp = {};
            temp.key = key;
            temp.label = info.keys[key].label;
            temp.show = info.keys[key].show;
            temp.jsonFileObj = info.values[key];
            temp.dialogVisible = false;
            this.editTemplates.push(temp);
          }

          if (!this.resourceOptions) {
            this.resourceOptions = [];
            getMeta({ token: this.token }).then((response) => {
              if (this.$valid(response)) {
                const data = response.data;
                for (const key in data) {
                  const curr = {};
                  curr.value = key;
                  curr.label = key;
                  this.resourceOptions.push(curr);
                }
              }
            });
          }

          this.canEdit = true;
        }
      });
    },
  },
};
</script>
