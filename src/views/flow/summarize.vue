<template>
  <div class="sumary" style="width:98%;height:90%;overflow-y:auto;margin: 0 auto;overflow-x:hidden;">
    <el-row class=" title_header1">
      <el-col :span="24" style="text-align: center;padding: 7px 0px;background:#fff" class="el-icon-time"> {{beginTime}} 00:00:00 至 {{endTime}} 24:00:00</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="tabBox box_one" v-loading="logLoading" style="margin-left: 10px;margin-right: 0px;">
          <div class="item" style="border-top: none;padding-top:0 ">
            <p>网络日志大小</p>
            <p><span class="imps">{{a_num}}</span><i class="unit">{{a_unit}}</i></p>
          </div>
          <div class="item">
            <p>剩余存储空间</p>
            <p><span class="imps">{{b_num}}<i class="unit">{{b_unit}}</i></span></p>
          </div>
          <div class="item">
            <p>日志存储天数</p>
            <p><span class="imps">{{logDays}}</span><i class="unit">天</i></p>
          </div>
          <div class="item">
            <p>事件总数</p>
            <p><span class="imps">{{eventCountNum}}</span></p>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="tabBox box_one" style="margin-right: 0px;">
          <div>协议占比</div>
          <div v-loading="sourceLoading" id="agreementChart" ref="agreementChart" style="width:100%;height:300px"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="tabBox box_one" style="margin-right: 10px;">
          <div>访问来源城市Top10</div>
          <div v-loading="sourceLoading" id="cityIpChart" ref="cityIpChart" style="width:100%;height: 300px"></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="tabBox" style="margin-left: 10px;margin-right: 0;margin-top: 0">
          <div class="char">
            <el-select v-model="value" placeholder="请选择" @change="getSourceValue">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <!--内网ip-->
          <div v-if="showSource"><div id="sourceIp"  v-loading="ceLoading" ref="sourceIp" style="width:100%;height: 300px"></div></div>
          <div v-else><div id="sourceIpTwo"  v-loading="souLoading" ref="sourceIpTwo" style="width:100%;height: 300px"></div></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="tabBox" style="margin-right: 0;margin-top: 0">
          <div class="char">
            <el-select v-model="value3" placeholder="请选择" @change="getIpValue">
              <el-option
                v-for="item in opts"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <!--外网ip-->
          <div v-if="showIp"><div v-loading="targetLoading" id="targetIp" ref="targetIp" style="width:100%;height: 300px"></div></div>
          <div v-else><div  v-loading="targetIpLoading" id="targetIpTwo" ref="targetIpTwo" style="width:100%;height: 300px"></div></div>
        </div>
      </el-col>
      <el-col :span="8"><div class="tabBox"style="margin-right:10px;margin-top: 0">
        <div class="char">
          <el-select v-model="value2" placeholder="请选择" @change="getDownValue">
            <el-option
              v-for="item in opt"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!--上下行趋势-->
        <div v-if="show"><div id="upDownControl"  v-loading="upDownLoading" ref="upDownControl" style="width:100%;height: 300px"></div></div>
        <div v-else><div id="upDownControlTwo"  v-loading="controlLoading" ref="upDownControlTwo" style="width:100%;height: 300px"></div></div>
      </div>
      </el-col>
    </el-row>
  </div>
