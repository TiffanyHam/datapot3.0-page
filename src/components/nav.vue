<template>
  <div class="left_nav" id="navBox" ref="nav">
   <div class="logo a-center">
      <img src="../assets/images/logo.png"/>
    </div>
    <div ref="menuUL" style="width:100%;margin-top:73px;">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="isCollapse" unique-opened router style="height:auto;padding-bottom:30px;">
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
            </template>
            <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
              {{ subItem.title }}
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
    <div class="vBrn">
      <p><a href="javascript:;" @click="about">关于我们</a></p>
      <p>版本号：V3.1</p>
    </div>
    </div>


    <!--关于我们-->
    <el-dialog
      title="关于我们"
      :visible.sync="aboutdialogVisible"
      width="385px">
      <div class="about">
          <div class="ab-title">
            <el-row>
              <el-col :span="4">
                  <img src="../assets/images/panorama/datapot.png"  width="50" class="fr" />
              </el-col>
              <el-col :span="20">
                 <p class="ab-t-text"> DataPot AIS智能安全分析平台</p>
              </el-col>
            </el-row>
          </div>
          <div>
            <el-row>
                <el-col :span="24">版本号：V3.1</el-col>
            </el-row>
            <el-row>
                <el-col :span="24">版权所有：深圳市众泰兄弟科技发展有限公司</el-col>
            </el-row>
          </div>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="aboutdialogVisible = false">知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getMenu, getSecondMenus } from '../api/menu.js'

  export default {
    data() {
      return {
        aboutdialogVisible: false,
        isCollapse: false,
        items: [
        ]
      };
    },
    computed:{
      onRoutes(){
        return this.$route.path.replace('/','');
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      about() {
        this.aboutdialogVisible = true;
      },
      setItem(menuId) {
        var result = {}
        switch(menuId) {
          case 20:
              result = {
                id: menuId,
                icon: 'el-icon-panor',
                index: 'panorama',
                title: '态势感知'
              }
            break;
          case 56:
              result = {
                id: menuId,
                icon: 'el-icon-flow',
                index: 'flow',
                title: '流量分析',
                subs: [
                  {
                    index: 'flowView',
                    title: '流量视图'
                  },
                  {
                    index: 'summarize',
                    title: '今日总览'
                  },
                  {
                    index: 'analyzeFlow',
                    title: 'HTTP流量分析'
                  },
                  {
                    index: 'flowFrom',
                    title: '流量追溯'
                  }
                ]
              }
            break;
            case 90:
              result = {
                id: menuId,
                icon: 'el-icon-dash',
                index: 'dashboard',
                title: '仪表盘'
              }
            break;
            case 91:
              result = {
                id: menuId,
                icon: 'el-icon-detec',
                index: 'host',
                title: '威胁检测'
              }
            break;
            /*case 91:
              result = {
                id: menuId,
                icon: 'el-icon-host',
                index: 'host',
                title: '主机安全'
              }
            break;
            case 92:
              result = {
                id: menuId,
                icon: 'el-icon-detec',
                index: 'detection',
                title: '威胁检测'
              }
            break;*/
            case 114:
              result = {
                id: menuId,
                icon: 'el-icon-asset',
                index: 'asset',
                title: '资产管理',
                subs: [
                   {
                    index: 'asset_host',
                    title: '主机管理'
                  },
                   /*{
                    index: 'asset_task',
                    title: '扫描任务'
                  },*/
                   {
                    index: 'asset_log',
                    title: '扫描记录'
                  }
                ]
              }
            break;
            case 119:
              result = {
                id: menuId,
                icon: 'el-icon-bug',
                index: 'securityHole',
                title: '漏洞管理',
                subs: [
                  {
                    index: 'holeScan',
                    title: '漏洞扫描'
                  },{
                    index: 'holeManage',
                    title: '漏洞列表'
                  },{
                    index: 'holeTask',
                    title: '扫描任务'
                  },{
                    index: 'holeLog',
                    title: '扫描记录'
                  },{
                    index: 'holeDasebase',
                    title: '漏洞库'
                  }]
              }
            break;
            case 93:
              result = {
                id: menuId,
                icon : 'el-icon-report',
                index : 'reports',
                title: '报告'
              }
            break;
            case 94:
              result = {
                id: menuId,
                icon: 'el-icon-manage',
                index: 'manage',
                title: '后台管理',
                subs: [
                  {
                    index: 'snort_alert',
                    title: '威胁告警'
                  },{
                    index: 'mailNotifier',
                    title: '邮件提醒'
                  },
                  {
                    index: 'white_ips',
                    title: 'IP白名单'
                  },
                  {
                    index: 'white_port',
                    title: '端口白名单'
                  }, {
                    index: 'user_account',
                    title: '账号管理'
                  }, {
                    index: 'sys_group',
                    title: '权限配置'
                  },{
                    index: 'sys_office',
                    title: '公司架构'
                  }, {
                    index: 'sys_op_log',
                    title: '系统日志'
                  }, {
                    index: 'host_tages',
                    title: '资产标签'
                  }
                ]
              }
            break;
            case 95:
              result = {
                id: menuId,
                icon: 'el-icon-sys',
                index: 'system',
                title: '系统设置',
                subs: [
                    {
                      index: 'company_ip',
                      title: '内部IP设置'
                    },{
                      index: 'snort_rules',
                      title: '静态过滤规则'
                    }, {
                      index: 'snort_classtype',
                      title: '静态告警类型'
                    }, {
                      index: 'detection_type',
                      title: '威胁类型'
                    },{
                      index: 'job_config',
                      title: '定时任务'
                    }, {
                      index: 'initialise',
                      title: '初始化'
                    }, {
                      index: 'set_parameter',
                      title: '设置参数'
                    }
                  ]
              }
            break;
          case 122:
              result = {
                id: menuId,
                icon : 'el-icon-infltrate',
                title: '渗透测试',
                subs: [
                    {
                      index : 'infiltrate-test',
                      title: '系统渗透测试'
                    },
                    {
                      index : 'infiltrate-web',
                      title: 'WEB渗透测试'
                    }
                ]
              }
            break;
          case 123:
              result = {
                id: menuId,
                icon : 'el-icon-view',
                index : 'information',
                title: '威胁情报'
              }
            break;

          }

          return result
      },
      getMenuList() {
        const that = this;
        getMenu('').then(res => {
            const menuList = []
            for(var i = 0; i < res.result.length; i++) {
              var id = res.result[i].menuId
              var temp = that.setItem(id);
              if (JSON.stringify(temp) != '{}') {
                menuList.push(temp);
              }

            }
            that.items = menuList;
            //通过menuID获取二级菜单
            //this.getSecondMenusList()
        })
      }
    },
  	mounted() {
       //设置高度
  	   var ch = document.documentElement.clientHeight;
  	   this.$refs.nav.style.height = (ch - 50)+'px';
       this.$refs.menuUL.style.height = ((ch - 50)-165)+'px';
       //获取导航菜单
       this.getMenuList()
  	}
  }
</script>

<style>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 100%;
    min-height: 400px;
  }
  .el-menu-item, .el-submenu{
    width:100%;
    text-align:left;
    margin:0;
  }
  .el-menu-item, .el-submenu__title, .el-submenu .el-menu-item{
    height:40px;
    line-height:40px;
  }
  .el-submenu .el-menu-item{
    min-width:100%;
  }
  .el-menu-item:hover, .el-submenu .el-submenu__title:hover, .el-menu-item:focus{
    background:rgb(49,56,62);
    color:#409EFF;
  }

  .el-menu{
    border-right:0;
  }
  .el-menu, .left_nav{
    background:rgb(60,71,77);
  }
  .el-menu.el-menu--inline{
    background:rgb(49,56,62);
  }
  .el-menu-item, .el-submenu__title{
    color:rgb(196,196,196);
  }
  .el-menu-item-group__title{
    padding:0;
  }
  .left_nav{
    height:100%;
  }
  .about{
    padding:0 20px;line-height: 30px;
  }
  .ab-title{
    border-bottom:1px solid #f1f1f1;margin-bottom:10px;padding-bottom:10px;
  }
  .ab-t-text{
    margin:0 10px;font-size:16px;line-height:50px;color:#000;
  }
  .vBrn{
    color: #a1a1a1;
    width: 70%;
    text-align: center;
    background: rgb(60,71,77);
    padding: 26px 0 8px 0;
    border-top: 1px solid #535353;
    margin: 0 auto;
  }
  .vBrn p{
    line-height: 20px;font-size:10px;
  }
  .vBrn a{
    color:#a1a1a1;font-size:14px;
  }
  .vBrn a:hover{
    color:#409EFF;
  }
</style>
