<template>
  <div class="pageOverflow">
	  <div class="title company_ip asset" style="padding:10px 0;">
	   	 <div class="filter-container">
	        <section class="app-container">
				<el-row>
			        <el-col :span="22" class="toolbar" style="padding: 0 0 0 10px;">
			          <el-form :inline="true" ref="form" :model="form">
			            <el-form-item>
			              <el-input placeholder="请输入漏洞名称" v-model="form.name"></el-input>
			            </el-form-item>
			            <el-form-item>
			              <el-input placeholder="请输入CVE编号" v-model="form.cveNo"></el-input>
			            </el-form-item>
			            <el-form-item>
			              <el-button type="primary" icon="el-icon-search" @click="searchItem">查询</el-button>
			            </el-form-item>
			          </el-form>
			        </el-col>
			        <el-col :span="2">
						<router-link :to="{path:'/holeScan'}" class="fr" style="padding-right:20px;margin-top: 9px;">< 返回</router-link>
			        </el-col>
			    </el-row>
				

				<div class="container_table flowTabs">
		           <el-table
		            :data="tableData"
		            style="width: 100%"
		            :default-sort = "{prop: '', order: ''}">
		            <el-table-column
		              prop="" width="50"
		              label="#">
		               <template scope="scope">
		                <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
		              </template>
		            </el-table-column>
					
					<el-table-column
		              prop="cveNo"
		              label="CVE编号">
		            </el-table-column>
					
					 <el-table-column
		              prop="vulnName"
		              label="漏洞名称">
		            </el-table-column>

		            <el-table-column
		              prop="vulnType"
		              label="漏洞分类">
		            </el-table-column>
					
					<el-table-column
		              prop="level"
		              label="风险等级" 
		              :formatter="levelFormat">
		            </el-table-column>

					<el-table-column
		              prop="assetsIp"
		              label="关联资产">
		            </el-table-column>

		            <el-table-column
		              prop="fixStatus"
		              label="状态处理" 
		              :formatter='fixStatusFormat'>
		            </el-table-column>

		            <el-table-column
		              prop="uptime"
		              label="发现时间">
		            </el-table-column>

		            <el-table-column
		              prop=""
		              label="操作">
		             <template slot-scope="scope">
		                 <el-button type="text" class="btns" @click='edit(scope.$index, scope.row)'>处理</el-button>
		                  <el-button type="text" class="btns" @click='info(scope.$index, scope.row)'>详情</el-button>
		              </template>
		            </el-table-column>
		        </el-table>

		          <el-pagination class="fy"
		                         layout="prev, pager, next,total"
		                         :current-page.sync = "currentPage"
		                         @current-change="current_change"
		                         :total="total" 
		                         :page-size="pagesize"
		                         background
		           >
		           </el-pagination>
				</div>
	        </section>
	      </div>
	   </div>


	   <el-dialog title="处理" :visible.sync="dialogDispotFormVisible" width="450px">
	      <el-form :model="dispotForm"  :rules="dispotRules" ref="dispotForm">
	        <el-form-item label="处理方式" prop="status">
	            <el-radio-group v-model="dispotForm.status" class="host-dispot">
	            <el-radio label="" value="">待处理</el-radio>
				<el-radio label="" value="">复查中</el-radio>
				<el-radio label="" value="">已修复</el-radio>
				<el-radio label="" value="">已忽略</el-radio>
				<el-radio label="" value="">漏洞复现</el-radio>
		    </el-radio-group>
	        </el-form-item>
		<el-form-item label="处理说明" prop="remarks">
	          <el-input type="textarea" class="fl" v-model="dispotForm.remarks" style="width:80%">{{ dispotForm.remarks }}</el-input>
	        </el-form-item>
	      </el-form>
	      <div slot="footer" class="dialog-footer"  style="text-align: center">
	        <el-button @click=" dialogDispotFormVisible = false ">取 消</el-button>
		<el-button type="primary" @click="saveDispot">确 定</el-button>
	      </div>
	    </el-dialog>

	    <el-dialog title="漏洞详情" :visible.sync="dialogInfoFormVisible" width="680px">
		  <el-form :model="infoHoleForm"  ref="infoHoleForm" label-width="80px" class="hole-info-dialog">
		  	<el-row>
				<el-col :span="12">
					<el-form-item label="漏洞名称" prop="vulnName">
					    <el-input :disabled="true" v-model="infoHoleForm.vulnName"></el-input>
					</el-form-item>
					<el-form-item label="CVE编号" prop="cveNo">
					    <el-input :disabled="true" v-model="infoHoleForm.cveNo"></el-input>
					</el-form-item>
				    <el-form-item label="CNVD编号">
					    <el-input :disabled="true"></el-input>
					</el-form-item>
				    <el-form-item label="关联资产" prop="assetsName">
					    <el-input :disabled="true" v-model="infoHoleForm.assetsName"></el-input>
					</el-form-item>
					<el-form-item label="主机IP" prop="hostType">
					    <el-input :disabled="true" v-model="infoHoleForm.hostType"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="负责人" prop="assetsUser">
					    <el-input :disabled="true" v-model="infoHoleForm.assetsUser"></el-input>
					</el-form-item>
					<el-form-item label="关联邮箱" prop="email">
					    <el-input :disabled="true" v-model="infoHoleForm.email"></el-input>
					</el-form-item>
					<el-form-item label="漏洞分类" prop="vulnType">
					    <el-input :disabled="true" v-model="infoHoleForm.vulnType"></el-input>
					</el-form-item>
					<el-form-item label="风险等级" prop="level">
					    <el-input :disabled="true" v-model="infoHoleForm.level"></el-input>
					</el-form-item>
					<el-form-item label="发现时间" prop="createDate">
					    <el-input :disabled="true" v-model="infoHoleForm.createDate"></el-input>
					</el-form-item>
				</el-col>
		  </el-row>
		  <el-row>
			<el-col :span="24">
				<el-form-item label="漏洞简介" prop="introduce">
				    <el-input type="textarea" :disabled="true" v-model="infoHoleForm.introduce" class="mar-pd-10"></el-input>
				</el-form-item>
				<el-form-item label="修复方案" prop="fixSolution">
				    <el-input type="textarea" :disabled="true" v-model="infoHoleForm.fixSolution" class="mar-pd-10"></el-input>
				</el-form-item>
				<el-form-item label="修复指南">
				    <el-input type="textarea" :disabled="true" class="mar-pd-10"></el-input>
				</el-form-item>
				<el-form-item label="处理状态" prop="fixStatus">
				    <el-input type="textarea" :disabled="true" v-model="infoHoleForm.fixStatus" class="mar-pd-10"></el-input>
				</el-form-item>
				<el-form-item label="处理说明" prop="fixAction">
				    <el-input type="textarea" :disabled="true" v-model="infoHoleForm.fixAction" class="mar-pd-10"></el-input>
				</el-form-item>
			</el-col>	
		  </el-row>
		  </el-form>
		  <div slot="footer" class="dialog-footer"  style="text-align: center">
		    <el-button type="primary" @click=" dialogInfoFormVisible = false ">确 定</el-button>
		  </div>
		</el-dialog>
  </div>
