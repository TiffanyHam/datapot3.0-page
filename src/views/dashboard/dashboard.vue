<template>
  <div class="title" style="border: none;height: 94%;margin-top: 0;">
    <el-row>
      <el-col :span="24" :class="t_style" style="text-align: center;padding: 5px 10px;" class="el-icon-time"> 最近24小时</el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="space-around" style=" height: 89%;overflow: auto;">
      <!--left-->
      <el-col :span="11">
        <!--主机危险性总览-->
        <div class="mgb-20" :class="t_style">
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="12"><div class="grid-content_item" style="margin: 10px 0px 0px 10px;">主机危险性总览</div></el-col>
            <el-col :span="12"><div class="grid-content_item" :class="t_right" style="margin: 10px 10px 0px 0px;">当前分析结果：<span>{{total}}</span>主机</div></el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="space-around">
            <div class="reports_column_two">
              <!--<router-link :to="{name:'overview', params: { priorityNum: priorityNum}}">123</router-link>-->
              <div class="dashboard_item d_item_2" @click="dashHost(3)">
                <h3 class="reports_text01">高危</h3>
                <img src="../../assets/images/state_orange.png" width="110" height="21" class="item0">
                <p class="reports_part">
                  <span><img src="../../assets/images/state03.png"></span>
                  <span class="reports_num">{{countNum_item3}}</span>
                  <span class="host_info">主机</span>
                </p>
              </div>
              <div class="dashboard_item d_item_3" @click="dashHost(4)">
                <h3 class="reports_text02">严重</h3>
                <img src="../../assets/images/state_red.png" width="110" height="21" class="item1">
                <p class="reports_part"><span><img src="../../assets/images/state02.png">
                </span>
                  <span class="reports_num">{{countNum_item4}}</span>
                  <span class="host_info">主机</span>
                </p>
              </div>
            </div>

          </el-row>
          <el-row type="flex" class="row-bg" justify="space-around">
            <div class="reports_column_one">
              <div class="dashboard_item d_item_0" @click="dashHost(1)">
                <h3 class="reports_text03">低危</h3>
                <img src="../../assets/images/state_gray.png" width="110" height="21" class="item2">
                <p class="reports_part">
                  <span><img src="../../assets/images/state04.png"></span>
                  <span class="reports_num">{{countNum_item1}}</span>
                  <span class="host_info">主机</span></p>
              </div>
              <div class="dashboard_item d_item_1" @click="dashHost(2)">
                <h3 class="reports_text04">中危</h3>
                <img src="../../assets/images/state_yellow.png" width="110" height="21" class="item3">
                <p class="reports_part">
                  <span><img src="../../assets/images/state01.png"></span>
                  <span class="reports_num">{{countNum_item2}}</span>
                  <span class="host_info">主机</span>
                </p>
              </div>
            </div>
          </el-row>
        </div>
        <!--核心资产-->
        <div class="mgb-20">
          <el-row :class="t_style">
            <el-col :span="12"><div class="height-30">核心资产&nbsp;<i class="el-icon-star-on" style="color: #ffdf01;font-size: 18px"></i></div></el-col>
            <el-col :span="12">
            <div class="height-30" :class="t_right" style="color: #409EFF;cursor: pointer;" @click="assetsHost">查看更多</div>
            </el-col>
            <el-col :span="24">
              <el-table
                :data="keyAssetsData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                :loading="loading"
                :header-cell-class-name="rowClass"
                :header-cell-style="{background:'#eee'}"
                border
                style="width: 100%">
                <el-table-column
                  label="主机名"
                  prop="hostName"
                  align="center">
                </el-table-column>

                <el-table-column
                  label="侦查"
                  width="60">
                  <template slot-scope="scope">
                    <div v-for="i in stageArr">
                      <div v-if="i == 1"><p class="circle"></p></div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column
                  label="武装"
                  width="60">
                  <template slot-scope="scope">
                    <div v-for="i in stageArr">
                      <div v-if="i == 2"><p class="circle"></p></div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="投递"
                  width="60">
                  <template slot-scope="scope">
                    <div v-for="i in stageArr">
                      <div v-if="i == 3"><p class="circle"></p></div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="突破"
                  width="60">
                  <template slot-scope="scope">
                    <div v-for="i in stageArr">
                      <div v-if="i == 4"><p class="circle"></p></div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column
                  label="安装"
                  width="60">
                  <template slot-scope="scope">
                    <div v-for="i in stageArr">
                      <div v-if="i == 5"><p class="circle"></p></div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column
                  label="控制"
                  width="60">
                  <template slot-scope="scope">
                    <div v-for="i in stageArr">
                      <div v-if="i == 6"><p class="circle"></p></div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column
                  label="攻击"
                  width="60">
                  <template slot-scope="scope">
                    <div v-for="i in stageArr">
                      <div v-if="i == 7"><p class="circle"></p></div>
                    </div>
                  </template>
                </el-table-column>

              </el-table>
            </el-col>
          </el-row>
        </div>
        <!--危险资产-->
        <div class="mgb-20">
          <el-row :class="t_style">
            <el-col :span="24"><div class="height-30">危险资产TOP10</div></el-col>
            <el-col :span="24">
              <el-table
                :data="assetsData.slice((currentPage-1)*bigPagesize,currentPage*bigPagesize)"
                :loading="loading"
                :header-cell-style="{background:'#eee'}"
                border
                style="width: 100%">
                <el-table-column
                  prop="hostName"
                  :formatter="fmtLength"
                  label="主机名"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="hostIp"
                  :formatter="fmtLength"
                  label="主机Ip"
                  width="180">
                  <template slot-scope="scope">
                    <router-link :to="{name:'host', params: { dashboard: scope.row,black: '/dashboard'}}"
                                 class="d-a-title" style="color:#409EFF;padding:0;">{{ scope.row.hostIp }}</router-link>
                  </template>

                </el-table-column>
                  <el-table-column
                    :formatter="fmtLength"
                    prop="threat"
                    label="威胁度"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="certainty"
                    :formatter="fmtLength"
                    label="可信度"
                    align="center">
                  </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <!--center-->
      <el-col :span="1"></el-col>
      <!--right-->
      <el-col :span="12">
        <!--检测处理分类-->
        <div class="mgb-20">
          <el-row :class="t_style">
            <el-col :span="24" :class="t_border"><div class="height-30">检测处理分类</div></el-col>
            <el-col :span="24">
              <div id="detectionCharts" ref="detectionCharts" style="width:100%;height: 220px"></div>
            </el-col>
          </el-row>
        </div>
        <!--威胁阶段-->
        <div class="mgb-20">
          <el-row :class="t_style">
            <el-col :span="24" :class="t_border"><div class="height-30">威胁阶段</div></el-col>
            <el-col :span="24">
              <div id="behaviorCharts" ref="behaviorCharts" style="width:100%;height: 220px"></div>
            </el-col>
          </el-row>
        </div>
        <!--威胁类型-->
        <div class="mgb-20">
          <el-row :class="t_style">
            <el-col :span="24" :class="t_border"><div class="height-30">威胁类型</div></el-col>
            <el-col :span="24">
              <div id="aggressiveCharts" ref="aggressiveCharts" style="width:100%;height:220px"></div>
            </el-col>
          </el-row>
        </div>
        <!--变化最大危险资产Top10-->
        <div class="mgb-20">
          <el-row :class="t_style">
            <el-col :span="24"><div class="height-30">变化最大危险资产Top10</div></el-col>
            <el-col :span="24">
              <el-table
                :data="biggestListData.slice((currentPage-1)*bigPagesize,currentPage*bigPagesize)"
                :loading="loading"
                :header-cell-style="{background:'#eee'}"
                border
                style="width: 100%">
                <el-table-column label="主机名" :formatter="fmtLength"  prop="hostName"  align="center">
                  <el-table-column>
                    <template slot-scope="scope">{{ scope.row.hostName }}</template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="主机IP" :formatter="fmtLength"  prop="hostIp">
                  <el-table-column>
                    <template slot-scope="scope">
                      <router-link :to="{name:'host', params: { dashboard: scope.row,black: '/dashboard'} }"
                                   class="d-a-title" style="color:#409EFF;padding:0;">{{ scope.row.hostIp }}</router-link>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="起始值" align="center">
                  <el-table-column
                    prop="curCertainty"
                    :formatter="fmtLength"
                    label="威胁度" align="center" width="80px">
                  </el-table-column>
                  <el-table-column
                    prop="curThreat"
                    :formatter="fmtLength"
                    label="可信度" align="center" width="80px">
                  </el-table-column>
                </el-table-column>
                <el-table-column label="当前值" align="center">
                  <el-table-column
                    prop="preCertainty"
                    :formatter="fmtLength"
                    label="威胁度" align="center" width="80px">
                  </el-table-column>
                  <el-table-column
                    prop="preThread"
                    :formatter="fmtLength"
                    label="可信度" align="center" width="80px">
                  </el-table-column>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-col>


    </el-row>
  </div>

