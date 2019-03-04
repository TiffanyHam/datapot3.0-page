<template>
  <div class="tags" ref="tagsCon" v-if="showTags">
    <el-row>
    <el-col :span="22">
    <ul ref="tageUL">
      <!--显示tages-->
      <li class="tags-li" :title="item.title" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
        <router-link :to="item.path" class="tags-li-title">
          {{item.title}}
        </router-link>
        <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close" v-if="index > 0"></i></span>
      </li>
       <!--下拉tags-->
       <li class="tags-li" v-show="hideTagesLi" style="padding:0;">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link tags-icon">
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><a href="javascript:;" @click="otherClose">关闭其他</a></el-dropdown-item>
              <el-dropdown-item v-for="(item,index) in hideTages">
                  <a href="javascript:;" @click="setHideTags(item.path, index)">{{item.title}}</a>
                  <span class="tags-li-icon" @click="closeTagsHide(index)"><i class="el-icon-close"></i></span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
       </li>
       
    </ul>
    </el-col>

    <!-- <div class="tags-close-box">
      <el-dropdown @command="handleTags">
            <el-button size="mini" round icon="el-icon-delete">关闭</el-button>
        <el-dropdown-menu size="small" slot="dropdown">
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div> -->
    <el-col :span="2">
     <div class="tags-li refresh">
       <a href="javascript:;" @click="reFresh" class="tags-icon" title="刷新当前页"><i class="el-icon-refresh" style="color:#409EFF;"></i> 刷新</a>
     </div>
    </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    inject: ['reload', 'reHdd'],
    data() {
      return {
        tagsList: [],
        hideTages: [],
        hideTagesLi: true
      }
    },
    methods: {
      isActive(path) {
        return path === this.$route.path;
      },
      //刷新当前页
      reFresh() {
        
        var keepAlive = this.$route.meta.keepAlive
        if (keepAlive === false) {
          this.$route.meta.keepAlive = true
        }
        this.reload();
        //this.$router.go(0)
        
      },
      //关闭标签
      setHideTags(path, index) {
        var newIndex = this.hideTages[index];
        var hideIndex = this.tagsList[(this.tagsList.length-1)];

        this.tagsList.splice((this.tagsList.length-1), 1, newIndex);
        this.hideTages.splice(index, 1, hideIndex);
        //this.hideTages.splice(index, 1);
        this.$router.push(newIndex.path);
      
      },
      closeTagsHide(index) {
        if (this.hideTages.length > 0) {
            this.hideTages.splice((this.hideTages.length-1), 1);
        }
      },
      // 关闭单个标签
      closeTags(index) {
        /*const delItem = this.tagsList.splice(index, 1)[0];
        const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
        if (item) {
          delItem.path === this.$route.path && this.$router.push(item.path);
        }else{
          this.$router.push('/');
        }*/

        
        //set keepAlive 关闭时恢复需要缓存的页面
        //页面需缓存
        var keepAlive = this.$route.meta.keepAlive;
        var isKeepAlive = this.$route.meta.isKeepAlive;
        if (keepAlive === true && isKeepAlive == 0) {
          this.$route.meta.keepAlive = false;
          this.reHdd();
        }

        //set tags
        if (this.hideTages.length > 0) {
           //取hideTages最后一项替换tagsList最后一项并且删除hideTages最后一项
            var newIndex = this.hideTages[(this.hideTages.length-1)];
            this.tagsList.splice((this.tagsList.length-1), 1, newIndex);
            this.hideTages.splice((this.hideTages.length-1), 1);
            this.$router.push(newIndex.path);
            
        } else {
          //this.hideTagesLi = false;
          const delItem = this.tagsList.splice(index, 1)[0];
          const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
          if (item) {
            delItem.path === this.$route.path && this.$router.push(item.path);
          }else{
            this.$router.push('/');
          }
        }
        
      },
      otherClose() {
        const curItem = this.tagsList.filter(item => {
          return item.path === this.$route.path;
        })
        this.tagsList = curItem;
        //this.hideTagesLi = false;
        this.hideTages = [];
      },
     /* // 关闭全部标签
      closeAll(){
        this.tagsList = [];
        this.$router.push('/');
      },
      // 关闭其他标签
      closeOther(){
        const curItem = this.tagsList.filter(item => {
          return item.path === this.$route.path;
        })
        this.tagsList = curItem;
      },*/
      // 设置标签
      setTags(route){

        /*const isExist = this.tagsList.some(item => {
          return item.path === route.path;
        })*/
        //set keepAlive每次进入时状态为缓存
        var keepAlive = this.$route.meta.keepAlive;
        var isKeepAlive = this.$route.meta.isKeepAlive;
        //页面需缓存
        if (keepAlive === true && isKeepAlive == 0) {
          this.$route.meta.keepAlive = false;
          this.reHdd();
        }
        

        //set tag
        var isExist = false;
        for (var item in this.tagsList) {
            if (this.tagsList[item].path === route.path) {
              isExist = true;
            }
        }
        for (var item in this.hideTages) {
            if (this.hideTages[item].path === route.path) {
              isExist = true;
            }
        }

        if (route.meta.title && !isExist) {
          this.tagsList.push({
            title: route.meta.title,
            path: route.path
          })

          var dw = this.$refs.tagsCon.clientWidth
          var uw = this.$refs.tageUL.clientWidth
          if ((uw + 200) >= dw) {
            //this.hideTagesLi = true;
            for (var i in this.tagsList) {
              if (route.path == this.tagsList[i].path) {
                this.hideTages.push({
                  title: this.tagsList[i-1].title,
                  path: this.tagsList[i-1].path
                })
                this.tagsList.splice(i-1, 1);
              }
            }
          }


        }


      },
      handleTags(command){
        command === 'other' ? this.closeOther() : this.closeAll();
      }
    },
    computed: {
      showTags() {
        return true
        //return this.tagsList.length > 0;
      }
    },
    watch:{
      $route(newValue, oldValue){
        this.setTags(newValue);
      }
    },
    created(){
      //this.setTags(this.$route);
    },
    mounted() {
      this.setTags(this.$route);
    }
  }
