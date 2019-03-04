<template>
  <div class="title">
    <div class="filter-container">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="paraForm" ref="paraForm">
          <el-form-item>
            <el-input v-model="paraForm.assetsIp" placeholder="请输入关联资产" style="width:180px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-container>
        <el-main>
          <el-table
            @filter-change="filterChange"
            v-loading="loading"
            :data="tableList"
            style="width: 100%" :height="tableHeight">
            <el-table-column width="50" type="index" :index="indexMethod"></el-table-column>
            <el-table-column
              prop="cveNo"
              :formatter="fmtLength"
              label="CVE编号">
              <template slot-scope="scope">
                <el-button type="text"  style="color: #4a88a5;padding: 0" >{{ scope.row.cveNo }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="vulnName"
              :formatter="fmtLength"
              width="250"
              show-overflow-tooltip
              label="漏洞名称">
            </el-table-column>
            <el-table-column
              prop="vulnType"
              :formatter="fmtLength"
              label="漏洞分类">
            </el-table-column>
            <el-table-column
              width="110"
              prop="level"
              :formatter="fmtLength"
              :filters="vulnLevelFliter"
              :filter-multiple="isFalse"
              column-key="level"
              align="center"
              label="风险等级">
              <template slot-scope="scope" align="center">
                <span class="statusSty" :class="scope.row.level | statusFilter">{{scope.row.level | formatStata}}</span>
              </template>
            </el-table-column>
            <!-- :filter-method="filterTag" -->

            <el-table-column
              prop="assetsIp"
              :formatter="fmtLength"
              label="关联资产">
            </el-table-column>
            <!--<el-table-column
              prop="officeName"
              :formatter="OrganizeTransfer"
              :filters="OrganizeFilters"
              :filter-multiple="isFalse"
              :filter-method="filterTag"
              column-key = "officeName"
              label="所属机构">
            </el-table-column>-->
            <el-table-column
              prop="fixStatus"
              width="100"
              :formatter="statusTransfer"
              :filters="fixStatusFliter"
              :filter-multiple="isFalse"
              column-key="fixStatus"
              label="处理状态">
            </el-table-column>
            <!-- :filter-method="filterTag" -->

            <el-table-column
              prop="createDate"
              :formatter="fmtLength"
              label="发现时间">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" class="btns" @click="updateOper(scope.$index, scope.row)">处理</el-button>
                <el-button type="text" class="btns" @click="detailsOper(scope.$index, scope.row)">详情</el-button>
              </template>
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

      <!--修改弹窗-->
      <el-dialog title="漏洞处理" :visible.sync="dialogFormVisible" @close="closeForm">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form :model="updataForm" ref="updataForm" label-width="100px" class="demo-ruleForm" style="margin: 0 auto;">
              <el-form-item label="处理状态：" prop="fixStatus">
                <el-radio-group v-model="updataForm.fixStatus">
                  <el-radio :label="item.value" :key="item.value" :value="item.value" v-for="item in fixStatusOPs">{{item.label}}</el-radio>
                </el-radio-group>

              </el-form-item>
              <el-form-item label="处理说明：" prop="explain">
                <el-input type="textarea" v-model="updataForm.explain"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer"  style="text-align: center">
          <el-button type="info" @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="edit">提交</el-button>
        </div>
      </el-dialog>

      <!--详情弹窗-->
      <el-dialog title="漏洞详情" :visible.sync="dialogFormVisible1" class="detailsHo">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="demo-layout">
              <el-row>
                <el-col :span="5">漏洞名称：</el-col>
                <el-col :span="19">{{dets.vulnName}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="5">CVE编号：</el-col>
                <el-col :span="19">{{dets.cveNo}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="5">CNVD编号：</el-col>
                <el-col :span="19">{{dets.cvndNo}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="5">关联资产：</el-col>
                <el-col :span="19">{{dets.assetsIp}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="5">主机IP：</el-col>
                <el-col :span="19">{{dets.hostType}}</el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="demo-layout">
              <el-row>
                <el-col :span="5">负责人：</el-col>
                <el-col :span="19">{{dets.assetsUser}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="5">关联邮箱：</el-col>
                <el-col :span="19">{{dets.email}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="5">漏洞分类：</el-col>
                <el-col :span="19">{{dets.vulnType}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="5">风险等级：</el-col>
                <el-col :span="19"><span class="statusSty" :class="dets.level | statusFilter">{{dets.level | formatStata}}</span></el-col>
              </el-row>
              <el-row>
                <el-col :span="5">发现时间：</el-col>
                <el-col :span="19">{{dets.createDate}}</el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="demo-layout">
              <el-row>
                <el-col :span="2">漏洞简介：</el-col>
                <el-col :span="22">{{dets.introduce}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="2">修复方案：</el-col>
                <el-col :span="22">{{dets.fixSolution}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="2">修复指南：</el-col>
                <el-col :span="22">{{dets.fixStep}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="2">处理状态：</el-col>
                <el-col :span="22">{{dets.fixStatus | processState}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="2">处理说明：</el-col>
                <el-col :span="22">{{dets.fixAction}}</el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import  axios from 'axios'
  import {getHoleList,getConstants,getOrganaizate,saveHolefix,detailsShole} from '../../api/securityHole/holeManage.js'
  import { destroyCache, filterItems } from '../../utils/deleCache.js'

  export default {
    data() {
      return {
        tableHeight: document.documentElement.clientHeight - 215,
        total: 0,//默认数据总数
        pagesize:15,//每页的数据条数
        currentPage:1,//默认开始页面
        isFalse: false,
        dialogFormVisible: false,
        dialogFormVisible1:false,
        filter:[],
        tableList:[],
        vulnLevelOPs:[],
        vulnLevelFliter:[],
        fixStatusOPs:[],
        fixStatusFliter:[],
        OrganizeOPs:[],
        OrganizeFilters:[],
        loading:true,
        paraForm:{
          assetsIp:''
        },
        updataForm:{
          fixStatus:'2',
          explain:'',
          vulnId:''
        },
        dets:{
          vulnName:'',cveNo:'',cvndNo:'',assetsIp:'',hostType:'',assetsUser:'',
          email:'',vulnType:'',level:'',introduce:'',fixSolution:'',fixStep:'',createDate:'',
          fixStatus:'',fixAction:''
        },
        filterName: {}
      }

    },
    filters: {
      // 颜色转换
      statusFilter(status) {
        const statusMap = {
          0: 'color_one',
          1: 'color_two',
          2: 'color_three',
          3: 'color_four',
          4: 'color_five'
        }
        return statusMap[status]
      },
      // 状态显示转换
      formatStata(status) {
        const statusMap = {
          0: '信息',
          1: '低危',
          2: '中危',
          3: '高危',
          4: '紧急',
        }
        return statusMap[status]
      },
      //处理状态
      processState(status) {
        const statusMap = {
          0: '待修复',
          1: "复查中",
          2: "已修复",
          3: "已忽略",
          4: "漏洞复现"
        }
        return statusMap[status]
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
      //取消
      closeForm(){
        this.clearValidate('updataForm') // 清除表单的校验
      },
      //清除表单校验
      clearValidate(formName) {
        this.$refs[formName].clearValidate();
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.holeListInit()
      },
      //列表序号
      indexMethod (index) {
        return (((this.currentPage-1)*this.pagesize)+(index+1));
      },
      created(){
        this.total = this.tableList.length;
      },
      //查询
      getSearch(){
        this.loading = true
        this.currentPage = 1
        this.holeListInit()
      },
      //列表
      holeListInit(){
        let para ={
          'assetsIp':this.paraForm.assetsIp,
          'pageNo': this.currentPage,
          'pageSize':this.pagesize
        }
        //para = Object.assign(this.filterName, para);
        for(var i in this.filterName) {
          para[''+i] = this.filterName[i];
        }
        getHoleList(para).then(res =>{
          this.loading = false
          let data = res.result.results
          this.total = res.result.totalCount;
          data == null ? this.tableList = [] : this.tableList = data
        })
      },
      //所属机构
      getOrganizationList(){
        let that = this;
        getOrganaizate('').then(res=>{
          let sysOffices = res.result.sysOffices;
          let temp = [], tempf = []
          for (let x= 0;x< sysOffices.length;x++){
            let a ={
              value:sysOffices[x].officeId,
              label:sysOffices[x].officeName
            }
            let b ={
              value:sysOffices[x].officeId,
              text:sysOffices[x].officeName
            }
            temp.push(a)
            tempf.push(b)
          }
          that.OrganizeOPs = temp
          that.OrganizeFilters = tempf
        })
      },
      //常量
      constantInit(){
        let that = this;
        getConstants('').then(res =>{
          let levelList = res.result.vulnLevel
          let statusList = res.result.fixStatus

          let tempf = [],temps=[],temos=[]
          //风险等级
          for (let x in levelList) {
            if(levelList[x] != '信息'){
              let f = {
                value: x,
                text: levelList[x]
              }
              tempf.push(f);
            }
          }
          console.log(tempf)
          that.vulnLevelFliter = tempf;

          //处理状态
          for (let x in statusList) {
            let d = {
              value: x,
              label: statusList[x]
            }
            let f = {
              value: x,
              text: statusList[x]
            }
            temps.push(d);
            temos.push(f);
          }
          that.fixStatusOPs = temps;
          that.fixStatusFliter = temos;
        })
      },

      //处理状态
      getStatus(val) {
        let result = "";
        for (var x = 0; x < this.fixStatusOPs.length; x++) {
          if (val == this.fixStatusOPs[x].value) {
            result = this.fixStatusOPs[x].label;
          }
        }
        return result;
      },
      //所属机构
      getOrganize(val) {
        let result = "";
        for (var x = 0; x < this.OrganizeOPs.length; x++) {
          if (val == this.OrganizeOPs[x].value) {
            result = this.OrganizeOPs[x].label;
          }
        }
        return result;
      },
      //数字转中文
      statusTransfer(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined ){
          return '—'
        } else {
          return this.getStatus(arr)
        }

      },
      OrganizeTransfer(row, column) {
        return this.getOrganize(row[column['property']])
      },
      //下拉筛选事件
      /*filterTag(value, row, column) {
        value = Number(value);
        const property = column['property'];
        return row[property] === value;
      },*/
      filterChange(filters) {
         this.filterName = filterItems(filters, this.filterName);
         this.holeListInit();
      },
      //修改（弹窗）
      updateOper(index, row){
        this.dialogFormVisible = true //显示对话框
        this.updataForm.fixStatus = (row.fixStatus).toString()
        this.updataForm.vulnId = row.id
      },

      //修改
      edit(index, row){
        this.$refs.updataForm.validate(valid => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: false
            }).then(() => {
              saveHolefix(this.updataForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '信息提交成功!'
                });
                // this.$refs['updataForm'].resetFields()//重置表单
                this.dialogFormVisible = false
                this.holeListInit()
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交！'
              });
            });
          }
        })
      },
      //详情
      detailsOper(index, row){
        let that = this
        that.dialogFormVisible1 = true //显示对话框
        const para ={id:row.id}
        detailsShole(para).then(res => {
          let results =res.result
          that.dets.vulnName = results.vulnName;
          that.dets.cveNo = results.cveNo;
          that.dets.cnvdNo = results.cnvdNo;
          that.dets.assetsIp = results.assetsIp;
          that.dets.hostType = results.hostType;
          that.dets.assetsUser = results.assetsUser;
          that.dets.email = results.email;
          that.dets.vulnType = results.vulnType;
          that.dets.level = results.level;
          that.dets.createDate = results.createDate;
          that.dets.introduce = results.introduce;
          that.dets.fixSolution = results.fixSolution;
          that.dets.fixStep = results.fixStep;
          that.dets.fixStatus = results.fixStatus;
          that.dets.fixAction = results.fixAction;
        })
      },

    },
    mounted(){
      this.holeListInit()
      this.constantInit()
      this.getOrganizationList()
    }

  }
</script>
<style>
  .detailsHo p{
    padding-bottom: 15px;
    margin: 0 10px;
    line-height: 27px;
  }
  .detailsHo .el-dialog {
    width: 60%;
  }
  .demo-layout .el-row {
    margin-bottom: 10px;
    line-height: 27px;

  }
  .demo-layout .el-col-2 {
    width: 9.33333%;
  }
  .demo-layout .el-col-22 {
    width: 90.66667%;
  }

</style>
