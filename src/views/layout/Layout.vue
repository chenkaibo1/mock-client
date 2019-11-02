<template>
  <div class="em-layout">
    <transition name="fade">
      <div class="nav-wrapper">
        <div class="nav">
          <div class="nav-logo" @click="$router.push('/')">
            <img src="/images/easy-mock.png" />
          </div>
          <div class="nav-search">
            <el-input v-model="searchValue" placeholder="Search Easy Mock" ref="search"></el-input>
          </div>
          <el-menu
            class="menu"
            :default-active="activeIndex"
            mode="horizontal"
            background-color="#495060"
            text-color="#edeef5"
            active-text-color="#409eff"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="fa fa-server fa-lg nav-icon-color"></i>
                {{$t('c.layout.menu[0][0]')}}
              </template>
              <el-menu-item index="1-1" @click.native="$router.push('/')">
                <i class="fa fa-user fa-lg nav-icon-color"></i>
                {{$t('c.layout.menu[0][1]')}}
              </el-menu-item>
              <el-menu-item index="1-2" @click.native="$router.push('/group')">
                <i class="fa fa-users fa-lg nav-icon-color"></i>
                {{$t('c.layout.menu[0][2]')}}
              </el-menu-item>
            </el-submenu>
            <el-menu-item index="2" @click.native="$router.push('/workbench')">
              <i class="fa fa-code fa-lg nav-icon-color"></i>
              {{$t('c.layout.menu[1]')}}
            </el-menu-item>
            <el-menu-item index="3" @click.native="$router.push('/dashboard')">
              <i class="fa fa-tachometer fa-lg nav-icon-color"></i>
              {{$t('c.layout.menu[2]')}}
            </el-menu-item>
            <el-menu-item index="4" @click.native="$router.push('/docs')">
              <Badge dot :count="readChangelog ? '0' : '1'">
                <i class="fa fa-book fa-lg nav-icon-color"></i>
                {{$t('c.layout.menu[3]')}}
              </Badge>
            </el-menu-item>
            <el-submenu index="5">
              <template slot="title">
                <i class="fa fa-life-ring fa-lg nav-icon-color"></i>
                {{$t('c.layout.menu[4][0]')}}
              </template>
              <el-menu-item
                index="5-1"
                class="ivu-menu-item"
                @click="open('https://github.com/easy-mock/easy-mock')"
              >
                <i class="fa fa-link fa-lg nav-icon-color"></i> GitHub
              </el-menu-item>
              <el-menu-item
                index="5-2"
                class="ivu-menu-item"
                @click="open('https://github.com/easy-mock/easy-mock-cli')"
              >
                <i class="fa fa-link fa-lg nav-icon-color"></i>
                {{$t('c.layout.menu[4][1]')}}
              </el-menu-item>
              <el-menu-item
                index="5-3"
                class="ivu-menu-item"
                @click="open('http://mockjs.com/examples.html')"
              >
                <i class="fa fa-link fa-lg nav-icon-color"></i>
                {{$t('c.layout.menu[4][2]')}}
              </el-menu-item>
            </el-submenu>
            <el-submenu index="6" class="nav-avatar" v-show="userHeadImg">
              <template slot="title">
                <img :src="userHeadImg" v-show="userHeadImg" />
              </template>
              <el-menu-item index="6-1" @click.native="$router.push('/profile')">
                <i class="fa fa-pencil-square-o fa-lg nav-icon-color"></i>
                {{$t('c.layout.menu[5][0]')}}
              </el-menu-item>
              <el-menu-item index="6-2" @click.native="logOut">
                <i class="fa fa-sign-out fa-lg nav-icon-color"></i>
                {{$t('c.layout.menu[5][1]')}}
              </el-menu-item>
            </el-submenu>
            <el-menu-item class="nav-avatar" index="6-3" @click.native="$router.push('/login')">
              <i type="log-in"></i>
              {{$t('c.layout.menu[5][2]')}}
            </el-menu-item>
          </el-menu>
        </div>
      </div>
    </transition>
    <div class="content">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { getItem } from '@/common/storage'
@Component
export default class Layout extends Vue {
  activeIndex: string = '1'
  pageKey: string = ''
  get userHeadImg() {
    return JSON.parse(getItem('user')).headImg
  }
  open(url: string) {
    window.open(url)
  }
  logOut() {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variable.scss';
.em-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .nav-wrapper {
    background-color: #495060;
    .nav {
      /deep/ .el-menu.el-menu--horizontal {
        border-bottom: none;
      }
      max-width: $--em-maxWidth;
      display: flex;
      align-items: center;
      margin: 0 auto;
      .nav-logo {
        flex: 2;
        margin-left: $--em-padding;
        cursor: pointer;

        img {
          height: 20px;
        }
      }
      .nav-search {
        flex: 3;
        margin: 0 $--em-padding;
        /deep/ .el-input {
          .el-input__inner {
            height: 30px;
            border-radius: 6px;
          }
        }
      }
      .menu {
        flex: 15;
      }
    }
  }
  .content {
  }
}
.nav-icon-color {
  color: #c0c4cc;
}
</style>
