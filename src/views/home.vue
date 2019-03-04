<template>
  　　<div class="content">
          <div ref="navContainer" class="nav-container fl" style="width:180px">
            <vNav></vNav>
          </div>
          <div ref="conContainer" class="con-container fl">
            <vHead></vHead>
            <vTags></vTags>
            <keep-alive>
              <router-view v-if="!isRouterAlive"></router-view>
            </keep-alive>
            <router-view v-if="isRouterAlive"></router-view>
          </div>
  　　</div>
</template>

<script>
  import vNav from '../components/nav.vue'
  import vHead from '../components/header.vue'
  import vTags from '../components/tags.vue'

  export default {
    name: 'app',
    provide() {
      return {
        reload: this.reload,
        reHdd: this.reHdd
      }
    },
    data () {
      return {
        clientHeight: '',
        clientWidth: '',
        isRouterAlive: false
      }
    },
    mounted(){
      this.clientHeight = document.documentElement.clientHeight
      this.clientWidth = document.documentElement.clientWidth

      const that = this;
      window.onresize = () => {
          return (() => {
              that.clientHeight = document.documentElement.clientHeight;
              that.clientWidth = document.documentElement.clientWidth;
          })()
      }
    },
    watch: {
      // 如果 `clientHeight` 发生改变，这个函数就会运行
     clientHeight: function (val) {
        this.changeFixed(val)
      },
      clientWidth: function (val) {
        this.changeWidth(val)
      },
      $route(to, from) {
        this.isRouterAlive = this.$route.meta.keepAlive
      }
    },
    methods:{
      changeFixed(h){
        this.$refs.navContainer.style.height = h+'px';
        this.$refs.conContainer.style.height = h+'px';
      },
      changeWidth(w) {
        this.$refs.conContainer.style.width = (w - 180)+'px';
      },
      //设置页面是否需要缓存
      reload() {
        this.isRouterAlive = false
        this.$nextTick(function() {
          this.isRouterAlive = this.$route.meta.keepAlive
        })
      },
      //需要缓存的页面刷新后重新缓存
      reHdd() {
        this.$route.meta.keepAlive = false;
        this.isRouterAlive = false;
      }

    },
    components: { vHead, vNav, vTags }
  }
</script>

<style>
.vBb{
  color:#666;font-size:12px;background:none;text-align:center;
}
</style>
