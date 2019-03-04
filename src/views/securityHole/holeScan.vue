<template>
  <div class="pageOverflow" style="height:88%;">
    <div class="title company_ip asset" style="padding:10px 0;">
      <div class="filter-container">
        <section class="app-container">
          <el-row>
            <el-col :span="24">
              <div class="fl">
                <div class="a-con">
                  <el-button type="primary" @click="hole">
                    <i class="el-icon-hole" style="margin:0px 5px -4px 0;"></i>漏洞扫描 <i :class="holescanIcon"></i></el-button>
                </div>
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
                          style="width: 100%" @selection-change="handleSelectionChange"  @filter-change="filterChange">
                  <el-table-column
                    prop="" width="80"
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
                    width="150">
                    <template slot-scope="scope">
                      <router-link :to="{name:'holeScanInfo', params: {info: scope.row} }">
                        <el-button
                          type="text"
                          size="small" style="padding:7px 0;">
                          {{scope.row.assetsName}}
                        </el-button>
                      </router-link>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="assetsIp"
                    label="主机IP"
                    :formatter="fmtLength"
                    width="150">
                  </el-table-column>

                  <el-table-column
                    prop="assetsType"
                    label="设备类型"
                    :formatter="aTypeFormatter"
                    :filter-multiple="isFalse"
                    :filters="aTypeFilter"
                    filter-placement="bottom-end"
                    column-key="assetsType"
                    width="150"
                    :show-overflow-tooltip="true">
                  </el-table-column>
                  <!-- :filter-method="aTypeFilMet" -->

                  <el-table-column
                    prop="hostType"
                    :formatter="fmtLength"
                    label="资产类型"
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
                    :formatter="officeIdFarmatter"
                    label="所属机构"
                    :filter-multiple="isFalse"
                    :filters="ofNameFilter"
                    filter-placement="bottom-end"
                    column-key="officeId" 
                    width="150"
                    :show-overflow-tooltip="true">
                  </el-table-column>
                  <!-- :filter-method="ofNameFilMet" -->

                  <el-table-column
                    prop="remarks"
                    :formatter="fmtLength"
                    label="备注"
                    :show-overflow-tooltip="true">
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
        </section>
      </div>
    </div>

    <!--漏洞扫描-->
    <el-dialog title="漏洞扫描" :visible.sync="dialogportFormVisible" width="450px">
      <el-form :model="portForm"  :rules="portRules" ref="portForm" label-width="30px" style="height:220px;">
        <el-form-item label="">
          <a href="javascript:;" :class="{'radios-checkbox': true, 'on': portOne}" @click="portcheck"><i></i></a> 立即执行
        </el-form-item>
        <el-form-item label="" style="position: relative;">
          <a href="javascript:;" :class="{'radios-checkbox': true, 'on': portTwo}" @click="portcheck"><i></i></a> 扫描策略
          <div :class="{'clickdis': clickdis}" ></div>
          <div :class="{'scandisabled': isDis}" >
            <div style="padding-left:30px;">
              执行时间：
              <!-- <el-time-select v-model="portForm.date" :picker-options="{
                                  start: '00:00',
                                  step: '01:00',
                                  end: '23:00'
                                }" placeholder="选择时间"></el-time-select> -->
              <el-time-picker
                arrow-control
                v-model="portForm.date"
                placeholder="选择时间"
                value-format="HH:mm">
              </el-time-picker>
            </div>
            <div style="padding-left:30px;">重复频率：
              <el-row>
                <el-col :span="12"><el-radio v-model="portForm.radio1" label="0">不重复</el-radio></el-col>
                <el-col :span="12"><el-radio v-model="portForm.radio1" label="1">每天一次</el-radio></el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><el-radio v-model="portForm.radio1" label="7">每周一次</el-radio></el-col>
                <el-col :span="12"><el-radio v-model="portForm.radio1" label="30">每月一次</el-radio></el-col>
              </el-row>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer"  style="text-align: center">
        <el-button @click=" dialogportFormVisible = false ">取 消</el-button>
        <el-button type="primary" @click="saveHoleScan">确 定</el-button>
      </div>
    </el-dialog>

    <!--扫描状态弹窗-->
    <el-dialog title="漏洞扫描" :visible.sync="dialogipListFormVisible" width="450px" @click="closeStatus">
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
        <el-button type="primary" v-show="scanStatus == true " @click="scanHoleEnd">取消扫描</el-button>
        <el-button type="primary" @click="closeStatus">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { assetPage, addAssetAPI, organization, assetsType,  scanHole, scanState, holeState, holeProgress, holeSingeProgress, scanHoleSettime, scanPortSettime, holeScanEnd } from '../../api/asset/asset.js'
  import { destroyCache, filterItems } from '../../utils/deleCache.js'

  export default {
    data() {
      return {
        holescanIcon: '',
        dialogportFormVisible: false,
        portForm: {},
        portRules: {},
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
        //漏洞扫描
        holescanIcon: '',
        holeTaskId: '', //漏洞扫描任务ID
        //扫描列表
        dialogipListFormVisible: false,
        listForm: {},
        listRules: {},
        //扫描
        scanStatus: false, //扫描状态
        scanType: '', //扫描类型(资产、端口、漏洞)
        scantitle: '',  //弹窗title
        dialogStatus: 'hole', //弹窗类型：端口/漏洞
        scanId: '',  //扫描任务ID
        holeArr: [], //漏洞扫描任务ID列表
        statusMSG: '',//扫描状态消息
        scanTime: '',//定时任务
        isCompleteScan: true,
        filterName: {}
      }
    },
    methods: {
      fmtLength(row, column){
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined ){
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
        if(arr === null || arr === '' || arr === undefined ){
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
      //资产类型
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
      //所属机构
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
      //理解扫描 or 定时任务
      portcheck() {
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
      },
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
        } else if (this.multipleSelection.length > 10) {
          this.$message({
            message: '最多同时选择10个资产',
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
      //关闭扫描
      closeStatus() {
        this.dialogipListFormVisible = false;
        window.clearInterval(this.scanTime);
        if (this.scanType == 'hole') {
          this.scanTime = setInterval(this.timeHoleScan, 10000);
        }
      },
      //定时获取扫描状态
      timeHoleScan() {

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
        //debugger
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

          that.scanList = [];
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
                that.scanStatus = false;
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
      },
      //漏洞扫描
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
      },
      //查看漏洞扫描状态(初始化)
      getHoleScanState() {
        var that = this;
        holeState().then(res => {
          //debugger
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
      },
      //资产搜索
      assetFormSearch() {
        this.currentPage = 1;
        this.assetList();
      },
      //资产列表
      assetList() {
        var that = this;
        var param = {
          pageSize: this.pagesize,
          pageNo: this.currentPage,
          condition: this.assetForm.endIpQ
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
          //var vnode = this.$vnode;
          //destroyCache(vnode);
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

      //初始化漏洞扫描状态
      this.getHoleScanState();
    }
  }
</script>
<style>
  .radios-checkbox{
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 1px solid #ccc;
    border-radius: 2px;
    margin-bottom: -3px;
    margin-right: 7px;
    background:#fff;
    position: relative;
  }
  .radios-checkbox.on{
    background:#409eff;
    border:1px solid #409eff;
  }
  .radios-checkbox i{
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    content: "";
    border: 1px solid #fff;
    border-left: 0;
    border-top: 0;
    height: 7px;
    left: 4px;
    position: absolute;
    top: 1px;
    width: 3px;
    -webkit-transition: -webkit-transform .15s ease-in .05s;
    transition: -webkit-transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s,-webkit-transform .15s ease-in .05s;
    -webkit-transform-origin: center;
    transform-origin: center;
    -webkit-transform: rotate(45deg) scaleY(1);
    transform: rotate(45deg) scaleY(1);
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
</style>