</template>

<script>
  import axios from 'axios'
  import echarts from 'echarts'
  import { dashboardTbl_init,pageTransition,hostTransition} from '../../api/dashboard/dashboard.js'

  export default {
    data () {
      return {
        _detectionCharts:null,
        _behaviorCharts:null,
        _aggressiveCharts:null,
        detecteName:[],
        detecteValue:[],
        seriesBehavior:[],
        yaxisBehavior:[],
        seriesAgree:[],
        yaxisAgree:[],
        t_style: 'title_header',   //在 data 中把 yellow 赋给 box
        t_center:'text_center',
        t_right:'text_right',
        t_border:'text_border',
        loading: true,
        priorityNum:'',
        total_round : '',
        biggestListData:[],
        assetsData:[],
        keyAssetsData:[],
        bigPagesize:10,//每页的数据条数
        pagesize:5,//每页的数据条数
        currentPage:1,//默认开始页面
        total:'',
        countNum_item1:'',
        countNum_item2:'',
        countNum_item3:'',
        countNum_item4:'',
        stageName:'',
        colorArr:'',
        stageArr:''
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

      //表头单元格设置一个固定的 className,添加样式。
      rowClass ({ row, column, rowIndex, columnIndex }) {
        switch (columnIndex) {
          case 1:
            return 'co_blue'
            break;
          case 2:
            return 'co_dark'
            break;
          case 3:
            return 'co_yellow'
            break;
          case 4:
            return 'co_purple'
          case 5:
            return 'co_gray'
            break;
          case 6:
            return 'co_orange'
            break;
          case 7:
            return 'co_red'
            break;
        }
      },
      //仪表盘初始化
      getInitList() {
        let that = this;
        dashboardTbl_init('').then(res => {

          if(res!=undefined || res!=null) {
            that.loading = false
            //table
            let biggestList = res.result.biggestMovers;//变化最大危险资产
            let assetsList = res.result.assets;//危险资产
            let keyAssetsList = res.result.hosts;//核心资产
            biggestList == undefined ? this.biggestListData = [] : this.biggestListData = biggestList;
            assetsList == undefined ? this.assetsData = [] : this.assetsData = assetsList;
            keyAssetsList == undefined ? this.keyAssetsData = [] : this.keyAssetsData = keyAssetsList;
            let stages = [1, 4, 6, 7];

            that.stageName = res.result.detectionStages;//状态
            for (let i = 0; i < keyAssetsList.length; i++) {
              that.stageArr = keyAssetsList[i].stages.split(',');//1,4,6,7  =>  1 4 6 7
              console.log(that.stageArr)

            }

            //charts
            let breakdowns = res.result.breakdowns;//检测处理分类
            let t = 0;
            for (let i = 0; i < breakdowns.length; i++) {
              breakdowns[i].dealStatusName = breakdowns[i].dealStatusName + "：" + breakdowns[i].num + "（" + breakdowns[i].perCentum + "）";
              that.detecteName.push(breakdowns[i].dealStatusName);
              that.detecteValue.push({
                name: breakdowns[i].dealStatusName,
                value: breakdowns[i].num
              });
              t += breakdowns[i].num
              that.total_round = t
            }

            let stagesList = res.result.detectionStages.reverse();//攻击阶段
            for (let i = 0; i < stagesList.length; i++) {
              that.yaxisBehavior.push(stagesList[i].stageName)
              that.seriesBehavior.push(stagesList[i].num)
            }

            let typesList = res.result.detectionTypes.reverse();//攻击类型
            for (let i = 0; i < typesList.length; i++) {
              that.yaxisAgree.push(typesList[i].type)
              that.seriesAgree.push(typesList[i].num)
            }

            that._detectionCharts = echarts.init(this.$refs.detectionCharts);
            that._behaviorCharts = echarts.init(this.$refs.behaviorCharts);
            that._aggressiveCharts = echarts.init(this.$refs.aggressiveCharts);

            //环状图
            let dotTxt_x = 0, dotNum_y = 0, dotTxt_y = 0, dotNum_x = 0, dot_x = 0, position_x = 0, legend_y = 0,
              dot_y = 0
            dotTxt_x = 167;//180-(26/2)
            dotNum_x = dotTxt_x - 5;
            dot_x = 180, position_x = dot_x + 120
            dot_y = that.$refs.detectionCharts.offsetHeight / 2;
            dotTxt_y = dot_y + 10; //50/2
            dotNum_y = dotTxt_y - 25;

            let detection_option = {
              title: [{
                text: t,
                left: dotTxt_x, //'24%',
                top: dotNum_y, //'42%',
                textAlign: 'center',
                textBaseline: 'middle',
                textStyle: {
                  color: '#000',
                  fontSize: 22,
                  fontWeight: 'normal',
                  position: 'center'
                }
              }, {
                text: '发现',
                left: dotTxt_x,
                top: dotTxt_y,
                textAlign: 'center',
                textBaseline: 'middle',
                textStyle: {
                  color: '#000',
                  fontWeight: 'normal',
                  position: 'center',
                  fontSize: 12
                }
              }],

              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}",
                show: true           //取消 鼠标滑过的提示框

              },
              color: ["#e77e50", "#1296db", "#a1a1a1"],
              legend: {
                orient: 'vertical',
                selectedMode: false, //取消图例的点击事件
                left: position_x,
                top: '35%',
                data: that.detecteName,
                //['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                textStyle: {
                  fontSize: '12',
                  color: "#000"
                }

              },
              calculable: false,
              series: [{
                name: '检测处理分类',
                type: 'pie',
                center: [170, 110],
                radius: [70, 80],
                hoverAnimation: false, //关闭 hover 在扇区上的放大动画效果。
                cursor: 'default', //鼠标悬浮时在图形元素上时鼠标的样式是什么。同 CSS 的 cursor。
                itemStyle: {
                  normal: {
                    label: {
                      show: false,//显示中间数据
                      position: 'center',

                    },

                    labelLine: {
                      show: false
                    },

                  },

                },
                data: that.detecteValue

              }]
            }

            //柱状图1
            let behavior_option = {
              tooltip: {
                trigger: 'item',
              },
              calculable: true,
              grid: {
                left: '23%',
                right: '10%',
                top: '10%',
                bottom: '10%'
              },
              xAxis: [{
                show: false,
                type: 'value',
                boundaryGap: [0, 0.01]
              }],
              yAxis: [{
                show: true,
                type: 'category',
                data: that.yaxisBehavior,
                barWidth: 10, //柱图宽度
                triggerEvent: true,
                axisLine: {
                  show: false
                }, //坐标轴
                axisTick: [{ //坐标轴小标记
                  show: false
                }],
                axisLabel: {
                  textStyle: {
                    fontSize: '12',
                    color: "#000"
                  }
                }

              }],
              series: [{
                color: "#1296db",
                type: 'bar',
                tooltip: {
                  show: false
                },
                barWidth: 10, //柱宽度
                data: that.seriesBehavior, //[18, 12, 45, 56, 78],
                itemStyle: {

                  normal: {
                    label: {
                      show: true, //显示文本
                      position: 'right',
                      /*  position: [left_b, '0'], //数据值位置*/
                      textStyle: {
                        fontSize: '12',
                        color: "#317FDA",
                      }
                    },
                  }
                }

              }]
            }
            //柱状图2
            let aggressive_option = {

              tooltip: {
                trigger: 'item',
              },
              calculable: true,
              grid: {
                left: '23%',
                right: '10%',
                top: '10%',
                bottom: '10%'
              },
              xAxis: [{
                show: false,
                type: 'value',
                boundaryGap: [0, 0.01]
              }],
              yAxis: [{
                show: true,
                type: 'category',
                data: that.yaxisAgree,
                barWidth: 10, //柱图宽度
                axisLine: {
                  show: false
                }, //坐标轴
                axisTick: [{ //坐标轴小标记
                  show: false
                }],
                axisLabel: {
                  textStyle: {
                    fontSize: '12',
                    color: "#000"
                  }
                }

              }],
              series: [{
                color: "#1296db",
                type: 'bar',
                tooltip: {
                  show: false
                },
                barWidth: 10, //柱宽度
                data: that.seriesAgree, //[18, 12, 45, 56, 78],
                itemStyle: {
                  normal: {
                    label: {
                      show: true, //显示文本
                      /* position: [left_b, '0'], //数据值位置*/
                      position: 'right',
                      textStyle: {
                        fontSize: '12',
                        color: "#317FDA",
                        align: 'left'
                      }
                    },

                  }
                }

              }]
            };
            that._detectionCharts.setOption(detection_option);
            that._behaviorCharts.setOption(behavior_option);
            that._aggressiveCharts.setOption(aggressive_option);

            //主机危险性总览
            let OverviewList = res.result.hostThreatOverviewCount; //获取列表信息(主机危险性总览)
            let sum = 0; //主机数求和
            for (let x =0;x< OverviewList.length;x++) {  //当前分析结果
              sum += OverviewList[x].countNum
              that.total = sum
              that.priorityNum = OverviewList[x].priority
              switch (that.priorityNum) {
                case 1:
                  that.countNum_item1 = OverviewList[x].countNum
                  break;
                case 2:
                  that.countNum_item2 = OverviewList[x].countNum
                  break;
                case 3:
                  that.countNum_item3 = OverviewList[x].countNum
                  break;
                case 4:
                  that.countNum_item4 = OverviewList[x].countNum
                  break;
              }
            }
          }
        })
      },
      //仪表盘页面点击主机名跳转页面
      dashHost(num) {
        this.priorityNum = num
        this.$router.push({name: 'overview', params:{priorityNum: this.priorityNum}})
      },
      //危险资产 --主机详情页
      /*detectionHost(){
        this.$router.push({name: 'hostDetailDetec'})
      },*/
      //查看更多
      assetsHost(){
        this.$router.push({name: 'coreAssets'})
      },
    },
    mounted() {
      this.getInitList();
    }

  }
