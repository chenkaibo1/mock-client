<template>
  <div class="em-editor">
    <div class="editor-wrapper">
      <div ref="codeEditor" class="code-editor"></div>
    </div>
    <div class="panel-wrapper">
      <div class="panel-info">
        <em-spots :size="10"></em-spots>
        <h2>{{isEdit ? $t('p.detail.editor.title[0]') : $t('p.detail.editor.title[1]')}}</h2>
        <div class="editor-form">
          <el-form label-position="top">
            <el-form-item label="Method">
              <el-select v-model="temp.method" size="small">
                <el-option
                  v-for="item in methods"
                  :value="item.value"
                  :key="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="URL">
              <el-input v-model="temp.url" size="small">
                <span slot="prepend">/</span>
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('p.detail.columns[0]')">
              <el-input v-model="temp.description" size="small"></el-input>
            </el-form-item>
            <el-form-item :label="$t('p.detail.editor.autoClose')" v-if="isEdit">
              <el-switch v-model="autoClose" size="small"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="small"
                @click="submit"
              >{{isEdit ? $t('p.detail.editor.action[0]') : $t('p.detail.editor.action[1]')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="editor-control">
          <div class="switcher">
            <ul>
              <li @click="format">{{$t('p.detail.editor.control[0]')}}</li>
              <li @click="preview" v-if="isEdit">{{$t('p.detail.editor.control[1]')}}</li>
              <li @click="close">{{$t('p.detail.editor.control[2]')}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as ace from 'brace'
import 'brace/mode/javascript'
import 'brace/theme/monokai'
import 'brace/ext/language_tools'
import 'brace/ext/searchbox'
import './snippets'
// @ts-ignore
import jsBeautify from 'js-beautify/js/lib/beautify'
import { getMockDetailApi, createMockApi, editMockApi } from '@/api/mock'
import { getProjectDetailApi } from '@/api/project'
import { merge, cloneDeep } from 'lodash'
@Component
export default class Editor extends Vue {
  codeEditor: any = null
  autoClose: boolean = true
  methods: any[] = [{ label: 'get', value: 'get' }, { label: 'post', value: 'post' }, { label: 'put', value: 'put' }, { label: 'delete', value: 'delete' }, { label: 'patch', value: 'patch' }]
  baseUrl: string = ''
  mockData: any = {}
  project: any = {}
  temp: any = {
    url: '',
    mode: '{"data": {}}',
    method: 'get',
    description: ''
  }
  get isEdit() {
    return this.$route.query.type === 'edit'
  }
  // created() {
  //   const mockSnippets = require('./mock.snippets')
  //   const javascriptSnippets = require('./javascript.snippets')
  //   // @ts-ignore
  //   ace.define('ace/snippets/javascript', ['require', 'exports', 'module'], function(e, t) {
  //     t.snippetText = javascriptSnippets + '\n' + mockSnippets
  //     t.scope = 'javascript'
  //   })
  // }
  async mounted() {
    this.codeEditor = ace.edit(this.$refs.codeEditor as any)
    this.codeEditor.$blockScrolling = Infinity
    this.codeEditor.getSession().setMode('ace/mode/javascript')
    this.codeEditor.setTheme('ace/theme/monokai')
    this.codeEditor.setOption('tabSize', 2)
    this.codeEditor.setOption('fontSize', 15)
    this.codeEditor.setOption('enableLiveAutocompletion', true)
    this.codeEditor.setOption('enableSnippets', true)
    const options = this.codeEditor.getOptions()
    this.codeEditor.clearSelection()
    this.codeEditor.getSession().setUseWorker(false)
    this.codeEditor.on('change', this.onChange)
    this.codeEditor.commands.addCommand({
      name: 'save',
      bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
      exec: () => {
        this.submit()
      }
    })
    let projectId = this.$route.query.pid as string
    if (this.isEdit) {
      const { data } = await getMockDetailApi(this.$route.query.id as string)
      this.mockData = data
      this.autoClose = true
      this.temp.url = this.mockData.url // remove /
      this.temp.mode = this.mockData.mode
      this.temp.method = this.mockData.method
      this.temp.description = this.mockData.description
      projectId = data.project
    }
    getProjectDetailApi(projectId).then(res => {
      this.project = res.data
      const url = location.origin + '/mock/' + this.project._id
      this.baseUrl = this.project.url === '/' ? url : url + this.project.url
    })
    this.$nextTick(() => {
      this.codeEditor.setValue(this.temp.mode)
      this.format()
    })
  }
  convertUrl(url: string) {
    const newUrl = '/' + url
    return newUrl === '/' ? '/' : newUrl.replace(/\/\//g, '/').replace(/\/$/, '')
  }
  format() {
    const context = this.codeEditor.getValue()
    let code = /^http(s)?/.test(context) ? context : jsBeautify.js_beautify(context, { indent_size: 2 })
    this.codeEditor.setValue(code)
  }
  onChange() {
    this.temp.mode = this.codeEditor.getValue()
  }
  close() {
    this.$router.replace(`/project/${this.project._id}`)
  }
  submit() {
    const mockUrl = this.convertUrl(this.temp.url)

    try {
      const value = new Function(`return ${this.temp.mode}`)() // eslint-disable-line
      if (!value) {
        this.$message.error(this.$t('p.detail.editor.submit.error[0]') as string)
        return
      } else if (typeof value !== 'object') {
        throw new Error()
      }
    } catch (error) {
      if (!/^http(s)?:\/\//.test(this.temp.mode)) {
        this.$message.error(error.message || this.$t('p.detail.editor.submit.error[1]'))
        return
      }
    }
    if (this.isEdit) {
      editMockApi(merge(cloneDeep(this.temp), { url: mockUrl, project: this.project._id, _id: this.mockData._id })).then(res => {
        this.$message.success(this.$t('p.detail.editor.submit.updateSuccess') as string)
        if (this.autoClose) this.close()
      })
    } else {
      createMockApi(merge(cloneDeep(this.temp), { url: mockUrl, project: this.project._id })).then(res => {
        this.$message.success(this.$t('p.detail.create.success') as string)
        this.close()
      })
    }
  }
  preview() {
    window.open(this.baseUrl + this.mockData.url + '#!method=' + this.mockData.method)
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/variable.scss';
.em-editor {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  overflow: hidden;
  .editor-wrapper {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
    font-family: Monaco, Menlo, 'Ubuntu Mono', Consolas, source-code-pro, monospace !important;
    .code-editor {
      height: 100%;
    }
  }
  .panel-wrapper {
    height: 100%;
    flex: 0 0 350px;
    overflow: hidden;
    align-items: center;
    background: $--em-color-primary;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 3px #000;
    .panel-info {
      h2 {
        width: 100%;
        color: #fff;
        font-size: 13px;
        text-align: center;
        padding: 6px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 30px;
        margin-bottom: 20px;
      }
      .editor-form {
        padding: 20px 20px 1px;
        background: #fff;
        box-shadow: 0 2px 3px #777;
        border-radius: 4px;
        margin-bottom: 20px;
        /deep/ .el-form {
          .el-select {
            width: 100%;
          }
          .el-form-item {
            margin-bottom: 0;
            &:last-child {
              margin-bottom: 20px;
            }
            .el-form-item__label {
              height: 30px;
              line-height: 30px;
            }
            .el-button {
              width: 100%;
            }
          }
        }
      }
      .editor-control {
        .switcher {
          border-radius: 4px;
          margin-bottom: 20px;
          color: $--em-color-white;
          box-shadow: 0 2px 3px $--em-color-shadow;
          font-size: 13px;
          ul {
            width: 100%;
            display: flex;
            li {
              background: #252d47;
              padding: 15px 0;
              flex: 1;
              text-align: center;
              cursor: pointer;
              transition: all 0.3s;
              &:last-child {
                border-radius: 0 5px 5px 0;
              }
              &:first-child {
                border-radius: 5px 0 0 5px;
              }
              &:hover {
                background: #364166;
              }
            }
          }
        }
      }
    }
  }
}
</style>
