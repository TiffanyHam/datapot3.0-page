<template>
  <div class="pageOverflow">

    <div class="title company_ip" style="padding:0;">
      <div class="filter-container">
        <section class="app-container">
          <el-row class="detail-title">
            <el-col :span="20">
              <router-link :to="{name:'hostDetailDetec',params:{ host: host}}" class="d-a-title"
                           style="color:#409EFF;">检测模式</router-link>|

              <router-link :to="{name:'hostDetailRele',params:{ host: host }}" class="d-a-title">关联模式</router-link>

              <!-- <router-link :to="{name:'',params:{ hostIP:hostIP }}" class="d-a-title">资产详情</router-link> -->
            </el-col>
            <el-col :span="4">
              <router-link :to="black" class="fr" style="padding-right:20px;">< 返回</router-link>
            </el-col>
          </el-row>
          <div style="padding:15px;">
            <el-row>
              <el-col :span="7" class="d-p-lineheight">
                <p>{{ host.hostName }} <i :class="{'ic_property': true, 'on': (host.isKey == 1)}"></i></p>
                <p>主机IP：{{ host.hostIp }}</p>
                <p>数据源：{{ host.source}}</p>
                <p>状态：{{ host.hostStatus == 0 ? '活动的' : '非活动的'}}</p>
                <p style="padding-top:10px;">
							<span><i class="el-icon-edit-outline"></i>
							<el-button type="text" class="d-a-padd" @click="addLabelC">标签</el-button>
							</span>
                  <span><i class="el-icon-edit-outline"></i>
							<el-button type="text" class="d-a-padd" @click="addDispost">处理</el-button>
							</span>
                  <span><i class="el-icon-sold-out"></i>
							<el-button type="text" class="d-a-padd">PCAPs</el-button>
							</span>
                </p>
              </el-col>
              <el-col :span="7">
                <div>
                  <img v-if="host.stage == 1" src="../../assets/images/threat/s1.png" width="270"/>
                  <img v-else-if="host.stage == 2" src="../../assets/images/threat/s2.png" width="270"/>
                  <img v-else-if="host.stage == 3" src="../../assets/images/threat/s3.png" width="270"/>
                  <img v-else-if="host.stage == 4" src="../../assets/images/threat/s4.png" width="270"/>
                  <img v-else-if="host.stage == 5" src="../../assets/images/threat/s5.png" width="270"/>
                  <img v-else-if="host.stage == 6" src="../../assets/images/threat/s6.png" width="270"/>
                  <img v-else-if="host.stage == 7" src="../../assets/images/threat/s7.png" width="270"/>
                  <img v-else src="../../assets/images/threat/s0.png" width="270"/>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="fr d-certainty-num">
                  <p>可信度</p>
                  <p class="num">{{host.certainty ? host.certainty : 0}}</p>
                </div>
                <div class="fr d-threat-num">
                  <p>威胁度</p>
                  <p class="num">{{host.threat ? host.threat : 0}}</p>
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
    <div class="title company_ip">
      <div class="filter-container">
        <section class="app-container host">
          <!--工具条-->
          <el-row>
            <el-col :span="24">
              <div style="line-height:30px;">
                <span class="fl">该主机检测结果:</span>
                <!--<span class="activeBtn">
                        <el-button type="primary" plain class="fl" :class="{'active': isA}" @click="isActive('0')">&nbsp;活动的&nbsp;</el-button>
                        <el-button type="primary" plain class="fl" :class="{'active': !isA}" @click="isActive('1')">非活动的</el-button>
                  </span>
                    <span class="htbl-padd fl" @click="isRest"  @mouseover="refreshIcon($event)" @mouseout="refreshIconNo($event)"><i :class="{'el-icon-refresh':true, 'h-refresh':refreshTbl}"></i><a href="javascript:;"> 重置过滤条件</a>
                    </span>-->
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
          <div class="container_table flowTabs" style="padding-top:10px;">
            <el-table
              :data="tableData"
              style="width: 100%"
              :default-sort = "{prop: '', order: ''}" v-loading="loadding" @filter-change="filterChange">
              <el-table-column
                prop="index"
                width="80"
                label="#">
                <template scope="scope">
                  <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
                </template>
              </el-table-column>

              <!-- <el-table-column
                prop="detectionTags"
                label="标签"
                width="100">
              </el-table-column> -->


              <el-table-column
                prop="stage"
                label="威胁阶段"
                :filter-multiple="isFalse"
                :filters="stageFilter"
                filter-placement="bottom-end"
                column-key="stage"
                :formatter="stageFormatter"
                width="120">
                <template slot-scope="scope">
                  <span :class="scope.row.stage | stageColor" class="stageGrede">
                      {{scope.row.stage | stageFormat}}
                  </span>
                </template>
              </el-table-column>
              <!-- :filter-method="stageThreat" -->

              <el-table-column
                prop="typeZh"
                :formatter="fmtLength"
                label="威胁类型"
                width="250">
              </el-table-column>

              <el-table-column
                prop="threat"
                :formatter="fmtLength"
                label="威胁度"
                width="100">
              </el-table-column>

              <el-table-column
                prop="certainty"
                :formatter="fmtLength"
                label="可信度"
                width="100">
              </el-table-column>

              <el-table-column
                prop="firstDetectTime"
                label="初次发现时间" :formatter="timeFormatter"
                width="150">
              </el-table-column>

              <el-table-column
                prop="detectTime"
                label="最近发现时间" :formatter="timeFormatter">
              </el-table-column>

              <!-- <el-table-column label="操作">
               <template slot-scope="scope">
                  <el-button type="text" class="btns" @click='dispost(scope.$index, scope.row)'>处理</el-button>
               </template>
             </el-table-column>-->

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

    <!--标签-->
    <el-dialog title="添加标签" :visible.sync="dialogFormVisible" width="340px">
      <el-form :model="labelForm"  :rules="rulesForm" ref="labelForm">
        <el-form-item label="所属机构" prop="offices">
          <el-select v-model="labelForm.offices" placeholder="请选择所属机构">
            <el-option v-for="item in officesSelct"
                       :key="item.officeId"
                       :label="item.officeName"
                       :value="item.officeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主机类型" prop="hostTypes">
          <el-select v-model="labelForm.hostTypes" placeholder="请选择主机类型">
            <el-option v-for="(item,index) in hostTypesSelct"
                       :key="index"
                       :label="item"
                       :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属标签" prop="hostTags">
          <el-select v-model="labelForm.hostTags" placeholder="请选择所属标签">
            <el-option v-for="(item,index) in hostTagsSelct"
                       :key="item.id"
                       :label="item.tagName"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer"  style="text-align: center">
        <el-button @click=" dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveLable">确 定</el-button>
      </div>
    </el-dialog>

    <!--处理-->
    <el-dialog title="处理" :visible.sync="dialogDispotFormVisible" width="450px">
      <el-form :model="dispotForm"  :rules="dispotRules" ref="dispotForm">
        <el-form-item label="处理方式" prop="status">
          <el-radio-group v-model="dispotForm.status" v-for="i in detectionStatus" class="host-dispot">
            <el-radio :label="i.label" :value="i.label" :disabled="i.disabled">{{ i.text }}</el-radio>
          </el-radio-group>
          <!--  <el-radio-group v-model="dispotForm.status" v-for="(i,index) in detectionStatus" class="host-dispot">
                              <el-radio :label="i" :value="index"></el-radio> -->
          <!-- <el-radio label="待处理"></el-radio>
                <el-radio label="白名单"></el-radio>
                <el-radio label="已修复"></el-radio> -->
          <!-- </el-radio-group> -->
        </el-form-item>
        <el-form-item label="处理说明" prop="remarks">
          <el-input type="textarea" class="fl" v-model="dispotForm.remarks" :disabled="isDisabled" style="width:80%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer"  style="text-align: center">
        <el-button @click=" dialogDispotFormVisible = false ">取 消</el-button>
        <!-- <el-button type="primary" v-if="status == '1' || status == '2' ">确 定</el-button> -->
        <el-button type="primary" @click="saveDispot">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
  import echarts from 'echarts'
  import { timestampToTime } from '../../utils/time.js'
  import { gethostDatailPage, getLabelData, addLabel, getDispotData, saveDispotData, hostInfomtion, gethostPage, getFlowChart  } from '../../api/host/host.js'
  import { destroyCache, filterItems } from '../../utils/deleCache.js'

  export default {
    filters: {
      stageFormat(num) {
        const stageMap = {
          1: '侦查',
          2: '武装',
          3: '投递',
          4: '突破',
          5: '安装',
          6: '控制',
          7: '攻击',
        }
        return stageMap[num]
      },
      stageColor(num) {
        const stageMap = {
          1: 'roundBgc_1',
          2: 'roundBgc_2',
          3: 'roundBgc_3',
          4: 'roundBgc_4',
          5: 'roundBgc_5',
          6: 'roundBgc_6',
          7: 'roundBgc_7',
        }
        return stageMap[num]
      }
    },
    data() {
      return {
        black: {},
        loadding: true,
        host: '',
        hostIP: '',
        hostName: '',
        hostStatus: '',
        hostThreatId: '',
        hostInfo: '',
        deteTypes: '',
        dataSources: '',
        charts: '',
        downData: [],
        upData: [],
        timeData: [],
        isFalse: false,
        tableHeight: 100,
        stageFilter: [],
        currentPage: 1,
        total: 0,
        pagesize: 10,
        isA: true,
        refreshTbl: false,
        form: {
          typeZh: ''
        },
        tableData: [],
        stageInfos: [],
        stageName: {},
        queryTime: '2',
        queryurl: 'om/oct/week',
        isKey: '',
        btn:[{'name':'1天', 'index':1, 'isCur':true},
          {'name':'1周', 'index':2, 'isCur':false},
          {'name':'2周', 'index':3, 'isCur':true},
          {'name':'1个月', 'index':4, 'isCur':true}],
        //标签
        dialogFormVisible: false,
        officesSelct: [],
        hostTypesSelct: {},
        hostTagsSelct: [],
        labelForm: {
          offices: '',
          hostTags: '',
          hostTypes: ''
        },
        rulesForm:{},
        //处理
        dialogDispotFormVisible: false,
        dispotForm: {
          status: '',
          remarks: ''
        },
        detectId: '',
        dispotRules: {},
        status: '',
        dId: '',
        remarks: '',
        detectionStatus: {},
        isDisabled: false,
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
        this.getDetecList();
      },
      //威胁阶段过滤
      /*stageThreat(value, row, column) {
        //debugger
        const property = column['property'];
        value = Number(value);
        return row[property] === value;
      },*/
      //筛选事件
      filterChange(filters) {
         this.filterName = filterItems(filters, this.filterName);
         this.getDetecList();
      },
      //威胁阶段数字转中文
      stageFormatter(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          var stage = this.stageName;
          for (var i in stage) {
            if (i == arr) {
              return stage[i];
            }
          }
        }
      },
      //时间戳转时间
      timeFormatter(row, column) {
        var data = row[column['property']];
        if(data === null || data === '' || data === undefined){
          return '—'
        } else {
          data = timestampToTime(data);
          return data;
        }
      },
      //标签
      addLabelC() {
        var that = this;
        var param = {
          'hostName': this.hostName
        }
        if (this.$refs['labelForm'] !== undefined) {
           this.$refs['labelForm'].resetFields();//重置验证
        }
        getLabelData(param).then(res => {
          that.officesSelct = res.result.offices;
          that.hostTagsSelct = res.result.hostTags;
          that.hostTypesSelct = res.result.hostTypes;

          that.dialogFormVisible = true;
          
        })
      },
      saveLable() {

        if (this.labelForm.offices == "") {
          this.$message({
            message: '请选择所属机构',
            type: 'warning'
          });
          return false;
        }
        if (this.labelForm.hostTypes == "") {
          this.$message({
            message: '请选择主机类型',
            type: 'warning'
          });
          return false;
        }
        if (this.labelForm.hostTags == "") {
          this.$message({
            message: '请选择所属标签',
            type: 'warning'
          });
          return false;
        }
        var that = this;
        var param = {
          "officeId": this.labelForm.offices,
          "hostTypeId": this.labelForm.hostTypes,
          "hostTags": this.labelForm.hostTags,
          "hostName": this.hostName,
          "hostIp": this.host.hostIp,
          "hostId": ''
        }
        addLabel(param).then(res => {
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          that.dialogFormVisible = false;
        })
      },
      dispotWin(res) {

        var that = this;
        if (res.result.info != null) {
          //that.dispotForm.status = res.result.info.dealStatus;
          that.dId = res.result.info.id;
          that.dispotForm.remarks = res.result.info.remarks;
          if (res.result.info.dealStatus == 0) {
            //待修复
            that.detectionStatus = [{
              label: 0,
              text: '待处理',
              disabled: false
            }, {
              label: 1,
              text: '白名单',
              disabled: false
            }, {
              label: 2,
              text: '已修复',
              disabled: false
            }]
            that.dispotForm.status = 0;
            that.isDisabled = false;
          } else if (res.result.info.dealStatus == 1) {
            //白名单
            that.detectionStatus = [{
              label: 0,
              text: '待处理',
              disabled: true
            }, {
              label: 1,
              text: '白名单',
              disabled: false
            }, {
              label: 2,
              text: '已修复',
              disabled: true
            }]
            that.dispotForm.status = 1;
            that.isDisabled = true;

          } else if (res.result.info.dealStatus == 2) {
            //已修复
            that.detectionStatus = [{
              label: 0,
              text: '待处理',
              disabled: true
            }, {
              label: 1,
              text: '白名单',
              disabled: true
            }, {
              label: 2,
              text: '已修复',
              disabled: false
            }]
            that.dispotForm.status = 2;
            that.isDisabled = true;
          }

        } else {
          //that.status = '';
          that.dId = '';
          //that.remarks = '';
          that.isDisabled = false;
          that.dispotForm.status = '';
          that.dispotForm.remarks = '';
          that.detectionStatus = [{
            label: 0,
            text: '待处理',
            disabled: false
          }, {
            label: 1,
            text: '白名单',
            disabled: false
          }, {
            label: 2,
            text: '已修复',
            disabled: false
          }]
          //that.detectionStatus = res.result.detectionStatus;
        }
        that.dialogDispotFormVisible = true;
      },
      //处理
      addDispost() {
        var that = this;
        var param = {
          "hostThreatId": this.hostThreatId
        }
        this.detectId = this.hostThreatId;
        getDispotData(param).then(res => {
          that.dispotWin(res);

        })
      },
      dispost(index, row) {
        var that = this;
        var param = {
          "hostThreatId": row.hostThreatId
        }
        this.detectId = row.hostThreatId;
        getDispotData(param).then(res => {
          that.dispotWin(res);
        })
      },
      saveDispot() {
        if (this.dispotForm.status == '') {
          this.$message({
            message: '请选择处理方式',
            type: 'warning'
          });
          return false;
        }
        if (this.dispotForm.remarks == '') {
          this.$message({
            message: '请添加处理说明',
            type: 'warning'
          });
          return false;
        }
        var that = this;
        var param = {
          "hostThreatId": this.detectId,
          "id": this.dId,
          "dealStatus": this.dispotForm.status,
          "remarks": this.dispotForm.remarks
        }
        saveDispotData(param).then(res => {
          this.$message({
            message: '处理成功',
            type: 'success'
          });
          that.dialogDispotFormVisible = false;
        })
      },
      isActive(num) {
        this.isA = !this.isA;
        this.hostStatusReq = num;
        this.currentPage = 1;
        this.getChart();
        //this.getDetecList();
      },
      isRest() {
        this.isA = true;
        this.hostStatusReq = '';
        this.queryTime = '2';
        this.isKey = '';
        this.form.typeZh = '';
        this.pagesize = 10;
        this.currentPage = 1;
        this.getChart();
        //this.getDetecList();
      },
      refreshIcon(event) {
        this.refreshTbl = true;
      },
      refreshIconNo(event) {
        this.refreshTbl = false;
      },
      getDetecList() {
        var that = this;
        var param = {
          'queryTime': this.queryTime, // 查询时间
          'isKey': this.isKey,  // 是否是核心资产
          'typeZh': this.form.typeZh,  // 威胁类型
          'stage': '', // 行为阶段
          'sortName': 'DetectTime', //排序字段
          'order': 'DESC', //排序（DESC、ASC）
          'detectionTypes': '', //所有威胁类型
          'hostStatus': this.hostStatusReq, //活动、非活动
          'hostIp': this.host.hostIp,
          'detectId': this.host.detectId,
          'numPerPage': this.pagesize,
          'pageNum': this.currentPage
        }
        //param = Object.assign(this.filterName, param);
        if (this.filterName.stage) {
          param.stage = this.filterName.stage
        }
        gethostDatailPage(param).then(res => {

          that.loadding = false;
          that.tableData = res.result.infos.results;
          that.total = res.result.infos.totalCount;
          if (that.tableData != null) {
            that.tableHeight = 390
          }
          that.stageFilter = [];
          that.stageName = res.result.stageMap;
          for (var i in that.stageName) {
            this.stageFilter.push({
              value: i,
              text: that.stageName[i]
            });
          }
        })
        /*var param = {
                    'stageQ': '',
                    'dealStatusQ': '',
                    'isKeyQ': this.isKeyReq,
                    'hostNameQ': '',
                    'typeZhQ': '',
                    'hostStatus': this.hostStatusReq,
                    'hostIp': this.host.hostIp,
                    'numPerPage': this.pagesize,
                    'pageNum': this.currentPage,
                    'queryTime': this.queryTime, // 查询时间
                  }
                  gethostPage(param).then(res => {
                      that.loadding = false;
                      that.tableData = res.result.info.results;
                      that.total = res.result.info.totalCount;
                      //that.created();
                      if (that.tableData.length >= 1) {
                         that.tableHeight = 400
                      }

                      that.stageFilter = [];
                      that.stageName = res.result.stages;
                        for (var i in that.stageName) {
                          this.stageFilter.push({
                            value: i,
                            text: that.stageName[i]
                          });
                      }
                  //折线图

                  //清空
                  //that.certaintyData.length > 0 ?
                  //that.certaintyData.splice(0, that.certaintyData.length) : ''

                  //that.threatData.length > 0 ?
                  //that.threatData.splice(0, that.threatData.length) : ''

                  //that.timeData.length > 0 ?
                  //that.timeData.splice(0, that.timeData.length) : ''


                  /*var dLine = res.result.detectionThreatLine;
                    for(var i in dLine){
                        that.certaintyData.push(dLine[i].certainty);
                        that.threatData.push(dLine[i].threat);
                        that.timeData.push(dLine[i].detectTime);
                    }
                  that.drawChart();*/

        //获取标签名
        /*that.stageName = {};
                    that.stageName = res.result.stageMap;
                    for (var i in that.stageName) {
                      this.stageFilter.push({
                        value: i,
                        text: that.stageName[i]
                      });
                  }*/

        //table
        /*that.tableData = res.result.infos.results;
                  that.created();
                  if (that.tableData.length >= 1) {
                      that.tableHeight = 400
                  }
              })*/

      },
      //初始化主机信息
      gethostInfo(){
        var that = this;
        var param = {
          'hostIp': this.hostIP,
          'hostStatus': this.hostStatus
        }
        hostInfomtion(param).then(res => {
          that.hostInfo = res.result.hostJoinDetect;
          that.deteTypes = res.result.detectionTypes;
          that.dataSources = res.result.dataSources;

        })
      },
      changeChart(index) {
        //this.queryTime = index;
        for (var i = 1; i <= this.btn.length; i++) {
          if (i == index) {
            this.btn[(i-1)].isCur = false
          } else {
            this.btn[(i-1)].isCur = true
          }
        }

        if (index == '1') {
          //1天
          this.queryurl = 'om/oct/day';
        } else if (index == '2') {
          //1周
          this.queryurl = 'om/oct/week';
        } else if (index == '3') {
          //2周
          this.queryurl = 'om/oct/2week';
        }  else if (index == '4') {
          //1月
          this.queryurl = 'om/oct/month';
        }
        this.queryTime = index;
        this.getChart();
      },
      getChart() {
        var that = this;
        var param = {
          'srcip': this.hostIP,
          'dstip': ''
        }

        getFlowChart(param, this.queryurl).then(res => {

          var result = res.result;

          that.upData.length > 0 ?
            that.upData.splice(0, that.upData.length) : ''

          that.downData.length > 0 ?
            that.downData.splice(0, that.downData.length) : ''

          that.timeData.length > 0 ?
            that.timeData.splice(0, that.timeData.length) : ''

          for(var i in result) {
            result[i].up > 0 ? result[i].up = (result[i].up/(1024*1024)).toFixed(4) : result[i].up = result[i].up;
            result[i].down > 0 ? result[i].down = (result[i].down/(1024*1024)).toFixed(4) : result[i].down = result[i].down;
            that.upData.push(result[i].up);
            that.downData.push(result[i].down);
            that.timeData.push(result[i].time);
          }
          that.drawChart();
          this.getDetecList();
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
          /*grid: {
                      left: '10px',
                      right: '20px',
                      bottom: '10px',
                      top: '30px',
                      containLabel: true,
                  },*/
          grid: {
            left: '10px',
            right: '3%',
            bottom: '10px',
            top:'30px',
            containLabel: true
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
              name : '流量(m)',
              nameTextStyle: {
                color: '#666'
              },
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
              name:'下行',
              type:'line',
              stack: '总量',
              //symbol:'none',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              showSymbol: false,
              data:this.downData, //可信度
              areaStyle:{
                normal:{
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#f9eedf'
                  }, {
                    offset: 0.8,
                    color: '#f9eedf'
                  }]),
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
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
              name:'上行',
              type:'line',
              stack: '总量',
              data:this.upData, //威胁度
              //symbol:'none',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              showSymbol: false,
              areaStyle:{
                normal:{
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#bde2f6'
                  }, {
                    offset: 0.8,
                    color: '#bde2f6'
                  }]),
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
      },
      saveHostIP() {


        //返回按钮
        var balceLink = '';
        this.$route.params.black == undefined ? balceLink = localStorage.getItem('black') : balceLink = this.$route.params.black;
        this.black = {path : balceLink};
        localStorage.setItem('black', balceLink);

        //主机页信息
        /*this.$route.params.host == undefined ? this.host = localStorage.getItem('host') : this.host = this.$route.params.host;
              localStorage.setItem('host', this.host);

                localStorage.setItem('host', this.host);*/

        if (this.$route.params.host) {
          this.host = this.$route.params.host;
          localStorage.setItem('hostInfo', JSON.stringify(this.host));
        } else {
          var obj = localStorage.getItem('hostInfo');
          obj = JSON.parse(obj);
          this.host = obj;
        }

        this.hostIP = this.host.hostIp
        this.hostName = this.host.hostName
        this.hostStatus = this.host.hostStatus
        this.hostThreatId = this.host.hostThreatId

        //初始化页面
        //this.getDetecList();
        this.getChart();

        //初始化主机信息
        this.gethostInfo();
      }
    },
    mounted() {
      //hostIP
      this.saveHostIP();

      //echart width and height
      this.$refs.chart.style.width = (`${document.documentElement.clientWidth}`-240)+'px';
      this.$refs.chart.style.height = '200px';

    }
  }
</script>
<style>
  .host-dispot .el-radio__label{
    padding-left:5px;
  }
  .host-dispot .el-radio{
    margin-right:10px;
  }
  .stageGrede{
    padding:3px 7px;color:#fff;font-size:12px;border-radius:3px;
  }
</style>
