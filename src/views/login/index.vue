<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <el-select
          v-model="chosenTitle"
          style="width: 112%; margin-bottom: 20px"
        >
          <el-option
            v-for="item in projectTitles"
            :key="item.label"
            :label="item.label"
            :value="item.value"
            style="color: black"
          />
        </el-select>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密  码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
      >
        登录
      </el-button>
    </el-form>

    <div>
      <el-button id="usernameRegExp" type="text" hidden="true" />
      <el-button id="usernameRegExpDesc" type="text" hidden="true" />
      <el-button id="passwordRegExp" type="text" hidden="true" />
      <el-button id="passwordRegExpDesc" type="text" hidden="true" />
    </div>
  </div>
</template>

<script>
import { check } from '@/utils/validate'
import { getResource } from '@/api/kubernetes'

export default {
  name: 'Login',

  data() {
    const validateUsername = (rule, value, callback) => {
      if (!check(this.usernameRegExp, value)) {
        callback(new Error(this.usernameRegExpDesc))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!check(this.passwordRegExp, value)) {
        callback(new Error(this.passwordRegExpDesc))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      projectTitles: [],
      chosenTitle: '',
      usernameRegExp: '',
      usernameRegExpDesc: '',
      passwordRegExp: '',
      passwordRegExpDesc: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },

  created() {
    getResource({
      token: 'default',
      kind: 'Frontend',
      namespace: 'default',
      name: 'title-project'
    }).then((response) => {
      this.projectTitles = response.data.spec.data
      this.chosenTitle = response.data.spec.data[0].label
    })

    getResource({
      token: 'default',
      kind: 'RegExp',
      namespace: 'default',
      name: 'username'
    }).then((response) => {
      this.usernameRegExp = response.data.spec.value
      this.usernameRegExpDesc = response.data.spec.desc
    })

    getResource({
      token: 'default',
      kind: 'RegExp',
      namespace: 'default',
      name: 'password'
    }).then((response) => {
      this.passwordRegExp = response.data.spec.value
      this.passwordRegExpDesc = response.data.spec.desc
    })
  },

  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    font-size: 15px;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.05);
    //background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    color: #454545;
    background-color: #304156;
    box-shadow: 0px 1px 2px -2px rgba(0, 0, 0, 0.16),
      0px 3px 6px 0px rgba(0, 0, 0, 0.12), 0px 5px 12px 4px rgba(0, 0, 0, 0.09);
  }
  .el-button {
    box-shadow: 0px 1px 2px -2px rgba(0, 0, 0, 0.16),
      0px 3px 6px 0px rgba(0, 0, 0, 0.12), 0px 5px 12px 4px rgba(0, 0, 0, 0.09);
  }
}
</style>

<style lang="scss" scoped>
$bg: #24292e;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  //background: url(../../assets/login.jpg) no-repeat center;
  background: $bg;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
