<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.navbar {
  height: 55px;
  position: sticky;
  top: 60px;
  background: #fff;
  //box-shadow: 0 1px 4px rgba(0,21,41,.08);
  box-shadow:
              0px 1px 2px -2px rgba(0, 0, 0, 0.16),
              0px 3px 6px 0px rgba(0, 0, 0, 0.12),
              0px 5px 12px 4px rgba(0, 0, 0, 0.09);
  z-index: 2000;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }
}
</style>
