<template>
<div class="pageOverflow" style="height:90%;overflow:hidden;">
  <el-row>
		<el-col :span="24"><router-link :to="{path : '/infiltrate-test'}" class="fr"  style="margin:0 20px 0 0;">< 返回</router-link>
		</el-col>
	</el-row>
  <div class="title company_ip" style="width:98%;height:96%;padding:0;overflow:hidden;">
   	 <div class="filter-container">
        <section class="app-container" v-loading="loading">
			<div>
	        	<el-row>
					<el-col :span="4">
						<vue-scroll :ops="ops">
						<div ref="portNameList" class="pNameList">
							<div style="width:100%;padding-bottom:40px;">
					          <ul>
								<li v-for="(item,index) in tableData">
									<i :class="index == scorllIndex ? 'd-nav on':'d-nav'"></i>
									<a href="javascript:;" :class="index == scorllIndex ? 'on' : '' " @click="setPortItem(index)">端口{{item.target.port}}</a>
									<div v-if="index != (tableData.length-1)" :class="index == scorllIndex ? 'd-nav-border on':'d-nav-border'"></div>
								</li>
					          </ul>
					        </div>
					        </div>
					     </vue-scroll>
					</el-col>
					<el-col :span="20">
					    <div ref="portList" id="portList">
					    	<vue-scroll :ops="ops" @handle-scroll="handleScroll" ref="portScroll">
							<div class="d-conbox" style="background:#f9f9f9;">
								<el-row>
									<el-col :span="24">
										<el-button type="primary" class="fr" style="height:30px;position: relative;top:-10px;right:-10px;" @click="exportData">导出</el-button>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="6">
										<div class="dc-info">
											<p style="color:#409EFF;">目标IP：{{infltrate.target_ip}}</p>
											<p>端口数：{{count.port_count}}</p>
											<p>渗透模块数：{{count.exploit_count}}</p>
											<!-- <p>目标机器数：1100</p>
											<p>攻击载荷模块数：11000</p> -->
										</div>
									</el-col>
									<el-col :span="18">
										<el-row>
											<el-col :span="5">
												<div :class="portStatus==''? 'd-model on' : 'd-model'" @click="firterStatus('')">
													<img src="../../assets/images/infltrate/all.png" width="80"/>
													<p>全部：{{totalCount}}</p>
												</div>
											</el-col>
											<el-col :span="5">
												<div :class="portStatus=='failure'? 'd-model on' : 'd-model'" @click="firterStatus('failure')">
													<img src="../../assets/images/infltrate/n-1.png" width="80"/>
													<p>未突破：{{count.failure_report}}</p>
												</div>
											</el-col>
											<el-col :span="5">
												<div :class="portStatus=='bingo'? 'd-model on' : 'd-model'" @click="firterStatus('bingo')">
													<img src="../../assets/images/infltrate/n-2.png" width="80"/>
													<p>突破：{{count.bingo_report}}</p>
												</div>
											</el-col>
											<el-col :span="5">
												<div :class="portStatus=='meterpreter'? 'd-model on' : 'd-model'" @click="firterStatus('meterpreter')">
													<img src="../../assets/images/infltrate/n-3.png" width="80"/>
													<p>提权：
													{{count.meterpreter_report}}</p>
												</div>
											</el-col>
											<el-col :span="4">
												<div :class="portStatus=='diffusion'? 'd-model on' : 'd-model'" @click="firterStatus('diffusion')">
													<img src="../../assets/images/infltrate/n-4.png" width="80"/>
													<p>扩散：{{count.diffusion_report}}</p>
												</div>
											</el-col>
										</el-row>
									</el-col>
								</el-row>
							</div>

							<div class="d-conbox" v-for="(item,index) in tableData">
								<div class="portName">
									<el-row>
										<el-col :span="8"><p class="name">端口：{{item.target.port}}</p>
										</el-col>
										<el-col :span="16">
											<div class="fr port">
												<span v-if="item.target.is_web_port == 0 || item.target.is_web_port == false">是否网页端口：否</span><span v-else-if="item.target.is_web_port == 1 || item.target.is_web_port == true">是否网页端口：是</span>|
												<span>版本：{{item.target.version}}</span>|
												<span>协议：{{item.target.protocol}}</span>|
												<span>服务：{{item.target.service}}</span>
											</div>
										</el-col>
									</el-row>
								</div>
								 <el-table
					              :data="item.reports"
					              style="width: 100%" 
					              :default-sort = "{prop: '', order: ''}" empty-text="无相关渗透模块">
					              <el-table-column
					                prop="" width="50"
					                label="#">
					                <template scope="scope">
					                  <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
					                </template>
					              </el-table-column>

					             <el-table-column
					               prop="time"
					               label="时间" 
					               width="150"
					               :formatter="fmtLength">
					             </el-table-column>

					             <el-table-column
					               prop="vuln_name"
					               label="漏洞名称" 
					               width="100"
					               :formatter="fmtLength">
					             </el-table-column>

					              <el-table-column
					               prop="description"
					               label="描述" 
					               width="100"
					               :formatter="fmtLength">
					             </el-table-column>

					              <el-table-column
					               prop="type"
					               label="类型" 
					               width="90"
					               :formatter="fmtLength">
					             </el-table-column>

					              <el-table-column
					               prop="status"
					               label="结果" 
					               width="100"
					               :formatter="fmstatus">
					             </el-table-column>

					              <el-table-column
					               prop="exploit"
					               label="渗透模块" 
					               width="100"
					               :formatter="fmtLength">
					             </el-table-column>

					              <el-table-column
					               prop="target"
					               label="目标机器" 
					               width="100"
					               :formatter="fmtLength">
					             </el-table-column>

					              <el-table-column
					               prop="payload"
					               label="攻击载荷模块" 
					               :formatter="fmtLength">
					             </el-table-column>

								</el-table>
							</div>
							</vue-scroll>
						</div>
						
					</el-col>
	        	</el-row>
			</div>
        </section>
     </div>
  </div>
 </div>
 </template>
