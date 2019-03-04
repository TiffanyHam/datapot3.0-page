<template>
<div class="pageOverflow">

  <div class="title company_ip" style="padding:0;">
   	 <div class="filter-container">
        <section class="app-container">
        	<el-row class="detail-title">
	        	<el-col :span="20" class="detail-title">
        					<router-link :to="{name:'hostDetailDetec',params:{ host:host }}" class="d-a-title" >检测模式</router-link>|

              <router-link :to="{name:'hostDetailRele',params:{ host: host }}" class="d-a-title" style="color:#409EFF;">关联模式</router-link>
				    </el-col>
            <el-col :span="4">
              <router-link :to="black" class="fr" style="padding-right:20px;">< 返回</router-link>
            </el-col>
			     </el-row>
    			<el-row>
    	        	<el-col :span="24">
    	        		<div class="fr" style="padding:20px 20px 10px 0;">
    						<ul class="gradeInfo">
    							<li class="g-s"></li><li class="g-l"></li><li class="g-m"></li><li class="g-a"></li>
    							<li class="g-h"></li>
    						</ul>
    						<ul class="gradeMsg">
    							<li>安全</li><li>低危</li><li>中危</li><li>高危</li><li>严重</li>
    						</ul>
    					</div>
    	        	</el-col>
    			</el-row>
    			<el-row>
	        	<el-col :span="24">
	        		<div ref="circleCon" style="position: relative;width: 100%;height:300px;">
                <!--中心圆-->
						    <div class="r-center">
                    <el-button type="danger" icon="el-icon-main" circle></el-button>
                </div>
                <!--ips-->
                 <div v-for="(item,index) in ips" class="hostPoint anmationPoint" @click="pointerSinge(item, $event)" :style="{'top':item.top+'px', 'left':item.left+'px'}">
                    <a href="javascript:;" class="roundBg round_m posRe roundBgc_1" :style="{'background': item.color}">
                       <template v-if="index==71">
                            <i>...</i>
                       </template>
                       <template v-else>
                            <i v-if="item.isKey==1" class="star_i"></i>
                            <i v-else class="host_i"></i>
                       </template>

                    </a>
                  </div>
                <!--lines-->
                <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <line v-for="i in lines" stroke-linecap="null" stroke-linejoin="null" id="" :y2="i.y2" :x2="i.x2" :y1="i.y1" :x1="i.x1" fill-opacity="null" stroke-opacity="null" stroke-width="1" stroke="#ccc" fill="none"></line>
                </svg>

                <!--弹窗-->
                <div v-show="dialogFormVisible" id="chartDialog" class="chartDialog" ref="chartDialog" :style="{'top':maskPointer.ntop+'px','left':maskPointer.nleft+'px', 'z-index': 99}">
                    <el-row>
                     <el-col :span="24">
                        <el-button type="text" icon="el-icon-close" @click="close" class="fr"></el-button>
                     </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <p style="clear: both;">
                          <span class="fl">主机名：{{maskPointer.externalIpName}}</span>
                          <i v-if="maskPointer.isKey==1" class="star_i fl"></i>
                          <i v-else class="host_i fl"></i>
                        </p>
                        <p style="clear: both;">主机IP：{{maskPointer.externalIp}}</p>
                        <p>发送数据：{{maskPointer.outDataSum}}</p>
                        <p>接受数据：{{maskPointer.inDataSum}}</p>
                        <p  v-for="(s,index) in maskPointer.stage">
                          <span v-if="index==1"><span class="t-icon t-z">侦查</span> {{s}}</span>
                          <span v-if="index==2"><span class="t-icon t-z">武装</span> {{s}}</span>
                          <span v-if="index==3"><span class="t-icon t-z">投递</span> {{s}}</span>
                          <span v-if="index==4"><span class="t-icon t-k">突破</span> {{s}}</span>
                          <span v-if="index==5"><span class="t-icon t-z">安装</span> {{s}}</span>
                          <span v-if="index==6"><span class="t-icon t-t">控制</span> {{s}}</span>
                          <span v-if="index==7"><span class="t-icon t-j">攻击</span> {{s}}</span>
                        </p>
                      </el-col>
                      <el-col :span="12">
                          <div class="fl d-circler-con">
                              <p>威胁度</p>
                              <div class="d-circler-num">{{maskPointer.threat}}</div>
                          </div>
                          <div class="fl d-circler-con">
                              <p>可信度</p>
                              <div class="d-circler-num">{{maskPointer.certainty}}</div>
                          </div>
                      </el-col>
                    </el-row>
                </div>
					     </div>
	        	</el-col>
	        </el-row>

		</section>
	</div>
  </div>

  <!--table-->
  <div class="title company_ip" style="margin-bottom:100px;">
   	 <div class="filter-container">
        <section class="app-container host">
		  <!--工具条-->
		  <el-row>
		    <el-col :span="24">
			 <el-form :inline="true" ref="form" :model="form">
	            <el-form-item>
	              <el-input placeholder="请输入主机名" v-model="form.hostName"></el-input>
	            </el-form-item>
	            <el-form-item>
	              <el-button type="primary" icon="el-icon-search" @click="searchItem">查询</el-button>
	            </el-form-item>
	          </el-form>
		    </el-col>
		  </el-row>

		  <!--检测模式表-->
		  <div class="container_table flowTabs">
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            :default-sort = "{prop: '', order: ''}">
            <el-table-column
              prop=""
              label="#"
              width="50">
               <template scope="scope">
                <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
              </template>
            </el-table-column>

			     <el-table-column
              prop="externalIp"
              :formatter="fmtLength"
              label="连接主机"
              width="120">
            </el-table-column>

            <el-table-column label="数据传输" align="center">
                <el-table-column
                  prop=""
                  label="流入" align="center" width="300">
                  <template slot-scope="scope">
                    <div class="fl">
                        <div class="fl" style="width:100px;text-align: center;">{{scope.row.inDataSize}} GB</div>
                        <div class="fl" style="width:150px;position: relative;top:5px;">
                        <el-progress :show-text="false" :stroke-width="10" :percentage="scope.row.inDataSize" status="text"></el-progress>
                        </div>
                    </div>
                </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="流出" align="center" width="300">
                  <template slot-scope="scope">
                    <div class="fl">
                        <div class="fl" style="width:150px;position: relative;top:5px;">
                         <el-progress :show-text="false" :stroke-width="10" :percentage="scope.row.outDataSize" status="text" color="rgba(142, 113, 199, 0.7)"></el-progress>
                        </div>
                        <div class="fl"  style="width:100px;text-align: center;">{{scope.row.outDataSize}} GB</div>
                    </div>
                  </template>
                </el-table-column>
            </el-table-column>

           <el-table-column
              prop="hostIsKey"
              :formatter="fmtLength"
              label="当前主机"
              width="120">
            </el-table-column>

			     <el-table-column
              prop="protocal"
              :formatter="fmtLength"
              label="协议"
              width="100">
            </el-table-column>

             <el-table-column
              prop="port"
              :formatter="fmtLength"
              label="端口">
            </el-table-column>

          </el-table>
          <el-pagination class="fy"
                         layout="prev, pager, next,total"
                         :current-page.sync = "currentPage"
                         @current-change="current_change"
                         :total="total" :page-size="pagesize"
                         background
           >
           </el-pagination>
           </div>
        </section>
      </div>
  </div>

  </div>
  </template>

  <script>
  import echarts from 'echarts'
  import { timestampToTime } from '../../utils/time.js'
  import { getContactPage, getContactChart } from '../../api/host/host.js'

  export default {
    data() {
        return {
          black: '',
          host: '',
        	hostIP: '',
          hostName: '',
          hostStatus: '',
          hostThreatId: '',
        	isFalse: false,
        	tableHeight: 100,
        	stageFilter: [],
        	currentPage: 1,
        	total: 0,
        	pagesize: 10,
        	form: {
        		hostName: ''
        	},
        	tableData: [],
          ips: [],
          dialogVisible: true,
          //pointerArr: [], //图表对应点
          lines: [], //对应线
          maskPointer: {}, //弹窗点
          dialogFormVisible: false,
        }
    },
    methods: {
      fmtLength(row, column){
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          return arr
        }
      },
    	  tableRowClassName({row, rowIndex}) {
          if (rowIndex === 0) {
            return 'th';
          }
          return '';
        },
        created() {
          this.total = this.tableData.length;
        },
        current_change(currentPage) {
          this.currentPage = currentPage;
          this.getContactPageFun();
        },
      	searchItem() {
           this.hostName = this.form.hostName;
           this.pagesize = 15;
           this.currentPage = 1;
           this.getContactPageFun();
           this.drawChart();
      	},
        getContactPageFun() {
          var that = this;
          var param = {
            'hostThreatId': this.hostThreatId,
            'hostName': this.form.hostName || this.hostName,
            'numPerPage': this.pagesize,
            'pageNum': this.currentPage
          }
          getContactPage(param).then(res => {

            that.tableData = res.result.results;
            that.total = res.result.totalCount;
            for (var i in that.tableData) {
              that.tableData[i].inDataSize = Number(that.tableData[i].inDataSize);
              that.tableData[i].outDataSize = Number(that.tableData[i].outDataSize);
            }
            //that.created();
            if (that.tableData.length >= 1) {
                that.tableHeight = 400
            }
            /*that.tableData = [{
              externalIp: '192.168.10.111',
              inDataSize: 100,
              outDataSize: 80,
              hostIsKey: '1',
              protocal: '11111',
              port: '8080'
            },{
              externalIp: '192.168.10.111',
              inDataSize: 90,
              outDataSize: 50,
              hostIsKey: '1',
              protocal: '11111',
              port: '8080'
            }]*/
          })
        },
        drawChart() {

          var that = this;
          var param = {
            'hostThreatId': this.hostThreatId, //3605
            'hostName': this.hostName //'网站服务器'
          }
          getContactChart(param).then(res => {
             that.ips = res.result.infos;
             for (var i in that.ips) {
               var color = that.ips[i].color;
               switch(color) {
                  case 0:
                    that.ips[i].color = '#8a8a8a';
                    break;
                  case 1:
                    that.ips[i].color = '#1296db';
                    break;
                  case 2:
                    that.ips[i].color = '#f4ea2a';
                    break;
                  case 3:
                    that.ips[i].color = '#ff8309';
                    break;
                  case 4:
                    that.ips[i].color = '#ee1029';
                    break;
               }
             }
             that.drawCircleDot();
          })
        },
        drawCircleDot() {

          //中心点横坐标
          var dotLeft = (this.$refs.circleCon.clientWidth-40)/2;
          //中心点纵坐标
          var dotTop = (this.$refs.circleCon.clientHeight-40)/2;
           //起始角度
           var stard = 0;
           //半径
           var radius = 120;
           //每一个BOX对应的角度;
           var length = this.ips.length;
           var avd = 360/24;
           if (length < 24){
             avd = 360/length;
           }
           //每一个BOX对应的弧度;
           var ahd = avd*Math.PI/180;
           var line = ''; //圆心点到指定位置的直线
           var maxCount = 24;//一圈最大数量
           var count = 0;

           for (var i in this.ips) {
                if (i > 71) {
                  this.ips.splice(i, 1);
               } else {
                   count++;
                   if (count > maxCount){
                     count = 1;
                     radius = radius + 32;
                   }

                  var left = Math.sin((ahd*count))*radius+dotLeft;
                  var top = Math.cos((ahd*count))*radius+dotTop;

                  this.ips[i].top = (top-5);
                  this.ips[i].left = (left-5);
                  this.ips[i].x = left;
                  this.ips[i].y = top;

                  this.lines.push({
                    index: i,
                    y1: (dotTop+5),
                    x1: (dotLeft+5),
                    y2: (top+5),
                    x2: (left+5)
                  })
               }
           }

        },
        close() {
          this.maskPointer = {};
          this.dialogFormVisible = false;
        },
        pointerSinge(obj, event) {

          var data = obj;
          var otop = ((event.pageY-10) - (this.$refs.circleCon.getBoundingClientRect().top));
          var oleft = ((event.pageX-10) - (this.$refs.circleCon.getBoundingClientRect().left));
          if (oleft > (this.$refs.circleCon.clientWidth - 400)) {
            oleft = (this.$refs.circleCon.clientWidth - 400);
            otop = otop + 20;
          } else if(oleft <= 20) {
            oleft = 20
          } else {
            oleft = oleft + 20;
          }

          this.maskPointer = data;
          this.maskPointer['ntop'] = otop;
          this.maskPointer['nleft'] = oleft;


          this.dialogFormVisible = true;
        },
        saveHostIP() {

              //返回按钮
              var balceLink = '';
              this.$route.params.black == undefined ? balceLink = localStorage.getItem('black') : balceLink = this.$route.params.black;
              this.black = {path : balceLink};
              localStorage.setItem('black', balceLink);

              /*this.$route.params.host == undefined ? this.host = localStorage.getItem('host') : this.host = this.$route.params.host;
              localStorage.setItem('host', this.host);
              if (this.$route.params.host == undefined) {
                var host = localStorage.getItem('host');
                this.host = JSON.parse(host); //由JSON字符串转换为JSON对象
              } else {
                this.host = this.$route.params.host;
                var host = JSON.stringify(this.host);
                localStorage.setItem('host', host);
              }

              this.hostIP = this.host.hostIP;
              this.hostName = this.host.hostName;
              this.hostStatus = this.host.hostStatus;
              this.hostThreatId = this.host.hostThreatId;*/

              if (this.$route.params.host) {
                this.host = this.$route.params.host;
                localStorage.setItem('hostInfo', JSON.stringify(this.host));
              } else {
                var obj = localStorage.getItem('hostInfo');
                obj = JSON.parse(obj);
                this.host = obj;
              }

              this.hostIP = this.host.hostIp;
              this.hostName = this.host.hostName;
              this.hostStatus = this.host.hostStatus;
              this.hostThreatId = this.host.hostThreatId;

              //初始化数据表格
              this.getContactPageFun();

              //初始化图表
              this.drawChart();

        }

    },
    mounted() {
      //hostIP
      this.saveHostIP();
    }
}
</script>

<style>

</style>
