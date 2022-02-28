<template>
  <div class="projects-runtime-container">
    <div class="guide-container">
      <step :activeStep="3">
      </step>
      <div class="current-step-container">
        <div class="title-container">
          <span class="first">第三步</span>
          <span class="second">配置完成结束</span>
        </div>
      </div>
    </div>
    <div class="imageMarket-app-container">
      <el-divider content-position="center">多云协作框架</el-divider>
      <div style="width:100%;float:left">
        <el-button type="text" style="display:inline-block;float:left;width:20%">构造多云协作框架API进度：</el-button>
        <el-progress style="display:inline-block;float:left;width:75%;margin:7px 0 0 30px;" :text-inside="true" :stroke-width="24" :percentage="percentage" status="success" />
      </div>
      <div style="width:100%;float:left;margin:20px 0 0 0;">
        <p style="font-size:16px;margin:0 0 0 10px;height: 10%;"><a style="color:black;font-size:18px;">步骤 1：</a>接收示例代码输入：</p>
        <json-editor
          style="width:100%"
          :value="jsonString"
          @input="jsonString = $event"
        />
      </div>
      <div style="width:100%;float:left;margin:20px 0 0 0;">
        <p style="float:left;font-size:16px;margin:0 0 0 10px;height:10%;width:100%;display:inline-block;"><a style="color:black;font-size:18px;" @click="drawLine()">步骤 2.1:提取关键云服务操作：</a><span id="analysisTitle" style="color:brown;font-size:18px;margin-left:20px">待分析</span></p>
        <p style="float:left;font-size:16px;margin:0 0 0 10px;height:10%;width:100%;display:inline-block;"><a style="color:black;font-size:18px;" @click="constructTree()">步骤 2.2:构造云服务树形调用链:</a><span id="analysisTree" style="color:brown;font-size:18px;margin-left:20px">待生成</span></p>
        <div id="myChart" style="width: 100%; height: 500px;float: left;" />
      </div>
      <div style="width:100%;float:left;margin:20px 0 0 0;">
        <p style="float:left;font-size:16px;margin:0 0 0 10px;height:10%;width:100%;display:inline-block;"><a style="color:black;font-size:18px;" @click="showTriple()">步骤 3:生成初始的、针对特定云服务代码片段的API调用接口(三元组)：</a></p>
        <div id="step3" :style="isShown">
          <el-button id="step31" style="display:block;margin:10px" type="primary">客户端及初始化参数</el-button>
          <el-button id="step32" style="display:block;margin:10px" type="success">一个新请求</el-button>
          <el-button id="step33" style="display:block;margin:10px" type="info">请求需要的参数</el-button>
        </div>
      </div>
    </div>
    <div class="controls__wrap">
      <div class="controls__right">
        <router-link :to="'/test/test2/test3'">
          <button type="primary"
                    size="small"
                    class="save-btn"
                    :disabled="loading"
                    plain>完成</button>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import step from './common/step.vue'

export default {
  components: {
    step
  }
}

</script>

<style lang="less">
.projects-runtime-container {
  position: relative;
  flex: 1;
  overflow: auto;
  background-color: #f5f7f7;

  .page-title-container {
    display: flex;
    padding: 0 20px;

    h1 {
      width: 100%;
      color: #4c4c4c;
      font-weight: 300;
      text-align: center;
    }
  }

  .guide-container {
    min-height: calc(~"100% - 70px");
    margin-top: 10px;

    .current-step-container {
      .title-container {
        margin-left: 20px;

        .first {
          display: inline-block;
          width: 110px;
          padding: 8px;
          color: #fff;
          font-weight: 300;
          font-size: 18px;
          text-align: center;
          background: #3289e4;
        }

        .second {
          color: #4c4c4c;
          font-size: 13px;
        }
      }

      .account-integrations {
        .el-alert--warning {
          .el-button--text {
            color: inherit;
          }
        }
      }

      .cf-block__list {
        -ms-flex: 1;
        flex: 1;
        margin-top: 15px;
        padding: 0 30px;
        overflow-y: auto;
        background-color: inherit;
        -webkit-box-flex: 1;

        .title {
          h4 {
            margin: 10px 0;
            color: #4c4c4c;
            font-weight: 400;
            text-decoration: underline;
          }

          a {
            color: inherit;
            text-decoration-color: inherit;
          }
        }

        .cf-block__item {
          min-height: 102px;

          .account-box-item {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 20px 30px;
            background-color: #fff;
            -webkit-box-shadow: 0 3px 2px 1px rgba(0, 0, 0, 0.05);
            box-shadow: 0 3px 2px 1px rgba(0, 0, 0, 0.05);
            filter: progid:dximagetransform.microsoft.dropshadow(OffX=0, OffY=3px, Color='#0D000000');
            -webkit-box-align: center;
            -ms-flex-align: center;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;

            .integration-card {
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              -webkit-box-align: center;
              -ms-flex-align: center;
              -webkit-box-pack: start;
              -ms-flex-pack: start;

              .integration-card__image {
                width: 64px;

                .el-button.is-circle {
                  padding: 6px;
                  border-radius: 50%;
                }
              }

              .cf-sub-title {
                color: #2f2f2f;
                font-weight: bold;
                font-size: 16px;
                text-align: left;
              }

              .integration-details {
                margin-bottom: 5px;
                color: #4c4c4c;
                font-size: 14px;
                line-height: 20px;

                .env-name {
                  display: inline-block;
                }

                .desc {
                  display: inline-block;
                  width: 250px;
                }
              }
            }

            .integration-card > * {
              -ms-flex: 0 0 auto;
              flex: 0 0 auto;
              -webkit-box-flex: 0;
            }
          }
        }
      }
    }
  }

  .alert {
    display: flex;
    padding: 0 25px;

    .el-alert {
      margin-bottom: 35px;

      .el-alert__title {
        font-size: 15px;
      }
    }
  }

  .controls__wrap {
    position: relative;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    margin: 0 15px;
    padding: 0 10px;
    background-color: #fff;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05);

    .controls__right {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      align-items: center;
      margin-right: 10px;
      -webkit-box-align: center;
      -ms-flex-align: center;

      .save-btn {
        margin-right: 15px;
        padding: 10px 17px;
        color: #fff;
        font-weight: bold;
        font-size: 13px;
        text-decoration: none;
        background-color: #1989fa;
        border: 1px solid #1989fa;
        cursor: pointer;
        transition: background-color 300ms, color 300ms, border 300ms;
      }

      .save-btn[disabled] {
        background-color: #9ac9f9;
        border: 1px solid #9ac9f9;
        cursor: not-allowed;
      }
    }
  }
}
</style>
