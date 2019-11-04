<template>
  <transition name="fadeUp">
    <div class="em-add" :class="custClass" :style="custStyle">
      <i :class="icon"></i>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'EmAdd',
  props: {
    icon: {
      type: String,
      default: 'el-icon-plus'
    },
    color: {
      type: String,
      default: 'primary'
    },
    bottom: {
      type: Number,
      default: 30
    }
  },
  computed: {
    custClass() {
      return [this.color === 'red' ? 'is-red' : 'is-primary']
    },
    custStyle() {
      return {
        bottom: this.bottom + 'px'
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/scss/variable.scss';

.em-add {
  width: 42px;
  height: 42px;

  border-radius: 50%;
  position: fixed;
  right: 10px;
  text-align: center;
  color: #fff;
  line-height: 42px;
  font-size: 18px;

  cursor: pointer;
  transition: $--em-all-transition;
  z-index: 90;
}

.em-add.is-primary {
  background: $--em-color-Auxiliary-8;
  box-shadow: 0 5px 10px $--em-color-Auxiliary-1;
}

.em-add.is-primary:hover {
  background: $--em-color-text-Level-link;
}

.em-add.is-red {
  background: $--em-color-Auxiliary-3;
  box-shadow: 0 5px 10px $--em-color-Auxiliary-1;
}

.em-add.is-red:hover {
  background: $--em-color-text-Level-link;
}
</style>
