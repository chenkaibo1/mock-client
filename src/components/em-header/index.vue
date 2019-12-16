<template>
  <div class="em-header">
    <transition name="fade">
      <em-spots></em-spots>
    </transition>
    <el-row class="header em-container">
      <el-col :span="2" class="header-logo">
        <i :class="iconClass"></i>
      </el-col>
      <el-col :span="14">
        <transition name="fade">
          <div class="title-description">
            <h2 class="title">{{title}}</h2>
            <p class="description">{{description}}</p>
          </div>
        </transition>
      </el-col>
      <el-col :span="8">
        <slot></slot>
      </el-col>
    </el-row>
    <div class="header-nav">
      <div class="nav-wrapper em-container">
        <slot name="nav"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmHeader',
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  computed: {
    iconClass() {
      return `fa fa-${this.icon} fa-2x`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variable.scss';
.em-header {
  overflow: hidden;
  width: 100%;
  box-shadow: 0 2px 2px $--em-color-shadow;
  height: 110px;
  padding: 30px 0;
  .header {
    overflow: hidden;
    display: flex;
    align-items: center;
    .header-logo {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $--em-color-Auxiliary-8;
      border-radius: $--em-borderRadius44;
      color: $--em-color-white;
    }
    .title-description {
      margin-left: 10px;
      .title {
        font-size: $--em-fontSize18;
        font-weight: 700;
        margin-bottom: 8px;
      }
      .description {
        font-size: $--em-fontSize12;
        color: $--em-color-text-Level-3;
        font-weight: 400;
      }
    }
  }
  .header-nav {
    position: absolute;
    bottom: -1px;
    width: 100%;
    font-size: 13px;
    .nav-wrapper {
      margin: 0 auto;
      display: flex;
      flex-direction: row-reverse;
    }
  }
}
</style>
