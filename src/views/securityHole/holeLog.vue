<template>
  <div class="title">
    <div class="filter-container">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="paraForm" ref="paraForm">
          <el-form-item>
            <el-date-picker
              v-model="date"
              type="daterange"
              style="width:300px;"
              start-placeholder="请输入起始日期"
              end-placeholder="请输入结束日期"
              :picker-options="pickerOptions0"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input v-model="paraForm.ip" placeholder="请输入主机ip" style="width:180px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-container>
        <el-main>
          <el-table
            :data="tableList"
            v-loading="loading"
            style="width: 100%"
            :height="tableHeight">
            <el-table-column width="50" type="index" :index="indexMethod"></el-table-column>

            <el-table-column
              prop="endDate"
              :formatter="fmtLength"
              label="创建时间">
            </el-table-column>

            <el-table-column
              prop="scanner"
              :formatter="fmtLength"
              label="操作账号">
            </el-table-column>

            <el-table-column
              prop="assetsName"
              :formatter="fmtLength"
              label="目标资产">
            </el-table-column>

            <el-table-column
              prop="ip"
              :formatter="fmtLength"
              label="目标IP">
            </el-table-column>

            <el-table-column
              prop="scanStatus"
              :formatter="ifendcase"
              label="扫描结果">
            </el-table-column>

            <el-table-column
              prop="num"
              :formatter="fmtLength"
              label="发现漏洞">
            </el-table-column>

          </el-table>
          <el-pagination
            @current-change="handleCurrentChange"
            background
            layout="prev, pager, next,total"
            :page-size="pagesize"
            :current-page="currentPage"
            :total="total">
          </el-pagination>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>

  import  axios from 'axios'
  import {scanRecord} from '../../api/securityHole/holeLog.js'
  export default {
    data(){
      return{
        loading: true,//加载
        date:[],
        tableHeight: document.documentElement.clientHeight - 215,
        total: 0,//默认数据总数
        pagesize:15,//每页的数据条数
        currentPage:1,//默认开始页面
        paraForm:{
          ip:''
        },
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
      //扫描结果
      ifendcase(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          return this.scanStatusQuery(arr)
        }
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.holeFormQuery()
      },
      //列表序号
      indexMethod (index) {
        return (((this.currentPage-1)*this.pagesize)+(index+1));
      },
      //查询
      getSearch(){
        this.loading = true;
        this.currentPage = 1
        this.holeFormQuery()
      },
      //列表
      holeFormQuery() {
        let that = this;
        let ds = '', dn = '';
        if (this.date != '' && this.date != null) {
          ds = this.date[0];
          dn = this.date[1];
        }
        var param = {
          'pageSize': this.pagesize,
          'pageNo': this.currentPage,
          'type': 3,
          'started': ds,
          'ended': dn,
          'ip': this.paraForm.ip
        }
        scanRecord(param).then(res => {
          that.loading = false;
          let data = res.result.results;
          that.total = res.result.totalCount;
          data == null ? that.tableList = [] : that.tableList = data;

        })
      }
    },
    mounted(){
      this.holeFormQuery()

    }
  }
</script>
<style>
  .el-range-editor.el-input__inner {
    padding: 0px;
  }
  .el-date-editor .el-range__icon {
    margin-left: 0px;
    line-height: 29px;
  }
</style>

