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
          <el-col :span="18">
            <el-form
              :model="formData"
              label-position="top"
              class="profile-form"
              :rules="rules"
              ref="userForm"
            >
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
                <el-button type="primary" @click="editUser">{{$t('p.profile.form.update')}}</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="6">
            <label class="el-form-item__label">{{$t('p.profile.form.avatar')}}</label>
            <viewer>
              <img
                :src="formData.headImg || '/404lazyImg.jpg'"
                class="avatar"
                :alt="formData.nickName"
                :title="formData.nickName"
              />
            </viewer>
            <el-upload
              class="user-img-upload"
              action="/api/util/upload"
              accept=".jpeg, .jpg, .png"
              :show-file-list="false"
              :headers="headers"
              :on-success="handleUploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { editUserApi } from '@/api/user'
import { getItem, clear } from '@/common/storage'
import { assign, clone } from 'lodash'
import md5 from 'md5'
@Component
export default class Profile extends Vue {
  headers = {
    token: getItem('token'),
    crossDomain: true
  }
  formData: any = {
    nickName: '',
    password: '',
    passwordCheck: '',
    headImg: ''
  }
  validator = (rule: any, value: string, callback: Function) => {
    const that = this
    if (value !== that.formData.password) {
      const lang = getItem('lang') || 'zh-CN'
      const errStr = lang === 'en' ? 'Password is not matching!' : '密码不一致'
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
  handleUploadSuccess(resp: any, file: any) {
    this.formData.headImg = resp.data.path
  }
  editUser() {
    const userForm = this.$refs.userForm as any
    userForm.validate((flag: boolean) => {
      if (flag) {
        const cloneDate = clone(this.formData)
        cloneDate.password && (cloneDate.password = md5(md5(cloneDate.password)))
        editUserApi(cloneDate).then(() => {
          clear()
          this.$router.push('/login')
        })
      }
    })
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
    .avatar {
      width: 100%;
      cursor: pointer;
      margin: 10px 0;
    }
    .user-img-upload {
      text-align: center;
    }
  }
}
</style>
