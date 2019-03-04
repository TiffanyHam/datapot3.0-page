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
            v-loading="loading"
            :data="tableList"
            style="width: 100%"
            :height="tableHeight"  @filter-change="filterChange">
            <el-table-column width="50" type="index" :index="indexMethod"></el-table-column>

            <el-table-column
              prop="created"
              :formatter="fmtLength"
              label="创建时间">
            </el-table-column>

            <el-table-column
              prop="cron"
              :formatter="fmtLength"
              label="执行时间">
            </el-table-column>

            <el-table-column
              prop="beat"
              :formatter="beatFormat"
              :filter-multiple="isActive"
              :filters="beatFilter"
              filter-placement="bottom-end"
              column-key="beat"
              label="重复频率">
            </el-table-column>
            <!-- :filter-method="filterActive" -->

            <el-table-column
              prop="active"
              :formatter="activeFormat"
              :filter-multiple="isActive"
              :filters="activeFilter"
              filter-placement="bottom-end"
              column-key="active"
              label="状态">
            </el-table-column>
            <!-- :filter-method="filterActive" -->

            <el-table-column
              prop="uptime"
              :formatter="fmtLength"
              label="更新时间">
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" class="btns" v-if="scope.row.active == 1 || scope.row.active == 2 "  @click='up(scope.$index, scope.row)'>启用</el-button>
                <el-button v-else type="text" class="btns" @click='end(scope.$index, scope.row)'>结束</el-button>
                <el-button type="text" class="btns" @click='details(scope.$index, scope.row)'>详情</el-button>
              </template>

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

      <!--详情-->
      <el-dialog title="任务详情" :visible.sync="dispotFormVisible" width="450px">
        <el-form :model="detailForm"  ref="detailForm">
          <el-form-item label="创建时间" prop="created">
            <span v-model="detailForm.created">{{detailForm.created}}</span>
          </el-form-item>
          <el-form-item label="执行时间" prop="time">
            <span>{{detailForm.time}}</span>
          </el-form-item>
          <el-form-item label="重复频率" prop="beat">
            <span>{{detailForm.beat}}</span>
          </el-form-item>
          <el-form-item label="任务状态" prop="active">
            <span>{{detailForm.active}}</span>
          </el-form-item>
          <el-form-item label="更新时间" prop="time">
            <span>{{detailForm.uptime}}</span>
          </el-form-item>
          <el-form-item label="目标主机">
            <div v-show="detailForm.ips != '' " style="width:70%;padding:2%;margin-left:18%;padding:2%;overflow:auto;border:1px solid #ccc;">
              <p v-for="i in detailForm.ips" style="line-height: 23px;clear: both;">
                <span class="fl">{{i}}</span>
                <a href="javascript:;" class="fr" @click="deleIp(i)" style="color: #409EFF;">移除</a>
              </p>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer"  style="text-align: center">
          <el-button type="primary" @click=" dispotFormVisible = false ">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import  axios from 'axios'
  import {taskSearch,taskDetail,deteTmip,scanHoleSettime,scanPortSettime,scanHoleSettimeEnd,scanPortSettimeEnd} from '../../api/securityHole/holeTask.js'
  import { destroyCache, filterItems } from '../../utils/deleCache.js'

  export default {
    data(){
      return{
        loading: true,//加载
        isActive: false,
        activeFilter: [{
          value: 0,
          text: '正常'
        },{
          value: 1,
          text: '结束'
        }],
        beatFilter: [{
          value: 0,
          text: '不重复'
        },{
          value: 1,
          text: '每天一次'
        },{
          value: 7,
          text: '每周一次'
        },{
          value: 30,
          text: '每月一次'
        }],
        date:[],
        tableHeight: document.documentElement.clientHeight - 215,
        total: 0,//默认数据总数
        pagesize:15,//每页的数据条数
        currentPage:1,//默认开始页面
        paraForm:{
          ip:''
        },
        //详情
        detail: '',
        dispotFormVisible: false,
        detailForm: {
          created: '',
          cron: '',
          beat: '',
          active: '',
          time: '',
          ips: ''
        },
        RID: '',
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
        filterName: {}
      }
    },
    methods:{
      fmtLength(row, column){
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined ){
          return '—'
        } else {
          return arr
        }
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getHoleTask()
      },
      //列表序号
      indexMethod (index) {
        return (((this.currentPage-1)*this.pagesize)+(index+1));
      },
      //查询
      getSearch(){
        this.loading = true;
        this.currentPage = 1
        this.getHoleTask()
      },
      //列表
      getHoleTask() {
        let that = this;
        let ds = '', dn = '';
        if (this.date != '' && this.date != null) {
          ds = this.date[0];
          dn = this.date[1];
        }
        var param = {
          'pageSize': this.pagesize,
          'pageNo': this.currentPage,
          'ip': this.paraForm.ip,
          'started': ds,
          'ended': dn,
          'type':2,
        }
        //param = Object.assign(this.filterName, param);
        for(var i in this.filterName) {
          param[''+i] = this.filterName[i];
        }
        taskSearch(param).then(res => {
          that.loading = false;
          let data = res.result.results;
          that.total = res.result.totalCount;
          data == null ? that.tableList = [] : that.tableList = data;
        })
      },
      //详情
      details(index, row) {
        var that = this;
        this.RID = row.id || this.RID;
        var param = {
          'sid': this.RID
        }
        taskDetail(param).then(res => {
          that.detailForm = res.result;
          switch(that.detailForm.beat) {
            case 0:
              that.detailForm.beat = '不重复';
              break;
            case 1:
              that.detailForm.beat = '每天一次';
              break;
            case 7:
              that.detailForm.beat = '每周一次';
              break;
            case 30:
              that.detailForm.beat = '每月一次';
              break;
          }
          switch(that.detailForm.active) {
            case 0:
              that.detailForm.active = '正常';
              break;
            case 1:
              that.detailForm.active = '终止';
              break;
            case 2:
              that.detailForm.active = '暂停';
              break;
          }
          that.dispotFormVisible = true;
        })
      },
      //移除
      deleIp(ip) {
        this.$confirm('确定将本资产移除任务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: false
        }).then(() => {
          var that = this;
          var param = {
            'sid': this.RID,
            'ip': ip
          }
          deteTmip(param).then(res => {
            this.$message({
              type: 'success',
              message: "移除成功!"
            })
            that.dispotFormVisible = false;
          })
        })
      },
      //启动
      up(index, row) {
        this.$confirm('确定启动该任务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: false
        }).then(() => {

          var that = this;
          //启动漏扫
          var param = {
            'sid':row.id
          }
          scanHoleSettime(param).then(res => {

            this.$message({
              type: 'success',
              message: '启动成功'
            })
            this.currentPage = 1;
            that.getHoleTask();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '启动失败'
          })
        })
      },
      //结束
      end(index, row) {
        this.$confirm('确定结束该任务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: false
        }).then(() => {
          var that = this;
          var param = {
            'id': row.id
          }
          //结束漏扫
          scanHoleSettimeEnd(param).then(res => {
            this.$message({
              type: 'success',
              message: '已经终止'
            })
            this.currentPage = 1;
            that.getHoleTask();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '结束失败'
          })
        })
      },
      //重复频率
      beatFormat(row, column) {
        //0不重复， 1每天一次 7每周一次  30每月一次
        var result = '';
        var d = (row[column['property']]).toString();
        if(d === null || d === '' || d === undefined ){
          return '—'
        } else {
          switch(d) {
            case '0':
              result = '不重复';
              break;
            case '1':
              result = '每天一次';
              break;
            case '7':
              result = '每周一次';
              break;
            case '30':
              result = '每月一次';
              break;
          }
          return result;
        }

      },
      //状态转中文
      activeFormat(row, column) {
        //0正常， 1结束 2暂停
        var result = '';
        var d = (row[column['property']]).toString();
        if (d == '0') {
           result = '正常';
         } else {
           result = '结束';
         }
        /*switch(d) {
          case '0':
            result = '正常';
            break;
          case '1':
            result = '终止';
            break;
          case '2':
            result = '暂停';
            break;
        }*/
        return result;
      },
      //状态查询
      /*filterActive(value, row, column) {
        //value = Number(value);
        const property = column['property'];
        return row[property] === value;
      },*/
      filterChange(filters) {
         this.filterName = filterItems(filters, this.filterName);
         this.getHoleTask();
      },
    },
    mounted(){
      this.getHoleTask()
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

