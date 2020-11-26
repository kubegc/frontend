<template>
    <routes-tree-view
     v-model="routesFile"
     v-if="routesFile"/>
</template>

<script>
import RoutesTreeView from '@/components/RoutesTreeView/index'
import { getResource } from '@/api/k8sResource'

export default {
  components: { RoutesTreeView },
  data() {
    return {
      routesFile: undefined
    }
  },
  created() {
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
  }

}
</script>