<script>
import { domain } from '../../request.js'
import { getTargetDetail, getTotalCount  } from '../../api/infltrate/infltrate.js'

export default {
    data() {
      return {
        currentPage: 1,
        pagesize: 15,
        total: 0,
        tableData: [],
        loading: true,
        title: '',
        scorllIndex: 0,
        jobId: '',
        count: {
        	bingo_report: '',
        	failure_report: '',
        	exploit_count: '',
        	total_report: '',
        	port_count: '',
        	diffusion_report: '',
        	meterpreter_report: ''
        },
        totalCount: 0,
        //端口列表距离顶部offsettop+(offsetHeight/2)
        portListTop: [],
        //滚动条参数配置
        ops: {
        	mode: 'native',
        	bar: {
        		background: '#ccc',
        	}
        },
        infltrate: '',
        portStatus: '',
      }
    },
    methods: {
      handleClick() {

      },
      fmtLength(row, column){
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          return arr
        }
      },
       fmstatus(row, column) {
        var result = '—';
        var data = row[column['property']];
        if (data == 'failure' || data == 1) {
        	 result = '未突破';
        } else if (data == 'bingo' || data == 2) {
        	result = '成功';
        } else if (data == 'meterpreter' || data == 3) {
        	result = '提权';
        } else if (data == 'diffusion' || data == 4) {
        	result = '扩散';
        }
        return result
      },
      //导出
      exportData() {
      	var BASE_URL = domain.baseUrl; //全局接口地址
      	var url = BASE_URL+"/om/deepexploit/export?jobId="+this.jobId;
        window.location = url;
      },
      //统计
      getCount() {
      	var that = this;
      	var param = {
      		'jobId': this.jobId //9
      	}
      	getTotalCount(param).then(res => {
      		if (res.result) {
      			that.count = res.result;
      			that.totalCount = (that.count.bingo_report+that.count.failure_report+that.count.diffusion_report+that.count.meterpreter_report)
      		}
      	})

      },
      //端口筛选
      firterStatus(status) {
      	debugger
      	this.loading = true;
      	this.portStatus =  status;
      	this.tableData = [];
      	this.getPortDetail();
      },
      //获取端口列表
      getPortDetail() {
      	var that = this;
      	var param = {
      		'jobId': this.jobId, //9
      		'status': this.portStatus
      	}
      	getTargetDetail(param).then(res => {
      		that.loading = false;
      		if (res.result) {
      			that.tableData = res.result;
      			this.$nextTick(() =>{
      				//DOM 更新后获取每个port table距离顶部的高度
      				this.getTblsHeight();
      			})
      			
      		}
      	})
      },
      //获取每个portlist距离顶部高度
      getTblsHeight() {
      	let arr = [];
      	if (this.tableData.length > 0) {
	      	let foodList = this.$refs.portList.getElementsByClassName('d-conbox');
	      	for (let i = 0; i < foodList.length; i++) {
	          let item = foodList[i]; //每一个item都是刚才获取的food的每一个dom
	          let top = item.offsetTop; //主要是为了获取每一个foods内部块的高度
	          let h = item.offsetHeight;
	          arr.push({
	          	index: i, //位置
	          	top: top, //距离顶部高度
	          	place: (top+h/2), //距离顶部高度+高度的一半
	          	toph: (top+h) //距离顶部高度+高度
	          });
	        }
	        this.portListTop = arr;
        }
        console.log(arr)
      },
      //portlist滚动时设置对应的portNamr
      handleScroll(vertical, horizontal, nativeEvent) {
      	//console.log(vertical, horizontal, nativeEvent)
      	if (vertical) {
  			let scrtop = vertical.scrollTop; //滚动条距离顶部的高度
	        let c = this.portListTop.forEach((value,key,arr) => {
				if (scrtop >= value.place && scrtop <= this.portListTop[key+1].place) {
					this.scorllIndex = value.index;
					return
				}
			})
      	}
      	//console.log(this.scorllIndex);
      },
      //portNamr点击时跳转到对应的portList
      setPortItem(index) {
      	var scrtop = this.portListTop[index].toph;
      	this.$refs['portScroll'].scrollTo({
            x: 10,
            y: scrtop
        }, true)
      },
      getIPs() {
      	if (this.$route.params.infltrate) {
          this.infltrate = this.$route.params.infltrate;
          localStorage.setItem('infltrate', JSON.stringify(this.infltrate));
        } else {
          var obj = localStorage.getItem('infltrate');
          obj = JSON.parse(obj);
          this.infltrate = obj;
        }

        if (this.$route.params.jobId) {
          this.jobId = this.$route.params.jobId;
          localStorage.setItem('jobId', JSON.stringify(this.jobId));
        } else {
          var obj = localStorage.getItem('jobId');
          obj = JSON.parse(obj);
          this.jobId = obj;
        }
        
      }
    },
    mounted() {
      this.getIPs();

      //设置高度
      this.$refs.portList.style.height = document.documentElement.clientHeight - 100+'px';
      this.$refs.portNameList.style.height = document.documentElement.clientHeight - 100+'px';
      
      //获取数据
      this.getPortDetail();

      //统计
      this.getCount();

      //监听滚动条事件
      //window.addEventListener('scroll', this.handleScroll, true);
    }
  }
