<template>
  <div class="dashboard-container">
    <iframe id="iframe" class="iframe" :src="sourceLink" />
  </div>
</template>

<script>

import { getSourceLink } from '@/utils/getResource'

export default {
  name: 'Dashboard',
  data() {
    return {
      sourceLink: ''

    }
  },
  created() {
    if (this.$route.meta.source.length > 4 && this.$route.meta.source.substring(0, 4) === 'http') {
      this.sourceLink = this.$route.meta.source
    } else {
      this.sourceLink = getSourceLink(this.$route.meta.source)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.iframe{
  width: 100%;
  height: 1000px;
  border: 0ch;
}
</style>
