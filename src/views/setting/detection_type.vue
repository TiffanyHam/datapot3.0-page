<template>
  <div class="title">
    <div class="filter-container">
      <!-- <el-row :gutter="20">
        <el-col :span="22">
          <div class="grid-content bg-purple">
            <el-form ref="form" :model="form">
              <el-form-item>
                <el-input v-model="form.name" placeholder="请输入类型名称"></el-input>
              </el-form-item>

               <el-form-item label="威胁阶段" class="fl">
               <el-select v-model="form.stageQ" placeholder="请选择威胁阶段">
                 <el-option v-for="item in stageSel" :key="item.value" :label="item.label" :value="item.value"/>
               </el-select>
             </el-form-item>

             <el-form-item label="威胁等级" class="fl">
               <el-select v-model="form.priorityQ" placeholder="请选择威胁等级">
                 <el-option v-for="item in prioritySel" :key="item.value" :label="item.label" :value="item.value"/>
               </el-select>
             </el-form-item>

              <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="getDetecList">查询</el-button>
              </el-form-item>

            </el-form>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple" style="text-align: right">
            <el-button type="primary" icon="el-icon-plus" @click="insert">新增</el-button>
          </div>
        </el-col>
      </el-row> -->

       <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" ref="form" :model="form">
            <el-form-item>
              <el-input placeholder="请输入类型名称" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click=" getDetecList ">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" icon="el-icon-plus" @click=" insert ">新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>
    </div>

    <el-container>
      <el-main>
        <el-table :data="tableList"
                  style="width: 100%" :height="tableHeight" class="threatType"  @filter-change="filterChange">
          <el-table-column width="50" type="index">
            <template scope="scope">
                <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="typeEn"
            :formatter="fmtLength"
            label="类型英文名"
            width="200"
            :show-overflow-tooltip="true">
            <!-- <template slot-scope="scope">
              <el-button type="text"  style="color: #4a88a5;" >{{ scope.row.typeEn }}</el-button>
            </template> -->
          </el-table-column>

          <el-table-column
            prop="typeZh"
            :formatter="fmtLength"
            label="类型中文名"
            width="200"
            :show-overflow-tooltip="true">
          </el-table-column>

          <el-table-column
            width="100"
            prop="stage"
            label="威胁阶段"
            :formatter="satgeFormat"
            :filter-multiple="isFalse"
            :filters="stageFilter"
            filter-placement="bottom-end"
            column-key="stage">
          </el-table-column>
          <!-- :filter-method="filterSatge" -->

          <el-table-column
            width="100"
            prop="priority"
            label="威胁等级"
            :filter-multiple="isFalse"
            :filters="priorityFilter"
            filter-placement="bottom-end"
            :formatter="priorityFormat"
            column-key="priority">
          </el-table-column>
          <!-- :filter-method="filterPriority" -->

          <el-table-column
            width="150"
            :formatter="fmtLength"
            prop="certaintyLHScore"
            label="可信度范围">
          </el-table-column>

          <el-table-column label="操作" align="center" class="btns">
            <template slot-scope="scope">
              <el-button type="text" class="btns"  @click="edit(scope.$index, scope.row)">修改</el-button>
              <el-button type="text" class="btns" @click='del(scope.$index, scope.row)'>删除</el-button>
              <!-- <el-button type="text" class="btns" @click='details(scope.$index, scope.row)'>详情</el-button> -->
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

        <!--<el-pagination layout="prev, pager, next,total" @current-change="current_change" :page-size="15" :total="total">
        </el-pagination>-->

      </el-main>
    </el-container>

    <!--新增、编辑弹窗-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"  :class="{'disableClass': isA}">
      <el-form :label-position="labelPosition"  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin: 0 auto;" :disabled="disabled">
        <el-form-item label="类型英文名" prop="typeEn">
          <el-input v-model="ruleForm.typeEn"></el-input>
        </el-form-item>
        <el-form-item label="类型中文名" prop="typeZh">
          <el-input v-model="ruleForm.typeZh"></el-input>
        </el-form-item>
        <el-form-item label="威胁阶段" prop="stage">
          <el-select v-model="ruleForm.stage" placeholder="请选择威胁阶段" style="width: 100%">
            <el-option
              v-for="item in stageSel"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="威胁等级" prop="priority">
          <el-select v-model="ruleForm.priority" placeholder="请选择威胁等级" style="width: 100%">
            <el-option
              v-for="item in prioritySel"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="威胁度范围" required>
          <el-col :span="11">
            <el-form-item prop="threatLowScore">
              <el-input v-model="ruleForm.threatLowScore"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center">至</el-col>
          <el-col :span="11">
            <el-form-item prop="threatHighScore">
              <el-input v-model="ruleForm.threatHighScore"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="可信度范围" required>
          <el-col :span="11">
            <el-form-item prop="certaintyLowScore">
              <el-input v-model="ruleForm.certaintyLowScore"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center">至</el-col>
          <el-col :span="11">
            <el-form-item prop="certaintyHighScore">
              <el-input v-model="ruleForm.certaintyHighScore"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button v-if="dialogStatus=='create'|| dialogStatus=='update'" @click.native="dialogFormVisible=false" class="btns_w">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" class="btns_w">确定</el-button>
        <el-button v-else-if="dialogStatus=='infos'" type="primary" @click="infoData" class="btns_w">确定</el-button>
        <el-button v-else type="primary" @click="updateData" class="btns_w">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import { getDetecListPage, getDetecConstant, addDetec, delDetec } from '../../api/setting/detec.js'
  import { isNum } from '../../utils/validate.js'
  import { destroyCache, filterItems } from '../../utils/deleCache.js'

  export default {
    data() {
      const isNumber = (rule, value, callback) => {
        if (!isNum(value)) {
          callback(new Error('请输入数字类型'))
        } else {
          callback()
        }
      }
      const numLength = (rule, value, callback) => {
        var le = value.toString().length;
        if (le > 20 || le < 1) {
          callback(new Error('长度在 1 到 20 个字符'))
        } else {
          callback()
        }
      }
      return {
        isA: false,
        disabled:false,
        isFalse: false,
        tableHeight: document.documentElement.clientHeight - 225,
        tableList: [],
        total: 0,
        pagesize:15,//每页的数据条数
        currentPage:1,//默认开始页面
        stageSel: [],
        prioritySel: [],
        stage: {},
        priority: {},
        stageFilter: [],
        priorityFilter: [],
        form: {
          name: '',
          priorityQ: '',
          stageQ: '',
          numPerPage: 15,
          pageNum: 1
        },
        dialogStatus: '',
        textMap: {
          update: '编辑威胁类型',
          create: '新增威胁类型',
          infos: '威胁类型详情'
        },
        dialogFormVisible: false,
        labelPosition: 'left',
        ruleForm: {
          typeEn: '',
          typeZh:'',
          stage: '',
          priority:'',
          threatLowScore:'',
          threatHighScore:'',
          certaintyLowScore:'',
          certaintyHighScore:''
        },
        rules: {
          typeEn: [
            { required: true, message: '请输入类型英文名', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          typeZh: [
            { required: true, message: '请输入类型中文名', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          stage: [
            { required: true, message: '请选择威胁阶段', trigger: 'change' }
          ],
          priority: [
            { required: true, message: '请选择威胁等级', trigger: 'change' }
          ],
          threatLowScore: [
            { required: true, message: '请输入威胁等级', trigger: 'blur' },
            { validator: isNumber, message: '请输入数字类型', trigger: 'blur'},
            { validator: numLength, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
          threatHighScore: [
            { required: true, message: '请输入威胁等级', trigger: 'blur' },
            { validator: isNumber, message: '请输入数字类型', trigger: 'blur'},
            { validator: numLength, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
          certaintyLowScore: [
            { required: true, message: '请输入威胁等级', trigger: 'blur' },
            { validator: isNumber, message: '请输入数字类型', trigger: 'blur'},
            { validator: numLength, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
          certaintyHighScore: [
            { required: true, message: '请输入威胁等级', trigger: 'blur' },
            { validator: isNumber, message: '请输入数字类型', trigger: 'blur'},
            { validator: numLength, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ]
        },
        filterName: {}
      }
    },
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
      tableRowClasstypeEn ({row, rowIndex}) {
        if (rowIndex === 0) {
          return 'th';
        }
        return '';
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getDetecList();
      },
      //威胁阶段数字转中文
      satgeFormat(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined ){
          return '—'
        } else {
          for (var i in this.stage) {
            if (arr == i) {
              return this.stage[i]
            }
          }
        }

      },
      //威胁等级数字转中文
      priorityFormat(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined ){
          return '—'
        } else {
          for (var i in this.priority) {
            if (arr == i) {
              return this.priority[i]
            }
          }
        }

      },
      //条件查询过滤
      /*filterSatge(value, row, column) {
        value = Number(value);
        const property = column['property'];
        return row[property] === value;
      },
      filterPriority(value, row, column) {
        value = Number(value);
        const property = column['property'];
        return row[property] === value;
      },*/
      //筛选事件
      filterChange(filters) {
         this.filterName = filterItems(filters, this.filterName);
         this.getDetecList();
      },
      //列表
      getDetecList () {
        const url = '/om/detection_type/query';
        var that = this;
        var param = {
          numPerPage: this.pagesize,
          pageNum: this.currentPage,
          name: this.form.name
        }
        //param = Object.assign(this.filterName, param);
        for(var i in this.filterName) {
          param[i+'Q'] = this.filterName[i];
        }
        getDetecListPage(param).then(res => {
          var list = res.result.results;
          for (var i in list) {
            list[i].certaintyLHScore = list[i].certaintyLowScore + '-'+ list[i].certaintyHighScore;
          }

          that.tableList = [];
          that.tableList = list;
          that.total = res.result.totalCount;
          //var vnode = this.$vnode;
          //destroyCache(vnode);
        });
      },
      // 显示编辑界面
      edit(index, row) {
        row.stage = row.stage.toString(); //保持类型一直
        row.priority = row.priority.toString();
        this.ruleForm = Object.assign({}, row) //数据填充
        this.isA = false
        this.disabled = false
        this.dialogStatus = 'update'
        this.dialogFormVisible = true //显示对话框
        if (this.$refs['ruleForm'] !== undefined) {
           this.$refs['ruleForm'].resetFields();//重置验证
        }

      },
      //显示详情界面
      details(index, row) {
        this.dialogStatus = 'infos'
        this.dialogFormVisible = true //显示对话框
        this.ruleForm = Object.assign({}, row)
        this.isA = true
        this.disabled = true

      },

      // 显示新增界面
      insert() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true //显示对话框
        this.isA = false
        this.disabled = false
        if (this.$refs['ruleForm'] !== undefined) {
           this.$refs['ruleForm'].resetFields();//重置验证
        }
        this.ruleForm = {
          typeEn: '',
          typeZh:'',
          stage: '',
          priority:'',
          threatLowScore:'',
          threatHighScore:'',
          certaintyLowScore:'',
          certaintyHighScore:''
        }
      },
      /*getZHNameId (name, arr) {
        for (var i in arr) {
          if (name == arr[i].label) {
            return arr[i].value;
          }
        }
      },*/
      // 编辑
      updateData(index, row) {

        this.$refs.ruleForm.validate(valid => {
          if (valid) {
          this.$confirm('确认提交吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: false
          }).then(() => {

           /* const arrZHPrio = this.prioritySel;
            const curNamePrio = this.ruleForm.priority;
            this.ruleForm.priority = this.getZHNameId(curNamePrio, arrZHPrio);

            const arrZHSatge = this.stageSel;
            const curNameSatge = this.ruleForm.stage;
            this.ruleForm.stage = this.getZHNameId(curNameSatge, arrZHSatge);
            const para = Object.assign({}, this.ruleForm);//接收多个参数
            const url = '/detection_type/save'*/
            addDetec(this.ruleForm).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
              this.$refs['ruleForm'].resetFields()//重置表单
              this.dialogFormVisible = false;
              this.currentPage = 1;
              this.getDetecList()

            })
          }).catch(() => {
            /*this.$message({
              type: 'info',
              message: '修改失败'
            });*/
          });
        }
        })
      },
      // 新增
      createData: function() {

        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: false
            }).then(() => {
              // this.ruleForm.id = (parseInt(Math.random() * 100)).toString() // mock a id
              //const para = Object.assign({}, this.ruleForm)//接收多个参数
              //const url = '/om/detection_type/save'
              addDetec(this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                });
                this.$refs['ruleForm'].resetFields()//重置表单
                this.dialogFormVisible = false;
                this.currentPage = 1;
                this.getDetecList()

              })
            }).catch(() => {

             /* this.$message({
                type: 'info',
                message: '新增失败'
              });*/
            });
          }
        })
      },
      //删除
      del (index, row) {

        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          const param = { id: row.id };
          //const url = '/detection_type/delete';
          delDetec(param).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.currentPage = 1;
            this.getDetecList()
          })
        }).catch(() => {
          /*this.$message({
            type: 'info',
            message: '删除失败'
          });*/
        })

      },
      infos () {},
      infoData: function() {
        this.dialogFormVisible = false
      },
      //获取常量
      getDetecCon() {
          var that = this;
          getDetecConstant().then(res => {
              that.stage = res.result.stage;
              that.priority = res.result.priority;
              //填充stage
              for (var i in that.stage) {
                that.stageFilter.push({
                     value: i,
                     text: that.stage[i]
                });
                that.stageSel.push({
                     value: i,
                     label: that.stage[i]
                });
              }
              //填充priority
              for (var i in that.priority) {
                that.priorityFilter.push({
                     value: i,
                     text: that.priority[i]
                });
                that.prioritySel.push({
                     value: i,
                     label: that.priority[i]
                });
              }
          })
      }
    },
    mounted() {
      //获取列表
      this.getDetecList();

      //获取常量
      this.getDetecCon();
    }

  }
</script>

<style>

  button.btns_w {
    padding: 7px 25px;
  }
  .threatType .el-button{
    padding:7px 0px;
  }
</style>
