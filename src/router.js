import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    linkActiveClass: 'active',
    // 路由配置
    routes: [
      {
        path: '/',
        redirect: '/panorama'
      },
      {
        path: '/',
        component: resolve => require(['./views/home.vue'], resolve),
        children:[
          {
            path: '/panorama',
            component: resolve => require(['./views/panorama/panorama.vue'], resolve),
            meta: { title: '态势感知', requireAuth: true, keepAlive: false, isKeepAlive: 0}
          }, {
            path: '/dashboard',
            name: 'dashboard',
            component: resolve => require(['./views/dashboard/dashboard.vue'], resolve),
            meta: { title: '仪表盘', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          }, {
            path: '/coreAssets',
            name: 'coreAssets',
            component: resolve => require(['./views/dashboard/coreAssets.vue'], resolve),
            meta: { title: '仪表盘', requireAuth: true, keepAlive: true, isKeepAlive: 1 }
          }, {
            path: '/overview',
            name: 'overview',
            component: resolve => require(['./views/dashboard/overview.vue'], resolve),
            meta: { title: '仪表盘', requireAuth: true, keepAlive: true, isKeepAlive: 1 }
          },
          {
            path: '/company_ip',
            component: resolve => require(['./views/setting/company_ip.vue'], resolve),
            meta: { title: '内部IP设置', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/snort_rules',
            component: resolve => require(['./views/setting/snort_rules.vue'], resolve),
            meta: { title: '静态过滤规则', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/snort_classtype',
            component: resolve => require(['./views/setting/snort_classtype.vue'], resolve),
            meta: { title: '静态告警类型', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/detection_type',
            component: resolve => require(['./views/setting/detection_type.vue'], resolve),
            meta: { title: '威胁类型', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/job_config',
            component: resolve => require(['./views/setting/job_config.vue'], resolve),
            meta: { title: '定时任务', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/initialise',
            component: resolve => require(['./views/setting/initialise.vue'], resolve),
            meta: { title: '初始化', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/set_parameter',
            component: resolve => require(['./views/setting/set_parameter.vue'], resolve),
            meta: { title: '设置参数', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/snort_alert',
            component: resolve => require(['./views/manage/snort_alert.vue'], resolve),
            meta: { title: '威胁告警', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/mailNotifier',
            component: resolve => require(['./views/manage/mailNotifier.vue'], resolve),
            meta: { title: '邮件提醒', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },
          {
            path: '/white_ips',
            component: resolve => require(['./views/manage/white_ips.vue'], resolve),
            meta: { title: 'IP白名单' , requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },
          {
            path: '/white_port',
            component: resolve => require(['./views/manage/white_port.vue'], resolve),
            meta: { title: '端口白名单' , requireAuth: true, keepAlive: false, isKeepAlive: 0  }
          },{
            path: '/user_account',
            component: resolve => require(['./views/manage/user_account.vue'], resolve),
            meta: { title: '账号管理', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/sys_group',
            component: resolve => require(['./views/manage/sys_group.vue'], resolve),
            meta: { title: '权限配置', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/sys_office',
            component: resolve => require(['./views/manage/sys_office.vue'], resolve),
            meta: { title: '公司架构', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/sys_op_log',
            component: resolve => require(['./views/manage/sys_op_log.vue'], resolve),
            meta: { title: '系统日志', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/host_tages',
            component: resolve => require(['./views/manage/host_tages.vue'], resolve),
            meta: { title: '资产标签', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/host',
            name:'host',
            component: resolve => require(['./views/host/host.vue'], resolve),
            meta: { title: '威胁检测', requireAuth: true, keepAlive: true, isKeepAlive: 1 }
          },{
            path: '/hostDetailDetec',
            name: 'hostDetailDetec',
            component: resolve => require(['./views/host/host_detailDetec.vue'], resolve),
            meta: { title: '威胁检测(检测模式)', requireAuth: true, keepAlive: true, isKeepAlive: 1 }
          },{
            path: '/host_detailRele',
            name: 'hostDetailRele',
            component: resolve => require(['./views/host/host_detailRele.vue'], resolve),
            meta: { title: '威胁检测(关联模式)', requireAuth: true, keepAlive: true, isKeepAlive: 1 }
          },{
            path: '/detectionDetail',
            name: 'detectionDetail',
            component: resolve => require(['./views/host/detection_detail.vue'], resolve),
            meta: { title: '威胁检测(检测详情)', requireAuth: true, keepAlive: true, isKeepAlive: 1 }
          },{
            path: '/asset_host',
            name: 'asset_host',
            component: resolve => require(['./views/asset/asset_host.vue'], resolve),
            meta: { title: '主机管理', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/asset_task',
            name: 'asset_task',
            component: resolve => require(['./views/asset/asset_task.vue'], resolve),
            meta: { title: '扫描任务', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/asset_log',
            name: 'asset_log',
            component: resolve => require(['./views/asset/asset_log.vue'], resolve),
            meta: { title: '扫描记录', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/asset_info',
            name: 'asset_info',
            component: resolve => require(['./views/asset/asset_info.vue'], resolve),
            meta: { title: '资产详情', requireAuth: true, keepAlive: true, isKeepAlive: 1 }
          },{
            path: '/reports',
            name: 'reports',
            component: resolve => require(['./views/reports/reports.vue'], resolve),
            meta: { title: '报告', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/holeScan',
            component: resolve => require(['./views/securityHole/holeScan.vue'], resolve),
            meta: { title: '漏洞扫描', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/holeManage',
            component: resolve => require(['./views/securityHole/holeManage.vue'], resolve),
            meta: { title: '漏洞列表', requireAuth: true, keepAlive: false,  isKeepAlive: 0 }
          },{
            path: '/holeTask',
            component: resolve => require(['./views/securityHole/holeTask.vue'], resolve),
            meta: { title: '扫描任务', requireAuth: true, keepAlive: false,  isKeepAlive: 0  }
          },{
            path: '/holeLog',
            component: resolve => require(['./views/securityHole/holeLog.vue'], resolve),
            meta: { title: '扫描记录', requireAuth: true, keepAlive: false,  isKeepAlive: 0  }
          },{
            path: '/holeDasebase',
            component: resolve => require(['./views/securityHole/holeDasebase.vue'], resolve),
            meta: { title: '漏洞库', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/holeScanInfo',
            name: 'holeScanInfo',
            component: resolve => require(['./views/securityHole/holeScanInfo.vue'], resolve),
            meta: { title: '漏洞详情', requireAuth: true, keepAlive: true, isKeepAlive: 1 }
          },{
            path: '/flowView',
            component: resolve => require(['./views/flow/flowView.vue'], resolve),
            meta: { title: '流量视图', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/summarize',
            component: resolve => require(['./views/flow/summarize.vue'], resolve),
            meta: { title: '今日总览', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/analyzeFlow',
            component: resolve => require(['./views/flow/analyzeFlow.vue'], resolve),
            meta: { title: 'HTTP流量分析', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/flowFrom',
            component: resolve => require(['./views/flow/flowFrom.vue'], resolve),
            meta: { title: '流量追溯', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/information',
            component: resolve => require(['./views/info/information.vue'], resolve),
            meta: { title: '威胁情报', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/infiltrate-test',
            component: resolve => require(['./views/infltrate/test.vue'], resolve),
            meta: { title: '系统测试', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/infiltrate-detail',
            name: 'infiltrate-detail',
            component: resolve => require(['./views/infltrate/detail.vue'], resolve),
            meta: { title: '系统测试详情', requireAuth: true, keepAlive: true, isKeepAlive: 1 }
          },{
            path: '/infiltrate-web',
            name: 'infiltrate-web',
            component: resolve => require(['./views/infltrate/webTest.vue'], resolve),
            meta: { title: 'web渗透测试', requireAuth: true, keepAlive: false, isKeepAlive: 0 }
          },{
            path: '/infiltrate-wHole',
            name: 'infiltrate-wHole',
            component: resolve => require(['./views/infltrate/wHole.vue'], resolve),
            meta: { title: 'web渗透测试（漏洞信息）', requireAuth: true, keepAlive: true, isKeepAlive: 1 }
          },{
            path: '/infiltrate-wInfo',
            name: 'infiltrate-wInfo',
            component: resolve => require(['./views/infltrate/wInfo.vue'], resolve),
            meta: { title: 'web渗透测试（报告详情）', requireAuth: true, keepAlive: true, isKeepAlive: 1 }
          }
        ]
      },
      {
          path: '/login',
          component: resolve => require(['./views/login.vue'], resolve),
          meta: { title: 'login', requireAuth: false, keepAlive: false }
      }, {
          path: '*',
          redirect: '/404'
      }, {
          path: '/404',
          component: resolve => require(['./views/404.vue'], resolve),
          meta: { title: '404', requireAuth: false, keepAlive: false },
      }

    ]
})

