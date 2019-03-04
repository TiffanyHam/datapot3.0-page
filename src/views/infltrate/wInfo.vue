<template>
  <div class="pageOverflow">
  <div class="title company_ip infomation" style="height:89%;overflow: auto;padding:10px 0;background: rgb(246,248,249)">
    <section class="app-container" v-loading="loadding">
      <div class="w-f-title">
        <el-row>
            <el-col :span="20">报告详情</el-col>
            <el-col :span="4">
              <!-- <router-link :to="{name:'infiltrate-web', params:{activeName: 'second'}}" class="fr" style="padding-right:20px;">< 返回</router-link> -->
               <a href="javascript:;" @click="blackwt" class="fr" style="padding-right:20px;">< 返回</a>
            </el-col>

           
        </el-row>
      </div>

      <el-row>
        <el-col :span="12">
          <div class="w-f-box">
               <el-row>
                  <el-col :span="4"><i :class=" 'reportsIcon r_'+levelInfo.level "></i></el-col>
                  <el-col :span="20">
                      <el-button type="primary" class="fr" @click="downloadReports">导出报告</el-button>
                      <h2 class="w-i-lineh">{{levelArr[levelInfo.level]}}</h2>
                      <p class="w-i-lineh">URL：{{levelInfo.address}}</p>
                      <p class="w-i-lineh">特征描述：{{levelInfo.characterDescription}}</p>
                  </el-col>
                </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="w-f-box1">
              <div class="w-f-title">扫描状态<span class="" style="background:#3a8ee6;color:#fff;font-size:10px;padding:2px 10px;margin-left:5px;">{{getScanStatus(statusInfo.scanStatus)}}</span>
              </div>
              <div style="padding:15px;">
                  <div>进度: <el-progress :percentage="percen"></el-progress></div>
                  <p class="w-i-lineh">开始时间：{{statusInfo.startTime}}</p>
                  <p class="w-i-lineh">结束时间：{{statusInfo.endTime}}</p>
              </div>
          </div>
        </el-col>
      </el-row>
      
      <div class="w-f-border">
        <el-row>
          <el-col :span="8"><div class="text-a-c"><p class="w-i-lineh">扫描时长</p><p class="w-i-lineh">{{statusInfo.scanTime}} mm</p></div></el-col>
          <el-col :span="8"><div class="text-a-c"><p class="w-i-lineh">请求数量</p><p class="w-i-lineh">{{statusInfo.requestCount}}</p></div></el-col>
          <el-col :span="8"><div class="text-a-c"><p class="w-i-lineh">平均响应时长</p><p class="w-i-lineh">{{statusInfo.avgTime}}</p></div></el-col>
        </el-row>
      </div>

      
      <el-row>
        <el-col :span="12">
          <div class="w-f-border" style="padding:0;">
              <div class="w-f-title">关联URL</div>
              <ul style="padding:15px;height:100px;overflow:auto;">
                <li class="w-i-lineh" v-for="item in correlationDomain">
                  <el-row>
                    <el-col :span="20">{{item}}</el-col>
                    <el-col :span="4"><el-button type="text" icon="el-icon-plus" style="padding:0;" @click="addTargetMode(item)">新增目标</el-button></el-col>
                  </el-row>
                </li>
              </ul>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="w-f-border" style="padding:0;">
            <div class="w-f-title">最近告警信息 
              <span class="fr">
                <!-- <span class="w-f-i">12</span>
                <span class="w-f-i">10</span> -->
                <span :class="'w-f-i severityC_'+index" v-for="(value,index) in severityCount">{{value}}</span>
              </span>
            </div>
            <ul style="padding:15px;height:100px;overflow:auto;">
                <li class="w-i-lineh" v-for="(item,index) in warnInfo">
                  <el-row>
                    <el-col :span="16">
                      <div  class="over-c">
                        <i :class="'warnIcon warnIcon_'+item.severity" style="margin-bottom:-4px;"></i></i> {{item.warnName}}
                      </div>
                    </el-col>
                    <el-col :span="8" style="text-align: right;">{{item.time}}</el-col>
                  </el-row>
                </li>
            </ul>
          </div>
        </el-col>
      </el-row>


      <div class="w-f-border" style="padding:0;">
        <div class="w-f-title">漏洞列表</div>
         <div style="padding:0 2%;width:96%;height:100%;">
           <el-table
              :data="tableData"
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
                prop="level"
                :formatter="leveFormatter"
                label="威胁等级" 
                width="100">
              </el-table-column>

              <el-table-column
                prop="vulnName" 
                :formatter="fmtLength"
                label="漏洞名称">
              </el-table-column>

              <el-table-column
                prop="url" 
                :formatter="fmtLength"
                label="URL">
              </el-table-column>
          </el-table>
        </div>
      </div>

      <!--新增目标-->
      <el-dialog title="新增目标" :visible.sync="dialogTragtFormVisible" width="450px">
      <el-form :model="domainNameForm"  :rules="domainNameRules" ref="domainNameForm" label-width="80px">
        <el-form-item label="URL" prop="address">
          <el-input v-model="domainNameForm.address" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="domainNameForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer"  style="text-align: center">
        <el-button @click=" dialogTragtFormVisible = false ">取 消</el-button>
        <el-button type="primary" @click="addTragt">确 定</el-button>
      </div>
    </el-dialog>
      
      <!--导出-->
      <div style="width:100%;height:1px;overflow:hidden;position: relative;background:rgb(246, 248, 249);">
        <div id="pdfDom">
          <div v-html="dlContxt1"></div>
        </div>
      </div>

    </section>
  </div>

  </div>
