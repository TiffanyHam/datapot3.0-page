<template>
  <div class="title">
    <div class="filter-container">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="paraForm" ref="paraForm">
          <el-form-item label="采集时间">
            <el-date-picker
              v-model="date"
              type="daterange"
              style="width:250px;"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions0"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input v-model="paraForm.srcIp" placeholder="请输入访问ip" style="width:180px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input  v-model="paraForm.dstIp" placeholder="请输入被访问ip" style="width:180px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getSearch">查询</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" icon="el-icon-download" @click="exportExcel">导出</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-container>
        <el-main>
          <el-table
            v-loading="loading"
            :data="tableList"
            style="width: 100%" :height="tableHeight" @filter-change="filterChange">
            <el-table-column width="70" type="index" :index="indexMethod"></el-table-column>

            <el-table-column
              prop="collectTime"
              :formatter="fmtLength"
              label="数据采集时间"
              width="180">
              <template slot-scope="scope">
                <el-button type="text"  style="color: #4a88a5;padding: 0"  @click='getDetails(scope.$index, scope.row)'>{{ scope.row.collectTime }}</el-button>
              </template>
            </el-table-column>

            <el-table-column
              prop="classtypeId"
              label="威胁类型"
              width="150"
              :filter-multiple="isFalse"
              :filters="classIdFilter"
              :formatter="ifendcase"
              column-key="classtypeId"
            >
            </el-table-column>
            <!-- :filter-method="filterTag" -->

            <el-table-column
              prop="protocol"
              label="协议"
              :filter-multiple="isFalse"
              :filters="protocolFilter"
              column-key="protocol"
              :formatter="proCase"
              width="70">
            </el-table-column>
            <!-- :filter-method="filterTag" -->

            <el-table-column
              prop="srcIp"
              :formatter="fmtLength"
              label="访问IP/端口"
              width="150">
            </el-table-column>
            <el-table-column
              prop="dstIp"
              :formatter="fmtLength"
              label="被访问IP/端口"
              width="150">
            </el-table-column>
            <el-table-column
              prop="dstCity"
              :formatter="fmtLength"
              label="目标城市"
              width="120">
            </el-table-column>
            <el-table-column
              prop="msg"
              :formatter="fmtLength"
              show-overflow-tooltip
              label="消息">
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

      <!--详情弹窗-->
      <el-dialog title="威胁数据详情" :visible.sync="dialogFormVisible" class="snort" :class="{'disableClass': isA}">
        <el-form :label-position="labelPosition" :model="form" ref="form" label-width="100px" class="demo-form" style="margin: 0 auto;" :disabled="disabled">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="数据采集时间:" prop="collectTime">
                <el-input v-model="form.collectTime"></el-input>
              </el-form-item>
              <el-form-item label="版本号:" prop="sigRev">
                <el-input v-model="form.sigRev"></el-input>
              </el-form-item>
              <el-form-item label="SigGenerator:" prop="sigGenerator">
                <el-input v-model="form.sigGenerator"></el-input>
              </el-form-item>
              <el-form-item label="SigId:" prop="sigId">
                <el-input v-model="form.sigId"></el-input>
              </el-form-item>
              <el-form-item label="目标网卡:" prop="ethDst">
                <el-input v-model="form.ethDst"></el-input>
              </el-form-item>
              <el-form-item label="网卡长度:" prop="ethLen">
                <el-input v-model="form.ethLen"></el-input>
              </el-form-item>
              <el-form-item label="TcpFlags:" prop="tcpFlags">
                <el-input v-model="form.tcpFlags"></el-input>
              </el-form-item>
              <el-form-item label="TcpSeq:" prop="tcpSeq">
                <el-input v-model="form.tcpSeq"></el-input>
              </el-form-item>
              <el-form-item label="TcpPack:" prop="tcpPack">
                <el-input v-model="form.tcpPack"></el-input>
              </el-form-item>
              <el-form-item label="IcmpSeq:" prop="icmpSeq">
                <el-input v-model="form.icmpSeq"></el-input>
              </el-form-item>
              <el-form-item label="EsTime:" prop="esTime">
                <el-input v-model="form.esTime"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="警告类型:" prop="classtypeId">
                <el-input v-model="form.classtypeId"></el-input>
              </el-form-item>
              <el-form-item label="协议:" prop="protocol">
                <el-input v-model="form.protocol"></el-input>
              </el-form-item>
              <el-form-item label="源IP:" prop="srcIp">
                <el-input v-model="form.srcIp"></el-input>
              </el-form-item>
              <el-form-item label="源端口:" prop="srcPort">
                <el-input v-model="form.srcPort"></el-input>
              </el-form-item>
              <el-form-item label="TcpLen:" prop="tcpLen">
                <el-input v-model="form.tcpLen"></el-input>
              </el-form-item>
              <el-form-item label="TcpWindow:" prop="tcpWindow">
                <el-input v-model="form.tcpWindow"></el-input>
              </el-form-item>
              <el-form-item label="Ttl:" prop="ttl">
                <el-input v-model="form.ttl"></el-input>
              </el-form-item>
              <el-form-item label="Tos:" prop="tos">
                <el-input v-model="form.tos"></el-input>
              </el-form-item>
              <el-form-item label="Id:" prop="id">
                <el-input v-model="form.id"></el-input>
              </el-form-item>
              <el-form-item label="DmgLen:" prop="dmgLen">
                <el-input v-model="form.dmgLen"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="目标端口:" prop="dstPort">
                <el-input v-model="form.dstPort"></el-input>
              </el-form-item>
              <el-form-item label="目标IP:" prop="dstIp">
                <el-input v-model="form.dstIp"></el-input>
              </el-form-item>
             <!-- <el-form-item label="源IP:" prop="srcIp">
                <el-input v-model="form.srcIp"></el-input>
              </el-form-item>-->
              <el-form-item label="目标IP地理坐标:" prop="dstGeoLocation">
                <el-input v-model="form.dstGeoLocation"></el-input>
              </el-form-item>
              <el-form-item label="目标IP所属国家:" prop="dstCountry">
                <el-input v-model="form.dstCountry"></el-input>
              </el-form-item>
              <el-form-item label="目标IP所属城市:" prop="dstCity">
                <el-input v-model="form.dstCity"></el-input>
              </el-form-item>
              <el-form-item label="源网卡:" prop="ethSrc">
                <el-input v-model="form.ethSrc"></el-input>
              </el-form-item>
              <el-form-item label="IpLen:" prop="ipLen">
                <el-input v-model="form.ipLen"></el-input>
              </el-form-item>
              <el-form-item label="IcmpType:" prop="icmpType">
                <el-input v-model="form.icmpType"></el-input>
              </el-form-item>
              <el-form-item label="IcmpCode:" prop="icmpCode">
                <el-input v-model="form.icmpCode"></el-input>
              </el-form-item>
              <el-form-item label="IcmpId:" prop="icmpId">
                <el-input v-model="form.icmpId"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="消息:" prop="msg">
            <el-input v-model="form.msg"></el-input>
          </el-form-item>
          <el-form-item label="数据加密串:" prop="originalStr">
            <el-input v-model="form.originalStr"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button  type="primary" @click.native="dialogFormVisible=false">确定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import { getSnortAlertPage , getClassTypeAll , getDetailsAll, getDown} from '../../api/manage/snort_alert.js'
  import {dateFormatter} from '../../utils/time.js'
  import { domain } from '../../request.js'
  import { destroyCache, filterItems } from '../../utils/deleCache.js'

  export default {
    data() {
      return {
        tableHeight: document.documentElement.clientHeight - 215,
        total: 0,//默认数据总数
        pagesize:15,//每页的数据条数
        currentPage:1,//默认开始页面
        istag: true,
        isA: false,
        disabled:false,
        isFalse: false,
        classIdFilter: [],
        protocolFilter:[],
        protocolOps:[],
        classIdOps:[],
        input:"",
        labelPosition: 'left',
        dialogFormVisible: false,
        disabled:false,
        loading: true,//加载
        form: {
          collectTime:'',sigRev:'',sigGenerator:'',sigId:'',ethDst:'',ethLen:'',
          tcpFlags:'',tcpSeq:'',tcpPack:'',icmpSeq:'',esTime:'',classtypeId:'',
          protocol:'',srcIp:'',srcPort:'',tcpLen:'',tcpWindow:'',ttl:'',
          tos:'',id:'',dmgLen:'',dstPort:'',dstIp:'',srcIp:'',dstGeoLocation:'',
          dstCountry:'',dstCity:'',ethSrc:'',ipLen:'',icmpType:'',icmpCode:'',
          icmpId:'',msg:'',originalStr:''
        },
       /* collectTimeBegin: dateFormatter(new Date(), false),//日期格式化
        collectTimeEnd: dateFormatter(new Date(), false),*/
        paraForm: {
          srcIp: '',
          dstIp:''
        },
        date:[],
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
      getRoot() {
          var hostname = location.hostname;
          var pathname = location.pathname;
          //var contextPath = pathname.split("/")[1];
          var port = location.port;
          var protocol = location.protocol;
          return protocol + "//" + hostname + ":" + port;
      },
      //导出
      exportExcel() {
        this.$confirm('确认导出吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: false
        }).then(() => {
          var ds = '', dn = '';
          if (this.date != '' && this.date != null) {
            ds = this.date[0];
            dn = this.date[1];
          }
          var collectTimeBegin = ds
          var collectTimeEnd = dn
          var classtypeId = '';
          var protocol = '';
          var srcIp = this.paraForm.srcIp;
          var dstIp = this.paraForm.dstIp;

          //var u = this.getRoot();
          /*var newUrl = "/om/snort_alert/export?collectTimeBegin="+collectTimeBegin+"&&collectTimeEnd="+collectTimeEnd+"&&classtypeId="+classtypeId+"&&protocol="+protocol+"&&srcIp="+srcIp+"&&dstIp="+dstIp;
           getDown(newUrl).then(res => {
           })*/
          //
          var BASE_URL = domain.baseUrl; //全局接口地址
          var url = BASE_URL+"/om/snort_alert/export?collectTimeBegin="+collectTimeBegin+"&&collectTimeEnd="+collectTimeEnd+"&&classtypeId="+classtypeId+"&&protocol="+protocol+"&&srcIp="+srcIp+"&&dstIp="+dstIp;
          window.location = url;

          /*this.$message({
            type: 'success',
            message:'导出成功！'
          });*/
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消导出'
          });
        });
      },
      //查询
      getSearch(){
        this.loading = true;
        this.currentPage = 1
        this.getSnortList()
      },
      //列表
      getSnortList() {
        let that = this;
        var ds = '', dn = '';
        if (that.date != '' && that.date != null) {
          ds = that.date[0];
          dn = that.date[1];
        }
        let para = {
          'srcIp':this.paraForm.srcIp,
          'dstIp':this.paraForm.dstIp,
          'collectTimeBegin': ds,
          'collectTimeEnd': dn,
          'numPerPage':this.pagesize,
          'pageNum': this.currentPage
        }
        //para = Object.assign(this.filterName, para);
        for(var i in this.filterName) {
          para[''+i] = this.filterName[i];
        }
        getSnortAlertPage(para).then(res => {
          this.loading = false;
          let data = res.result.results;
          that.total = res.result.totalCount;
          data == null ? this.tableList = [] : this.tableList = data;
          //var vnode = this.$vnode;
          //destroyCache(vnode);
        })
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getSnortList()
      },
      //列表序号
      indexMethod (index) {
        return (((this.currentPage-1)*this.pagesize)+(index+1));
      },
      //显示详情界面
      getDetails(index, row){
        let that = this;
        const param = { alertId: row.alertId };
        getDetailsAll(param).then(res => {
          this.dialogFormVisible = true //显示对话框
          this.isA = true
          this.disabled = true
          that.form = Object.assign({}, res.result)
        });
      },
      //威胁类型
      getClassIds(){
        let that = this;//将当前的this对象复制一份到that变量中
        getClassTypeAll('').then(res => {
          let deteType =  res.result;
          let classtypeArr = res.result.detectionType;
          let temp = [], tempf = [];
          for (var i in classtypeArr) {
            var d = {
              value: i,
              label: classtypeArr[i]
            }
            var f = {
              value: i,
              text: classtypeArr[i]
            }
            temp.push(d);
            tempf.push(f);
          }
          that.classIdOps = temp;
          that.classIdFilter = tempf;

          let protocolArr = res.result.protocol;
          let prom = [],promt = []
          for(let x in protocolArr){
            let a = {
              value:x,
              label:protocolArr[x]
            }
            let b = {
              value:x,
              text:protocolArr[x]
            }
            prom.push(a)
            promt.push(b)
          }
          that.protocolOps = prom
          that.protocolFilter = promt

        });
      },
      //通过id获取name
      getNamebyId(val) {
        var result = "";
        for (var i = 0; i < this.classIdOps.length; i++) {
          if (val == this.classIdOps[i].value) {
            result = this.classIdOps[i].label;
          }
        }
        return result;
      },
      getNamePro(val) {
        var result = "";
        for (var i = 0; i < this.protocolOps.length; i++) {
          if (val == this.protocolOps[i].value) {
            result = this.protocolOps[i].label;
          }
        }
        return result;
      },
      proCase(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          return this.getNamePro(arr)
        }
      },
      //数字转中文
      ifendcase(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          return this.getNamebyId(arr)
        }

      },
      /*//下拉筛选事件
      filterTag(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },*/
      //筛选事件
      filterChange(filters) {
         this.filterName = filterItems(filters, this.filterName);
         this.getSnortList();
      },
      //默认今天
      dateReset(){
        var now = new Date();
        var startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10);
        var endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10);
        this.date.push(startDate)
        this.date.push(endDate)
      }

    },

    mounted() {
      this.dateReset()
      this.getSnortList()
      this.getClassIds()

    }
  };
</script>
<style>
  .el-range-editor.el-input__inner {
    padding: 0px;
  }
  .el-date-editor .el-range__icon {
    margin-left: 0px;
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
  .el-table-filter{
    overflow-y: auto;
    max-height: 500px;
  }
</style>

