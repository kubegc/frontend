<template>
  <section class="pipeline-help">
    <p class="service-aside-help__welcome-message">
      欢迎使用帮助指南。可参考以下步骤配置服务
    </p>
    <h3 class="service-aside-help__step-header">
    </h3>
    <ul class="service-aside-help__step-list">
      <li class="service-aside-help__step-list-item">
        <div class="service-aside-help__step-list-item-counter">
          1
        </div>
        <p class="service-aside-help__step-list-item-text">
          新建服务，支持三种方式：手工输入/从代码库同步/使用模板新建
        </p>
      </li>
      <li class="service-aside-help__step-list-item">
        <div class="service-aside-help__step-list-item-counter">
          2
        </div>
        <p class="service-aside-help__step-list-item-text">
          添加和修改 YAML 中的变量，在运行环境中会被作为环境变量使用
        <ul>
          <li>容器(服务组件)的镜像版本：通过配置构建步骤，实现版本升级（代码构建->构建镜像->镜像部署）
          </li>
          <li>系统内置变量：可以直接在服务模板配置中引用</li>
          <li>自定义变量：在运行环境中会被作为环境变量使用</li>
        </ul>
        </p>
      </li>
      <li class="service-aside-help__step-list-item">
        <div class="service-aside-help__step-list-item-counter">
          3
        </div>
        <p class="service-aside-help__step-list-item-text">
          添加多个服务，更新环境，将服务加入环境
        </p>
      </li>
    </ul>
    <h3 class="service-aside-help__step-header">
      文档指南
    </h3>
    <ul class="service-aside-help__step-list">
      <el-row :gutter="20">
        <el-col :span="8">
          <li class="service-aside-help__step-list-item">
            <a target="_blank"
               class="service-aside-help__step-list-item-link">
              <i class="icon el-icon-link"></i>
              <span class="service-aside-help__step-list-item-link-text">
                无状态服务</span>
            </a>
          </li>
        </el-col>
        <el-col :span="8">
          <li class="service-aside-help__step-list-item">
            <a target="_blank"
               class="service-aside-help__step-list-item-link">
              <i class="icon el-icon-link"></i>
              <span class="service-aside-help__step-list-item-link-text">有状态服务 </span>
            </a>
          </li>
        </el-col>

      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <li class="service-aside-help__step-list-item">
            <a target="_blank"
               class="service-aside-help__step-list-item-link">
              <i class="icon el-icon-link"></i>
              <span class="service-aside-help__step-list-item-link-text">新增构建步骤</span>
            </a>
          </li>
        </el-col>
      </el-row>
    </ul>
  </section>
</template>
<script>
</script>
<style lang="less" scoped>
  .pipeline-help {
    p {
      margin: 0 0 10px;
    }

    .service-aside-help__welcome-message {
      width: 100%;
      margin: 0;
      margin-bottom: 10px;
      color: #2f2f2f;
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
    }

    .service-aside-help__step-header {
      width: 100%;
      margin: 0;
      margin: 10px 0;
      color: #000;
      font-weight: bold;
      font-size: 14px;
      text-transform: uppercase;
    }

    .service-aside-help__step-list {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      align-items: unset;
      justify-content: flex-start;
      width: 100%;
      margin: 10px 0;
      padding: 0;
      list-style: none;

      .service-aside-help__step-header {
        width: 100%;
        margin: 0;
        margin: 10px 0;
        color: #000;
        font-weight: bold;
        font-size: 12px;
        text-transform: uppercase;
      }

      .service-aside-help__step-list-item {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        margin-bottom: 8px;
        -webkit-box-align: start;
        -ms-flex-align: start;
        -webkit-box-pack: start;
        -ms-flex-pack: start;

        ul {
          padding-left: 16px;

          span {
            display: inline-block;
            padding-left: 5px;
            color: #606266;
            font-size: 12px;
          }
        }

        ul > li {
          color: #606266;
          list-style: disc;
        }

        .service-aside-help__step-list-item-counter {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          margin-right: 13px;
          color: #fff;
          font-weight: 400;
          font-size: 13px;
          background-color: #0066ff;
          border-radius: 50%;
        }

        .service-aside-help__step-list-item-text {
          -ms-flex: 1;
          flex: 1;
          margin: 0;
          color: #000;
          font-size: 13px;
          line-height: 24px;
          -webkit-box-flex: 1;
        }

        .service-aside-help__step-list-item-link,
        .service-aside-help__step-list-item-link:hover,
        .service-aside-help__step-list-item-link:focus,
        .service-aside-help__step-list-item-link:active {
          color: #518ff6;
          text-decoration: none;

          .icon {
            margin-right: 5px;
          }

          .service-aside-help__step-list-item-link-text {
            font-size: 12px;
          }
        }
      }
    }
  }

</style>