</script>
 <style>
	.d-conbox{
		width:94%;height:auto;padding:20px;margin:10px 0 20px 0;border:1px solid #ccc;border-radius:3px;
	}
	.dc-info p{
		line-height:30px;
	}
	.portName{
		width:100%;border-bottom:1px solid #ccc;height:30px;line-height:30px;margin-bottom:20px;
	}
	.portName .name{
		color:#409EFF;font-size:16px;
	}
	.portName .port{
		color:#ccc;
	}
	.portName .port span{
		padding:0 10px;color:#333;
	}
	.pNameList{
		width:80%;padding:10px 0 10px 20px;margin-right:10px;position: relative;
	}
	.pNameList a{
		color:#333;padding:0 10px
	}
	.pNameList a:hover{
		color:#409EFF;
	}
	.pNameList a.on{
		color:#2b75c8!important;
	}
	.d-model{
		padding:8px 2px;margin:0 10px;border-radius:5px;text-align: center;
	}
	.d-model.on, .d-model:hover{
		background:#e2eff6;
	}
	.d-nav{
		width:8px;height:8px;display:inline-block;border:1px solid #ccc;border-radius:100%;background:#fff;
	}
	.d-nav-border{
		height:20px;border-left:2px solid #ccc;margin-left:3px;
	}
	.d-nav.on{
		background:#2b75c8;border:1px solid #2b75c8;
	}
	.d-nav-border.on{
		border-left:2px solid #2b75c8;
	}
 </style>