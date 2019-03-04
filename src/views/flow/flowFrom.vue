<template>
  <div class="filter-container" style="height: 90%;overflow: auto">
    <el-row>
      <el-col>
        <!--echarts-->
        <div class="box">
          <div class="char">
            <el-select v-model="value5" placeholder="请选择" @change="getValue" style="width: 150px">
              <el-option
                v-for="item in opts"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div v-show="tableType == 'number'"><div v-loading="netLoading" id="netflow" ref="netflow" style="width:100%;height: 160px"></div></div>
          <div v-show="tableType == 'flow'"><div v-loading="flowLoading" id="netTwoflow" ref="netTwoflow" style="width:100%;height: 160px"></div></div>
        </div>
        <!--table-->
        <div class="box">
          <!--工具条-->
          <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="paraForm" ref="paraForm">
              <el-form-item prop="startDate" >
              <el-date-picker
                v-model="paraForm.startDate"
                type="date"
                style="width:150px"
                :picker-options="pickerOptions0"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
             <!-- <el-form-item prop="startDate" >
                <el-date-picker v-model="paraForm.startDate"
                                clearable style="width:200px"
                                :picker-options="startDatePicker"
                                type="datetime"
                                placeholder="请选择起始时间"></el-date-picker>
              </el-form-item>
              <el-form-item prop="endDate">
                <el-date-picker v-model="paraForm.endDate"
                                clearable style="width:200px"
                                :picker-options="endDatePicker"
                                type="datetime"
                                placeholder="请选择结束时间"></el-date-picker>
              </el-form-item>-->
              <el-form-item>
                <el-input v-model="paraForm.srcIp" placeholder="请输入访问ip" style="width:180px;"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input  v-model="paraForm.dstIp" placeholder="请输入被访问ip" style="width:180px;"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getSearch">查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>

          <el-container>
            <el-main>
                <el-table
                  class="flowTabs"
                  :data="tableList"
                  v-loading="loading"
                  :header-cell-style="{background:'#eee'}"
                  style="width: 100%">
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-form label-position="left" class="demo-table-expand">
                        <el-form-item label="被访问地址所属国家：">
                          <span>{{ props.row['enrichments:geo:ip_dst_addr:country'] }}</span>
                        </el-form-item>
                        <el-form-item label="被访问地址经纬度：">
                          <span>{{ props.row['enrichments:geo:ip_dst_addr:location_point']  }}</span>
                        </el-form-item>
                        <el-form-item label="主键：">
                          <span>{{ props.row.guid }}</span>
                        </el-form-item>
                        <el-form-item label="原始数据：	">
                          <span>{{ props.row.original_string }}</span>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="采集时间"
                    :formatter="fmtLength"
                    prop="timestamp">
                  </el-table-column>
                  <el-table-column
                    label="协议"
                    :formatter="fmtLength"
                    prop="protocol">
                  </el-table-column>
                  <el-table-column
                    label="访问ip"
                    :formatter="fmtLength"
                    prop="ip_src_addr">
                  </el-table-column>
                  <el-table-column
                    label="访问主机端口"
                    :formatter="fmtLength"
                    prop="ip_src_port">
                  </el-table-column>
                  <el-table-column
                    label="被访问ip"
                    :formatter="fmtLength"
                    prop="ip_dst_addr">
                  </el-table-column>
                  <el-table-column
                    label="被访问主机端口"
                    :formatter="fmtLength"
                    prop="ip_dst_port">
                  </el-table-column>
                </el-table>
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="pagesize"
                  background
                  layout="prev, pager, next,total"
                  :total="total">
                </el-pagination>
            </el-main>
          </el-container>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script type="text/ecmascript-6">
  import axios from 'axios'
  import echarts from 'echarts'
  import {getChartDate,getTblData,getChartDateNew,getTblDataNew} from '../../api/flow/flowFrom.js'
  import {timestampToTime,dateFormatter} from '../../utils/time.js'

  export default {
    data() {
      return {
        netflowChart:null,
        netflowTwoChart:null,
        axisNetflow:[],
        seriesNetflow:[],
        seriesflow:[],
        axisflow:[],
        cn:'',
        value5:'1',
        opts: [{
          value: '1',
          label: '访问次数统计'
        }, {
          value: '2',
          label: '访问流量统计'
        }],
        //tableHeight: document.documentElement.clientHeight - 495,
        total: 0,//默认数据总数
        pagesize:15,//每页的数据条数
        currentPage:1,//默认开始页面
        loading: true,//加载
        netLoading:true,
        flowLoading:true,
        tableType: 'number', // 操作日志:active or 登录日志:login
        paraForm:{
          srcIp:'',
          dstIp:'',
          startDate:dateFormatter(new Date(), false),
          //endDate:dateFormat(new Date(), false),
        },
       // startDatePicker: this.beginDate(),
        //endDatePicker: this.processDate(),
        tableList: [],
        pickerOptions0: {
          //大于当前的禁止，小于6个月前的禁止
          disabledDate(time) {
            let _now = Date.now()
            let sixMonth = 6 * 30 * 24 * 60 * 60 * 1000
            let sixMonthDays = _now - sixMonth;
            return time.getTime() > _now || time.getTime() < sixMonthDays;
          }
        },

      }
    },
    methods:{
      fmtLength(row, column){
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          return arr
        }
      },
      //时间
      /*beginDate(){
        const self = this
        return {
          disabledDate(time){
            if (self.paraForm.endDate) {  //如果结束时间不为空，则小于结束时间
              return new Date(self.paraForm.endDate).getTime() < time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },

      processDate() {
        const  self = this
        return {
          disabledDate(time) {
            if (self.paraForm.startDate) {  //如果开始时间不为空，则结束时间大于开始时间
              return new Date(self.paraForm.startDate).getTime() > time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },*/

      //下拉切换图表
      getValue(value){
        if (value == '1') {
          this.netLoading = true
          this.flowChart()
          this.tableType = 'number';
        } else if (value == '2') {
          this.flowLoading = true
          this.flowTwoChart()
          this.tableType = 'flow';
        }
      },

      flowChart(){

        //echarts
        let para ={
          'startDate':this.paraForm.startDate
        }
        getChartDate(para).then(res =>{
          if(res!= undefined || res!=null) {
            this.netLoading = false
            this.seriesNetflow = res.result.flowTends.count
            for (let x = 0; x < this.seriesNetflow.length; x ++){
              this.seriesNetflow[x] > 0 ? this.seriesNetflow[x] = this.seriesNetflow[x]/10000 : this.seriesNetflow[x] = this.seriesNetflow[x];
            }
            this.axisNetflow = res.result.flowTends.time

            //访问次数统计
            this.netflowChart = echarts.init(this.$refs.netflow);

            let netflow_option = {
              //  backgroundColor: '#171c2f',
              tooltip: {
                trigger: 'axis'
              },
              grid: {
                left: '4%',
                right: '4%',
                bottom: '3%',
                top: '9%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                name: '时',
                nameLocation: 'end',
                nameGap: '10',
                nameTextStyle: {
                  color: '#919294'
                },
                axisLine: {
                  lineStyle: {
                    color: '#919294'
                  }
                },
                boundaryGap: false,
                axisTick: {
                  show: false
                },
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#919294'
                  }
                },
                splitLine: {
                  show: false,
                  lineStyle: {
                    color: '#ccc'
                  }
                },
                data: this.axisNetflow
              },
              yAxis: {
                type: 'value',
                name: '单位：万',
                nameLocation: 'middle',
                nameGap: '40',
                nameTextStyle: {
                  color: '#919294'
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#ccc'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#919294'
                  }
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#919294'
                  }

                }
              },
              series: [
                {
                  name: '访问次数',
                  type: 'line',
                  smooth: true,
                  showSymbol: false,
                  areaStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(166,109,240,0.8)'
                      }, {
                        offset: 1,
                        color: 'rgba(19,138,240,0.2)'
                      }], false)
                    }
                  },
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#a66df0'
                      }, {
                        offset: 1,
                        color: '#138af0'
                      }], false)
                    },
                    emphasis: {
                      opacity: 1,
                      shadowBlur: 15,
                      shadowColor: '#114c9a'
                    }
                  },
                  data: this.seriesNetflow
                }
              ]
            };
            this.netflowChart.setOption(netflow_option, true);
            this.seriesNetflow = []
            this.axisNetflow = []
          }
        })

      },
      //流量统计
      flowTwoChart(){
        let para ={
          'start':this.paraForm.startDate
        }
        getChartDateNew(para).then(res =>{
          if(res!=undefined || res!=null) {
            this.flowLoading =false
            let flowArr = res.result
            for(let i in flowArr){
              this.seriesflow.push(flowArr[i].all)
              this.axisflow.push(flowArr[i].time)
              this.seriesflow[i] > 0 ? this.seriesflow[i] = (this.seriesflow[i]/(1024*1024)).toFixed(4) : this.seriesflow[i] = this.seriesflow[i];
            }

            this.netflowTwoChart = echarts.init(this.$refs.netTwoflow);
            let netTwoflow_option = {
              tooltip: {
                trigger: 'axis'
              },
              grid: {
                left: '4%',
                right: '4%',
                bottom: '3%',
                top: '9%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                name: '时',
                nameLocation: 'end',
                nameGap: '10',
                nameTextStyle: {
                  color: '#919294'
                },
                axisLine: {
                  lineStyle: {
                    color: '#919294'
                  }
                },
                boundaryGap: false,
                axisTick: {
                  show: false
                },
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#919294'
                  }
                },
                splitLine: {
                  show: false,
                  lineStyle: {
                    color: '#ccc'
                  }
                },
                data: this.axisflow
              },
              yAxis: {
                type: 'value',
                name: '单位：M',
                nameLocation: 'middle',
                nameGap: '70',
                nameTextStyle: {
                  color: '#919294'
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#ccc'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#919294'
                  }
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#919294'
                  }

                }
              },
              series: [
                {
                  name: '访问流量',
                  type: 'line',
                  smooth: true,
                  showSymbol: false,
                  areaStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#138af0'
                      }, {
                        offset: 1,
                        color: '#b5defe'
                      }], false)
                    }
                  },
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#a66df0'
                      }, {
                        offset: 1,
                        color: '#138af0'
                      }], false)
                    },
                    emphasis: {
                      opacity: 1,
                      shadowBlur: 15,
                      shadowColor: '#114c9a'
                    }
                  },
                  data: this.seriesflow
                }
              ]
            }
            this.netflowTwoChart.setOption(netTwoflow_option, true);
            this.seriesflow = []
            this.axisflow = []
          }
        })
      },
      getSearch(){
        this.loading = true;
        this.currentPage = 1
        this.dataList()
        if (this.tableType == 'number') {

          this.netLoading = true
          this.flowChart()
        } else if (this.tableType == 'flow') {

          this.flowLoading = true
          this.flowTwoChart()
        }
        //this.flowChart()
       // this.getValue(value)
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.loading = true;
        this.dataList()
      },
      //次数 table
      dataList(){
        let para ={
          'srcIp':this.paraForm.srcIp,
          'dstIp':this.paraForm.dstIp,
          'startDate':this.paraForm.startDate,
          'pageNum': this.currentPage,
          'numPerPage':this.pagesize
        }
        getTblDataNew(para).then(res =>{
          if(res!== undefined || res!== null) {

            this.loading = false;
            let data = res.result.source;
            this.total = res.result.totalCount
            for(let x= 0; x<data.length;x++){
              data[x].timestamp = timestampToTime(data[x].timestamp)
            }
            data == null ? this.tableList = [] : this.tableList = data;
          }

        })
      },
    },
    mounted(){
      this.flowChart()
      this.dataList()
    }

  }
</script>
<style>
  .box{
    border: 1px solid #dcdfe6;
    margin: 15px;
    padding: 15px;
    background: #fff;
    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 0 3px 0 rgba(0, 0, 0, 0.04);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 0 3px 0 rgba(0, 0, 0, 0.04);
  }
  .demo-table-expand .el-form-item {
    margin-bottom: 0px;
  }
  .datePick .el-date-editor .el-range__icon {
    color: #409EFF;
    line-height: 23px;
  }
  .datePick .el-date-editor .el-range-separator {
    line-height: 23px;
  }
  .datePick .el-date-editor .el-range__close-icon {
    line-height: 23px;
  }
  .char{
    margin-bottom: 10px;
  }
  .char .el-input__inner{color: #000}
  .char .el-input__icon { line-height: 30px;}
</style>
