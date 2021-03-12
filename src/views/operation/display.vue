<template>
  <div>
    <displayItem
      v-for="speedup in speedups"
      :speedup="speedup"
      :index="speedup.index"
    />
  </div>
</template>
<script>
import displayItem from '@/views/operation/displayItem'

import { listResources } from '@/api/kubernetes'
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
    listResources({ token: 'default', kind: 'Operation', limit: 100 }).then(response => {
      const operationList = response.data.items
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

