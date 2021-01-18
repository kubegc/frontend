<template>
  <div>
    <div class="app-container" style="margin-bottom: 20px">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item>
          <template slot="title">
            功能描述<i class="header-icon el-icon-info"></i>
          </template>
          <div v-text="desc"></div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="app-container">
      <el-tabs :tab-position="tabPosition" style="height: 200px">
        <el-tab-pane label="用户管理">用户管理</el-tab-pane>
        <el-tab-pane label="配置管理">配置管理</el-tab-pane>
        <el-tab-pane label="角色管理">角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getResource } from "@/api/k8sResource";

export default {
  data() {
    return {
      tabPosition: "left",
      activeName: "1",
    };
  },
  desc: "",
  
  created() {
    getResource({
      token: "default",
      kind: "Frontend",
      name: "desc-wizzard",
      namespace: "default",
    }).then((response) => {
      if (this.$valid(response)) {
        this.desc = response.data.spec.desc;
      }
    });
  },
};
</script>