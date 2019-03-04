<template>
  <div class="pageOverflow">

    <div class="title company_ip asset" style="padding:10px 0;">
      <div class="filter-container">
        <section class="app-container">
          <el-row>
            <el-col :span="24">
              <el-tabs v-model="activeName" @tab-click="handleClick" class="asset">
                <!--资产发现-->
                <el-tab-pane label="资产发现" name="first">
                  <div class="a-con">
                    <el-row>
                      <el-col :span="24">
                        <div class="fl" style="margin-bottom:13px;">
                          <el-date-picker
                            v-model="date"
                            type="daterange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerptions0">
                          </el-date-picker>
                        </div>
                        <el-button type="primary" icon="el-icon-search" @click="assetFormSearch" style="margin-left:30px;margin-top: 2px;">查询</el-button>
                        <!--<div class="fl" style="margin-left:30px;margin-top:-4px;">
                                              <el-form :inline="true" ref="assetForm" :model="assetForm">
                                                 <el-form-item>
                                                   <el-input placeholder="请输入主机名/IP" v-model="assetForm.ip"></el-input>
                                                 </el-form-item>
                                                 <el-form-item>
                                                   <el-button type="primary" icon="el-icon-search" @click="assetFormSearch">查询</el-button>
                                                 </el-form-item>
                                             </el-form>
                                         </div>-->
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <div class="container_table">
                          <el-table
                            :data="tableData"
                            style="width: 100%" :height="tableHeight"
                            :default-sort = "{prop: '', order: ''}" v-loading="loading">
                            <el-table-column
                              prop="" width="50"
                              label="#">
                              <template scope="scope">
                                <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column
                              prop="endDate"
                              :formatter="fmtLength"
                              label="扫描时间"
                              width="180">
                            </el-table-column>

                            <el-table-column
                              prop="scanner"
                              :formatter="fmtLength"
                              label="操作账号"
                              width="120">
                            </el-table-column>

                            <el-table-column
                              prop="scanStatus"
                              label="扫描结果" :formatter="ifendcase"
                              width="120">
                            </el-table-column>

                            <el-table-column
                              prop="num"
                              :formatter="fmtLength"
                              label="发现资产">
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
                </el-tab-pane>
                <!--端口扫描-->
                <el-tab-pane label="端口扫描" name="second">
                  <div class="a-con">
                    <el-row>
                      <el-col :span="24">
                        <div class="fl">
                          <el-date-picker
                            v-model="date2"
                            type="daterange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerptions0">
                          </el-date-picker>
                        </div>
                        <div class="fl" style="margin-left:30px;margin-top:-2px;">
                          <el-form :inline="true" ref="portForm" :model="portForm">
                            <el-form-item>
                              <el-input placeholder="请输入主机名/IP" v-model="portForm.ip"></el-input>
                            </el-form-item>
                            <el-form-item>
                              <el-button type="primary" icon="el-icon-search" @click="portFormSearch">查询</el-button>
                            </el-form-item>
                          </el-form>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <div class="container_table">
                          <el-table
                            :data="tableData2"
                            style="width: 100%" :height="tableHeight2"
                            :default-sort = "{prop: '', order: ''}">
                            <el-table-column
                              prop="" width="50"
                              label="#">
                              <template scope="scope">
                                <span>{{ pagesize2 * (currentPage2 - 1)  + 1 + scope.$index  }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column
                              prop="endDate"
                              :formatter="fmtLength"
                              label="扫描时间"
                              width="180">
                            </el-table-column>

                            <el-table-column
                              prop="scanner"
                              :formatter="fmtLength"
                              label="操作账号"
                              width="120">
                            </el-table-column>

                            <el-table-column
                              prop="assetsName"
                              :formatter="fmtLength"
                              label="目标资产"
                              width="120">
                            </el-table-column>

                            <el-table-column
                              prop="ip"
                              label="目标IP"
                              :formatter="fmtLength"
                              width="120">
                            </el-table-column>

                            <el-table-column
                              prop="scanStatus"
                              label="扫描结果" :formatter="ifendcase"
                              width="120">
                            </el-table-column>

                            <el-table-column
                              prop="num"
                              :formatter="fmtLength"
                              label="发现端口">
                            </el-table-column>


                          </el-table>

                          <el-pagination class="fy"
                                         layout="prev, pager, next,total"
                                         :current-page.sync = "currentPage2"
                                         @current-change="current_change2"
                                         :total="total2"
                                         :page-size="pagesize2"
                                         background
                          >
                          </el-pagination>
                        </div>
                      </el-col>
                    </el-row>

                  </div>
                </el-tab-pane>
                <!--漏洞扫描-->
                <!-- <el-tab-pane label="漏洞扫描" name="third">
                              <div class="a-con">
                                                          <el-row>
                                                              <el-col :span="24">
                                                                  <div class="fl">
                                                                    <el-date-picker
                                                                    v-model="date3"
                                                                    type="daterange"
                                                                    start-placeholder="开始日期"
                                                                    end-placeholder="结束日期"
                                                                    value-format="yyyy-MM-dd"
                                                                    :picker-options="pickerptions0">
                                                                    </el-date-picker>
                                                               </div>
                                                               <div class="fl" style="margin-left:30px;margin-top:-2px;">
                                                                   <el-form :inline="true" ref="holeForm" :model="holeForm">
                                                                      <el-form-item>
                                                                        <el-input placeholder="请输入主机名/IP" v-model="holeForm.ip"></el-input>
                                                                      </el-form-item>
                                                                      <el-form-item>
                                                                        <el-button type="primary" icon="el-icon-search" @click="holeFormSearch">查询</el-button>
                                                                      </el-form-item>
                                                                  </el-form>
                                                              </div>
                                                              </el-col>
                                                          </el-row>
                                                          <el-row>
                                                              <el-col :span="24">
                                                                  <div class="container_table">
                                                                        <el-table
                                                                          :data="tableData3"
                                                                          style="width: 100%" :height="tableHeight3"
                                                                          :default-sort = "{prop: '', order: ''}">
                                                                          <el-table-column
                                                                            prop="" width="50"
                                                                            label="#">
                                                                             <template scope="scope">
                                                                              <span>{{ pagesize3 * (currentPage3 - 1)  + 1 + scope.$index  }}</span>
                                                                            </template>
                                                                          </el-table-column>

                                                                          <el-table-column
                                                                            prop="endDate"
                                                                            label="扫描时间"
                                                                            width="180">
                                                                          </el-table-column>

                                                                           <el-table-column
                                                                            prop="scanner"
                                                                            label="操作账号"
                                                                            width="120">
                                                                          </el-table-column>

                                                                          <el-table-column
                                                                            prop="assetsName"
                                                                            label="目标资产"
                                                                            width="120">
                                                                          </el-table-column>

                                                                          <el-table-column
                                                                            prop="ip"
                                                                            label="目标IP"
                                                                            width="120">
                                                                          </el-table-column>

                                                                          <el-table-column
                                                                            prop="scanStatus"
                                                                            label="扫描结果" :formatter="ifendcase"
                                                                            width="120">
                                                                          </el-table-column>

                                                                          <el-table-column
                                                                            prop="num"
                                                                            label="发现漏洞">
                                                                          </el-table-column>


                                                                      </el-table>

                                                                        <el-pagination class="fy"
                                                                                       layout="prev, pager, next,total"
                                                                                       :current-page.sync = "currentPage3"
                                                                                       @current-change="current_change3"
                                                                                       :total="total3"
                                                                                       :page-size="pagesize3"
                                                                                       background
                                                                         >
                                                                         </el-pagination>
                                                                      </div>
                                                              </el-col>
                                                          </el-row>

                                                      </div>
                          </el-tab-pane> -->
              </el-tabs>
            </el-col>
          </el-row>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
  import { scanRecord } from '../../api/asset/asset.js'

  export default {

    data() {
      return {
        activeName: 'first',
        //资产发现
        loading: true,
        date: '',
        assetForm: {
          ip: ''
        },
        tableHeight: 100,
        currentPage: 1,
        total: 0,
        pagesize: 15,
        tableData: [],
        //端口扫描
        tableHeight2: 100,
        date2: '',
        portForm: {
          ip: ''
        },

        currentPage2: 1,
        total2: 0,
        pagesize2: 15,
        tableData2: [],
        //漏洞扫描
        /*tableHeight3: 100,
            date3: '',
            holeForm: {
                ip: ''
            },
            currentPage3: 1,
            total3: 0,
            pagesize3: 15,
            tableData3: [],*/
        pickerptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        }
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
      current_change(currentPage) {
        this.currentPage = currentPage;
        this.assetFormQuery();
      },
      current_change2(currentPage) {
        this.currentPage2 = currentPage;
        this.portFormQuery();
      },
      /*current_change3(currentPage) {
          this.currentPage3 = currentPage;
          this.holeFormQuery();
        },*/
      handleClick(tab, event) {

      },
      scanStatusQuery(status) {
        var result = '';
        status = status.toString();
        switch(status) {
          case '0' :
            result = '队列中';
            break;
          case '1' :
            result = '扫描中';
            break;
          case '2' :
            result = '成功';
            break;
          case '3' :
            result = '失败';
            break;
        }
        return result;
      },
      ifendcase(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          return this.scanStatusQuery(arr)
        }
      },
      assetFormSearch() {
        this.currentPage = 1;
        this.assetFormQuery();
      },
      portFormSearch() {
        this.currentPage2 = 1;
        this.portFormQuery();
      },
      /*holeFormSearch() {
                this.currentPage3 = 1;
                this.holeFormQuery();
            },*/
      assetFormQuery() {
        var that = this;
        var ds = '', dn = '';
        if (this.date != '' && this.date != null) {
          ds = this.date[0];
          dn = this.date[1];
        }
        var param = {
          'pageSize': this.pagesize,
          'pageNo': this.currentPage,
          'type': 1,
          'started': ds,
          'ended': dn,
          'ip': ''
          //'ip': this.assetForm.ip
        }
        scanRecord(param).then(res => {

          that.loading = false;
          that.tableData = [];
          that.total = 0;
          that.tableData = res.result.results;
          that.total = res.result.totalCount;
          if (that.tableData.length >= 1) {
            that.tableHeight = (`${document.documentElement.clientHeight}`-260)+'px'
          }
        })
      },
      portFormQuery() {
        var that = this;
        var ds = '', dn = '';
        if (this.date2 != '' && this.date2 != null) {
          ds = this.date2[0];
          dn = this.date2[1];
        }
        var param = {
          'pageSize': this.pagesize2,
          'pageNo': this.currentPage2,
          'type': 2,
          'started': ds,
          'ended': dn,
          'ip': this.portForm.ip
        }
        scanRecord(param).then(res => {
          that.tableData2 = res.result.results;
          that.total2 = res.result.totalCount;
          if (that.tableData2.length >= 1) {
            that.tableHeight2 = (`${document.documentElement.clientHeight}`-260)+'px'
          }
        })
      },
      /*holeFormQuery() {
                var that = this;
                var ds = '', dn = '';
                if (this.date3 != '' && this.date3 != null) {
                    ds = this.date3[0];
                    dn = this.date3[1];
                }
                var param = {
                    'pageSize': this.pagesize3,
                      'pageNo': this.currentPage3,
                    'type': 3,
                    'started': ds,
                    'ended': dn,
                    'ip': this.holeForm.ip
                }
                scanRecord(param).then(res => {
                    that.tableData3 = res.result.results;
                    that.total3 = res.result.totalCount;
                    if (that.tableData3.length >= 1) {
                        that.tableHeight3 = (`${document.documentElement.clientHeight}`-260)+'px'
                     }
                })
            }*/
    },
    mounted() {
      this.assetFormQuery();

      this.portFormQuery();

      //this.holeFormQuery();
    }
  }
</script>
<style>

</style>
