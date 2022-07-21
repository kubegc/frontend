<template>
  <div class="subtopbar-container">
    <div class="nav-container">
      <div class="nav-content">
        <ul class="nav-item-list">
          <router-link
            v-hasPermi="{projectName: projectName, action: 'get_workflow'}"
            active-class="active"
            :to="`/t/t1/t6`"
          >
            <li class="nav-item">
              <i class="icon iconfont el-icon-s-unfold"></i>
              <span class="name">工作流</span>
            </li>
          </router-link>
          <router-link
            v-hasPermi="{projectName: projectName, action: 'get_environment'}"
            active-class="active"
            :to="`/v1/projects/detail`"
          >
            <li class="nav-item">
              <i class="icon iconfont el-icon-orange"></i>
              <span class="name">环境</span>
            </li>
          </router-link>

          <router-link
            v-hasPermi="{projectName: projectName, action: 'get_service'}"
            active-class="active"
            :to="`/t/t1/t4`"
          >
            <li class="nav-item">
              <i class="icon iconfont el-icon-box"></i>
              <span class="name">服务</span>
            </li>
          </router-link>
          <router-link
            v-hasPermi="{projectName: projectName, action: 'get_build'}"
            active-class="active"
            :to="`/v1/projects/detail/builds`"
          >
            <li class="nav-item">
              <i class="icon iconfont el-icon-edit-outline"></i>
              <span class="name">构建</span>
            </li>
          </router-link>
          <router-link
            v-hasPermi="{projectName: projectName, action: 'get_test'}"
            active-class="active"
            :to="`/v1/projects/detail/test`"
          >
            <li class="nav-item">
              <i class="icon iconfont el-icon-s-platform"></i>
              <span class="name">测试</span>
            </li>
          </router-link>
          <router-link active-class="active" :to="`/v1/projects/detail/scanner`">
            <li class="nav-item">
              <i class="icon iconfont el-icon-files"></i>
              <span class="name">代码扫描</span>
            </li>
          </router-link>
          <router-link
            v-if="deployType === 'helm' ||deployType === 'k8s' "
            v-hasPermi="{projectName: projectName, action: 'get_delivery'}"
            active-class="active"
            :to="`/v1/projects/detail/version`"
          >
            <li class="nav-item">
              <i class="icon iconfont iconvery-versionmana"></i>
              <span class="name">版本管理</span>
            </li>
          </router-link>
        </ul>
      </div>
    </div>
    <div class="operation">
      <template v-if="$route.path === `/v1/projects/detail/${projectName}/pipelines`">
        <el-button v-hasPermi="{projectName: projectName, action: 'create_workflow'}"  @click="bindComp(comp,'workflow')" icon="el-icon-plus" plain>新建工作流</el-button>
      </template>
      <template v-if="$route.path === `/v1/projects/detail/${projectName}/envs/detail`">
        <el-button
          v-hasPermi="{projectName: projectName, action: 'create_environment'}"
          @click="bindComp(comp,'env')"
          icon="el-icon-plus"
          plain
        >创建环境</el-button>
      </template>
      <template v-if="$route.path === `/v1/projects/detail/${projectName}/builds`">
        <el-button v-hasPermi="{projectName: projectName, action: 'create_build'}" @click="bindComp(comp,'build')" icon="el-icon-plus" plain>新建构建</el-button>
      </template>
      <template v-if="$route.path === `/v1/projects/detail/${projectName}/test`">
        <el-button
          v-hasPermi="{projectName: projectName, action: 'create_test'}"
          @click="bindComp(comp,'test')"
          icon="el-icon-plus"
          plain
        >新建测试</el-button>
      </template>
      <template v-if="$route.path === `/v1/projects/detail/${projectName}/scanner`">
        <el-button
          @click="bindComp(comp,'scanner')"
          icon="el-icon-plus"
          plain
        >新建代码扫描</el-button>
      </template>
      <template v-if="$route.path === `/v1/projects/detail/${projectName}/version` && deployType === 'helm'">
        <el-button
          v-hasPermi="{projectName: projectName, action: 'create_delivery'}"
          @click="bindComp(comp,'version')"
          icon="el-icon-plus"
          plain
        >创建版本</el-button>
      </template>
      <template>
        <el-dropdown
          v-if="comp && comp.isProjectAdmin && $route.path === `/v1/projects/detail/${projectName}/detail`"
          placement="bottom"
          trigger="click"
        >
          <button type="button" class="display-btn el-button">
            <i class="iconfont iconvery-options el-icon--left"></i>
            &nbsp;&nbsp;配置&nbsp;&nbsp;
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </button>
          <el-dropdown-menu slot="dropdown" class="project-config">
            <el-dropdown-item icon="el-icon-edit-outline" @click.native="$router.push(`/v1/projects/edit/${projectName}`)">修改</el-dropdown-item>
            <el-dropdown-item icon="el-icon-lock" @click.native="$router.push(`/v1/projects/detail/${projectName}/rbac`)">权限</el-dropdown-item>
            <el-dropdown-item
              v-if="deployType === 'k8s' || deployType === 'helm'"
              icon="item-icon iconfont iconvery-collaboratiom"
              @click.native="$router.push(`/v1/projects/detail/${projectName}/policy`)"
            >协作模式</el-dropdown-item>
            <el-dropdown-item icon="el-icon-delete" @click.native="comp.deleteProject">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  props: {
    projectName: {
      type: String,
      required: true
    },
    comp: {
      // required: false
    }
  },
  computed: {
    // deployType () {
    //   const project = this.$store.getters.projectList.find(
    //     project => project.name === this.projectName
    //   )
    //   return project ? project.deployType : ''
    // }
  },
  methods: {
    bindComp (comp, type) {
      if (type === 'workflow') {
        comp.createWorkflow()
      } else if (type === 'env') {
        this.$router.push(`/v1/projects/detail/${this.projectName}/envs/create`)
      } else if (type === 'build') {
        this.$router.push(
          `/v1/projects/detail/${this.projectName}/builds/create`
        )
      } else if (type === 'test') {
        this.$router.push(
          `/v1/projects/detail/${this.projectName}/test/add/function`
        )
      } else if (type === 'scanner') {
        this.$router.push(
          `/v1/projects/detail/${this.projectName}/scanner/create`
        )
      } else if (type === 'version') {
        this.$router.push(
          `/v1/projects/detail/${this.projectName}/version/create`
        )
      }
    }
  }
}
</script>
<style lang="less">
.subtopbar-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding-left: 26px;
  background-color: #fff;
  box-shadow:
    0px 1px 2px -2px rgba(0, 0, 0, 0.16),
    0px 3px 6px 0px rgba(0, 0, 0, 0.12),
    0px 5px 12px 4px rgba(0, 0, 0, 0.09);

  .nav-container {
    .nav-content {
      .nav-item-list {
        display: flex;

        .nav-item {
          display: inline-flex;
          height: 42px;
          padding: 9px 12px;
          color: #000;
          font-weight: 300;
          font-size: 16px;
          line-height: 22px;
          cursor: pointer;

          .icon {
            margin-right: 18px;
            color: #d2d2d2;
            font-size: 22px;
          }
        }

        a {
          margin-right: 16px;

          &.active {
            box-shadow: inset 0 -2px 0 #0066ff;

            .icon {
              color: #0066ff;
            }
          }
        }
      }
    }
  }

  .operation {
    display: flex;
    margin-right: 80px;

    .el-button {
      padding: 10px 15px;
      color: #0066ff;
      font-weight: 400;
      border: 1px solid #0066ff;
      border-radius: 4px;
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.05);
    }

    .display-btn {
      padding: 10px 15px;
      color: #0066ff;
      font-weight: 400;
      font-size: 14px;
      background-color: #fff;
      border: 1px solid #0066ff;
      border-radius: 4px;
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.05);
      cursor: pointer;
    }
  }
}

.el-dropdown-menu.el-popper.project-config {
  margin-top: 2px;

  .el-dropdown-menu__item {
    width: 80px;
    margin: 0 10px;
    padding: 0 10px;
    font-weight: 300;
    border-radius: 6px;

    .item-icon {
      font-size: 14px;
    }
  }

  .popper__arrow {
    display: none;
  }
}
</style>
