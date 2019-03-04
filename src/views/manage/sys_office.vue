<template>
  <div class="title">
    <div class="filter-container">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="insert">新增</el-button>
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
              prop="officeName"
              :formatter="fmtLength"
              label="机构名称">
              <template slot-scope="scope">
                <el-button type="text"  style="color: #4a88a5;padding: 0" >{{ scope.row.officeName }}</el-button>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" class="btns" @click="edit(scope.$index, scope.row)">修改</el-button>
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

      <!--新增、编辑弹窗-->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="office" @close="closeForm">
        <el-form :label-position="labelPosition"  :model="form" ref="form" :rules="rules" label-width="100px" class="demo-ruleForm" style="margin: 0 auto;" :disabled="disabled">
          <el-form-item label="机构名称:" prop="officeName">
            <el-input v-model="form.officeName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button v-if="dialogStatus=='create'|| dialogStatus=='update'" @click.native="dialogFormVisible=false" class="btns_w" type ="info">取消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" class="btns_w">确定</el-button>
          <el-button v-else type="primary" @click="updateData" class="btns_w">确定</el-button>
        </div>


      </el-dialog>

    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import { getOfficePage,getOfficeInsert,getOfficeDel} from '../../api/manage/sys_office.js'

  export default {
    data() {
      return {
        tableHeight: document.documentElement.clientHeight - 215,
        total: 0,//默认数据总数
        pagesize:1,//每页的数据条数
        currentPage:1,//默认开始页面
        size:15,
        istag: true,
        input:"",
        labelPosition: 'left',
        dialogFormVisible: false,
        disabled:false,
        loading: true,//加载
        form: {
          officeName:''
        },
        rules: {
          officeName: [
            { required: true, message: '机构名称不能为空！', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ]
        },
        dialogStatus: '',
        textMap: {
          update: '修改分支机构',
          create: '新增分支机构',
        },
        tableList: [],
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
      //列表
      getOfficeList() {
        let that = this;
        let para ={
          'pageNum': this.currentPage,
          'numPerPage':this.size
        }
        getOfficePage(para).then(res => {
          this.loading = false;
          var data = res.result.results;
          that.total = res.result.totalCount;
          that.pagesize = res.result.numPerPage
          //that.currentPage = res.result.pageNum
          data == null ? this.tableList = [] : this.tableList = data;
        })
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getOfficeList()
      },
      //列表序号
      indexMethod (index) {
        return (((this.currentPage-1)*this.pagesize)+(index+1));
      },
      // 显示编辑界面
      edit(index, row) {
        this.dialogStatus = 'update'
        this.dialogFormVisible = true //显示对话框
        this.form = Object.assign({}, row)
      },
      // 编辑
      updateData(index, row) {
        this.$refs.form.validate(valid => {if (valid) {
          this.$confirm('确认提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: false
          }).then(() => {
            const para = Object.assign({}, this.form);//接收多个参数
            getOfficeInsert(para).then(res => {
              this.$message({
                type: 'success',
                message: '成功修改机构!'
              });
              this.$refs['form'].resetFields()//重置表单
              this.dialogFormVisible = false
              this.getOfficeList()

            })
          }).catch(() => {
            /*this.$message({
              type: 'info',
              message: '已取消编辑'
            });*/
          });
        }
        })
      },
      // 显示新增界面
      insert() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true //显示对话框
        this.form = {
          officeName: '',
        }
      },
      //取消
      closeForm(){
        this.clearValidate('form') // 清除表单的校验
      },
      //清除表单校验
      clearValidate(formName) {
        this.$refs[formName].clearValidate();
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
              getOfficeInsert(para).then(res => {
                this.$message({
                  type: 'success',
                  message: '成功新增机构!'
                });
                this.$refs['form'].resetFields()//重置表单
                this.dialogFormVisible = false
                this.getOfficeList()

              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交'
              });
            });
          }
        })
      },

      //删除
      del (index, row) {
        this.$confirm('确认删除?', '提示', {
          type: 'warning'
        }).then(() => {
          const param = { officeId: row.officeId };
          getOfficeDel(param).then(res => {
            this.$message({
              message: '已删除机构！',
              type: 'success'
            })
            this.getOfficeList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除！'
          });
        })

      },
    },
    mounted() {
      this.getOfficeList();
    }
  };
</script>
<style>
  .office .el-dialog {
    width:28%;
  }
</style>
