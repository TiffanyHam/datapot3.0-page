<template>
  <div class="pageOverflow">
    <!--坐标chart-->
    <div class="title company_ip" style="padding:0;">
      <div class="filter-container">
        <section class="app-container">
          <el-row>
            <el-col :span="12"><div class="th-status g-a fl"></div><div class="g-count-a fl"><span class="g-c-a">{{ stageGrandheight}}</span>主机</div></el-col>
            <el-col :span="12"><div class="th-status g-h fr"></div><div class="g-count-h fr"><span class="g-c-h">{{ stageGrandanxious }}</span>主机</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="coor">
                <!--上-->
                <div class="coor-topPoint">
                  <div class="hostZ-x">0</div><div class="hostZ-x">10</div><div class="hostZ-x">20</div>
                  <div class="hostZ-x">30</div><div class="hostZ-x">40</div><div class="hostZ-x">50</div>
                  <div class="hostZ-x">60</div><div class="hostZ-x">70</div><div class="hostZ-x">80</div>
                  <div class="hostZ-x"><div class="fl">90</div><div class="fr">100</div></div>
                </div>
                <!--中-->
                <div class="coor-chart" ref="coorChart" style="position: relative;" v-loading="fullscreenLoading">
                  <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <line stroke-linecap="null" stroke-linejoin="null" id="svg_1" y2="100%" x2="50.5%" y1="0" x1="50.5%" fill-opacity="null" stroke-opacity="null" stroke-width="1" stroke="#ccc" fill="none"></line>
                    <line stroke-linecap="null" stroke-linejoin="null" id="svg_1" y2="49.5%" x2="100%" y1="49.5%" x1="0" fill-opacity="null" stroke-opacity="null" stroke-width="1" stroke="#ccc" fill="none"></line>
                  </svg>
                  <!--点-->
                  <!-- {{ hostPoint }} -->
                  <div class="pointListCon">
                    <div v-for="item in hostPoint" class="hostPoint" :style="{'top': item.top+'px', 'left': item.left+'px'}">
                        <a href="javascript:;" class="roundBg round_m posRe" :style="{'background-color': ''+item.aClass}">
                            <i :class="item.iClass" @click="hostPointInfo(item, $event)"></i>
                        </a>
                    </div>
                  </div>
                  <!--集合点弹窗-->
                  <div id="mask" v-show="mask" @click="hideMask" style="width:100%;height: 400px;background:rgba(255, 255, 255, 0.7);position:absolute;top:0;left:0;">

                      <!--出发点-->
                      <div class="hostPoint" :style="{'top': newPointerLabel.top+'px', 'left': newPointerLabel.left+'px'}">
                          <a href="javascript:;" class="roundBg round_m posRe" :style="{'background-color': ''+newPointerLabel.aClass}">
                              <i class="close_i" @click="hideMask"></i>
                          </a>
                      </div>

                      <!--发散点-->
                      <div v-for="item in pointerMask" class="hostPoint anmationPoint" :style="{'top': item.top+'%', 'left': item.left+'%'}">
                        <a href="javascript:;" class="roundBg round_m posRe" :style="{'background-color': ''+item.aClass}">
                            <i :class="item.iClass" @click="hostPointInfo(item, $event)"></i>
                        </a>
                       </div>

                       <!--线-->
                        <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
                          <line v-for="otem in linesMask" stroke-linecap="null" stroke-linejoin="null" class="anmationLine" :id="otem.index" :y2="otem._RndNumTop" :x2="otem._RndNumLeft" :y1="otem.newPointer_y" :x1="otem.newPointer_x" fill-opacity="null" stroke-opacity="null" stroke-width="1" stroke="#bbb" fill="none"></line>
                        </svg>
                  </div>

                  <!--点弹窗-->
                  <div class="coorPointInfo" v-show="singePointer" :style="{'z-index': 999, 'position': 'absolute', 'top': coorPointInfo.top+'px', 'left': coorPointInfo.left+'px' }">
                    <!-- <el-button type="primary" circle class="fr" @click="closeSinge" style="padding: 2px 5px;">x</el-button> -->
                    <el-button type="text" icon="el-icon-close" @click="closeSinge" class="fr"></el-button>
                    <div class="coorPointInfo_con" style="clear:both;">
                        <el-row>
                          <el-col :span="12">
                              <p class="t-h3">主机名：
                              {{coorPointInfo.name}} <i :class="coorPointInfo.label_property"></i></p>
                              <p> 主机IP：{{coorPointInfo.ip}}</p>
                          </el-col>
                          <el-col :span="12">
                              <div class="fl text-c">威胁度<span class="t_radius">{{coorPointInfo.threatMax}}</span></div>
                              <div class="fl text-c">可信度 <span class="t_radius">{{coorPointInfo.certaintyMax}}</span></div>
                          </el-col>
                        </el-row>
                        <!-- <p style="clear:both;">最新检测结果：</p> -->
                        <div id="hostPointPList" ref="hostPointPList">
                          <p v-for="g in hostPointPList">
                          <span class="attackType stageGrede" :style="{'background': g.bg}">{{g.stage}}</span> {{g.typeZh}}
                          </p>
                        </div>
                        <div id="singleHostChart" ref="singleHostChart" style="width:100%;height:100px;margin:10px 0;"></div>
                      </div>
                    </div>
                </div>
                <!--右-->
                <div class="coor-rightPoint">
                  <div class="hostZ-y">90</div><div class="hostZ-y">80</div><div class="hostZ-y">70</div>
                  <div class="hostZ-y">60</div><div class="hostZ-y">50</div><div class="hostZ-y">40</div>
                  <div class="hostZ-y">30</div><div class="hostZ-y">20</div><div class="hostZ-y">10</div>
                  <div class="hostZ-y">0</div>
                </div>
                <!--左-->
                <div class="coor-leftLable">
                  <p>威</p><p>胁</p><p>值</p>
                </div>
                <!--下-->
                <div class="coor-bottLabel">可信值</div>
                <i class="coor-topFlow el-icon-caret-top"></i>
                <i class="coor-rightFlow el-icon-caret-right"></i>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><div class="th-status g-l fl"></div><div class="g-count-l fl"><span class="g-c-l">{{ stageGrandlow }}</span>主机</div></el-col>
            <el-col :span="12"><div class="th-status g-m fr"></div><div class="g-count-m fr"><span class="g-c-m">{{ stageGrandmiddle }}</span>主机</div></el-col>
          </el-row>

        </section>
      </div>
    </div>

    <!-- <el-button type="primary" @click="info">跳转详情页test</el-button> -->

    <!--table-->
    <div class="title company_ip" style="margin-bottom:10px;">
      <div class="filter-container">
        <section class="app-container host"  v-loading="loading">
          <!--工具条-->
          <el-row>
            <el-col :span="12">
              <div style="line-height:30px;">
                <span class="fl">主机状态：</span>
               <!--  <el-button type="primary" plain class="fl" :class="{'active': isA}" @click="isActive('0')">&nbsp;活动的&nbsp;</el-button>
               <el-button type="primary" plain class="fl" :class="{'active': isB}" @click="isActive('1')">非活动的</el-button> -->
               <span class="activeBtn">
                  <el-button type="primary" plain class="fl" :class="{'active': isA}" @click="isActive('0')">&nbsp;活动的&nbsp;</el-button>
                  <el-button type="primary" plain class="fl" :class="{'active': !isA}" @click="isActive('1')">非活动的</el-button>
               </span>
                <span class="htbl-padd fl" @click="isProperty">
                  <i :class="{'ic_property': true, 'on': isKeyTbl}"></i><a href="javascript:;"> 仅显示核心资产</a></span>
                <span class="htbl-padd fl" @click="isRest" @mouseover="refreshIcon($event)" @mouseout="refreshIconNo($event)">
                 <i :class="{'el-icon-refresh':true, 'h-refresh':refreshTbl}"></i><a href="javascript:;"> 重置过滤条件</a>
                </span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="fr">
                <el-form :inline="true" ref="form" :model="form">
                  <el-form-item>
                    <el-input placeholder="请输入主机名" v-model="form.hostName"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="searchItem">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>

          <!--主机表-->  <!-- :height="tableHeight" -->
          <div class="container_table flowTabs">
            <el-table
              :data="tableData"
              style="width: 100%"
              :default-sort = "{prop: '', order: ''}"  @filter-change="filterChange">
              <el-table-column
                prop="" width="80"
                label="#">
                <template scope="scope">
                  <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
                </template>
              </el-table-column>

             <!--  <el-table-column
               prop="detectionTags" width="100"
               label="标签">
             </el-table-column> -->

              <el-table-column
                prop="hostName"
                :formatter="fmtLength"
                label="主机名"
                width="160">
                <template scope="scope">
                 <!--  <span class="roundBg" :class="scope.row.stage | stageColor" style="margin-bottom:-3px;"><i class="host_i"></i></span> -->
                  <router-link :to="{name:'hostDetailDetec', params: { host: scope.row, black: '/host'} }"
                               class="d-a-title" style="color:#409EFF;padding:0;">{{ scope.row.hostName }}</router-link>
                </template>
              </el-table-column>

              <el-table-column
                prop="hostIp"
                :formatter="fmtLength"
                label="主机IP"
                width="140">
              </el-table-column>

              <el-table-column
                prop="typeZh"
                :formatter="fmtLength"
                label="威胁类型"
                width="140"
                :show-overflow-tooltip="true">
                <template scope="scope">
                  <router-link :to="{name:'detectionDetail', params: { host: scope.row }}"
                               class="d-a-title" style="color:#409EFF;padding:0;">{{scope.row.typeZh}}</router-link>
                </template>
              </el-table-column>

              <el-table-column
                prop="stage"
                label="威胁阶段"
                :formatter="fmtLength"
                :filter-multiple="isFalse"
                :filters="stageFilter"
                filter-placement="bottom-end"
                column-key="stage"
                width="150" align="center">
                <template slot-scope="scope">
                  <span :class="scope.row.stage | stageColor" class="stageGrede">
                      {{scope.row.stage | stageFormat}}
                  </span>
                </template>
              </el-table-column>
              <!-- :filter-method="stageThreat"  -->

              <el-table-column
                prop="threat"
                label="威胁度"
                :formatter="fmtLength"
                width="90">
              </el-table-column>

              <el-table-column
                prop="certainty"
                label="可信度"
                :formatter="fmtLength"
                width="90">
              </el-table-column>

              <el-table-column
                prop="detectTime"
                width="150"
                label="最近发现时间" :formatter="timeFormatter">
              </el-table-column>


              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" class="btns" @click='addDispost(scope.$index, scope.row)'>处理</el-button>
                </template>
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

      <!--处理-->
      <el-dialog title="处理" :visible.sync="dialogDispotFormVisible" width="450px">
          <el-form :model="dispotForm"  :rules="dispotRules" ref="dispotForm">
            <el-form-item label="处理方式" prop="status">
             <el-radio-group v-model="dispotForm.status" v-for="i in detectionStatus" class="host-dispot">
                <el-radio :label="i.label" :value="i.label" :disabled="i.disabled">{{ i.text }}</el-radio>
              </el-radio-group>
                    <!-- <el-radio-group class="host-dispot" v-model="dispotForm.status">
                      <el-radio label="0" value="0">待处理</el-radio>
                      <el-radio label="1" value="1">白名单</el-radio>
                      <el-radio label="2" value="2">已修复</el-radio>
                    </el-radio-group> -->
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
  import { gethostPage, gethostChart, hostDis, getDispotData, saveDispotData, pointerChart } from '../../api/host/host.js'
  import { destroyCache, filterItems } from '../../utils/deleCache.js'

  export default {
    //
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
        loading: true,
        fullscreenLoading: true,
        singePointer: false,
        isFalse: false,
        tableHeight: 100,
        stageFilter: [],
        currentPage: 1,
        total: 0,
        pagesize: 10,
        form: {
          hostName: ''
        },
        hostStatusReq: '0', //活动：0  非活动：1
        isA: true,
        isB: false,
        isKeyTbl: false,
        refreshTbl: false,
        isKeyReq: '', //非核心：2  核心：1
        tableData: [],
        stageInfos: [],
        stageGrandlow: 0,
        stageGrandheight: 0,
        stageGrandmiddle: 0,
        stageGrandanxious: 0,
        samePointerArr: [],
        showPointerArr: [],
        dotArr: [],
        hostPoint: [],
        //图
        mask: false, //是否显示多个点集合的弹窗
        newPointerLabel: {},
        pointerMask: [],
        topRandArray: [],
        leftRanArray: [],
        linesMask: [],
        coorPointInfo: '',
        hostPointerCertainty: [],
        hostPointerThreat: [],
        hostPointerTime: [],
        hostPointPList: [],
        hostChart: '',
        //处理
        dialogDispotFormVisible: false,
        detectId: '',
        dispotForm: {
          status: '',
          remarks: ''
        },
        dispotRules: {},
        //status: '',
        dId: '',
        //remarks: '',
        detectionStatus: {},
        isDisabled: false,
        hostThreatId: '',
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
        this.getHostList();
      },
      searchItem() {
        this.currentPage = 1;
        this.fullscreenLoading = true;
        this.getHostList();
      },
      /*//威胁阶段过滤
      stageThreat(value, row, column) {
        value = Number(value);
        const property = column['property'];
        return row[property] === value;
      },*/
      //筛选事件
      filterChange(filters) {
         this.filterName = filterItems(filters, this.filterName);
         this.getHostList();
      },
      //威胁阶段数字转中文
      stageFormatter(num) {
        var stage = this.stageInfos;
        for (var i in stage) {
          if (i == row[column['property']]) {
            return stage[i];
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
      //添加处理
      addDispost(index, row) {
        var that = this;
        var param = {
          "hostThreatId": row.hostThreatId
        }
        this.detectId = row.detectId;
        this.hostThreatId = row.hostThreatId;
        getDispotData(param).then(res => {
          //获取处理详情
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
        })
      },
      //处理
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
          "hostThreatId": this.hostThreatId,
          "detectId": this.detectId,
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
          that.getHostList();
        })
      },
      //活动的/非活动的 条件查询
      isActive(num) {
        //this.isA = !this.isA;
        var temp = true;
        if (num == '0') {
            temp = true;
        } else {
            temp = false;
        }

        if (temp != this.isA) {
          num == '0' ? this.isA = true : this.isA = false;
          this.hostStatusReq = num;
          this.currentPage = 1;
          this.loading = true;
          this.fullscreenLoading = true;
          this.getHostList();
        }
      },
      //核心资产 条件查询
      isProperty() {
        this.isKeyTbl = !this.isKeyTbl;
        this.isKeyTbl == true ? this.isKeyReq = '1' : this.isKeyReq = '';
        this.currentPage = 1;
        this.fullscreenLoading = true;
        this.getHostList();
      },
      //重置过滤条件
      isRest() {
        this.isA = true;
        this.form.hostName = '';
        this.hostStatusReq = '';
        this.isKeyTbl = false;
        this.isKeyReq = '';
        this.pagesize = 10;
        this.currentPage = 1;
        this.loading = true;
        this.fullscreenLoading = true;
        this.getHostList();
      },
      refreshIcon(event) {
        this.refreshTbl = true;
      },
      refreshIconNo(event) {
        this.refreshTbl = false;
      },
      //列表
      getHostList() {
        var that = this;
        /*var param = {
          'hostIpReq': this.form.hostName,
          'hostStatusReq': this.hostStatusReq,
          'isKeyReq': this.isKeyReq,
          'orderName': 'Threat',
          'sort': 'DESC',
          'stageId': '',
          'numPerPage': this.pagesize,
          'pageNum': this.currentPage
        }*/

        var param = {
          'stageQ': '',
          //'dealStatusQ': '',
          'isKeyQ': this.isKeyReq,
          'hostNameQ': this.form.hostName,
          'hostIpQ': this.form.hostName,
          //'typeZhQ': '',
          'hostStatusQ': this.hostStatusReq,
          'numPerPage': this.pagesize,
          'pageNum': this.currentPage,
          'time': 1
        }
        //param = Object.assign(this.filterName, param);
        for(var i in this.filterName) {
          param[i+'Q'] = this.filterName[i];
        }
        gethostPage(param).then(res => {

          that.loading = false;
          that.tableData = [];
          that.tableData = res.result.info.results;
          that.total = res.result.info.totalCount;
          //that.created();
          if (that.tableData.length >= 1) {
            that.tableHeight = 400
          }
          that.stageFilter = [];
          that.stageInfos = res.result.stages;
          for (var i in that.stageInfos) {
            that.stageFilter.push({
              value: i,
              text: that.stageInfos[i]
            })
          }

          //获取主机图表
          this.getHostChartFun();

        })
      },
      gradeNum(x, y) {
        var _x = x, _y = y, result = 0;
        if (_x < 50 && _y < 50) {
          //低危
          result = 1;
        } else if (_x < 50 && _y >= 50) {
          //高危
          result = 3;
        } else if (_x >= 50 && _y < 50) {
          //中级
          result = 2;
        } else if (_x >= 50 && _y >= 50) {
          //严重
          result = 4;
        }
        return result;
      },
      threatGradeFun(threat, certainty){
        var x = certainty;
        var y = threat;

        //危急状态
        var class_a = '';
        if (x <= 0 && y <= 0){
          //安全
          class_a = '#545864';
        } else if (x < 50 && y < 50) {
          //低危
          class_a = '#1296db';
        } else if (x < 50 && y >= 50) {
          //高危
          class_a = '#fa7420';
        } else if (x >= 50 && y < 50) {
          //中级
          class_a = '#FFCD3C';
        } else if (x >= 50 && y >= 50) {
          //严重
          class_a = '#ee1029';
        }

        return class_a;
      },
      hostNum(list) {

        for (var n = 0; n < list.length; n++) {

            var _x = list[n].certaintyMax;
            var _y = list[n].threatMax;

            //数量
            if (_x < 50 && _y < 50) {
              //低危
              this.stageGrandlow ++
            } else if (_x < 50 && _y >= 50) {
              //高危
              this.stageGrandheight ++
            } else if (_x >= 50 && _y < 50) {
              //中级
              this.stageGrandmiddle ++
            } else if (_x >= 50 && _y >= 50) {
              //严重
              this.stageGrandanxious ++
            }
          }
      },
      getHostChartFun() {
        var that = this;
        var params = {
          'hostIpQ': this.form.hostName,
          'hostNameQ': this.form.hostName,
          'hostStatusQ': this.hostStatusReq,
          'isKeyQ': this.isKeyReq,
          //'orderName': 'Threat',
          //'sort': 'DESC',
          //'stageId': '',
          'order': '',
          'sortName': '',
          'stageQ': '',
          'numPerPage': this.pagesize,
          'pageNum': this.currentPage
        }
        //params = Object.assign(this.filterName, params);
        for(var i in this.filterName) {
          params[i+'Q'] = this.filterName[i];
        }
        gethostChart(params).then(res => {


          that.fullscreenLoading = false;

          var list = res.result;
          var list_clone = res.result;
          var _nisTrue = false;
          that.stageGrandlow = 0; //低危
          that.stageGrandheight = 0; //高危
          that.stageGrandmiddle = 0; //中危
          that.stageGrandanxious = 0; //严重
          that.dotArr = [];
          that.hostPoint = [];
          that.samePointerArr =[];

          //计算host数量
          this.hostNum(list)



          for (var n = 0; n < list.length; n++) {

            var _x = list[n].certaintyMax;
            var _y = list[n].threatMax;
            var ngrade = that.gradeNum(_x, _y); //获取威胁等级
            var ncount = 0;



            //相同位置点删除
            for (var m = list.length - 1; m > n; m --) {
              var mx = list[m].certaintyMax;
              var my = list[m].threatMax;
              var mgrade = that.gradeNum(mx, my);
              if (ngrade == mgrade && !(list[m].icon)) {

                if ( ((mx >= _x && mx <= _x+10) || (mx <= _x && mx >= _x-10) &&
                      (my >= _y && my <= _y+10) || (my <= _y && my >= _y-10)
                     ) || (
                      (my >= _y && my <= _y+10) || (my <= _y && my >= _y-10) &&
                      (mx >= _x && mx <= _x+10) || (mx <= _x && mx >= _x-10)
                     )
                  ) {

                      list[m].newCertaintyMax = _x;
                      list[m].newThreatMax = _y;
                      var tempArr = [];
                      //拷贝list[m]的所有属性
                      if (ncount == 0){
                        var listBTemp = {};
                        for(var s in list[n]){
                          listBTemp[s] = list[n][s];
                        }
                        tempArr.push(listBTemp);
                      }
                      tempArr.push(list[m]);

                      var tempObj = new Object();
                      tempObj.key = n;
                      tempObj.value = tempArr;

                      that.samePointerArr.push(tempObj);

                      //list.splice(m,1);
                      list[m].icon = 1;

                      _nisTrue = true;

                      ncount ++;
                }

              }

            }

            if (_nisTrue == true) {
              _nisTrue = false;
              list[n].icon = 1;  //添加新属性作为标识：表示当前点的位置是有多个点重合
            }

          }

          that.showPointerArr = list;  //处理后的list赋值给可以显示的数组

          //获取每个点占的宽度
          var hostChartWidth = that.$refs.coorChart.offsetWidth;
          var hostChartHeight = that.$refs.coorChart.offsetHeight;
          var dotWidth = hostChartWidth/100;   // 一个点占的宽度
          var dotHeight = hostChartHeight/100; // 一个点占的高度

          for (var i = 0; i < list.length; i++) {

            var _x = list[i].certaintyMax;//信任值
            var _y = list[i].threatMax;//威胁值
            that.dotArr.push([_x,_y]);

            //判断是否是多个位置相同的点
            var label_i = '', isPlus = '';
            if (list[i].hasOwnProperty('icon')) {
              label_i = 'plus_i';
              isPlus = '1';
            } else {
              //0:全部     1:核心资产       2:非核心资产
              isPlus = '0';
              if (list[i].isKey == 1) {
                label_i = 'star_i';
              /*} else if (list[i].isKey == 2) {
                label_i = 'host_i';*/
              } else {
                label_i = 'host_i';
              }

            }


            //危急状态
            var threatGr = that.threatGradeFun(_y, _x); //等级颜色处理
            /*var label_a = '<a href="javascript:;" class="roundBg round_m posRe '+threatGr+'" >'+label_i+'</a>';*/
            var label_a = threatGr;

            //显示点位置
            var x = _x;
            var y = _y;
            y = 100 - y; // y坐标值的位置与实际的top值相反

            //边界值处理
            x >= 100 ? x = 100 : x = x;
            y >= 100 ? y = 100 : y = y;

            // x/y 坐标乘以实际上一个点应该所占得宽度/高度
            x = x * dotWidth;
            y = y * dotHeight;

            x > 0 ? x = parseInt(x) : x = x  //取整
            y > 0 ? y = parseInt(y) : y = y  //取整

            // x、y点-10让标签居中
            x > dotWidth ? x = x - 10 : x = x;
            y > dotHeight ? y = y - 10 : y = y;


            //显示时的边界值处理
            x >= (hostChartWidth - 20) ? x = (hostChartWidth-20) : x = x;
            y >= (hostChartHeight - 21) ? y = (hostChartHeight-21) : y = y;

            //生成字符串
            /*that.hostPoint += '<div class="hostPoint" style="left:'+x+'px;top:'+y+'px;" x="'+x+'" y="'+y+'" data="ip:'+list[i].hostIp+',name:'+list[i].hostName+',certaintyMax:'+_x+',threatMax:'+_y+',isKey:'+list[i].isKey+'">'
              +label_a+'</div>';*/
            that.hostPoint.push({
              top: y,
              left: x,
              isPlus: isPlus,
              ip: list[i].hostIp,
              name: list[i].hostName || '',
              certaintyMax: _x,
              threatMax: _y,
              isKey: list[i].isKey || '',
              iClass: label_i,
              aClass: label_a
            })
          }


        })
      },
      hideMask() {
         this.mask = false; //关闭弹窗
         this.newPointerLabel = '';
         this.pointerMask.splice(0, this.pointerMask.length);
         this.linesMask.splice(0, this.linesMask.length);
         this.closeSinge();
      },

      hostPointInfo(obj, event) {

         var el = event;

        //阻止事件冒泡
        var event = window.event || arguments.callee.caller.arguments[0];
        if (event.stopPropagation) {
          // 针对 Mozilla 和 Opera
          event.stopPropagation();
        } else if (window.event) {
            // 针对 IE
            window.event.cancelBubble = true;
        }
        var data = obj;
        var isPlus = data.isPlus;

        //判断点击的是否是多个点集成在同一个位置的点
        if (isPlus == '1') {
          this.mask = true; //打开弹窗
          //起始点
          this.newPointerLabel = data;

          var newPointer_x = data.left;
          var newPointer_y = data.top;

          //对应点
          var this_x = data.certaintyMax;
          var this_y = data.threatMax;

          var nPointerList = [];

          for (var d = 0; d < this.samePointerArr.length; d++) {
              var value = this.samePointerArr[d].value;
              for (var c in value){
                //var cx = value[c].newCertaintyMax || value[c].certaintyMax;
                //var ty = value[c].newThreatMax || value[c].threatMax;
                var cx = value[c].certaintyMax;
                var ty = value[c].threatMax;
                if (this_x == cx && this_y == ty) {
                  nPointerList.push(value[c]);
                }

              }
          }

          this.pointerMask = this.showPointerStyle(nPointerList);
          //所有线开始位置：Plus点的位置+10
          var lines = '';
          newPointer_x = Number(newPointer_x)+10;
          newPointer_y = Number(newPointer_y)+10;

          //显示点的方向  从左显示 or 从右显示
          /*var objCerThreaNum = this.threatGradeNumFun(this_y, this_x);
          var position_x = 0;
          if (objCerThreaNum == 2 || objCerThreaNum == 4){
            //中危 or 严重
            position_x = 1; //right
          } else {
            //低危  or 高危
            position_x = 0; //left
          }*/

          for (var i in this.pointerMask) {
              var index = i;
              if (index > 50){
                //$(this).hide();
                this.pointerMask.splice(i, 1);
              } else {
                var _RndNumTop = this.topRandArray[index];
                var _RndNumLeft = this.leftRanArray[index];

                //对应点的位置
                this.pointerMask[i].top = _RndNumTop;
                this.pointerMask[i].left = _RndNumLeft;

                //对应线的位置
                this.linesMask.push({
                    index: index,
                    _RndNumTop: (_RndNumTop+1)+'%',
                    _RndNumLeft: (_RndNumLeft+1)+'%',
                    newPointer_y: newPointer_y+'px',
                    newPointer_x: newPointer_x+'px',

                    aClass: this.pointerMask[i].aClass || '',
                    certaintyMax: this.pointerMask[i].certaintyMax || '0',
                    hostIp: this.pointerMask[i].hostIp || '',
                    hostIpTotal: this.pointerMask[i].hostIpTotal || '',
                    hostName: this.pointerMask[i].hostName || '',
                    iClass: this.pointerMask[i].iClass || '',
                    isKey: this.pointerMask[i].isKey || '',
                    left: this.pointerMask[i].left || '',
                    newCertaintyMax: this.pointerMask[i].newCertaintyMax || '',
                    newThreatMax: this.pointerMask[i].newThreatMax || '',
                    threatMax: this.pointerMask[i].threatMax || '0',
                    top: this.pointerMask[i].top || ''
                });

                //数量
                var x = this.pointerMask[i].certaintyMax;
                var y = this.pointerMask[i].threatMax;

              }

           }


        } else {

          //显示具体点弹窗
          var label_property = '';

          if (data.isKey == 1) {
            label_property = "ic_property on";
          /*} else if (data.isKey == 2) {
            label_property = "ic_property";*/
          } else {
            label_property = "ic_property";
          }

          var otop = ((event.pageY-10) - (this.$refs.coorChart.getBoundingClientRect().top));
          var oleft = ((event.pageX-10) - (this.$refs.coorChart.getBoundingClientRect().left));


          //`${document.documentElement.clientWidth}` - oleft > 450 ? oleft = oleft - 190 : oleft = oleft - 380 - 350;
          //`${document.documentElement.clientHeight}`- otop > 280 ? otop = otop - 130 : otop = otop - 260 - 210;
          if (oleft > (this.$refs.coorChart.clientWidth - 400)) {
            oleft = (this.$refs.coorChart.clientWidth - 400);
            otop = otop + 20;
          } else if(oleft <= 20) {
            oleft = 20
          } else {
            oleft = oleft + 20;
          }

          this.coorPointInfo = {
            top: otop,
            left: oleft,
            name: data.name,
            label_property: label_property,
            isKey: data.isKey || '',
            ip: data.ip|| '',
            threatMax: data.threatMax || data.newThreatMax|| '0',
            certaintyMax: data.CertaintyMax || data.newcertaintyMax|| '0',
            iClass: data.iClass || '',
            isPlus: data.isPlus || ''
          }

          this.getPointerChart(data.ip); //获取折线图数据
          this.singePointer = true;

        }

      },
      closeSinge() {
        this.coorPointInfo = {};
        this.hostPointPList.splice(0, this.hostPointPList.length);
        if (this.hostChart != '') {
          this.hostChart.clear(); //清空echarts图例数据
        }
        this.singePointer = false;
      },
      getPointerChart(ip) {
        var that = this;
        var param = {
          'hostIp': ip
        }
        pointerChart(param).then(res => {
            var data = res;
            var gradeColorArr = ["#8a8a8a","#1296db","#2e7ab1","#b2a71d","#FFCD3C","#e77e50","#ff8309","#d81e06"];

            //检测结果
            if (data.result.stageList.length > 0){
              var stageList = data.result.stageList;
                var _p = [];
                if (stageList.length > 0) {
                  var stage = '';
                  for (var k = 0; k < stageList.length; k++) {
                    data.result.stageMap[stageList[k].stage+''] == undefined ?  stage = '': stage = data.result.stageMap[stageList[k].stage+''];
                   /* _p += '<p><span class="attackType" style="background:'+gradeColorArr[stageList[k].stage]+'">'+stage+'</span> '+stageList[k].typeZh+'</p>';*/
                    var background = gradeColorArr[stageList[k].stage];//获取stage颜色
                    _p.push({
                      bg: background,
                      stage: stage,
                      typeZh: stageList[k].typeZh,
                    });
                  }
                }
                //$("#hostPointPList").append(_p);
                that.hostPointPList = _p;
            }

            //折线图
            if (data.result.degreeList.length > 0) {

              that.hostPointerCertainty.length > 0 ? that.hostPointerCertainty.splice(0, that.hostPointerCertainty.length) : '';
              that.hostPointerThreat.length > 0 ? that.hostPointerThreat.splice(0, that.hostPointerThreat.length) : '';
              that.hostPointerTime.length > 0 ? that.hostPointerTime.splice(0, that.hostPointerTime.length) : '';

              var degreeList = data.result.degreeList;//折线表数据
              for (var p = 0; p < degreeList.length; p++) {

                that.hostPointerCertainty.push(degreeList[p].certainty);//可信度
                that.hostPointerThreat.push(degreeList[p].threat);//威胁度
                that.hostPointerTime.push(degreeList[p].datectTime);//时间
              }
              //chart 绘制
              that.hostChart = echarts.init(this.$refs.singleHostChart);
              that.hostChart.setOption({
                      backgroundColor: '#171c2f',
                        tooltip : {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'line',
                                label: {
                                    backgroundColor: '#6a7985'
                                }
                            }
                        },
                        toolbox: {
                            show:false
                        },
                        grid: {
                            x: '10px',
                            y: '10px',
                            x2: '30px',
                            y2: '10px',
                            containLabel: true
                        },
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : false,
                                data : that.hostPointerTime,//日期
                                splitLine:{
                                    show:false
                                },
                                axisTick:{
                                    show:false
                                },
                                axisLabel:{
                                    show: true,
                                    //interval:0,//横轴信息全部显示
                                    //rotate:-30,//-30度角倾斜显示
                                    textStyle: {
                                        color: '#919294'
                                    }

                                },
                                splitLine: {
                          show: true,
                          lineStyle: {
                                    color: '#333'
                                }
                        }
                            }
                        ],
                        yAxis : [
                            {
                                show:false,
                                type : 'value',
                                splitLine:{
                                    show:false
                                }
                            }
                        ],
                        series : [
                            {
                                name:'可信度',
                                type:'line',
                                //symbol:'none',
                                smooth: true,
                                symbol: 'circle',
                                symbolSize: 3,
                                showSymbol: false,
                                data: that.hostPointerCertainty,//可信度
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
                                                color:'#3c6233',
                                            },{
                                                offset:1,
                                                color:'#1c3615',
                                            }],
                                        },
                                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                                        shadowBlur: 10
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: 'rgb(146,200,88)',
                                        borderColor: 'rgba(146,200,88,0.27)',
                                        borderWidth: 12
                                    }
                                }
                            },
                            {
                                name:'威胁度',
                                type:'line',
                                data: that.hostPointerThreat,//威胁度
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
                                                color:'#1d3153',
                                            },{
                                                offset:1,
                                                color:'#171d31',
                                            }],
                                        },
                                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                                        shadowBlur: 10
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: 'rgb(35,96,168)',
                                        borderColor: 'rgba(35,96,168,0.27)',
                                        borderWidth: 12
                                    }
                                }
                            }
                        ]
                    });
            }
        })
      },
      rndNumFun() {
        var count = 51;
        //给原数组originalArray赋值
        for (var i = 0; i < count; i++){
          //topRandArray[i] = Math.floor(Math.random()*98);
          //leftRanArray[i] = Math.floor(Math.random()*95);
          this.topRandArray[i] = i*1.9;
          this.leftRanArray[i] = i*1.9;
        }


        this.topRandArray.sort(function(){
          return 0.5 - Math.random();
        });
        this.leftRanArray.sort(function(){
          return 0.5 - Math.random();
        });

      },
      threatGradeNumFun(threat, certainty) {
        var x = certainty;
        var y = threat;

        //危急状态
        var num = '';
        if (x <= 0 && y <= 0){
          //安全
          num = 0;
        } else if (x < 50 && y < 50) {
          //低危
          num = 1;
        } else if (x < 50 && y >= 50) {
          //高危
          num = 3;
        } else if (x >= 50 && y < 50) {
          //中级
          num = 2;
        } else if (x >= 50 && y >= 50) {
          //严重
          num = 4;
        }

        return num;
      },
      showPointerStyle(list) {

          var newhostPoint = [];
          for (var i = 0; i < list.length; i++) {
            var _x = list[i].certaintyMax;//信任值
            var _y = list[i].threatMax;//威胁值
            this.dotArr.push([_x,_y]);

            //判断是否是多个位置相同的点
            var label_i = '';


            //if (list[i].hasOwnProperty('icon')) {
              //label_i = 'plus_i';
            //} else {
              //0:全部     1:核心资产       2:非核心资产
              if (list[i].isKey == 1) {
                label_i = 'star_i';
              } else {
                label_i = 'host_i';
              }

            //}

            //危急状态
            var threatGr = this.threatGradeFun(_y, _x); //等级颜色处理
            var label_a = threatGr;

            newhostPoint.push({
              certaintyMax: _x,
              threatMax: _y,
              iClass: label_i,
              aClass: label_a,
              ip: list[i].hostIp || '',
              hostIpTotal: list[i].hostIpTotal || '',
              name: list[i].hostName || '',
              isKey: list[i].isKey || '',
              newCertaintyMax: list[i].newCertaintyMax || '',
              newThreatMax: list[i].newThreatMax || '',
              isPlus: list[i].isPlus || '0'
            });

          }
          return newhostPoint;
        },
        getHostIP() {
           if (this.$route.params.dashboard) {
              this.form.hostName = this.$route.params.dashboard.hostIp;
            } else {
              this.form.hostName = '';
            }
        }

    },
    mounted() {
      
      //获取仪表盘的跳转ip
      this.getHostIP();

      //获取主机表格
      this.getHostList();

      //生成随机数
      this.rndNumFun();
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
