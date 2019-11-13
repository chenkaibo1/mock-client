<template>
  <div class="em-home">
    <em-add :bottom="85" icon="fa fa-user-plus" color="red" @click.native="showGroupDialog=true"></em-add>
    <em-add @click.native="$router.push('/new')"></em-add>
    <em-placeholder :show="groups.length === 0">
      <i :class="['fa',  'fa-3x', {'fa-smile-o': !keyword} , {'fa-meh-o': keyword}]"></i>
      <p>{{keyword ? $tc('p.group.placeholder', 1) : $tc('p.group.placeholder', 2)}}</p>
    </em-placeholder>
    <em-header
      icon="users"
      :title="$t('p.group.header.title')"
      :description="$t('p.group.header.description')"
    ></em-header>
    <transition name="fade">
      <div class="group-list em-container">
        <div v-for="item in groups" :key="item._id">
          <!-- 检查 user.id 防止闪烁 -->
          <div
            class="group-item"
            @click="$router.push({path: '/', query: {type:'group',name: item.name,id: item._id}})"
          >
            <div class="group-collect">
              <transition name="zoom" mode="out-in">
                <i class="fa fa-users"></i>
              </transition>
            </div>
            <h2>{{item.name}}</h2>
            <div class="group-description item-common">{{item.description || emptyDesc}}</div>
            <div class="group-member item-common">
              <img :src="item.user.headImg" />
            </div>
            <el-button-group class="group-control">
              <el-button
                type="ghost"
                icon="el-icon-edit"
                size="small"
                class="control-item"
                @click.stop="editGroup(item)"
              ></el-button>
              <el-button
                type="ghost"
                icon="el-icon-delete"
                size="small"
                class="control-item"
                @click.stop="deleteGroup(item)"
              ></el-button>
            </el-button-group>
          </div>
        </div>
      </div>
    </transition>
    <el-dialog :visible.sync="showGroupDialog" :custom-class="'group-dialog'">
      <el-tabs v-model="activePane">
        <el-tab-pane
          :label="$tc('p.group.modal.tab.create', 0)"
          name="createGroup"
          :disabled="activePane === 'editGroup'"
        >
          <div class="pane-title">{{$tc('p.group.modal.tab.create', 1)}}:</div>
          <el-input
            v-model="group.name"
            size="small"
            :placeholder="$tc('p.group.modal.tab.create', 2)"
            ref="inputCreate"
          ></el-input>
        </el-tab-pane>
        <el-tab-pane
          :label="$tc('p.group.modal.tab.join', 0)"
          name="joinGroup"
          :disabled="activePane === 'editGroup'"
        >
          <div class="pane-title">{{$tc('p.group.modal.tab.join', 1)}}:</div>
          <el-input
            v-model="group.name"
            size="small"
            :placeholder="$tc('p.group.modal.tab.join', 2)"
          ></el-input>
        </el-tab-pane>
        <el-tab-pane
          :label="$tc('p.group.modal.tab.edit', 0)"
          name="editGroup"
          :disabled="activePane !== 'editGroup'"
        >
          <div class="pane-title">{{$tc('p.group.modal.tab.edit', 1)}}:</div>
          <el-input
            v-model="group.name"
            size="small"
            :placeholder="$tc('p.group.modal.tab.edit', 2)"
          ></el-input>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="showGroupDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
// @ts-ignore
import Clipboard from 'clipboard'
import { getProjectsApi, cloneProjectApi, deleteProjectApi } from '@/api/project'
import { createGroupApi, editGroupApi, joinGroupApi, getGroupListApi } from '@/api/group'
import { getItem } from '@/common/storage'
import { remove, cloneDeep, merge } from 'lodash'
@Component
export default class Group extends Vue {
  btnValue: string = '全部'
  activePane: string = 'createGroup'
  emptyDesc: string = ''
  groups: any[] = []
  group: any = {}
  user: any = {}
  showGroupDialog: boolean = false
  get keyword() {
    return this.$store.state.searchValue
  }
  @Watch('keyword')
  keywordChange(val: string) {
    getGroupListApi(val).then(res => {
      this.groups = res.data
    })
  }
  mounted() {
    this.user = JSON.parse(getItem('user'))
    this.emptyDesc = this.$t('p.project.emptyDesc') as string
    this.getGroupList()
  }
  getGroupList() {
    getGroupListApi(this.keyword).then(res => {
      this.groups = res.data
    })
  }
  editGroup(item: any) {
    this.showGroupDialog = true
    this.activePane = 'editGroup'
    this.group = item
  }
  deleteGroup(id: string) {}
  submit() {
    switch (this.activePane) {
      case 'createGroup':
        this.group.user = this.user.id
        createGroupApi(this.group).then(res => {
          const cloneData = cloneDeep(this.group)
          merge(cloneData, { _id: res.data._id, user: this.user })
          this.groups.push(cloneData)
          this.showGroupDialog = false
          this.group = {}
        })
        break
      case 'joinGroup':
        joinGroupApi(this.group).then(() => {
          this.showGroupDialog = false
          this.group = {}
        })
        break
      case 'editGroup':
        editGroupApi(this.group).then(() => {
          this.groups.forEach(item => {
            if (item._id === this.group._id) {
              item.name = this.group.name
            }
          })
          this.showGroupDialog = false
          this.group = {}
        })
        break
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variable.scss';
.em-home {
  width: 100%;
  height: 100%;
  .group-list {
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    .group-item {
      width: 225px;
      margin: 20px;
      background-color: $--em-color-white;
      padding: 0 14px 20px 14px;
      box-shadow: 0 1px 5px $--em-color-shadow-3;
      border-radius: 4px;
      transition: all 0.3s;
      position: relative;
      cursor: pointer;
      overflow: hidden;
      .group-collect {
        text-align: center;
        font-size: 26px;
        color: $--em-color-Auxiliary-8;
        margin: 10px 0;
      }
      h2 {
        font-weight: 700;
        font-size: $--em-fontSize14;
      }
      .item-common {
        padding: 10px;
        border: 1px solid $--em-border-color-base;
        border-radius: $--em-borderRadius44;
        margin-top: 10px;
        background-color: $--em-background-base;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .group-description {
        &::before {
          content: '';
          display: block;
          width: 20px;
          height: 2px;
          margin-bottom: 3px;
          background-color: $--em-color-Auxiliary-8;
        }
      }
      .group-member {
        img {
          width: 20px;
          height: 20px;
          display: block;
          border-radius: 4px;
          margin-right: 12px;
        }
      }
      .group-control {
        width: 100%;
        margin-top: 10px;
        .control-item {
          width: 50%;
        }
      }
    }
  }
}
/deep/ .group-dialog {
  width: 520px;
  border-radius: 6px;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 20px 20px 10px 20px;
    p {
      font-size: $--em-fontSize12;
      line-height: 18px;
      color: black;
    }
    .el-tab-pane {
      display: flex;
      align-items: center;
      .pane-title {
        min-width: 70px;
        height: 30px;
        line-height: 30px;
      }
    }
  }
}
</style>
