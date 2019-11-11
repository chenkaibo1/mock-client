<template>
  <div class="em-project-detail">
    <em-add @click.native="$router.push('/new')"></em-add>
    <em-header
      :icon="pageHeader.icon"
      :title="pageHeader.title"
      :description="pageHeader.description"
    >
      <ul slot="nav" class="nav-container">
        <li :class="{'is-active': activeNav === 'apiList'}">
          <i class="fa fa-list"></i>
          <span>接口列表</span>
        </li>
        <li :class="{'is-active': activeNav === 'setting'}">
          <i class="fa fa-cog"></i>
          <span>设置</span>
        </li>
      </ul>
    </em-header>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
// @ts-ignore
import Clipboard from 'clipboard'
import { getProjectsApi, cloneProjectApi, deleteProjectApi, getGroupProjectsApi } from '@/api/project'
import { remove } from 'lodash'
@Component
export default class ProjectDetail extends Vue {
  activeNav: string = 'apiList'
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
  mounted() {}
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
    .is-active {
      color: $--em-color-text-black;
      background: $--em-background-base;
      border-color: $--em-color-Auxiliary-8 $--em-border-color-base transparent;
    }
  }
}
</style>
