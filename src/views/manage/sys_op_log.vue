<template>
  <div class="title">
    <div class="filter-container">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="paraForm" ref="paraForm">
          <el-form-item>
            <el-form-item label="采集时间">
              <el-date-picker
                v-model="date"
                type="daterange"
                style="width:250px;"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-select v-model="paraForm.logType" style="width:150px;">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="paraForm.userName" placeholder="请输入用户名" style="width:180px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-container>
        <el-main>

        <div v-show="slogType == 'active'">
          <el-table
            v-loading="loading"
            :data="tableList"
            style="width: 100%" :height="tableHeight">
            <el-table-column width="50" type="index" :index="indexMethod"></el-table-column>

            <el-table-column
              prop="userName"
              :formatter="fmtLength"
              label="用户名"
              width="100">
              <template slot-scope="scope">
                <el-button type="text"  style="color: #4a88a5;padding: 0" >{{ scope.row.userName }}</el-button>
              </template>
            </el-table-column>

            <el-table-column
              prop="logDate"
              :formatter="formatDate"
              label="操作时间"
              width="150">
            </el-table-column>

            <el-table-column
              prop="logIp"
              :formatter="fmtLength"
              label="操作IP"
              width="150">
            </el-table-column>
            <el-table-column
              prop="procedureCode"
              :formatter="fmtLength"
              label="操作方法"
              width="150">
            </el-table-column>
            <el-table-column
              prop="proExecuteTime"
              :formatter="fmtLength"
              label="程序执行时间"
              width="70">
            </el-table-column>
            <el-table-column
              prop="dbExecuteTime"
              :formatter="fmtLength"
              label="DB执行时间"
              width="70">
            </el-table-column>
            <el-table-column
              prop="resultCode"
              :formatter="fmtLength"
              label="处理结果"
              show-overflow-tooltip
              width="150">
            </el-table-column>
            <el-table-column
              prop="parameter"
              :formatter="fmtLength"
              show-overflow-tooltip
              label="操作参数">
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

      </div>
     <div v-show="slogType == 'login'">
            <el-table
            v-loading="loginLoading"
            :data="loginTbl"
            style="width: 100%" :height="tableHeight">
            <el-table-column
              prop=""
              label="#">
               <template scope="scope">
                <span>{{ size * (curpage - 1)  + 1 + scope.$index  }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="userName"
              :formatter="fmtLength"
              label="用户名">
            </el-table-column>

            <el-table-column
              prop="logDate"
              label="登录/登出时间"
              :formatter="dateformat">
            </el-table-column>

            <el-table-column
              prop="logType"
              label="登录/登出类型"
              :formatter="logDateformat">
            </el-table-column>

            <el-table-column
              prop="logIp"
              :formatter="fmtLength"
              label="操作IP">
            </el-table-column>

            <el-table-column
              prop="isSuccess"
              label="是否成功"
              :formatter="isSuccessformat">
            </el-table-column>

            <el-table-column
              prop="resultMsg"
              :formatter="fmtLength"
              label="操作信息">
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="currentChange"
            :current-page="curpage"
            :page-size="size"
            background
            layout="prev, pager, next, total"
            :total="logintotal">
          </el-pagination>
      </div>

        </el-main>
      </el-container>

    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import moment from 'moment'
  import { getSyslogPage,getSysloginPage} from '../../api/manage/sys_op_log.js'
  import {dateFormatter} from '../../utils/time.js'

  export default {
    data() {
      return {
        tableHeight: document.documentElement.clientHeight - 215,
        total: 0,//默认数据总数
        logintotal: 0,
        pagesize:15,//每页的数据条数
        size:15,
        currentPage:1,//默认开始页面
        curpage:1,
        istag: true,
        logOps:[],
        logFilter:[],
        input:"",
        date:[],
        department:'',
        labelPosition: 'left',
        dialogFormVisible: false,
        disabled:false,
        loading: true,//加载
        loginLoading:true,
        paraForm: {
          userName: '',
          logType:'1'
        },
        typeList: [{
          value:'1',
          label:'操作日志'
        }, {
          value:'2',
          label:'登录日志'
        }],
        tableList: [],
        loginTbl: [],
        slogType: 'active', // 操作日志:active or 登录日志:login
      };
    } ,

    methods: {
      fmtLength(row, column){
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          return arr
        }
      },
      //查询
      getSearch() {
        var status = this.paraForm.logType;
        if (status == '1') {
          this.loading = true;
          this.slogType = 'active';
          this.currentPage = 1
          this.getSyslogList()
        } else if (status == '2') {
          this.loginLoading = true;
          this.slogType = 'login';
          this.curpage = 1
          this.getLoginList()
        }
      },

      //列表
     /*操作日志*/
      getSyslogList(){
        let that = this;
        var ds = '', dn = '';
        if (that.date != '' && that.date != null) {
          ds = that.date[0];
          dn = that.date[1];
        }
        let para = {
          'userName':this.paraForm.userName,
          'logType':this.paraForm.logType,
          'beginLogDate': ds,
          'endLogDate': dn,
          'pageNum': this.currentPage,
          'numPerPage':this.pagesize
        }
          getSyslogPage(para).then(res => {
            this.loading = false;
            var data = res.result.results;
            that.total = res.result.totalCount;
            //that.pagesize = res.result.numPerPage
            //that.currentPage = res.result.pageNum
            data == null ? this.tableList = [] : this.tableList = data;
          })
      },
      /*登录日志*/
      getLoginList() {
        let that = this;
        var ds = '', dn = '';
        if (that.date != '' && that.date != null) {
          ds = that.date[0];
          dn = that.date[1];
        }
        let para = {
          'userName':this.paraForm.userName,
          'logType':this.paraForm.logType,
          'beginLogDate': ds,
          'endLogDate': dn,
          'pageNum': this.curpage,
          'numPerPage':this.size
        }
        getSysloginPage(para).then(res => {
          this.loginLoading = false;
          var data = res.result.results;
          that.logintotal = res.result.totalCount;
          //that.size = res.result.numPerPage
          //that.curpage = res.result.pageNum
          data == null ? that.loginTbl = [] : that.loginTbl = data;
        })
      },
      //时间戳转时间
      timestampToTime(datetimes) {
        var date = new Date(datetimes),
        Y = date.getFullYear() + '-',
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
        D = date.getDate() + ' ',
        h = date.getHours() + ':',
        m = date.getMinutes();
        //s = date.getSeconds();

        M < 10 ? M='0'+M : M=M;
        D < 10 ? D='0'+D : D=D;
        h < 10 ? h='0'+h : h=h;
        m < 10 ? m='0'+m : m=m;

        //年 月 日 时 分
        return Y+M+D+h+m;
      },
      //登入登出时间时间戳转时间
      dateformat(row, column) {
        var data = row[column['property']];
        if(data === null || data === '' || data === undefined){
          return '—'
        } else {
          data = this.timestampToTime(data);
          return data;
        }

      },
      //登录登出类型转中文
      logDateformat(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          if (arr == 1) {
            return '登录'
          } else if (arr == 2) {
            return '登出'
          }
        }
      },
      //是否成功转中文
      isSuccessformat(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          if (arr == 1) {
            return '是'
          } else if (arr == 0) {
            return '否'
          } else if (arr == 2) {
            return '未知'
          }
        }

      },
      //分页
      //active 操作日志分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getSyslogList()
      },
      //login 分页
      currentChange(val) {
        this.curpage = val;
        this.getLoginList()
      },
      //列表序号
      indexMethod (index) {
        return (((this.currentPage-1)*this.pagesize)+(index+1));
      },
      //时间格式化
      formatDate:function(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr == undefined){
          return '—'
        } else {
          return moment(arr).format("YYYY-MM-DD HH:mm:ss");
        }
      },
      //下拉筛选事件
      filterTag(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      dateReset(){
        var now = new Date();
        var startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10);
        var endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10);
        this.date.push(startDate)
        this.date.push(endDate)
      },
    },

    //默认今天
    mounted() {
      this.dateReset();
      this.getSyslogList();
    }
  };
</script>
<style>
  .el-range-editor.el-input__inner {
    padding: 0px;
  }
  .el-date-editor .el-range__icon {
    margin-left: 0px;
    color: #409EFF;
    line-height: 29px;
  }
  .snort .el-dialog {
    width: 80%;
  }
  .snort .el-dialog .el-form--label-left .el-form-item__label {
    width: 120px!important;
  }
  .snort .el-dialog .el-form-item__content {
    margin-left: 120px!important;
  }
</style>

