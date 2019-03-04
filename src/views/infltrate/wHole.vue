<template>
  <div class="pageOverflow" style="height:87%;">
  <div class="title company_ip infomation" style="overflow: auto;padding:10px 0;">
    <section class="app-container">
      <el-row>
          <el-col :span="20"><div class="w-f-title" style="border:0px;padding-left:20px;">漏洞信息</div></el-col>
          <!-- <el-col :span="4"><router-link :to="{path:'/infiltrate-web'}" class="fr" style="padding-right:20px;">< 返回</router-link></el-col> -->
          <a href="javascript:;" @click="blackwt" class="fr" style="padding-right:20px;">< 返回</a>
      </el-row>

      <div style="padding:0 15px;">
         <el-table
            :data="tableData"
            style="width: 100%;margin-top:10px;" 
            :default-sort = "{prop: '', order: ''}"  @filter-change="filterChange">
            <el-table-column
              prop="" width="80"
              label="#">
              <template scope="scope">
                <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="severity" 
              :filters="vulnLevel" 
              :filter-multiple="false" 
              column-key="severity"
              label="风险等级">
              <template slot-scope="scope">
                  <span :class="scope.row.severity | stageColor" class="stageGrede">
                      {{scope.row.severity | stageName}}
                  </span>
              </template>
            </el-table-column>

            <el-table-column
              prop="vtName"
              label="漏洞名称">
            </el-table-column>

            <el-table-column
              prop="affectsUrl"
              label="URL">
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

    </section>
  </div>
  </div>
</template>

<script>
  import { targetHole, scanHole } from '../../api/infltrate/infltrate.js'
  import { getConstants } from '../../api/securityHole/holeDasebase.js'
  import { destroyCache, filterItems } from '../../utils/deleCache.js'

  export default {
    filters: {
      stageName(num) {
        const stageMap = {
          '3': '高危',
          '2': '中危',
          '1': '低危',
          '0': '安全',
        }
        return stageMap[num]
      },
      stageColor(num) {
        const stageMap = {
          0: 'sbd1',
          1: 'sbd2',
          2: 'sbd3',
          3: 'sbd4',
        }
        return stageMap[num]
      }
    },
    data() {
      return {
        tableData: [],
        currentPage: 1,
        pagesize: 15,
        total: 0,
        data: '',
        type: '',
        severity: '',
        vulnLevel: [{value: "0", text: "安全"},{value: "1", text: "低危"}, {value: "2", text: "中危"},{value: "3", text: "高危"}],
        filterName: {},
      }
    },
    methods: {
      current_change(val) {
        this.currentPage = val;
        this.getTblList();
      },
      getTblList() {
        var that = this;
        var param = {
          'pageSize': this.pagesize,
          'pageNo': this.currentPage,
          'id': this.data.id,
          'severity': this.severity
        }
        if(this.filterName.severity || this.filterName.severity == "") {
          param.severity = this.filterName.severity;
        }
        if (this.type == '1') {
          //目标漏洞
          //debugger
          targetHole(param).then(res => {
            that.tableData = res.result.results;
            that.total = res.result.totalCount;
          })
        } else if(this.type == '2') {
          //扫描漏洞
          scanHole(param).then(res => {
            that.tableData = res.result.results;
            that.total = res.result.totalCount;
          })
        }
      },
      //获取风险等级常量
      getSeverityContent() {
        var that = this;
        getConstants('').then(res => {
          
          var arr = [];
          if(res.result.vulnLevel) {
            var levelList = res.result.vulnLevel;
            for (let x in levelList) {
              if (levelList[x] != '信息') {
                let f = {
                  value: x,
                  text: levelList[x]
                }
                arr.push(f);
              }
            }
            //debugger
            that.vulnLevel = arr;
          }

        })
      },
      filterChange(filters) {
         this.filterName = filterItems(filters, this.filterName);
         this.getTblList();
      },
      //返回
      blackwt() {
        
        var tabs = (this.type == 1 ? 'first' : 'second' )
        localStorage.setItem('webAName', tabs);
        this.$router.push({path:'/infiltrate-web'})
      },
      getLinkParam() {
        this.data = this.$route.params.wInfo;
        this.type = this.$route.params.wType;
        this.severity = this.$route.params.severity;
        this.getTblList();
      },
    },
    mounted() {
      //获取参数
      this.getLinkParam();

      //风险等级
      //this.getSeverityContent()
    }
  }
</script>

<style>
.stageGrede{
  padding:3px 7px;color:#fff;font-size:12px;border-radius:3px;
}
.sbd3{
  background:#ff8309;
}
.sbd1{
  background:#1296db;
}
.sbd2{
  background:#ffcd3c;
}
.sbd4{
  background:#ff0000;
}
</style>