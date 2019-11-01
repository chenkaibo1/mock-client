<template>
  <div class="test">
    <div id="sort">
      <button @click="trunToTab1">tab1</button>
      <button @click="trunToTab2">tab2</button>
      <div v-for="(item, index) in arrData" :key="index">
        <div @click="clickItem(index)" class="item">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class Test extends Vue {
  arrData: number[] = []
  trunToTab1() {
    this.arrData = [1, 2, 3, 4]
  }
  trunToTab2() {
    this.arrData = [5, 6, 7, 8]
  }
  clickItem() {
    // @ts-ignore
    document.getElementsByClassName('item')[0].style.color = 'red'
  }
}
</script>

<style lang="scss" scoped>
</style>
