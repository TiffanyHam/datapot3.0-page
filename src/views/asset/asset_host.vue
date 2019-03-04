
<template>
  <div class="pageOverflow">

    <div class="title company_ip asset" style="padding:10px 0;">
      <div class="filter-container">
        <section class="app-container">
          <el-row>
            <el-col :span="24">
              <div class="a-con">
                <el-row>
                  <el-col :span="24">
                    <div class="fl">
                      <el-button type="primary" icon="el-icon-search" @click="find">资产发现 <i :class="assetscanIcon"></i></el-button>
                      <el-button type="success" icon="el-icon-plus" @click="add">新增资产</el-button>
                      <el-button type="warning" icon="el-icon-port" @click="port">端口扫描 <i :class="portscanIcon"></i></el-button>
                      <!-- <el-button type="danger" icon="el-icon-hole" @click="hole">漏洞扫描 <i :class="holescanIcon"></i></el-button> -->

                    </div>
                    <div class="fr" style="margin-left:30px;">
                      <el-form :inline="true" ref="assetForm" :model="assetForm">
                        <el-form-item>
                          <el-input placeholder="请输入主机名/IP" v-model="assetForm.endIpQ"></el-input>
                        </el-form-item>
                        <el-form-item>
                          <el-button type="primary" icon="el-icon-search" @click="assetFormSearch">查询</el-button>
                        </el-form-item>
                      </el-form>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div class="container_table asset">
                      <el-table v-loading="loading"
                                :data="tableData"
                                style="width: 100%" :height="tableHeight" @selection-change="handleSelectionChange"  @filter-change="filterChange">
                        <el-table-column
                          prop="" width="50"
                          label="#">
                          <template scope="scope">
                            <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column
                          type="selection"
                          width="30">
                        </el-table-column>

                        <el-table-column
                          prop="assetsName"
                          :formatter="fmtLength"
                          label="资产名称"
                          width="120">
                          <template slot-scope="scope">
                            <el-button
                              @click=""
                              type="text"
                              size="small" style="padding:7px 0;">
                              {{scope.row.assetsName}}
                            </el-button>
                          </template>
                        </el-table-column>

                        <el-table-column
                          prop="assetsIp"
                          label="主机IP"
                          :formatter="fmtLength"
                          width="120">
                        </el-table-column>

                        <el-table-column
                          prop="assetsType"
                          label="设备类型" :formatter="aTypeFormatter" :filter-multiple="isFalse" :filters="aTypeFilter" filter-placement="bottom-end" column-key="assetsType"
                          width="120"
                          :show-overflow-tooltip="true">
                        </el-table-column>
                        <!-- :filter-method="aTypeFilMet" -->

                        <el-table-column
                          prop="hostType"
                          label="资产类型"
                          :formatter="fmtLength"
                          :filter-multiple="isFalse"
                          :filters="hTypeFilter"
                          filter-placement="bottom-end"
                          column-key="hostType"
                          width="150">
                          <template slot-scope="scope">
												<span v-if="scope.row.hostType == '0' || scope.row.hostType == '2' ">
													非核心资产 <i class="el-icon-non-core"></i>
												</span>
                            <span v-else-if="scope.row.hostType == '1'">
													核心资产 <i class="el-icon-core"></i>
												</span>
                            <span v-else>scope.row.hostType</span>
                          </template>
                        </el-table-column>
                        <!-- :filter-method="hTypeFilMet" -->

                        <el-table-column
                          prop="officeId"
                          label="所属机构"
                          :filter-multiple="isFalse"
                          :filters="ofNameFilter"
                          filter-placement="bottom-end"
                          column-key="officeId"
                          :formatter="officeIdFarmatter"
                          width="140"
                          :show-overflow-tooltip="true">
                        </el-table-column>
                        <!-- :filter-method="ofNameFilMet" -->

                        <el-table-column
                          prop="remarks"
                          :formatter="fmtLength"
                          label="备注"
                          :show-overflow-tooltip="true">
                        </el-table-column>

                        <el-table-column
                          prop="uptime"
                          :formatter="fmtLength"
                          label="更新时间"
                          width="160">
                        </el-table-column>

                        <el-table-column
                          prop=""
                          label="操作"
                          width="150">
                          <template slot-scope="scope">
                            <el-button type="text" class="btns" @click='edit(scope.$index, scope.row)'>修改</el-button>

                            <el-badge is-dot class="item" v-if="scope.row.portSuspicious==1">&nbsp;&nbsp;
                              <el-button type="text" class="btns" @click='info(scope.$index, scope.row)'>详情</el-button>
                            </el-badge>
                            <el-button type="text" v-else class="btns" @click='info(scope.$index, scope.row)'>详情</el-button>
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
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </section>
      </div>
    </div>


    <!--新增资产-->
    <el-dialog :title="title[dialogList]" :visible.sync="dialogFormVisible" width="680px">
      <el-form :model="addAssetForm"  :rules="addAssetRules" ref="addAssetForm" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="资产名称" prop="assetsName">
              <el-input v-model="addAssetForm.assetsName"></el-input>
            </el-form-item>
            <el-form-item label="设备类型" prop="assetsType">
              <el-select v-model="addAssetForm.assetsType" placeholder="请选择设备类型">
                <el-option v-for="(item) in assetsTypeSel"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属机构" prop="officeId">
              <el-select v-model="addAssetForm.officeId" placeholder="请选择所属机构">
                <el-option v-for="(item,index) in sysOfficesSel"
                           :label="item.officeName"
                           :value="item.officeId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关联邮箱" prop="email">
              <el-input v-model="addAssetForm.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主机IP" prop="assetsIp">
              <el-input v-model="addAssetForm.assetsIp"></el-input>
            </el-form-item>
            <el-form-item label="资产类型" prop="hostType">
              <el-select v-model="addAssetForm.hostType" placeholder="请选择资产类型">
                <el-option value="1" label="核心资产"></el-option>
                <el-option value="2" label="非核心资产"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="负责人" prop="assetsUser">
              <el-input v-model="addAssetForm.assetsUser"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="addAssetForm.remarks" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer"  style="text-align: center">
        <el-button @click=" dialogFormVisible = false ">取 消</el-button>
        <el-button type="primary" v-if="dialogList == 'add' " @click="addAsset">确 定</el-button>
        <el-button type="primary" v-else @click="updateAsset">确 定</el-button>

      </div>
    </el-dialog>

    <!--资产发现-->
    <el-dialog title="资产发现" :visible.sync="dialogFindFormVisible" width="450px" class="ipsSel">
      <el-form :model="findAssetForm"  :rules="findAssetRules" ref="findAssetForm" label-width="80px">
        <el-form-item label="网段选择" prop="ips">
          <!-- <el-select v-model="findAssetForm.ips" placeholder="请选择网段">
            <el-option v-for="(item,index) in ipsSelect"
             :label="item.params"
                   :value="item.params">
            </el-option>
          </el-select> -->
          <el-select v-model="findAssetForm.ips" placeholder="请选择网段">
            <el-option
              v-for="(item,index) in ipsSelect"
              :key="item.params"
              :label="item.params"
              :value="item.params"  class="ipsSel">
              <div style="width:250px;height: 100%;padding: 0 20px;" @mouseleave="hideCloseBtn(index)" @mouseenter="showCloseBtn(index)" >
                <span style="float: left">{{ item.params }}</span>
                <a href="javascript:;" v-show="closeIndex === index" class="closeIPS" @click="closeSingeIP(item.params)">x</a>
              </div>
            </el-option>
          </el-select>
          <el-button type="text" size="small" @click="openAddIps" style="padding:7px 10px;"><i class="el-icon-plus"></i>新增网段</el-button>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer"  style="text-align: center">
        <el-button @click=" dialogFindFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAssetFind">确 定</el-button>
      </div>
    </el-dialog>

    <!--新增网段-->
    <el-dialog title="新增网段" :visible.sync="dialogAddIPsFormVisible" width="450px">
      <el-form :model="ipsForm"  :rules="ipsRules" ref="ipsForm" label-width="80px">
        <el-form-item label="起始IP" prop="startIP">
          <el-input v-model="ipsForm.startIP"></el-input>
        </el-form-item>
        <el-form-item label="结束IP" prop="endIP">
          <el-input v-model="ipsForm.endIP"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer"  style="text-align: center">
        <el-button @click=" dialogAddIPsFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addIPs">确 定</el-button>
      </div>
    </el-dialog>



    <!--扫描状态弹窗-->
    <el-dialog :title="scantitle" :visible.sync="dialogipListFormVisible" width="450px" @click="closeStatus">
      <el-form :model="listForm"  :rules="listRules" ref="listForm" label-width="80px">
        <el-row>
          <el-col :span="12">
            <div class="scanBG" style="position: relative;">
              <span :class="{'sacanAnimate': isCompleteScan}"></span>
              <img src="../../assets/images/holeAsset.png" style="position:absolute;top: 17px;left: 15px;" width="50" class="fl">
            </div>
          </el-col>
          <el-col :span="12">
            <p class="scanTitle">{{statusMSG}}</p>
            <ul class="scanType">
              <li v-for="item in scanList"><i :class="item.state"></i>{{item.ip}}</li>
            </ul>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer"  style="text-align: center">
        <el-button type="primary" @click="closeStatus">关 闭</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import { checkEmail, isvalidateIP } from '../../utils/validate.js'
  import { assetPage, addAssetAPI, organization, assetsType, ipsParagraph, addIPs, delIPS, updateAssetAPI, scanAsset, scanPort, scanHole, scanState, holeState, portProgress, holeProgress, holeSingeProgress, scanHoleSettime, scanPortSettime, holeScanEnd } from '../../api/asset/asset.js'
  import { destroyCache, filterItems } from '../../utils/deleCache.js'

  export default {
    data() {
      const isEmail = (rule, value, callback) => {
        if (value != "") {
          if (!checkEmail(value)) {
            callback(new Error('邮箱格式错误'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      const isIp = (rule, value, callback) => {
        if (!isvalidateIP(value)) {
          callback(new Error('IP格式错误'))
        } else {
          callback()
        }
      }
      const same = (rule, value, callback) => {
        if (this.ipsForm.startIP == this.ipsForm.endIP) {
          callback(new Error('起始IP和结束IP不能相同'))
        } else {
          callback()
        }
      }
      const scanOptions = ['立即执行','扫描策略'];
      return {
        loading: true,
        multipleSelection: [],
        rowCheck: [],
        assetForm: {
          endIpQ: ''
        },
        tableHeight: 100,
        currentPage: 1,
        total: 0,
        pagesize: 15,
        tableData: [],
        dialogList: '',
        title: {
          add: '新增资产',
          update: '编辑资产'
        },
        isFalse: false,
        aTypeFilter: [],
        hTypeFilter: [{
          value: '1',
          text: '核心资产'
        },{
          value: '2',
          text: '非核心资产'
        }],
        ofNameFilter: [],
        //新增资产
        dialogFormVisible: false,
        addAssetForm: {
          assetsName: '',
          assetsType: '',
          officeId: '',
          email: '',
          assetsIp: '',
          hostType: '',
          assetsUser: '',
          remarks: ''
        },
        addAssetRules: {
          /*assetsName: [
                  { required: true, message: '请输入资产名称', trigger: 'blur' }
                ],
                assetsType: [
                  { required: true, message: '请选择设备类型', trigger: 'blur' }
                ],*/
          officeId: [
            { required: true, message: '请选择所属机构', trigger: 'blur' }
          ],
          /* email: [
                 { validator: isEmail, message: '请输入正确的邮箱格式', trigger: 'blur'}
               ],*/
          assetsIp: [
            { required: true, message: '请输入主机IP', trigger: 'blur' },
            { validator: isIp, message: '请输入正确的IP格式', trigger: 'blur'}
          ],
          hostType: [
            { required: true, message: '请选择资产类型', trigger: 'blur' }
          ],
          /*assetsUser: [
                { required: true, message: '请输入负责人', trigger: 'blur' }
              ]*/
        },
        assetsTypeSel: [],
        sysOfficesSel: {},
        //扫描
        scanStatus: false, //扫描状态
        scanType: '', //扫描类型(资产、端口、漏洞)
        scantitle: '',  //弹窗title
        //dialogStatus: 'port', //弹窗类型：端口/漏洞
        scanId: '',  //扫描任务ID
        holeArr: [], //漏洞扫描任务ID列表
        statusMSG: '',//扫描状态消息
        scanTime: '',//定时任务
        isCompleteScan: true, //正在扫描动画
        //资产发现
        assetscanIcon: '', //扫描图表
        dialogFindFormVisible: false,
        dialogAddIPsFormVisible: false,
        findAssetForm: {
          ips: ''
        },
        findAssetRules: {
          ips: [
            { required: true, message: '请选择网段', trigger: 'blur' }
          ]
        },
        ipsSelect: {},
        ipsForm: {
          startIP: '',
          endIP: ''
        },
        ipsRules: {
          startIP: [
            { required: true, message: '请输入起始IP', trigger: 'blur' },
            { validator: isIp, message: '请输入正确的IP格式', trigger: 'blur'},
            { validator: same, message: '起始IP不能与结束IP相同', trigger: 'blur'}
          ],
          endIP: [
            { required: true, message: '请输入结束IP', trigger: 'blur' },
            { validator: isIp, message: '请输入正确的IP格式', trigger: 'blur'},
            { validator: same, message: '起始IP不能与结束IP相同', trigger: 'blur'}
          ]
        },
        closeIndex: -1,
        //端口扫描
        portscanIcon: '', //扫描图表
        dialogportFormVisible: false,
        portOne: true,
        portTwo: false,
        isDis: true,
        clickdis: true,
        portForm: {
          radio1: '',
          date: ''
        },
        portRules: {},
        scanList: [],
        //漏洞扫描
        holescanIcon: '',
        holeTaskId: '', //漏洞扫描任务ID
        //扫描列表
        dialogipListFormVisible: false,
        listForm: {},
        listRules: {},
        filterName: {}
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
      officeIdFarmatter(row, column){
        const arr = row[column.property]
        var status = false;
        if(arr === null || arr === '' || arr === undefined ){
          return '—'
        } else {
          for(var i in this.ofNameFilter) {
            status = true;
            if(this.ofNameFilter[i].value == arr) {
              return this.ofNameFilter[i].text
            }
          }
        }

        if (status === false) {
          return arr
        }
      },
      current_change(currentPage) {
        this.currentPage = currentPage;
        this.assetList();
      },
      handleClick(tab, event) {

      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //设备类型转中文
      aTypeFormatter(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          for (var i in this.assetsTypeSel) {
            if (arr == this.assetsTypeSel[i].value) {
              return this.assetsTypeSel[i].label
            }
          }
        }

      },
      /*aTypeFilMet(value, row, column) {
        value = Number(value);
        const property = column['property'];
        return row[property] === value;
      },
      //资产类型
      hTypeFilMet(value, row, column) {
        const property = column['property'];
        if (value == '2' && row[property] != '1') {
          return true
        } else if(value == '1' && row[property] == '1'){
          return true
        }
      },
      //所属机构
      ofNameFilMet(value, row, column) {
        value = value.toString();
        const property = column['property'];
        return row[property] === value;
      },*/
      //筛选事件
      filterChange(filters) {
         this.filterName = filterItems(filters, this.filterName);
         this.assetList();
      },
      //资产发现
      find() {

        this.scantitle = '资产扫描';
        //clearInterval(this.scanTime);
        //是否正在进行扫描
        if (this.scanStatus === true && this.scanType == 'asset') {
          //查看扫描状态
          this.getAssetScanState(1);
        } else if (this.scanStatus === true && this.scanType != 'asset') {
          this.$message({
            message: '正在执行其他扫描任务，请稍后重试',
            type: 'warning'
          });
        } else {
          if (this.$refs['findAssetForm'] !== undefined) {
            this.$refs['findAssetForm'].resetFields();//重置验证
          }
          this.dialogFindFormVisible = true;
        }
      },
      //删除ip
      closeSingeIP(ip) {

        this.$confirm('确定删除该网段？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: false
        }).then(() => {
          var that = this;
          var param = {
            ips: ip
          }
          delIPS(param).then(res => {
            this.$message({
              message: '网段已删除',
              type: 'success'
            })
            that.ipsSelectFun();
          })
        })
      },
      showCloseBtn(index) {
        this.closeIndex = index;
      },
      hideCloseBtn(index) {
        this.closeIndex = -1;
      },
      //新增网段
      openAddIps() {
        if (this.$refs['ipsForm'] !== undefined) {
          this.$refs['ipsForm'].resetFields();//重置验证
        }
        this.dialogAddIPsFormVisible = true
      },
      addIPs() {
        this.$refs.ipsForm.validate(valid => {
          if (valid) {
            var that = this;
            var param = {
              'ips': this.ipsForm.startIP+' -- '+this.ipsForm.endIP
            }
            addIPs(param).then(res => {
              this.$message({
                type: 'success',
                message: '新增成功!'
              });
              that.dialogAddIPsFormVisible = false;
              that.ipsSelectFun();
            })
          }
        })
      },
      addAssetFind() {
        if(this.findAssetForm.ips == '') {
          this.$message({
            type: 'warning',
            message: '请选择网段'
          });
          return false;
        }
        var that = this;
        var ipsParam = {
          'ips': this.findAssetForm.ips
        }
        scanAsset(ipsParam).then(res => {
          this.$message({
            type: 'success',
            message: '正在扫描，请稍后..'
          });
          that.scanId = res.result; //资产扫描ID
          that.assetscanIcon = 'el-icon-loading';
          that.scanStatus = true;
          that.scanType = 'asset';
          that.dialogFindFormVisible = false;

          //创建定时任务
          that.scanTime = setInterval(that.getAssetScanState, 10000);
        })
      },
      getAssetScanState(num) {
        var that = this;
        var param = {
          'taskid': this.scanId
        }
        portProgress(param).then(res => {

          var data = res;
          var scanAssetsLogs = data.result.scanAssetsLogs;//资产列表
          var scanTask = data.result.scanTask;//任务列表
          var scanStatus; //扫描状态 0：排队,1：扫描中,2：扫描完成,3：扫描失败

          //if (scanAssetsLogs == null || scanAssetsLogs.length < 1) {

          scanStatus = scanTask.scanStatus;
          //} else {
          //scanStatus = scanAssetsLogs.scanStatus;
          //}

          var str = "";
          var isComplete = false;
          if (scanStatus == 2) {
            str = "扫描完成";
            isComplete = true;

          } else if (scanStatus == 1) {
            str = "正在扫描，请稍后..";
          } else if (scanStatus == 3) {
            str = "扫描失败,请稍后重试..";
            isComplete = true;
          } else if (scanStatus == 0) {
            str = "正在扫描，请稍后..";
          }

          if (num == 1) {
            this.$message({
              type: 'success',
              message: str
            });
            if (isComplete === true) {
              window.clearInterval(that.scanTime);
              that.assetscanIcon = '';
              that.scanStatus = false;
              that.scanType = '';
              this.currentPage = 1;
              that.assetList();
            }
          } else {

            if (isComplete === true) {
              this.$message({
                type: 'success',
                message: str
              });

              that.assetscanIcon = '';
              that.scanStatus = false;
              that.scanType = '';
              this.currentPage = 1;
              window.clearInterval(that.scanTime);
              that.assetList();
            }
          }
        })
      },
      //理解扫描 or 定时扫描
      /*portcheck() {
                if (this.portOne === true) {
                    this.portOne = false;
                    this.portTwo = true;
                    this.isDis = false;
                    this.clickdis = false;
                } else {
                    this.portOne = true;
                    this.portTwo = false;
                    this.isDis = true;
                    this.clickdis = true;
                }
            },*/
      isSucess() {
        this.rowCheck = this.multipleSelection;
        if (this.scanStatus === true) {
          //this.portscanIcon = 'el-icon-loading';
          this.$message({
            message: '正在执行其他扫描任务，请稍后重试',
            type: 'warning'
          });
          return false;
        }

        if (this.multipleSelection.length < 1) {
          this.$message({
            message: '请选择相应的资产',
            type: 'warning'
          });
          return false;
        } else if (this.multipleSelection.length > 15) {
          this.$message({
            message: '最多同时选择15个资产',
            type: 'warning'
          });
          return false;
        } else {
          return true;
        }
      },
      getParam () {
        var param = {}, asids = '';
        //获取选中的IP
        for (var i in this.rowCheck) {
          if (i == (this.rowCheck.length-1)) {
            asids += this.rowCheck[i].assetsIp;
          } else {
            asids += this.rowCheck[i].assetsIp+',';
          }
        }
        //参数
        if (this.portTwo == true) {
          param = {
            //'time': this.portForm.date,
            //'state': this.portForm.radio1,
            'assetsips':asids,
            'ips': asids,
          }
        } else {
          param = {
            'assetsips':asids,
            'ips': asids,
          }
        }

        return param;
      },
      //获取勾选扫描ip用于展示
      getStringIPs(param) {
        var result2 = [];
        if (param.ips.indexOf(',') != -1) {
          var l = param.ips.split(",");
          var temp = [];
          for (var i in l) {
            temp.push({
              state: 'scaning',
              ip: l[i]
            });
          }
          result2 = temp;
        } else {
          result2 = [{
            state: 'scaning',
            ip: param.ips
          }]
        }
        return result2;
      },
      getNamebyStatus(status) {
        var result = {
          name: '',
          msg: ''
        };
        if (status == 1) {
          result.name = 'scaning';
          result.msg = '扫描中,请稍后..';
        } else if (status == 2) {
          result.name = 'complete';
          result.msg = '扫描完成';
        } else if (status == 3) {
          result.name = 'fail';
          result.msg = '扫描失败';
        } else if (status == 0) {
          result.name = 'queue';
          result.msg = '扫描中,请稍后..';
        }
        return result;
      },
      port() {
        debugger
        //是否正在进行扫描
        if (this.scanStatus === true && this.scanType == 'port') {
          //查看扫描状态
          this.scantitle = '端口扫描';
          window.clearInterval(this.scanTime);
          this.getPortScanState(1);
        } else {
          var status = this.isSucess();
          if (status) {
            this.scantitle = '端口扫描';
            window.clearInterval(this.scanTime);
            this.savePortScan();
            //this.dialogStatus = 'port';
            //this.dialogportFormVisible = true;
          }
        }
      },
      savePortScan() {
        //if (this.portOne == true) {
        var that = this;
        var param = this.getParam();
        //debugger
        //获取勾选ip展示
        this.scanList = this.getStringIPs(param);

        scanPort(param).then(res => {
          //debugger
          this.$message({
            message: '任务创建成功',
            type: 'success'
          });
          that.scanId = res.result;
          that.portscanIcon = 'el-icon-loading';
          that.scanStatus = true;
          that.scanType = 'port';
          //that.dialogportFormVisible = false
          that.rowCheck = [];

          that.statusMSG = "扫描中，请稍后..";
          that.isCompleteScan = true;
          that.dialogipListFormVisible = true;

          //创建定时任务
          //that.scanTime = setInterval(that.getPortScanState, 10000);

        })
        /*} else {
                    //定时扫描
                    if (this.portForm.date == '') {
                        this.$message({
                          message: '请选择执行时间',
                          type: 'warning'
                        })
                        return false
                    } else if (this.portForm.radio1 == '') {
                        this.$message({
                          message: '请选择重复频率',
                          type: 'warning'
                        })
                        return false
                    } else {
                        var that = this;
                        var ip = this.getParam();
                        var param = {
                            'ips': ip.ips,
                            'dt': this.portForm.date,
                            'interval': this.portForm.radio1
                        }
                        scanPortSettime(param).then(res => {
                            this.$message({
                              message: '任务创建成功',
                              type: 'success'
                            });
                            that.dialogportFormVisible = false;
                            that.portForm.date = '';
                            that.portForm.radio1 = '';
                            that.portOne = true;
                            that.portTwo = false;
                        })
                    }

                }*/

      },
      getPortScanState(num) {
        var that = this;
        var param = {
          'taskid': this.scanId
        }
        portProgress(param).then(res => {

          var data = res;
          //var scanPortLogs = data.result.scanPortLogs; //端口扫描列表
          var scanTask = data.result.scanTask; //扫描任务列表
          var portStr = [], list = {}, ips = "", status = 3;
          var count = 0; //扫描完成计数

          //获取 任务状态
          /*if (scanPortLogs == null || scanPortLogs.length < 1) {
                        list = scanTask;
                        ips = "scanParam";
                    } else {
                        list = scanPortLogs;
                        ips = "ipAddr";
                    }*/

          //for (var i in scanTask) {
          var scanStatus = scanTask.scanStatus;
          //扫描状态 0排队, 1扫描中, 2扫描完成, 3扫描失败
          var statusBlack = that.getNamebyStatus(scanStatus);

          //获取状态
          if (scanStatus == 2 || scanStatus == 3) {
            window.clearInterval(that.scanTime);
            that.portscanIcon = '';
            that.scanStatus = false;
            that.scanType = '';
            that.statusMSG = '扫描完成';
            that.isCompleteScan = false;
            that.assetList();
          } else {
            that.portscanIcon = 'el-icon-loading';
            that.scanStatus = true;
            that.scanType = 'port';
            that.statusMSG = '扫描中，请稍后..';
            that.isCompleteScan = true;
          }

          //}

          if (num == 1) {

            //判断是否是多个ip
            if((scanTask["scanParam"]).indexOf(',') != -1) {
              var param = (scanTask["scanParam"]).split(',');
              for (var j = 0 ; j < param.length; j ++) {
                portStr.push({
                  state: statusBlack.name,
                  ip: param[j]
                })
              }
            } else {
              portStr.push({
                state: statusBlack.name,
                ip: scanTask["scanParam"]
              })
            }

            window.clearInterval(that.scanTime);
            that.scanList = portStr;
            that.dialogipListFormVisible = true;
          }

        })
      },

      /*//漏洞扫描
            hole() {


                //是否正在进行扫描
                if (this.scanStatus === true && this.scanType == 'hole') {
                    //查看扫描状态
                    this.scantitle = '漏洞扫描';
                    window.clearInterval(this.scanTime);
                    this.holeScanStateQuery();
                } else {
                    var status = this.isSucess();
                    if (status) {
                        this.scantitle = '漏洞扫描';
                        window.clearInterval(this.scanTime);
                        this.dialogStatus = 'hole';
                        this.dialogportFormVisible = true;
                    }
                }
            },*/
      closeStatus() {
        this.dialogipListFormVisible = false;
        window.clearInterval(this.scanTime);
        if (this.scanType == 'port') {
          this.scanTime = setInterval(this.getPortScanState, 10000);
        }
      },
      /*timeHoleScan() {

                if (this.holeArr.length < 1) {

                    var that = this;
                    var param = {
                        taskId: this.holeTaskId
                    }
                    holeProgress(param).then(res => {
                        var data = res;
                        var vulns = data.result.vulns; //获取所有ip扫描状态
                        var st = data.result.st; //获取当前任务的扫描状态

                        if (st.scanStatus == 2 || st.scanStatus == 3) {
                            that.holescanIcon = '';
                            that.scanStatus = false;
                            that.scanType = ''; //扫描类型(资产|端口|漏洞)
                            that.statusMSG = '';
                            window.clearInterval(that.scanTime);
                            this.$message({
                              message: '扫描完成',
                              type: 'success'
                            });
                        }

                    })

                } else {
                    this.getHoleScanState();
                }
            },
            saveHoleScan() {

                if (this.portOne == true) {
                    //立即扫描
                    var that = this;
                    var param = this.getParam();
                    //获取勾选ip展示
                    this.scanList = this.getStringIPs(param);
                    scanHole(param).then(res => {
                        this.$message({
                          message: '任务创建成功',
                          type: 'success'
                        });
                        that.holeTaskId = res.result.taskId; //启动任务ID
                        that.holescanIcon = 'el-icon-loading';
                        that.scanStatus = true;
                        that.scanType = 'hole';
                        that.dialogportFormVisible = false
                        that.rowCheck = [];

                        that.statusMSG = "扫描中，请稍后..";
                        that.isCompleteScan = true;
                        that.dialogipListFormVisible = true;

                        //创建定时任务
                        //that.scanTime = setInterval(that.timeHoleScan, 10000);
                    }).catch(() => {
                        this.$message({
                          message: '任务创建失败，请稍后重试..',
                          type: 'warning'
                        });
                    })
                } else {
                    //定时扫描
                    if (this.portForm.date == '') {
                        this.$message({
                          message: '请选择执行时间',
                          type: 'warning'
                        })
                        return false
                    } else if (this.portForm.radio1 == '') {
                        this.$message({
                          message: '请选择重复频率',
                          type: 'warning'
                        })
                        return false
                    } else {
                        var that = this;
                        var ip = this.getParam();
                        var param = {
                            'ips': ip.ips,
                            'dt': this.portForm.date,
                            'interval': this.portForm.radio1
                        }
                        scanHoleSettime(param).then(res => {
                            this.$message({
                              message: '任务创建成功',
                              type: 'success'
                            })
                            that.dialogportFormVisible = false;
                            that.portForm.date = '';
                            that.portForm.radio1 = '';
                            that.portOne = true;
                            that.portTwo = false;
                        })
                    }
                }

            },
            //结束批量扫描 漏洞
            scanHoleEnd() {
                var that = this;
                var param = {
                    taskId: this.holeTaskId
                }
                holeScanEnd(param).then(res => {
                    this.$message({
                      message: '已取消扫描',
                      type: 'success'
                    })
                    window.clearInterval(that.scanTime);
                    that.scanStatus = false;
                    that.scanType = '';
                    that.holescanIcon = '';
                    that.statusMSG = '';
                    that.dialogipListFormVisible = false;
                }).catch(() => {
                    this.$message({
                      message: '取消失败',
                      type: 'warning'
                    })
                })
            },
            holeScanStateQuery() {
                if (this.holeArr.length <= 0) {
                    this.holeScanState();
                } else {
                    this.holeScanStateInit()
                }
            },
            getNamebyStatus(status) {
                var result = {
                    name: '',
                    msg: ''
                };
                if (status == 1) {
                    result.name = 'scaning';
                    result.msg = '扫描中,请稍后..';
                } else if (status == 2) {
                    result.name = 'complete';
                    result.msg = '扫描完成';
                } else if (status == 3) {
                    result.name = 'fail';
                    result.msg = '扫描失败';
                } else if (status == 0) {
                    result.name = 'queue';
                    result.msg = '扫描中,请稍后..';
                }
                return result;
            },
            holeScanState() {
                var that = this;
                var param = {
                    taskId: this.holeTaskId
                }
                holeProgress(param).then(res => {
                    var data = res;
                    var vulns = data.result.vulns; //获取所有ip扫描状态
                    var st = data.result.st; //获取当前ip扫描状态

                    if (vulns == null || vulns.length < 1) {
                        if (st.scanParam) {
                            var scanParam = st.scanParam;
                            var statusBlack = this.getNamebyStatus(st.scanStatus);
                            if (scanParam.indexOf(',') != -1) {
                                var s = scanParam.split(",");
                                for (var i in s) {
                                    that.scanList.push({
                                        state: statusBlack.name,
                                        ip: s[i]
                                    });
                                }
                            } else {
                                that.scanList.push({
                                    state: statusBlack.name,
                                    ip: scanParam
                                });
                            }

                            if (st.scanStatus == 2 || st.scanStatus == 3) {
                                that.scanType = '';
                                that.holescanIcon = '';
                                that.isCompleteScan = false;
                                window.clearInterval(that.scanTime);
                            }
                            that.statusMSG = statusBlack.msg;
                            that.dialogipListFormVisible = true;
                        }

                    } else {
                        var str = "";
                        var count = 0; //完成扫描数量计数
                        var portStr = [];

                        for (var i in vulns) {
                            if (vulns[i].scanStatus == 2) {
                                count++;
                            }
                            var statusBlack = this.getNamebyStatus(vulns[i].scanStatus);
                            portStr.push({
                                state: statusBlack.name,
                                ip: vulns[i].ipAddr
                            })

                        }

                        that.scanList = portStr;
                        that.isCompleteScan = true;
                        that.statusMSG = "扫描中，请稍后..";

                        //扫描完成
                        if (count == vulns.length) {
                            that.holescanIcon = '';
                            that.scanType = '';
                            that.statusMSG = "扫描完成";
                            that.isCompleteScan = false;
                            that.scanStatus = false;
                            window.clearInterval(that.scanTime);
                        }

                        that.dialogipListFormVisible = true;

                    }
                })
            },
            getHoleStatusById(id) {
                var scanStatus = 1; //队列中
                var param = {scanId: id}
                holeSingeProgress(param).then(res => {
                    scanStatus = res.result.scanStatus;

                })
                return scanStatus;
            },
            holeScanStateInit() {
                var str = "";
                var count = 0;
                var portStr = [];

                if (this.holeArr.length > 0) {
                    for (var i in this.holeArr) {
                        var id = this.holeArr[i].id;
                        var status = this.getHoleStatusById(id); //通过ID获取状态
                        var name = '';
                        if (status == 1) {
                            name = 'scaning';
                        } else if (status == 2) {
                            name = 'complete';
                            count++;
                        } else if (status == 3) {
                            name = 'fail';
                        } else if (status == 0) {
                            name = 'queue';
                        }
                        portStr.push({
                            state: name,
                            ip: this.holeArr[i].ip
                        })

                    }

                    this.scanList = portStr;
                    this.statusMSG = "扫描中，请稍后..";

                    //扫描完成
                    if (count == this.holeArr.length) {
                        this.holescanIcon = '';
                        this.scanType = '';
                        this.statusMSG = "扫描完成";
                        this.scanStatus = false;
                        this.isCompleteScan = false;
                        window.clearInterval(this.scanTime);
                    }
                    this.dialogipListFormVisible = true;
                }
            },*/

      //查看资产、端口扫描状态(初始化)
      getScanState() {
        var that = this;
        scanState().then(res => {

          var queue = res.result.queue; //排队扫描
          var isPort = false, isAsset = false;

          //有排队或正在扫描的端口、资产
          if (queue.length > 0) {

            that.scanStatus = true; //开启扫描状态

            for (var i in queue) {

              //端口扫描ID
              if (queue[i].scanPortLogs != null) {
                isPort = true;
                for (var k in queue[i].scanPortLogs) {
                  that.scanId = queue[i].scanPortLogs[k].scanId;
                }
              } else {
                //资产扫描isAsset = true;
                isAsset = true;
                that.scanId = queue[i].scanTask.scanId;
              }

              //扫描状态 "0": "队列中", "1": "扫描中", "2": "扫描完成", "3": "扫描失败"
              var scanStatus = queue[i].scanTask.scanStatus;

              if (scanStatus == 0 || scanStatus == 1) {

                //扫描任务类型
                var scanType = queue[i].scanTask.scanType;
                if (scanType == 2) {
                  //端口扫描
                  that.portscanIcon = 'el-icon-loading';
                } else if (scanType == 3) {
                  //漏洞扫描
                  that.holescanIcon = 'el-icon-loading';
                } else if (scanType == 1) {
                  //资产扫描
                  that.assetscanIcon = 'el-icon-loading';
                }
              }


            }

            //that.scanStatus = true;

            if (isPort) {
              that.scanType = 'port';
              window.clearInterval(that.scanTime);
              that.scanTime = setInterval(that.getScanState, 10000);
            }

            if (isAsset) {
              that.scanType = 'asset';
              window.clearInterval(that.scanTime);
              that.scanTime = setInterval(that.getAssetScanState, 10000);
            }

          } else {
            that.portscanIcon = '';
            that.assetscanIcon = '';
            that.scanStatus = false;
            that.scanType = '';
            window.clearInterval(that.scanTime);
          }

        })
      },

      /*//查看漏洞扫描状态(初始化)
            getHoleScanState() {
                var that = this;
                holeState().then(res => {
                    //that.holeArr.splice(0, that.holeArr.length);
                    that.holeArr = [];

                    //正在扫描
                    if (JSON.stringify(res.result.running) != "{}") {
                        var running = res.result.running;
                        //获取扫描ip对应的任务id
                        for (var i in running) {
                            that.holeArr.push({
                                ip: i,
                                id: running[i]
                            });
                        }
                        that.scanType = 'hole';
                        that.scanStatus = true;
                        that.holescanIcon = 'el-icon-loading';
                    }
                    //队列中
                    if (res.result.queue.length > 0) {
                        var queue = res.result.queue;
                        //获取扫描ip对应的任务id
                        for (var i in queue) {
                            that.holeArr.push({
                                ip: i,
                                id: ''
                            });
                        }
                        that.scanType = 'hole';
                        that.scanStatus = true;
                        that.holescanIcon = 'el-icon-loading';
                    }

                    if (that.holeArr.length > 0) {
                        //创建定时任务
                        window.clearInterval(that.scanTime);
                        that.scanTime = setInterval(that.getHoleScanState, 10000);
                    } else {
                        window.clearInterval(that.scanTime);
                        that.scanStatus = false;
                        that.holescanIcon = '';
                        that.scanType = '';
                    }

                })
            },*/

      //资产列表、新增资产
      assetFormSearch() {
        this.currentPage = 1;
        this.assetList();
      },
      add() {
        this.dialogList = 'add';
        if (this.$refs['addAssetForm'] !== undefined) {
          this.$refs['addAssetForm'].resetFields();//重置验证
        }
        this.dialogFormVisible = true
      },
      addAsset() {

        var that = this;
        this.$refs.addAssetForm.validate(valid => {
          if (valid) {

            if (that.addAssetForm.email != '') {
              if (!checkEmail(that.addAssetForm.email)){
                 this.$message({
                  type: 'warning',
                  message: '邮箱格式错误'
                });
                return false;
              }

            } else if (that.addAssetForm.remarks != '' && that.addAssetForm.remarks.length > 200) {
                this.$message({
                  type: 'warning',
                  message: '备注信息过长，只能输入200字符以内'
                });
                return false;
            }

            addAssetAPI(that.addAssetForm).then(res => {
              this.$message({
                type: 'success',
                message: '提交成功!'
              });
              that.$refs['addAssetForm'].resetFields()//重置表单
              that.dialogFormVisible = false;
              this.currentPage = 1;
              that.assetList();
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '新增失败'
              })
            })
          }
        })
      },
      edit(index, row) {
        this.dialogList = 'update';
        if (row.assetsType) {
          row.assetsType = row.assetsType.toString(); //保持类型一直
        }
        if (row.hostType) {
          row.hostType = row.hostType.toString();
        }
        if (this.$refs['addAssetForm'] !== undefined) {
          this.$refs['addAssetForm'].resetFields();//重置验证
        }
        this.addAssetForm = Object.assign({}, row);
        this.dialogFormVisible = true
      },
      updateAsset(index, row) {
        var that = this;
        this.$refs.addAssetForm.validate(valid => {
          if (valid) {

            if (that.addAssetForm.email != null && !checkEmail(that.addAssetForm.email) ) {
                this.$message({
                  type: 'warning',
                  message: '邮箱格式错误'
                });
                return false;
            } else if (that.addAssetForm.remarks != null && that.addAssetForm.remarks.length > 200) {
                this.$message({
                  type: 'warning',
                  message: '备注信息过长，只能输入200字符以内'
                });
                return false;
            }

            updateAssetAPI(that.addAssetForm).then(res => {
              this.$message({
                type: 'success',
                message: '提交成功!'
              });
              that.$refs['addAssetForm'].resetFields()//重置表单
              that.dialogFormVisible = false;
              this.currentPage = 1;
              that.assetList();
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '修改失败'
              })
            })
          }
        })
      },
      info(index, row,  assetsTypeSel, sysOfficesSel) {
        //跳转到详情页
        this.$router.push({name:'asset_info', params: { id: row.assetsId, ip: row.assetsIp, assetType: row.assetsType, assetsTypeSel: this.assetsTypeSel, officeName: row.officeName}})
      },
      assetList() {
        var that = this;
        var param = {
          pageSize: this.pagesize,
          pageNo: this.currentPage,
          condition: this.assetForm.endIpQ,
        }
        //param = Object.assign(this.filterName, param);
        for(var i in this.filterName) {
          param[''+i] = this.filterName[i];
        }
        assetPage(param).then(res => {
          that.loading = false;
          that.tableData = [];
          that.total = 0;
          that.tableData = res.result.results;
          that.total = res.result.totalCount;
          //that.total = that.tableData.length;
          if (that.tableData.length >= 1) {
            that.tableHeight = `${document.documentElement.clientHeight}`- 205
          }
        })
      },
      assetsTypeSelet() {
        var that = this;
        assetsType().then(res => {
          that.aTypeFilter = [];
          var data = res.result.AssetsType;
          var arr = [];
          for (var i in data) {
            var temp = {
              label: data[i],
              value: i
            }
            arr.push(temp);
            that.aTypeFilter.push({
              value: i,
              text: data[i]
            });
          }
          that.assetsTypeSel = arr;
        })
      },
      organizationSelet() {
        var that = this;
        organization().then(res => {
          that.sysOfficesSel = res.result.sysOffices;

          //所属机构列表筛选数据
          that.ofNameFilter = [];
          for (var i in res.result.sysOffices) {
            that.ofNameFilter.push({
              value: res.result.sysOffices[i].officeId,
              text: res.result.sysOffices[i].officeName
            })
          }
        })
      },
      ipsSelectFun() {
        var that = this;
        ipsParagraph().then(res => {
          that.ipsSelect = res.result;
        })
      }
    },
    mounted() {

      //初始化列表
      this.assetList();

      //设备类型
      this.assetsTypeSelet();

      //所属机构
      this.organizationSelet();

      //资产发现:网段列表
      this.ipsSelectFun();

      //资产、端口扫描状态
      this.getScanState();

      //漏洞扫描状态
      //this.getHoleScanState();
    }
  }
</script>

<style>
  .asset .el-icon-core, .asset .el-icon-non-core, .el-icon-port, .el-icon-hole{
    margin-bottom:-3px;
  }
  .scandisabled, .scandisabled .el-radio{
    color:#ccc;
  }
  .clickdis{
    position: absolute;top:40px;left:0;width:100%;height:168px;background:transparent;z-index: 99;
  }
  .scanBG{
    width:80px;height:80px;background:#f0f0f0;border-radius: 100%;margin-left:25%;margin-top: 13px;
  }
  .scanTitle{
    padding:10px 0;font-size:14px;
  }
  .scanType li{
    padding:3px 0;
  }
  .closeIPS{
    float: right; color:#409EFF;font-size:13px;margin-left:20px;padding:0 5px;
  }
  .ipsSel.el-select-dropdown__item{
    padding:0!important;
  }
  .asset .el-badge__content.is-fixed{
    top:4px;
  }
  .item{
    border-top: 0px solid #dcdfe6;
  }
</style>
