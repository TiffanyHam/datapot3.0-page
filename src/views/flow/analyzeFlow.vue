<template>
  <div class="filter-container" style="width: 98%;height: 90%;margin: 0 auto;overflow-y: auto;overflow-x: hidden;">
    <el-row class="title_header1">
      <el-col :span="24" style="text-align: center;padding: 7px 0px;background:#fff" class="el-icon-time"> {{beginTime}} 00:00:00 至 {{endTime}} 24:00:00</el-col>
    </el-row>
    <el-row :gutter="20">
      <div class="box_left">
        <el-col :span="14" style="padding-right: 0px;">
          <el-row>
            <el-col>
              <div class="box items"  v-loading="countLoading" style="margin-left: 0px;padding: 7px 15px">
                <p>http事件总数</p>
                <p><span class="imp">{{count}}</span>&nbsp;计数</p>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="box" style="margin-left: 0px;margin-right: 0;margin-top: 0px">
                <p>Http请求方式</p>
                <div v-loading="loading" id="requestChart" ref="requestChart" style="width:100%;height: 240px"></div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="box" style="margin-left: 0;margin-top: 0px">
                <p>Http响应码</p>
                <div  v-loading="loading" id="codesChart" ref="codesChart" style="width:100%;height: 240px"></div>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="box" style="margin-left: 0px;margin-right: 0;margin-top: 0px">
                <p>内网IP访问TOP10</p>
                <div v-loading="loading"  id="srcIpChart" ref="srcIpChart" style="width:100%;height: 330px"></div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="box" style="margin-left: 0;margin-top: 0px">
                <p>外网IP访问TOP10</p>
                <div v-loading="loading" id="desIpChart" ref="desIpChart" style="width:100%;height: 330px"></div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </div>
      <div class="box_right">
        <el-col :span="10" style="padding: 0px">
          <div class="box" style="margin-right: 10px;margin-left: 0px">
            <p>HTTP请求被访问TOP10</p>
            <div v-loading="loading" id="cityChart" ref="cityChart" style="width:100%;height:330px"></div>
          </div>
          <div class="box" style="margin-right: 10px;margin-left: 0px">
            <p>HTTP流量趋势</p>
            <div v-loading="countLoading" id="trendChart" ref="trendChart" style="width:100%;height:330px"></div>
          </div>
        </el-col>
      </div>
    </el-row>
  </div>
