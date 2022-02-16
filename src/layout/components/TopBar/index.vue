<template>
  <div class="topbar-container">
    <el-menu
      :default-active="activeMenu"
      mode="horizontal"
      background-color="#454545"
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
        style="border: none"
        @changeMenu="handleChange"
      />
      <div class="topbar-all">
        <el-popover
          placement="bottom"
          popper-class="help-droplist"
          trigger="click"
        >
          <ul class="dropdown-menu">
            <li>
              <span>示例</span>
            </li>
          </ul>
          <span
            slot="reference"
            class="help"
          >
            <i class="el-icon-question" />
            <span class="text">文档</span>
          </span>
        </el-popover>

        <div class="right-menu">
          <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
              <img :src="require('../../../assets/avatar.jpg')" class="user-avatar">
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
              <el-dropdown-item @click.native="logout">
                <span style="display:block;">登出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
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
      this.$store.commit('route/RESET_ROUTES')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleChange(menuIndex) {
      this.$store.commit('route/SET_CURRMENUPREFIX', this.top_menus[menuIndex].path)
      this.$store.commit('route/RESET_MENUROUTES', menuIndex)
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

  .topbar-all {
    /*position: center;*/
    /*display: -webkit-box;*/
    /*display: -ms-flexbox;*/
    /*display: flex;*/
    /*flex-grow: 0;*/
    /*flex-shrink: 0;*/
    /*align-items: center;*/
    /*justify-content: space-between;*/
    /*-webkit-box-align: center;*/
    /*-ms-flex-align: center;*/
    /*-webkit-box-pack: justify;*/
    /*-ms-flex-pack: justify;*/
    /*-webkit-box-flex: 0;*/
    /*-ms-flex-positive: 0;*/
    /*-ms-flex-negative: 0;*/

    * {
      max-height: 100%;
    }

    /*.icon {*/
    /*  color: #ff4949;*/
    /*  font-size: 20px;*/
    /*  cursor: pointer;*/

    /*  &:hover {*/
    /*    color: #1989fa;*/
    /*  }*/
    /*}*/

    .help {
      cursor:pointer;
      color: #f2f4f5;
      font-size: 15px;

      i {
        display: inline-block;
        margin-right: 5px;
        color: #ffffff;
        font-size: 20px;
        line-height: 60px;
      }

      &:hover {
        color: #1989fa;

        i {
          color: #1989fa;
        }
      }
    }

    .dropdown-menu {
      margin: 0 2px;
      padding: 8px 0;
      list-style: none;
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
  }
</style>
