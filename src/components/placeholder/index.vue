<template>
  <div class="em-placeholder">
    <transition name="fade">
      <div class="content" v-show="visible">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'EmPlaceholder',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false
    }
  },
  mounted() {
    this.handleVisible()
  },
  watch: {
    show: 'handleVisible'
  },
  methods: {
    handleVisible() {
      setTimeout(() => {
        this.visible = this.show
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.em-placeholder {
  .content {
    text-align: center;
    font-size: 22px;
    color: #d5d5d5;
    position: absolute;
    cursor: default;
    width: 100%;
    height: 100px;
    top: 120px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    i {
      font-size: 32px;
      margin-bottom: 10px;
    }
  }
}
</style>
