<template>
  <div class="title" style="border: none">
    <div class="coreAssets">
      <el-row style="border: 1px solid #dcdfe6;padding: 10px 20px;">
        <el-col :span="12">
          <span v-for="(item,index) in lidata">
             <span :class="{active:index ==isActive}"  @click="changeClass(index)">{{item.name}}
               <span v-show="index != 3">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
             </span>
          </span>
        </el-col>
        <el-col :span="12" class="a-right" ><span @click="toDashboard"><i class="el-icon-arrow-left"></i>返回</span></el-col>
      </el-row>
      <!--工具条-->
      <el-row style="border: 1px solid #dcdfe6;padding: 10px 20px;border-top: none; ">
        <el-col>
          <span class="fl" style="line-height:30px;">主机状态：</span>
          <span class="fl" style="line-height:34px;position: absolute;left: 330px;" >
            <span @click="updataIcon('1')" v-show="downIcon"><i class="el-icon-star-on" style="color: #ffdf01;font-size: 18px"></i>&nbsp;仅显示核心资产</span>
            <span @click="updataIcon('')" v-show="!downIcon"><i class="el-icon-star-on" style="font-size: 18px;color: #bfbfbf;" ></i>&nbsp;仅显示核心资产</span>
          </span>

          <span class="fl" style="line-height:34px;position: absolute;left: 480px;" @click="isRest">
            <i class="el-icon-refresh" style="color: #1296db;font-size: 18px"></i>&nbsp;重置过滤条件</span>

          <div class="fr">
            <el-form :inline="true" ref="form" :model="form">
              <el-form-item>
                <el-input placeholder="请输入主机名" v-model="form.hostName"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getSearch">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="活动的" name="0">
              <el-table
                v-loading="activityLoading"
                :data="activityData"
                :header-cell-style="{background:'#eee'}"
                style="width: 100%"
                :height="tableHeight"  @filter-change="filterChange">
                <el-table-column
                  prop="" width="80"
                  label="#">
                  <template scope="scope">
                    <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="hostName"
                  :formatter="fmtLength"
                  label="主机名">
                  <template slot-scope="scope">
                    <router-link :to="{name:'hostDetailDetec', params: { host: scope.row,black: '/overview'} }"
                                 class="d-a-title" style="color:#409EFF;padding:0;">{{ scope.row.hostName }}</router-link>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="hostIp"
                  :formatter="fmtLength"
                  label="主机ip"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="stage"
                  :formatter="fmtLength"
                  width="180"
                  :filter-multiple="isFalse"
                  :filters="stagesFilter"
                  column-key="stage"
                  label="威胁阶段">
                  <template slot-scope="scope">
                    <span class="statusSty" :class='scope.row.stage | statusFilter'>{{scope.row.stage | formatStata}}</span>
                  </template>
                </el-table-column>
                <!-- :filter-method="filterTag" -->

                <el-table-column
                  prop="threat"
                  :formatter="fmtLength"
                  width="150"
                  align="center"
                  label="威胁度">
                </el-table-column>
                <el-table-column
                  prop="certainty"
                  :formatter="fmtLength"
                  width="150"
                  align="center"
                  label="可信度">
                </el-table-column>
                <el-table-column
                  prop="detectTime"
                  :formatter="timeFormatter"
                  label="最近发现时间">
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
            </el-tab-pane>
            <el-tab-pane label="非活动的" name="1">
              <el-table
                v-loading="activityLoading"
                :data="activityData"
                :header-cell-style="{background:'#eee'}"
                style="width: 100%"
                :height="tableHeight"  @filter-change="filterChange">
                <el-table-column
                  prop="" width="80"
                  label="#">
                  <template scope="scope">
                    <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="hostName"
                  :formatter="fmtLength"
                  label="主机名">
                  <template slot-scope="scope">
                    <router-link :to="{name:'hostDetailDetec', params: { host: scope.row,black: '/overview'} }"
                                 class="d-a-title" style="color:#409EFF;padding:0;">{{ scope.row.hostName }}</router-link>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="hostIp"
                  :formatter="fmtLength"
                  label="主机ip"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="stage"
                  :formatter="fmtLength"
                  width="180"
                  :filter-multiple="isFalse"
                  :filters="stagesFilter"
                  column-key="stage"
                  label="威胁阶段">
                  <template slot-scope="scope">
                    <span class="statusSty" :class='scope.row.stage | statusFilter'>{{scope.row.stage | formatStata}}</span>
                  </template>
                </el-table-column>
                <!-- :filter-method="filterTag" -->

                <el-table-column
                  prop="threat"
                  :formatter="fmtLength"
                  width="150"
                  align="center"
                  label="威胁度">
                </el-table-column>
                <el-table-column
                  prop="certainty"
                  :formatter="fmtLength"
                  width="150"
                  align="center"
                  label="可信度">
                </el-table-column>
                <el-table-column
                  prop="detectTime"
                  :formatter="timeFormatter"
                  label="最近发现时间">
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
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import {gethostPage} from '../../api/dashboard/overview.js'
  import { timestampToTime } from '../../utils/time.js'
  import { destroyCache, filterItems } from '../../utils/deleCache.js'

  export default {
    data() {
      return {
        priorityNum: '',
        activeName: '0',
        loading:true,
        activityLoading:true,
        isFalse:false,
        downIcon: true,
        tableHeight: document.documentElement.clientHeight - 265,
        hostStatus: '0', //活动：0  非活动：1
        isKeyReq: '', //非核心：2  核心：1
        total: 0,//默认数据总数
        pagesize:15,//每页的数据条数
        currentPage:1,//默认开始页面
        activityData: [],
        form:{
          hostName:''
        },
        stagesFilter:[],
        isActive:-1,
        lidata:[
          /*{index:0,name:'全部'},*/
          {index:1,name:'低危'},
          {index:2,name:'中危'},
          {index:3,name:'高危'},
          {index:4,name:'严重'},
        ],
        filterName: {}
      }
    },
    filters: {
      // 颜色转换
      statusFilter(status) {
        const statusMap = {
          1: 'co_blue',
          2: 'co_dark',
          3: 'co_yellow',
          4: 'co_purple',
          5: 'co_gray',
          6: 'co_orange',
          7: 'co_red',
        }
        return statusMap[status]
      },
      // 状态显示转换
      formatStata(status) {
        const statusMap = {
          1: "侦查",
          2: "武装",
          3: "投递",
          4: "突破",
          5: "安装",
          6: "控制",
          7: "攻击",
        }
        return statusMap[status]
      }
    },
    methods:{
      fmtLength(row, column){
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          return arr
        }
      },
      //低危、中危、高危、严重
      changeClass(index){
        this.activityLoading = true
        this.isActive = index;
        this.priorityNum = this.isActive + 1
        this.currentPage = 1
        this.getHostList()
      },
      //切换字体颜色  核心、非核心
      updataIcon(index) {
        //根据你的downIcon判断
        this.activityLoading = true
        this.downIcon = !this.downIcon
        this.isKeyReq = index
        this.currentPage = 1
        this.getHostList()
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getHostList()
      },
      //时间戳转时间
      timeFormatter(row, column) {
        var data = row[column['property']];
        if(data === null || data === '' || data === undefined){
          return '—'
        } else {
          data = timestampToTime(data);
          return data;
        }
      },
      //tab 切换
      handleClick(tab, event) {
        this.activityLoading = true
        this.hostStatus = tab.name;
        this.form.hostName =''
        this.currentPage = 1
        this.getHostList()
      },
      //返回
      toDashboard(){
        this.$router.push({name: 'dashboard'})
      },
      //查询
      getSearch(){
        this.activityLoading = true
        this.currentPage = 1
        this.getHostList()
      },
      //重置过滤条件
      isRest() {
        this.activityLoading = true
        this.form.hostName = '';
        this.hostStatus = '0';
        this.activeName = '0',
        this.isKeyReq = '';
        this.downIcon = true,
        this.currentPage = 1;
        this.pagesize = 15;
        this.getHostList();
      },
      //列表
      getHostList() {
        let params = {
          'stageQ': '',
          'dealStatusQ': '',
          'isKeyQ': this.isKeyReq,
          'hostNameQ': this.form.hostName,
          'typeZhQ': '',
          'hostStatus': this.hostStatus,
          'priority':this.priorityNum,
          'time': '1',
          'numPerPage': this.pagesize,
          'pageNum': this.currentPage
        }
        if (this.filterName.stage) {
          params.stageQ = this.filterName.stage
        }
        gethostPage(params).then(res =>{
          this.activityLoading = false
          let data = res.result.info.results
          this.total = res.result.info.totalCount;
          data == null ? this.activityData = [] : this.activityData = data;
          let stages = res.result.stages
          let temp = []
          for(let x in stages){
            let a ={
              value:x,
              text:stages[x]
            }
            temp.push(a)
          }
          this.stagesFilter = temp

        })
      },
      /*//下拉筛选事件
      filterTag(value, row, column) {
        value = Number(value);
        const property = column['property'];
        return row[property] === value;
      },*/
      //筛选事件
      filterChange(filters) {
         this.filterName = filterItems(filters, this.filterName);
         this.getHostList();
      },
    },
    mounted(){
      //
      this.$route.params.priorityNum == undefined ? this.priorityNum = localStorage.getItem('priorityNum') : this.priorityNum = this.$route.params.priorityNum;
      localStorage.setItem('priorityNum', this.priorityNum);
      this.isActive = this.priorityNum -1;

      this.getHostList();

    }


  }
</script>
<style>
  .coreAssets .el-tabs--card>.el-tabs__header .el-tabs__item{
    border-bottom: 1px solid #e4e7ed;
  }
  .coreAssets .el-tabs--card>.el-tabs__header {
    border-bottom: none;
  }
  .coreAssets .el-tabs__item {
    line-height: 30px;
    height:30px;
  }
  .coreAssets .el-tabs__content {
    overflow: visible;
  }
  .coreAssets .el-tabs__header {
    width: 300px;
  }
  .coreAssets .el-tabs__item.is-active {
    border: 2px solid #1296db!important;
  }
  .active{color:#1296db }
</style>
