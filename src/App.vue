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
    <el-dialog :visible="visible" :title="$t('lang')" :closable="false" :mask-closable="false">
      <el-select v-model="language">
        <el-option
          v-for="item in langList"
          :value="item.value"
          :key="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
      <div slot="footer">
        <el-button type="primary" @click="settingLanguage" long>OK</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getItem, setItem } from '@/common/storage'
@Component
export default class App extends Vue {
  visible = false
  language = getItem('lang') || 'zh-CN'
  langList = [{ label: '简体中文', value: 'zh-CN' }, { label: 'English', value: 'en' }]
  mounted() {
    console.log(getItem('lang'))
    if (getItem('lang')) {
      this.$i18n.locale = this.language
    } else {
      this.visible = true
    }
  }
  settingLanguage() {
    setItem('lang', this.language)
    this.$i18n.locale = this.language
    this.visible = false
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