</template>
<script type="text/ecmascript-6">
  import axios from 'axios'
  import echarts from 'echarts'
  import {dateFormatter1} from '../../utils/time.js'
  import {topDataName,upAndDowData,LogData,upAndDowDataNew,topDataNameNew,topDataIpNew} from '../../api/flow/summarize.js'

  export default {
    data() {
      return {
        options: [{
          value: '1',
          label: '内网IP访问次数TOP10'
        }, {
          value: '2',
          label: '内网IP访问流量TOP10'
        }],
        opt: [{
          value: '1',
          label: '访问次数上下行趋势'
        }, {
          value: '2',
          label: '访问流量上下行趋势'
        }],
        opts: [{
          value: '1',
          label: '外网IP访问次数TOP10'
        }, {
          value: '2',
          label: '外网IP访问流量TOP10'
        }],
        value: '1',
        value2: '1',
        value3: '1',
        show:true,
        showSource:true,
        showIp:true,
        beginTime:dateFormatter1(Date()),
        endTime:dateFormatter1(Date()),
        eventCountNum:'',
        logDays:'',
        a_num:'',
        a_unit:'',
        b_num:'',
        b_unit:'',
        logLoading:true,
        sourceLoading:true,
        targetLoading:true,
        ceLoading:true,
        souLoading:true,
        upDownLoading:true,
        targetIpLoading:true,
        controlLoading:true,
        agreementData:[],
        axisCityIp:[],
        seriesCityIp:[],
        axisTargetIp:[],
        seriesTargetIp:[],
        axisUpDown:[],
        upSeries:[],
        downSeries:[],
        desAxis:[],
        desSeries:[],
        axisUpDownTwo:[],
        upTwoSeries:[],
        downTwoSeries:[],
        axisSourceIp:[],
        serieSourceIp:[],
        axisSourceIpTwo:[],
        serieSourceIpTwo:[],
        serieSourceIpOne:[],
        _agreementChart:null,
        _cityIpChart:null,
        _upDownControl:null,
        _targetIpChart:null,
        _targetIpChartTwo:null,
        _upDownControlTwo:null,
        _sourceIpChart:null,
        _sourceIpChartTwo:null
      }
    },
    methods:{
      //外网访问切换
      getIpValue(val){
        if(val == '2'){
          this.showIp = false;
          this.targetIpLoading = true
          this.targetIpTwoCharts()
        }else if (val == '1'){
          this.showIp = true
          this.targetLoading = true
          this.targetIpCharts()
        }

      },
      getDownValue(value){
        if(value == '2'){
          this.show = false;
          this.controlLoading = true
          this.upAndDowTwoCharts()
        }else if (value == '1'){
          this.show = true
          this.upDownLoading = true
          this.upAndDowCharts()
        }

      },
      getSourceValue(v){
        if(v == '2'){
          this.showSource = false;
          this.souLoading = true
          this.sourceIpTwoCharts()
        }else if (v == '1'){
          this.showSource = true
          this.ceLoading = true
          this.sourceIpCharts()
        }

      },
      //日志分析
      initLogData(){
        LogData('').then(res =>{
          this.logLoading = false
          if(res!=undefined || res!=null) {
            //日志文件大小
            let logFile = res.result.logFileSize;
            let a_length = logFile.length;//字符长度
            this.a_unit = logFile.substring(a_length - 1, a_length);//截取字符单位
            this.a_num = logFile.substring(0, a_length - 1);//截取数字
            //剩余存储空间
            let freeSpace = res.result.freeSpace;
            let b_length = freeSpace.length;//字符长度
            this.b_unit = freeSpace.substring(b_length - 1, b_length);//截取字符单位
            this.b_num = freeSpace.substring(0, b_length - 1);//截取数字
            //日志存储天数
            this.logDays = res.result.logDays
          }
        })
      },
      //内网次数
      sourceIpCharts(){
        topDataName('').then(res =>{
          if(res!=undefined || res!=null) {
            this.ceLoading = false
            let sourceIpData = res.result.srcIp
            for (let i = 0; i < sourceIpData.length; i++) {
              this.axisSourceIp.push(sourceIpData[i].name)
              this.serieSourceIp.push(sourceIpData[i].value/10000)
            }
            this._sourceIpChart = echarts.init(this.$refs.sourceIp);

            let sourceIp_option = {
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                //data: ['访入']
              },
              grid: {
                left: '2%',
                right: '5%',
                bottom: '8%',
                top:'6%',
                containLabel: true
              },
              xAxis: {
                type: 'value',
                name: '单位：万',
                nameLocation: 'middle',
                nameGap: '30',
                nameTextStyle: {
                  color: '#919294'
                },
                axisLine: {
                  lineStyle: {
                    color: '#919294'
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#ccc'
                  }
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#919294'
                  },
                  //rotate:30
                }
              },
              yAxis: {
                type: 'category',
                // name: 'IP',
                nameLocation: 'end',
                nameGap: '10',
                nameTextStyle: {
                  color: '#919294'
                },
                boundaryGap: false,
                splitLine: {
                  show: false
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

                },
                splitLine: {
                  show: false,
                  lineStyle: {
                    color: '#333'
                  }
                },
                data: this.axisSourceIp
              },
              series: [
                {
                 // name: '访入',
                  type: 'bar',
                  itemStyle: {
                    normal: {
                      show: true,
                      color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: '#01d3d2'
                      }, {
                        offset: 1,
                        color: '#88ecec'
                      }]),
                      barBorderRadius: 50,
                      borderWidth: 0,
                    },
                    emphasis: {
                      shadowBlur: 15,
                      shadowColor: '#129eff'
                    }
                  },
                  barWidth: '10',
                  data: this.serieSourceIp,
                }
              ]
            }
            this._sourceIpChart.setOption(sourceIp_option, true)
            this.axisSourceIp = []
            this.serieSourceIp = []
          }
        })
      },
      //内网流量
      sourceIpTwoCharts(){
        const para ={
          'msg':''
        }
        topDataIpNew(para).then(res =>{
          if(res!=undefined || res!=null) {
            this.souLoading = false
            let sourceIpList = res.result
            for (let i = 0; i < sourceIpList.length; i++) {
              this.axisSourceIpTwo.push(sourceIpList[i].ip);
              this.serieSourceIpOne.push((sourceIpList[i].up/(1024*1024)).toFixed(4));
              this.serieSourceIpTwo.push((sourceIpList[i].down/(1024*1024)).toFixed(4));
            }

            this._sourceIpChartTwo = echarts.init(this.$refs.sourceIpTwo)
            let sourceIpTwo_option = {
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                data: ['上行', '下行']
              },
              grid: {
                left: '2%',
                right: '5%',
                bottom: '8%',
                top:'7%',
                containLabel: true
              },
              xAxis: {
                type: 'value',
                name: '单位：M',
                nameLocation: 'middle',
                nameGap: '30',
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
                  },
                  //rotate:20,
                }
              },
              yAxis: {
                type: 'category',
                nameLocation: 'end',
                nameGap: '10',
                nameTextStyle: {
                  color: '#919294'
                },
                boundaryGap: false,
                splitLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  lineStyle: {
                    color: '#919294'
                  }
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
                data: this.axisSourceIpTwo
              },
              series: [
                {
                  name: '上行',
                  color: ['#01d3d2'],
                  type: 'bar',
                  stack: '总量',
                  label: {
                    normal: {
                      color: '#000',
                      show: false,
                      position: 'insideRight'
                    }
                  },
                  barWidth: '10',
                  data: this.serieSourceIpOne
                },
                {
                  name: '下行',
                  color: ['#129eff'],
                  type: 'bar',
                  stack: '总量',
                  label: {
                    normal: {
                      color: '#000',//文字颜色
                      show: false,
                      position: 'insideRight'
                    }
                  },
                  barWidth: '10',
                  data: this.serieSourceIpTwo
                }
              ]
            }
            this._sourceIpChartTwo.setOption(sourceIpTwo_option, true)
            this.axisSourceIpTwo = [];
            this.serieSourceIpTwo = [];
            this.serieSourceIpOne = [];
          }
        })
      },
      //外网次数
      targetIpCharts(){
        topDataName('').then(res =>{
          if(res!=undefined || res!=null) {
            this.targetLoading = false
            //外网IP访问TOP10
            let targetIpData = res.result.dstIp
            for (let i = 0; i < targetIpData.length; i++) {
              this.axisTargetIp.push(targetIpData[i].name)
              this.seriesTargetIp.push(targetIpData[i].value/10000)
            }

            this._targetIpChart = echarts.init(this.$refs.targetIp);

            //外网IP访问TOP10
            let targetIp_option = {
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                //data: ['访入']
              },
              grid: {
                left: '2%',
                right: '5%',
                bottom: '7%',
                top:'6%',
                containLabel: true
              },
              xAxis: {
                type: 'value',
                name: '单位：万',
                nameLocation: 'middle',
                nameGap: '30',
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
                  },
                //  rotate:20
                }
              },
              yAxis: {
                type: 'category',
                // name: 'IP',
                nameLocation: 'end',
                nameGap: '10',
                nameTextStyle: {
                  color: '#919294'
                },
                boundaryGap: false,
                axisTick: {
                  show: false
                },
                axisLine: {
                  lineStyle: {
                    color: '#919294'
                  }
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
                data: this.axisTargetIp,
              },
              series: [
                {
                 // name: '访入',
                  type: 'bar',
                  itemStyle: {
                    normal: {
                      show: true,
                      color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        /*color: '#00c0e9'*/
                        color: '#138af0'
                      }, {
                        offset: 1,
                        /*color: '#3b73cf'*/
                        color: '#b5defe'
                      }]),
                      barBorderRadius: 50,
                      borderWidth: 0,
                    },
                    emphasis: {
                      shadowBlur: 15,
                      shadowColor: '#00eded'
                    }
                  },
                  barWidth: '10',
                  data: this.seriesTargetIp,
                }
              ]
            };
            this._targetIpChart.setOption(targetIp_option, true);
            this.seriesTargetIp = []
            this.axisTargetIp = []
          }
        })
      },
      //外网流量
      targetIpTwoCharts(){
        const param ={
          'msg':'',
        }
        topDataNameNew(param).then(res =>{
          if(res!=undefined || res!=null) {
            this.targetIpLoading = false
            let desList = res.result
            for (let i = 0; i < desList.length; i++) {
              this.desAxis.push(desList[i].ip);
              this.desSeries.push((desList[i].all/(1024*1024)).toFixed(4));
            }
            this._targetIpChartTwo = echarts.init(this.$refs.targetIpTwo);
            //外网IP访问TOP10
            let targetIpTwo_option = {
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
               // data: ['访入']
              },
              grid: {
                left: '2%',
                right: '5%',
                bottom: '7%',
                top:'6%',
                containLabel: true
              },
              xAxis: {
                type: 'value',
                name: '单位：M',
                nameLocation: 'middle',
                nameGap: '30',
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
                  },
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#919294'
                  },
                 // rotate:20
                }
              },
              yAxis: {
                type: 'category',
                // name: 'IP',
                nameLocation: 'end',
                nameGap: '10',
                nameTextStyle: {
                  color: '#919294'
                },
                boundaryGap: false,
                axisTick: {
                  show: false
                },
                axisLine: {
                  lineStyle: {
                    color: '#919294'
                  }
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
                data: this.desAxis,
              },
              series: [
                {
                 // name: '访入',
                  type: 'bar',
                  itemStyle: {
                    normal: {
                      show: true,
                      color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        /*color: '#00c0e9'*/
                        color: '#138af0'
                      }, {
                        offset: 1,
                        /*color: '#3b73cf'*/
                        color: '#b5defe'
                      }]),
                      barBorderRadius: 50,
                      borderWidth: 0,
                    },
                    emphasis: {
                      shadowBlur: 15,
                      shadowColor: '#00eded'
                    }
                  },
                  barWidth: '10',
                  data: this.desSeries,
                }
              ]
            };

            this._targetIpChartTwo.setOption(targetIpTwo_option, true)
            this.desSeries = []
            this.desAxis = []
          }
        })
      },
      //上下行次数
      upAndDowCharts(){
        upAndDowData('').then(res =>{
          if(res!=undefined || res!=null) {
            this.upDownLoading = false
            //上下行次数
            let upDownControlData = res.result.andDown;
            this.axisUpDown = upDownControlData.time
            this.upSeries = upDownControlData.up
            this.downSeries = upDownControlData.down
            for (let i = 0; i < this.axisUpDown.length; i ++){
              upDownControlData.up[i] > 0 ? upDownControlData.up[i] = upDownControlData.up[i]/10000 : upDownControlData.up[i] = upDownControlData.up[i];
              upDownControlData.down[i] > 0 ? upDownControlData.down[i] = upDownControlData.down[i]/10000 : upDownControlData.down[i] = upDownControlData.down[i];
            }
            this._upDownControl = echarts.init(this.$refs.upDownControl)

            let upDownControl_option = {
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                textStyle: {
                  color: '#333',
                  fontSize: '12'
                },
                data: ['上行', '下行']
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '5%',
                top:'8%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                nameLocation: 'end',
                nameGap: '5',
                nameTextStyle: {
                  color: '#919294'
                },
                boundaryGap: false,
                axisTick: {
                  show: false
                },
                axisLine: {
                  lineStyle: {
                    color: '#919294'
                  }
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
                data: this.axisUpDown,
              },
              yAxis: {
                type: 'value',
                name: '单位：万',
                nameLocation: 'end',
                nameGap: '10',
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
                  name: '上行',
                  type: 'line',
                  smooth: true,
                  symbol: 'circle',
                  symbolSize: 6,
                  areaStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#a746a3'
                      }, {
                        offset: 1,
                        color: '#f3a8e0'
                      }], false)
                    }
                  },
                  itemStyle: {
                    normal: {
                      color: '#f3a8e0'
                    },
                    emphasis: {
                      opacity: 1,
                      shadowBlur: 15,
                      shadowColor: '#f3a8e0'
                    }
                  },
                  data: this.upSeries,
                },
                {
                  name: '下行',
                  smooth: true,
                  symbol: 'circle',
                  symbolSize: 6,
                  type: 'line',
                  areaStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(13,177,205,0.8)'
                      }, {
                        offset: 1,
                        color: 'rgba(13,177,205,0.2)'
                      }], false)
                    }
                  },
                  itemStyle: {
                    normal: {
                      color: 'rgba(13,177,205,1)'
                    },
                    emphasis: {
                      opacity: 1,
                      shadowBlur: 15,
                      shadowColor: '#015571'
                    }
                  },
                  data: this.downSeries,
                }
              ]
            };

            this._upDownControl.setOption(upDownControl_option, true)
            this.axisUpDown = []
            this.downSeries = []
            this.upSeries = []
          }
        })
      },
      //上下行流量
      upAndDowTwoCharts(){
        upAndDowDataNew('').then(res =>{
          if(res!=undefined || res!=null) {
            this.controlLoading = false
            let upDownData = res.result;
            for (let i = 0; i < upDownData.length; i++) {
              let times = upDownData[i].time
              let x_length = times.length;//字符长度
              let x_unit = times.substring(x_length - 5, x_length);//截取时间
              let x_num = times.substring(0, x_length - 6);//截取日期
              this.axisUpDownTwo.push(x_unit);
              this.upTwoSeries.push((upDownData[i].up/(1024*1024)).toFixed(4))
              this.downTwoSeries.push((upDownData[i].down/(1024*1024)).toFixed(4))
            }

            this._upDownControlTwo = echarts.init(this.$refs.upDownControlTwo)

            //上下行流量
            let upDownControlTwo_option = {
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                textStyle: {
                  color: '#919294',
                  fontSize: '12'
                },
                data: ['上行', '下行']
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '5%',
                top:'8%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                nameLocation: 'end',
                nameGap: '5',
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
                  },
                  // rotate:30
                },
                splitLine: {
                  show: false,
                  lineStyle: {
                    color: '#ccc'
                  }
                },
                data: this.axisUpDownTwo,
              },
              yAxis: {
                type: 'value',
                name: '单位：M',
                nameLocation: 'end',
                nameGap: '10',
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
                  name: '上行',
                  type: 'line',
                  smooth: true,
                  symbol: 'circle',
                  symbolSize: 6,
                  areaStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        /*color: '#00c0e9'*/
                        color: '#a746a3'
                      }, {
                        offset: 1,
                        /*color: '#3b73cf'*/
                        color: '#f3a8e0'
                      }], false)
                    }
                  },
                  itemStyle: {
                    normal: {
                      color: '#f3a8e0'
                    },
                    emphasis: {
                      opacity: 1,
                      shadowBlur: 15,
                      shadowColor: '#f3a8e0'
                    }
                  },
                  data: this.upTwoSeries,
                  //data:[10, 32, 51, 75, 90, 150, 210]
                },
                {
                  name: '下行',
                  smooth: true,
                  symbol: 'circle',
                  /*			symbol: 'image://data:image/png;base64,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',
                */            symbolSize: 6,
                  type: 'line',
                  areaStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(13,177,205,0.8)'
                      }, {
                        offset: 1,
                        color: 'rgba(13,177,205,0.2)'
                      }], false)
                    }
                  },
                  itemStyle: {
                    normal: {
                      color: 'rgba(13,177,205,1)'
                    },
                    emphasis: {
                      opacity: 1,
                      shadowBlur: 15,
                      shadowColor: '#015571'
                    }
                  },
                  data: this.downTwoSeries,
                }
              ]
            };

            this._upDownControlTwo.setOption(upDownControlTwo_option, true)
            this.axisUpDownTwo = []
            this.downTwoSeries = []
            this.upTwoSeries = []
          }
        })
      },


      getInitData(){
        upAndDowData('').then(res =>{
          if(res!=undefined || res!=null) {
            //事件总数
            this.eventCountNum = res.result.eventCount
          }
        })
        topDataName('').then(res =>{

          if(res!=undefined || res!=null) {
            this.sourceLoading = false
            //协议占比
            this.agreementData = res.result.protocol

            //城市Top10
            let cityIpData = res.result.cityTop
            for (let i = 0; i < cityIpData.length; i++) {
              this.axisCityIp.push(cityIpData[i].name)
              this.seriesCityIp.push(cityIpData[i].value/10000)
            }

            this._agreementChart = echarts.init(this.$refs.agreementChart);
            this._cityIpChart = echarts.init(this.$refs.cityIpChart);

            //协议占比
            let agreement_option = {
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                orient: 'vertical',
                left: '1%',
                top: '14%',
                textStyle: {
                  color: '#333',
                  fontSize: '12'
                },
              },
              series: [
                {
                  name: '协议占比',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '60%'],
                  color: ['#138af0', '#17c7d4', '#f8d56f', '#a76ced', '#5c9e21', '#c0c1c4', '#ffc1c2', '#fdfdff', '#fec049', '#9f1b51', '#dea438', '#432e59'],
                  data: this.agreementData,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            };

            //城市Top10
            let cityIp_option = {
              color: ['#3398DB'],
              tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              grid: {
                left: '1%',
                right: '8%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  name: '城市',
                  nameLocation: 'end',
                  nameGap: '5',
                  nameTextStyle: {
                    color: '#919294'
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
                    },
                    rotate: 50
                  },
                  splitLine: {
                    show: false,
                    lineStyle: {
                      color: '#ccc'
                    }
                  },
                  data: this.axisCityIp,
                }
              ],
              yAxis: [
                {
                  type: 'value',
                  name: '单位：万',
                  nameLocation: 'end',
                  nameGap: '10',
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
                }
              ],
              series: [
                {
                  name: '',
                  type: 'bar',
                  itemStyle: {
                    normal: {
                      show: true,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#f3a8e0'
                      }, {
                        offset: 1,
                        color: '#a746a3'
                      }]),
                      barBorderRadius: 50,
                      borderWidth: 0,
                    },
                    emphasis: {
                      shadowBlur: 15,
                      shadowColor: '#724ca1'
                    }
                  },
                  barWidth: '10',
                  data: this.seriesCityIp,
                }
              ]
            };

            this._agreementChart.setOption(agreement_option, true);
            this.agreementData = []
            this._cityIpChart.setOption(cityIp_option, true);
            this.seriesCityIp = []
            this.axisCityIp = []
          }

        })
      },
    },
    mounted(){
      this.getInitData()
      this.initLogData()
      this.targetIpCharts()
      this.upAndDowCharts()
      this.sourceIpCharts()
    }

  }
</script>
<style>
  .box_one{
    height: 310px!important;
  }
  .tabBox{
    border: 1px solid #dcdfe6;
    margin: 15px;
    padding: 15px;
    background: #fff;
    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 0 3px 0 rgba(0, 0, 0, 0.04);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 0 3px 0 rgba(0, 0, 0, 0.04);
    height: auto;
  }
  .sumary .el-col.el-col-8{padding: 0!important;}
  .sumary{margin:0 15px}
  .imps{font-size: 26px;}
  .item{padding: 10px 0px;border-top: 1px solid #dcdfe6;}
  .item p{line-height: 28px;}
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .char{
    margin-bottom: 10px;
  }
  .unit{font-size: 12px;color: #9D9FA5;margin-left:5px;font-style: normal;}
  .char .el-input__inner{color: #000}
  .char .el-input__icon { line-height: 30px;}
</style>
