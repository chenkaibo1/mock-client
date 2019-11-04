<template>
  <div class="em-login">
    <transition name="zoom">
      <div class="login-wrapper" v-if="page === 0">
        <img src="/images/easy-mock.png" />
        <p>{{$tc('p.login.description', 1)}}</p>
        <p>{{$tc('p.login.description', 2)}}</p>
        <transition name="fadeUp" mode="out-in">
          <el-button
            type="primary"
            class="start-btn"
            key="start"
            v-if="!showLogin"
            @click.stop="start"
          >{{$tc('p.login.form.button', 1)}}</el-button>
          <el-button
            type="success"
            class="start-btn"
            key="login"
            @click="login"
            v-else
          >{{$tc('p.login.form.button', 2)}}</el-button>
        </transition>
        <transition name="fadeLeft">
          <div v-show="showLogin" @keyup.enter="login" v-click-outside="onClickOutside">
            <el-input
              size="large"
              :placeholder="$tc('p.login.form.placeholder', 1)"
              ref="user"
              class="username"
              v-model="loginData.username"
            ></el-input>
            <el-input
              size="large"
              :placeholder="$t('p.login.form.password')"
              type="password"
              v-model="loginData.password"
            ></el-input>
          </div>
        </transition>
      </div>
    </transition>
    <transition name="fade" style>
      <section :class="['login-page', {'page-hidden': page > 0}]" style="z-index:6">
        <div class="wallpaper" ref="wallpaper" v-show="wallpaperVisible"></div>
        <div class="about" @click="page = 1">{{$tc('p.login.about', 1)}}</div>
      </section>
    </transition>
    <section :class="['login-page', {'page-hidden': page > 1}]" style="z-index:5">
      <em-shape-shifter v-if="page === 1"></em-shape-shifter>
      <div class="feature-list">
        <transition-group name="fadeDown">
          <div class="feature-title" key="a" v-show="featureVisible">Easy Mock</div>
          <div
            class="feature-description"
            key="b"
            v-show="featureVisible"
          >{{$tc('p.login.about', 2)}}</div>
        </transition-group>
        <el-row :gutter="100" class="feature-row">
          <el-col :span="8">
            <transition name="zoom">
              <div v-show="featureVisible">
                <div class="feature-icon">
                  <img src="/images/icon-swagger.png" style="margin-left: 1px;" />
                </div>
                <h2>{{$tc('p.login.feature[0]', 1)}}</h2>
                <p>{{$tc('p.login.feature[0]', 2)}}</p>
              </div>
            </transition>
          </el-col>
          <el-col :span="8">
            <transition name="zoom">
              <div v-show="featureVisible">
                <div class="feature-icon">
                  <img src="/images/icon-mock.png" style="margin-left: 1px;" />
                </div>
                <h2>{{$tc('p.login.feature[1]', 1)}}</h2>
                <p>{{$tc('p.login.feature[1]', 2)}}</p>
              </div>
            </transition>
          </el-col>
          <el-col :span="8">
            <transition name="zoom">
              <div v-show="featureVisible">
                <div class="feature-icon">
                  <img src="/images/icon-command.png" />
                </div>
                <h2>{{$tc('p.login.feature[2]', 1)}}</h2>
                <p>{{$tc('p.login.feature[2]', 2)}}</p>
              </div>
            </transition>
          </el-col>
        </el-row>
        <el-row :gutter="100" class="feature-row">
          <el-col :span="8">
            <transition name="zoom">
              <div v-show="featureVisible">
                <div class="feature-icon">
                  <i class="el-icon-reading"></i>
                </div>
                <h2>{{$tc('p.login.feature[3]', 1)}}</h2>
                <p>{{$tc('p.login.feature[3]', 2)}}</p>
              </div>
            </transition>
          </el-col>
          <el-col :span="8">
            <transition name="zoom">
              <div v-show="featureVisible">
                <div class="feature-icon">
                  <i class="el-icon-paperclip"></i>
                </div>
                <h2>{{$tc('p.login.feature[4]', 1)}}</h2>
                <p>{{$tc('p.login.feature[4]', 2)}}</p>
              </div>
            </transition>
          </el-col>
          <el-col :span="8">
            <transition name="zoom">
              <div v-show="featureVisible">
                <div class="feature-icon">
                  <i class="el-icon-alarm-clock"></i>
                </div>
                <h2>{{$tc('p.login.feature[5]', 1)}}</h2>
                <p>{{$tc('p.login.feature[5]', 2)}}</p>
              </div>
            </transition>
          </el-col>
        </el-row>
      </div>
    </section>
    <section class="login-pagination">
      <div class="dot" :class="{'active': page === 0}" @click="page = 0"></div>
      <div class="dot" :class="{'active': page === 1}" @click="page = 1"></div>
    </section>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { loginApi } from '@/api/user'