</template>
<script type="text/ecmascript-6">
  import axios from 'axios'
  import echarts from 'echarts'
  import {dateFormatter1} from '../../utils/time.js'
  import {analysisNum,analyzeCharts} from '../../api/flow/analyzeFlow.js'

  export default {
    data() {
      return {
        count:'',
        countLoading:true,
        beginTime:dateFormatter1(Date()),
        endTime:dateFormatter1(Date()),
        loading:true,
        _httpReqMethod: [],
        _statusCode:[],
        _srcIpTop:[],
        _desIpTop:[],
        _cityTop:[],
        axiaData:[],
        serData:[],
        axisSrcIp:[],
        seriesSrcIp:[],
        axisDesIp:[],
        seriesDesIp:[],
        axisCityTop:[],
        seriesCityTop:[],
        _requestChart:null,
        _trendChart:null,
        _codesChart:null,
        _srcIpChart:null,
        _desIpChart:null,
        _cityChart:null,
      }
    },
    methods:{
      initEcharts(){
        //流量趋势图
        analysisNum('').then(res =>{
          if(res!=undefined || res!=null) {
            this.countLoading = false
            this.count = res.result.eventCount
            this.serData = res.result.trafficTrends.count
            this.axiaData = res.result.trafficTrends.time
            for (let i = 0; i < this.serData.length; i ++){
              this.serData[i] > 0 ? this.serData[i] = this.serData[i]/10000 : this.serData[i] = this.serData[i];
            }
            this._trendChart = echarts.init(this.$refs.trendChart);
            //折线--流量趋势图
            let trendOption = {
              grid: {
                left: '4%',
                right: '4%',
                bottom: '4%',
                top: '14%',
                containLabel: true
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  lineStyle: {
                    color: '#919294'
                  }
                },
                padding: [5, 10],
                extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
              },
              legend: {
                right: 20,
                orient: 'vertical',
                data: ['今日'],
                icon: 'circle',
                textStyle: {
                  fontSize: '12',
                  color: "#9d9fa8"
                }
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
                data: this.axiaData

              },
              yAxis: {
                type: 'value',
                name: '单位：万',
                nameLocation: 'end',
                nameGap: '10',
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: ['#ccc']
                  }
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
                  margin: 10,
                  textStyle: {
                    fontSize: 12
                  }
                },
              },
              series: [{
                color: '#317FDA',
                name: '今日',
                data: this.serData,
                type: 'line',
                smooth: true
              }]
            };
            this._trendChart.setOption(trendOption);
          }
        })

        //多图表
        analyzeCharts('').then(res =>{
          if(res!=undefined || res!=null) {
            this.loading = false
            //Http请求方式
            this._httpReqMethod = res.result.httpReqMethod
            //Http响应码
            this._statusCode = res.result.statusCode
            //内网IP访问TOP10
            let _srcIpTop = res.result.srcIpTop
            for (let x = 0; x < _srcIpTop.length; x++) {
              this.axisSrcIp.push(_srcIpTop[x].name)
              this.seriesSrcIp.push(_srcIpTop[x].value/10000)
            }
            //外网IP访问TOP10
            let _desIpTop = res.result.desIpTop
            for (let x = 0; x < _desIpTop.length; x++) {
              this.axisDesIp.push(_desIpTop[x].name)
              this.seriesDesIp.push(_desIpTop[x].value/10000)
            }
            //HTTP请求被访问前10
            let _cityTop = res.result.cityTop
            for (let x = 0; x < _cityTop.length; x++) {
              this.axisCityTop.push(_cityTop[x].name)
              this.seriesCityTop.push(_cityTop[x].value/10000)
            }

            this._requestChart = echarts.init(this.$refs.requestChart);
            this._codesChart = echarts.init(this.$refs.codesChart);
            this._srcIpChart = echarts.init(this.$refs.srcIpChart);
            this._desIpChart = echarts.init(this.$refs.desIpChart);
            this._cityChart = echarts.init(this.$refs.cityChart);

            //Http请求方式
            let requestOption = {
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                show: true,
                orient: 'vertical',  //图例列表的布局朝向。
                x: 'left',
                left: '5%', // '45%',
                top: '10%',
                //selectedMode: false, //取消图例的点击事件
                textStyle: {
                  color: '#919294',
                  fontSize: '12'
                },
                icon: 'circle' //图例标识圆形
              },
              series: [
                {
                  name: '请求方式',
                  type: 'pie',
                  radius: '55%',
                  center: ['63%', '50%'],
                  label: {
                    normal: {
                      show: false
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  lableLine: {
                    //length:0.001,
                    normal: {
                      show: true,
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  color: ['#138af0', '#17c7d4', '#f8d56f', '#a76ced', "#26a9e2", "#75d373", "#91da47", "#00dcf8", "#3784ff", "#9aebff"],
                  data: this._httpReqMethod,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            }
            //http响应码
            let codesOption = {
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                show: true,
                orient: 'horizontal',  //图例列表的布局朝向。
                x: 'right',
                left: '60%', // '45%',
                top: '10%',
                //selectedMode: false, //取消图例的点击事件
                textStyle: {
                  color: '#919294',
                  fontSize: '12'
                },
                icon: 'circle' //图例标识圆形
              },
              series: [
                {
                  name: '响应码',
                  type: 'pie',
                  radius: '55%',
                  center: ['33%', '50%'],
                  label: {
                    normal: {
                      show: true
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  lableLine: {
                    normal: {
                      show: true
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  color: ["#91da47", "#00dcf8", "#75d373", "#9aebff", '#138af0', '#17c7d4', "#3784ff", '#f8d56f', '#a76ced', "#26a9e2"],
                  data: this._statusCode,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            }

            //内网IP
            let ipOption = {

              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                data: ['2011年', '2012年']
              },
              grid: {
                left: '4%',
                right: '6%',
                bottom: '12%',
                top: '10%',
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
                  //	rotate: 30

                }
              },
              yAxis: {
                type: 'category',
                //	name: 'IP',
                nameLocation: 'end',
                nameGap: '10',
                nameTextStyle: {
                  color: '#919294'
                },
                boundaryGap: false,
                splitLine: {
                  show: true
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
                data: this.axisSrcIp,
              },
              series: [{
                name: '',
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
                    shadowColor: '#00eded'
                  }
                },
                barWidth: '10',
                data: this.seriesSrcIp,
              }]
            };

            //目标ip top10
            let desIpTop_option = {
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                //data: ['2011年', '2012年']
              },
              grid: {
                left: '4%',
                right: '6%',
                bottom: '12%',
                top: '10%',
                containLabel: true
              },
              xAxis: {
                name: '单位：万',
                nameLocation: 'middle',
                nameGap: '30',
                nameTextStyle: {
                  color: '#919294'
                },
                type: 'value',
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#ccc'
                  }
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
                  },
                  //rotate: 30

                }
              },
              yAxis: {
                type: 'category',
                //name: 'IP',
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
                data: this.axisDesIp,
              },
              series: [{
                name: '',
                type: 'bar',
                itemStyle: {
                  normal: {
                    show: true,
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                      offset: 0,
                      color: '#138af0'
                    }, {
                      offset: 1,
                      color: '#b5defe'
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
                data: this.seriesDesIp,
              }]
            };

            //城市top10
            let cityOption = {
              tooltip: {
                trigger: 'axis',
                axisPointer: {  // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'
                }
              },
              grid: {
                left: '6%',
                right: '6%',
                bottom: '5%',
                top: '14%',
                containLabel: true
              },
              xAxis: {
                nameLocation: 'end',
                nameGap: '5',
                nameTextStyle: {
                  color: '#919294'
                },
                data: this.axisCityTop,
                axisLine: {
                  lineStyle: {
                    color: '#919294'
                  }
                },
                axisTick: {
                  show: false //去掉刻度标尺
                },
                splitLine: {
                  show: false,
                  lineStyle: {
                    color: '#ccc'
                  }
                },
                axisLabel: {
                  color: '#000',
                  fontSize: 12,
                  rotate: 50
                }
              },
              yAxis: {
                name: '单位：万',
                nameLocation: 'end',
                nameGap: '10',
                nameTextStyle: {
                  color: '#919294'
                },
                axisTick: {
                  show: false
                },
                nameTextStyle: {
                  color: '#919294',
                  fontSize: 12
                },
                axisLine: {
                  lineStyle: {
                    color: '#919294'
                  }
                },
                axisLabel: {
                  color: '#000',
                  fontSize: 12
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#ccc'
                  }
                }

              },
              series: [{
                type: 'bar',
                barWidth: 18,
                itemStyle: {
                  normal: {
                    show: true,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#00b0ff'
                    }, {
                      offset: 0.8,
                      color: '#7052f4'
                    }]),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                  }
                },
                data: this.seriesCityTop
              }]
            };

            this._requestChart.setOption(requestOption);
            this._codesChart.setOption(codesOption);
            this._srcIpChart.setOption(ipOption);
            this._desIpChart.setOption(desIpTop_option);
            this._cityChart.setOption(cityOption);
          }
        })

      },

    },

    mounted(){
      this.initEcharts();
    },

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
  .sumary .el-col.el-col-8{padding: 0!important;}
  .sumary{margin:0 15px}
  .height1{
    height:300px;
  }
  .height2{
    height:240px;
  }
  .height3{
    height:52px;
  }
  .imp{font-size: 26px;}
  .items p{line-height: 28px;}
</style>
