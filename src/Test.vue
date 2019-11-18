<template>
  <div class="em-editor">
    <div class="editor-wrapper">
      <div ref="codeEditor" class="code-editor"></div>
    </div>
  </div>
</template>

<script>
import * as ace from 'brace'
import 'brace/mode/javascript'
import 'brace/theme/monokai'
import 'brace/ext/language_tools'
import 'brace/ext/searchbox'
export default {
  data() {
    return {
      codeEditor: null
    }
  },
  mounted() {
    this.codeEditor = ace.edit(this.$refs.codeEditor)
    this.codeEditor.getSession().setMode('ace/mode/javascript')
    this.codeEditor.setTheme('ace/theme/monokai')
    this.codeEditor.setOption('tabSize', 2)
    this.codeEditor.setOption('fontSize', 15)
    this.codeEditor.setOption('enableLiveAutocompletion', true)
    this.codeEditor.setOption('enableSnippets', true)
    const options = this.codeEditor.getOptions()
    console.log(options)
  }
}
</script>
<style>
.em-editor {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  overflow: hidden;
}
.editor-wrapper {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
}
.code-editor {
  height: 100%;
}
</style>
