<template>
  <div class="dashboard-container">
    <vue-pipeline ref="pipeline" :data="data"  @select="handleSelect" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getGrafanaLink } from '@/utils/getResource'
import VuePipeline from 'vue-pipeline'

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
      

    }
  },
  mounted() { 
      let data = [
  {
    name: "Start",
    hint: "1m23s",
    status: "start",
    next: [{ index: 1, weight: 2 }]
  },
  {
    name: "Ammouncement Import",
    hint: "1m23s",
    status: "success",
    next: [
      { index: 2, weight: 0 },
      { index: 4, weight: 2 }
    ]
  },
  {
    name: "Employee ID to Onboarding",
    hint: "2m23s",
    status: "failure",
    next: [{ index: 3, weight: 0 }]
  },
  {
    name: "Personal Basic Info",
    hint: "2m23s",
    status: "paused",
    next: [{ index: 4, weight: 0 }]
  },
  { name: "End ", hint: "2m23s", status: "end", next: [] }
];
     
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

</style>
