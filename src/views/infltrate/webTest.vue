<template>
  <div class="pageOverflow">
  <div class="title company_ip infomation" style="overflow: auto;padding:10px 0;">
    <section class="app-container" ref="threatInfo">
      <el-row>
        <el-col :span="24">
            <el-tabs v-model="activeName" @tab-click="handleClick"  class="asset">
              <el-tab-pane label="目标管理" name="first">
                <div class="web-pad">
                    <el-row>
                     <el-col :span="24">
                       <div class="fl">
                          <el-button type="primary" @click="targetScan(1, multipleSelection)">立即扫描</el-button>
                          <el-button type="success" @click="openAddTragt(1)" >新增目标</el-button>
                          <el-button type="warning" @click="deleTraget(1, multipleSelection)">删除目标</el-button>
                        </div>
                        <div class="fr">
                          <el-form :inline="true" ref="webtForm" :model="webtForm">
                            <el-form-item>
                              <el-input placeholder="请输入URL" v-model="webtForm.name"></el-input>
                            </el-form-item>
                            <el-form-item>
                              <el-button type="primary" icon="el-icon-search" @click="webtFormSearch">查询</el-button>
                            </el-form-item>
                          </el-form>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                          <el-table
                            :data="tableData"
                            style="width: 100%;margin-top:10px;" 
                            :default-sort = "{prop: '', order: ''}" @selection-change="handleSelectionChange">
                            <el-table-column
                              prop="" width="50"
                              label="#">
                              <template scope="scope">
                                <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
                              </template>
                            </el-table-column>

                             <el-table-column
                                type="selection"
                                width="30">
                              </el-table-column>

                            <el-table-column
                              prop="address"
                              label="URL" 
                              :formatter="fmtLength" 
                              :show-overflow-tooltip="true">
                              <template scope="scope">
                                <el-button type="text" class="pmNone" @click="openAddTragt(2, scope.row)">{{scope.row.address}}</el-button>
                              </template>
                            </el-table-column>

                             <el-table-column
                              prop="description"
                              label="描述" 
                              :formatter="fmtLength" 
                              width="150" 
                              :show-overflow-tooltip="true">
                            </el-table-column>

                            <el-table-column
                              prop="addTime"
                              label="创建时间" 
                              width="150">
                              <template scope="scope">
                                <span>{{scope.row.addTime?scope.row.addTime.split('.')[0]:'—'}}</span>
                              </template>
                            </el-table-column>

                            <el-table-column
                              prop="lastScanTime"
                              label="最近扫描时间" 
                              width="150">
                              <template scope="scope">
                                <span>{{scope.row.lastScanTime?scope.row.lastScanTime.split('.')[0]:'—'}}</span>
                              </template>
                            </el-table-column>

                            <el-table-column
                              prop="lastScanStatus"
                              label="扫描状态" 
                              :formatter="fmtLength" 
                              width="100">
                              <template scope="scope">
                                  <span>{{getScanStatus(scope.row.lastScanStatus)}}</span>
                              </template>
                            </el-table-column>

                            <el-table-column
                              prop="severityCounts"
                              label="风险等级" 
                              width="200">
                              <template scope="scope">
                                 <span :class="'severityC_'+index" v-for="(value,index) in scope.row.severityCounts">
                                    <router-link :to="{name:'infiltrate-wHole', params: { 'wInfo': scope.row,'wType':'1', 'severity':index } }" class="w-h-link" style="color:#fff;padding:0;">{{value}}
                                    </router-link>
                                 </span>
                                 <span v-if="scope.row.severityCounts==null">{{'—'}}</span>
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
                      </el-col>
                    </el-row>


                    


                </div>
              </el-tab-pane>
              <el-tab-pane label="扫描任务" name="second">
                  <div class="web-pad">
                    <el-row>
                       <el-col :span="12">
                            <el-button type="primary" @click="targetScan(2, multipleSelection2)">重新扫描</el-button>
                            <el-button type="warning"  @click="deleTraget(2, multipleSelection2)">删除目标</el-button>
                      </el-col>
                      <el-col :span="12">
                        <div class="fr">
                        <el-form :inline="true" ref="webcForm" :model="webcForm">
                          <el-form-item>
                            <el-input placeholder="请输入URL" v-model="webcForm.name"></el-input>
                          </el-form-item>
                          <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="webcFormSearch">查询</el-button>
                          </el-form-item>
                        </el-form>
                        </div>
                      </el-col>
                  </el-row>
                   <el-row>
                      <el-col :span="24">
                          <el-table
                            :data="tableData2"
                            style="width: 100%;margin-top:10px;" 
                            :default-sort = "{prop: '', order: ''}" @selection-change="handleSelectionChange2">
                            <el-table-column
                              prop="" width="50"
                              label="#">
                              <template scope="scope">
                                <span>{{ pagesize2 * (currentPage2 - 1)  + 1 + scope.$index  }}</span>
                              </template>
                            </el-table-column>

                             <el-table-column
                                type="selection"
                                width="30">
                              </el-table-column>

                            <el-table-column
                              prop="address"
                              label="URL" 
                              :formatter="fmtLength" 
                              :show-overflow-tooltip="true">
                              <template scope="scope">
                                <el-button type="text" class="pmNone" @click="openAddTragt(2, scope.row)">{{scope.row.address}}</el-button>
                              </template>
                            </el-table-column>

                            <el-table-column
                              prop="startTime"
                              label="开始时间" 
                              width="150">
                              <template scope="scope">
                                <span>{{scope.row.startTime?scope.row.startTime.split('.')[0]:'—'}}</span>
                              </template>
                            </el-table-column>

                            <el-table-column
                              prop="endTime"
                              label="结束时间" 
                              width="150">
                              <template scope="scope">
                                <span>{{scope.row.endTime?scope.row.endTime.split('.')[0]: '—'}}</span>
                              </template>
                            </el-table-column>

                            <el-table-column
                              prop="status"
                              label="扫描状态" 
                              :formatter="fmtLength" 
                              width="100">
                              <template scope="scope">
                                  <span v-if="scope.row.status=='processing'">扫描中..
                                    <a href="javascript:;" class="linkScaning" title="停止扫描"  v-show="stopBtn"><i class="el-icon-close" style="margin-bottom:-4px;" @click="stopScanProc(scope.row)"></i></a>
                                  </span>
                                  <span v-else>{{getScanStatus(scope.row.status)}}</span>
                              </template>
                            </el-table-column>

                            <el-table-column
                              prop="severityCounts"
                              label="风险等级" 
                              width="200">
                              <template scope="scope">
                                 <a href="javascript:;" :class="'severityC_'+index" v-for="(value,index) in scope.row.severityCounts">
                                    <router-link :to="{name:'infiltrate-wHole', params: { 'wInfo': scope.row,'wType':'2', 'severity':index  } }" class="w-h-link" style="color:#fff;padding:0;">{{value}}
                                    </router-link>
                                 </a>
                                 <span v-if="scope.row.severityCounts==null">{{'—'}}</span>
                              </template>
                            </el-table-column>

                            <el-table-column
                              prop=""
                              label="操作">
                              <template scope="scope">
                                <!-- <el-button type="text" class="pmNone" @click="linkReports(scope.row)">查看报告</el-button> -->
                                <router-link :to="{name:'infiltrate-wInfo', params: { reports: scope.row }}"
                               class="pmNone" style="color:#409EFF;padding:0;">查看报告</router-link>
                              </template>
                            </el-table-column>
                        </el-table>
                         <el-pagination class="fy"
                           layout="prev, pager, next,total"
                           :current-page.sync = "currentPage2"
                           @current-change="current_change2"
                           :total="total2" :page-size="pagesize2"
                           background
                          >
                          </el-pagination>
                      </el-col>
                    </el-row>
                </div>
              </el-tab-pane>
            </el-tabs>
        </el-col>
      </el-row>



      <!--新增目标-->
      <el-dialog :title="targetTitle" :visible.sync="dialogTragtFormVisible" width="450px">
      <el-form :model="domainNameForm"  :rules="domainNameRules" ref="domainNameForm" label-width="80px">
        <el-form-item label="URL" prop="address">
          <el-input v-model="domainNameForm.address" :disabled="isUpdate"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="domainNameForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer"  style="text-align: center">
        <el-button @click=" dialogTragtFormVisible = false ">取 消</el-button>
        <el-button type="primary" v-if="isUpdate==false" @click="addTragt">确 定</el-button>
        <el-button type="primary" v-else @click="updateTragt">确 定</el-button>
      </div>
    </el-dialog>

    </section>
  </div>
