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
      <div class="content">
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
              <li>
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
          <el-table border :data="project.mocks" :highlight-row="true">
            <el-table-column type="expand"></el-table-column>
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
import { getProjectDetail } from '@/api/project'
import { remove } from 'lodash'
@Component
export default class ProjectDetail extends Vue {
  activeNav: string = 'apiList'
  project: any = {
    user: {},
    members: []
  }
  group: any = ''
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
    getProjectDetail(this.$route.params.id).then(res => {
      this.project = res.data
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
    max-width: $--em-maxWidth;
    margin: 0 auto;
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
        color: #fff;
        box-shadow: 0 2px 3px #bbb;
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
          }
        }
      }
    }
  }
}
</style>
