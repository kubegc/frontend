<template>
  <el-menu-item :index="k" @click="handleClick">
    <i v-if="icon.includes('el-icon')" :class="icon"/>
    <svg-icon v-else :icon-class="icon"/>
    <span slot="title"> {{ title }}</span>
  </el-menu-item>
</template>
<script>

export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    menuIndex: {
      type: String,
      required: true
    },
    k: {
      type: String,
      required: true
    }
  },
  methods: {
    handleClick() {
      this.$emit('changeMenu', this.menuIndex)
    }
  }
}
</script>
