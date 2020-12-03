<template>
  <div class="app-container">
    <routes-tree-view
      v-if="routesFile"
      v-model="routesFile"
    />
    <el-row style="margin-top: 30px">
      <el-button round @click="revert">撤销修改</el-button>
      <el-button type="primary" round @click="submit">
        提交修改
      </el-button>
    </el-row>
  </div>
</template>

<script>
import RoutesTreeView from '@/components/RoutesTreeView/index'
import { getResource, updateResource } from '@/api/k8sResource'

export default {
  components: { RoutesTreeView },
  data() {
    return {
      routesFile: undefined
    }
  },
  created() {
    this.revert()
  },
  methods: {
    revert() {
      getResource({
        kind: 'Frontend',
        name: 'routes-' + this.$store.getters.role.toLowerCase(),
        namespace: 'default'
      }).then(
        response => {
          if (this.$valid(response)) {
            this.routesFile = response.data
          }
        }
      )
    },
    submit() {
      updateResource({ json: this.routesFile }).then(
        response => {
          if (this.$valid(response)) {
            this.$message({
              message: '路由更新成功',
              type: 'success',
              duration: 4000
            })
            location.reload()
          }
        }
      )
    }
  }
}
</script>
