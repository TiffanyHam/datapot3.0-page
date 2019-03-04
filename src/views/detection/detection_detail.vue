<template>
  <div class="pageOverflow">

  <div class="title company_ip" style="padding:0;">
   	 <div class="filter-container">
        <section class="app-container">
        	<el-row class="detail-title">
	        	<el-col :span="20">
					尝试获取管理员权限
				</el-col>
				<el-col :span="4">
					<router-link :to="{path:'/host'}" class="fr" style="padding-right:20px;">< 返回</router-link>
				</el-col>
			</el-row>
			<div style="padding:15px;">
				<el-row>
					<el-col :span="7" class="d-p-lineheight">
						<p>{{ hostName }} <i class="el-icon-star-off"></i></p>
						<p>主机IP：{{ hostIP }}</p>
						<p>主机IP：{{ hostIP }}</p>
						<p>数据源：</p>
						<p>状态：</p>
						<p style="padding-top:10px;"><span><i class="el-icon-edit-outline"></i><el-button type="text" class="d-a-padd">标签</el-button></span>
						<span><i class="el-icon-edit-outline"></i><el-button type="text" class="d-a-padd">处理</el-button></span>
						<span><i class="el-icon-sold-out"></i><el-button type="text" class="d-a-padd">PCAPs</el-button></span></p>
					</el-col>
					<el-col :span="7">
						<div><img src="../../assets/images/threat/0.png" width="270" /></div>
					</el-col>
					<el-col :span="10">
						<div class="fr d-certainty-num">
							<p>可信度</p>
							<p class="num">0</p>
						</div>
						<div class="fr d-threat-num">
							<p>威胁度</p>
							<p class="num">0</p>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
					    <div style="height:30px;line-height: 30px;">
							流量上下行趋势：<el-button type="text" v-for='item in btn' :class="{'d-date': true,'d-a-visit':item.isCur}" @click="changeChart(item.index)">{{item.name}}</el-button>
						    <!-- <el-button type="text" class="d-a-visit d-date" @click="changeChart(1)">1天</el-button>
						    <el-button type="text"  class="d-date" @click="changeChart(2)">1周</el-button>
						    <el-button type="text"  class="d-a-visit d-date" @click="changeChart(3)">2周</el-button>
						     <el-button type="text" class="d-a-visit d-date" @click="changeChart(4)">1个月</el-button> -->
					    </div>
						<div id="dChart" ref="chart"></div>
					</el-col>
				</el-row>
			</div>
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
	          <div style="line-height:30px;">
	          	<span class="fl">主机状态：</span>
	          	<el-button type="primary" plain class="fl" :class="{'active': isA}" @click="isActive('0')">&nbsp;活动的&nbsp;</el-button>
	          	<el-button type="primary" plain class="fl" :class="{'active': isA}" @click="isActive('1')">非活动的</el-button>
	          	<span class="htbl-padd fl" @click="isRest"><i class="el-icon-refresh"></i><a href="javascript:;">重置过滤条件</a></span>
	          </div>
	        </el-col>
		    <!-- <el-col :span="12">
		    	<div class="fr">
		    				 <el-form :inline="true" ref="form" :model="form">
		            <el-form-item>
		              <el-input placeholder="请输入主机名" v-model="form.typeZh"></el-input>
		            </el-form-item>
		            <el-form-item>
		              <el-button type="primary" icon="el-icon-search" @click="searchItem">查询</el-button>
		            </el-form-item>
		          </el-form>
		        </div>
		    </el-col> -->
		  </el-row>
		  
		  <!--检测模式表-->
		  <div class="container_table">
          <el-table
            :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
            style="width: 100%" :height="tableHeight"
            :default-sort = "{prop: '', order: 'descending'}">
            <el-table-column
              prop="index"
              width="50"
              label="#">
               <template scope="scope">
                <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
              </template>
            </el-table-column>
			
			<el-table-column
              prop="detectionTags"
              label="标签"
              width="100">
            </el-table-column>


           <el-table-column
              prop="stage"
              label="威胁阶段" :filter-multiple="isFalse" :filters="stageFilter" filter-placement="bottom-end" column-key="stage" :filter-method="stageThreat" :formatter="stageFormatter">
            </el-table-column>

             <el-table-column
              prop="typeZh"
              label="威胁类型">
            </el-table-column>
			
			<el-table-column
              prop="threat"
              label="威胁度">
            </el-table-column>

			<el-table-column
              prop="certainty"
              label="可信度">
            </el-table-column>

			<el-table-column
              prop="detectTime"
              label="最近发现时间" :formatter="timeFormatter">
            </el-table-column>

             <el-table-column label="操作">
              <template slot-scope="scope">
                 <el-button type="text" class="btns" @click='dispost(scope.$index, scope.row)'>处理</el-button>
              </template>
            </el-table-column>

          </el-table>
          <el-pagination class="fy"
                         layout="prev, pager, next,total"
                         :current-page.sync = "currentPage"
                         @current-change="current_change"
                         :total="total"
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
 	import { gethostDatailPage } from '../../api/host/host.js'
 	import { timestampToTime } from '../../utils/time.js'


	export default {
		data() {
			return {
				hostIP: '',
				hostName: '',
				charts: '',
				certaintyData: [],
				threatData: [],
				timeData: [],
				isFalse: false,
	        	tableHeight: 100,
	        	stageFilter: [],
	        	currentPage: 1,
	        	total: 0,
	        	pagesize: 15,
	        	isA: true,
	        	form: {
	        		typeZh: ''
	        	},
	        	tableData: [],
	        	stageInfos: [],
	        	stageName: {},
	        	queryTime: 2,
				isKey: 0,
				btn:[{'name':'1天', 'index':1, 'isCur':true},
					{'name':'1周', 'index':2, 'isCur':false},
					{'name':'2周', 'index':3, 'isCur':true},
					{'name':'1个月', 'index':4, 'isCur':true}]
			}
		},
		methods: {
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
	        },
	    	//威胁阶段过滤
	    	stageThreat(value, row, column) {
		        const property = column['property'];
		        return row[property] === value;
		    },
		    //威胁阶段数字转中文
	    	stageFormatter(row, column) {
	    		var stage = this.stageName;
	    		for (var i in stage) {
					if (i == row[column['property']]) {
						return stage[i];
					}
	    		}
	    	},
	    	//时间戳转时间
	    	timeFormatter(row, column) {
	    		var data = row[column['property']];
	        		data = timestampToTime(data);
	        	return data;
	    	},
	    	isActive(num) {
	    		this.isA = !this.isA;
	    		//this.hostStatusReq = num;
	    		this.getDetecList();
	    	},
	    	/*isProperty() {

	    	},*/
	    	isRest() {

	    	},
	    	dispost() {

	    	},
	    	/*searchItem() {
	    		this.getDetecList();
	    	},*/
	    	changeChart(index) {
	    		this.queryTime = index;
	    		for (var i = 1; i <= this.btn.length; i++) {
	    			if (i == index) {
	    				this.btn[(i-1)].isCur = false
	    			} else {
	    				this.btn[(i-1)].isCur = true
	    			}
	    		}
	    		//var el = event.currentTarget;
	    		this.getDetecList();
	    	},
			getDetecList() {
				var that = this;
				var param = {
					'queryTime': this.queryTime, // 查询时间 1天（1）、1周（2）、2两（3）、1月（4）
				    'isKey': this.isKey,  // 是否是核心资产
				    'typeZh': this.form.typeZh,  // 威胁类型
				    'stage': 0, // 行为阶段
				    'sortName': 'DetectTime', //排序字段
				    'order': 'DESC', //排序（DESC、ASC）
				    'detectionTypes': '', //所有威胁类型
				    'hostIp': this.hostIP, 
				    'numPerPage': this.pagesize,
    			    'pageNum': this.currentPage
				}
				gethostDatailPage(param).then(res => {

					//清空
					that.certaintyData.length > 0 ? 
					that.certaintyData.splice(0, that.certaintyData.length) : ''

					that.threatData.length > 0 ? 
					that.threatData.splice(0, that.threatData.length) : ''

					that.timeData.length > 0 ? 
					that.timeData.splice(0, that.timeData.length) : ''

					//that.certaintyData.splice(0, that.certaintyData.length);
      				//that.threatData.splice(0, that.threatData.length);
      				//that.timeData.splice(0, that.timeData.length);
      				that.stageName = {};

					//折线图
					var dLine = res.result.detectionThreatLine;
	      			for(var i in dLine){
	      				that.certaintyData.push(dLine[i].certainty);
	      				that.threatData.push(dLine[i].threat);
	      				that.timeData.push(dLine[i].detectTime);
	      			}
					that.drawChart();

					//获取标签名
      				that.stageName = res.result.stageMap;
      				for (var i in that.stageName) {
	    				this.stageFilter.push({
		    			  value: i,
		                  text: that.stageName[i]
		    			});
	    			}

					//table
					that.tableData = res.result.infos.results;
					that.created();
					if (that.tableData.length >= 14) {
    					that.tableHeight = 400
    				}
				})
			},
			drawChart() {
			   this.charts = echarts.init(document.getElementById('dChart'));
               this.charts.setOption({
               		backgroundColor: '#fff',
				    //color:["rgba(35,96,168,0.7)","rgba(146,200,88,0.7)"],
				    tooltip : {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'line',
				            label: {
				                backgroundColor: '#ccc'
				            }
				        }
				    },
				    toolbox: {
				        show:false
				    },
				    legend: {
				        data: ['可信度', '威胁度'],
				        align: 'left',
				        left: 10,
				        top: 0
				    },
				    grid: {
				        left: '10px',
				        right: '20px',
				        bottom: '10px',
				        top: '30px',
				        containLabel: true,
				    },
				    xAxis : [
				        {
				            type : 'category',
				            boundaryGap : false,
				            data :this.timeData,
				            axisTick:{
				               show:false
				            },
				            axisLabel:{
				                show: true,
				                textStyle: {
				                    color: '#666'
				                }
				            },
				            axisLine: {
				            	lineStyle: {
				            		color: '#bde2f6'
				            	}
				            },
				            splitLine: {
								show: true,
								lineStyle: {
					                color: '#ccc'
					            }
							}
				        }, {
				        	 axisTick:{
				               show:false
				            },
				            axisLabel:{
				                show: false
				            },
				            axisLine: {
				            	lineStyle: {
				            		color: '#ccc'
				            	}
				            },
				            splitLine: {
								show: true
							}
				        }

				    ],
				    yAxis : [
				        {
				            show:true,
				            type : 'value',
				            splitLine:{
				                show:false
				            },
				            axisTick:{
				               show:false
				            },
				            axisLine: {
				            	lineStyle: {
				            		color: '#ccc'
				            	}
				            },
				            axisLabel:{
				                show: true,
				                textStyle: {
				                    color: '#666'
				                }
				            }
				        }
				    ],
				    series : [
				        {
				            name:'可信度',
				            type:'line',
				            stack: '总量',
				            //symbol:'none',
				            smooth: true,
				            symbol: 'circle',
				            symbolSize: 5,
				            showSymbol: false,
				            data:this.certaintyData, //可信度
				            areaStyle:{
				                normal:{
				                    color:{
				                        type:'linear',
				                        x:0,
				                        y:0,
				                        x2:0,
				                        y2:1,
				                        colorStops:[{
				                            offset:0,
				                            color:'#f9eedf',
				                        },{
				                            offset:1,
				                            color:'#f9eedf',
				                        }]
				                    },
				                    shadowColor: '#f9eedf',
				                    shadowBlur: 10
				                }
				            },
				            itemStyle: {
				                normal: {
				                    color: '#f9eedf',
				                    borderColor: '#f9eedf',
				                    borderWidth: 12
				                }
				            }
				        },
				        {
				            name:'威胁度',
				            type:'line',
				            stack: '总量',
				            data:this.threatData, //威胁度
				            //symbol:'none',
				            smooth: true,
				            symbol: 'circle',
				            symbolSize: 5,
				            showSymbol: false,
				            areaStyle:{
				                normal:{
				                    color:{
				                        type:'linear',
				                        x:0,
				                        y:0,
				                        x2:0,
				                        y2:1,
				                        colorStops:[{
				                            offset:0,
				                            color:'#bde2f6',
				                        },{
				                            offset:1,
				                            color:'#bde2f6',
				                        }]
				                    },
				                    shadowColor: 'rgba(0, 0, 0, 0.1)',
				                    shadowBlur: 10
				                }
				            },
				            itemStyle: {
				                normal: {
				                    color: '#bde2f6',
				                    borderColor: '#bde2f6',
				                    borderWidth: 12
				                }
				            }
				        }
				    ]
               
				})
			}
		},
		mounted() {
			//hostIP
			this.hostIP = this.$route.params.hostIP;
			this.hostName = this.$route.params.hostName;
			
			//echart width and height
			this.$refs.chart.style.width = (`${document.documentElement.clientWidth}`-240)+'px';
			this.$refs.chart.style.height = '200px';

			//初始化页面
			this.getDetecList();
			
		}
	}
 </script>
 <style>
 </style>