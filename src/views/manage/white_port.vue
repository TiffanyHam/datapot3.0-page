<template>
  <div class="title">
    <div class="filter-container">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="paraForm" ref="paraForm">
          <el-form-item>
            <el-input v-model="paraForm.port" placeholder="请输入端口名称" style="width:180px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getSearch">查询</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" icon="el-icon-plus" @click="insert">新增</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="upDialogFormVisible = true">导入</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-container>
        <el-main>
          <el-table
            v-loading="loading"
            :data="tableList"
            style="width: 100%" :height="tableHeight">
            <el-table-column width="50" type="index" :index="indexMethod"></el-table-column>

            <el-table-column
              prop="port"
              :formatter="fmtLength"
              label="端口名称">
            </el-table-column>

            <el-table-column
              prop="serverInfo"
              :formatter="fmtLength"
              label="服务信息">
            </el-table-column>

            <el-table-column
              prop="remarks"
              :formatter="fmtLength"
              label="端口说明">
            </el-table-column>

            <el-table-column
              prop="uptime"
              :formatter="fmtLength"
              label="更新时间">
            </el-table-column>

            <el-table-column label="操作" align="center" class="btns">
              <template slot-scope="scope">
                <el-button type="text" class="btns" @click='del(scope.$index, scope.row)'>删除</el-button>
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

      <!--新增弹窗-->
      <el-dialog title="新增白名单" :visible.sync="dialogFormVisible" @close="closeForm">
        <el-form :label-position="labelPosition" :model="form" ref="form" :rules="rules" label-width="100px" class="demo-ruleForm" style="margin: 0 auto;">
          <el-form-item label="端口名称:" prop="port">
            <el-input v-model="form.port"></el-input>
          </el-form-item>
          <el-form-item label="服务信息:" prop="serverInfo">
            <el-input v-model="form.serverInfo"></el-input>
          </el-form-item>
          <el-form-item label="端口说明:" prop="remarks">
            <el-input v-model="form.remarks"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button  type ="info" @click.native="dialogFormVisible=false">取消</el-button>
          <el-button  type="primary" @click="createData" class="btns_w">确定</el-button>
        </div>
      </el-dialog>

      <!--上传弹窗-->
      <el-dialog title="上传过滤规则" :visible.sync="upDialogFormVisible">
        <el-row>
          <el-upload
            class="upload-rules"
            ref="upload"
            action=""
            :multiple="false"
            :limit="1"
            accept="rules"
            :auto-upload="false"
            :on-exceed="handleExceed"
            :on-remove="handleRemove" 
            :on-change="handleChange"
            :before-remove="beforeRemove"
            :beforeUpload="beforeUpload"
            :file-list="fileList"
            :list-type="typeList"
            :http-request="setUpload">
            <el-button slot="trigger" size="small" type="primary" icon="el-icon-plus">选择文件</el-button>
          </el-upload>
        </el-row>
        <p v-show="isUpload" style="width: 100%;text-align: center;"><i class="el-icon-loading"></i>上传中，请稍后..</p>
        <p style="color:red;">{{fileMsg}}</p>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="submitUpload" :disabled="ulDisabledBtn">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import axios from  'axios'
  import {getWhitePortPage,getWhitePortInsert,getWhitePortDel,upLoad} from '../../api/manage/white_port.js'
  import { isNum } from '../../utils/validate.js'

  export default {
    data(){
      const isNumber = (rule, value, callback) => {
        if (!isNum(value)) {
          callback(new Error('请输入数字类型'))
        } else {
          callback()
        }
      }
      return{
        tableHeight: document.documentElement.clientHeight - 215,
        total: 0,//默认数据总数
        pagesize:15,//每页的数据条数
        currentPage:1,//默认开始页面
        loading: true,//加载
        labelPosition: 'left',
        fileList:[], //上传的文件列表
        typeList: 'rules', //文件列表的类型
        fileMsg: '',
        dialogFormVisible: false,
        upDialogFormVisible:false,
        ulDisabledBtn: false,
        isUpload: false,
        tableList: [],
        paraForm: {
          port: '',
        },
        form: {
          port:'',
          serverInfo:'',
          remarks:''
        },
        rules: {
          port: [
            { required: true, message: '请输入端口名称', trigger: 'blur' },
            { validator: isNumber, message: '端口名称输入格式有误', trigger: 'blur'},
          ],
          serverInfo: [
            { required: true, message: '请输入服务信息', trigger: 'blur' },
          ],
          remarks: [
            { required: true, message: '请输入端口说明', trigger: 'blur' },
          ]
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
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.pageList()
      },
      //列表序号
      indexMethod (index) {
        return (((this.currentPage-1)*this.pagesize)+(index+1));
      },
      //取消
      closeForm(){
        this.clearValidate('form') // 清除表单的校验
      },
      //清除表单校验
      clearValidate(formName) {
        this.$refs[formName].clearValidate();
      },
      //查询
      getSearch(){
        this.loading = true
        this.currentPage = 1
        this.pageList()
      },
      //列表
      pageList(){
        let para ={
          'port':this.paraForm.port,
          'pageNum': this.currentPage,
          'numPerPage':this.pagesize
        }
        getWhitePortPage(para).then(res => {
          this.loading = false
          let data = res.result.results;
          this.total = res.result.totalCount;
          data == null ? this.tableList = [] : this.tableList = data;

        })
      },
      // 显示新增界面
      insert() {
        this.dialogFormVisible = true //显示对话框
        this.form = {
          port:'',
          serverInfo:'',
          remarks:''
        }
      },
      // 新增
      createData: function() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$confirm('确认提交？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: false
            }).then(() => {
              const para = Object.assign({}, this.form)//接收多个参数
              getWhitePortInsert(para).then(res => {
                this.$message({
                  type: 'success',
                  message: '已加入白名单!'
                });
                this.$refs['form'].resetFields()//重置表单
                this.dialogFormVisible = false
                this.pageList()
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
      //删除
      del (index, row) {
        this.$confirm('确认删除？', '提示', {
          type: 'warning'
        }).then(() => {
          const param = { id: row.id };
          getWhitePortDel(param).then(res => {
            this.pageList()
            this.$message({
              message: '已移出白名单！',
              type: 'success'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除！'
          });
        })

      },
      //上传
      //删除文件
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.fileList = [];
      },
      beforeRemove(file, fileList) {
        //return this.$confirm(`确定移除 ${ file.name }？`);
        const extension = file.name.split('.')[1] === 'xls'
        const extension2 = file.name.split('.')[1] === 'xlsx'
        if (extension === false && extension2 === false) {
          return this.$confirm(`文件格式错误，是否移除 ${ file.name }？`);
        } else {
          return this.$confirm(`确定移除 ${ file.name }？`);
        }
      },
      //文件超出个数限制时的钩子
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      //文件发生改变时的钩子
      handleChange(file, fileList) {
        if (file) {
          this.fileMsg = "";
        }
      },
      //自定义上传
      setUpload(file) {

        if (file.file) {
          this.ulDisabledBtn = true;
          this.isUpload = true;
          let form = new FormData();
          // 文件对象
          form.append("file", file.file);
          let that = this;
          upLoad(form).then(res => {
            this.$message({
              type: 'success',
              message: '成功上传文件！'
            });
            that.ulDisabledBtn = false;
            that.isUpload = false;
            that.upDialogFormVisible = false;
            that.fileList = [];
          }).catch(() => {
            that.ulDisabledBtn = false;
            that.isUpload = false;
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请选择上传文件'
          })
        }

      },
      // 确定上传
      submitUpload() {
        this.beforeUpload();
        this.$refs.upload.submit();
      },
      beforeUpload(file) {
        if (file == undefined) {
          this.fileMsg = "请选择上传文件";
          return false;
        }
        const extension = file.name.split('.')[1] === 'xls'
        const extension2 = file.name.split('.')[1] === 'xlsx'
        return extension || extension2;
      },

    },
    mounted(){
      this.pageList()
    }
  }
</script>

<style scoped>

</style>
