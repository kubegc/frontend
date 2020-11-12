<template>
  <div class="app-container">
    <div class="tab-container">
      <el-tabs
        v-model="activeName"
        style="margin-top:15px;width:100%"
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
            <InnerPane v-if="activeName==item.key" :type="item.key" :tabName="item.key" />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getObj } from "@/api/commonData";
import { mapGetters } from "vuex";
import InnerPane from "./components/showTestcase";

export default {
  name: "testcase",
  components: { InnerPane },
  computed: {
    ...mapGetters(["name", "avatar", "roles"])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: "success",
        fail: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      kind: "",
      catalog_kind: "catalog",
      catalog_operator: "testcase",
      frontend_kind: "Frontend",
      tabMapOptions: [],
      activeName: "testcase1",
      innerTab: "left",
      namespace: "default"
    };
  },
  mounted() {},
  created() {
    console.log(this.$route)
    getObj({
      kind: this.frontend_kind,
      name: this.catalog_kind + '-' + this.$route.name,
      namespace: this.namespace
    }).then(response => {
      if (this.validateRes(response) == 1) {
        this.tabMapOptions = response.data.spec.data.tabMapOptions
        this.activeName = response.data.spec.data.activeName
      }
    })
  },
  methods: {
    validateRes(res) {
      if (res.code == 20000) {
        return 1
      } else {
        this.$notify({
          title: "error",
          message: res.data,
          type: "warning",
          duration: 3000
        });
        return 0
      }
    },

    handleClick() {}
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
</style>