</template>
<script>
import { assetInfo, portListInfo, updateAttach, holeInfo, holeList, dispotHoleStatus, holeListInfo, holePrams, assetsType, organization } from '../../api/asset/asset.js'

export default {
	data() {
		return {
			pagesize: 15,
			currentPage: 1,
			total: 0,
			tableData: [],
			form: {
				name: '',
				cveNo: '',

			},
			vulnLevel: [],
			fixStatus: [],
			assetsTypeSel: [],
			sysOfficesSel: [],
			assetType: '',
			assetsId: '',
			assetsIp: '',
			sinfo: '',
			//处理
        	dialogDispotFormVisible: false,
        	dispotForm: {
        		status: '',
        		remarks: ''
        	},
        	dispotRules: {

        	},
        	vulnId: '',
        	//漏洞详情
        	dialogInfoFormVisible: false,
			infoHoleForm: {
				vulnName: '',
				cveNo: '',
				assetsName: '',
				hostType: '',
				assetsUser: '',
				email: '',
				vulnType: '',
				level: '',
				createDate: '',
				introduce: '',
				fixSolution: '',
				fixStatus: '',
				fixAction: ''
			},
			assetsTypeSel: [],
			sysOfficesSel: [],
			assetType: '',
			officeName: ''
		}
	},
	methods: {
		current_change() {

		},
		levelFormat(row, column) {
			var num = row[column['property']];
			for (var i in this.vulnLevel) {
				if (num == i) {
					return this.vulnLevel[i];
				}
			}
		},
		fixStatusFormat(row, column) {
			var num = row[column['property']];
			for (var i in this.fixStatus) {
				if (num == i) {
					return this.fixStatus[i];
				}
			}
		},
		assetsTypeSelet() {
			var that = this;
			assetsType().then(res => {
				var data = res.result.AssetsType;
				var arr = [];
				for (var i in data) {
					if (that.assetType == i) {
						that.assetType = data[i];
					}
					var temp = {
						label: data[i],
						value: i
					}
					arr.push(temp);
				}
				that.assetsTypeSel = arr;
			})
		},
		organizationSelet() {
			var that = this;
			organization().then(res => {
				that.sysOfficesSel = res.result.sysOffices;
			})
		},
		getholePrams() {
			var that = this;
			holePrams().then(res => {
				if (res.result) {
					
					that.vulnLevel = res.result.vulnLevel;
					that.fixStatus = res.result.fixStatus;
				}
				
			})
		},
		//漏洞列表 处理弹窗
		edit(index, row) {
			
			this.vulnId = row.id;
			this.dialogDispotFormVisible = true;
		},
		//漏洞列表 提交处理
		saveDispot(index, row) {
			var that = this;
			var param = {
				vulnId: this.vulnId,
				fixStatus: this.dispotForm.status,
				explain: this.dispotForm.remarks
			}
			dispotHoleStatus(param).then(res => {
				this.$message({
                  type: 'success',
                  message: '保存成功'
                });
                this.dialogDispotFormVisible = false;
                this.currentPage = 1;
				that.getHoleInfo();
			})
		},
		//漏洞列表 详情弹窗
		info(index, row) {
			var that = this;
			var url = '/om/vuln/manager/detail/'+row.id;
			holeListInfo(url).then(res =>{
				that.infoHoleForm = res.result;
				that.infoHoleForm.level = this.getLevelName(that.infoHoleForm.level);
				that.infoHoleForm.fixStatus = this.getFixStatusName(that.infoHoleForm.fixStatus);
				that.dialogInfoFormVisible = true;
			})
		},
		searchItem() {

		},
		getHoleInfo() {
			var that = this;
			//var url = 'om/vuln/manager/detail/'+this.assetsId;
			var param = {
				assetsId: this.assetsId,
				assetsIp: this.assetsIp,
				cveNo: '',
				cnvdNo: '',
				vulnName: '',
				vulnType: '',
				level: '',
				fixStatus: '',
				pageSize: this.pagesize,
				pageNo: this.currentPage,
				
			}
			holeList(param).then(res => {
				debugger
				that.tableData = res.result.results;
				that.total = res.result.totalCount;
			})
		},
		saveAssetsId() {
			
			if (this.$route.params.info) {
            	this.sinfo = this.$route.params.info;
            	localStorage.setItem('holeInfo', JSON.stringify(this.sinfo));
            } else {
            	var obj = localStorage.getItem('holeInfo');
            	obj = JSON.parse(obj);
            	this.sinfo = obj;
            }

            this.assetsId = this.sinfo.assetsId;
            this.assetsIp = this.sinfo.assetsIp;
			
		}
	},
	mounted() {
		//获取参数
		this.saveAssetsId();

		//漏洞列表参数
		this.getholePrams();

		//设备类型
		this.assetsTypeSelet();

		//所属机构
		this.organizationSelet();

		//漏洞列表
		this.getHoleInfo();
	}
 }
</script>