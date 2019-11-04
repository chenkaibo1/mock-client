<template>
  <div class="em-new">
    <em-header
      icon="plus-round"
      :title="$t('p.new.header.title')"
      :description="$t('p.new.header.description')"
    ></em-header>
    <transition name="fade">
      <div class="new-project-wrapper">
        <el-form class="project-form" label-position="top" :model="formData" ref="projectForm">
          <el-form-item :label="$tc('p.new.form.name', 1)">
            <template slot="label">
              {{$tc('p.new.form.name', 1)}}
              <el-tooltip :content="$tc('p.new.form.name', 2)">
                <i class="fa fa-question fa-lg"></i>
              </el-tooltip>
            </template>
            <el-row>
              <el-col :span="7">
                <el-form-item>
                  <el-select v-model="formData.groupId" :disabled="isEdit">
                    <el-option
                      v-for="item in groups"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.label }}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1" style="text-align: center">/</el-col>
              <el-col :span="16">
                <el-form-item>
                  <el-input v-model="formData.projectName" placeholder="example" ref="projectName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="$tc('p.new.form.url', 1)">
            <template slot="label">
              {{$tc('p.new.form.url', 1)}}
              <el-tooltip :content="$tc('p.new.form.url', 2)">
                <i class="fa fa-question fa-lg"></i>
              </el-tooltip>
            </template>
            <el-input v-model="projectUrl" placeholder="example">
              <span slot="prepend">/</span>
            </el-input>
          </el-form-item>
          <el-form-item :label="$tc('p.new.form.description', 1)" class="em-new__form-hr">
            <el-input
              v-model="formData.projectDesc"
              :placeholder="$tc('p.new.form.description', 2)"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$tc('p.new.form.swagger', 0)">
            <template slot="label">
              {{$tc('p.new.form.swagger', 0)}}
              <span>({{$tc('p.new.form.swagger', 1)}})</span>
            </template>
            <el-select v-model="swaggerType" class="em-new__swagger-type">
              <el-option value="URL">URL</el-option>
              <el-option value="Upload">Upload</el-option>
            </el-select>
            <el-input
              v-if="swaggerType === 'URL'"
              v-model="formData.projectSwagger"
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
          <el-form-item :label="$t('p.new.form.member[0]')" class="em-new__form-hr">
            <template slot="label">
              {{$t('p.new.form.member[0]')}}
              <span>({{isGroup ? $tc('p.new.form.member[1]', 2) : $tc('p.new.form.member[1]', 1)}})</span>
            </template>
            <el-select
              v-model="formData.projectMembers"
              multiple
              filterable
              remote
              :disabled="isGroup"
              :placeholder="$t('p.new.form.member[2]')"
              :remote-method="remote"
              :loading="remoteLoading"
            >
              <el-option
                v-for="option in users"
                :value="option.value"
                :key="option.value"
              >{{option.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item :class="{'em-new__form-hr': isEdit}">
            <el-button
              type="primary"
              long
              @click="submit"
            >{{isEdit ? $t('p.new.form.button.update') : $t('p.new.form.button.create')}}</el-button>
          </el-form-item>
          <el-form-item :label="$tc('p.new.form.confirm', 0)" v-if="isEdit">
            <el-input v-model="confirmName" :placeholder="$tc('p.new.form.confirm', 1)"></el-input>
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
@Component
export default class EmNew extends Vue {
  uploadAPI: string = '/api/upload'
  swaggerType: string = 'URL'
  remoteLoading: boolean = false
  users: any[] = []
  groups: any[] = []
  projectUrl: string = ''
  confirmName: string = ''
  isEdit: boolean = true
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
  remote() {}
  submit() {}
  remove() {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variable.scss';
.em-new {
  .new-project-wrapper {
    max-width: $--em-maxWidth;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    .project-form {
      width: 550px;
    }
  }
}
</style>
