<template>
  <div class="title">
    <div class="filter-container">
      <section class="app-container">
        <!--工具条-->
       <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
         <el-form :inline="true">
           <el-form-item>
             <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible = true">上传告警类型</el-button>
           </el-form-item>
         </el-form>
       </el-col>
       <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 10px;">
        <el-upload
       		  class="upload-demo"
       		  action=""
       		  :on-preview="handlePreview"
       		  :on-remove="handleRemove"
       		  :before-remove="beforeRemove"
       		  multiple
       		  :limit="3"
       		  :on-exceed="handleExceed"
       		  :file-list="fileList">
       		  <el-button size="small" type="primary" icon="el-icon-plus">上传过滤规则</el-button>
       		  <span slot="tip" class="el-upload__tip">（只能上传jpg/png文件，且不超过500kb）</span>
       		</el-upload>
       		</el-col> -->

        <div class="container_table">
          <el-table
            :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
            style="width: 100%" :height="tableHeight"
            :default-sort = "{prop: 'date', order: 'descending'}">
            <el-table-column width="50" type="index">
              <template scope="scope">
                  <span>{{ pagesize * (currentPage - 1)  + 1 + scope.$index  }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="classtype"
              :formatter="fmtLength"
              label="英文名"
              width="200"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="classtypeZh"
              :formatter="fmtLength"
              label="中文名"
              width="200"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="priority"
              label="等级"
              :formatter="priorityFormat"
              width="80"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="category"
              label="类别"
              :formatter="fmtLength"
              width="150"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="description"
              :formatter="fmtLength"
              label="描述"
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
                accept="xls"
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

      </section>
    </div>
  </div>
</template>
<script>
  import { getSCTypePage, upLoad } from '../../api/setting/snort_classtype.js'
  import { getDetecConstant } from '../../api/setting/detec.js'
  export default {
    data() {
      return {
        total:0,//默认数据总数
        pagesize:15,//每页的数据条数
        currentPage:1,//默认开始页面
        istag: true,
        input:"",
        tableHeight: document.documentElement.clientHeight - 215,
        dialogFormVisible: false,
        tableData: [
          /*{
            classtype: '',
            classtypeZh: '',
            priority: '',
            category: '',
            description: ''
          }*/
        ],
        priority: [],
        //上传
        fileList: [], //上传的文件列表
        typeList: 'xls', //文件列表的类型
        ulDisabledBtn: false,
        isUpload: false,
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
        this.currentPage = currentPage;
      },
      priorityFormat(row, column) {
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined ){
          return '—'
        } else {
          switch(arr) {
            case 'high':
              return '高危'
              break;
            case 'medium':
              return '中危'
              break;
            case 'low':
              return '低危'
              break;
            case 'very low':
              return '严重'
              break;
          }
        }

        /*for (var i in this.priority) {
            if (row[column['property']] == i) {
                return this.priority[i]
            }
        }*/
      },
      //上传
      //删除文件
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.fileList = [];
      },
      beforeRemove(file, fileList) {
        const extension = file.name.split('.')[1] === 'xls'
        const extension2 = file.name.split('.')[1] === 'xlsx'
        if (extension === false && extension2 === false) {
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
            that.fileList = [];
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
        const extension = file.name.split('.')[1] === 'xls'
        const extension2 = file.name.split('.')[1] === 'xlsx'
        return extension || extension2;
      },
      getDetecCon() {
          var that = this;
          getDetecConstant().then(res => {
              var prtemp = res.result.priority;
              //填充priority
              for (var i in prtemp) {
                that.priority.push({
                     value: i,
                     text: prtemp[i]
                });
              }
          })
      },
      //列表
      getSCTypeList() {
        var that = this;
        getSCTypePage().then(res => {
          if (res.result != null) {
            var list = res.result;
            that.tableData = list;
            that.total = that.tableData.length;
          }

        })
      }
    },
    mounted() {
      //获取列表
      this.getSCTypeList();

      //获取常量
      this.getDetecCon();
    }
  };
</script>