import { setItem } from '../../common/storage'
import { getWallpaper } from '@/api/util'
// @ts-ignore
import md5 from 'md5'
@Component
export default class Layout extends Vue {
  loginData: any = {
    username: '',
    password: ''
  }
  wallpaperVisible: boolean = false
  wallpaper: any = {
    url: '',
    copyright: {}
  }
  showLogin: boolean = false
  resizeTimer: any = ''
  page: number = 0
  featureVisible: boolean = false
  @Watch('page')
  pageChange(val: number) {
    clearTimeout(this.resizeTimer)
    if (val === 1) {
      this.resizeTimer = setTimeout(() => {
        this.featureVisible = true
      }, 3000)
    } else {
      this.featureVisible = false
    }
  }
  mounted() {
    getWallpaper().then(res => {
      const data = res.data.data[0]
      if (res.data.type === 'bing') {
        this.wallpaper.url = /\.com/.test(data.url) ? data.url : 'https://cn.bing.com' + data.url
        this.wallpaper.copyright = {
          name: 'Bing',
          link: /\.com/.test(data.copyrightlink) ? data.copyrightlink : 'https://cn.bing.com' + data.copyrightlink
        }
      } else {
        // unsplash
        this.wallpaper.url = data.urls.raw + '?w=2200'
        this.wallpaper.copyright = {
          name: data.user.name,
          profileImage: data.user.profile_image.small,
          link: data.user.links.html
        }
      }
      this.loadWallpaper()
    })
  }
  onClickOutside() {
    if (!this.loginData.username && !this.loginData.password) {
      this.showLogin = false
    }
  }
  start() {
    this.showLogin = true
    this.$nextTick(() => {
      const userInput: any = this.$refs.user
      userInput.focus()
    })
  }
  // 登录方法
  login(): void {
    if (!this.loginData.username || !this.loginData.password) {
      this.$message.warning('用户名或密码不能为空')
      return
    }
    if (
      !/^[a-zA-Z]{1}\w{0,15}$/.test(this.loginData.username) ||
      /[\u4e00-\u9fa5]+/.test(this.loginData.password) ||
      this.loginData.password.length > 16 ||
      this.loginData.password.length < 1
    ) {
      this.$alert(
        '<p style="color:red;text-align:center;margin-bottom:5px">用户名或密码错误<p><p><strong>规则</strong></p><p>&nbsp&nbsp;用户名：字符开头0-16位字母或数字</p><p>&nbsp&nbsp密码：0-16位不为汉字的字符</p>',
        {
          dangerouslyUseHTMLString: true
        }
      )
      return
    }
    loginApi({ username: this.loginData.username, password: md5(md5(this.loginData.password)) }).then((res: any) => {
      setItem('user', JSON.stringify(res.data.user))
      setItem('isLogin', true)
      setItem('token', res.data.token)
      this.$router.push('/')
    })
  }
  loadWallpaper() {
    const img = new Image()
    img.src = this.wallpaper.url
    img.onload = () => {
      this.wallpaperVisible = true
      this.$nextTick(() => {
        const wallpaperEl: HTMLElement = this.$refs.wallpaper as HTMLElement
        wallpaperEl.style.background = `url(${img.src})`
        wallpaperEl.style.backgroundSize = 'cover'
        wallpaperEl.style.backgroundPosition = '50% 50%'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variable.scss';
.em-login {
  color: $--em-color-white;
  .login-wrapper {
    width: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -150px;
    margin-top: -165px;
    text-align: center;
    z-index: 100;
    img {
      width: 230px;
      margin-bottom: 15px;
    }
    .start-btn {
      width: 100%;
      height: 45px;
      margin: 30px 0 20px 0;
    }
    .username {
      margin: 10px 0;
    }
  }
  .login-page {
    position: absolute;
    overflow: hidden;
    top: 0;
    left: 0;
    background-color: $--em-color-primary;
    width: 100%;
    height: 100%;
    transform: translateY(0);
    transition: transform 0.7s cubic-bezier(0.825, 0, 0.5, 1);
    .wallpaper {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 45px;
      z-index: 5;
      &:before {
        content: '';
        position: fixed;
        top: 0;
        right: 0;
        bottom: 45px;
        left: 0;
        opacity: 0.6;
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
    .about {
      display: block;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 45px;
      line-height: 45px;
      text-align: center;
      cursor: pointer;
      z-index: 100;
      box-shadow: 0 3px 0 rgba(0, 0, 0, 0.1) inset;
    }
    .feature-list {
      width: 70%;
      height: 570px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -285px;
      margin-left: -35%;
      font-size: 13px;
      .feature-title {
        font-size: 38px;
        font-weight: 700;
      }
      .feature-description {
        font-size: 18px;
        margin-bottom: 100px;
      }
      .feature-row {
        margin-bottom: 20px;
        h2 {
          width: 100%;
          text-align: center;
          margin-bottom: 10px;
          font-weight: 700;
          font-size: 22px;
          word-break: break-word;
        }
        p {
          line-height: 20px;
        }
      }
      .feature-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #fff;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        font-size: 22px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

        img {
          width: 25px;
        }

        i {
          font-size: 32px;
          color: $--em-color-Auxiliary-8;
        }
      }
    }
  }
  .login-pagination {
    position: absolute;
    left: 40px;
    top: 50%;
    z-index: 9999999;
    .dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      box-shadow: 0 0 0 3px $--em-color-white inset;
      margin-bottom: 10px;
      cursor: pointer;
      opacity: 0.4;
      &.active {
        background-color: $--em-color-white;
        opacity: 1;
      }
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .page-hidden {
    transform: translateY(-100%);
  }
}
</style>
