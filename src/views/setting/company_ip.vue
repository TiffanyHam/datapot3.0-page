<template>
  <div class="title company_ip">
    <div class="filter-container">
      <section class="app-container">
        <!--工具条-->
        <el-row>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" ref="form" :model="form">
            <el-form-item>
              <el-input placeholder="请输入起始ip" v-model="form.startIpQ"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="请输入结束ip" v-model="form.endIpQ"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchItem">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        </el-row>

        <!--列表-->
        <div class="container_table">
          <el-table
            :data="tableData"
            style="width: 100%" :height="tableHeight"
            :default-sort = "{prop: 'date', order: ''}" @filter-change="filterChange">
            <el-table-column
              prop=""
              label="#"
              width="50">
               <template scope="scope">
                <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="officeId"
              label="所属机构"
              :filter-multiple="isFalse"
              :filters="officeIdFilter"
              filter-placement="bottom-end"
              column-key="officeId"
              :formatter="ifendcase">
            </el-table-column>

            <el-table-column
              prop="startIp"
              :formatter="fmtLength"
              label="起始IP">
            </el-table-column>

            <el-table-column
              prop="endIp"
              :formatter="fmtLength"
              label="结束IP">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                 <el-button type="text" class="btns" @click="edit(scope.$index, scope.row)">修改</el-button>
                 <el-button type="text" class="btns" @click='del(scope.$index, scope.row)'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="fy"
                         layout="prev, pager, next,total"
                         :current-page.sync = "currentPage"
                         @current-change="current_change"
                         :total="total" :page-size="pagesize"
                         background
          >
          </el-pagination>
        </div>
        <!--新增弹窗-->
        <el-dialog :title="ipTitle" :visible.sync="dialogFormVisible">
          <el-form :model="IPForm"  :rules="rulesForm" ref="IPForm">
            <el-form-item label="分支机构" prop="officeId">
              <el-select v-model="IPForm.officeId" placeholder="请选择所属分支机构">
                <el-option
                  v-for="item in officeIdOps"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="起始IP" prop="startIp">
              <el-input v-model="IPForm.startIp"  style="width:217px;margin-left: 16px;"></el-input>
            </el-form-item>
            <el-form-item label="结束IP" prop="endIp">
              <el-input v-model="IPForm.endIp"  style="width:217px;margin-left: 16px;"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer"  style="text-align: center">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <!-- <el-button type="primary" v-if="isAdd='add'" @click="addSave">确 定</el-button>
            <el-button type="primary" v-else @click="editSave">确 定</el-button> -->
            <el-button type="primary" @click="addSave">确 定</el-button>
          </div>
        </el-dialog>



      </section>
    </div>
  </div>
