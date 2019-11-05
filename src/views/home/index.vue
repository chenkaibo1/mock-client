<template>
  <div class="em-home">
    <em-add @click.native="$router.push('/new')"></em-add>
    <em-header
      :icon="pageHeader.icon"
      :title="pageHeader.title"
      :description="pageHeader.description"
    >
      <el-radio-group v-model="btnValue">
        <el-radio-button :label="$t('p.project.filter[0]')"></el-radio-button>
        <el-radio-button :label="$t('p.project.filter[1]')"></el-radio-button>
        <el-radio-button :label="$t('p.project.filter[2]')"></el-radio-button>
      </el-radio-group>
    </em-header>
    <transition name="fade">
      <div class="project-list">
        <div v-for="(item, index) in projects" :key="index">
          <!-- 检查 user.id 防止闪烁 -->
          <div
            :class="{
                  'is-join': pageHeader.type === 2 || (pageHeader.type === 0 && user.id && item.user._id !== user.id),
                  'is-group': pageHeader.type === 1
                }"
          >
            <div class="project-collect">
              <transition name="zoom" mode="out-in">
                <!-- <i
                    :class="item.extend.is_workbench ? 'el-icon-star-on' : 'el-icon-star-off'"
                    :key="item.extend.is_workbench"
                ></i>-->
              </transition>
            </div>
            <h2>{{item.name}}</h2>
            <div class="project-description">{{item.description}}</div>
            <div class="project-url">{{item.url}}</div>
            <div class="project-member" v-if="pageHeader.type === 0">
              <img :src="item.user.head_img" />
              <img :src="img.head_img" v-for="(img, i) in item.members" :key="i" />
            </div>
            <el-button-group class="project-control">
              <el-button
                type="ghost"
                icon="el-icon-link"
                :title="$t('p.project.control[0]')"
                class="copy-url"
                @click="clip(item)"
              ></el-button>
              <el-button
                type="ghost"
                icon="el-icon-copy-document"
                :title="$t('p.project.control[1]')"
                style="width: 34%;"
                @click.stop="cloneProject(item)"
              ></el-button>
              <el-button
                type="ghost"
                icon="el-icon-delete"
                :title="$t('p.project.control[2]')"
                @click.stop="deleteProject(item)"
              ></el-button>
            </el-button-group>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { getProjects } from '@/api/project'
@Component
export default class Home extends Vue {
  btnValue: string = ''
  projects: any[] = [{}]
  get pageHeader() {
    const route = this.$route
    switch (route.fullPath) {
      case '/workbench':
        return {
          title: this.$t('p.project.header.title[2]'),
          description: this.$t('p.project.header.description[2]'),
          placeholder: this.$t('p.project.placeholder[2]'),
          icon: 'user',
          type: 2 // 0.个人项目 1.团队项目 2.工作台
        }
      case '/':
        return {
          title: this.$t('p.project.header.title[0]'),
          description: this.$t('p.project.header.description[0]'),
          placeholder: this.$t('p.project.placeholder[0]'),
          icon: 'user',
          type: 0
        }
      default:
        return {
          title: this.$t('p.project.header.title[0]'),
          description: this.$t('p.project.header.description[0]'),
          placeholder: this.$t('p.project.placeholder[0]'),
          icon: 'users',
          type: 1
        }
    }
  }
  mounted() {
    getProjects().then(res => {
      this.projects = res.data
    })
  }
  clip() {}
  cloneProject() {}
  deleteProject() {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variable.scss';
.em-home {
  width: 100%;
  height: 100%;
  .project-list {
    max-width: $--em-maxWidth;
    overflow: hidden;
    margin: 0 auto;
  }
}
</style>
