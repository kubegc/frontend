<template>
  <div class="projects-container">
    <subTopbar />
    <div class="account-integrations cf-block__list">
      <el-table :data="mapWorkflows"
                style="width: 100%;">
        <el-table-column label="工作流名称">
          <template >
            <span style="margin-left: 10px;">{{ 111 }}</span>
          </template>
        </el-table-column>
        <el-table-column width="400px"
                         label="环境信息">
        </el-table-column>
        <el-table-column width="400px"
                         label="包含步骤">
          <template slot-scope="scope">
                <span>
                  <span>
                    <el-tag size="small">构建部署</el-tag>
                    <span class="step-arrow"><i class="el-icon-right"></i></span>
                  </span>
                  <span>
                    <el-tag size="small">交付物部署</el-tag>
                    <span class="step-arrow"><i class="el-icon-right"></i></span>
                  </span>
                  <span>
                    <el-tag size="small">测试</el-tag>
                    <span class="step-arrow"><i class="el-icon-right"></i></span>
                  </span>
                  <el-tag size="small">分发</el-tag>
                </span>
          </template>
        </el-table-column>
        <el-table-column width="200px"
                         label="更新信息（时间/操作人）">
        </el-table-column>
        <el-table-column width="200px"
                         label="操作">
          <template slot-scope="scope">
            <el-button type="success"
                       size="mini"
                       round
                       @click="$router.push('/t/t1/t7')"
                       plain>点击运行</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table :data="mapWorkflows"
                style="width: 100%;">
        <el-table-column >
          <template >
            <span style="margin-left: 10px;">{{ 222 }}</span>
          </template>
        </el-table-column>
        <el-table-column width="400px">
        </el-table-column>
        <el-table-column width="400px">
          <template slot-scope="scope">
                <span>
                  <span>
                    <el-tag size="small">构建部署</el-tag>
                    <span class="step-arrow"><i class="el-icon-right"></i></span>
                  </span>
                  <span>
                    <el-tag size="small">交付物部署</el-tag>
                    <span class="step-arrow"><i class="el-icon-right"></i></span>
                  </span>
                  <span>
                    <el-tag size="small">测试</el-tag>
                    <span class="step-arrow"><i class="el-icon-right"></i></span>
                  </span>
                  <el-tag size="small">分发</el-tag>
                </span>
          </template>
        </el-table-column>
        <el-table-column width="200px">
        </el-table-column>
        <el-table-column width="200px">
          <template slot-scope="scope">
            <el-button type="success"
                       size="mini"
                       round
                       @click="$router.push('/t/t1/t7')"
                       plain>点击运行</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
<!--    <router-view @injectComp="injectComp" ></router-view>-->
  </div>
</template>
<script>
import subTopbar from '../home/subTopbar'
export default {
  data () {
    return {
      mapWorkflows: [{

      }],
    }
  },
  components: {
    subTopbar
  },
  computed: {
    // projectName () {
    //   return this.$route.params.project_name
    // }
  },
  methods: {
    // injectComp (comp) {
    //   this.comp = comp
    // }
  }
}
</script>

<style lang="less" scoped>

.projects-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(~'100% - 40px');
  background-color: #f6f6f6;
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
  margin-top: 30px;
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


</style>
