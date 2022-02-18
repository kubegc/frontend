<template>
  <div class="projects-info-container">
    <transition name="el-fade-in-linear">
      <div class="page-title-container">
        <h1>恭喜您成功创建新的项目</h1>
      </div>
    </transition>

    <div class="guide-container">
      <step :activeStep="0">
      </step>
      <div class="current-step-container">
        <div class="title-container">
          <span class="first">第一步</span>
          <span class="second">多云API信息导入</span>
        </div>
        <div class="account-integrations cf-block__list">
          <div class="cf-block__item">
            <div class="account-box-item">
              <div class="account-box-item__info integration-card">
                <div class="integration-card__image">
                  <el-button type="success"
                             icon="el-icon-check"
                             circle></el-button>
                </div>
                <div class="integration-card__info">
                  <div class="integration-name cf-sub-title">2 套测试环境</div>
                  <div class="integration-details">dev, qa
                  </div>
                </div>
              </div>
              <div class="account-box-item__controls">

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="controls__wrap">
      <div class="controls__right">
        <button type="primary"
                class="save-btn"
                plain>下一步</button>
        <button type="primary"
                class="save-btn"
                @click="jumpOnboarding">
          <i v-if="jumpLoading"
             class="el-icon-loading"></i>
          <span>跳过向导</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showGuideText: true,
      jumpLoading: false
    }
  },
  computed: {
  },
  created() {

  }
}

</script >

<style >
.projects-info-container {
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

  .controls__wrap {
    position: relative;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    display: -webkit-box;
    display: -ms-flexbox;
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

      .save-btn,
      .next-btn {
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

      .save-btn[disabled],
      .next-btn[disabled] {
        background-color: #9ac9f9;
        border: 1px solid #9ac9f9;
        cursor: not-allowed;
      }
    }
  }
}
</style>
