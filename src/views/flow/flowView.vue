<template>
  <div class="pageOverflow">
  	 <div style="padding:0 10px 0 10px;">
	 <el-row class="title_header1">
	    <el-col :span="24" style="text-align: center;padding: 7px 0px;background:#fff" class="el-icon-time"> {{beginTime}} 00:00:00 至 {{endTime}} 24:00:00</el-col>
	  </el-row>
	  </div>
	  <div class="title company_ip asset" style="height:80%;padding:20px 0 10px 20px;background:#fff;">
	   	 <div class="filter-container">
	        <section class="app-container">
				<el-row>
					<el-col :span="24">
						<el-form :inline="true" ref="form" :model="form">
			            <el-form-item>
			              <el-input placeholder="请输入IP" v-model="form.ip"></el-input>
			            </el-form-item>
			            <el-form-item>
			              <el-button type="primary" icon="el-icon-search" @click="searchItem">查询</el-button>
			            </el-form-item>
			          </el-form>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="2">
						<p class="f-t-12"><i class="i-lengend"></i>内网IP</p>
			            <p class="f-t-12"><i class="i-lengend ipw"></i>外网IP</p>
					</el-col>
					<el-col :span="22">
						<div>{{dataNone}}</div>
						<div id="flowView" v-loading="loadding" ref="flowView" style="width:96%;height:80%;overflow:hidden;margin:0 auto 10px auto;"></div>
					</el-col>
				</el-row>
	        </section>
	     </div>
	   </div>
	 </div>
</template>

<script>
import echarts from 'echarts'
import { getFlowData } from '../../api/flow/flowView.js'
import {dateFormatPrev} from '../../utils/time.js'

