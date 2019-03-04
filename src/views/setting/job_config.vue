<template>
  <div class="title">
    <div class="filter-container">
      <section class="app-container">
        <div class="container_table">
          <el-table
            :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
            style="width: 100%" :height="tableHeight"
            :default-sort = "{prop: 'date', order: 'descending'}">
            <el-table-column
              width="50"
              prop=""
              label="#">
               <template scope="scope">
                <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="jobClass"
              :formatter="fmtLength"
              label="任务类"
              width="120"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="triggerName"
              :formatter="fmtLength"
              label="触发器名称"
              width="120"
              :show-overflow-tooltip="true">
                         </el-table-column>
             <el-table-column
              prop="triggerGroup"
              :formatter="fmtLength"
              label="触发器组"
              width="100"
              :show-overflow-tooltip="true">
              </el-table-column> -->
             <el-table-column
              prop="jobGroup"
              :formatter="fmtLength"
              label="任务组"
              width="100"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="job"
              :formatter="fmtLength"
              label="任务实例名">
            </el-table-column>
            <el-table-column
              prop="cron"
              :formatter="fmtLength"
              label="频率"
              width="100"
              :show-overflow-tooltip="true">
            </el-table-column>

            <el-table-column
              prop="timeInterval"
              :formatter="fmtLength"
              width="80"
              label="间隔时间">
            </el-table-column>
             <el-table-column
              prop="status"
              width="80"
              label="是否启用"
              :formatter="statusFormat">
            </el-table-column>
             <el-table-column
              prop="description"
              :formatter="fmtLength"
              label="描述">
            </el-table-column>
            <el-table-column label="操作" prop="tag" width="100">
              <template slot-scope="scope">
                <el-button type="text" class="btns" @click='isFall(scope.$index, scope.row)' v-if="scope.row.status == 1 ? scope.row.tag = '禁用' : scope.row.tag = '启用' ">{{scope.row.tag}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="fy"
                         layout="prev, pager, next,total"
                         @current-change="current_change"
                         :total="total"
                         :page-count="pageCount"
                         :page-size="pagesize"
                         background
          >
          </el-pagination>
        </div>

      </section>
    </div>
  </div>
</template>
<script>
  import { getJConfigPage, isActive } from '../../api/setting/job_config.js'
  export default {
    data() {
      return {
        total:0,//默认数据总数
        pagesize:15,//每页的数据条数
        currentPage:1,//默认开始页面
        pageCount:0,
        istag: true,
        input:"",
        tableHeight: document.documentElement.clientHeight - 165,
        tableData: []
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
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 0) {
          return 'th';
        }
        return '';
      },
      created() {
        this.total=this.tableData.length;
      },
      current_change(currentPage) {
        this.currentPage = currentPage;
      },
      //是否启用转中文
      statusFormat(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined ){
          return '—'
        } else {
            if (arr == 0 || arr == "0" ) {
              return '否'
            } else if (arr == 1 || arr == "1" ) {
              return '是'
            }
        }

      },
      //禁用 ？ 启用
      isFall(index, row) {

         var msg = "",
             mbStatus = 0; //目标状态

         if (row.status == '1' ) {
            msg = '禁用';
            mbStatus = 0;
         } else {
            msg = '启用';
             mbStatus = 1;
         }

         this.$confirm('是否'+msg+'?', '提示', {
          type: 'warning'
         }).then(() => {

          var param = {
            "jobId": row.id,
            "active": mbStatus
          }
          var that = this;
          isActive(param).then(res => {
             this.$message({
                type: 'success',
                message: res.msg
              });
            that.getJConfigList();
          }).catch(() => {
             this.$message({
                type: 'info',
                message: "操作失败"
              });
          })

        })

      },
      //列表
      getJConfigList() {
        var that = this;
        var param = {
          numPerPage: this.pagesize,
          pageNum: this.currentPage
        }
        getJConfigPage(param).then(res => {
          if (res.result != null) {
            var list = res.result;
            that.tableData = list;
            that.total = that.tableData.length;
            that.pageCount = Math.ceil(that.total/that.pagesize);
          }

        })
      }
    },
    mounted() {
      //获取列表
      this.getJConfigList();
    }
  };
</script>

