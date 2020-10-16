<template>
  <div class="topbar-container">
    <el-menu
      :default-active="'0'"
      mode="horizontal"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <top-bar-menu-item
        v-for="menu in top_menus"
        :key="menu.key"
        :icon="menu.icon"
        :title="menu.title"
        :menu-index="menu.key"
        @changeMenu="handleChange"/>
      <div class="right-menu">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"/>
            <i class="el-icon-caret-bottom"/>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>
                Home
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;">Log Out</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TopBarMenuItem from '@/layout/components/TopBarMenuItem/index'

export default {
  components: {
    TopBarMenuItem
  },
  data() {
    return {
      menus: []
    }
  },
  computed: {
    ...mapGetters(['avatar', 'top_menus'])
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$store.commit('permission/RESET_ROUTES')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleChange(menuIndex) {
      this.$store.commit('permission/SET_CURRMENUPREFIX', this.top_menus[menuIndex].path)
      this.$store.commit('permission/RESET_MENUROUTES', menuIndex)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.topbar-container {
  position: sticky;
  top: 0;
  z-index: 1001;
}

//.el-menu-item {
//  left: $sideBarWidth;
//}

.right-menu {
  float: right;
  height: 100%;
  line-height: 50px;

  &:focus {
    outline: none;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background .3s;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }
  }

  .avatar-container {
    margin-right: 30px;
    bottom: -5px;

    .avatar-wrapper {
      margin-top: 5px;
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>
