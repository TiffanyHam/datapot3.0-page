<template>
  <div class="title">
    <div class="filter-container">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="paraForm" ref="paraForm">
          <el-form-item>
            <el-input v-model="paraForm.userName" placeholder="请输入用户名名称" style="width:180px;"></el-input>
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
            style="width: 100%"
            :height="tableHeight" @filter-change="filterTag">
            <el-table-column width="50" type="index" :index="indexMethod"></el-table-column>

            <el-table-column
              prop="actualName"
              :formatter="fmtLength"
              label="员工姓名">
              <template slot-scope="scope">
                <el-button type="text"  style="color: #4a88a5;padding: 0" @click="edit(scope.$index, scope.row)" >{{ scope.row.actualName }}</el-button>
              </template>
            </el-table-column>

            <el-table-column
              prop="userName"
              :formatter="fmtLength"
              label="用户">
            </el-table-column>

            <el-table-column
              prop="accountStatus"
              label="帐号状态"
              width="110"
              column-key="accountStatus" 
              :filter-multiple="isFalse"
              :filters="accountStatusFilter"
              :formatter="ifendcaseStatus" 
            >
            </el-table-column>
            <!-- :filter-method="filterTag" -->

            <el-table-column
              prop="groupId"
              label="角色"
              width="100"
              column-key="groupId" 
              :filter-multiple="isFalse"
              :filters="groupIdFilter"
              :formatter="ifendGroupId">
            </el-table-column>
            <!-- :filter-method="filterTag" -->

            <el-table-column
              prop="isAdmin"
              align="center"
              label="是否主管"
              width="80"
              :formatter="ifendcaseAdmin"
            >
            </el-table-column>

            <el-table-column
              prop="accessSys"
              label="可访问系统"
              column-key="accessSys" 
              :filter-multiple="isFalse"
              :filters="accessSysFilter"
              :formatter="ifendcaseSys"
            >
            </el-table-column>
            <!-- :filter-method="filterTag" -->

            <el-table-column
              prop="officeId"
              label="所属分支机构"
              column-key="officeId" 
              :filter-multiple="isFalse"
              :filters="classIdFilter"
              :formatter="ifendcaseOps"
              >
            </el-table-column>
            <!-- :filter-method="filterTag"-->

            <el-table-column
              prop="lastLogDate"
              :formatter="fmtLength"
              width="150"
              label="最近登陆时间">
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" class="btns" @click='del(scope.$index, scope.row)'>删除</el-button>
                <el-button type="text" class="btns" @click='updatePwd(scope.$index, scope.row)'>修改密码</el-button>
              </template>

            </el-table-column>

          </el-table>
          <el-pagination
            @current-change="handleCurrentChange"
            background
            layout="prev, pager, next,total"
            :page-size="pagesize"
            :current-page="currentPage"
            :total="total">
          </el-pagination>
        </el-main>
      </el-container>

      <!--修改密码-->
      <el-dialog title="修改密码" :visible.sync="pwdDialogFormVisible" class="pwdDialog">
        <el-form :label-position="labelPosition"  :model="pwdForm" ref="pwdForm" :rules="rules2" label-width="100px" class="demo-ruleForm" style="margin: 0 auto;">
          <el-form-item label="输入密码" prop="loginPwd">
            <el-input type="password"  v-model="pwdForm.loginPwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="conPassword">
            <el-input type="password" v-model="pwdForm.conPassword" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="info" @click.native="pwdDialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </div>
      </el-dialog>
      <!--新增、编辑弹窗-->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="account" @close="closeForm">
        <el-form :label-position="labelPosition"  :model="form" ref="form" :rules="rules" label-width="100px" class="demo-ruleForm" style="margin: 0 auto;" :disabled="disabled">

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="员工姓名:" prop="actualName">
                <el-input v-model="form.actualName"></el-input>
              </el-form-item>
              <div v-if="dialogStatus =='create'">
                <el-form-item label="密码:" prop="loginPwd">
                  <el-input type="password" v-model="form.loginPwd" autocomplete="off"></el-input>
                </el-form-item>
              </div>
              <el-form-item label="用户状态" prop="accountStatus">
                <el-select v-model="form.accountStatus" placeholder="请选择用户状态" style="width: 100%">
                  <el-option
                    v-for="item in accountStatusOps"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否主管人员" prop="isAdmin">
                <el-select v-model="form.isAdmin" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in IsAdminOps"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="可访问系统" prop="accessSys">
                <el-select v-model="form.accessSys" placeholder="请选择可访问系统" style="width: 100%">
                  <el-option
                    v-for="item in accessSysOps"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

            </el-col>
            <el-col :span="12">
              <el-form-item label="登录用户名:" prop="userName">
                <el-input v-model="form.userName"></el-input>
              </el-form-item>
              <div v-if="dialogStatus =='create'">
                <el-form-item label="确认密码:" prop="conPassword">
                  <el-input type="password" v-model="form.conPassword" autocomplete="off"></el-input>
                </el-form-item>
              </div>
              <el-form-item label="角色" prop="groupId">
                <el-select v-model="form.groupId" placeholder="请选择角色" style="width: 100%">
                  <el-option
                    v-for="item in groupIdOps"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属分支机构" prop="officeId">
                <el-select v-model="form.officeId" placeholder="请选择分支机构" style="width: 100%">
                  <el-option
                    v-for="item in classIdOps"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

            </el-col>
          </el-row>

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
  import { getUserPage,getUserInsert,getUserDel,getOfficeIdAll,getConstantsAll,getGroupAll,getUserPwd} from '../../api/manage/user_account.js'
  import { destroyCache, filterItems } from '../../utils/deleCache.js'
  import { encryptByDES } from '../../utils/deleCache.js'

  export default {
    data() {
      //修改密码
      var validateLoginPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.pwdForm.conPassword !== '') {
            this.$refs.pwdForm.validateField('conPassword');
          }
          callback();
        }
      }
      var validateConPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.pwdForm.loginPwd) {
          callback(new Error('密码输入不一致，请重新输入!'));
        } else {
          callback();
        }
      };

      //新增
      var validateLogin = (rule, value, callback) => {

        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.form.conPassword !== '') {
            this.$refs.form.validateField('conPassword');
          }
          callback();
        }
      }
      var validateCon = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.loginPwd) {
          callback(new Error('密码输入不一致，请重新输入!'));
        } else {
          callback();
        }
      };

      return {
        tableHeight: document.documentElement.clientHeight - 215,
        total: 0,//默认数据总数
        pagesize:15,//每页的数据条数
        currentPage:1,//默认开始页面
        istag: true,
        isFalse: false,
        classIdFilter: [],
        classIdOps:[],
        accessSysFilter: [{
          value:'2',
          text:'后台运维系统'
        }, {
          value:'3',
          text:'态势感知平台'
        }],
        accessSysOps: [{
          value:'1',
          label:'全部'
        },{
          value:'2',
          label:'后台运维系统'
        }, {
          value:'3',
          label:'态势感知平台'
        }],
        accountStatusFilter: [],
        accountStatusOps:[],
        IsAdminOps:[],
        groupIdOps:[],
        groupIdFilter: [],
        input:"",
        labelPosition: 'left',
        dialogFormVisible: false,
        pwdDialogFormVisible: false,
        disabled:false,
        loading: true,//加载
        paraForm: {
          userName:''
        },
        pwdForm:{
          userId:'',
          userName:'',
          loginPwd:'',
          conPassword:'',
        },
        sendForm:{
          userName:'',
          loginPwd:'',
          conPassword:'',
        },
        form: {
          actualName: '',
          loginPwd:'',
          userName: '',
          conPassword:'',
          accountStatus:'',
          isAdmin: '',
          groupId:'',
          officeId:'',
          accessSys:''
        },
        rules2:{
          loginPwd: [
            { required: true,validator: validateLoginPwd, trigger: 'blur' },
            { min: 6, max: 18, message: '密码长度不少于6位且不能大于18位', trigger: 'blur' }
          ],
          conPassword: [
            { required: true,validator: validateConPwd, trigger: 'blur' },
            { min: 6, max: 18, message: '密码长度不少于6位且不能大于18位', trigger: 'blur' }
          ],
        },
        rules: {
          actualName: [
            { required: true, message: '员工姓名不能为空！', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          loginPwd: [
            { required: true,validator: validateLogin,trigger: 'blur' },
            { min: 6, max: 18, message: '密码长度不少于6位且不能大于18位', trigger: 'blur' }
          ],
          conPassword: [
            { required: true,validator: validateCon, trigger: 'blur' },
            { min: 6, max: 18, message: '密码长度不少于6位且不能大于18位', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '用户名不能为空！', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],

          accountStatus: [
            { required: true, message: '请选择用户状态！', trigger: 'change' }
          ],
          isAdmin: [
            { required: true, message: '请选择主管人员！', trigger: 'change' }
          ],
          groupId: [
            { required: true, message: '请选择角色！', trigger: 'change' }
          ],
          officeId: [
            { required: true, message: '请选择所属分支机构！', trigger: 'change' }
          ],
          accessSys: [
            { required: true, message: '请选择可访问系统！', trigger: 'change' }
          ]

        },
        dialogStatus: '',
        textMap: {
          update: '修改用户信息',
          create: '新增用户信息',
        },
        tableList: [],
        filterName: {},
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
        this.loading = true;
        this.currentPage = 1
        this.getUserList()
      },
      //列表
      getUserList() {
        let that = this;
        let para = {
          'userName':this.paraForm.userName,
          'pageNum': this.currentPage,
          'numPerPage':this.pagesize
        }
        //合并对象
        //para = Object.assign(this.filterName, para);
        for(var i in this.filterName) {
          para[''+i] = this.filterName[i];
        }
        getUserPage(para).then(res => {
          this.loading = false;
          let data = res.result.results;
          that.total = res.result.totalCount;
          // that.pagesize = res.result.numPerPage
          // that.currentPage = res.result.pageNum
          for(let i in data){
            if (data[i].lastLogDate) {
              let time = data[i].lastLogDate;
              data[i].lastLogDate = time.slice(0,time.indexOf("."));//去掉时间后面的毫秒
            }
          }

          data == null ? this.tableList = [] : this.tableList = data;
          //var vnode = this.$vnode;
          //destroyCache(vnode);
        })
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getUserList()
      },
      //列表序号
      indexMethod (index) {
        return (((this.currentPage-1)*this.pagesize)+(index+1));
      },
      // 显示编辑界面
      edit(index, row) {
        //保持类型一致
        row.isAdmin = row.isAdmin.toString();
        row.accountStatus = row.accountStatus.toString();
        row.accessSys = row.accessSys.toString();
        row.groupId = Number(row.groupId);
        this.dialogStatus = 'update'
        this.dialogFormVisible = true //显示对话框
        this.form = Object.assign({}, row)
      },
      // 编辑
      updateData(index, row) {
        this.$refs.form.validate(valid => {if (valid) {
          this.$confirm('确认提交吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: false
          }).then(() => {
            const para = Object.assign({}, this.form);//接收多个参数
            getUserInsert(para).then(res => {

              this.$message({
                type: 'success',
                message: '成功修改信息!'
              });
              this.$refs['form'].resetFields()//重置表单
              this.dialogFormVisible = false
              this.getUserList()

            })
          }).catch(() => {
          });
        }
        })
      },
      // 显示新增界面
      insert() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true //显示对话框
        this.form = {
          actualName: '',
          loginPwd:'',
          userName: '',
          conPassword:'',
          accountStatus:'',
          isAdmin: '',
          groupId:'',
          officeId:'',
          accessSys:'',
        }
      },
      // 新增
      createData: function() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: false
            }).then(() => {
              const para = Object.assign({}, this.form)//接收多个参数
              getUserInsert(para).then(res => {
                this.$message({
                  type: 'success',
                  message: '成功新增用户!'
                });
                this.$refs['form'].resetFields()//重置表单
                this.dialogFormVisible = false
                this.getUserList()

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

      //修改密码
      updatePwd(index, row){
        this.pwdDialogFormVisible = true
        //this.pwdForm = Object.assign({}, row)
        this.pwdForm.userId = row.userId
        this.pwdForm.userName = row.userName
      },
      //提交
      submitForm(){
        this.$refs.pwdForm.validate(valid => {
          if (valid) {
            this.sendForm.userName = encryptByDES(this.pwdForm.userName);
            this.sendForm.loginPwd = encryptByDES(this.pwdForm.loginPwd);
            this.sendForm.conPassword = encryptByDES(this.pwdForm.conPassword);
            const para ={
              'userId': this.pwdForm.userId,
              'userName': this.sendForm.userName,
              'loginPwd': this.sendForm.loginPwd,
              'conPassword': this.sendForm.conPassword
            }
            getUserPwd(para).then(res => {

              this.$message({
                type: 'success',
                message: '密码修改成功!'
              });
              this.$refs['pwdForm'].resetFields()//重置表单
              this.pwdDialogFormVisible = false
              this.getUserList()
            })
          }else {
            /* this.$message({
               type: 'info',
               message: '密码修改失败'
             });*/
            return false;
          };
        })
      },
      //删除
      del (index, row) {
        this.$confirm('确认删除?', '提示', {
          type: 'warning'
        }).then(() => {

          const param = { userId: row.userId };
          getUserDel(param).then(res => {

            this.$message({
              message: '已删除账户',
              type: 'success'
            })
            this.getUserList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除！'
          });
        })
      },
      //分支机构
      getOfficeId(){

        let that = this;//将当前的this对象复制一份到that变量中
        getOfficeIdAll('').then(res => {

          let classtypeArr = res.result.sysOffices;
          let temp = [], tempf = [];

          for (var i in classtypeArr) {
            var d = {
              value: classtypeArr[i].officeId,
              label: classtypeArr[i].officeName
            }
            var f = {
              value: classtypeArr[i].officeId,
              text: classtypeArr[i].officeName
            }
            temp.push(d);
            tempf.push(f);
          }
          that.classIdOps = temp;
          that.classIdFilter = tempf;

        });
      },

      //可访问系统、用户状态、是否主管
      getSystem(){
        let that = this;//将当前的this对象复制一份到that变量中
        getConstantsAll('').then(res => {
          // let accessSysArr = res.result.accessSys;//可访问系统
          let accountStatusArr = res.result.accountStatus;//用户状态
          let boolStatusArr = res.result.boolStatus;//是否主管

          let temp = [], tempf = [],tempd=[],temps=[],sta=[]
          /*for (var x in accessSysArr) {

              var d = {
                value: x,
                label: accessSysArr[x]
              }
              var f = {
                value: x,
                text: accessSysArr[x]
              }
            temp.push(d);
            tempf.push(f);
          }

            that.accessSysOps = temp;
            that.accessSysFilter = tempf;*/

          //用户状态
          for (var y in accountStatusArr) {
            var a = {
              value: y,
              label: accountStatusArr[y]
            }
            var b = {
              value: y,
              text: accountStatusArr[y]
            }
            tempd.push(a);
            temps.push(b);
          }
          that.accountStatusOps = tempd;
          that.accountStatusFilter = temps;
          //是否主管
          for (var y in boolStatusArr) {
            var a = {
              value: y,
              label: boolStatusArr[y]
            }
            sta.push(a);
          }
          that.IsAdminOps = sta;


        });
      },
      //角色
      getGroupsId(){
        let that = this;//将当前的this对象复制一份到that变量中
        getGroupAll('').then(res => {
          let groupIdArr = res.result;//角色
          let group = [],groupIs = [];

          for (let y = 0;y< groupIdArr.length;y++) {
            var a = {
              value: groupIdArr[y].groupId,
              label: groupIdArr[y].groupName
            }
            var b = {
              value: groupIdArr[y].groupId,
              text: groupIdArr[y].groupName
            }
            group.push(a);
            groupIs.push(b);
          }
          that.groupIdOps = group;
          that.groupIdFilter = groupIs;

        });
      },

      //通过id获取name
      getNamebyIdOps(val) {
        var result = "";
        //分支机构
        for (var i = 0; i < this.classIdOps.length; i++) {
          if (val == this.classIdOps[i].value) {
            result = this.classIdOps[i].label;
          }
        }
        return result;
      },
      getNamebyIdStatus(val) {
        var result = "";
        //用户状态
        for (var y = 0; y < this.accountStatusOps.length;y++) {
          if (val == this.accountStatusOps[y].value) {
            result = this.accountStatusOps[y].label;
          }
        }
        return result;
      },

      getNamebyIdSys(val) {
        var result = "";
        //可访问系统
        for (var x = 0; x < this.accessSysOps.length; x++) {
          if (val == this.accessSysOps[x].value) {
            result = this.accessSysOps[x].label;
          }
        }
        return result;
      },

      getNameIsAdmin(val) {
        var result = "";
        //是否
        for (var x = 0; x < this.IsAdminOps.length; x++) {
          if (val == this.IsAdminOps[x].value) {
            result = this.IsAdminOps[x].label;
          }
        }
        return result;
      },
      getGroupId(val) {
        var result = "";
        //角色
        for (var x = 0; x < this.groupIdOps.length; x++) {
          if (val == this.groupIdOps[x].value) {
            result = this.groupIdOps[x].label;
          }
        }
        return result;
      },
      //数字转中文
      ifendcaseOps(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          return this.getNamebyIdOps(arr)
        }
      },
      ifendcaseStatus(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          return this.getNamebyIdStatus(arr)
        }
      },
      ifendcaseSys(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        }else if(arr === 1){
          return '全部'
        } else {
          return this.getNamebyIdSys(arr)
        }
      },
      ifendcaseAdmin(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          return this.getNameIsAdmin(arr)
        }
      },
      ifendGroupId(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          return this.getGroupId(arr)
        }
      },

      //下拉筛选事件
      /*filterTag(value, row, column) {
        value = Number(value);
        const property = column['property'];
        return row[property] === value;*/
      
      filterTag(filters) {

        this.filterName = filterItems(filters, this.filterName);
        this.getUserList();
        /*for(var i in filters) {
          var name = i;
          var status = false; //是否存在当前对象属性

          for(var j in this.filterName) {
            if (j == name) {
              status = true;
              filters[i][0] == undefined? this.filterName[j] = '' : this.filterName[j] = filters[i][0];
            }
          }

          if (status === false) {
            this.filterName[name] = filters[i][0];
          }

          this.getUserList();
          }
          */

          /*if (filters[i][0] != undefined) {
            this.filterValue = filters[i][0]
            this.filterName = name;
            //this.tableList = this.tableList.filter( item => { return item[name] == value });
            //this.total = this.tableList.length;
          }*/
        

      },
    },
    mounted() {
      this.getUserList();
      this.getOfficeId();
      this.getSystem();
      this.getGroupsId();
    }
  };
</script>
<style>
  .account .el-dialog .el-form--label-left .el-form-item__label {
    width: 120px!important;
  }
  .account .el-dialog .el-form-item__content {
    margin-left: 120px!important;
  }
  .pwdDialog .el-dialog  {
    width: 27%;
  }
  .el-table-filter{
    overflow-y: auto;
    max-height: 500px;
  }
</style>
