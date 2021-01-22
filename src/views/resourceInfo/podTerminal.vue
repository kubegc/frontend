<template>
  <div class="app-container">
    <div class="up">
      <p style="margin-left:18px;font-size:16px;font-weight:bold">控制台</p>
      <iframe class="iframe" :src="podTerminalLink"></iframe>
    </div>
    <div class="down" >
      <p style="margin-top:10px;margin-left:18px;font-size:16px;font-weight:bold">日志</p>
        <!-- <json-editor ref="jsonEditor" v-model="value" /> -->
        <iframe  class="iframe2" id="iframe2" style="color:white" :src=logLink></iframe>
    </div>
  </div>
</template>

<script>
import { connectTerminal } from "@/api/commonKindMethod";
import JsonEditor from "@/components/JsonEditor";
import request from '@/utils/request'

export default {
  name: "podTerminal",
  components: { JsonEditor },
  data() {
    return {
      podTerminalLink: "",
      value: "",
      logLink:""
    };
  },
  mounted() {
    var name = this.$route.query.row.json.metadata.name
    var namespace = this.$route.query.row.json.metadata.namespace
    this.logLink = 'http://'+window.g.VUE_APP_MONITOR_HOST+':8888/api/v1/namespaces/'+namespace+'/pods/'+name+'/log'
    console.log(this.logLink)
    this.podTerminalLink = connectTerminal(this.$route.query.catalog_operator, this.$route.query.row);
    console.log(this.podTerminalLink)
   
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.iframe {
  width: 100%;
  height: 300px;
  border: 0ch;
}
.iframe2 {
  width: 100%;
  height: 300px;
  margin-left: 20px;
}
</style>
