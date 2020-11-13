<template>
  <div>
    <el-collapse>
    <displayItem
      v-for="speedup in speedups"
      :speedup="speedup"
      :index= "speedup.index"
    />
    </el-collapse>
  </div>

</template>
<script>
import displayItem from '@/views/operation/displayItem'

import { listResources } from "@/api/k8sResource";
export default {
  components: {
    displayItem
  },
  data() {
    return {
      'speedups': []
    }
  },
  created() {
    listResources({ token: 'default', kind: 'Operation' }).then(response => {
      let operationList = response.data.items
      for (var i = 0; i < operationList.length; i++) {
        this.speedups.push({
          index: i + 1,
          metadata: operationList[i].metadata,
          data: operationList[i].spec
        })
      }
    })
    console.log(this.speedups)
  }
}

</script>
<style>

</style>
