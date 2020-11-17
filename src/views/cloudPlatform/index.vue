<template>
  <div class="app-container">
    <div class="base-button-container">
      <el-button
        icon="el-icon-plus"
        type="primary"
        class="filter-item"
        circle
        @click.native="createJson"
      />
    </div>

    <el-dialog
      :visible.sync="createDialogVisible"
      :title="this.createResource"
      @dragDialog="handleDrag"
    >
      <div class="card-editor-container">
        <json-editor
          ref="jsonEditor"
          v-model="createTemplate"
        />
        <div style="width: 100%; height: 50px">
          <el-button
            type="primary"
            style="
              float: right;
              margin-top: 20px;
              height: 40px;
              display: inline;
            "
            @click.native="create"
            >确认
          </el-button>
          <!-- <el-button type="primary" style="float:right;margin-top:20px;height:40px;display:inline;margin-right:0px;" >取消</el-button> -->
        </div>
      </div>
    </el-dialog>

    <div v-if="this.current == 'instance'" style="height: 800px">
      <el-card class="box-card" style="height: 400px">
        <div style="margin-bottom: 7px">
          <strong>
            <p style="font-size: 18px">{{ account.name }}</p>
          </strong>
        </div>
        <img
          style="display: inline-block; vertical-align: middle; width: 28px"
          :src="require('@/assets/images/' + account.logo)"
          alt
        />
        <span style="vertical-align: middle">
          <p style="display: inline; font-size: 16px">{{ account.kindDes }}</p>
        </span>
      </el-card>
    </div>
    <div
      style="text-align: center; margin-top: 30px"
      v-if="cloudConfig.length == 0"
    >
      暂无数据
    </div>
    <div>
      <el-row :gutter="20" style="margin-top: 10px">
        <el-col
          :span="6"
          v-for="(item, index) in cloudConfig"
          :key="item.name"
          style="margin-bottom: 30px"
        >
          <el-card class="box-card" :style="height">
            <div v-if="current == 'account'" slot="header" class="clearfix">
              <img
                style="
                  display: inline-block;
                  vertical-align: middle;
                  width: 13%;
                "
                :src="require('@/assets/images/' + item.logo)"
                alt
              />
              <span style="vertical-align: middle">
                <p style="font-size: 16px; display: inline; padding: 5px 0">
                  <strong>{{ item.kindDes }}</strong>
                </p>
              </span>
            </div>
            <div v-if="current == 'instance'" slot="header" class="clearfix">
              <img
                style="
                  display: inline-block;
                  vertical-align: middle;
                  width: 13%;
                "
                :src="require('@/assets/images/' + item.logo)"
                alt
              />
              <span style="vertical-align: middle">
                <p style="font-size: 16px; display: inline; padding: 5px 0">
                  <strong>{{ account.kind }}</strong>
                </p>
              </span>
            </div>
            <p style="font-size: 14px">{{ item.name }}</p>
            <el-button type="primary" style="float: right; margin: 15px">
              <router-link
                :to="{
                  path: item.router,
                  query: {
                    current: current,
                    account: cloudConfig[index],
                    name: cloudConfig[index].name,
                  },
                }"
                tag="a"
                class="link"
                >{{ item.button }}</router-link
              >
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  createResource,
  listResources,
  updateResource,
  getResource
} from "@/api/k8sResource";
import JsonEditor from '@/components/JsonEditor'

