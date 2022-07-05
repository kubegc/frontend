<template>
  <div class="projects-container">
    <subTopbar/>
<!--    <router-view @injectComp="injectComp" ></router-view>-->
  </div>
</template>
<script>
import subTopbar from '../home/subTopbar'
export default {
  data () {
    return {
    }
  },
  components: {
    subTopbar
  },
  computed: {
    // projectName () {
    //   return this.$route.params.project_name
    // }
  },
  methods: {
    // injectComp (comp) {
    //   this.comp = comp
    // }
  }
}
</script>

<style lang="less" scoped>

.projects-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(~'100% - 40px');
  background-color: #f6f6f6;
}
</style>
