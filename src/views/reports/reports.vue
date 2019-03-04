<template>
  <div class="title">
    <div class="filter-container" ref="reports" style="margin: 0 38px;">
      <el-form :inline="true" :model="paraForm" ref="paraForm">
        <el-row>
          <el-col :span="24" style="margin: 20px 0 27px 0;font-size: 16px;font-weight: 800;">创建报告</el-col>
        </el-row>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-form-item label="数据源" prop="source">
            <el-select v-model="paraForm.source" placeholder="请选择" style="width:120px;">
              <el-option
                v-for="item in sourcesOps"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="起始日期" prop="beginDateTime">
            <el-date-picker
              v-model="paraForm.beginDateTime"
              value-format="yyyy-MM-dd"
              type="date"
              style="width:150px;"
              placeholder="开始日期"
              :picker-options="pickerOptions0">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" prop="endDateTime">
            <el-date-picker
              v-model="paraForm.endDateTime"
              type="date"
              placeholder="结束日期"
              value-format="yyyy-MM-dd"
              style="width:150px;"
              :picker-options="pickerOptions1">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <div class="clear"></div>
        <el-row :gutter="20">
          <el-col :span="10" class="mgt-35">
            <div class="mgb-20">主机过滤：</div>
            <el-form-item label="威胁度" prop="hostThreat">
              <el-slider
                v-model="paraForm.hostThreat"
                :show-input-controls="false"
                show-input>
              </el-slider>
            </el-form-item>
            <el-form-item label="可信度" prop="hostCertainty">
              <el-slider
                v-model="paraForm.hostCertainty"
                :show-input-controls="false"
                show-input>
              </el-slider>
            </el-form-item>
            <el-form-item label="主机分类" prop="hostClassification">
              <el-select v-model="paraForm.hostClassification" placeholder="请选择">
                <el-option
                  v-for="item in hostsOps"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="10" class="mgt-35">
            <div class="mgb-20">检测过滤：</div>
            <el-col>
              <el-form-item label="威胁度" prop="detectionThreat">
                <el-slider
                  v-model="paraForm.detectionThreat"
                  :show-input-controls="false"
                  show-input>
                </el-slider>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="可信度" prop="detectionCertainty">
                <el-slider
                  v-model="paraForm.detectionCertainty"
                  :show-input-controls="false"
                  show-input>
                </el-slider>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="威胁阶段" prop="detectionStage">
                <el-select
                  v-model="paraForm.detectionStage"
                  multiple
                  @change='selectAllSta'
                  collapse-tags
                  placeholder="请选择">
                  <el-option
                    v-for="item in stageOps"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="威胁类型" prop="detectionType">
                <el-select
                  v-model="paraForm.detectionType"
                  multiple
                  @change='selectAll'
                  collapse-tags
                  placeholder="请选择">
                  <el-option
                    v-for="item in detectionOps"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </el-col>
        </el-row>
        <div class="clear"></div>
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="12"> <el-button type="primary" @click="getReports" v-loading.fullscreen.lock="fullscreenLoading">生成报告</el-button></el-col>
            <el-col :span="12"><el-button type="info" @click="resetPeports('paraForm')">重置条件</el-button></el-col>
          </el-row>
        </el-form-item>
      </el-form>

      <!--详情弹窗-->
      <el-dialog title="报告详情" class="reports" :visible.sync="dialogFormVisible" @close="closeReports">
        <el-row>
          <span class="attention">建议使用横向打印</span>
          <span class="rep_btns">
            <el-button type="primary" class="el-icon-download" v-print="'#printTest'" @click="doPrint">打印报告</el-button>
            <el-button type="primary" class="el-icon-download" @click="getPdf">下载报告</el-button>
          </span>
        </el-row>
        <div id="printTest" class="detailsAll printOrder-data">
          <el-row>
            <el-col :span="24" :class="t_style" style="text-align: center;padding: 5px 10px;" class="el-icon-time"> {{beginTime}} 至 {{endTime}}</el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="space-around" style=" height: 80%;overflow: auto;">
            <!--left-->
            <el-col :span="11">
              <!--主机危险性总览-->
              <div class="mgb-20" :class="t_style">
                <el-row type="flex" class="row-bg" justify="space-around">
                  <el-col :span="12"><div class="grid-content_item" style="margin: 10px 0px 0px 10px;">主机危险性总览</div></el-col>
                  <el-col :span="12"><div class="grid-content_item" :class="t_right" style="margin: 10px 10px 0px 0px;">当前分析结果：<span>{{total}}</span>Hosts</div></el-col>
                </el-row>
                <el-row type="flex" class="row-bg" justify="space-around">
                  <div class="reports_column_two">
                    <div class="dashboard_item d_item_2">
                      <h3 class="reports_text01">高危</h3>
                      <img src="../../assets/images/state_orange.png" width="110" height="21" class="item0">
                      <p class="reports_part">
                        <span><img src="../../assets/images/state03.png"></span>
                        <span class="reports_num">{{countNum_item3}}</span>
                        <span class="host_info">主机</span>
                      </p>
                    </div>
                    <div class="dashboard_item d_item_3">
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
                    <div class="dashboard_item d_item_0">
                      <h3 class="reports_text03">低危</h3>
                      <img src="../../assets/images/state_gray.png" width="110" height="21" class="item2">
                      <p class="reports_part">
                        <span><img src="../../assets/images/state04.png"></span>
                        <span class="reports_num">{{countNum_item1}}</span>
                        <span class="host_info">主机</span></p>
                    </div>
                    <div class="dashboard_item d_item_1">
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
                  <el-col :span="12"><div class="height-30" :class="t_right" style="color: #409EFF">查看更多</div></el-col>
                  <el-col :span="24">
                    <el-table
                      :data="keyAssetsData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                      :header-cell-class-name="rowClass"
                      :header-cell-style="{background:'#eee'}"
                      border
                      style="width: 100%">
                      <el-table-column
                        label="主机名"
                        align="center">
                        <template slot-scope="scope">
                          <el-button type="text"  style="color: #4a88a5;padding: 0">{{ scope.row.hostName }}</el-button>
                        </template>
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
                      :data="assetsData"
                      :header-cell-style="{background:'#eee'}"
                      border
                      style="width: 100%">
                      <el-table-column
                        prop="hostName"
                        label="主机名"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="hostIp"
                        label="主机Ip"
                        width="180">
                        <template slot-scope="scope">
                          <el-button type="text"  style="color: #4a88a5;padding: 0">{{ scope.row.hostIp }}</el-button>
                        </template>
                      </el-table-column>
                      <el-table-column label="峰值" align="center">
                        <el-table-column
                          prop="threat"
                          label="威胁度" align="center">
                        </el-table-column>
                        <el-table-column
                          prop="certainty"
                          label="可信度" align="center">
                        </el-table-column>
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
                <el-row :class="t_style" ref="pie_bg">
                  <el-col :span="24" :class="t_border"><div class="height-30">检测处理分类</div></el-col>
                  <el-col :span="24">
                    <div id="detectionCharts" ref="detectionCharts" style="width:100%;height: 220px"></div>
                    <div ref="detection_div"></div>
                  </el-col>
                </el-row>
              </div>
              <!--威胁阶段-->
              <div class="mgb-20">
                <el-row :class="t_style">
                  <el-col :span="24" :class="t_border"><div class="height-30">威胁阶段</div></el-col>
                  <el-col :span="24">
                    <div id="behaviorCharts" ref="behaviorCharts" style="width:100%;height: 220px"></div>
                    <div ref="behavior_div"></div>
                  </el-col>
                </el-row>
              </div>
              <!--威胁类型-->
              <div class="mgb-20">
                <el-row :class="t_style">
                  <el-col :span="24" :class="t_border"><div class="height-30">威胁类型</div></el-col>
                  <el-col :span="24">
                    <div id="aggressiveCharts" ref="aggressiveCharts" style="width:100%;height:220px"></div>
                    <div ref="aggressive_div"></div>
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
                      :header-cell-style="{background:'#eee'}"
                      border
                      style="width: 100%">
                      <el-table-column label="主机名"  prop="hostName"  align="center">
                        <el-table-column>
                          <template slot-scope="scope">{{ scope.row.hostName }}</template>
                        </el-table-column>
                      </el-table-column>
                      <el-table-column label="主机IP"  prop="hostIp">
                        <el-table-column>
                          <template slot-scope="scope"  style="color: #4a88a5;padding: 0">{{ scope.row.hostIp }}</template>
                        </el-table-column>
                      </el-table-column>
                      <el-table-column label="起始值" align="center">
                        <el-table-column
                          prop="preThread"
                          label="威胁度" align="center">
                        </el-table-column>
                        <el-table-column
                          prop="preCertainty"
                          label="可信度" align="center">
                        </el-table-column>
                      </el-table-column>
                      <el-table-column label="当前值" align="center">
                        <el-table-column
                          prop="curThreat"
                          label="威胁度" align="center">
                        </el-table-column>
                        <el-table-column
                          prop="curCertainty"
                          label="可信度" align="center">
                        </el-table-column>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <!--主机检测结果-->
          <div class="mgb-20">
            <el-row :class="t_style">
              <el-col :span="24"><div class="height-30">主机检测结果（{{ohostTotal}}个主机，{{okeyHostTotal}}个核心资产）</div></el-col>
              <el-col :span="24">
                <el-table
                  :data="hostResultsData.slice((currentPage-1)*bigPagesize,currentPage*bigPagesize)"
                  v-loading="loading"
                  :header-cell-style="{background:'#eee'}"
                  :header-cell-class-name="rowClassReport"
                  border
                  style="width: 100%">
                  <el-table-column label="主机名" align="center">
                    <el-table-column  prop="hostName" width="160">
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="ip"  align="center">
                    <el-table-column  prop="hostIp" width="160">
                    </el-table-column>
                  </el-table-column>

                  <el-table-column label="当前值" align="center">
                    <el-table-column
                      prop="curThreat"
                      label="威胁度" align="center">
                    </el-table-column>
                    <el-table-column
                      prop="curCertainty"
                      label="可信度" align="center">
                    </el-table-column>

                  </el-table-column>
                  <el-table-column label="峰值" align="center">
                    <el-table-column
                      prop="peakValueThreat"
                      label="威胁度" align="center">
                    </el-table-column>
                    <el-table-column
                      prop="peakValueCertainty"
                      label="可信度" align="center">
                    </el-table-column>

                  </el-table-column>
                  <el-table-column label="攻击行为阶段" align="center">
                    <el-table-column
                      label="侦查"
                      width="60">
                      <template slot-scope="scope">
                        <div v-for="x in scope.row.arr">
                          <div v-if="x == '1'"><p class="circle"></p></div>
                        </div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="武装"
                      width="60">
                      <template slot-scope="scope">
                        <div v-for="x in scope.row.arr">
                          <div v-if="x == '2'"><p class="circle"></p></div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="投递"
                      width="60">
                      <template slot-scope="scope">
                        <div v-for="x in scope.row.arr">
                          <div v-if="x == '3'"><p class="circle"></p></div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="突破"
                      width="60">
                      <template slot-scope="scope">
                        <div v-for="x in scope.row.arr">
                          <div v-if="x == '4'"><p class="circle"></p></div>
                        </div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="安装"
                      width="60">
                      <template slot-scope="scope">
                        <div v-for="x in scope.row.arr">
                          <div v-if="x == '5'"><p class="circle"></p></div>
                        </div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="控制"
                      width="60">
                      <template slot-scope="scope">
                        <div v-for="x in scope.row.arr">
                          <div v-if="x == '6'"><p class="circle"></p></div>
                        </div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="攻击"
                      width="60">
                      <template slot-scope="scope">
                        <div v-for="x in scope.row.arr">
                          <div v-if="x == '7'"><p class="circle"></p></div>
                        </div>
                      </template>
                    </el-table-column>

                  </el-table-column>

                  <el-table-column label="最近活动时间"  align="center">
                    <el-table-column  prop="detectTime"  align="center">
                    </el-table-column>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
          <!--攻击行为检测结果-->
          <div class="mgb-20">
            <el-row :class="t_style">
              <el-col :span="24"><div class="height-30" style="margin-bottom:0px">攻击行为检测结果（<span>{{oattackBehavior}}</span>个）</div></el-col>
              <el-row :gutter="20">
                <el-col :span="12">
                  <div v-for="(item,index) in attackTables">
                    <div v-if="index % 2 == 0">
                      <el-col class="title_name"><span class="statusSty" :class="item.stage| statusFilter">{{item.stage}}</span>&nbsp;&nbsp;{{item.name}}</el-col>
                      <el-col>
                        <el-table
                          :id="tableId(index)"
                          :data="(item.value).slice((currentPage-1)*tablePagesize,currentPage*tablePagesize)"
                          :header-cell-style="{background:'#eee'}"
                          border
                          style="width: 100%">
                          <el-table-column label="主机名"  prop="hostName"  align="center">
                            <el-table-column>
                              <template slot-scope="scope">
                                <el-button type="text"  style="width:150px;color: #4a88a5;padding: 0">{{ scope.row.hostName }}</el-button>
                              </template>
                            </el-table-column>
                          </el-table-column>
                          <el-table-column label="峰值" align="center">
                            <el-table-column
                              prop="peakValueThreat"
                              label="威胁度" align="center" width="100">
                            </el-table-column>
                            <el-table-column
                              prop="peakValueCertainty"
                              label="可信度" align="center" width="100">
                            </el-table-column>
                          </el-table-column>
                          <el-table-column label="最近活动时间"  align="center">
                            <el-table-column  prop="detectTime"  align="center">
                            </el-table-column>
                          </el-table-column>
                        </el-table>
                      </el-col>
                    </div>
                  </div>
                </el-col>

                <el-col :span="12">
                  <div v-for="(item,index) in attackTables">
                    <div v-if="index % 2 != 0">
                      <el-col class="title_name"><span class="statusSty" :class="item.stage| statusFilter">{{item.stage}}</span>&nbsp;&nbsp;{{item.name}}</el-col>
                      <el-col>
                        <el-table
                          :id="tableId(index)"
                          :data="(item.value).slice((currentPage-1)*tablePagesize,currentPage*tablePagesize)"
                          :header-cell-style="{background:'#eee'}"
                          border
                          style="width: 100%">
                          <el-table-column label="主机名"  prop="hostName"  align="center">
                            <el-table-column>
                              <template slot-scope="scope">
                                <el-button type="text"  style="width:150px;color: #4a88a5;padding: 0">{{ scope.row.hostName }}</el-button>
                              </template>
                            </el-table-column>
                          </el-table-column>
                          <el-table-column label="峰值" align="center">
                            <el-table-column
                              prop="peakValueThreat"
                              label="威胁度" align="center" width="100">
                            </el-table-column>
                            <el-table-column
                              prop="peakValueCertainty"
                              label="可信度" align="center" width="100">
                            </el-table-column>
                          </el-table-column>
                          <el-table-column label="最近活动时间"  align="center">
                            <el-table-column  prop="detectTime"  align="center">
                            </el-table-column>
                          </el-table-column>
                        </el-table>
                      </el-col>
                    </div>
                  </div>
                </el-col>
              </el-row>

            </el-row>
          </div>

        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import axios from 'axios'
  import echarts from 'echarts'
  import {constantSta,constantTy,dashboardTbl_init,hostResults_init} from '../../api/reports/reports.js'
  import {dateFormatter} from '../../utils/time.js'
  import html2Canvas from 'html2canvas'
  import JsPDF from 'jspdf'

  export default {
    data() {
      return {
        bigPagesize:10,//每页的数据条数
        pagesize:5,//每页的数据条数
        tablePagesize:15,//每页的数据条数
        currentPage:1,//默认开始页面
        _detectionCharts:null,
        _behaviorCharts:null,
        _aggressiveCharts:null,
        beginTime:'',
        endTime:'',
        isClick:false,
        detecteName:[],
        detecteValue:[],
        seriesBehavior:[],
        yaxisBehavior:[],
        seriesAgree:[],
        yaxisAgree:[],
        oldOptions:[],// 用来储存上一次select的数据
        ohostTotal:'',
        okeyHostTotal:'',
        oattackBehavior:'',
        t_style: 'title_header',   //在 data 中把 yellow 赋给 box
        t_center:'text_center',
        t_right:'text_right',
        t_border:'text_border',
        fullscreenLoading:false,
        loading:true,
        total_round : '',
        biggestListData:[],
        assetsData:[],
        keyAssetsData:[],
        hostResultsData:[],
        attackData:[],
        attackTables:'',
        total:'',
        su:'',
        arr: [],
        countNum_item1:'',
        countNum_item2:'',
        countNum_item3:'',
        countNum_item4:'',
        stageNames:'',
        stageArr:'',
        hostStages:'',
        colorArr:'',
        xStage:'',
        xName:'',
        stageOps:[],
        sourcesOps:[],
        hostsOps:[],
        detectionOps:[],
        dialogFormVisible: false,
        paraForm: {
          beginDateTime: dateFormatter(new Date(), false),
          endDateTime: dateFormatter(new Date(), false),
          source: '1',
          hostClassification:'0',
          detectionType:['detectionType'].join(','),
          detectionStage:['detectionStage'].join(','),
          detectionCertainty:0,
          detectionThreat:0,
          hostCertainty:0,
          hostThreat:0
        },
        // 结束时间大于开始时间且开始时间小于此刻
        //起始时间
        pickerOptions0: {
          disabledDate: time => {
            if (this.endDateTime) {
              return (
                time.getTime() > new Date(this.endDateTime).getTime()
              );
            } else {
              return time.getTime() > Date.now();
            }
          }
        },
        //结束时间
        pickerOptions1: {
          disabledDate: time => {
            if (this.paraForm.beginDateTime) {
              return (
                time.getTime() >= Date.now() ||
                time.getTime() < new Date(this.paraForm.beginDateTime).getTime()
              );
            } else {
              return time.getTime() > Date.now();
            }
          }
        },
      }
    },
    filters:{
      // 颜色转换
      statusFilter(status) {
        const statusMap = {
          '侦查': 'co_blue',
          '武装': 'co_dark',
          '投递': 'co_yellow',
          '突破': 'co_purple',
          '安装': 'co_gray',
          '控制': 'co_orange',
          '攻击': 'co_red',
        }
        return statusMap[status]
      },
    },
    methods:{
      tableId:function(i){
        return "table" +i
      },
      //威胁类型（选择全部）
      selectAll(val) {
        let allValues = []
        //保留所有值
        for (let item of this.detectionOps) {
          allValues.push(item.value)
        }
        // 用来储存上一次的值，可以进行对比
        const oldVal = this.oldOptions.length === 1 ? this.oldOptions[0]:[]
        // 若是全部选择
        if (val.includes('allTypes')) this.paraForm.detectionType = allValues

        // 取消全部选中  上次有 当前没有 表示取消全选
        if (oldVal.includes('allTypes') && !val.includes('allTypes')) this.paraForm.detectionType = []

        // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
        // 新老数据都有全部选中
        if (oldVal.includes('allTypes') && val.includes('allTypes')) {
          const index = val.indexOf('allTypes')
          val.splice(index, 1) // 排除全选选项
          this.paraForm.detectionType = val
        }

        //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
        if (!oldVal.includes('allTypes') && !val.includes('allTypes')) {
          if (val.length === allValues.length - 1) this.paraForm.detectionType = ['allTypes'].concat(val)
        }

        //储存当前最后的结果 作为下次的老数据
        this.oldOptions[0] = this.paraForm.detectionType
      },
      //威胁阶段  （全选）
      selectAllSta(val) {
        let allValues = []
        for (let item of this.stageOps) {
          allValues.push(item.value)
        }
        const oldVal = this.oldOptions.length === 1 ? this.oldOptions[0]:[]
        if (val.includes('allStages')) this.paraForm.detectionStage = allValues

        if (oldVal.includes('allStages') && !val.includes('allStages')) this.paraForm.detectionStage = []

        if (oldVal.includes('allStages') && val.includes('allStages')) {
          const index = val.indexOf('allStages')
          val.splice(index, 1) // 排除全选选项
          this.paraForm.detectionStage = val
        }

        if (!oldVal.includes('allStages') && !val.includes('allStages')) {
          if (val.length === allValues.length - 1) this.paraForm.detectionStage = ['allStages'].concat(val)
        }

        this.oldOptions[0] = this.paraForm.detectionStage
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
      rowClassReport ({ row, column, rowIndex, columnIndex }) {
        switch (columnIndex) {
          case 6:
            return 'co_blue'
            break;
          case 7:
            return 'co_dark'
            break;
          case 8:
            return 'co_yellow'
            break;
          case 9:
            return 'co_purple'
          case 10:
            return 'co_gray'
            break;
          case 11:
            return 'co_orange'
            break;
          case 12:
            return 'co_red'
            break;
        }
      },
      //常量
      getConstantType() {
        let that = this;
        constantTy('').then(res => {
          if(res!= undefined || res!= null) {
            let detectionTypes = res.result
            let a = detectionTypes
            this.$set(detectionTypes, 'allTypes','全部') //全选
            let type = []
            for (let i in detectionTypes) {
              let a = {
                value: i,
                label: detectionTypes[i]
              }
              type.push(a)
            }
            that.detectionOps = type.reverse()
          }
        });
      },
      getConstant() {
        //威胁阶段
        let that = this;
        constantSta('').then(res => {
          if(res!=undefined || res!=null) {

            let stagesP = res.result.stages
            let sources = res.result.sources
            let hostClassifications = res.result.hostClassifications
            this.$set(stagesP, 'allStages', "全部") //全选
            let temp = [],temp1=[],temp2=[]
            //阶段
            for (let i in stagesP){
              let a ={
                value:i,
                label:stagesP[i]
              }
              temp.push(a)
            }
            that.stageOps = temp.reverse()
            //数据源
            for (let i in sources){
              let b ={
                value:i,
                label:sources[i]
              }
              temp1.push(b)
            }
            that.sourcesOps = temp1
            //核心资产
            for (let i in hostClassifications){
              let c ={
                value:i,
                label:hostClassifications[i]
              }
              temp2.push(c)
            }
            that.hostsOps = temp2
          }
        })

      },

      //重置
      resetPeports(formName){
        this.$refs[formName].resetFields();
      },

      //chart图标导出图片
      createImage() {
        const charts_one = echarts.init(this.$refs.detectionCharts);
        let image1 = charts_one.getDataURL();      //导出图表图片，返回一个 base64 的 URL
        let detection_div = this.$refs.detection_div;
        detection_div.innerHTML = '<img src="'+image1+'" alt="">';
        this.$refs.detectionCharts.style.display ='none'

        const charts_two = echarts.init(this.$refs.behaviorCharts);
        let image2 = charts_two.getDataURL();
        let behavior_div = this.$refs.behavior_div;
        behavior_div.innerHTML = '<img src="'+image2+'" alt="">';
        this.$refs.behaviorCharts.style.display ='none'

        const charts_three = echarts.init(this.$refs.aggressiveCharts);
        let image3 = charts_three.getDataURL();
        let aggressive_div = this.$refs.aggressive_div;
        aggressive_div.innerHTML = '<img src="'+image3+'" alt="">';
        this.$refs.aggressiveCharts.style.display ='none'

      },

      doPrint(){
        this.createImage()
      },
      //
      clearEchartImg() {
        //清空ecarts图片
        this.$refs.detection_div.innerHTML =''
        this.$refs.behavior_div.innerHTML  =''
        this.$refs.aggressive_div.innerHTML  =''
        //打开图表
        this.$refs.detectionCharts.style.display ='block'
        this.$refs.behaviorCharts.style.display ='block'
        this.$refs.aggressiveCharts.style.display ='block'
      },

      //将特定部分转成pdf并下载
      getPdf () {
        html2Canvas(document.querySelector('#printTest'), {
          allowTaint: true
        }).then(function (canvas) {
            let contentWidth = canvas.width
            let contentHeight = canvas.height
            let pageHeight = contentWidth / 592.28 * 841.89
            let leftHeight = contentHeight
            let position = 0
            let imgWidth = 595.28
            let imgHeight = 592.28 / contentWidth * contentHeight
            let pageData = canvas.toDataURL('image/jpeg', 1.0)
            let PDF = new JsPDF('', 'pt', 'a4')
            if (leftHeight < pageHeight) {
              PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
            } else {
              while (leftHeight > 0) {
                PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                leftHeight -= pageHeight
                position -= 841.89
                if (leftHeight > 0) {
                  PDF.addPage()
                }
              }
            }
            PDF.save('content.pdf')
          }
        )
      },
      //弹窗关闭
      closeReports(){
        this.dialogFormVisible = false //关闭对话框
        //清空表格
        this.biggestListData.splice(0, this.biggestListData.length);
        this.assetsData.splice(0, this.assetsData.length);
        this.keyAssetsData.splice(0, this.keyAssetsData.length);
        this.hostResultsData.splice(0, this.hostResultsData.length);
        this.attackData.splice(0, this.attackData.length);
        this.clearEchartImg()
      },
      //报告详情
      //仪表盘初始化
      getInitList(){
        let that = this;
        if(this.paraForm.detectionStage.join(',').includes('allStages')){
          this.paraForm.detectionStage.splice('allStages', 1);
        }
        if(this.paraForm.detectionType.join(',').includes('allTypes')){
          this.paraForm.detectionType.splice('allTypes', 1);
        }
        let param = {
          'beginDateTime':this.paraForm.beginDateTime,
          'endDateTime': this.paraForm.endDateTime,
          'source': String(this.paraForm.source),
          'hostClassification':String(this.paraForm.hostClassification),
          'detectionType':this.paraForm.detectionType.join(','),
          'detectionStage':this.paraForm.detectionStage.join(','),
          'detectionCertainty':String(this.paraForm.detectionCertainty),
          'detectionThreat':String(this.paraForm.detectionThreat),
          'hostCertainty':String(this.paraForm.hostCertainty),
          'hostThreat':String(this.paraForm.hostThreat),
        }
        //主机检测结果
        hostResults_init(param).then(res => {
          that.loading = false
          that.fullscreenLoading = false
          if(res!=undefined || res!=null) {
            //table

            let hostResultsList = res.result.hostDetectionResults;//主机检测结果
            hostResultsList == null ? that.hostResultsData = [] : that.hostResultsData = hostResultsList;

            for (let i = 0; i < hostResultsList.length; i++) {
              let time = hostResultsList[i].detectTime;
              hostResultsList[i].detectTime = time.slice(0, time.indexOf("."));//去掉时间后面的毫秒
              if(hostResultsList[i].stages.indexOf(',') != -1) {
                let hostStages = hostResultsList[i].stages.split(',');
                var temp = [];
                for (var j in hostStages) {
                  temp.push(hostStages[j]);
                }
                that.hostResultsData[i]['arr'] = temp;
              } else {
                that.hostResultsData[i]['arr'] = hostResultsList[i].stages;
              }
            }

            /*主机检测结果（4个主机，1个核心资产）*/
            that.ohostTotal = res.result.hostTotal;
            that.okeyHostTotal = res.result.keyHostTotal;
            /*攻击行为检测结果（15个）*/
            that.oattackBehavior = res.result.attackBehaviorTotal;
            /* 循环 table*/
            let tempArr = [];
            let tabList = res.result.attackBehaviorDetections

            for (let x in tabList) {
              //console.log(index(x))
              let xArr = x.split('_');
              let xStage = xArr[1]
              let xName = xArr[0]
              for (let y in tabList[x]) {
                let t = tabList[x][y].detectTime;
                tabList[x][y].detectTime = t.slice(0, t.indexOf("."));//去掉时间后面的毫秒
                //let staNum = tabList[x][y].stage //状态
              }
              tempArr.push({
                name: xName,
                stage: xStage,
                value: tabList[x]
              });
            }
            that.attackTables = tempArr;
          }
        })
        let sparam = {
          'beginDateTime':this.paraForm.beginDateTime,
          'endDateTime': this.paraForm.endDateTime,
          'source': String(this.paraForm.source),
          'hostClassification':String(this.paraForm.hostClassification),
          'detectionType':this.paraForm.detectionType.join(','),
          'detectionStage':this.paraForm.detectionStage.join(','),
          'detectionCertainty':String(this.paraForm.detectionCertainty),
          'detectionThreat':String(this.paraForm.detectionThreat),
          'hostCertainty':String(this.paraForm.hostCertainty),
          'hostThreat':String(this.paraForm.hostThreat),
        }
        /*dashboard*/
        dashboardTbl_init(sparam).then(res => {

          that.dialogFormVisible = true //显示对话框
          if(res!=undefined || res!=null) {
            that.beginTime = res.result.beginDateTime
            that.endTime = res.result.endDateTime

            //主机危险性总览
            let OverviewList = res.result.hostThreatOverviewCount; //获取列表信息(主机危险性总览)
            let sum = 0; //主机数求和
            for (var x in OverviewList) {  //当前分析结果
              sum += OverviewList[x].countNum
              this.total = sum
              let priorityNum = OverviewList[x].priority
              switch (priorityNum) {
                case 1:
                  this.countNum_item1 = OverviewList[x].countNum
                  break;
                case 2:
                  this.countNum_item2 = OverviewList[x].countNum
                  break;
                case 3:
                  this.countNum_item3 = OverviewList[x].countNum
                  break;
                case 4:
                  this.countNum_item4 = OverviewList[x].countNum
                  break;
              }
            }

            //table
            let biggestList = res.result.biggestMovers;//变化最大危险资产
            let assetsList = res.result.assets;//危险资产
            let keyAssetsList = res.result.hosts;//核心资产
            biggestList == null ? this.biggestListData = [] : this.biggestListData = biggestList;
            assetsList == null ? this.assetsData = [] : this.assetsData = assetsList;
            keyAssetsList == null ? this.keyAssetsData = [] : this.keyAssetsData = keyAssetsList;

            that.stageName = res.result.detectionStages;//状态
            for (let i = 0; i < keyAssetsList.length; i++) {
              that.stageArr = keyAssetsList[i].stages.split(',');//1,4,6,7  =>  1 4 6 7
              console.log(that.stageArr)

            }


            //charts
            let breakdowns = res.result.breakdowns;//检测处理分类
            let chartNum = 0;
            for (let i = 0; i < breakdowns.length; i++) {
              breakdowns[i].dealStatusName = breakdowns[i].dealStatusName + "：" + breakdowns[i].num + "（" + breakdowns[i].perCentum + "）";
              that.detecteName.push(breakdowns[i].dealStatusName);
              that.detecteValue.push({
                name: breakdowns[i].dealStatusName,
                value: breakdowns[i].num
              });
              chartNum += breakdowns[i].num
              that.total_round = chartNum
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

            that.$nextTick(() => {
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
                  text: chartNum,
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
              that._detectionCharts.setOption(detection_option, true);
              that.detecteName = []
              that.detecteValue = []
              that._behaviorCharts.setOption(behavior_option, true);
              that.yaxisBehavior = []
              that.seriesBehavior = []
              that._aggressiveCharts.setOption(aggressive_option, true);
              that.yaxisAgree = []
              that.seriesAgree = []

            })
          }
        })

      },
      //生成报告
      getReports(){
        this.fullscreenLoading = true;
        this.getInitList()
      },

    },
    mounted() {
      this.$refs.reports.style.height = (`${document.documentElement.clientHeight}` -120)+'px';

      this.getConstant()
      this.getConstantType()
    },

  }
</script>
<style>
  /*仪表盘*/

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
  .bg-purple {
    background: #d3dce6;
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


  /*报告*/
  .el-input--small .el-input__inner {
    width: 40px;
  }
  .el-input-number.is-without-controls .el-input__inner {
    padding-left: 0px;
    padding-right: 0px;
  }
  .el-slider__button {
    width: 7px;
    height: 7px;
  }
  .el-slider__runway {
    height: 4px;
  }
  .el-slider__button-wrapper {
    top: -16px;
  }
  .el-input__icon {
    line-height: 30px;
  }
  .select_txt{line-height: 35px;}
  .el-slider__button {
    background-color: #409EFF;
  }
  .el-slider.el-slider--with-input {
    width: 388px;
  }
  .reports .el-dialog {
    width: 97%;
    margin-top: 3vh!important;
    margin-bottom: 3vh!important;
  }
  .title_name{
    margin: 20px 0;
  }
  .attention{
    position: absolute;
    transform: translate(-50%);
    left: 50%;
    font-weight: 800;
    top: -62px;
    color: #b61a32
  }
  .rep_btns {
    position: absolute;
    top: -66px;
    right: 27px;
  }
</style>
