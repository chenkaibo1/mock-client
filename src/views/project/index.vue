<template>
  <div class="em-home">
    <em-add @click.native="$router.push('/new')"></em-add>
    <em-placeholder :show="!projects.length">
      <i :class="['fa',  'fa-3x', {'fa-smile-o': !keyword} , {'fa-meh-o': keyword}]"></i>
      <p>{{keyword ? $t('p.project.placeholder[3]') : pageHeader.placeholder}}</p>
    </em-placeholder>
    <em-header
      :icon="pageHeader.icon"
      :title="pageHeader.title"
      :description="pageHeader.description"
    >
      <el-radio-group v-model="btnValue" @change="getProjectList" v-if="!groupName">
        <el-radio-button :label="$t('p.project.filter[0]')"></el-radio-button>
        <el-radio-button :label="$t('p.project.filter[1]')"></el-radio-button>
        <el-radio-button :label="$t('p.project.filter[2]')"></el-radio-button>
      </el-radio-group>
    </em-header>
    <transition name="fade">
      <div class="project-list em-container">
        <div v-for="item in projects" :key="item._id">
          <!-- 检查 user.id 防止闪烁 -->
          <div
            :class="['project-item',{'is-group': groupName}]"
            @click.stop="$router.push(`/project/${item._id}`)"
          >
            <div class="project-collect">
              <transition name="zoom" mode="out-in">
                <i :class="groupName? 'fa fa-certificate' : 'el-icon-star-off'"></i>
              </transition>
            </div>
            <h2>{{item.name}}</h2>
            <div class="project-description item-common">{{item.description || emptyDesc}}</div>
            <div class="project-url item-common">{{item.url}}</div>
            <div class="project-member item-common">
              <img :src="item.user.headImg" />
            </div>
            <el-button-group class="project-control">
              <el-button
                type="ghost"
                icon="el-icon-link"
                :title="$t('p.project.control[0]')"
                class="control-item copy-url"
                ref="copyUrl"
                size="small"
                @click.stop="clip(item)"
              ></el-button>
              <el-button
                type="ghost"
                icon="el-icon-copy-document"
                class="control-item"
                size="small"
                :title="$t('p.project.control[1]')"
                @click.stop="cloneProject(item._id)"
              ></el-button>
              <el-button
                type="ghost"
                icon="el-icon-delete"
                class="control-item"
                size="small"
                :title="$t('p.project.control[2]')"
                @click.stop="clickDelete(item)"
              ></el-button>
            </el-button-group>
          </div>
        </div>
      </div>
    </transition>
    <el-dialog :visible.sync="removeModal.show" :custom-class="'remove-project-dialog'">
      <p slot="title" style="color:#f60;text-align:center">
        <i class="el-icon-warning"></i>
        <span>{{$t('p.project.modal.delete.title')}}</span>
      </p>
      <div>
        <p>
          {{$tc('p.project.modal.delete.description', 1)}}
          <strong
            style="word-break:break-all;"
          >{{(removeModal.project.user && removeModal.project.user.nick_name) || (removeModal.project.group && removeModal.project.group.name) }} / {{removeModal.project.name}}</strong>
        </p>
        <p>{{$tc('p.project.modal.delete.description', 2)}}</p>
        <el-input
          style="margin-top: 10px"
          v-model="removeModal.inputModel"
          :placeholder="$t('p.project.modal.delete.placeholder')"
        ></el-input>
      </div>
      <div slot="footer">
        <el-button
          type="error"
          size="large"
          long
          :disabled="removeModal.project.name !== removeModal.inputModel"
          @click="deleteProject(removeModal.project._id)"
        >{{$t('p.project.modal.delete.button')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
// @ts-ignore
import Clipboard from 'clipboard'
import { getProjectsApi, cloneProjectApi, deleteProjectApi, getGroupProjectsApi } from '@/api/project'
import { remove } from 'lodash'
@Component
export default class Project extends Vue {
  btnValue: string = '全部'
  typeMap: any = {
    全部: 0,
    我创建的: 1,
    我加入的: 2
  }
  groupName: string = ''
  emptyDesc: string = ''
  projects: any[] = []
  removeModal: any = {
    show: false,
    project: {},
    inputModel: ''
  }
  get pageHeader() {
    const route = this.$route
    switch (route.query.type) {
      case 'workbench':
        return {
          title: this.$t('p.project.header.title[2]'),
          description: this.$t('p.project.header.description[2]'),
          placeholder: this.$t('p.project.placeholder[2]'),
          icon: 'user',
          type: 2 // 0.个人项目 1.团队项目 2.工作台
        }
      case 'group':
        const groupName = (route.query && route.query.name) || ''
        return {
          title: this.$t('p.project.header.title[1]', { groupName }),
          description: this.$t('p.project.header.description[1]', { groupName }),
          placeholder: this.$t('p.project.placeholder[1]'),
          icon: 'users',
          type: 1
        }
      default:
        return {
          title: this.$t('p.project.header.title[0]'),
          description: this.$t('p.project.header.description[0]'),
          placeholder: this.$t('p.project.placeholder[0]'),
          icon: 'user',
          type: 0
        }
    }
  }
  get keyword() {
    return this.$store.state.searchValue
  }
  @Watch('keyword')
  keywordChange(val: string) {
    !this.groupName &&
      getProjectsApi(this.typeMap[this.btnValue], val).then(res => {
        this.projects = res.data
      })
  }
  @Watch('$route')
  routeChange() {
    this.groupName = this.$route.query.name as string
    if (this.groupName) {
      this.getGroupProjectList()
    } else {
      this.getProjectList()
    }
  }
  mounted() {
    this.emptyDesc = this.$t('p.project.emptyDesc') as string
    this.groupName = this.$route.query.name as string
    if (this.groupName) {
      this.getGroupProjectList()
    } else {
      this.getProjectList()
    }
  }
  getProjectList() {
    getProjectsApi(this.typeMap[this.btnValue]).then(res => {
      this.projects = res.data
    })
  }
  getGroupProjectList() {
    getGroupProjectsApi(this.$route.query.id as string).then(res => {
      this.projects = res.data
    })
  }
  // 复制项目地址
  clip(project: any) {
    const el = this.$refs.copyUrl as any
    const clipboard = new Clipboard(el[0].$el, {
      text() {
        return location.origin + '/mock/' + project._id + project.url
      }
    })
    clipboard.on('success', (e: any) => {
      e.clearSelection()
      clipboard.destroy()
      const text = this.$t('p.project.copySuccess') as string
      this.$message.success(text)
    })
  }
  // 克隆项目
  cloneProject(id: string) {
    cloneProjectApi(id).then(() => {
      this.getProjectList()
    })
  }
  clickDelete(project: any) {
    this.removeModal.show = true
    this.removeModal.project = project
  }
  deleteProject(id: string) {
    deleteProjectApi(id).then(() => {
      this.removeModal.show = false
      remove(this.projects, item => {
        return item._id === id
      })
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variable.scss';
.em-home {
  width: 100%;
  height: 100%;
  .project-list {
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    .project-item {
      width: 225px;
      margin: 20px;
      background-color: $--em-color-white;
      padding: 0 14px 20px 14px;
      box-shadow: 0 1px 5px $--em-color-shadow-3;
      border-radius: 4px;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      .project-collect {
        text-align: center;
        font-size: 26px;
        color: $--em-color-Auxiliary-10;
        margin: 10px 0;
      }
      h2 {
        font-weight: 700;
        font-size: $--em-fontSize14;
      }
      .item-common {
        padding: 10px;
        border: 1px solid $--em-border-color-base;
        border-radius: $--em-borderRadius44;
        margin-top: 10px;
        background-color: $--em-background-base;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .project-description {
        &::before {
          content: '';
          display: block;
          width: 20px;
          height: 2px;
          margin-bottom: 3px;
          background-color: $--em-color-Auxiliary-8;
        }
      }
      .project-url {
        &::before {
          content: '';
          display: block;
          width: 20px;
          height: 2px;
          margin-bottom: 3px;
          background-color: $--em-color-Auxiliary-10;
        }
      }
      .project-member {
        img {
          width: 20px;
          height: 20px;
          display: block;
          border-radius: 4px;
          margin-right: 12px;
        }
      }
      .project-control {
        width: 100%;
        margin-top: 10px;
        .control-item {
          width: 33%;
          &:nth-child(2) {
            width: 34%;
          }
        }
      }
    }
    .is-group {
      background-color: $--em-color-Auxiliary-8;
    }
  }
}
/deep/ .remove-project-dialog {
  width: 360px;
  border-radius: 6px;
  .el-dialog__header {
    padding-bottom: 20px;
    p {
      font-size: $--em-fontSize14;
    }
  }
  .el-dialog__body {
    padding: 20px 20px 10px 20px;
    border-bottom: 1px solid #d9dbe0;
    p {
      font-size: $--em-fontSize12;
      line-height: 18px;
      color: black;
    }
    .el-input__inner {
      height: 32px;
    }
  }
  .el-button {
    width: 100%;
    height: 30px;
    padding: 0;
  }
}
</style>
