<template>
  <div class="title">
    <div class="filter-container">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="paraForm" ref="paraForm">
          <el-form-item>
            <el-input v-model="paraForm.ip" placeholder="请输入IP" style="width:180px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getSearch">查询</el-button>
          </el-form-item>
          <el-form-item style="float: right">
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
              prop="ip"
              :formatter="fmtLength"
              label="IP">
            </el-table-column>

            <el-table-column
              prop="addTime"
              :formatter="fmtLength"
              label="保存时间">
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
        <el-form :label-position="labelPosition"   :model="form" ref="form" :rules="rules" label-width="100px" class="demo-ruleForm" style="margin: 0 auto;" :disabled="disabled">
          <el-form-item label="主机IP:" prop="ip">
            <el-input v-model="form.ip"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button  type ="info" @click.native="dialogFormVisible=false">取消</el-button>
          <el-button  type="primary" @click="createData" class="btns_w">确定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import { isvalidateIP } from '../../utils/validate.js'
  import { getWhiteIpPage , getWhiteIpInsert , getWhiteIpDel} from '../../api/manage/white_ips.js'

  export default {
    data() {
      const validateIP = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入IP！'));
        } else {
          if (!isvalidateIP(value)) {
            callback(new Error('请输入正确的IP格式！'))
          } else {
            callback()
          }
        }
      }
      return {
        tableHeight: document.documentElement.clientHeight - 215,
        total: 0,//默认数据总数
        pagesize:15,//每页的数据条数
        currentPage:1,//默认开始页面
        istag: true,
        input:"",
        labelPosition: 'left',
        dialogFormVisible: false,
        disabled:false,
        loading: true,//加载
        paraForm: {
          ip: '',
        },
        form: {
          ip:''
        },
        rules: {
          ip: [
            { required: true,validator: validateIP,trigger: 'blur' },
          ]
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
        this.getWhiteIpList()
      },
      //列表
      getWhiteIpList() {
        let that = this;
        let para ={
          'ip':this.paraForm.ip,
          'pageNum': this.currentPage,
          'numPerPage':this.pagesize
        }
        getWhiteIpPage(para).then(res => {
          that.loading = false;
          let data = res.result.results;
          that.total = res.result.totalCount;
          //  that.pagesize = res.result.numPerPage
          //that.currentPage = res.result.pageNum
          if(data !== null) {
            for (let i = 0; i < data.length; i++) {
              let time = data[i].addTime;
              data[i].addTime = time.slice(0, time.indexOf("."));//去掉时间后面的毫秒
            }
          }
          data == null ? this.tableList = [] : this.tableList = data;
        })
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getWhiteIpList()
      },
      //列表序号
      indexMethod (index) {
        return (((this.currentPage-1)*this.pagesize)+(index+1));
      },
      // 显示新增界面
      insert() {
        this.dialogFormVisible = true //显示对话框
        this.form = {
          ip: '',
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
              getWhiteIpInsert(para).then(res => {
                this.$message({
                  type: 'success',
                  message: '成功新增白名单!'
                });
                this.$refs['form'].resetFields()//重置表单
                this.dialogFormVisible = false
                this.getWhiteIpList()
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
          const param = { ip: row.ip };
          getWhiteIpDel(param).then(res => {
            this.getWhiteIpList()
            this.$message({
              message: '已删除白名单！',
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

    },
    mounted() {
      this.getWhiteIpList();
    }
  };
</script>
