<template>
  <div class="pageOverflow" style="height:88%">
    <div class="title company_ip" style="padding:0 0 10px 0;">
      <div class="filter-container">
        <section class="app-container">
          <el-form :model="assetForm" ref="assetForm" v-loading="baseInfoLoading">
            <el-row class="detail-title">
              <el-col :span="20"><span style="padding:0 0 0 30px;">资产详情</span></el-col>
              <el-col :span="4">
                <!-- <router-link :to="{path:'/asset_host'}" class="fr" style="padding-right:20px;">< 返回</router-link> -->
                <a href="javascript:;" class="fr" @click="blackHost" style="padding-right:20px;">< 返回</a>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="14">
                <div class="assetInfo">
                  <p class="i-title">基本信息</p>
                  <el-row>
                    <el-col :span="8">
                      <p>主机名称：{{assetForm.assetsInfo.assetsName}}</p>
                      <p>主机IP：{{assetForm.assetsInfo.assetsIp}}</p>
                      <p>设备类型：{{assetType}}</p>
                    </el-col>
                    <el-col :span="8">
                      <p>负责人：{{assetForm.assetsInfo.assetsUser}}</p>
                      <p>关联邮箱：{{assetForm.assetsInfo.email}}</p>
                      <p>资产类型：{{assetForm.assetsInfo.hostType == 1 ? '核心资产' : '非核心资产' }}</p>
                    </el-col>
                    <el-col :span="8">
                      <p>所属机构：{{officeName}}</p>
                      <p>备注：{{assetForm.assetsInfo.remarks}}</p>
                    </el-col>
                  </el-row>
                </div>
                <div class="assetInfo">
                  <p class="i-title">附加信息<el-button type="text" icon="el-icon-edit-outline"  @click="addAttachInfo()"></el-button></p>
                  <el-row>
                    <el-col :span="8">
                      <p>操作系统：{{assetForm.assetsAttachInfo.os}}</p>
                      <p>设备厂商：{{assetForm.assetsAttachInfo.hardComp}}</p>
                      <p>硬盘大小：{{assetForm.assetsAttachInfo.hdSize}}</p>
                    </el-col>
                    <el-col :span="8">
                      <p>CPU型号：{{assetForm.assetsAttachInfo.cpu}}</p>
                      <p>SN号：{{assetForm.assetsAttachInfo.sn}}</p>
                      <p>内存大小：{{assetForm.assetsAttachInfo.memSize}}</p>
                    </el-col>
                    <el-col :span="8">
                      <p>CPU数量：{{assetForm.assetsAttachInfo.cpuNum}}</p>
                      <p>机柜信息：{{assetForm.assetsAttachInfo.cabinet}}</p>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
              <!--<el-col :span="10">
                          <div class="a-d-count">
                              <p class="a-d-title">威胁统计<p>
                              <div style="position: relative;">
                                  <div class="fl d-certainty-num">
                                      <p>可信度</p>
                                      <p class="num">0</p>
                                  </div>
                                  <div class="fl d-threat-num">
                                      <p>威胁度</p>
                                      <p class="num">0</p>
                                  </div>
                                  <div class="fl d-white-num">
                                      <p>白名单</p>
                                      <p class="num">0</p>
                                  </div>
                              </div>
                          </div>
                      </el-col>-->
            </el-row>
          </el-form>
        </section>
      </div>
    </div>

    <div class="title company_ip">
      <div class="filter-container">
        <section class="app-container">

          <div class="flowTabs">
            <el-table
              :data="tableData"
              style="width: 100%"
              :default-sort = "{prop: '', order: ''}" v-loading="loading">
              <el-table-column
                prop="" width="50"
                label="#">
                <template scope="scope">
                  <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
                </template>
              </el-table-column>

              <el-table-column
                prop="port"
                :formatter="fmtLength"
                label="端口名称"
                width="100">
              </el-table-column>

              <el-table-column
                prop="status"
                label="状态"
                :formatter='statusFormat'
                width="100">
              </el-table-column>

              <el-table-column
                prop="serviceInfo"
                :formatter="fmtLength"
                label="服务信息">
              </el-table-column>

              <el-table-column
                prop="versionInfo"
                :formatter="fmtLength"
                label="版本信息">
              </el-table-column>

              <el-table-column
                prop="remarks"
                :formatter="fmtLength"
                label="端口说明">
              </el-table-column>

              <el-table-column
                prop="protocal"
                :formatter="fmtLength"
                label="端口协议">
              </el-table-column>

              <el-table-column
                prop="uptime"
                :formatter="fmtLength"
                label="更新日期">
              </el-table-column>

              <el-table-column
                prop=""
                label="操作">
                <template slot-scope="scope">
                  <el-button type="text" class="btns" :disabled="scope.row.status!=0" @click='edit(scope.$index, scope.row)'>处理</el-button>
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

          <!-- <div class="container_table flowTabs">
                                           <el-table
                                            :data="tableData2"
                                            style="width: 100%" :height="tableHeight2"
                                            :default-sort = "{prop: '', order: ''}">
                                            <el-table-column
                                              prop="" width="50"
                                              label="#">
                                               <template scope="scope">
                                                <span>{{ pagesize2 * (currentPage2 - 1)  + 1 + scope.$index  }}</span>
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
                                                         :current-page.sync = "currentPage2"
                                                         @current-change="current_change2"
                                                         :total="total2"
                                                         :page-size="pagesize2"
                                                         background
                                           >
                                           </el-pagination>
                    </div> -->


        </section>
      </div>
    </div>



    <!--附件信息变更-->
    <el-dialog title="附件信息变更" :visible.sync="dialogFormVisible" width="680px">
      <el-form :model="infoForm"  :rules="infoRules" ref="infoForm" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作系统" prop="os">
              <el-input v-model="infoForm.os"></el-input>
            </el-form-item>
            <el-form-item label="CPU型号" prop="cpu">
              <el-input v-model="infoForm.cpu"></el-input>
            </el-form-item>
            <el-form-item label="硬盘大小" prop="hdSize">
              <el-input v-model="infoForm.hdSize"></el-input>
            </el-form-item>
            <el-form-item label="SN号" prop="sn">
              <el-input v-model="infoForm.sn"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备厂商" prop="hardComp">
              <el-input v-model="infoForm.hardComp"></el-input>
            </el-form-item>
            <el-form-item label="CPU数量" prop="cpuNum">
              <el-input v-model="infoForm.cpuNum"></el-input>
            </el-form-item>
            <el-form-item label="内存大小" prop="memSize">
              <el-input v-model="infoForm.memSize"></el-input>
            </el-form-item>
            <el-form-item label="机柜信息" prop="cabinet">
              <el-input v-model="infoForm.cabinet"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer"  style="text-align: center">
        <el-button @click="clearAttachInfo">取 消</el-button>
        <el-button type="primary" @click="updateAttchInfo">确 定</el-button>
      </div>
    </el-dialog>

    <!--处理-->
    <el-dialog title="处理" :visible.sync="dialogDispotFormVisible" width="450px">
      <el-form :model="dispotForm"  :rules="dispotRules" ref="dispotForm">
        <el-form-item label="处理方式" prop="status">
          <el-radio-group v-model="dispotForm.status" class="host-dispot">
            <el-radio label="1" value="1">正常</el-radio>
            <el-radio label="2" value="2">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="处理说明" prop="remarks">
                      <el-input type="textarea" class="fl" v-model="dispotForm.remarks" style="width:80%">{{ dispotForm.remarks }}</el-input>
                    </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer"  style="text-align: center">
        <el-button @click=" dialogDispotFormVisible = false ">取 消</el-button>
        <el-button type="primary" @click="saveDispot">确 定</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog title="处理" :visible.sync="dialogDispotFormVisible" width="450px">
            <el-form :model="dispotForm"  :rules="dispotRules" ref="dispotForm">
              <el-form-item label="处理方式" prop="status">
                  <el-radio-group v-model="dispotForm.status" class="host-dispot">
                  <el-radio label="2" value="2">已修复</el-radio>
                  <el-radio label="0" value="0">待修复</el-radio>
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
          </el-dialog> -->


    <!--漏洞详情弹窗-->
    <!-- <el-dialog title="漏洞详情" :visible.sync="dialogInfoFormVisible" width="680px">
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
    	</el-dialog> -->


  </div>
