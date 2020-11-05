<template>
  <div class="imageMarket-app-container">
    <el-divider content-position="left">全部</el-divider>
    <el-row
      v-for="(arrays, index) in cardsData"
      :key="index"
      :gutter="20"
      style="margin-bottom: 30px"
    >
      <a
        v-for="(item, idx) in arrays"
        :key="idx"
        @click="handleClick"
      >
        <el-col
          :span="6"
        >
          <el-tooltip placement="top">
            <div slot="content" style="width: 200px;">
              <p>{{ item.describe }}</p>
            </div>
            <el-card>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-image
                    style="border-radius: 2px;"
                    :src="require('../../assets/' + item.avatar)"
                    :fit="'fill'"
                  />
                </el-col>
                <el-col :span="16">
                  <div style="display: block;overflow: hidden;height: 90px">
                    <p style="margin: 0;"><strong>Tomcat</strong></p>
                    <p style="margin: 0;color: gray;overflow: hidden">
                      {{ item.describe }}
                    </p>
                  </div>
                </el-col>
              </el-row>
              <el-row style="margin-top: 20px">
                <el-col :span="12">
                  <span style="color: black">
                    {{ '开发者：' + item.developer }}
                  </span>
                </el-col>
                <el-col :span="12">
                  <span style="color: black">
                    {{ '最新版本:' + item.latestVersion }}
                  </span>
                </el-col>
              </el-row>
            </el-card>
          </el-tooltip>
        </el-col>
      </a>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cardsData: [
        [{
          title: 'tomcat',
          avatar: 'avatar.jpg',
          describe: 'Deploy a basic tomcat application server with sidecar as web archive container',
          latestVersion: '1.2.1',
          developer: 'lcz',
          url: ''
        },
          {
            title: 'tomcat',
            avatar: 'avatar.jpg',
            describe: 'Deploy a basic tomcat application server with sidecar as web archive container',
            latestVersion: '1.2.1',
            developer: 'lcz',
            url: ''
          },
          {
            title: 'tomcat',
            avatar: 'avatar.jpg',
            describe: 'Deploy a basic tomcat application server with sidecar as web archive container',
            latestVersion: '1.2.1',
            developer: 'lcz',
            url: ''
          },
          {
            title: 'tomcat',
            avatar: 'avatar.jpg',
            describe: 'Deploy a basic tomcat application server with sidecar as web archive container',
            latestVersion: '1.2.1',
            developer: 'lcz',
            url: ''
          }],
        [{
          title: 'tomcat',
          avatar: 'avatar.jpg',
          describe: 'Deploy a basic tomcat application server with sidecar as web archive container',
          latestVersion: '1.2.1',
          developer: 'lcz',
          url: ''
        }]
      ]
    }
  },
  methods: {
    handleClick() {
      this.$router.push({name: 'appDetail', params:{push: true}})
    }
  }
}
</script>

<style lang="scss" scoped>
.imageMarket-app-container {
  padding: 10px 20px;
  font-size: 14px;
  line-height: 1.67
}

.el-card {
  box-shadow: 0px 1px 2px -2px rgba(0, 0, 0, 0.16),
  0px 3px 6px 0px rgba(0, 0, 0, 0.12),
  0px 5px 12px 4px rgba(0, 0, 0, 0.09);

}

.el-card:hover {
  box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.08),
  0px 9px 28px 0px rgba(0, 0, 0, 0.05),
  0px 12px 48px 16px rgba(0, 0, 0, 0.03);
  transform: translateY(-5px);
  color: yellowgreen;
  //border-top: #409EFF 1px solid;
  border: #409EFF 1px solid;
}

</style>