</template>

<script>
  import html2Canvas from 'html2canvas'
  import JsPDF from 'jspdf'
  import { checkURLAddr } from '../../utils/validate.js'
  import{ getReports, getReportsPage, addTarget } from '../../api/infltrate/infltrate.js'

  export default {
    filters: {
      stageFormat(num) {
        const stageMap = {
          'nmap': '紧急',
          'fail': '高危',
          'running': '中危',
          'finish': '低危'
        }
        return stageMap[num]
      }
    },
    data() {
      return {
        loadding:true,
        tableData: [],
        currentPage: 1,
        pagesize: 15,
        levelArr: {2:'中危', 1:'低危', 3:'高危', 0:'安全'}, //风险等级常量
        //页面传递参数
        reports: '',
        scanId: '',//'26104db5-142b-47a2-988d-c137503b6fd6',
        //新增目标
        dialogTragtFormVisible: false,
        domainNameRules: {},
        domainNameForm: {
          address: '',
          description: ''
        },
        //报告详情
        levelInfo: {
          address: '—',
          characterDescription: '—',
          level: '—'
        },
        //扫描信息
        statusInfo: {
          startTime: '—',
          endTime: '—',
          scanStatus: '—',
          requestCount: '—',
          scanTime: '—',
          avgTime: '—'
        },
        percen: 0,
        testScanTime: '',
        severityCount: {},
        //关联url
        correlationDomain: [],
        //最近告警信息
        warnInfo: [],
        //漏洞列表
        vulnInfoList: [],
        //生成报告
        dlContxt: '',
        dlContxt1: '',
      }
    },
    methods: {
      getScanStatus(status) {
        var result = "—";
        switch(status) {
          case 'aborted':
            result = '终止'
            break;
          case 'aborting':
            result = '终止'
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
          case 'scheduled':
            result = '等待'
            break;
          case 'processing':
            result = '扫描中'
            break;

        }
        return result;
      },
      fmtLength(row, column){
        const arr = row[column.property]
        if(arr === null || arr === '' || arr === undefined){
          return '—'
        } else {
          return arr
        }
      },
      leveFormatter(row, column){
        var val = row[column.property]
            val = Number(val);
        return this.levelArr[val] || '—'
      },
      //获取报告
      downloadReports() {
        this.loadding = true;
        var that = this;
        var param = {
          'list_type': 'scans',
          'id_list': this.scanId
        }
        getReports(param).then(res=> {
          that.dlContxt = res.result.html;
          that.setDlContxt();
        })
      },
      //设置报告内容
      setDlContxt() {
        this.loadding = false;
        //var d = this.dlContxt.split("</head>");
        //this.dlContxt1 = d[1];
        var d = this.dlContxt.split("</style>");
        var dd = d[1].replace(/Acunetix/g,"datapot");//截取html标签
            //dd = dd.replace(/Acunetix/,"datapot");
        this.dlContxt1 = dd;
        this.$nextTick(() =>{
            var clogo = document.querySelector('#pdfDom img.logo');
                //clogo.setAttribute("src","");
                clogo.src = "";
            var cover = document.querySelector('#pdfDom .cover img');
                cover.src = "";
            
            //生存报告
            this.getpdf();
        })
          

        
      },
      //生成报告
      getpdf() {
   
        //var newwindow = window.open('', "_blank",'');
        //newwindow.document.write(this.dlContxt);
        var title = "PenetrationTest";
        html2Canvas(document.querySelector('#pdfDom'), {
           allowTaint: true
        }).then(function (canvas) {
            let contentWidth = canvas.width
            let contentHeight = canvas.height
            let pageHeight = contentWidth / 592.28 * 841.89
            let leftHeight = contentHeight
            let position = 0
            let imgWidth = 595.28
            let imgHeight = 592.28 / contentWidth * contentHeight
            let pageData = canvas.toDataURL('image/jpeg', 1.0)
            let PDF = new JsPDF('', 'pt', 'a4')
            if (leftHeight < pageHeight) {
             PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
            } else {
             while (leftHeight > 0) {
               PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
               leftHeight -= pageHeight
               position -= 841.89
               if (leftHeight > 0) {
                PDF.addPage()
               }
             }
            }
            PDF.save(title + '.pdf')

        })

        this.loadding = false;
      },
      //新增目标
      addTargetMode(item) {
        this.domainNameForm.address = item;
        this.dialogTragtFormVisible = true 
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

            this.searchReportInfo();
        })
      },
      //定时任务
      setTimeGetScanProc() {
        var that = this;
        var param = {
          'scanId': this.scanId
        }
        getReportsPage(param).then(res => {
          if (res.result.statusInfo.scanStatus) {
            var status = res.result.statusInfo.scanStatus;
            if(status == 'completed' || status == 'aborted' || status == 'aborting') {
              window.clearInterval(that.testScanTime);
              that.percen = 100;
            } else {
              that.percen = Math.ceil((that.percen+1.6))
            }
          }
          
        })
      },
      //初始化页面
      searchReportInfo() {
        
        var that = this;
        var param = {
          'scanId': this.scanId
        }
        getReportsPage(param).then(res => {
          
          this.loadding = false;
          res.result.levelInfo != null ? that.levelInfo = res.result.levelInfo : '';
          res.result.statusInfo != null ? that.statusInfo = res.result.statusInfo : '';
          res.result.correlationDomain != null ? that.correlationDomain = res.result.correlationDomain : '';
          res.result.warnInfo != null ? that.warnInfo = res.result.warnInfo : '';
          res.result.vulnInfoList != null ? that.tableData = res.result.vulnInfoList : '';
          
          //json字符串转对象
          if(res.result.severityCount) {
            for(var i in res.result.severityCount) {
                var str = res.result.severityCount
                var obj = eval('(' + str + ')');
                that.severityCount = obj;
            }
          }

          //创建定时任务
          if (res.result.statusInfo != null && res.result.statusInfo.scanStatus) {
            var status = res.result.statusInfo.scanStatus;
            if(status != 'completed' && status != 'aborted' && status != 'aborting') {
               window.clearInterval(that.testScanTime);
               that.testScanTime = setInterval(that.setTimeGetScanProc, 60000);
            } else {
              that.percen = 100
            }
          }

        })

      },
      //返回
      blackwt() {
        localStorage.setItem('webAName', 'second');
        this.$router.push({path:'/infiltrate-web'})
      },
      //获取参数
      saveWEBtestParam() {
        
        if (this.$route.params.reports) {
          this.reports = this.$route.params.reports;
          localStorage.setItem('reports', JSON.stringify(this.reports));
        } else {
          var obj = localStorage.getItem('reports');
          obj = JSON.parse(obj);
          this.reports = obj;
        }

        this.scanId = this.reports.scanId

        //初始化页面
        this.searchReportInfo();

      }
    },
    mounted() {

      //查询报告详情
      this.saveWEBtestParam();
     
    }
  }
