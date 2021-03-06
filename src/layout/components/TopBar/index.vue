<template>
  <div class="topbar-container">
    <el-menu
      :default-active="activeMenu"
      mode="horizontal"
      background-color="#24292e"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      style="border: none"
    >
      <top-bar-menu-item
        v-for="menu in top_menus"
        :key="menu.path"
        :icon="menu.icon"
        :title="menu.title"
        :menu-index="menu.key"
        :k="menu.path"
        @changeMenu="handleChange"
        style="border: none"
      />

      <div class="right-menu">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <img :src="require('../../../assets/avatar.jpg')" class="user-avatar"/>
            <i class="el-icon-caret-bottom"/>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item @click.native="logout">
              <span style="display:block;">登出</span>
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
    ...mapGetters(['top_menus', 'currentMenuPrefix']),
    activeMenu() {
      const matched = this.$route.matched[0].path
      if (this.$route.params.push) {
        const menuIndex = this.top_menus.filter(item => item.path === matched)[0].key
        this.handleChange(menuIndex)
      }
      return matched
    }
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
  z-index: 1999;
  box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.08),
  0px 9px 28px 0px rgba(0, 0, 0, 0.05),
  0px 12px 48px 16px rgba(0, 0, 0, 0.03);
}

//.el-menu-item {
//  left: $sideBarWidth;
//}

.right-menu {
  float: right;
  height: 100%;

  &:focus {
    outline: none;
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
