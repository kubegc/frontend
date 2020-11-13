<template>
  <div class="app-container">
    <div style="text-align: center;">
      <el-transfer
        style="text-align: left; display: inline-block;"
        v-model="value4"
        filterable
        :left-default-checked="left"
        :right-default-checked="right"
        :titles="['未生效', '已生效']"
        :button-texts="['失效', '生效']"
        :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
        @change="handleChange"
        :data="data"
      >
        <span slot-scope="{ option }">{{ option.label }}</span>
      </el-transfer>
    </div>
  </div>
</template>

<script>
import { getResource, updateResource, getKinds } from '@/api/k8sResource'

export default {
  name: "Execution",
  components: {},
  props: {},
  data() {
    return {
      json: {},
      allData: [],
      data: [],
      left: [1],
      right: [2,3],
      value: [1],
      value4: [],
      renderFunc(h, option) {
        return <span>{option.label}</span>;
      }
    };
  },

  mounted() {},
  created() {
    getKinds().then(response => {
      this.allData = response.data.data
      for(var j = 0; j < this.allData.length; j++) {
        this.data.push({
            key: j,
            label: this.allData[j],
            disabled: false
          });
      }
      getObj({
        kind: "ConfigMap",
        name: "kubernetes-synchronizer",
        namespace: "kube-system"
      }).then(response => {
        this.json = response.data
        var temp = response.data.data;
        for(var i = 0; i < this.data.length; i++) {
          for (var p in temp) {
            if(this.data[i].label == p) {
              //console,log()
              this.value4.push(i);
            }
        }
        }       
      });
    });
  },

  methods: {
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
      for(var x = 0; x < movedKeys.length; x++) {
        let tempKey = this.data[movedKeys[x]].label
        if(typeof(this.json) == 'string'){
          this.json = JSON.parse(this.json)
        }
        if(direction == "right") {
          this.json.data[tempKey] = tempKey
        }else{
          delete this.json.data[tempKey]
        }
        
      }
      
      updateObj({
        json: this.json,
        kind: "ConfigMap",
        namespace: "kube-system"
      }).then(response => {
        if (response.code == 20000) {
          this.handleSuccess();
        }
      });
    },

    validateRes(res) {
      if (res.code == 20000) {
        return 1;
      } else {
        this.$notify({
          title: "error",
          message: res.data,
          type: "warning",
          duration: 3000
        });
        return 0;
      }
    },

    handleSuccess() {
      this.$notify({
        title: "Success",
        message: "操作成功",
        type: "success",
        duration: 2000
      });
    }
  }
};
</script>

<style lang="scss">
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
</style>

