<template>
  <div class="em-profile">
    <em-header
      icon="edit"
      :title="$t('p.profile.header.title')"
      :description="$t('p.profile.header.description')"
    ></em-header>
    <transition name="fade">
      <div class="em-container profile">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form :model="formData" label-position="top" class="profile-form" :rules="rules">
              <el-form-item :label="$t('p.profile.form.language')">
                <el-select v-model="lang">
                  <el-option
                    v-for="item in langList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('p.profile.form.nickName')" prop="nickName">
                <el-input v-model="formData.nickName"></el-input>
              </el-form-item>
              <el-form-item :label="$t('p.profile.form.password')" prop="password">
                <el-input v-model="formData.password"></el-input>
              </el-form-item>
              <el-form-item :label="$t('p.profile.form.passwordCheck')" prop="passwordCheck">
                <el-input v-model="formData.passwordCheck"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary">{{$t('p.profile.form.update')}}</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">少时诵诗书所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所</el-col>
        </el-row>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getItem } from '@/common/storage'
import { assign } from 'lodash'
@Component
export default class Profile extends Vue {
  lang = getItem('lang') || 'zh-CN'
  formData: any = {
    nickName: '',
    password: '',
    passwordCheck: '',
    headImg: ''
  }
  langList = [{ label: '简体中文', value: 'zh-CN' }, { label: 'English', value: 'en' }]
  validator = (rule: any, value: string, callback: Function) => {
    const that = this
    if (value !== that.formData.password) {
      const errStr = that.lang === 'en' ? 'Password is not matching!' : '密码不一致'
      callback(new Error(errStr))
    } else {
      callback()
    }
  }
  rules = {
    passwordCheck: [
      {
        validator: this.validator,
        trigger: 'blur'
      }
    ]
  }
  mounted() {
    assign(this.formData, JSON.parse(getItem('user')))
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variable.scss';
.em-profile {
  background-color: $--em-background-base;
  overflow: hidden;
  height: 100%;
  .profile {
    background-color: $--em-color-white;
    padding: 80px 165px;
    margin: 30px auto;
    /deep/ .el-select {
      width: 100%;
    }
  }
}
</style>