</template>

<script>

  import { assetInfo, portListInfo, updateAttach, holeInfo, holeList, dispotPortStatus, holeListInfo, holePrams, assetsType, organization } from '../../api/asset/asset.js'

  export default {
    data() {
      return {
        loading: true,
        baseInfoLoading: true,
        assetsId: '',
        assetsIp: '',
        activeName: 'first',
        tableHeight: 100,
        currentPage: 1,
        total: 0,
        pagesize: 15,
        tableData: [],

        tableHeight2: 100,
        currentPage2: 1,
        total2: 0,
        pagesize2: 15,
        tableData2: [],
        vulnLevel: {},
        fixStatus: {},
        //附加信息
        dialogFormVisible: false,
        infoForm: {},
        infoRules: {},
        assetForm: {
          assetsInfo: {
            assetsName: '',assetsUser: '',assetsIp: '',email: '',
            assetsType: '',hostType: '',officeId: '',remarks: ''
          },
          assetsAttachInfo: {
            os: '',cpu: '',cpuNum: '',hdSize: '',
            hardComp: '',sn: '',cabinet: '',memSize: ''
          }

        },
        //处理
        dialogDispotFormVisible: false,
        dispotForm: {
          status: '',
          remarks: ''
        },
        dispotRules: {

        },
        vulnId: '',
        listport: '',
        /*
            
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
            sysOfficesSel: [],*/
        assetType: '',
        officeName: '',
        assetsTypeSel: '',
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
      current_change(currentPage) {
        this.currentPage = currentPage;
        this.getList();
      },
      /*current_change2(currentPage) {
          this.currentPage2 = currentPage;
          this.getHoleInfo();
        },*/
      handleClick(tab, event) {

      },
      blackHost() {
        //返回后需刷新页面
        this.$route.query['black'] = 1;
        this.$router.push({path:'/asset_host'})
        
      },
      /*assetsTypeSelet() {
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
            getLevelName(num) {
                for (var i in this.vulnLevel) {
                    if (num == i) {
                        return this.vulnLevel[i];
                    }
                }
            },
            getFixStatusName(num) {
                for (var i in this.fixStatus) {
                    if (num == i) {
                        return this.fixStatus[i];
                    }
                }
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
            },*/
      statusFormat(row, column) {
        //0, "可疑" 1, "正常"  2, "关闭"
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          switch(arr) {
            case 0:
              return '可疑';
            case 1:
              return '正常';
            case 2:
              return '关闭';
          }
        }

      },
      //处理弹窗
      edit(index, row) {
        this.listport = row.port;
        this.dispotForm.status = '';
        this.dialogDispotFormVisible = true;
      },
      //提交处理
      saveDispot(index, row) {
        if (this.dispotForm.status == '') {
           this.$message({
              type: 'warning',
              message: '请选择处理方式'
            });
           return false;
        }
        var that = this;
        var param = {
          'assetsId': this.assetsId,
          'port': this.listport,
          'status': this.dispotForm.status,
        }
        dispotPortStatus(param).then(res => {
          this.$message({
            type: 'success',
            message: '处理信息已提交'
          });
          this.dialogDispotFormVisible = false;
          this.currentPage = 1;
          that.getPortInfo();
          //that.getHoleInfo();
        })
      },
      //漏洞列表 详情弹窗
      /*info(index, row) {
                var that = this;
                var url = '/om/vuln/manager/detail/'+row.id;
                holeListInfo(url).then(res =>{
                    that.infoHoleForm = res.result;
                    that.infoHoleForm.level = this.getLevelName(that.infoHoleForm.level);
                    that.infoHoleForm.fixStatus = this.getFixStatusName(that.infoHoleForm.fixStatus);
                    that.dialogInfoFormVisible = true;
                })
            },*/
      clearAttachInfo() {
        if (this.$refs['infoForm'] !== undefined) {
          this.$refs['infoForm'].resetFields();//重置验证
        }
        this.dialogFormVisible = false
      },
      addAttachInfo() {
        this.infoForm = this.assetForm.assetsAttachInfo
        this.dialogFormVisible = true
      },
      updateAttchInfo() {
        var that = this;
        this.infoForm.assetsId = this.assetsId;
        updateAttach(this.infoForm).then(res => {
          this.$message({
            type: 'success',
            message: '保存成功'
          });
          this.currentPage = 1;
          that.getList();
          this.dialogFormVisible = false;
        })
      },
      /*getHoleInfo() {
                var that = this;
                //var url = 'om/vuln/manager/detail/'+this.assetsId;
                var param = {
                    assetsId: this.assetsId,
                    assetsIp: this.assetsIp,
                    cveNo: '',
                    vulnName: '',
                    vulnType: '',
                    level: '',
                    fixStatus: '',
                    pageNo: this.currentPage2,
                    cnvdNo: '',
                }
                holeList(param).then(res => {

                    that.tableData2 = res.result.results;
                    //that.total2 = that.tableData2.length2;
                    that.total2 = res.result.totalCount;
                    if (that.tableData2.length >= 1) {
                        that.tableHeight2 = 427
                    }
                })
            },*/
      getPortInfo() {
        var that = this;
        var param = {
          assetsId: this.assetsId,
          assetsIp: this.assetsIp,
          numPerPage: this.pagesize,
          pageNum: this.currentPage
        }
        portListInfo(param).then(res => {
          that.tableData = res.result.results;
          that.total = res.result.totalCount;
          for (var i in that.tableData) {
            if (that.tableData[i].uptime.indexOf('.') != -1) {
              that.tableData[i].uptime = that.tableData[i].uptime.split('.')[0];
            }
          }
        })
      },
      getList() {
        var that = this;
        var param = {
          assetsId: this.assetsId,
          assetsIp: this.assetsIp,
          numPerPage: this.pagesize,
          pageNum: this.currentPage
        }
        assetInfo(param).then(res => {


          if (JSON.stringify(res.result.assetsInfo) != "{}") {
            that.assetForm.assetsInfo = res.result.assetsInfo;
          }
          if (res.result.assetsAttachInfo != null) {
            that.assetForm.assetsAttachInfo = res.result.assetsAttachInfo;
          }

          that.baseInfoLoading = false;
          that.loading = false;

          //端口列表
          that.getPortInfo();

          //漏洞列表
          //that.getHoleInfo();

        })
      },
      /*getholePrams(){
                var that = this;
                holePrams().then(res => {
                    if (res.result) {

                        that.vulnLevel = res.result.vulnLevel;
                        that.fixStatus = res.result.fixStatus;
                    }

                })
            },*/
      saveAssetsId() {
        
        this.$route.params.id == undefined ? this.assetsId = localStorage.getItem('assetsId') : this.assetsId = this.$route.params.id;
        this.$route.params.ip == undefined ? this.assetsIp = localStorage.getItem('assetsIp') : this.assetsIp = this.$route.params.ip;

        this.$route.params.assetType == undefined ? this.assetType = localStorage.getItem('assetType') : this.assetType = this.$route.params.assetType;

        this.$route.params.officeName == undefined ? this.officeName = localStorage.getItem('officeName') : this.officeName = this.$route.params.officeName;

        this.$route.params.assetsTypeSel == undefined ? this.assetsTypeSel = localStorage.getItem('assetsTypeSel') : this.assetsTypeSel = this.$route.params.assetsTypeSel;


        localStorage.setItem('assetsId', this.assetsId);
        localStorage.setItem('assetsIp', this.assetsIp);
        localStorage.setItem('assetType', this.assetType);
        localStorage.setItem('officeName', this.officeName);
        localStorage.setItem('assetsTypeSel', this.assetsTypeSel);

        if (this.assetsTypeSel != '') {
          for(var i in this.assetsTypeSel) {
            if(this.assetType == this.assetsTypeSel[i].value) {
              this.assetType = this.assetsTypeSel[i].label
            }
          }
        }


      }
    },
    mounted() {
      //获取ID
      this.saveAssetsId();

      //获取详情列表
      this.getList();

      //漏洞列表参数
      //this.getholePrams();

      //设备类型
      //this.assetsTypeSelet();

      //所属机构
      //this.organizationSelet();

    }
  }
</script>
<style>
  .hole-info-dialog .el-textarea.is-disabled .el-textarea__inner, .hole-info-dialog .el-input.is-disabled .el-input__inner{
    color:#666!important;
  }
  .mar-pd-10{
    margin:10px 0;
  }
</style>
