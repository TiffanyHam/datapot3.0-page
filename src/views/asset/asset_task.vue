<template>
  <div class="pageOverflow">

    <div class="title company_ip asset" style="padding:10px 0;">
      <div class="filter-container">
        <section class="app-container">
          <el-row>
            <el-col :span="24">
              <div class="a-con">
                <el-row>
                  <el-col :span="24">
                    <div class="fl">
                      <el-date-picker
                        v-model="date"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </div>
                    <div class="fl" style="margin-left:30px;margin-top:-4px;">
                      <el-form :inline="true" ref="assetForm" :model="assetForm">
                        <el-form-item>
                          <el-input placeholder="请输入主机名/IP" v-model="assetForm.ip"></el-input>
                        </el-form-item>
                        <el-form-item>
                          <el-button type="primary" icon="el-icon-search" @click="assetFormSearch">查询</el-button>
                        </el-form-item>
                      </el-form>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div class="container_table">
                      <el-table
                        :data="tableData"
                        style="width: 100%" :height="tableHeight"
                        :default-sort = "{prop: '', order: ''}" v-loading="loading">
                        <el-table-column
                          prop="" width="50"
                          label="#">
                          <template scope="scope">
                            <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column
                          prop="created"
                          :formatter="fmtLength"
                          label="创建时间">
                        </el-table-column>

                        <el-table-column
                          prop="cron"
                          :formatter="fmtLength"
                          label="执行时间">
                        </el-table-column>

                        <el-table-column
                          prop="beat" :formatter="beatFormat"
                          label="重复频率">
                        </el-table-column>

                        <el-table-column
                          prop="active" :formatter="activeFormat" :filter-multiple="isActive" :filters="activeFilter" filter-placement="bottom-end" column-key="active" :filter-method="filterActive"
                          label="状态">
                        </el-table-column>

                        <el-table-column
                          prop="type" :formatter="typeFormat"
                          :filter-multiple="isType" :filters="typeFilter" filter-placement="bottom-end" column-key="type" :filter-method="filterType"
                          label="扫描类型">
                        </el-table-column>

                        <el-table-column
                          prop="uptime"
                          :formatter="fmtLength"
                          label="最近更新时间">
                        </el-table-column>

                        <el-table-column label="操作" align="center" class="btns">
                          <template slot-scope="scope">
                            <el-button v-if="scope.row.active == 1 || scope.row.active == 2 " type="text" class="btns" @click='up(scope.$index, scope.row, scope.row.type)'>启用</el-button>
                            <el-button v-else type="text" class="btns" @click='end(scope.$index, scope.row, scope.row.type)'>结束</el-button>
                            <el-button type="text" class="btns" @click='details(scope.$index, scope.row)'>详情</el-button>
                          </template>
                        </el-table-column>

                      </el-table>

                      <el-pagination class="fy"
                                     layout="prev, pager, next,total"
                                     :current-page.sync = "currentPage"
                                     @current-change="current_change"
                                     :total="total"
                                     :page-size="pagesize"
                                     background
                      >
                      </el-pagination>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </section>
      </div>
    </div>

    <!--详情-->
    <el-dialog title="任务详情" :visible.sync="dispotFormVisible" width="450px">
      <el-form :model="detailForm"  ref="detailForm">
        <el-form-item label="创建时间" prop="created">
          <span v-model="detailForm.created">{{detailForm.created}}</span>
        </el-form-item>
        <el-form-item label="执行时间" prop="time">
          <span>{{detailForm.time}}</span>
        </el-form-item>
        <el-form-item label="重复频率" prop="beat">
          <span>{{detailForm.beat}}</span>
        </el-form-item>
        <el-form-item label="扫描类型" prop="type">
          <span>{{detailForm.type == 'vuln_schedule' ? '漏洞扫描' : '端口扫描'}}</span>
        </el-form-item>
        <el-form-item label="任务状态" prop="active">
          <span>{{detailForm.active}}</span>
        </el-form-item>
        <el-form-item label="更新时间" prop="time">
          <span>{{detailForm.uptime}}</span>
        </el-form-item>
        <el-form-item label="目标主机">
          <div v-show="detailForm.ips != '' " style="width:70%;padding:2%;margin-left:18%;padding:2%;overflow:auto;border:1px solid #ccc;">
            <p v-for="i in detailForm.ips" style="line-height: 23px;clear: both;">
              <span class="fl">{{i}}</span>
              <a href="javascript:;" class="fr" @click="deleIp(i)" style="color: #409EFF;">移除</a>
            </p>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer"  style="text-align: center">
        <!-- <el-button @click=" dispotFormVisible = false ">取 消</el-button> -->
        <el-button type="primary" @click=" dispotFormVisible = false ">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { taskSearch, scanHoleSettime, scanHoleSettimeEnd, scanPortSettime, scanPortSettimeEnd, taskDetail, deteTmip } from '../../api/asset/asset.js'

  export default {
    data() {
      return {
        loading: true,
        date: '',
        assetForm: {
          ip: ''
        },
        tableHeight: 100,
        currentPage: 1,
        total: 0,
        pagesize: 15,
        tableData: [],
        isActive: false,
        activeFilter: [{
          value: 0,
          text: '正常'
        },{
          value: 1,
          text: '结束'
        }],
        isType: false,
        typeFilter: [{
          value: 'vuln_schedule',
          text: '漏洞扫描'
        }, {
          value: 'port_schedule',
          text: '端口扫描'
        }],
        //详情
        detail: '',
        dispotFormVisible: false,
        detailForm: {
          created: '',
          cron: '',
          beat: '',
          type: '',
          active: '',
          time: '',
          ips: ''
        },
        RID: ''

      }
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
      current_change(currentPage) {
        this.currentPage = currentPage;
        this.getAssetTask();
      },
      handleClick(tab, event) {

      },
      //重复频率
      beatFormat(row, column) {
        //0不重复， 1每天一次 7每周一次  30每月一次
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          var result = '';
          var d = arr.toString();
          switch(d) {
            case '0':
              result = '不重复';
              break;
            case '1':
              result = '每天一次';
              break;
            case '7':
              result = '每周一次';
              break;
            case '30':
              result = '每月一次';
              break;
          }
          return result;
        }

      },
      //状态转中文
      activeFormat(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          //0正常， 1结束 2暂停
          var result = '';
          var d = arr.toString();
          if (d == '0') {
             result = '正常';
           } else {
             result = '结束';
           }
          /*switch(d) {
            case '0':
              result = '正常';
              break;
            case '1':
              result = '终止';
              break;
            case '2':
              result = '暂停';
              break;
          }*/
          return result;
        }

      },
      //状态查询
      filterActive(value, row, column) {
        //value = Number(value);
        const property = column['property'];
        return row[property] === value;
      },
      //扫描类型
      typeFormat(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          if (arr == 'vuln_schedule') {
            return '漏洞扫描'
          } else if (arr == 'port_schedule') {
            return '端口扫描'
          }
        }

      },
      filterType(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      up(index, row, type) {
        this.$confirm('确定启动该任务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: false
        }).then(() => {
          var that = this;
          if (type == 'vuln_schedule') {
            //启动漏扫
            var param = {
              'ips': row.param,
              'dt': row.cron,
              'interval': row.beat
            }
            scanHoleSettime(param).then(res => {
              this.$message({
                type: 'success',
                message: '启动成功'
              })
              this.currentPage = 1;
              that.getAssetTask();
            })
          } else if (type == 'port_schedule') {
            //启动端口扫
            var param = {
              'ips': row.param,
              'dt': row.cron,
              'interval': row.beat
            }
            scanPortSettime(param).then(res => {
              this.$message({
                type: 'success',
                message: '启动成功'
              })
              this.currentPage = 1;
              that.getAssetTask();
            })

          } else {
            this.$message({
              type: 'info',
              message: '类型错误'
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '启动失败'
          })
        })
      },
      end(index, row, type) {
        this.$confirm('确定结束该任务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: false
        }).then(() => {
          var that = this;
          var param = {
            'id': row.id
          }
          if (type == 'vuln_schedule') {
            //结束漏扫
            scanHoleSettimeEnd(param).then(res => {
              this.$message({
                type: 'success',
                message: '已经终止'
              })
              this.currentPage = 1;
              that.getAssetTask();
            })

          } else if (type == 'port_schedule') {
            //结束端口扫
            scanPortSettimeEnd(param).then(res => {
              this.$message({
                type: 'success',
                message: '已经终止'
              })
              this.currentPage = 1;
              that.getAssetTask();
            })


          } else {
            this.$message({
              type: 'info',
              message: '类型错误'
            })
          }


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '结束失败'
          })
        })
      },
      details(index, row) {
        var that = this;
        this.RID = row.id || this.RID;
        var param = {
          'sid': this.RID
        }
        taskDetail(param).then(res => {

          that.detailForm = res.result;
          switch(that.detailForm.beat) {
            case 0:
              that.detailForm.beat = '不重复';
              break;
            case 1:
              that.detailForm.beat = '每天一次';
              break;
            case 7:
              that.detailForm.beat = '每周一次';
              break;
            case 30:
              that.detailForm.beat = '每月一次';
              break;
          }
          switch(that.detailForm.active) {
            case 0:
              that.detailForm.active = '正常';
              break;
            case 1:
              that.detailForm.active = '终止';
              break;
            case 2:
              that.detailForm.active = '暂停';
              break;
          }
          that.dispotFormVisible = true;
        })
      },
      deleIp(ip) {
        this.$confirm('确定将本资产移除任务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: false
        }).then(() => {
          var that = this;
          var param = {
            'sid': this.RID,
            'ip': ip
          }
          deteTmip(param).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            that.dispotFormVisible = false;
          })
        })
      },
      assetFormSearch() {
        this.currentPage = 1;
        this.getAssetTask();
      },
      getAssetTask() {
        var that = this;
        var ds = '', dn = '';
        if (this.date != '' && this.date != null) {
          ds = this.date[0];
          dn = this.date[1];
        }
        var param = {
          'pageSize': this.pagesize,
          'pageNo': this.currentPage,
          'ip': this.assetForm.ip,
          'started': ds,
          'ended': dn,
          'type': '1' //端口扫描
        }
        taskSearch(param).then(res => {

          that.loading = false;
          that.tableData = res.result.results;
          that.total = res.result.totalCount;
          if (that.tableData.length >= 1) {
            that.tableHeight = (`${document.documentElement.clientHeight}`-205)+'px'
          }
        })
      },
    },
    mounted() {
      this.getAssetTask();
    }
  }
</script>
