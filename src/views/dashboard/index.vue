<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div>
    <div class="dashboard-text">roles: <span v-for="r in role" :key="r">{{ r }}</span></div> -->
    <iframe class="iframe" id="iframe" :src="grafanaLink"></iframe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getGrafanaLink } from '@/utils/getResource'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'role'
    ])
  },
  data() {
    return {
      grafanaLink: ''

    }
  },
  mounted() { 
      this.grafanaLink = getGrafanaLink() 
  },
  methods: {
    
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
