<template>
  <div class="language">
    <el-dialog :visible="visible" @update:visible="$emit('closeDialog', false)" :title="$t('lang')">
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
<script>
import { getItem, setItem } from '@/common/storage'
export default {
  name: 'SetLanguage',
  model: {
    prop: 'visible',
    event: 'closeDialog'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      language: getItem('lang') || 'zh-CN',
      langList: [{ label: '简体中文', value: 'zh-CN' }, { label: 'English', value: 'en' }]
    }
  },
  methods: {
    settingLanguage() {
      setItem('lang', this.language)
      this.$i18n.locale = this.language
      this.$emit('closeDialog', false)
    }
  }
}
</script>