</script>

<style>
  .tags {
    /*width:40%; 
    background:yellow;*/
    position: relative;
    /* height: 30px; */
    height: 29px;
    overflow: hidden;
    /*background: rgb(242,242,242);
	border-bottom: 1px solid #ccc;
    padding-right: 120px;*/
    
  }

  .tags ul {
    box-sizing: border-box;
    width: auto;
    height: auto;
    float: left;
  }

  .tags-li {
    float: left;
    margin: 0;
    font-size: 12px;
    overflow: hidden;
    cursor: pointer;
    height: 28px;
    line-height: 28px;
    border-bottom: 1px solid #e9eaec;
    border-right: 1px solid #e9eaec;
   /*  padding: 0 5px 0 12px; */
    padding: 0 5px;
    vertical-align: middle;
    color: #666;
    -webkit-transition: all .3s ease-in;
    -moz-transition: all .3s ease-in;
    transition: all .3s ease-in;
  }

  .tags-li:not(.active):hover {
    background: #f8f8f8;
  }

  .tags-li.active {
    color: red;
    background:#fff;
	border-bottom: 1px solid #1296db;
  }

  .tags-li-title {
    float: left;
    max-width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 5px;
    color: #666;
  }

  .tags-li.active .tags-li-title {
    color: #333;
  }

  .tags-close-box {
    position: absolute;
    right: 9px;
    top: 1px;
    box-sizing: border-box;
    /* padding-top: 1px; */
    text-align: center;
    height: 30px;
    /*width: 110px;
      box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);*/
    z-index: 10;
  }
  .tags-close-box .el-button{
    background:rgb(236,245,255);
  }
  .tags-icon{
    background:#fff;
    padding:0 5px;
    width:100%;
    height:100%;
    display:block;
  }
  .refresh{
    padding: 0px;
    border-left: 1px solid rgb(233, 234, 236);
    border-top: 1px solid rgb(233, 234, 236);
    float: right;
    height: 23px;
    line-height: 23px;
    margin:2px 10px 0 0;
  }
  .refresh a{
    padding:0 8px;
  }
  </style>
