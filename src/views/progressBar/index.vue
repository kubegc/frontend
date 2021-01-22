<template>
  <div>
    <el-button @click="dialogVisible = true">测试</el-button>
    <JsonDialog
      :value.sync="dialogVisible"
      :json-file-obj="routesFile"
      @update:jsonFileObj="routesFile = JSON.parse($event)"
    />
  </div>
</template>
<script>
import JsonDialog from '@/components/JsonDialog'
import { getResource } from '@/api/k8sResource'

export default {
  components: { JsonDialog },
  data() {
    return {
      dialogVisible: false,
      routesFile: {}
    }
  },
  created() {
    getResource({ kind: 'Frontend', name: 'routes-admin', namespace: 'default' }).then(
      response => {
        if (this.$valid(response)) {
          this.routesFile = response.data
        }
      }
    )
  }
}
</script>
<style>
</style>
