<template>
  <div class="em-project-detail">
    <em-add @click.native="$router.push('/new')"></em-add>
    <em-header :icon="pageHeader.icon" :title="project.name" :description="pageHeader.description">
      <ul slot="nav" class="nav-container">
        <li :class="{'is-active': activeNav === 'apiList'}" @click="activeNav = 'apiList'">
          <i class="fa fa-list"></i>
          <span>接口列表</span>
        </li>
        <li :class="{'is-active': activeNav === 'setting'}" @click="activeNav = 'setting'">
          <i class="fa fa-cog"></i>
          <span>设置</span>
        </li>
      </ul>
    </em-header>
    <transition name="fade">
      <div class="content em-container">
        <div class="api-list" v-if="activeNav === 'apiList'">
          <div class="project-info">
            <el-row>
              <el-col :span="19" class="desc">
                <em-spots :size="6"></em-spots>
                {{project.description}}
                <p class="tag">
                  <span>Base URL</span>
                  {{baseUrl}}
                </p>
                <p class="tag">
                  <span>Project ID</span>
                  {{project._id}}
                </p>
              </el-col>
              <el-col :span="5" class="user">
                <div>
                  <img :src="group ? '/images/group-default.png' : project.user.headImg" />
                  <p class="name">{{group ? group.name : project.user.username}}</p>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="project-switcher">
            <ul>
              <li @click="openEditor()">
                <i class="fa fa-plus"></i>
                {{$t('p.detail.create.action')}}
              </li>
              <li>
                <transition name="zoom" mode="out-in">
                  <i class="fa fa-code"></i>
                </transition>
                {{$t('p.detail.workbench')}}
              </li>
              <li>
                <i class="fa fa-refresh"></i>
                {{$t('p.detail.syncSwagger.action')}}
              </li>
              <li>
                <i type="fa fa-arrow-down"></i>
                {{$tc('p.detail.download', 1)}}
              </li>
            </ul>
          </div>
          <div class="project.members" v-if="project.members.length">
            <em-spots :size="6"></em-spots>
            <h2>{{$t('p.detail.member')}}</h2>
            <el-row :gutter="20">
              <el-col :span="2" v-for="(item, index) in project.members" :key="index">
                <img :src="item.headImg" :title="item.nick_name" />
              </el-col>
            </el-row>
          </div>
          <el-table border :data="mocks" :highlight-row="true" header-row-class-name="table-header">
            <el-table-column type="expand" align="center">
              <template slot-scope="scope">
                <div class="table-expand">
                  <h2>Method</h2>
                  <p>{{scope.row.method}}</p>
                  <h2>URL</h2>
                  <p>{{scope.row.url}}</p>
                  <h2>{{$t('p.detail.expand.description')}}</h2>
                  <p>{{scope.row.description}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column
              label="Method"
              prop="method"
              :filters="tableMethodFilters"
              :filter-method="tableMethodFilterHandle"
              min-width="100px"
            >
              <template slot-scope="scope">
                <div :class="['table-method',methodColor[scope.row.method]]">{{scope.row.method}}</div>
              </template>
            </el-table-column>
            <el-table-column label="URL" prop="url" sortable min-width="300px"></el-table-column>
            <el-table-column label="描述" min-width="260px">
              <template slot-scope="scope">
                <span class="ellipsis">{{scope.row.description}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="160px" align="center">
              <template slot-scope="scope">
                <div class="options">
                  <el-button-group>
                    <el-button size="small" :title="$t('p.detail.action[0]')">
                      <i class="fa fa-eye color-green"></i>
                    </el-button>
                    <el-button
                      size="small"
                      :title="$t('p.detail.action[1]')"
                      @click="openEditor(scope.row)"
                    >
                      <i class="fa fa-edit color-primary"></i>
                    </el-button>
                    <el-button
                      size="small"
                      :title="$t('p.detail.action[2]')"
                      ref="copyUrl"
                      class="copy-url"
                      @click="clip(scope.row.url)"
                    >
                      <i class="fa fa-link color-blue"></i>
                    </el-button>
                    <el-button
                      size="small"
                      :title="$t('p.detail.action[3]')"
                      @click="clone(scope.row)"
                    >
                      <i class="fa fa-copy color-yellow"></i>
                    </el-button>
                    <el-button
                      size="small"
                      :title="$t('p.detail.action[4]')"
                      @click="deleteMock(scope.row._id)"
                    >
                      <i class="fa fa-trash color-red"></i>
                    </el-button>
                  </el-button-group>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="edit-project" v-if="activeNav === 'setting'"></div>
      </div>
    </transition>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
// @ts-ignore
import Clipboard from 'clipboard'
import { getProjectDetailApi } from '@/api/project'
import { getMockListApi, createMockApi, deleteMockApi } from '@/api/mock'
import { merge, cloneDeep, omit } from 'lodash'
@Component
export default class ProjectDetail extends Vue {
  activeNav: string = 'apiList'
  project: any = {
    user: {},
    members: []
  }
  mocks: any[] = []
  group: any = ''
  tableMethodFilters: any[] = [
    { label: 'get', value: 'get' },
    { label: 'post', value: 'post' },
    { label: 'put', value: 'put' },
    { label: 'delete', value: 'delete' },
    { label: 'patch', value: 'patch' }
  ]
  methodColor: object = {
    get: 'background-color-blue',
    post: 'background-color-green',
    delete: 'background-color-red',
    put: 'background-color-yellow',
    patch: 'background-color-orange'
  }
  get pageHeader() {
    return {
      description: this.$t('p.project.header.description[0]'),
      placeholder: this.$t('p.project.placeholder[0]'),
      icon: 'user',
      type: 0
    }
  }
  get keyword() {
    return this.$store.state.searchValue
  }
  get baseUrl() {
    const baseUrl = location.origin + '/mock/' + this.project._id
    return this.project.url === '/' ? baseUrl : baseUrl + this.project.url
  }
  mounted() {
    getProjectDetailApi(this.$route.params.id).then(res => {
      this.project = res.data
      getMockListApi(this.$route.params.id).then(res => {
        this.mocks = res.data
      })
    })
  }
  tableMethodFilterHandle(value: string, row: any) {
    return row.method.indexOf(value) > -1
  }
  openEditor(row?: any) {
    if (row) {
      this.$router.push(`/editor?type=edit&id=${row._id}`)
    } else {
      this.$router.push(`/editor?type=create&pid=${this.project._id}`)
    }
  }
  // 复制地址
  clip(mockUrl: string) {
    const clipboard = new Clipboard('.copy-url', {
      text: () => {
        return this.baseUrl + mockUrl
      }
    })
    clipboard.on('success', e => {
      e.clearSelection()
      clipboard.destroy()
      this.$message.success(this.$t('p.detail.copySuccess') as string)
    })
  }
  clone(mock: any) {
    let data = cloneDeep(mock)
    data = omit(data, ['_id'])
    merge(data, { url: `${mock.url}_copy_${new Date().getTime()}` })
    createMockApi(data).then(res => {
      if (res.data) {
        merge(data, { _id: res.data })
        this.mocks.push(data)
        this.$message.success(this.$t('p.detail.create.success') as string)
      }
    })
  }
  deleteMock(id: string) {
    deleteMockApi(id).then(() => {
      this.mocks.splice(this.mocks.findIndex(item => item._id === id), 1)
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variable.scss';
.em-project-detail {
  width: 100%;
  height: 100%;
  .nav-container {
    li {
      height: 40px;
      line-height: 40px;
      display: inline-block;
      padding: 0 15px;
      color: $--em-color-text-middle;
      cursor: pointer;
      border: solid transparent;
      border-width: 3px 1px 1px;
      border-radius: 3px 3px 0 0;
    }
    span {
      margin-left: 8px;
    }
    .is-active {
      color: $--em-color-text-black;
      background: $--em-background-base;
      border-color: $--em-color-Auxiliary-8 $--em-border-color-base transparent;
    }
  }
  .content {
    margin-bottom: 20px;
    .api-list {
      width: 100%;
      .project-info {
        margin: 20px 0;
        font-size: 16px;
        color: #fff;
        background: #2d8cf0;
        border-radius: 4px;
        -webkit-box-shadow: 0 2px 3px #eee;
        box-shadow: 0 2px 3px #eee;
        .tag {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 20px;
          font-size: 13px;
          margin-top: 16px;
          padding-right: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          span {
            padding: 5px 10px;
            background: rgba(0, 0, 0, 0.5);
            display: inline-block;
            border-top-left-radius: 20px;
            border-bottom-left-radius: 20px;
            margin-right: 10px;
            width: 100px;
            text-align: center;
          }
        }
        .desc {
          padding: 30px 20px;
        }
        .user {
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          box-shadow: 0 0 3px #000;
          text-align: center;
          background: #252d47;
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 2px solid #fff;
          }
          .name {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 20px;
            padding: 2px 10px;
            font-size: 14px;
            margin-top: 10px;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .project-switcher {
        border-radius: 4px;
        margin-bottom: 20px;
        color: $--em-color-white;
        box-shadow: 0 2px 3px $--em-color-shadow;
        font-size: 13px;
        ul {
          width: 100%;
          display: flex;
          li {
            background: #252d47;
            padding: 15px 0;
            flex: 1;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            &:last-child {
              border-radius: 0 5px 5px 0;
            }
            &:first-child {
              border-radius: 5px 0 0 5px;
            }
            &:hover {
              background: #364166;
            }
          }
        }
      }
      .options {
        /deep/ .el-button-group {
          text-align: center;
          .el-button {
            width: 30px;
            padding: 5px 0;
          }
        }
      }
    }
  }
  /deep/ .table-header {
    color: $--em-color-black;
  }
  .table-method {
    width: 70%;
    margin: 0 auto;
    color: $--em-color-white;
    text-align: center;
    border-radius: $--em-borderRadius44;
  }
  .table-expand {
    background: $--em-color-white;
    border-radius: $--em-borderRadius44;
    box-shadow: 0 1px 5px $--em-color-shadow;
    padding: 20px;

    h2 {
      font-size: 14px;
      font-weight: 600;
    }

    p {
      margin-top: 6px;
      margin-bottom: 10px;
      background: #41444e;
      color: $--em-color-white;
      padding: 6px;
      border-radius: 4px;
      font-size: 13px;
    }
  }
}
</style>