</script>

<style scoped>
.w-f-title{
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  padding-left:20px;
}
.w-f-border, .w-f-box, .w-f-box1{
  border: 1px solid #dcdfe6;
  margin: 15px 15px 0px 15px;
  padding: 15px;
  background: #fff;
  -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  height:auto;
  overflow:hidden;
}
.w-f-box{
  height:120px;
}
.w-f-box1{
  padding:0;
  height:150px;
}
.text-a-c{
  text-align: center;
}
.w-f-i, .warnIcon, .reportsIcon{
  font-size:10px;
  background:red;
  width:28px;
  height:15px;
  line-height: 15px;
  display: inline-block;
  text-align:center;
  color:#fff;
  margin-right:10px;
}
.severityC_2{
    background:#ff8309;
}
.severityC_0{
    background:#1296db;
}
.severityC_1{
    background:#ffcd3c;
}
.severityC_3{
    background:#ff0000;
}
.warnIcon{
  width:15px;
}
.warnIcon_0{
  background:url(../../assets/images/infltrate/warnIcon_0.png) center center no-repeat;
  background-size:15px 15px;
}
.warnIcon_1{
  background:url(../../assets/images/infltrate/warnIcon_1.png) center center no-repeat;
  background-size:15px 15px;
}
.warnIcon_2{
  background:url(../../assets/images/infltrate/warnIcon_2.png) center center no-repeat;
  background-size:15px 15px;
}
.warnIcon_3{
  background:url(../../assets/images/infltrate/warnIcon_3.png) center center no-repeat;
  background-size:15px 15px;
}

