<template>
  <div class="title">
    <div class="filter-container">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="paraForm" ref="paraForm">
          <el-form-item>
            <el-input v-model="paraForm.vulnName" placeholder="请输入漏洞名称" style="width:180px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="paraForm.cveNo" placeholder="请输入CVE编号" style="width:180px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="paraForm.cnvdNo" placeholder="请输入CNVD编号" style="width:180px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getSearch">查询</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" icon="el-icon-refresh" @click="refreshHole">漏洞库更新</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-container>
        <el-main>
          <el-table
            class="holeTab"
            v-loading="loading"
            :data="tableList"
            style="width: 100%" :height="tableHeight"  @filter-change="filterChange">
            <el-table-column width="70" type="index" :index="indexMethod"></el-table-column>
            <el-table-column
              prop="cveNo"
              width="150"
              :formatter="fmtLength"
              label="CVE编号">
            </el-table-column>
            <el-table-column
              prop="cnvdNo"
              width="150"
              label="CNVD编号">
            </el-table-column>
            <el-table-column
              prop="vulnName"
              width="320"
              show-overflow-tooltip
              label="漏洞名称">
            </el-table-column>
            <el-table-column
              width="110"
              align="center"
              prop="level"
              :filters="vulnLevelFliter"
              :filter-multiple="isFalse"
              column-key="level"
              label="风险等级">
              <template slot-scope="scope" align="center">
                <span class="statusSty" :class="scope.row.level | statusFilter">{{scope.row.level | formatStata}}</span>
              </template>
            </el-table-column>
            <!-- :filter-method="filterTag" -->

            <el-table-column
              prop="upTime"
              label="更新时间">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" class="btns" @click="updateOper(scope.$index, scope.row)">修改</el-button>
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
      <!--修改详情弹窗-->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="databasHo">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="data-layout">
              <el-row>
                <el-col :span="3">漏洞名称：</el-col>
                <el-col :span="21">{{dets.vulnName}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="3">CVE编号：</el-col>
                <el-col :span="21">{{dets.cveNo}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="3">CNVD编号：</el-col>
                <el-col :span="21">{{dets.cnvdNo}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="3">漏洞分类：</el-col>
                <el-col :span="21">{{dets.vulnType}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="3">风险等级：</el-col>
                <el-col :span="21"><span class="statusSty" :class="dets.level | statusFilter">{{dets.level | formatStata}}</span></el-col>
              </el-row>
              <el-row>
                <el-col :span="3">漏洞简介：</el-col>
                <el-col :span="21" class="break_words">{{dets.introduce}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="3">修复方案：</el-col>
                <el-col :span="21">{{dets.fixSolution}}</el-col>
              </el-row>
            </div>
            <div class="data-layout" v-if="dialogStatus=='info'">
              <el-row>
                <el-col :span="3">修复指南：</el-col>
                <el-col :span="21">{{dets.fixStep}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="3">备注信息：</el-col>
                <el-col :span="21">{{dets.remarks}}</el-col>
              </el-row>
            </div>
            <div class="data-layout" v-else>
              <el-form :inline="true" ref="form" :model="form" class="demo-ruleForm" >
                <el-row>
                  <el-col :span="3">修复指南：</el-col>
                  <el-col :span="21"><el-input type="textarea" placeholder="点击此处编辑" v-model="form.fixStep"></el-input></el-col>
                </el-row>
                <el-row>
                  <el-col :span="3">备注信息：</el-col>
                  <el-col :span="21"><el-input type="textarea" placeholder="点击此处编辑" v-model="form.remarks"></el-input></el-col>
                </el-row>
              </el-form>
            </div>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer" style="text-align: left" v-show="dialogStatus=='update'">
          <el-row>
            <el-col :span="3">&nbsp;</el-col>
            <el-col :span="21"><el-button  type="primary" @click="updateData">提交</el-button></el-col>
          </el-row>

        </div>
      </el-dialog>

      <!--漏洞库更新弹窗 http://192.168.20.141:18075/om/vulnresource/import-->
      <el-dialog title="漏洞库更新" :visible.sync="dialogRefresh" @close="cancelUp">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form :model="refreshForm" ref="refreshForm">
              <el-form-item label="CNVD文件：">
                <el-row>
                <el-upload
                  :on-change="fileChange"
                  :on-remove="handleRemove"
                  ref="uploadExcel"
                  :limit= limitNum
                  action=""
                  :auto-upload="false"
                  class="upload-demo"
                  :before-upload="beforeUpload"
                  :multiple="false"
                  :file-list="fileList"
                  :http-request="uploadHole">
                  <el-button size="small" type="primary" v-text="btnText" @click="againSelect"></el-button>
                </el-upload>
                </el-row>
                <p v-show="isUpload" style="width: 100%;text-align: center;margin-bottom: 20px;"><i class="el-icon-loading"></i>上传中，请稍后..</p>

              </el-form-item>
              <el-form-item class="a-center">
                <el-button type="info" @click="cancelUp">取 消</el-button>
                <el-button type="primary" @click="uploadFile">确定</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import {getHoleData,getConstants,modifyInfo,detailsHole,updateHole} from '../../api/securityHole/holeDasebase.js'
  import ElRow from "element-ui/packages/row/src/row"
  import { destroyCache, filterItems } from '../../utils/deleCache.js'

  export default {
    components: {ElRow},
    data() {
      return {
        loading:true,
        isFalse:false,
        isUpload:false,
        dialogFormVisible: false,
        dialogRefresh:false,
        dialogStatus: '',
        textMap: {
          update: '漏洞信息修改',
          info: '漏洞详情'
        },
        btnText:'选择文件',
        tableList:[],
        tableHeight: document.documentElement.clientHeight - 215,
        total: 0,//默认数据总数
        pagesize:15,//每页的数据条数
        currentPage:1,//默认开始页面
        vulnLevelFliter:[],
        paraForm:{
          vulnName:'',
          cveNo:'',
          cnvdNo:''
        },
        form:{
          remarks:'',fixStep:'',vulnId:''
        },
        refreshForm:{
          file: ''
        },
        fileList: [],
        limitNum: 1,
        dets:{
          vulnName:'',cveNo:'',cnvdNo:'',vulnType:'',level:'',introduce:'',fixSolution:'',fixStep:'',remarks:''
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
      //分页
      handleCurrentChange(val) {

        this.currentPage = val;
        this.getAssetListNewTbl()
      },
      //列表序号
      indexMethod (index) {
        return (((this.currentPage-1)*this.pagesize)+(index+1));
      },
      //查询
      getSearch(){
        this.loading = true
        this.currentPage = 1
        this.getAssetListNewTbl()
      },
      //列表
      getAssetListNewTbl(){
        let that = this;
        let para ={
          'vulnName':this.paraForm.vulnName,
          'cveNo':this.paraForm.cveNo,
          'cnvdNo':this.paraForm.cnvdNo,
          'pageNo': this.currentPage,
          'pageSize':this.pagesize
        }
        //para = Object.assign(this.filterName, para);
        for(var i in this.filterName) {
          para[''+i] = this.filterName[i];
        }
        getHoleData(para).then(res =>{

          that.loading = false
          let data = res.result.results
          that.total = res.result.totalCount;
          data == null ? that.tableList = [] : that.tableList = data
        })
      },
      //常量
      constantInit() {
        let that = this;
        getConstants('').then(res => {
          let levelList = res.result.vulnLevel
          let tempf = []
          //风险等级
          for (let x in levelList) {
            if (levelList[x] != '信息') {
              let f = {
                value: x,
                text: levelList[x]
              }
              tempf.push(f);
            }
          }
          that.vulnLevelFliter = tempf;
        })
      },

      //下拉筛选事件
     /* filterTag(value, row, column) {
        value = Number(value);
        const property = column['property'];
        return row[property] === value;
      },*/
      filterChange(filters) {
         this.filterName = filterItems(filters, this.filterName);
         this.getAssetListNewTbl();
      },
      //编辑
      updateOper(index,row) {
        let that = this
        that.loading = true
        that.dialogStatus = 'update'
        that.dialogFormVisible = true //显示对话框
        that.form.vulnId = row.vulnId //获取id
        const para = {vulnId: row.vulnId}
        detailsHole(para).then(res => {
          that.loading = false
          let results = res.result;
          that.dets.vulnName = results.vulnName;
          that.dets.cveNo = results.cveNo;
          that.dets.cnvdNo = results.cnvdNo;
          that.dets.vulnType = results.vulnType;
          that.dets.level = results.level;
          that.dets.introduce = results.introduce;
          that.dets.fixSolution = results.fixSolution;
          that.dets.fixStep = results.fixStep;
          that.dets.remarks = results.remarks;
          that.form = Object.assign({}, row) //数据填充

        })
      },


      //提交
      updateData(index,row){
        let that = this

        that.$confirm('确认提交吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: false
        }).then(() => {
          if (!that.form.fixStep) {
            that.$message.error("修复指南不能为空！")
            return false
          }
          let _remarks = this.form.remarks
          if(_remarks !== null && _remarks !==undefined){
            if (_remarks.length > 200) {
              that.$message.error("备注信息不可超过200字符！")
              return false
            }
          }

          modifyInfo(that.form).then(res => {
            that.$message({
              type: 'success',
              message: '信息提交成功!'
            });
            that.dialogFormVisible = false
            that.getAssetListNewTbl()

          })
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '取消修改'
          });
        });

      },

      //详情
      detailsOper(index,row){
        let that = this
        that.dialogStatus = 'info'
        that.dialogFormVisible = true //显示对话框
        that.loading = true
        const para ={vulnId:row.vulnId}
        detailsHole(para).then(res =>{
          that.loading = false
          let results = res.result;
          that.dets.vulnName = results.vulnName;
          that.dets.cveNo = results.cveNo;
          that.dets.cnvdNo = results.cnvdNo;
          that.dets.vulnType = results.vulnType;
          that.dets.level = results.level;
          that.dets.introduce = results.introduce;
          that.dets.fixSolution = results.fixSolution;
          that.dets.fixStep = results.fixStep;
          that.dets.remarks = results.remarks;
        })
      },

      //漏洞库更新
      refreshHole(){
        this.dialogRefresh = true //显示对话框
        this.btnText = '选择文件'
      },
      // 文件状态改变时的钩子
      fileChange(file, fileList){
        this.refreshForm.file = file.raw  //上传文件变化时将文件对象push进表单里
        this.fileList = fileList
        if(this.fileList.length >0){
          this.btnText = '重新选择'
          return false
        }
      },
      //移除
      handleRemove(file, fileList){
        this.btnText = '选择文件'
        this.fileList = []
      },
      //重新选择按钮
      againSelect(){
        if(this.fileList.length > 0){
          this.$refs.uploadExcel.clearFiles()//清空
          return false
        }
      },
      //确定按钮
      uploadFile() {
        if(this.fileList.length == 0){
          this.$message.error('请选择上传文件！');
          return false
        }
        this.isUpload = true
        this.$refs.uploadExcel.submit();
      },
      uploadHole(file) {
        var form = new FormData();
        // 文件对象
        form.append("files", file.file);
        var that = this;
        updateHole(form).then(res => {
          this.isUpload = false
          this.$message({
              type: 'success',
              message: '漏洞库更新成功！'
          });
          this.fileList = [];
          that.dialogRefresh = false;
        }).catch(() => {
          this.isUpload = false
          this.$message({
              type: 'warning',
              message: res.msg
            })
        })
      },
      //上传文件之前
      beforeUpload(file){
        /*let formData = new FormData();
        formData.append('file',this.refreshForm.file);
        updateHole(formData).then(res =>{
          this.dialogRefresh = false
          if (res.retCode === 1) {
            this.$message({
              message: '上传成功！',
              type: 'success'
            });
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            });
          }
        })
        return true*/
      },
      //取消上传
      cancelUp(){
        this.dialogRefresh = false
        if(this.fileList.length > 0){
          this.$refs.uploadExcel.clearFiles()//清空
          this.fileList = []
          return false
        }
      },
    },
    mounted(){
      this.getAssetListNewTbl()
      this.constantInit()
    }
  }
</script>
<style>
  .data-layout .el-row {
    margin-bottom: 10px;
    line-height: 27px;

  }
  .databasHo .el-dialog {
    width: 60%;
  }
  .databasHo .el-button{padding: 7px 30px;    font-family: 'Avenir', Helvetica, Arial, sans-serif;  }

  .databasHo .el-textarea__inner{
    width:100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }

  .databasHo .el-dialog__body {
    padding: 30px 20px 10px 20px;
  }
  .upload-demo {
    margin-bottom: 30px;
  }
</style>
