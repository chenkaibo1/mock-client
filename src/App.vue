<template>
  <div class="app">
    <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </div>
</template>
<style lang="scss">
.app {
  width: 100%;
  height: 100%;
}
</style>
