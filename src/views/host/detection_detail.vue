<template>
  <div class="pageOverflow">

    <div class="title company_ip" style="padding:0;">
      <div class="filter-container">
        <section class="app-container">
          <el-row class="detail-title">
            <el-col :span="20">
              <span style="padding:0 20px;">尝试获取管理员权限</span>
            </el-col>
            <el-col :span="4">
              <router-link :to="{path:'/host'}" class="fr" style="padding-right:20px;">< 返回</router-link>
            </el-col>
          </el-row>
          <div style="padding:15px;">
            <el-row>
              <el-col :span="7" class="d-p-lineheight">
                <p>{{ host.hostName }} <i :class="{'ic_property': true, 'on': (host.isKey == 1)}"></i></p>
                <p>主机IP：{{ host.hostIp }}</p>
                <p>数据源：{{ host.source }}</p>
                <p>状态：{{ host.hostStatus == 0 ? '活动的' : '非活动的' }}</p>
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
                <P>{{tags}}</p>
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
            <el-row class="d-p-line">
              <el-col :span="8">
                <p>资料图</p>
                <p><img src="../../assets/images/detec-lib.png" class="fl" />
                  <!-- <span class="fl d-p-grand">侦查</span> -->
                  <span v-if="host.stage==1" class="fl d-p-grand roundBgc_1">侦查</span>
                  <span v-else-if="host.stage==2" class="fl d-p-grand roundBgc_2">武装</span>
                  <span v-else-if="host.stage==3" class="fl d-p-grand roundBgc_3">投递</span>
                  <span v-else-if="host.stage==4" class="fl d-p-grand roundBgc_4">突破</span>
                  <span v-else-if="host.stage==5" class="fl d-p-grand roundBgc_5">安装</span>
                  <span v-else-if="host.stage==6" class="fl d-p-grand roundBgc_6">控制</span>
                  <span v-else-if="host.stage==7" class="fl d-p-grand roundBgc_7">攻击</span>
                  <span v-else class="fl d-p-grand roundBgc_0">安全</span>
                </p>
              </el-col>
              <el-col :span="8">
                <p>检测摘要</p>
                <p>内网主机：{{ host.hostIP }}</p>
                <p>外网入侵服务器：{{ abstract.externalIp }}</p>
                <p>下载次数：{{ abstract.countNum }}</p>
                <p>文件：{{ abstract.fileName }}</p>
              </el-col>
              <el-col :span="8">
                <p>时间戳</p>
                <div id="dChart" ref="chart" style="width:96%;height:100px;"></div>
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
          <el-row>
            <el-col :span="24">
              <p>最近活动：</p>
            </el-col>
          </el-row>

          <!--检测模式表-->
          <div class="container_table flowTabs" style="padding-top:10px;">
            <el-table
              :data="tableData"
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

              <!-- <el-table-column
                                  prop="detectionTags"
                                  label="标签"
                                  width="100">
                                </el-table-column> -->


              <el-table-column
                prop="externalIp"
                :formatter="fmtLength"
                label="IP">
              </el-table-column>

              <el-table-column
                prop="uri"
                :formatter="fmtLength"
                label="URL">
              </el-table-column>

              <el-table-column
                prop="fileName"
                :formatter="fmtLength"
                label="文件名">
              </el-table-column>

              <el-table-column
                prop="fileSize"
                :formatter="fmtLength"
                label="大小">
              </el-table-column>

              <el-table-column
                prop="port"
                :formatter="fmtLength"
                label="端口">
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
          <!-- <el-radio-group v-model="dispotForm.status" v-for="(i,index) in detectionStatus" class="host-dispot">
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
  import { getDetecDatailPage, getDetecTimeShaft, getDetecabstract, hostInfomtion, getLabelData, addLabel, getDispotData, saveDispotData } from '../../api/host/host.js'

  export default {
    data() {
      return {
        host: '',
        hostIP: '',
        hostName: '',
        hostStatus: '',
        detectId: '',
        charts: '',
        certaintyData: [],
        threatData: [],
        timeData: [],
        isFalse: false,
        tableHeight: 100,
        currentPage: 1,
        total: 0,
        pagesize: 10,
        tableData: [],
        abstract: {
          externalIp: '',
          countNum: '',
          fileName: ''
        },
        //dialogFormVisible: false,
        labelForm: {},
        rulesForm:{},
        dialogDispotFormVisible: false,
        dispotForm: {},
        dispotRules: {},
        hostInfo: '',
        deteTypes: '',
        dataSources: '',
        tags: '',
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
        hostThreatId: '',
        dialogDispotFormVisible: false,
        dispotForm: {
          status: '',
          remarks: ''
        },
        /*detectId: '',*/
        dispotRules: {},
        status: '',
        dId: '',
        remarks: '',
        detectionStatus: {},
        isDisabled: false
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
      //检测摘要
      getabstract() {
        var that = this;
        var para = {
          'detectId': ''
        }
        getDetecabstract(para).then(res => {

          that.abstract.externalIp = res.result.externalIp;
          that.abstract.countNum  = res.result.countNum;
          that.abstract.fileName = res.result.fileName;
        })
      },
      //主机信息
      gethostInfo() {
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
      //处理
      addDispost() {
        var that = this;
        var param = {
          "hostThreatId": this.hostThreatId
        }
        getDispotData(param).then(res => {

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
        })
      },
      saveDispot() {
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
      //数据表
      getDetecList() {
        var that = this;
        var param = {
          'detectId': this.detectId,
          'numPerPage': this.pagesize,
          'pageNum': this.currentPage
        }
        getDetecDatailPage(param).then(res => {
          //table
          if (res.result.results != null) {
            that.tableData = res.result.results;
            that.total = res.result.totalCount;
            //that.created();
            if (that.tableData.length >= 1) {
              that.tableHeight = 400
            }
          }

        })
      },
      drawChart() {
        //清空
        this.certaintyData.length > 0 ?
          this.certaintyData.splice(0, this.certaintyData.length) : ''

        this.threatData.length > 0 ?
          this.threatData.splice(0, this.threatData.length) : ''

        this.timeData.length > 0 ?
          this.timeData.splice(0, this.timeData.length) : ''

        var that = this;
        var params = {
          'hostIp': this.hostIP
        }
        getDetecTimeShaft(params).then(res => {

          //折线图
          var dLine = res.result;
          for(var i in dLine){
            that.certaintyData.push(dLine[i].certainty);
            that.threatData.push(dLine[i].threat);
            that.timeData.push(dLine[i].detectTime);
          }

          that.charts = echarts.init(document.getElementById('dChart'));
          that.charts.setOption({
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
            grid: {
              left: '10px',
              right: '20px',
              bottom: '10px',
              top: '10px',
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
        })
      },
      saveHostIP() {

        if (this.$route.params.host) {
          this.host = this.$route.params.host;
          localStorage.setItem('hostInfo', JSON.stringify(this.host));
        } else {
          var obj = localStorage.getItem('hostInfo');
          obj = JSON.parse(obj);
          this.host = obj;
        }

        this.hostIP = this.host.hostIp;
        this.hostName = this.host.hostName;
        this.hostStatus = this.host.hostStatus;
        this.detectId = this.host.detectId;
        this.hostThreatId = this.host.hostThreatId;
      }
    },
    mounted() {
      //hostIP
      this.saveHostIP();

      //初始化列表
      this.getDetecList();

      //初始化主机信息
      this.gethostInfo();

      //初始化时间戳
      this.drawChart();

      //检测摘要
      this.getabstract();

    }
  }
</script>
<style>
  .d-p-line{
    padding:10px;margin:10px 0;background:#f0f0f0;
  }
  .d-p-line p{
    line-height: 25px;
  }
  .d-p-grand{
    width: 40px;height: 40px;line-height: 40px;text-align: center;border-radius: 100%; margin: 9px 0 0 10px;color: #fff;font-size: 10px;
  }
</style>
