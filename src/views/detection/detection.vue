<template>
	<div class="pageOverflow">
		<div class="title company_ip">
	   	 <div class="filter-container">
	        <section class="app-container">
				<el-row>
					<el-col :span="24">
					    <div style="height:30px;line-height: 30px;">
						   <!--  <el-button type="text" class="d-a-visit d-date">1天</el-button>
						   <el-button type="text" class="d-date">1周</el-button>
						   <el-button type="text" class="d-date d-a-visit">2周</el-button>
						   <el-button type="text" class="d-date d-a-visit">1个月</el-button> -->

						    <el-button type="text" v-for='item in month' :class="{'d-date': true,'d-a-visit':item.isCur}" @click="changeChart(item.index)">{{item.name}}</el-button>
					    </div>
						<div id="dChart" ref="chart"></div>
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
		        <el-col :span="12">
		          <div style="line-height:30px;">
		          	<!-- <el-button type="primary" plain class="fl active">待处理</el-button>
		          	<el-button type="primary" plain class="fl">白名单</el-button>
		          	<el-button type="primary" plain class="fl">已修复</el-button> -->

					<el-button type="primary" plain v-for="i in btn" :class="{'fl': true, 'active': i.isActive}" @click="changeStatus(i.index)">{{i.name}}</el-button>

		          	<span class="htbl-padd fl" @click="isProperty"><i class="el-icon-star-off"></i><a href="javascript:;">仅显示核心资产</a></span>
		          	<span class="htbl-padd fl" @click="isRest"><i class="el-icon-refresh"></i><a href="javascript:;">重置过滤条件</a></span>
		          </div>
		        </el-col>
			    <el-col :span="12">
			    	<div class="fr">
					 <el-form :inline="true" ref="form" :model="form">
			            <el-form-item>
			              <el-input placeholder="请输入主机名" v-model="form.hostNameQ"></el-input>
			            </el-form-item>
			            <el-form-item>
			              <el-button type="primary" icon="el-icon-search" @click="searchItem">查询</el-button>
			            </el-form-item>
			          </el-form>
			        </div>
			    </el-col>
			  </el-row>

			  <!--检测模式表-->
			  <div class="container_table">
	          <el-table
	            :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
	            style="width: 100%" :height="tableHeight"
	            :default-sort = "{prop: '', order: ''}">
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
	              width="100"
	              label="标签">
	            </el-table-column>

	            <el-table-column
	              prop="stage"
	              width="150"
	              label="威胁阶段" :filter-multiple="isFalse" :filters="stageFilter" filter-placement="bottom-end" column-key="stage" :filter-method="stageThreat" :formatter="stageFormatter">
	            </el-table-column>

	             <el-table-column
	              prop="typeZh"
	              label="威胁类型">
	              <template scope="scope">
						<router-link :to="{name:'detectionDetail', params: { hostName: scope.row.hostName }}"
					    class="d-a-title" style="color:#409EFF;padding:0;">{{ scope.row.typeZh }}</router-link>
	              </template>
	            </el-table-column>


	            <el-table-column
	              prop="hostName"
	              label="主机名">
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
	import { getDectecPage, getDectecChart } from '../../api/detection/detection.js'
	import { timestampToTime } from '../../utils/time.js'

	export default{
		data() {
			return {
				isFalse: false,
	        	tableHeight: 100,
	        	stageFilter: [],
	        	currentPage: 1,
	        	total: 0,
	        	pagesize: 15,
	        	form: {
	        		hostNameQ: ''
	        	},
	        	tableData: [],
	        	stageInfos: [],
	        	timeArr: [], //chart时间数组
	        	sypData: [], //chart侦查
				throughData: [], //chart突破
				controlData: [], //chart控制
				attackData: [], //chart攻击
				time: '2',
				dealStatusQ: 0,
				isKeyQ: '',
				month:[{'name':'1天', 'index':1, 'isCur':true},
					   {'name':'1周', 'index':2, 'isCur':false},
					   {'name':'2周', 'index':3, 'isCur':true},
					   {'name':'1个月', 'index':4, 'isCur':true}],

				btn: [{'name':'待处理', 'index':0, 'isActive': true},
					  {'name':'白名单', 'index':1, 'isActive': false},
					  {'name':'已修复', 'index':2, 'isActive': false}]
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
		    getStageColor(i) {
		    	var result = "";
		    	switch(i) {
		    		case '1':
		    			result = 't-z';
		    			break;
		    		case '4':
		    			result = 't-k';
		    			break;
		    		case '6':
		    			result = 't-t';
		    			break;
		    		case '7':
		    			result = 't-j';
		    			break;
		    	}
		    	return result;
		    },
		    //威胁阶段数字转中文
	    	stageFormatter(row, column) {
	    		var stage = this.stageInfos;
	    		for (var i in stage) {
					if (i == row[column['property']]) {
						//var color = this.getStageColor(i);
						//var span = '<span class="'+color+'">'+stage[i]+'</span>';
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
	    	searchItem() {
	    		this.getDetecList();
	    	},
	    	changeStatus(index){
	    		this.dealStatusQ = index;
	    		for (var i = 0; i < this.btn.length; i++) {
	    			if (i == index) {
	    				this.btn[i].isActive = true
	    			} else {
	    				this.btn[i].isActive = false
	    			}
	    		}
	    		this.getDetecList();
	    	},
	    	changeChart(index) {
	    		this.queryTime = index;
	    		for (var i = 1; i <= this.month.length; i++) {
	    			if (i == index) {
	    				this.month[(i-1)].isCur = false
	    			} else {
	    				this.month[(i-1)].isCur = true
	    			}
	    		}
	    		this.getDetecList();
	    		this.drawData();
	    	},
	    	isProperty() {
	    		this.isKeyQ == '' ? this.isKeyQ == '1' : this.isKeyQ == ''
	    		this.getDetecList();
	    	},
	    	isRest() {
	    		this.dealStatusQ = 0;
				this.isKeyQ = '', // 是否核心资产
				this.form.hostNameQ = '', // 主机名
				this.time = '2'; // 查询时间范围
		     	this.pagesize = 15; //每页显示条目数
		     	this.currentPage = 1; //当前页目
		     	this.getDetecList();
	    	},
	    	getDetecList() {
	    		var that = this;
	    		var param = {
	    			'stageQ': '',
	    			'dealStatusQ': this.dealStatusQ,
	    			'isKeyReq': '',
	    			'isKeyQ': this.isKeyQ,
	    			'hostNameQ': this.form.hostNameQ,
	    			'typeZhQ': '',
	    			'sortName': 'Threat',
	    			'order': 'DESC',
	    			'time': this.time,
	    			'numPerPage': this.pagesize,
    				'pageNum': this.currentPage
	    		}
	    		getDectecPage(param).then(res => {
	    			that.tableData = res.result.info.results;
	    			that.created();
	    			if (that.tableData.length >= 14) {
	    				that.tableHeight = 400
	    			}
	    			that.stageInfos = res.result.stages;
	    			for (var i in that.stageInfos) {
	    				this.stageFilter.push({
		    			  value: i,
		                  text: that.stageInfos[i]
		    			});
	    			}
	    		})
	    	},

	    	//chart
	    	drawData() {
	    	  var that = this;
    		  var param = {
    			'stageQ': '',
    			'dealStatusQ': this.dealStatusQ,
    			'isKeyReq': '',
    			'isKeyQ': this.isKeyQ,
    			'hostNameQ': this.form.hostNameQ,
    			'typeZhQ': '',
    			'sortName': 'Threat',
    			'order': 'DESC',
    			'time': this.time,
    			'numPerPage': this.pagesize,
				'pageNum': this.currentPage
    		  }
	    	  getDectecChart(param).then(res => {
	    	  		var data = res;
	    	  		var result = {};
	    	  		that.timeArr.length > 0 ? that.timeArr.splice(0, that.timeArr.length) : ''

					for(var x in data.result.info){
						var map = data.result.info[x];
						for(var m in map){
							if(result[m]){
								var list = result[m];
								list.push(map[m].num);
							} else {
								var list = [];
								list.push(map[m].num);
								result[m] = list;

							}
						}
						// 获取时间数组
						for(var m in map){
							that.timeArr.push(map[m].time);
							break;
						}
					}

					// 配置参数
					for (var j in result) {
						if (j == '1'){
							that.sypData = result[j];
						} else if (j == '4'){
							that.throughData = result[j];
						} else if (j == '6'){
							that.controlData = result[j];
						}  else if (j == '7'){
							that.attackData = result[j];
						}
					}

					that.drawChart();

	    	  })

	    	},
	    	drawChart() {
	    		  this.charts = echarts.init(document.getElementById('dChart'));
		    	  this.charts.setOption({
				    tooltip: {
				        trigger: 'axis',
				        axisPointer: {
				        	type: 'line',
				        	label: {
								backgroundColor: '#6a7985'
							}
				        }
				    },
				    legend: {
				        data: ['侦查', '突破', '控制', '攻击'],
				        align: 'left',
				        left: 100,
				        top: 0
				    },
				    grid: {
				    	left: '2%',
						right: '2.1%',
						bottom: '10px',
						top: '30px',
				        containLabel: true
				    },
				    xAxis: [{
				        type: 'category',
				        boundaryGap: false,
						axisTick: {
							show: false
						},
						axisLabel: {
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
						},
				        data: this.timeArr
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
			        }],
				    yAxis: [{
				    	name: '单位（千）',
				        type: 'value',
				        axisTick: {
				            show: false
				        },
				        //name: '检测数量',
						//nameLocation: 'middle',
						//nameTextStyle: {
							//color: '#919294'
						//},
						//nameGap: 15,
						type: 'value',
						splitLine: {
							show: false
						},
						axisLine: {
			            	lineStyle: {
			            		color: '#ccc'
			            	}
			            },
						axisLabel: {
							show: true,
							textStyle: {
								color: '#666'
							},
							formatter: function(value) {
								return value/1000
							}
						}
				    }],
				    series: [
				    {
				        name: '侦查',
				        type: 'line',
				        smooth: true,
				        symbol: 'circle',
				        symbolSize: 1,
				        showSymbol: false,
				        lineStyle: {
				            normal: {
				                width: 1
				            }
				        },
				        itemStyle: {
				            normal: {
				                color: '#43b8f5',
				                borderColor: '#43b8f5',
				                borderWidth: 12
				            }
				        },
				        data: this.sypData
				    }, {
				        name: '突破',
				        type: 'line',
				        smooth: true,
				        symbol: 'circle',
				        symbolSize: 1,
				        showSymbol: false,
				        lineStyle: {
				            normal: {
				                width: 1
				            }
				        },
				        itemStyle: {
				            normal: {
				                color: '#ffcd3c',
				                borderColor: '#ffcd3c',
				                borderWidth: 12

				            }
				        },
				        data: this.throughData
				    }, {
				        name: '控制',
				        type: 'line',
				        smooth: true,
				        symbol: 'circle',
				        symbolSize: 1,
				        showSymbol: false,
				        lineStyle: {
				            normal: {
				                width: 1
				            }
				        },
				        itemStyle: {
				            normal: {
				                color: '#ff8309',
				                borderColor: '#ff8309',
				                borderWidth: 12
				            }
				        },
				        data: this.controlData
				    },
				    {
				        name: '攻击',
				        type: 'line',
				        smooth: true,
				        symbol: 'circle',
				        symbolSize: 1,
				        showSymbol: false,
				        lineStyle: {
				            normal: {
				                width: 1
				            }
				        },
				        itemStyle: {
				            normal: {
				                color: '#d81e06',
				                borderColor: '#d81e06',
				                borderWidth: 12
				            }
				        },
				        data: this.attackData
				    }]
				})
	    	}
		},
		mounted() {
			//echart width and height
			this.$refs.chart.style.width = (`${document.documentElement.clientWidth}`-240)+'px';
			this.$refs.chart.style.height = '230px';

			//绘制图表
			this.drawData();

			//初始化table
			this.getDetecList();
		}
	}
</script>
<style>

</style>