</template>
<script>
  import { getCompanyIpPage, addCompanyIP, getOfficeAll, delCompanyIP } from '../../api/setting/company_ip.js'
  import { isvalidateIP } from '../../utils/validate.js'
  import { destroyCache, filterItems } from '../../utils/deleCache.js'

  export default {
    data() {
      const validateIP = (rule, value, callback) => {
        if (!isvalidateIP(value)) {
          callback(new Error('请输入正确的IP'))
        } else {
          callback()
        }
      }
      return {
        total: 0,//默认数据总数
        pagesize: 15,//每页的数据条数
        currentPage: 1,//默认开始页面
        istag: true,
        input:"",
        tableHeight: document.documentElement.clientHeight - 215,
        dialogFormVisible: false,
        officeIdOps: [],
        officeIdFilter: [],
        isFalse: false,
        form: {
          startIpQ: '',
          endIpQ: '',
          officeIdQ: '',
          numPerPage: 15,
          pageNum: 1
        },
        IPForm: {
          officeId: '',
          startIp: '',
          endIp: ''
        },
        rulesForm: {
          officeId: [
            { required: true, message: '请选择所属分支机构', trigger: 'blur' }
          ],
          startIp: [
            { required: true, message: '请输入起始IP', validator: validateIP, trigger: 'blur' }
          ],
          endIp: [
            { required: true, message: '请输入结束IP', validator: validateIP, trigger: 'blur' }
          ]
        },
        tableData: [],
        isAdd: 'add',
        ipTitle: '新增IP过滤信息',
        filterName: {}
      };
    } ,
    methods: {
      fmtLength(row, column){
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined ){
          return '—'
        } else {
          return arr
        }
      },
      //分页
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 0) {
          return 'th';
        }
        return '';
      },
      created() {
        this.total = this.tableData.length;
      },
      current_change(currentPage) {
        this.form.pageNum = currentPage;
        this.getCompanyList();
      },
      //通过id获取name
      getNamebyId(val) {
        var result = "";
        for (var i = 0; i < this.officeIdOps.length; i++) {
          if (val == this.officeIdOps[i].value) {
              result = this.officeIdOps[i].label;
          }
        }
        return result;
      },
      //数字转中文
      ifendcase(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined ){
          return '—'
        } else {
          return this.getNamebyId(arr)
        }

      },
      //条件搜索
      filterTag(value, row, column) {
        //const property = column['property'];
        //return row[property] === value;
      },
      //筛选事件
      filterChange(filters) {
        this.filterName = filterItems(filters, this.filterName);
        this.getCompanyList();
      },
      //所属机构
      getOfficeIds() {
        var that = this;
        getOfficeAll('').then(res => {
            var data = res.result.sysOffices;
            var temp = [], tempf = [];
            for (var i = 0 ; i < data.length; i++) {
                var d = {
                  value: data[i].officeId,
                  label: data[i].officeName
                }
                var f = {
                  value: data[i].officeId,
                  text: data[i].officeName
                }
                temp.push(d);
                tempf.push(f);
            }
            that.officeIdOps = temp;
            that.officeIdFilter = tempf;
        })
      },
      //新增
      add() {
        this.isAdd ='add';
        this.ipTitle = '新增IP过滤信息';
        this.IPForm = {
          officeId: '',
          startIp: '',
          endIp: ''
        }
        this.dialogFormVisible = true
      },
      addSave() {
        this.$refs.IPForm.validate(valid => {
           if (valid) {
              var param = this.IPForm;
              var that = this;
              addCompanyIP(param).then(res => {
                   this.$message({
                    message: '保存成功',
                    type: 'success'
                  });
                  that.$refs['IPForm'].resetFields();
                  that.dialogFormVisible = false;
                  this.currentPage = 1;
                  that.getCompanyList();
              })

           }
        })
      },
      edit(index, row) {
        this.isAdd = 'edit';
        this.ipTitle = '编辑IP过滤信息';
        this.IPForm = Object.assign({}, row)
        this.dialogFormVisible = true
      },
      /*editSave() {
        this.$refs.IPForm.validate(valid => {
           if (valid) {
              var param = this.IPForm;
              var that = this;
              addCompanyIP(param).then(res => {
                   this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  that.$refs['IPForm'].resetFields();
                  that.dialogFormVisible = false;
                  that.getCompanyList();
              })

           }
        })
      },*/
      //删除
      del(index, row) {
         var that = this;
         this.$confirm('确认删除该记录吗?', '提示', {
            type: 'warning'
          }).then(() => {
            const param = { id: row.id };
            delCompanyIP(param).then(res => {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.currentPage = 1;
              that.getCompanyList()
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '删除失败'
            });
          })
      },
      //条件查询
      searchItem() {
        this.currentPage = 1;
        this.getCompanyList();
      },
      //列表
      getCompanyList() {
        var that = this;
        var param = this.form;
        //param = Object.assign(this.filterName, param);
        for(var i in this.filterName) {
          param[i+'Q'] = this.filterName[i];
        }
        
        getCompanyIpPage(param).then(res => {
          var data = res.result.results;
          data == null ? that.tableData = [] : that.tableData = data;
          //that.created();
          that.total = res.result.totalCount;
          var vnode = this.$vnode;
          destroyCache(vnode);
        })
      }
    },
    mounted() {
      //获取列表
      this.getCompanyList();
      //获取所属机构
      this.getOfficeIds();
    }

  };
</script>
<style>
  .company_ip .el-dialog{
    width:355px;
  }
</style>
