<template>
  <div>
    <top-bar/>
    <router-view/>
  </div>
</template>

<script>
import { TopBar } from './components'

export default {
  name: 'Base',
  components: {
    TopBar
  }
}
</script>
