<template>
  <div>
    <el-progress :percentage="aa"></el-progress>
    <el-progress :percentage="100" :format="format"></el-progress>
    <el-progress :percentage="60" status="success"></el-progress>
    <el-progress :percentage="50" status="warning"></el-progress>
    <el-progress :percentage="32" status="exception"></el-progress>
  </div>
</template>

<style>
</style>
<script>
import { getResource } from "@/api/k8sResource";

export default {
    data() {
    return {
      aa: undefined
    }
  },
  created() {
    getResource({
      token: "default",
      kind: "Frontend",
      namespace: "default",
      name: "title-project",
    }).then((response) => {
      this.aa = parseInt(response.data.metadata.labels.number)
    })
  },
  methods: {
    format(percentage) {
      return percentage === 100 ? "满" : `${percentage}%`;
    },
  },
};
</script>