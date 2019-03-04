<template>
  <div class="title">
    <div class="filter-container">
      <section class="app-container">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true">
            <el-form-item>
              <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible = true">上传过滤规则</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <div class="container_table">
          <el-table
            :data="tableData"
            style="width: 100%" :height="tableHeight"
            :default-sort = "{prop: 'date', order: ''}" @filter-change="filterChange">
             <el-table-column width="50" type="index">
            <template scope="scope">
                <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
            </template>
          </el-table-column>
            <el-table-column
              prop="sid"
              label="Sid"
              width="50">
              <template scope="scope">
                  <el-button type="text"  style="color: #4a88a5;padding:0;" @click="info(scope.$index, scope.row)" >{{ scope.row.sid }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="score"
              :formatter="fmtLength"
              label="分数"
              width="50">
            </el-table-column>
            <el-table-column
              prop="action"
              label="动作"
              :filter-multiple="isFalse"
              :filters="actionFilter"
              filter-placement="bottom-end"
              column-key="action"
              :formatter="fmtLength"
              width="80">
              <!-- :filter-method="filterAction" -->
            </el-table-column>
            <el-table-column
              prop="protocol"
              label="协议"
              :filter-multiple="isFalse"
              :filters="protocolFilter"
              filter-placement="bottom-end"
              column-key="protocol"
              :formatter="fmtLength"
              width="80">
            </el-table-column>
            <!-- :filter-method="filterProtocol" -->
            <el-table-column
              prop="srcIp"
              label="访问IP"
              :formatter="fmtLength"
              width="100"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="srcPort"
              label="访问端口"
              :formatter="fmtLength"
              width="100"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="flow"
              :formatter="fmtLength"
              label="流向"
              width="50">
            </el-table-column>
            <el-table-column
              prop="destIp"
              :formatter="fmtLength"
              label="被访问IP"
              width="80"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="destPort"
              :formatter="fmtLength"
              label="被访问端口"
              width="120"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="classtype"
              :formatter="classTypeFormat"
              :filter-multiple="isFalse"
              :filters="typeFilter"
              filter-placement="bottom-end"
              column-key="classtype"
              label="类型"
              width="120"
              :show-overflow-tooltip="true">
              <!-- :filter-method="filterType" -->
              <!-- :formatter="classTypeFormat"  -->
            </el-table-column>
            <el-table-column
              prop="msg"
              :formatter="fmtLength"
              label="消息"
              :show-overflow-tooltip="true">
            </el-table-column>
          </el-table>
          <el-pagination class="fy"
                         layout="prev, pager, next,total"
                         @current-change="current_change"
                         :total="total" :page-size="pagesize"
                         background
          >
          </el-pagination>
        </div>

    		<!--上传弹窗-->
    		<el-dialog title="上传过滤规则" :visible.sync="dialogFormVisible">
            <el-row>
      			   <el-upload
      				  class="upload-rules"
      				  ref="upload"
      				  action=""
      				  :multiple="false"
      				  :limit="1"
                accept="rules"
                :auto-upload="false"
      				  :on-exceed="handleExceed"
                :on-remove="handleRemove" 
                :on-change="handleChange"
                :before-remove="beforeRemove"
                :beforeUpload="beforeUpload"
      				  :file-list="fileList"
      				  :list-type="typeList"
                :http-request="setUpload">
      				  <el-button slot="trigger" size="small" type="primary" icon="el-icon-plus">选取文件</el-button>
    				    </el-upload>
    			</el-row>
          <p v-show="isUpload" style="width: 100%;text-align: center;"><i class="el-icon-loading"></i>上传中，请稍后..</p>
          <p style="color:red;">{{fileMsg}}</p>
          <div slot="footer" class="dialog-footer" style="text-align: center">
            <!-- <el-button @click="dialogFormVisible = false" :disabled="ulDisabledBtn">取 消</el-button> -->
            <el-button type="primary" @click="submitUpload" :disabled="ulDisabledBtn">确 定</el-button>
          </div>
        </el-dialog>

        <!--详情弹窗-->
        <el-dialog title="详情查看" :visible.sync="infodialogFormVisible" >
          <el-form label-position="left"  :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin: 0 auto;">
            <el-row>
              <el-col :span="12" style="padding-right:30px;">
                   <el-form-item label="Sid" prop="sid">
                    <el-input v-model="ruleForm.sid"></el-input>
                  </el-form-item>

                  <el-form-item label="分数" prop="score">
                    <el-input v-model="ruleForm.score"></el-input>
                  </el-form-item>

                  <el-form-item label="动作" prop="action">
                    <el-input v-model="ruleForm.action"></el-input>
                  </el-form-item>

                  <el-form-item label="协议" prop="protocol">
                    <el-input v-model="ruleForm.protocol"></el-input>
                  </el-form-item>

                  <el-form-item label="源IP" prop="srcIp">
                    <el-input v-model="ruleForm.srcIp"></el-input>
                  </el-form-item>

                <el-form-item label="源端口" prop="srcPort">
                  <el-input v-model="ruleForm.srcPort"></el-input>
                </el-form-item>

               <!--  <el-form-item label="TcpSeq" prop="TcpSeq">
                <el-input v-model="ruleForm.TcpSeq"></el-input>
               </el-form-item> -->
              </el-col>

              <el-col :span="12">
                <el-form-item label="目标IP" prop="destIp">
                  <el-input v-model="ruleForm.destIp"></el-input>
                </el-form-item>

                <el-form-item label="目标端口" prop="destPort">
                  <el-input v-model="ruleForm.destPort"></el-input>
                </el-form-item>

                <el-form-item label="类型" prop="classtype">
                  <el-input v-model="ruleForm.classtype"></el-input>
                </el-form-item>

                <el-form-item label="CVE参考编号" prop="referenceCve">
                  <el-input v-model="ruleForm.referenceCve"></el-input>
                </el-form-item>

                <el-form-item label="CVE参考信息URL" prop="referenceUrl" class="cve">
                  <el-input v-model="ruleForm.referenceUrl"></el-input>
                </el-form-item>

                <el-form-item label="留向" prop="flow">
                  <el-input v-model="ruleForm.flow"></el-input>
                </el-form-item>

                <!-- <el-form-item label="EsTime" prop="EsTime">
                  <el-input v-model="ruleForm.EsTime"></el-input>
                </el-form-item> -->
            </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="消息" prop="msg">
                  <el-input v-model="ruleForm.msg"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer" style="text-align: center">
            <el-button type="primary" @click=" infodialogFormVisible = false " class="btns_w">确定</el-button>
          </div>
        </el-dialog>

      </section>
    </div>
  </div>
</template>
<script>
  import { getSRulesPage, getRCons, getRulesInfo, upLoad } from '../../api/setting/snort_rules.js'
  import { destroyCache, filterItems } from '../../utils/deleCache.js'

  export default {
    name:'list11',
    data() {
      return {
        total:0,//默认数据总数
        pagesize:15,//每页的数据条数
        currentPage:1,//默认开始页面
        istag: true,
        input:"",
        tableHeight: document.documentElement.clientHeight - 215,
        dialogFormVisible: false,
        infodialogFormVisible: false,
        isFalse: false,
        ruleForm: {
          sid: '',
          score: '',
          action: '',
          protocol: '',
          srcIp: '',
          srcPort: '',
          flow: '',
          destIp: '',
          destPort: '',
          classtype: '',
          referenceCve: '',
          referenceUrl: '',
          msg: ''
        },
        actionFilter: [],
        protocolFilter: [],
        typeFilter: [],
        tableData: [],
        //上传
        fileList: [], //上传的文件列表
        typeList: 'rules', //文件列表的类型
        ulDisabledBtn: false,
        isUpload: false,  
        filterName: {},
        fileMsg: '',
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
      switchChange(){

      },
      created() {
        this.total = this.tableData.length;
      },
      current_change(currentPage) {
        this.currentPage = currentPage;
        this.getSRulesList();
      },
      //上传
      //删除文件
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.fileList = [];
      },
      beforeRemove(file, fileList) {
        //return this.$confirm(`确定移除 ${ file.name }？`);
        const extension = file.name.split('.')[1] === 'rules'
        if (extension === false) {
          return this.$confirm(`文件格式错误，是否移除 ${ file.name }？`);
        } else {
          return this.$confirm(`确定移除 ${ file.name }？`);
        }
      },
      //文件超出个数限制时的钩子
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      //文件发生改变时的钩子
      handleChange(file, fileList) {
        if (file) {
          this.fileMsg = "";
        }
      },
      //自定义上传
      setUpload(file) {
        if (file.file) {
          this.ulDisabledBtn = true;
          this.isUpload = true;
          var form = new FormData();
          // 文件对象
          form.append("file", file.file);
          var that = this;
          upLoad(form).then(res => {

            this.$message({
                type: 'success',
                message: res.msg
            });
            that.ulDisabledBtn = false;
            that.isUpload = false;
            that.dialogFormVisible = false;
            this.fileList = [];
          }).catch(() => {
            that.ulDisabledBtn = false;
            that.isUpload = false;
          })

        } else {
          this.$message({
            type: 'warning',
            message: '请选择上传文件'
          })
        }
      },
      // 确定上传
      submitUpload() {
        this.beforeUpload();
      	this.$refs.upload.submit();
      },
      beforeUpload(file) {
        if (file == undefined) {
          this.fileMsg = "请选择上传文件";
          return false;
        }
        const extension = file.name.split('.')[1] === 'rules'
        return extension;
      },
      /*//动作过滤
      filterAction(value, row, column) {
        value = value.toLowerCase();
        const property = column['property'];
        return row[property] === value;
      },
      //协议过滤
      filterProtocol(value, row, column) {

        value = value.toLowerCase();
         const property = column['property'];
        return row[property] === value;
      },
      //类型过滤
      filterType(value, row, column) {
         value = value.toLowerCase();
         const property = column['property'];
        return row[property] === value;
      },*/
      //筛选事件
      filterChange(filters) {
         this.filterName = filterItems(filters, this.filterName);
         this.getSRulesList();
      },
      //类型英文转中文
      classTypeFormat(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined ){
          return '—'
        } else {
            for (var i in this.typeFilter) {
              if (arr == this.typeFilter[i].value) {
                return this.typeFilter[i].text
              }
            }
        }

      },
      //常量
      getRulesCon() {
        var that = this;
        getRCons().then(res => {
            var result = res.result;
            //动作
            var actions = result.actionsType;
            for (var i in actions) {
              that.actionFilter.push({
                text: actions[i],
                value: i
              })
            }

            //协议
            var protocols = result.protocolMap;
            for (var i in protocols) {
              that.protocolFilter.push({
                text: protocols[i],
                value: i
              })
            }

            //类型
            var type = result.snortClassTypeMap;
            for (var i in type) {
              that.typeFilter.push({
                text: type[i],
                value: i
              })
            }

        })
      },
      //列表
      getSRulesList() {
        var that = this;
        var param = {
          'numPerPage': this.pagesize,
          'pageNum': this.currentPage
        }
        //param = Object.assign(this.filterName, param);
        for(var i in this.filterName) {
          param[i+'Q'] = this.filterName[i];
        }
        getSRulesPage(param).then(res => {
          var list = [];
          if (res.result.results != null) {
            list = res.result.results;
          }
          that.tableData = list;
          that.total = res.result.totalCount;

          //var vnode = this.$vnode;
          //destroyCache(vnode);
          

        })
      },
      //详情
      info(index, row) {

        //this.ruleForm = Object.assign({}, row)
        var that = this;
        var param = { 'sid' : row.sid}
        getRulesInfo(param).then(res => {
          that.ruleForm = res.result;
          that.infodialogFormVisible = true;
        })
      }
    },
    mounted() {
      //获取列表
      this.getSRulesList();

      //获取常量
      this.getRulesCon();
    }
  };
</script>

<style>
  .el-table-filter__list{
    height:300px;
    overflow-y: auto;
  }
  .cve .el-form-item__label{
    line-height: 20px;
  }
</style>