</div>
</template>

<script>
import { checkURLAddr } from '../../utils/validate.js'
import { addTarget, updTarget, targetList, sancanList, scanTarget, removeTarget, stopScan } from '../../api/infltrate/infltrate.js'

export default{
  data() {
    return {
      activeName: 'first',
      routerParam: '',
      webtForm: {
        name: ''
      },
      webcForm: {
        name: ''
      },
      vulnLevel: {'medium': 2, 'low': 1, 'high': 3, 'info': 0}, //风险等级常量
      //新增目标
      targetTitle:'新增目标',
      isUpdate: false,
      dialogTragtFormVisible: false,
      updateId: '',
      domainNameRules: {},
      domainNameForm: {
        address: '',
        description: ''
      },

      //目标
      tableData: [],
      currentPage: 1,
      pagesize: 15,
      total: 0,

      //任务
      tableData2: [],
      currentPage2: 1,
      pagesize2: 15,
      total2: 0,
      scanStatusTime: '',
      scanStatusArr: '',

      //扫描
      targetIdList: '',
      multipleSelection: [],
      multipleSelection2: [],
      stopBtn: true,
    }
  },
  methods: {
    handleClick() {

    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSelectionChange2(val) {
      this.multipleSelection2 = val;
    },
    current_change(val) {
      this.currentPage = val;
      this.getTestList();
    },
    current_change2(val) {
      this.currentPage2 = val;
      this.getScanList();
    },
    fmtLength(row, column){
      const arr = row[column.property]
      if(arr === null || arr === '' || arr === undefined){
        return '—'
      } else {
        return arr
      }
    },
    getScanStatus(status) {


      var result = "—";
      switch(status) {
        case 'aborted':
          result = '终止'
          break;
        case 'aborting':
          result = '终止'
          break;
        case 'scheduled':
          result = '等待'
          break;
        case 'starting':
          result = '开始扫描'
          break;
        case 'failed':
          result = '失败'
          break;
        case 'completed':
          result = '完成'
          break;
        case 'wait':
          result = '等待'
          break;
        case 'queue':
          result = '等待'
          break;
        case 'queued':
          result = '等待'
          break;
        case 'processing':
          result = '扫描中'
          break;

      }
      return result;
    },
    //查询
    webtFormSearch() {
      this.getTestList();
    },
    webcFormSearch() {
      this.getScanList();
    },
    //查看报告
    /*linkReports(row) {
      this.$router.push({name:''})
    },*/
    //新增、修改
    openAddTragt(num, row) {
       if (this.$refs['domainNameForm'] !== undefined) {
          this.$refs['domainNameForm'].resetFields();//重置验证
       }
       if(num == 2) {
         this.targetTitle = '修改目标';
         this.isUpdate = true;
         this.domainNameForm = Object.assign({}, row) //数据填充
         this.updateId = row.id;
       } else {
         this.targetTitle = '新增目标';
         this.isUpdate = false;
         this.domainNameForm.address = '';
         this.domainNameForm.description = '';
       }
       this.dialogTragtFormVisible = true;
    },
    addTragt() {
        
        if (!checkURLAddr(this.domainNameForm.address)) {
          this.$message({
                type: 'warning',
                message: '请输入合法的URL'
              })
          return false;
        }

        var that = this;
        var param = {
          'address': this.domainNameForm.address,
          'criticality': '10',
          'description': this.domainNameForm.description
        }
        addTarget(param).then(res => {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.dialogTragtFormVisible = false;
            //目标管理列表
            this.getTestList();
            //扫描任务列表
            this.getScanList();
        })
    },
    updateTragt() {
        var that = this;
        var param = {
          'id': this.updateId,
          'address': this.domainNameForm.address,
          'description': this.domainNameForm.description
        }
        updTarget(param).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.dialogTragtFormVisible = false;
            //目标管理列表
            this.getTestList();
            //扫描任务列表
            this.getScanList();
        })
    },
    //删除目标
    deleTraget(num, val) {
        if(val.length > 0) {
           var that = this;
           this.$confirm('确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: false
          }).then(() => {
              debugger
              var targetIds = '';
              for(var i = 0; i < val.length; i++) {
                if (val.length == 1 || i == (val.length-1)) {
                  if (num == 1) {
                    targetIds += val[i].targetId;//删除目标
                  } else {
                    targetIds += val[i].id;//删除扫描任务
                  }
                } else {
                  if (num == 1) {
                    targetIds += val[i].targetId+',';//删除目标
                  } else {
                    targetIds += val[i].id+',';//删除扫描任务
                  }
                }
                
              }
              //参数
              var param = {};
              if(num == 1) {
                //目标
                param = {'targetIdList': targetIds}
              } else{
                //任务
                param = {'id': targetIds}
              }

              removeTarget(param).then(res => {
                  this.$message({
                    type: 'success',
                    message: '删除成功'
                  })
                  //目标管理列表
                  this.getTestList();
                  //扫描任务列表
                  this.getScanList();
              })
          })

        } else {
          this.$message({
            type: 'warning',
            message: '请选择需要删除的目标'
          })
        }
    },
    //终止扫描任务
    stopScanProc(row) {
      this.$confirm('您将结束扫描，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: false
          }).then(() => {
              var that = this;
              var param = {
                'scanId': row.scanId
              }
              stopScan(param).then(res => {
                this.$message({
                  type: 'success',
                  message: '正在停止扫描，请稍后..'
                })
                that.stopBtn = false;
                window.setTimeout(function() {
                  //扫描任务列表
                  this.getScanList();
                }, 1000)
                
              })
          })
    },
    //目标列表
    getTestList() {
      var that = this;
      var param = {
        'pageSize': this.pagesize,
        'pageNo': this.currentPage,
        'condition': this.webtForm.name
      }
      targetList(param).then(res => {
        that.tableData = res.result.results;
        that.total = res.result.totalCount;
        
        //json字符串转对象
        for(var i in that.tableData) {
          if(that.tableData[i].severityCounts) {
            var str = that.tableData[i].severityCounts
            var obj = eval('(' + str + ')');
            that.tableData[i].severityCounts = obj;
          }
        }

      })
    },
    //扫描列表
    getScanList() {
      var that = this;
      var param = {
        'pageSize': this.pagesize2,
        'pageNo': this.currentPage2,
        'condition': this.webcForm.name
      }
      sancanList(param).then(res => {
        that.tableData2 = [];
        that.tableData2 = res.result.results;
        that.total2 = res.result.totalCount;

        //json字符串转对象
        for(var i in that.tableData2){
          if(that.tableData2[i].severityCounts) {
            var str = that.tableData2[i].severityCounts
            var obj = eval('(' + str + ')');
            that.tableData2[i].severityCounts = obj
          }
        }

        //关闭定时任务
        var count = 0;
        //if (that.scanStatusArr != "") {
          for (var i in that.tableData2) {
            if (that.tableData2[i].status == 'aborted' || that.tableData2[i].status == 'aborting' || that.tableData2[i].status == 'failed' || that.tableData2[i].status == 'completed') {
              count ++;
            }
          }
        //}
        if (count == that.tableData2.length){
          window.clearInterval(that.scanStatusTime);
          that.scanStatusTime == '';
          //目标管理列表
          this.getTestList();
        } else {
          if (that.scanStatusTime == '') {
            //开启定时任务
            window.clearInterval(that.scanStatusTime);
            that.scanStatusTime = setInterval(that.getScanList, 60000);
          }
        }

      })
    },
    //开始扫描
    targetScan(num, val) {
      if(val.length > 0) {
            var that = this;
            var targetIds = '';
            for(var i = 0; i < val.length; i++) {
              //if (num == 1) {
                //目标扫描
                if (val.length == 1 || i == (val.length-1)) {
                  targetIds += val[i].targetId;
                } else {
                  targetIds += val[i].targetId+',';
                }
              /*} else {
                //任务扫描
                if (val.length == 1 || i == (val.length-1)) {
                  targetIds += val[i].targetId;
                } else {
                  targetIds += val[i].targetId+',';
                }
              }*/
              
            }
            this.scanStatusArr = targetIds;
            var param = {
              'targetIdList': targetIds
            }

            scanTarget(param).then(res => {
                this.$message({
                  type: 'success',
                  message: '成功创建扫描任务'
                })
                //扫描任务列表
                this.getScanList();

                //开启定时任务
                //window.clearInterval(that.scanStatusTime);
                //that.scanStatusTime = setInterval(that.getScanList, 60000);
            })
            
        } else {
          this.$message({
            type: 'warning',
            message: '请选择扫描的目标'
          })
        }
    },
    
  },
  mounted() {

    //默认进入tabs
    var aNameLocal = localStorage.getItem('webAName');
    if(aNameLocal == 'second') {
      this.activeName = 'second';
    } else {
      this.activeName = 'first';
    }
    localStorage.setItem('webAName', '');

    //目标管理列表
    this.getTestList();

    //扫描任务列表
    this.getScanList();

  }
}
</script>
<style scoped>
  .web-pad{
    padding:10px 0px 0 20px;
    width: 98%;
    height: auto;
    overflow: hidden;
  }
  .pmNone{
    padding:0;margin:0;
  }
  .el-table__body .severityC_2, .el-table__body .severityC_0, .el-table__body .severityC_3, .el-table__body .severityC_1{
    padding:1px 5px;margin:0 5px;display: inline-block;line-height: 15px;width:20px;text-align: center;color:#fff;font-size:10px;
  }
  .el-table__body .severityC_2{
    background:#ff8309;
  }
  .el-table__body .severityC_0{
    background:#1296db;
  }
  .el-table__body .severityC_1{
    background:#ffcd3c;
  }
  .el-table__body .severityC_3{
    background:#ff0000;
  }
  .w-h-link{
    display: block;width:100%;height:100%;
  }
  .linkScaning{
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 100%;
    background: #d81e06;
    line-height: 18px;
    text-align: center;
    color: #fff;
    font-size: 12px;
  }
</style>