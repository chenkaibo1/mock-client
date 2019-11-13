<template>
  <div class="em-new">
    <em-header
      icon="plus"
      :title="$t('p.new.header.title')"
      :description="$t('p.new.header.description')"
    ></em-header>
    <transition name="fade">
      <div class="new-project-wrapper em-container">
        <el-form
          class="project-form"
          :rules="rules"
          label-position="top"
          :model="formData"
          ref="projectForm"
        >
          <el-form-item :label="$tc('p.new.form.name', 1)">
            <template slot="label">
              {{$tc('p.new.form.name', 1)}}
              <el-tooltip :content="$tc('p.new.form.name', 2)">
                <i class="fa fa-question fa-lg"></i>
              </el-tooltip>
            </template>
            <el-row>
              <el-col :span="7">
                <el-select v-model="formData.groupId" :disabled="isEdit" size="small">
                  <el-option
                    v-for="item in projectOwners"
                    :value="item._id || item.id"
                    :key="item._id || item.id"
                    :label="item.name || item.username"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="1" style="text-align: center">/</el-col>
              <el-col :span="16">
                <el-input
                  size="small"
                  v-model="formData.projectName"
                  placeholder="example"
                  ref="projectName"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="$tc('p.new.form.url', 1)" prop="projectUrl">
            <template slot="label">
              {{$tc('p.new.form.url', 1)}}
              <el-tooltip :content="$tc('p.new.form.url', 2)">
                <i class="fa fa-question fa-lg"></i>
              </el-tooltip>
            </template>
            <el-input size="small" v-model="formData.projectUrl" placeholder="example">
              <span slot="prepend">/</span>
            </el-input>
          </el-form-item>
          <el-form-item :label="$tc('p.new.form.description', 1)">
            <el-input
              size="small"
              v-model="formData.projectDesc"
              :placeholder="$tc('p.new.form.description', 2)"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$tc('p.new.form.swagger', 0)"
            :prop="swaggerType === 'URL' ? 'projectSwagger' : ''"
          >
            <template slot="label">
              {{$tc('p.new.form.swagger', 0)}}
              <span>({{$tc('p.new.form.swagger', 1)}})</span>
            </template>
            <el-select size="small" v-model="swaggerType" class="em-new__swagger-type">
              <el-option value="URL">URL</el-option>
              <el-option value="Upload">Upload</el-option>
            </el-select>
            <el-input
              v-if="swaggerType === 'URL'"
              v-model="formData.projectSwagger"
              size="small"
              placeholder="http://example.com/swagger.json"
            ></el-input>
            <el-upload
              type="drag"
              :headers="uploadHeaders"
              :show-upload-list="false"
              :format="['json','yml', 'yaml']"
              :action="uploadAPI"
              :on-success="handleSwaggerUploadSuccess"
              :on-format-error="handleSwaggerUploadError"
              v-if="swaggerType === 'Upload'"
            >
              <div style="padding: 20px 0">
                <i class="fa fa-upload fa-lg" style="color: #3399ff"></i>
                <p>JSON / YAML</p>
              </div>
            </el-upload>
            <p class="em-new__form-description">
              {{$tc('p.new.form.swagger', 2)}}
              <router-link to="/docs#swagger">
                <i class="fa fa-question fa-lg"></i>
              </router-link>
            </p>
          </el-form-item>
          <el-form-item :label="$t('p.new.form.member[0]')">
            <template slot="label">
              {{$t('p.new.form.member[0]')}}
              <span>({{isGroup ? $tc('p.new.form.member[1]', 2) : $tc('p.new.form.member[1]', 1)}})</span>
            </template>
            <el-select
              v-model="formData.projectMembers"
              multiple
              filterable
              size="small"
              remote
              :disabled="isGroup"
              :placeholder="$t('p.new.form.member[2]')"
              :remote-method="remote"
              :loading="remoteLoading"
            >
              <el-option
                v-for="option in users"
                :value="option._id"
                :key="option._id"
                :label="option.username"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              long
              @click="submit"
            >{{isEdit ? $t('p.new.form.button.update') : $t('p.new.form.button.create')}}</el-button>
          </el-form-item>
          <el-form-item :label="$tc('p.new.form.confirm', 0)" v-if="isEdit">
            <el-input
              size="small"
              v-model="confirmName"
              :placeholder="$tc('p.new.form.confirm', 1)"
            ></el-input>
            <p class="em-new__form-description">
              {{$tc('p.new.form.confirm', 2)}}
              <strong
                style="word-break:break-all;"
              >{{(projectData.user && projectData.user.nick_name) || (projectData.group && projectData.group.name) }} / {{projectData.name}}</strong>
            </p>
          </el-form-item>
          <el-form-item v-if="isEdit">
            <el-button
              type="error"
              long
              @click="remove"
              :disabled="confirmName !== projectData.name"
            >{{$t('p.new.form.button.delete')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
import { getUserCreateGroupsApi } from '@/api/group'
import { getUserByKeywordApi } from '@/api/user'
import { createProjectApi } from '@/api/project'
import { getItem } from '@/common/storage'
import { merge } from 'lodash'
@Component
export default class EmNew extends Vue {
  uploadAPI: string = '/api/upload'
  swaggerType: string = 'URL'
  remoteLoading: boolean = false
  users: any[] = []
  user: any = JSON.parse(getItem('user'))
  projectOwners: any[] = []
  rules: any = {
    projectName: [
      {
        required: true,
        message: '项目名不能为空',
        trigger: 'blur'
      },
      {
        max: 128,
        message: '项目名过长',
        trigger: 'blur'
      }
    ],
    projectUrl: [
      {
        required: true,
        message: '项目名不能为空',
        trigger: 'blur'
      },
      {
        max: 128,
        message: '项目名过长',
        trigger: 'blur'
      }
    ],
    projectSwagger: [
      {
        pattern: /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/,
        message: '请输入正确的网站地址'
      }
    ]
  }
  confirmName: string = ''
  isEdit: boolean = false
  isGroup: boolean = false
  projectData: any = {}
  formData: any = {
    groupId: '',
    projectId: '',
    projectName: '',
    projectUrl: '',
    projectDesc: '',
    projectSwagger: '',
    projectMembers: []
  }
  mounted() {
    this.user = JSON.parse(getItem('user'))
    this.getProjectOwner()
  }
  // 获取项目所属(个人或团队)
  getProjectOwner() {
    getUserCreateGroupsApi().then((res: any) => {
      if (res.data && res.data.length) {
        this.projectOwners = res.data.concat(this.user)
      } else {
        this.projectOwners.push(this.user)
      }
    })
  }
  remote(query: string) {
    if (query) {
      this.remoteLoading = true
      getUserByKeywordApi(query).then(res => {
        this.remoteLoading = false
        if (res.data && res.data.length) {
          this.users = res.data
        }
      })
    } else {
      this.users = []
    }
  }
  submit() {
    const projectFormEl = this.$refs.projectForm as any
    projectFormEl.validate((valid: boolean) => {
      if (valid) {
        const data: any = {
          name: this.formData.projectName,
          swagger_url: this.formData.projectSwagger,
          description: this.formData.projectDesc || this.formData.projectName,
          url: this.formData.projectUrl,
          members: this.isGroup ? [] : this.formData.projectMembers
        }
        this.formData.groupId === this.user.id ? (data.user = this.user.id) : (data.group = this.formData.groupId)
        createProjectApi(data).then(() => {
          this.$router.push('/')
        })
      }
    })
  }
  remove() {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variable.scss';
.em-new {
  background-color: $--em-background-base;
  overflow: hidden;
  .new-project-wrapper {
    margin: 20px auto !important;
    display: flex;
    justify-content: center;
    background-color: $--em-color-white;
    .project-form {
      width: 550px;
      padding: 20px 0;
      /deep/ .el-form-item {
        .el-form-item__label {
          height: 40px;
          line-height: 40px;
          color: black;
          font-weight: 600;
        }
        .el-select {
          width: 100%;
        }
      }
    }
  }
}
</style>
