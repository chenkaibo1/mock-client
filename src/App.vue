<template>
  <div class="app">
    <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
    <set-language v-model="visible" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getItem, setItem } from '@/common/storage'
@Component
export default class App extends Vue {
  visible = false
  language = getItem('lang') || 'zh-CN'
  mounted() {
    if (getItem('lang')) {
      this.$i18n.locale = this.language
    } else {
      this.visible = true
    }
  }
}
</script>
<style lang="scss">
.app {
  width: 100%;
  height: 100%;
  .el-select {
    width: 100%;
  }
}
</style>