</script>
<style>
  .title_header{
    margin-bottom: 15px;
    border: 1px solid #d8dce5;
    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 0 3px 0 rgba(0, 0, 0, 0.04);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 0 3px 0 rgba(0, 0, 0, 0.04);
  }
  .text_center{text-align: center}
  .text_right{text-align: right}
  .text_border{border-bottom: 1px solid #d8dce5;}
  /*.el-row {
    margin: 5px 0;
  }*/
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-border {
    border: 1px solid #d8dce5;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    min-height: 190px;
    margin-right: 5px;
  }
  .grid-content_item {
    min-height: 20px;
    margin-right: 5px;
  }
  .row-bg {
    background-color: #f9fafc;
  }

  .el-col-1 {
    width: 2.16667%;
  }
  .el-col-11 {
    width: 47.83333%;
  }
  .height-30{
    height: 20px;
    margin: 10px;
    line-height: 20px;
    font-weight: 800;
  }
  .el-table th>.cell {
    font-weight: normal;
  }
  /*主机危险性总览*/
  .dashboard_item {
    width: 48%;
    margin: 10px;
    height: 190px;
    position: relative;
    cursor: pointer;
    border:1px solid #d8dce5;
  }
  .item0 {
    position: absolute;
    left: 0;
  }

  .item1 {
    position: absolute;
    right: 0;
  }

  .item2 {
    position: absolute;
    bottom: 0;
  }

  .item3 {
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .reports_column_one,
  .reports_column_two {
    flex-basis: 100%;
    display: flex;
    justify-content: space-between;
  }
  .reports_part {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
    width: 100%;
    text-align: center;
    font-size: 30px;
  }

  .reports_part span {
    width: 30%;
    display: inline-block;
    color: #000;
  }

  .reports_text01 {
    position: absolute;
    left: 7%;
    color: #fff;
    top: 2%;
    font-size: 12px;
    z-index: 1;
  }

  .reports_text02 {
    position: absolute;
    right: 9%;
    top: 2%;
    color: #fff;
    font-size: 12px;
    z-index: 1;
  }

  .reports_text03 {
    position: absolute;
    left: 7%;
    bottom: 2%;
    color: #fff;
    font-size: 12px;
    z-index: 1;
  }

  .reports_text04 {
    position: absolute;
    right: 9%;
    bottom: 2%;
    color: #fff;
    font-size: 12px;
    z-index: 1;
  }
  .host_info {
    position: relative;
    font-size: 12px;
    text-align: left;
  }

  .host_name {
    position: absolute;
    color: #6c707f!important;
    font-weight: 700;
  }

  .minus_img {
    position: absolute;
    bottom: 0;
    right: 30px;
    width: 12px;
    height: 12px;
  }

  .host_num {
    position: absolute;
    right: 18px;
    bottom: -2px;
    vertical-align: middle;
    color: #6c707f!important;
    font-weight: 700;
  }

  i {
    font-style: normal
  }
  .dashboard_item.d_item_0 {
    margin-top: 5px;
    margin-right: 5px;
  }
  .dashboard_item.d_item_2 {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .dashboard_item.d_item_3 {
    margin-bottom: 5px;
    margin-left: 5px;
  }
  .dashboard_item.d_item_1 {
    margin-left: 5px;
    margin-top: 5px;
  }

</style>
