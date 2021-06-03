<template>
  <iframe id="iframe" class="iframe" :src="sourceLink" />
</template>

<script>

export default {
  name: 'Dashboard',
  data() {
    return {
      sourceLink: ''
    }
  },
  created() {
    this.sourceLink = this.$route.meta.source
  }
}
</script>

<style lang="scss" scoped>
.iframe{
  width: 100%;
  height: 1000px;
  border: 0ch;
}
</style>
