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
      <el-steps :active="active" finish-status="success">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3"></el-step>
        <el-step title="步骤 4"></el-step>
      </el-steps>

      <el-button style="margin-top: 12px" @click="next">上一步</el-button>
      <el-button style="margin-top: 12px" @click="next">下一步</el-button>
      <el-button style="margin-top: 12px" @click="next">提交</el-button>
    </div>
  </div>
</template>

<script>
import { getResource } from "@/api/k8sResource";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      activeName: "",
      active: 0,
      desc: "",
      kind: "Wizzard",
    };
  },

  methods: {
    next() {
      if (this.active++ > 2) this.active = 0;
    },
  },

  computed: {
    ...mapGetters(["token"]),
  },

  created() {
    getResource({
      token: this.token,
      kind: "Frontend",
      name: "desc-" + this.kind.toLowerCase(),
      namespace: "default",
    }).then((response) => {
      if (this.$valid(response)) {
        this.desc = response.data.spec.desc;
      }
    });
  },
};
</script>