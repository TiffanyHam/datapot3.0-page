<template>
  <div class="title">
    <div class="filter-container">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="paraForm" ref="paraForm">
          <el-form-item>
            <el-input v-model="paraForm.tagName" placeholder="请输入标签名" style="width:180px;"></el-input>
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

            <el-table-column
              prop=""
              label="编号">
             <template scope="scope">
                <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="tagName"
              :formatter="fmtLength"
              label="标签名">
              <template slot-scope="scope">
                <el-button type="text"  style="color: #4a88a5;padding: 0">{{ scope.row.tagName }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              :formatter="fmtLength"
              label="创建时间">
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" class="btns" @click="edit(scope.$index, scope.row)" >修改</el-button>
                <el-button type="text" class="btns" @click='del(scope.$index, scope.row)'>删除</el-button>
              </template>
            </el-table-column>

          </el-table>
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="pagesize"
            :current-page="currentPage"
            background
            layout="prev, pager, next,total"
            :total="total">
          </el-pagination>
        </el-main>
      </el-container>

      <!--新增、编辑弹窗-->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="tag" @close="closeForm">
        <el-form :label-position="labelPosition"  :model="form" ref="form" :rules="rules" label-width="100px" class="demo-ruleForm" style="margin: 0 auto;" :disabled="disabled">
          <el-form-item label="标签名称:" prop="tagName">
            <el-input v-model="form.tagName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="info" v-if="dialogStatus=='create'|| dialogStatus=='update'" @click.native="dialogFormVisible=false" class="btns_w">取消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" class="btns_w">确定</el-button>
          <el-button v-else type="primary" @click="updateData" class="btns_w">确定</el-button>
        </div>


      </el-dialog>

    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import { getTagsPage,getTagsInsert,getTagsDel} from '../../api/manage/host_tags.js'

  export default {
    data() {
      return {
        tableHeight: document.documentElement.clientHeight - 215,
        total: 0,//默认数据总数
        pagesize:0,//每页的数据条数
        size:15,
        currentPage:1,//默认开始页面
        istag: true,
        input:"",
        labelPosition: 'left',
        dialogFormVisible: false,
        disabled:false,
        loading: true,//加载
        paraForm: {
          tagName:'',
        },
        form: {
          tagName:''
        },
        rules: {
          tagName: [
            { required: true, message: '标签名不能为空！', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ]
        },
        dialogStatus: '',
        textMap: {
          update: '修改标签',
          create: '新增标签',
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
      //查询
      getSearch(){
        this.loading = true;
        this.currentPage = 1
        this.getTagsList()
      },
      //列表
      getTagsList() {
        let that = this;
        let param = {
          'HostTagsReq':this.paraForm.tagName,
          'pageNum': this.currentPage,
          'numPerPage':this.size
        }
        getTagsPage(param).then(res => {
          that.loading = false;
          let data = res.result.results;
          that.total = res.result.totalCount;
          that.pagesize = res.result.numPerPage
          that.currentPage = res.result.pageNum
          data == null ? this.tableList = [] : this.tableList = data;
          if(data !== null){
            for(let i =0;i< data.length;i++){
              let time = data[i].createTime;
              data[i].createTime = time.slice(0,time.indexOf("."));//去掉时间后面的毫秒
            }
          }
        })
      },
      created() {
        this.total = this.tableList.length;
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getTagsList();
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
            getTagsInsert(para).then(res => {
              this.$message({
                type: 'success',
                message: '成功修改标签!'
              });
              this.$refs['form'].resetFields()//重置表单
              this.dialogFormVisible = false
              this.getTagsList()

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
          hostTagsReq: '',
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
              getTagsInsert(para).then(res => {
                this.$message({
                  type: 'success',
                  message: '成功新增标签!'
                });
                this.$refs['form'].resetFields()//重置表单
                this.dialogFormVisible = false
                this.getTagsList()

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
          const param = { hostTagsId: row.id };
          getTagsDel(param).then(res => {
            this.$message({
              message: '已删除标签！',
              type: 'success'
            })
            this.getTagsList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交！'
          });
        })

      },
    },
    mounted() {
      this.getTagsList();
    }
  };
</script>
<style>
  .tag .el-dialog {
    width: 28%;
  }
</style>