export default {
	data() {
		return {
			loadding: true,
			form: {
				ip: ''
			},
			charts: '',
			categories: [{name: '内网IP'},{name: '外网IP'}],
        	graph: [],
        	beginTime: dateFormatPrev(),
        	endTime:dateFormatPrev(),
        	dataNone: '',
		}
	},
	methods: {
		searchItem() {
			this.getData();
		},
		getData() {
			var that = this;
			var params = {
				'ip': this.form.ip
			}
			getFlowData(params).then(res => {

				if(res.result == undefined || res.result.length < 1 || res.result == null) {
					that.dataNone = "暂无数据";
					return false
				} else {
					that.dataNone = "";
				}

				var data = res.result;
				//数据
				that.graph = [];
				that.twoWay = [];
				var nodes = [], links = [];

			    //去重
			    var dataArr = [];

			    //数据填充
				for (var j = 0; j < data.length; j++) {
					
					//数据去重
					var flag1 = false, flag2 = false;
					for (var i in dataArr) {
						if (data[j].src == dataArr[i]) {
							flag1 = true;
							data[j]
						}
						if (data[j].dst == dataArr[i]) {
							flag2 = true;
						}
					}

					//源IP
					if (flag1 === false) {
						
						//内网IP or 外网IP
						var cName = "";
						if (data[j].localSrc === true) {
							cName = 0
						} else {
							cName = 1
						}
						var src = {
							category: cName, 
							name: data[j].src,
							value: data[j].connectionCount,
							symbolSize: 10,
		                    itemStyle: null,
		                    draggable: true
						}

						dataArr.push(data[j].src)
						nodes.push(src)
					}

					//目标IP
					if (flag2 === false) {

						//内网IP or 外网IP
						var cName = "";
						if (data[j].dst === true) {
							cName = 0
						} else {
							cName = 1
						}
						var det = {
							category: cName, 
							name: data[j].dst,
							value: data[j].connectionCount,
							symbolSize: 10,
		                    itemStyle: null,
		                    draggable: true
						}

						dataArr.push(data[j].dst)
						nodes.push(det)
					}
					

					//线
					var des1 = {};
					var isTWay = false;

					for (var k in data) {
						if (data[j].src == data[k].dst) {
							isTWay = true;
							des1 = {
							  "源IP": data[k].src,
		                      "目标IP": data[k].dst,
		                      "总流量": (data[k].totalBytes).toFixed(2)+'k',
		                      "平均流量": (data[k].avgBytes).toFixed(2)+'k',
		                      "时长": (data[k].totalDuration).toFixed(2)+'s',
		                      "连接数": (data[k].connectionCount).toFixed(2)
							}
						}
					}

					if (isTWay === true) {
						links.push({
		                    source: data[j].src,
		                    target: data[j].dst,
		                    isTwoWay: data[j].isTwoWay,
		                    des1: des1,
		                    des: {
		                      "源IP": data[j].src,
		                      "目标IP": data[j].dst,
		                      "总流量": (data[j].totalBytes).toFixed(2)+'k',
		                      "平均流量": (data[j].avgBytes).toFixed(2)+'k',
		                      "时长": (data[j].totalDuration).toFixed(2)+'s',
		                      "连接数": (data[j].connectionCount).toFixed(2)
		                    }
		                                
						})
					} else {
						links.push({
		                    source: data[j].src,
		                    target: data[j].dst,
		                    isTwoWay: data[j].isTwoWay,
		                    des: {
		                      "源IP": data[j].src,
		                      "目标IP": data[j].dst,
		                      "总流量": (data[j].totalBytes).toFixed(2)+'k',
		                      "平均流量": (data[j].avgBytes).toFixed(2)+'k',
		                      "时长": (data[j].totalDuration).toFixed(2)+'s',
		                      "连接数": (data[j].connectionCount).toFixed(2)
		                    }
		                                
						})
					}

					
					
				}

				that.graph.nodes = nodes;
				that.graph.links = links;


				console.log(that.graph.nodes)
				console.log(that.graph.links)
				that.setChart();
			})
			
		},
		setChart() {
			this.loadding = false;
			this.charts = echarts.init(document.getElementById('flowView'));
            this.charts.setOption({
		        title: {
		            text: '',
		            subtext: '',
		            top: 'bottom',
		            left: 'right'
		        },
		        tooltip: {
		        	formatter: function (params, ticket, callback) {
		        		//debugger
		        		var result = '';
		        		if (params.dataType == "edge" && params.data.des) {
		        			if (params.data.isTwoWay === true) {
		        				result += "<div class='fl'>"
		        				for (var i in params.data.des) {
			        				result += "<div>"+i+"："+params.data.des[i]+"&nbsp;</div>";
			        			}
			        			result += "</div><div class='fr'>"
			        			for (var i in params.data.des1) {
			        				result += "<div>"+i+"："+params.data.des1[i]+"&nbsp;</div>";
			        			}
			        			result += "</div>";
		        			} else {
		        				for (var i in params.data.des) {
			        				result += "<div>"+i+"："+params.data.des[i]+"</div>";
			        			}
		        			}
		        			
		        		} else if(params.dataType == "node") {
		        			result = params.name+"<div>关联IP："+params.data.value+"</div>";
		        		}
				   		return result
					}
				},
		        color: [ '#4a88a5', '#d48265', '#c23531', '#6e7074', '#d48265' ],
		        /*legend: [{
		            data: this.categories.map(function (a) {
		                return a.name;
		            })
		        }],*/
		        animation: false,
		        series : [
		            {
		                name: '',
		                type: 'graph',
		                layout: 'force',
		                data: this.graph.nodes,
		                links: this.graph.links,
		                categories: this.categories,
		                roam: true,
		                //focusNodeAdjacency: true,
		                label: {
		                    normal: {
		                    	show: false,
		                        position: 'right',
		                    }
		                },
		                force: {
		                    repulsion: 15, //距离 
		                    initLayout: 'circular', //环形布局
		                }
		            }
		        ]
		    })
		}
	},
	mounted() {
		this.$refs.flowView.style.height = document.documentElement.clientHeight - 230+'px';
		this.getData();
	}
}
</script>
<style>
	.i-lengend{display:inline-block;width:25px;height:13px;border-radius:3px;margin-bottom: -3px;margin-right: 3px;background:#4a88a5;}
	.ipw{background:#d48265;}
	.f-t-12{color:#5e6d82;font-size:12px;margin-top:8px;}
</style>