export default {
  name: "Template",
  components: {
    JsonEditor,
  },
  data() {
    return {
      dialogTableVisible: false,
      value: [],
      json: {},
      cloud_kind: "aliyunvm",
      catalog_kind: "catalog",
      frontend_kind: "Frontend",
      height: "height: 190px",
      title: "",
      styleConfig: "",
      namespace: "default",
      account: {},
      current: "account",
      form_kind: "form",
      namespace: "default",
      cloud: {},
      template_kind: "template",
      cloudController_kind: "CloudController",
      cloudConfig: [],
      createDialogVisible: false,
      createResource: '创建对象',
      createTemplate: {}
    };
  },

  mounted() {},
  created() {
    if (this.$route.query.account) {
      this.account = this.$route.query.account;
      this.styleConfig = {
        AliyunVM: {
          logo: "aliyun.jpg",
          kindDes: "Alibaba Cloud",
          name: "Upsilon",
          button: "详情",
          router: "/resourceInfo/monitor",
          kind: "AliyunVM",
        },
        TencentVM: {
          logo: "tencent.jpg",
          kindDes: "Tencent Cloud",
          name: "Omicron",
          button: "详情",
          router: "/resourceInfo/monitor",
          kind: "TencentVM",
        },
        AmazonVM: {
          logo: "amazon.jpg",
          kindDes: "Amazon Web Services",
          name: "Upsilon",
          button: "详情",
          router: "/resourceInfo/monitor",
          kind: "AmazonVM",
        },
        BaiduVM: {
          logo: "baidu.png",
          kindDes: "Baidu Cloud",
          name: "Omicron",
          button: "详情",
          router: "/resourceInfo/monitor",
          kind: "BaiduVM",
        },
        JDCloudVM: {
          logo: "jd.png",
          kindDes: "JD Cloud",
          name: "Omicron",
          button: "详情",
          router: "/resourceInfo/monitor",
          kind: "JDCloudVM",
        },
      };
    } else {
      this.styleConfig = {
        AliyunVM: {
          logo: "aliyun.jpg",
          kindDes: "Alibaba Cloud",
          name: "Upsilon",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "AliyunVM",
        },
        TencentVM: {
          logo: "tencent.jpg",
          kindDes: "Tencent Cloud",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "TencentVM",
        },
        AmazonVM: {
          logo: "amazon.jpg",
          kindDes: "Amazon Web Services",
          name: "Upsilon",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "AmazonVM",
        },
        BaiduVM: {
          logo: "baidu.png",
          kindDes: "Baidu Cloud",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "BaiduVM",
        },
        JDCloudVM: {
          logo: "jd.png",
          kindDes: "JD Cloud",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "JDCloudVM",
        },
        AzureVM: {
          logo: "azure.png",
          kindDes: "Azure Cloud",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "AzureVM",
        },
        CloudStack: {
          logo: "cloudstack.png",
          kindDes: "CloudStack",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "CloudStack",
        },
        GoogleVM: {
          logo: "google.jpg",
          kindDes: "Google Cloud",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "GoogleVM",
        },
        OpenStack: {
          logo: "openstack.png",
          kindDes: "OpenStack",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "OpenStack",
        },
        Cloudscale: {
          logo: "cloudscale.png",
          kindDes: "Cloudscale",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "Cloudscale",
        },
        GridScale: {
          logo: "gridscale.png",
          kindDes: "GridScale",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "GridScale",
        },
        DigitalOcean: {
          logo: "digitalocean.png",
          kindDes: "DigitalOcean",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "DigitalOcean",
        },
        Gandi: {
          logo: "gandi.png",
          kindDes: "Gandi",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "Gandi",
        },
        Libvirt: {
          logo: "libvirt.png",
          kindDes: "Libvirt",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "Libvirt",
        },
        vCloud: {
          logo: "vcloud.png",
          kindDes: "vCloud",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "vCloud",
        },
      };
      listResources({
        kind: this.cloudController_kind,
        limit: 15,
        namespace: this.namespace,
      }).then((response) => {
        if (this.validateRes(response) == 1) {
          var itemtemp = response.data.items;
          for (let i = 0; i < itemtemp.length; i++) {
            var singleCloud = {};
            console.log(itemtemp[i]);
            singleCloud.logo = this.styleConfig[
              itemtemp[i].spec.data.kind
            ].logo;
            singleCloud.router = this.styleConfig[
              itemtemp[i].spec.data.kind
            ].router;
            singleCloud.kindDes = this.styleConfig[
              itemtemp[i].spec.data.kind
            ].kindDes;
            singleCloud.button = this.styleConfig[
              itemtemp[i].spec.data.kind
            ].button;
            singleCloud.kind = this.styleConfig[
              itemtemp[i].spec.data.kind
            ].kind;
            singleCloud.name = itemtemp[i].metadata.name;
            this.cloudConfig.push(singleCloud);
          }
          //console.log(this.cloudConfig)
        }
      });
    }

    if (this.$route.meta.data) {
      this.cloud = this.$route.meta.data;
    }
    if (this.$route.query.current) {
      if (this.current == "account") {
        console.log(this.$route.query.account);
        this.current = "instance";
      }
      this.cloudConfig = [];
      listResources({
        kind: this.$route.query.account.kind,
        namespace: this.namespace,
      }).then((response) => {
        if (this.validateRes(response) == 1) {
          var itemtemp = response.data.items;
          for (let i = 0; i < itemtemp.length; i++) {
            var singleCloud = {};
            singleCloud.logo = this.styleConfig[itemtemp[i].kind].logo;
            //console.log()
            singleCloud.router = this.styleConfig[itemtemp[i].kind].router;
            singleCloud.kindDes = this.styleConfig[itemtemp[i].kind].kindDes;
            singleCloud.button = this.styleConfig[itemtemp[i].kind].button;
            singleCloud.name = itemtemp[i].metadata.name;
            this.cloudConfig.push(singleCloud);
          }
          //console.log(this.cloudConfig)
        }
      });

      // this.cloudConfig = [
      //   {
      //     logo: "database",
      //     kindDes: "Database",
      //     name: "ANa",
      //     button: "详情",
      //     router: "/resourceInfo/monitor"
      //   }
      // ];
    }
  },

  methods: {
    validateRes(res) {
      if (res.code == 20000) {
        return 1;
      } else {
        this.$notify({
          title: "error",
          message: res.data,
          type: "warning",
          duration: 3000,
        });
        return 0;
      }
    },

    createJson() {
      this.createDialogVisible = true;
    },

    handleDrag() {
      this.$refs.select.blur();
    },

    handleSuccess() {
      this.$notify({
        title: "Success",
        message: "操作成功",
        type: "success",
        duration: 2000,
      });
    },
  },
};
</script>

<style lang="scss">
.app-container {
  .el-radio-button__inner {
    padding: 0;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #606266;
  }
}
.board {
  margin-left: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4a9ff9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}

.card-editor-container {
  position: relative;
  width: 100%;
  height: 70%;
}
</style>

