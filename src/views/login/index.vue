<!-- Copyright (2021, ) Institute of Software, Chinese Academy of Sciences -->
<template>
  <div class="login-container">
    <div class="index-bg1"></div>
    <div class="index-gy1" style="width: 80%"> {{ projectTitle }}
    <!-- <el-select
       class=""
       v-model="projectTitle"
       style="width: 100%; font-size: 64pt"
     >
       <el-option
         v-for="item in allProjectTitles"
         :key="item.label"
         :label="item.label"
         :value="item.value"
         style="color: black"
       />
     </el-select> -->
    </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container" style="font-size: 2em; color: cornflowerblue" align="center">
        用户登录
      </div>
      <br/>
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
      <br/>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
      >
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { doCheck } from '@/api/common'
import { getResource } from '@/api/kubernetes'

export default {
  name: 'Login',

  data() {
    const validateUsername = (rule, value, callback) => {
      if (!doCheck(this.usernameRegExp, value)) {
        callback(new Error(this.usernameRegExpDesc))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!doCheck(this.passwordRegExp, value)) {
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
      allProjectTitles: [],
      projectTitle: '',
      projectId: '',
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
      name: 'frontend-project'
    }).then((response) => {
      this.allProjectTitles = response.data.spec.data
      this.projectTitle = response.data.spec.data[0].label
      this.projectId = response.data.spec.data[0].value
    })

    getResource({
      token: 'default',
      kind: 'Frontend',
      namespace: 'default',
      name: 'username'
    }).then((response) => {
      this.usernameRegExp = response.data.spec.value
      this.usernameRegExpDesc = response.data.spec.desc
    })

    getResource({
      token: 'default',
      kind: 'Frontend',
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
            .dispatch('user/login', { userInfo: this.loginForm, projectId: this.projectId })
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
$light_gray: #283443;
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
    border-radius: 20px;
    color: #454545;
    background-color: aliceblue;
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
  background: url(../../assets/login.jpg) no-repeat center;
  overflow: hidden;
  .login-form {
    position: absolute;
    float: right;
    right: 150px;
    top: 50%;
    left: 55%;
    margin-top: -175px;
    margin-left: 250px;
    width: 400px;
    min-height: 300px;
    max-width: 100%;
    padding: 40px 20px 10px;
    border-radius: 8px;
    box-sizing: border-box;
    background-color: #fff;
  }

  .svg-container {
    padding: 6px 10px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 20px;
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

  .index-bg1{
    background: #347ebc;
    width: 100%;
    height: 237px;
    opacity: .6;
    position: absolute;
    top: calc(50vh - 118.5px);
  }

  .index-gy1{
    width: 1000px;
    height: 237px;
    color: #fff;
    font-size: 60px;
    position: absolute;
    padding-top: 80px;
    left: 10%;
    top: 0;
    bottom: 0;
    margin: auto;
  }
}
</style>
