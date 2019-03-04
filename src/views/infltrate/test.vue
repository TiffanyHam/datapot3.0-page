<template>
  <div class="pageOverflow" style="position: relative;">
    <div class="title company_ip infomation" ref="infomation" style="height:95%;overflow:auto;overflow:hidden;" >
      <div class="filter-container">
        <el-row>
          <el-col :span="9">
            <img src="../../assets/images/panorama/datapot.png" width="70" class="fr" style="margin-top:9%;" />
          </el-col>
          <el-col :span="15">
            <div class="dataPotTitle fl">
              <h1>神灯数据渗透测试</h1>
              <p>DataPot AIS Penetration Test</p>
            </div>
          </el-col>
        </el-row>
        <section class="app-container">
          <div class="" style="width:50%;margin:0 auto;">
            <el-row>
              <el-col :span="24">
                <el-tabs v-model="activeName" @tab-click="handleClick" class="tabsNam">
                  <el-tab-pane>
                    <span slot="label" name="first"><i :class="{'el-icon-stInfo':true, 'on':isTrue}"></i> 渗透测试</span>
                    <el-row>
                      <el-col :span="24" class="testBts">
                        <el-col :span="21">
                          <el-input placeholder="请输入IP" v-model="key" style="width:100%" class="fl"></el-input>
                        </el-col>
                        <el-col :span="3">
                          <el-button type="primary" @click="infTest" class="fr">提交</el-button>
                        </el-col>
                      </el-col>
                    </el-row>
                  </el-tab-pane>
                  <el-tab-pane>
                    <span slot="label" name="second"><i :class="{'el-icon-mxInfo':true, 'on':!isTrue}"></i> 模型训练</span>
                    <el-row>
                      <el-col :span="24"  class="testBts">
                        <el-col :span="21">
                          <el-input placeholder="请输入IP" v-model="key2" class="fl" style="width:100%"></el-input>
                        </el-col>
                        <el-col :span="3">
                          <el-button type="primary" class="fr" @click="infMode">提交</el-button>
                        </el-col>
                      </el-col>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
              </el-col>
            </el-row>
          </div>
          <!-- 渗透测试结果-->
          <div class="t-result" v-show="isTestResult" v-loading="tloading">
            <el-row>
              <el-col :span="12" style="font-size: 16px">近期测试结果</el-col>
              <el-col :span="12">
                <div class="fr" style="position: relative;">
                  <el-input placeholder="请输入目标IP" v-model="tKey" style="width:200px;margin-right:10px;" @keyup.enter.native="searchItem"></el-input>
                  <a href="javascript:;" class="inf-search" @click="searchItem"></a>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-table
                  :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                  style="width: 100%;margin-top:10px;"
                  :default-sort = "{prop: '', order: ''}">
                  <el-table-column
                    prop="" width="80"
                    label="#">
                    <template scope="scope">
                      <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="user"
                    label="操作账号"
                    width="100"
                    :formatter="fmtLength">
                  </el-table-column>

                  <el-table-column
                    prop="target_ip"
                    label="目标IP"
                    width="140"
                    :formatter="fmtLength">
                    <template scope="scope">
                      <router-link v-if="scope.row.status=='finish'" :to="{name:'infiltrate-detail', params: {'infltrate': scope.row, 'jobId':scope.row.id}}" class="t-a-ip">{{scope.row.target_ip}}</router-link>
                      <span v-else>{{scope.row.target_ip}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="status"
                    label="测试结果" :formatter="fmtLength"
                    width="120">
                    <template scope="scope">
                      <i v-if="scope.row.status=='fail'" class="el-icon-fail"  style="margin-bottom:-4px;"></i>
                      <i v-else-if="scope.row.status=='finish'" class="el-icon-finish"  style="margin-bottom:-4px;"></i>
                      <i v-else class="el-icon-loading"  style="margin-bottom:-4px;"></i>
                      <span>{{scope.row.status | stageFormat}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="start_time"
                    label="开始时间"
                    :formatter="fmtLength">
                  </el-table-column>

                  <el-table-column
                    prop="end_time"
                    width="150"
                    label="结束时间"
                    :formatter="fmtLength">
                  </el-table-column>


                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button v-if="scope.row.status=='nmap'||scope.row.status=='running'" type="text" class="btns" @click='info(scope.$index, scope.row, 0)'>查看详情</el-button>
                      <!-- <el-button v-if="scope.row.status==1" type="text" class="btns" @click='over(scope.$index, scope.row, 0)'>立即结束</el-button> -->
                      <el-button v-else type="text" class="btns" @click='del(scope.$index, scope.row, 0)'>删除</el-button>
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

          <!-- 培训结果-->
          <div class="t-result" v-show="isModelResult" v-loading="mloading">
            <el-row>
              <el-col :span="12" style="font-size: 16px">近期训练结果</el-col>
              <el-col :span="12">
                <div class="fr" style="position: relative;">
                  <el-input placeholder="请输入目标IP" v-model="mKey" style="width:200px;margin-right:10px;" @keyup.enter.native="searchMItem"></el-input>
                  <a href="javascript:;" class="inf-search" @click="searchMItem"></a>
                  <!-- <el-button type="primary" icon="el-icon-search" @click="searchMItem" class="fr">查询</el-button> -->
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-table
                  :data="tableData2.slice((currentPage2-1)*pagesize2,currentPage2*pagesize2)"
                  style="width: 100%;margin-top:10px;"
                  :default-sort = "{prop: '', order: ''}">
                  <el-table-column
                    prop="" width="80"
                    label="#">
                    <template scope="scope">
                      <span>{{ pagesize2 * (currentPage2 - 1)  + 1 + scope.$index  }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="user"
                    label="操作账号"
                    width="100"
                    :formatter="fmtLength">
                  </el-table-column>

                  <el-table-column
                    prop="target_ip"
                    label="目标IP"
                    width="140"
                    :formatter="fmtLength">
                    <template scope="scope">
                      <router-link v-if="scope.row.status=='finish'" :to="{name:'infiltrate-detail', params: {'infltrate': scope.row, 'jobId': scope.row.id}}" class="t-a-ip">{{scope.row.target_ip}}</router-link>
                      <span v-else>{{scope.row.target_ip}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="status"
                    label="测试结果" :formatter="fmtLength"
                    width="120">
                    <template scope="scope">
                      <i v-if="scope.row.status=='fail'" class="el-icon-fail"  style="margin-bottom:-4px;"></i>
                      <i v-else-if="scope.row.status=='finish'" class="el-icon-finish"  style="margin-bottom:-4px;"></i>
                      <i v-else class="el-icon-loading"  style="margin-bottom:-4px;"></i>
                      <span>{{scope.row.status | stageFormat}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="start_time"
                    label="开始时间"
                    :formatter="fmtLength">
                  </el-table-column>

                  <el-table-column
                    prop="end_time"
                    width="150"
                    label="结束时间"
                    :formatter="fmtLength">
                  </el-table-column>


                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button v-if="scope.row.status=='nmap'||scope.row.status=='running'" type="text" class="btns" @click='info(scope.$index, scope.row, 1)'>查看详情</el-button>
                      <!--  <el-button v-if="scope.row.status==1" type="text" class="btns" @click='over(scope.$index, scope.row, 1)'>立即结束</el-button> -->
                      <el-button v-else type="text" class="btns" @click='del(scope.$index, scope.row, 1)'>删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <el-pagination class="fy"
                               layout="prev, pager, next,total"
                               :current-page.sync = "currentPage"
                               @current-change="current_change2"
                               :total="total2" :page-size="pagesize2"
                               background
                >
                </el-pagination>
              </el-col>
            </el-row>
          </div>
        </section>
      </div>


    </div>

    <!--详情弹窗-->
    <el-dialog title="操作提示" :visible.sync="dialogFormVisible" width="450px">
      <el-row>
        <el-col :span="24">
          <div class="i-t-status">
            <p>系统正在执行：</p>
            <p class="i-t-p">{{jobStatus.nmap}}</p>
            <p class="i-t-p">{{jobStatus.job}}</p>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer"  style="text-align: center">
        <el-button @click=" dialogFormVisible = false ">取 消</el-button>
        <el-button type="primary" @click="over">立即结束</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { isvalidateIP } from '../../utils/validate.js'
  import { infRsult, getResult, killJob, deleteJob, getStatus } from '../../api/infltrate/infltrate.js'

  export default {
    filters: {
      stageFormat(num) {
        const stageMap = {
          'nmap': '扫描中',
          'fail': '测试失败',
          'running': '测试中',
          'finish': '测试完成'
        }
        return stageMap[num]
      }
    },
    data() {
      return {
        key: '',
        key2: '',
        tKey: '',
        mKey: '',
        isTrue: true,
        activeName:'',
        isTestResult: true,
        currentPage: 1,
        pagesize: 15,
        total: 0,
        tableData: [],
        tloading: true,

        isModelResult: false,
        currentPage2: 1,
        pagesize2: 15,
        total2: 0,
        tableData2: [],
        mloading: true,

        jobId: '',
        modelId: '',
        time: '',
        user: localStorage.getItem('om_username'),
        dialogFormVisible: false,
        jobStatus: {
          nmap: '',
          job: '',
          state: 0,
        }
      }
    },
    methods: {
      handleClick(tab, event) {

        if (tab.index == '0') {
          this.isTestResult = true;
          this.isModelResult = false;
          this.isTrue = !this.isTrue;
        } else {
          this.isTestResult = false;
          this.isModelResult = true;
          this.isTrue = !this.isTrue;
        }
      },
      fmtLength(row, column){
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          return arr
        }
      },
      current_change(currentPage) {
        this.currentPage = currentPage;
        //this.getDetecList();
      },
      current_change2(currentPage) {
        this.currentPage2 = currentPage;
        //this.getDetecList();
      },
      fmstatus(row, column) {
        var result = '—';
        var data = row[column['property']];
        switch(data) {
          case 'nmap':
            result = '扫描中';
            break;
          case 'fail':
            result = '测试失败';
            break;
          case 'running':
            result = '测试中';
            break;
          case 'finish':
            result = '测试完成';
            break;
          case 1:
            result = '系统正在执行';
            break;
        }
        return result
      },
      fmModelstatus(row, column) {
        var result = '—';
        var data = row[column['property']];
        switch(data) {
          case 'nmap':
            result = '扫描中';
            break;
          case 'fail':
            result = '训练失败';
            break;
          case 'running':
            result = '训练中';
            break;
          case 'finish':
            result = '训练完成';
            break;
          case 1:
            result = '系统正在执行';
            break;
        }
        return result
      },
      ipValidate(ip) {
        var value = ip;
        if(value == '') {
          this.$message({
            type: 'warning',
            message: 'IP不能为空'
          });
          return false;
        } else if (!isvalidateIP(value)) {
          this.$message({
            type: 'warning',
            message: 'IP格式不正确'
          });
          return false;
        } else {
          return true
        }

      },
      //删除
      del(index, row, state) {

        this.$confirm('确定删除该结果吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: false
        }).then(() => {
          var that = this;
          var param = {
            'jobId': row.id
          }
          deleteJob(param).then(res => {

            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
          state == 0 ? this.getTblData() : this.getModelData();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '删除失败'
          })
        })

      },
      //立即结束
      over() {
        this.$confirm('确定结束该任务吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: false
        }).then(() => {

          var that = this;
          var id = (this.jobStatus.state == 0 ? this.jobId : this.modelId);
          var param = {
            'jobId': id
          }
          killJob(param).then(res => {
            this.$message({
              type: 'success',
              message: '任务已结束'
            });
            this.dialogFormVisible = false; //关闭弹窗
            //取消定时任务
            window.clearInterval(that.time);
            this.jobStatus.state == 0 ? this.getTblData() : this.getModelData();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '结束失败'
          })
        })
      },
      //查看详情
      info(index, row, state) {

        this.jobStatus.state = state; //测试or训练
        this.dialogFormVisible = true; //打开弹窗
        state == 0 ? this.jobId = row.id : this.modelId = row.id;
        this.getJobStatus(state); //查看进度

      },
      //查看进度
      getJobStatus(state) {

        var that = this;
        var param = {
          'jobId': (state==0?this.jobId:this.modelId)
        }
        getStatus(param).then(res => {

          //nmap扫描, running运行, fail失败, finsh完成
          var status = res.result.status;
          if (state == 0) {
            //that.tStatus = 1;
            /*that.tableData[0] = {
              'target_ip': that.key,
              'start_time': '—',
              'end_time': '—',
              'status': status,
              'id': that.jobId,
              'user': that.user,
              'description': '',
            }*/
            that.tableData[0].status = status;
          } else {
            /*that.tableData2[0] = {
              'target_ip': that.key,
              'start_time': '—',
              'end_time': '—',
              'id': that.modelId,
              'status': status,
              'user': that.user,
              'description': '',
            }*/
            that.tableData2[0].status = status;
          }


          var progress = res.result.progress;
          var tpStr = (state == 0 ? "测试" : "训练");

          if (status == "nmap") {
            that.jobStatus.nmap = "扫描："+progress+"%";
            that.jobStatus.job = tpStr+"：0%";
          } else if (status == "running") {
            that.jobStatus.nmap = "扫描：100%";
            that.jobStatus.job = tpStr+"："+progress+"%";
          } else if (status == "fail") {
            that.jobStatus.nmap = "扫描：0%";
            that.jobStatus.job = tpStr+"：0%";
          } else if (status == "finsh") {
            that.jobStatus.nmap = "扫描：100%";
            that.jobStatus.job = tpStr+"：100%";
          }

          //完成或失败，取消定时
          if (status == "fail" || status == "finsh") {
            //启动定时
            window.clearInterval(that.time);
          }

        })
      },
      //渗透测试
      infTest() {
        var state = this.ipValidate(this.key);
        if (state) {
          this.$confirm('系统运行时间较长，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: false
          }).then(() => {

            var that = this;
            var param = {
              'user': this.user,
              'description': '',
              'targetIp': this.key,
              'mode': 'test'
            }
            infRsult(param).then(res => {

              that.jobId = res.result;
              //获取近期结果
              //that.getTblData();
              that.tableData.splice(0,0, {
                'target_ip': that.key,
                'start_time': '—',
                'end_time': '—',
                'id': that.jobId,
                'status': 'nmap',
                'user': that.user,
                'description': '',
              })

              //启动定时任务
              window.clearInterval(that.time);
              that.time = setInterval(that.getJobStatus(0), 300000);
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '启动失败'
            })
          })

        }
      },
      //近期测试结果
      getTblData() {
        var that = this;
        var param = {
          'ip': this.tKey,
          'mode': 'test',
          'numPerPage': this.pagesize,
          'pageNum': this.currentPage
        }
        getResult(param).then(res => {
          that.tloading = false;
          if (res.result.job_list) {
            that.tableData = res.result.job_list;
            that.total = that.tableData.length;
          }

        })
      },
      searchItem() {
        this.getTblData();
      },
      //模型训练
      infMode() {
        var state = this.ipValidate(this.key2);
        if (state) {
          this.$confirm('系统运行时间较长，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: false
          }).then(() => {

            var that = this;
            var param = {
              'user': this.user,
              'description': '',
              'targetIp': this.key2,
              'mode': 'train'
            }
            infRsult(param).then(res => {
              that.mloading = false;
              that.modelId = res.result;
              //获取近期结果
              //that.getModelData();
              this.tableData2.splice(0,0, {
                'target_ip': that.key2,
                'start_time': '—',
                'end_time': '—',
                'id': that.modelId,
                'status': 'nmap',
                'user': that.user,
                'description': '',
              })

              //启动定时任务
              window.clearInterval(that.time);
              that.time = setInterval(that.getJobStatus(1), 300000);
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '启动失败'
            })
          })
        }
      },
      //近期培训结果
      getModelData() {

        var that = this;
        var param = {
          'ip': this.mKey,
          'mode': 'train',
          'numPerPage': this.pagesize2,
          'pageNum': this.currentPage2
        }
        getResult(param).then(res => {

          if (res.result.job_list) {
            that.tableData2 = res.result.job_list;
            that.total2 = that.tableData2.length;
          }

        })
      },
      searchMItem() {
        this.getModelData();
      }
    },
    mounted() {
      //近期测试结果
      this.getTblData();
      //近期培训结果
      this.getModelData();
    }
  }
</script>

<style>

  .infomation .el-icon-stInfo,.infomation .el-icon-mxInfo{
    margin-bottom:-5px;
  }
  .infomation .el-icon-urlInfo{
    margin-bottom:-3px;
  }
  .t-result{
    width:80%;margin:40px auto 20px auto;padding:20px;border:1px solid #ccc;border-radius: 5px;
  }
  .t-a-ip{
    color:#3a8ee6;
  }
  .i-t-status p{
    line-height: 25px;
  }
  .i-t-status p.i-t-p{
    padding-left:100px;
  }
  .inf-search{
    position: absolute;
    top: 0;
    right: 12px;
    display: block;
    width: 29px;
    height: 30px;
    background: url(../../assets/images/search.png) center center no-repeat;
    background-size: 60% auto;
  }
</style>
