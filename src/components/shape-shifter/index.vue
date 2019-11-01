<template>
  <div class="em-shape-shifter">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import shapeShifter from './shape-shifter'
@Component
export default class EmShapeShifter extends Vue {
  resizeTimer: any = ''
  mounted() {
    shapeShifter.init(this.$refs.canvas, 'mock so easy')
    this.resizeTimer = setTimeout(() => {
      // @ts-ignore
      shapeShifter.UI.reset()
    }, 2000)
  }
  beforeDestroy() {
    clearTimeout(this.resizeTimer)
  }
}
</script>

<style>
.em-shape-shifter {
  position: relative;
}

.em-shape-shifter canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
