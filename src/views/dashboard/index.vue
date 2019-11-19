<template>
  <div class="em-dashboard">
    <em-header
      :spots="6"
      icon="tachometer"
      :title="$t('p.dashboard.header.title')"
      :description="$t('p.dashboard.header.description')"
    ></em-header>
    <div class="em-container content">
      <el-row :gutter="20">
        <el-col :span="12">
          <transition name="fadeLeft">
            <div class="dashboard-item dashboard-item-key">
              <h2>
                <i class="fa fa-bar-chart"></i>
                {{$tc('p.dashboard.total.mockUse', 1)}}
              </h2>
              <p class="number">
                <count-to :value="total.mockUseCount"></count-to>
                <span>{{$tc('p.dashboard.total.mockUse', 2)}}</span>
              </p>
            </div>
          </transition>
        </el-col>
        <el-col :span="6">
          <transition name="fadeRight">
            <div class="dashboard-item">
              <h2>
                <i class="fa fa-cube"></i>
                {{$tc('p.dashboard.total.project', 1)}}
              </h2>
              <p class="number">
                <count-to :value="total.projectCount"></count-to>
                <span>{{$tc('p.dashboard.total.project', 2)}}</span>
              </p>
            </div>
          </transition>
        </el-col>
        <el-col :span="6">
          <transition name="fadeRight">
            <div class="dashboard-item">
              <h2>
                <i class="fa fa-link"></i>
                {{$tc('p.dashboard.total.mock', 1)}}
              </h2>
              <p class="number">
                <count-to :value="total.mockCount"></count-to>
                <span>{{$tc('p.dashboard.total.mock', 2)}}</span>
              </p>
            </div>
          </transition>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <transition name="fadeLeft">
            <div class="dashboard-item dashboard-item-key">
              <em-spots :size="6"></em-spots>
              <h2>
                <i class="fa fa-user"></i>
                {{$tc('p.dashboard.total.user', 1)}}
              </h2>
              <p class="number">
                <count-to :value="total.userCount"></count-to>
                <span>{{$tc('p.dashboard.total.user', 2)}}</span>
              </p>
            </div>
          </transition>
        </el-col>
        <el-col :span="12">
          <transition name="fadeRight">
            <div class="dashboard-item">
              <em-spots :size="6"></em-spots>
              <h2>
                <i class="fa fa-user-plus"></i>
                {{$tc('p.dashboard.today.user', 1)}}
              </h2>
              <p class="number">
                <count-to :value="today.userCount"></count-to>
                <span>{{$tc('p.dashboard.today.user', 2)}}</span>
              </p>
            </div>
          </transition>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <transition name="fadeLeft">
            <div class="dashboard-item dashboard-item-key">
              <h2>
                <i class="fa fa-star"></i>
                {{$tc('p.dashboard.today.mockUse', 1)}}
              </h2>
              <p class="number">
                <count-to :value="today.mockUseCount"></count-to>
                <span>{{$tc('p.dashboard.today.mockUse', 2)}}</span>
              </p>
            </div>
          </transition>
        </el-col>
        <el-col :span="6">
          <transition name="fadeRight">
            <div class="dashboard-item">
              <h2>
                <i class="fa fa-cube"></i>
                {{$tc('p.dashboard.today.project', 1)}}
              </h2>
              <p class="number">
                <count-to :value="today.projectCount"></count-to>
                <span>{{$tc('p.dashboard.today.project', 2)}}</span>
              </p>
            </div>
          </transition>
        </el-col>
        <el-col :span="6">
          <transition name="fadeRight">
            <div class="dashboard-item">
              <h2>
                <i class="fa fa-link"></i>
                {{$tc('p.dashboard.today.mock', 1)}}
              </h2>
              <p class="number">
                <count-to :value="today.mockCount"></count-to>
                <span>{{$tc('p.dashboard.today.mock', 2)}}</span>
              </p>
            </div>
          </transition>
        </el-col>
      </el-row>
      <transition name="fadeUp">
        <div class="dashboard-users">
          <el-row>
            <el-col :span="6">
              <em-spots :size="6"></em-spots>
              <div class="users-title">
                <i class="fa fa-quote-right"></i>
              </div>
            </el-col>
            <el-col :span="18">
              <el-row :gutter="10" style="padding: 0 10px;">
                <el-col :span="2" v-for="(item, i) in users" :key="i">
                  <img :src="item.headImg" :title="item.nick_name" />
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// @ts-ignore
import CountTo from 'vue-count-to'
@Component({
  components: {
    CountTo
  }
})
export default class dashboard extends Vue {
  total: number = 123
  today: any = {}
  users: any[] = []
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/variable.scss';
.em-dashboard {
  .content {
    margin: 20px auto;
    .dashboard-item {
      width: 100%;
      background: #fff;
      box-shadow: 0 2px 3px #eee;
      border-radius: 4px;
      margin-bottom: 20px;
      padding: 20px;
      position: relative;
      h2 {
        font-weight: 500;
        font-size: 16px;

        i {
          font-size: 26px;
          vertical-align: bottom;
          margin-right: 6px;
        }
      }

      .number {
        font-size: 32px;

        span:last-child {
          font-size: 22px;
          margin-left: 10px;
        }
      }
    }
    .dashboard-users {
      width: 100%;
      background: $--em-color-white;
      box-shadow: 0 2px 3px $--em-color-shadow;
      border-radius: 4px;
      margin-bottom: 20px;
      position: relative;
      .users-title {
        height: 190px;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        color: $--em-color-text-middle;
        font-size: 36px;
        text-align: center;
        line-height: 190px;
      }
      img {
        display: block;
        width: 50px;
        height: 50px;
        border-radius: 4px;
        margin-top: 10px;
      }
    }
    .dashboard-item-key {
      background-image: linear-gradient(45deg, $--em-color-primary, $--em-color-white);
      color: $--em-color-white;
      box-shadow: 0 2px 3px $--em-color-text-Level-link;
    }
  }
}
</style>
