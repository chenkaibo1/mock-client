<template>
  <div class="docs">
    <em-header
      icon="book"
      :title="$tc('p.docs.header.title', 1)"
      :description="$tc('p.docs.header.description', 1)"
    ></em-header>
    <el-backtop target=".docs-content">
      <em-add icon="el-icon-top"></em-add>
    </el-backtop>
    <div class="em-container">
      <el-menu mode="horizontal" class="docs-nav">
        <el-submenu :index="parent.index" v-for="parent in nav" :key="parent.index">
          <template slot="title">{{parent.title}}</template>
          <el-menu-item
            :index="item.index"
            v-for="item in parent.children"
            :key="item.index"
            @click.native="go(item.id)"
          >{{item.title}}</el-menu-item>
        </el-submenu>
      </el-menu>
      <div class="docs-content">
        <transition-group name="fade">
          <docs class="markdown-body" ref="doc" key="doc"></docs>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// @ts-ignore
import docs from './docs.md'
// @ts-ignore
import docsZh from './docs.zh-CN.md'
import { getItem } from '@/common/storage'
@Component({
  components: {
    docs: {
      components: {
        docs,
        docsZh
      },
      render: (h: any) => {
        const locale = getItem('lang') || 'zh-CN'
        if (locale === 'en') return h(docs)
        return h(docsZh)
      }
    }
  }
})
export default class EmDocs extends Vue {
  nav: any[] = []
  get doc() {
    return this.$refs.doc
  }
  mounted() {
    const doc: any = this.doc
    const docNodes = doc.$el.children
    this.$nextTick(() => {
      const hash = location.hash
      if (hash) {
        location.href = hash
      }
    })
    for (let len = docNodes.length, i = 0; i < len; i += 1) {
      const node = docNodes[i]
      const tagName = node.tagName.toLowerCase()
      if ('h2 h3'.split(' ').indexOf(tagName) !== -1) {
        if (tagName === 'h2') {
          this.nav.push({
            title: node.innerText,
            index: i + '',
            children: []
          })
        } else {
          this.nav[this.nav.length - 1].children.push({
            id: node.id,
            title: node.innerText,
            index: `${i}-${this.nav[this.nav.length - 1].children.length}`
          })
        }
      }
    }
  }
  go(id: string) {
    location.href = '#' + id
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variable.scss';
.docs {
  overflow: hidden;
  .docs-nav {
    margin-top: 20px;
    list-style: none !important;
    background: #f8f8f8;
    border-bottom: 1px solid #eaecef;
    padding: 0 20px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }
  .docs-content {
    padding: 20px 40px;
    margin: 20px auto;
    border: 1px solid #eee;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 3px #eee;
    /deep/ .markdown-body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
      font-size: 16px;
      line-height: 1.5;
      & > *:first-child {
        margin-top: 0 !important;
      }
      &:last-child {
        padding-top: 20px;
        padding-bottom: 20px;
      }
      h1 {
        padding-bottom: 10px;
        font-size: 26px;
        border-bottom: 1px solid #eaecef;
        margin-bottom: 16px;
        font-weight: 600;
        line-height: 1.25;
      }
      p,
      blockquote,
      ul,
      ol,
      dl,
      table,
      pre {
        margin-top: 0;
        margin-bottom: 16px;
      }
      pre {
        padding: 16px;
        overflow: auto;
        font-size: 85%;
        line-height: 1.45;
        background-color: #f6f8fa;
        border-radius: 3px;
      }
      table {
        border-spacing: 0;
        border-collapse: collapse;
        display: block;
        width: 100%;
        overflow: auto;
        text-align: left;
        th,
        tr {
          background-color: #fff;
          border-top: 1px solid #c6cbd1;
          td {
            padding: 6px 13px;
            border: 1px solid #dfe2e5;
          }
        }
        & tr:nth-child(2n) {
          background-color: $--em-background-base;
        }
      }
      img {
        max-width: 100%;
        background-color: #fff;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        margin: 10px 0;
      }
    }
  }
}
</style>
