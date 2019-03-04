<template>
  <div class="title">
    <el-row :gutter="20">
      <el-col :span="18">
        <div class="filter-container">
          <!--工具条-->
          <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
               <el-form-item>
                <el-input v-model="paraForm.groupNameQ" placeholder="请输入角色名称" style="width:180px;"></el-input>
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
                :highlight-current-row="true"
                :data="tableList"
                style="width: 100%" :height="tableHeight"
                @row-click="tableRowClassName"
              >
                <el-table-column width="50" type="index" :index="indexMethod"></el-table-column>

                <el-table-column
                  prop="groupName"
                  :formatter="fmtLength"
                  label="角色">
                  <template slot-scope="scope">
                    <el-button type="text"  style="color: #4a88a5;padding: 0" @click="edit(scope.$index, scope.row)" >{{ scope.row.groupName }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="remarks"
                  :formatter="fmtLength"
                  label="备注">
                </el-table-column>

                <el-table-column
                  prop="uptime"
                  :formatter="fmtLength"
                  label="保存时间">
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
          <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="sys" @close="closeForm">
            <el-form :label-position="labelPosition"  :model="form" ref="form" :rules="rules" label-width="100px" class="demo-ruleForm" style="margin: 0 auto;" :disabled="disabled">
              <el-form-item label="名称:" prop="groupName">
                <el-input v-model="form.groupName"></el-input>
              </el-form-item>
              <el-form-item label="备注:" prop="remarks">
                <el-input type="textarea" v-model="form.remarks"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center">
              <el-button  v-if="dialogStatus=='create'|| dialogStatus=='update'" @click.native="dialogFormVisible=false" class="btns_w" type ="info">取消</el-button>
              <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" class="btns_w">确定</el-button>
              <el-button v-else type="primary" @click="updateData" class="btns_w">确定</el-button>
            </div>


          </el-dialog>
        </div>
      </el-col>
      <!--树形-->
      <el-col :span="6">
        <div class="filter-container">
          <el-scrollbar class="page-component_scroll" style="height: 100%;">
          <el-tree
            v-loading="treeLoading"
            :data="treeData"
            show-checkbox
            node-key="id"
            ref="menuTree"
            default-expand-all
            :props="defaultProps">
          </el-tree>
          </el-scrollbar>

          <el-button type="primary" class="btns_w" style="margin: 25px;" @click="saveTree">保存</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import axios from 'axios'
  import { getSysGroupPage,getSysGroupInsert,getTreeMenu,toTreeData,getAuth, getTreeMenuId} from '../../api/manage/sys_group.js'

  export default {
    data() {
      return {
        tableHeight: document.documentElement.clientHeight - 215,
        total: 0,//默认数据总数
        pagesize:15,//每页的数据条数
        currentPage:1,//默认开始页面
        istag: true,
        input:"",
        menuIdStr:'',
        userId:'',
        labelPosition: 'left',
        dialogFormVisible: false,
        disabled:false,
        loading: true,//加载
        treeLoading:true,
        currentRoleMenus: [],
        form: {
          groupName:'',
          remarks:''
        },
        paraForm:{
          groupNameQ:''
        },
        rules: {
          groupName: [
            { required: true, message: '名称不能为空！', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          /*remarks: [
            { min: 0, max: 20, message: '长度在 0 到 100 个字符', trigger: 'blur' }
          ]*/
        },
        dialogStatus: '',
        textMap: {
          update: '修改角色信息',
          create: '新增角色信息',
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        defaultExpandKeys: [],//默认展开节点列表
        tableList: [],
        idArr:[],
        treeData:[]
      };
    },
    methods: {
      fmtLength(row, column){
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          return arr
        }
      },
      //权限
      tableRowClassName(row) {
        const param = {groupId: row.groupId};
        this.userId = row.groupId;
        var that = this;
         getTreeMenuId(param).then(res => {
           var data = res.result;
           var idsArr = [];
           for (var i in data) {
              idsArr.push(data[i].menuId);
           }
           that.$refs.menuTree.setCheckedKeys([]);//清空
           that.$refs.menuTree.setCheckedKeys(idsArr);//通过 key 设置节点已勾选
        });
      },
      //保存按钮
      saveTree(){
        this.$confirm('确认保存？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: false
        }).then(() => {
          var that = this;
          let _val = that.$refs.menuTree.getCheckedKeys();//[20]转换为20
          let obj = _val.join(',');//数组转字符串
          const param = {groupId: String(this.userId),menuIdStr:obj};
          getAuth(param).then(res => {
             this.$message({
               type: 'success',
               message: res.msg
             });

          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消保存！'
          });
        });
        },

      //查询
      getSearch(){
        this.loading = true;
        this.currentPage = 1
        this.getSysList()
      },
      //列表
      getSysList() {
        let that = this;
        let para={
          'groupNameQ':this.paraForm.groupNameQ,
          'pageNum': this.currentPage,
          'numPerPage':this.pagesize
        }
        getSysGroupPage(para).then(res => {
          that.loading = false;
          var data = res.result.pager.results;
          that.total = res.result.pager.totalCount;
         // that.pagesize = res.result.pager.numPerPage
          //that.currentPage = res.result.pager.pageNum
          data == null ? that.tableList = [] : that.tableList = data;
        })
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getSysList()
      },
      //列表序号
      indexMethod (index) {
        return index+1;
      },
      // 显示编辑界面
      edit(index, row) {
        this.dialogStatus = 'update'
        this.dialogFormVisible = true //显示对话框
        this.form = Object.assign({}, row)
      },
      // 显示新增界面
      insert() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true //显示对话框
        this.form = {
          groupName: '',
        }
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
            var that = this;
            getSysGroupInsert(para).then(res => {
              this.$message({
                type: 'success',
                message: '成功修改角色信息!'
              });
              that.$refs['form'].resetFields()//重置表单
              that.dialogFormVisible = false
              that.getSysList()

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
              let _remarks = this.form.remarks
              if(_remarks !== null && _remarks !== undefined){
                if (_remarks.length > 200) {
                  this.$message.error("备注不可超过200字符！")
                  return false
                }
              }
              const para = Object.assign({}, this.form)//接收多个参数
              var that = this;

              getSysGroupInsert(para).then(res => {

                this.$message({
                  type: 'success',
                  message: '成功新增角色!'
                });
                that.$refs['form'].resetFields()//重置表单
                that.dialogFormVisible = false
                that.getSysList()

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

      //树形列表
      getTreeData() {
        var that = this;
        getTreeMenu('').then(res => {
          that.treeLoading = false;
          let treeList = res.result;
          const userStr = JSON.parse(treeList);//从一个字符串中解析出json对象
          that.treeData = toTreeData(userStr,"id","pId","name")
         //this.chils = JSON.stringify(result, null, '\t');//从一个对象解析出字符串
        })
      }
    },
    mounted() {
      this.getSysList();
      this.getTreeData();
    }
  };
</script>
<style>
  .page-component_scroll .el-scrollbar .el-scrollbar__wrap {overflow-x: hidden;}
  .el-tree {height: 480px;  }
  .current-row > td {
    background: #c0c4cc !important;
  }
  .sys .el-dialog {
    width:28%;
  }
</style>
