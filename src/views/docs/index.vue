<template>
  <div class="docs">
    <em-header
      icon="book"
      :title="$tc('p.docs.header.title', 1)"
      :description="$tc('p.docs.header.description', 1)"
    ></em-header>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class Docs extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/mixin.scss';
</style>