.over-c{
  width:100%;
  overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
}
.w-i-lineh{
  line-height: 25px;
}
.reportsIcon{
  width:80px;
  height: 90px;
  line-height: auto;
  background: url(../../assets/images/infltrate/r_m.png) no-repeat;
}
.reportsIcon.r_0{
  background: url(../../assets/images/infltrate/r_0.png) no-repeat;
}
.reportsIcon.r_1{
  background: url(../../assets/images/infltrate/r_1.png) no-repeat;
}
.reportsIcon.r_2{
  background: url(../../assets/images/infltrate/r_2.png) no-repeat;
}
.reportsIcon.r_3{
  background: url(../../assets/images/infltrate/r_3.png) no-repeat;
}

/*pdf*/
#pdfDom{
  width:98%;
  height:auto;
  padding-left:20px;
  line-height:25px;
}
#pdfDom >>> table {
    table-layout: fixed;
    border-collapse: collapse;
    width:96%;
    margin:0 2%;
    border: 0px;
}
#pdfDom >>> table tr td {
    padding: 4px 8px;
    border: 1px solid #dadada;
    word-wrap: break-word;
}

#pdfDom >>> table tbody tr td:first-child {
    width: 200px;
}

#pdfDom >>> p {
    word-wrap: break-word;
}

#pdfDom >>> .page-break {
    page-break-before: always;
}
#pdfDom >>> .ax-section-title {
    border-bottom: 1px solid #cccccc;
    padding-bottom: 2px;
    font-size: 20px;
    margin: 20px 0;
}
#pdfDom >>> .ax-section-title--big {
    border-bottom-width: 3px;
    padding-bottom: 3px;
    padding-top: 30px;
}
#pdfDom >>> .cover {
    width: 210mm;
    /* height: 297mm; */
    height:183mm;
}
#pdfDom >>> .cover img {
    width: 210mm;
    left: 20mm;
    z-index: -1;
    top: 60mm;
    position: absolute;
}
#pdfDom >>> .logo {
    position: absolute;
    top: 40px;
    left: 40px;
}
#pdfDom >>> .ax-report__title {
    font-size: 42pt;
    font-weight: bold;
    text-align: left;
    top: 100mm;
    left: 40mm;
    width: 170mm;
    position: absolute;
    height: 70mm;
}
#pdfDom >>> .ax-report__title_compliance {
    font-size: 38pt;
    font-weight: bold;
    text-align: center;
    top: 100mm;
    left: 20mm;
    width: 210mm;
    position: absolute;
    height: 70mm;
}
#pdfDom >>> .ax-report__subtitle {
    text-align: left;
    font-size: 21pt;
    /* top: 180mm; */
    top:121mm;
    left: 40mm;
    width: 210mm;
    position: absolute;
}
#pdfDom >>> .ax-report__footer {
    border-bottom: 1px solid #cccccc;
    padding-bottom: 10px;
    left: 40mm;
    /* top: 320mm; */
    top:152mm;
    position: absolute;
    width: 70%;
}
#pdfDom >>> .ax-report__subfooter {
    left: 40mm;
    font-size: 8pt;
    /* top: 330mm; */
    top:164mm;
    position: absolute;
}
#pdfDom >>> .ax-report__title_date {
    text-align: left;
    left: 40mm;
    font-size: 13pt;
    /* top: 220mm; */
    top:136mm;
    position: absolute;
}
#pdfDom >>> .ax-alert-title {
    box-sizing: border-box;
    border-bottom: 2px solid #cccccc;
    padding-bottom: 3px;
    background-color: gray;
    color: white;
}
#pdfDom >>> .ax-severity-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: baseline;
    border: none;
    /* background: url('images/severity.png'); */
    box-sizing: border-box;
    margin-right: 10px;
    position: relative;
    top: 1px;
}
#pdfDom >>> .ax-severity-icon--high   {background-position: 0 0;}
#pdfDom >>> .ax-severity-icon--medium {background-position: 0 -16px;}
#pdfDom >>> .ax-severity-icon--low    {background-position: 0 -32px;}
#pdfDom >>> .ax-severity-icon--info   {background-position: 0 -48px;}
#pdfDom >>> .ax-alerts-distribution__label > img {margin-right: 5px;}
#pdfDom >>> table.ax-alert-info tbody tr td:first-child {
    background-color: #E3E3E3;
}
#pdfDom >>> table.ax-alert-info tbody tr td.ax-alert-info__severity_value {
    font-weight: bold;
}
#pdfDom >>> .ax-affected-item__highlight--dark { background-color: #cccccc; }
#pdfDom >>> .ax-affected-item__highlight--light { background-color: #eeeeee; }

</style>