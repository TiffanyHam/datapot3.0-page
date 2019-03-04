<template>
  <div class="pageOverflow">

    <div class="title company_ip infomation" style="overflow: auto">
      <div class="filter-container">
        <el-col :span="9">
          <img src="../../assets/images/panorama/datapot.png" width="70" class="fr" style="margin-top:9%;" />
        </el-col>
        <el-col :span="15">
          <div class="dataPotTitle fl">
            <h1>神灯数据威胁情报库</h1>
            <p style="font-size: 18px">DataPot AIS Threat Intelligence Database</p>
          </div>
        </el-col>
        <section class="app-container" ref="threatInfo">
        <div style="width:50%;margin:0 auto;">
          <el-row>
            <el-col :span="24">
              <div style="">
                <el-tabs v-model="activeName"  @tab-click="handleClick" class="tabsNam">
                  <el-tab-pane style="">
                    <span slot="label" name="first"><i :class="{'el-icon-ipInfo':true, 'on':(isTrue=='0'?true:false)}"></i> IP查询</span>
                    <el-row>
                      <el-col :span="24" class="testBts1">
                        <el-col :span="21">
                          <el-input placeholder="请输入查询信息" v-model="searchIP.key" style="width:100%" class="fl"></el-input>
                        </el-col>
                        <el-col :span="3">
                          <el-button type="primary" @click="IPSearch" class="fr"><i class="el-icon-search"></i>&nbsp;查询</el-button>
                        </el-col>
                      </el-col>
                    </el-row>
                  </el-tab-pane>
                  <el-tab-pane>
                    <span slot="label" name="second"><i :class="{'el-icon-nameInfo':true, 'on':(isTrue=='1'?true:false)}"></i> 域名查询</span>
                    <el-row>
                      <el-col :span="24" class="testBts1">
                        <el-col :span="21">
                          <el-input placeholder="请输入查询信息" v-model="searchName.key" class="fl" style="width:100%"></el-input>
                        </el-col>
                        <el-col :span="3">
                          <el-button type="primary" class="fr" @click="nameSearch"><i class="el-icon-search"></i>&nbsp;查询</el-button>
                        </el-col>
                      </el-col>
                    </el-row>
                  </el-tab-pane>
                  <el-tab-pane>
                    <span slot="label" name="third"><i :class="{'el-icon-mailInfo':true, 'on':(isTrue=='2'?true:false)}"></i> 邮箱查询</span>
                    <el-row>
                      <el-col :span="24" class="testBts1">
                        <el-col :span="21">
                          <el-input placeholder="请输入查询信息" v-model="searchEmail.key" class="fl" style="width:100%"></el-input>
                        </el-col>
                        <el-col :span="3">
                          <el-button type="primary" class="fr"  @click="emailSearch"><i class="el-icon-search"></i>&nbsp;查询</el-button>
                        </el-col>
                      </el-col>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
              </div>

            </el-col>
          </el-row>
        </div>
        <!-- IP查询结果-->
        <div class="t-result1" v-show="isIPResult">
          <el-row>
            <el-col :span="24">
              <div v-show="searchIP.isNoResult" class="searchResult-n">
                <i class="el-icon-warning"></i> 情报库未发现可疑信息！
              </div>
              <div v-show="searchIP.status" class="searchResult-y">
                <p class="titlen">查询结果</p>
                <img src="../../assets/images/info-result.png" class="searchResult-y-img"/>
                <div v-for="(item,index) in IPform">
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">ID</el-col>
                      <el-col :span="18">{{item.indicator}}</el-col>
                    </el-row>
                  </div>
                  <div class="info">
                    <el-row>
                      <el-col :span="6">类型</el-col>
                      <el-col :span="18">{{item.itype}}</el-col>
                    </el-row>
                  </div>
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">端口列表</el-col>
                      <el-col :span="18">{{item.portlist}}</el-col>
                    </el-row>
                  </div>
                  <div class="info">
                    <el-row>
                      <el-col :span="6">协议</el-col>
                      <el-col :span="18">{{item.protocol}}</el-col>
                    </el-row>
                  </div>
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">来源</el-col>
                      <el-col :span="18">{{item.provider}}</el-col>
                    </el-row>
                  </div>
                  <div class="info">
                    <el-row>
                      <el-col :span="6">上报时间</el-col>
                      <el-col :span="18">{{item.reporttime}}</el-col>
                    </el-row>
                  </div>
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">可信度</el-col>
                      <el-col :span="18">{{item.confidence}}</el-col>
                    </el-row>
                  </div>
                  <div class="info">
                    <el-row>
                      <el-col :span="6">标签</el-col>
                      <el-col :span="18">{{item.tags}}</el-col>
                    </el-row>
                  </div>
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">描述</el-col>
                      <el-col :span="18">{{item.protocol}}</el-col>
                    </el-row>
                  </div>
                  <div class="info">
                    <el-row>
                      <el-col :span="6">国家简称</el-col>
                      <el-col :span="18">{{item.cc}}</el-col>
                    </el-row>
                  </div>
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">城市</el-col>
                      <el-col :span="18">{{item.city}}</el-col>
                    </el-row>
                  </div>
                  <div class="info">
                    <el-row>
                      <el-col :span="6">时区</el-col>
                      <el-col :span="18">{{item.timezone}}</el-col>
                    </el-row>
                  </div>
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">纬度</el-col>
                      <el-col :span="18">{{item.latitude}}</el-col>
                    </el-row>
                  </div>
                  <div class="info" style="padding-bottom: 2%;">
                    <el-row>
                      <el-col :span="6">经度</el-col>
                      <el-col :span="18">{{item.longitude}}</el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!--  域名查询结果-->
        <div class="t-result1" v-show="isPortResult">
          <el-row>
            <el-col :span="24">
              <div v-show="searchName.isNoResult" class="searchResult-n">
                <i class="el-icon-warning"></i> 情报库未发现可疑信息！
              </div>
              <div v-show="searchName.status" class="searchResult-y">
                <p class="titlen">查询结果</p>
                <img src="../../assets/images/info-result.png" class="searchResult-y-img"/>
                <div v-for="(item,index) in nameform">
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">ID</el-col>
                      <el-col :span="18">{{item.indicator}}</el-col>
                    </el-row>
                  </div>
                  <div class="info">
                    <el-row>
                      <el-col :span="6">类型</el-col>
                      <el-col :span="18">{{item.itype}}</el-col>
                    </el-row>
                  </div>
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">端口列表</el-col>
                      <el-col :span="18">{{item.portlist}}</el-col>
                    </el-row>
                  </div>
                  <div class="info">
                    <el-row>
                      <el-col :span="6">协议</el-col>
                      <el-col :span="18">{{item.protocol}}</el-col>
                    </el-row>
                  </div>
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">来源</el-col>
                      <el-col :span="18">{{item.provider}}</el-col>
                    </el-row>
                  </div>
                  <div class="info">
                    <el-row>
                      <el-col :span="6">上报时间</el-col>
                      <el-col :span="18">{{item.reporttime}}</el-col>
                    </el-row>
                  </div>
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">可信度</el-col>
                      <el-col :span="18">{{item.confidence}}</el-col>
                    </el-row>
                  </div>
                  <div class="info">
                    <el-row>
                      <el-col :span="6">标签</el-col>
                      <el-col :span="18">{{item.tags}}</el-col>
                    </el-row>
                  </div>
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">描述</el-col>
                      <el-col :span="18">{{item.protocol}}</el-col>
                    </el-row>
                  </div>
                  <div class="info">
                    <el-row>
                      <el-col :span="6">国家简称</el-col>
                      <el-col :span="18">{{item.cc}}</el-col>
                    </el-row>
                  </div>
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">城市</el-col>
                      <el-col :span="18">{{item.city}}</el-col>
                    </el-row>
                  </div>
                  <div class="info">
                    <el-row>
                      <el-col :span="6">时区</el-col>
                      <el-col :span="18">{{item.timezone}}</el-col>
                    </el-row>
                  </div>
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">纬度</el-col>
                      <el-col :span="18">{{item.latitude}}</el-col>
                    </el-row>
                  </div>
                  <div class="info" style="padding-bottom: 2%;">
                    <el-row>
                      <el-col :span="6">经度</el-col>
                      <el-col :span="18">{{item.longitude}}</el-col>
                    </el-row>
                  </div>
                </div>

              </div>
            </el-col>
          </el-row>
        </div>

        <!--  邮箱查询结果-->
        <div class="t-result1" v-show="isMailResult">
          <el-row>
            <el-col :span="24">
              <div v-show="searchEmail.isNoResult" class="searchResult-n">
                <i class="el-icon-warning"></i> 情报库未发现可疑信息！
              </div>
              <div v-show="searchEmail.status" class="searchResult-y">
                <p class="titlen">查询结果</p>
                <img src="../../assets/images/info-result.png" class="searchResult-y-img"/>
                <div v-for="(item,index) in emailform">
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">ID</el-col>
                      <el-col :span="18">{{item.indicator}}</el-col>
                    </el-row>
                  </div>
                  <div class="info">
                    <el-row>
                      <el-col :span="6">类型</el-col>
                      <el-col :span="18">{{item.itype}}</el-col>
                    </el-row>
                  </div>
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">端口列表</el-col>
                      <el-col :span="18">{{item.portlist}}</el-col>
                    </el-row>
                  </div>
                  <div class="info">
                    <el-row>
                      <el-col :span="6">协议</el-col>
                      <el-col :span="18">{{item.protocol}}</el-col>
                    </el-row>
                  </div>
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">来源</el-col>
                      <el-col :span="18">{{item.provider}}</el-col>
                    </el-row>
                  </div>
                  <div class="info">
                    <el-row>
                      <el-col :span="6">上报时间</el-col>
                      <el-col :span="18">{{item.reporttime}}</el-col>
                    </el-row>
                  </div>
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">可信度</el-col>
                      <el-col :span="18">{{item.confidence}}</el-col>
                    </el-row>
                  </div>
                  <div class="info">
                    <el-row>
                      <el-col :span="6">标签</el-col>
                      <el-col :span="18">{{item.tags}}</el-col>
                    </el-row>
                  </div>
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">描述</el-col>
                      <el-col :span="18">{{item.protocol}}</el-col>
                    </el-row>
                  </div>
                  <div class="info">
                    <el-row>
                      <el-col :span="6">国家简称</el-col>
                      <el-col :span="18">{{item.cc}}</el-col>
                    </el-row>
                  </div>
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">城市</el-col>
                      <el-col :span="18">{{item.city}}</el-col>
                    </el-row>
                  </div>
                  <div class="info">
                    <el-row>
                      <el-col :span="6">时区</el-col>
                      <el-col :span="18">{{item.timezone}}</el-col>
                    </el-row>
                  </div>
                  <div class="info indexOS">
                    <el-row>
                      <el-col :span="6">纬度</el-col>
                      <el-col :span="18">{{item.latitude}}</el-col>
                    </el-row>
                  </div>
                  <div class="info" style="padding-bottom: 2%;">
                    <el-row>
                      <el-col :span="6">经度</el-col>
                      <el-col :span="18">{{item.longitude}}</el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>


        </section>
      </div>
    </div>
  </div>
</template>

<script>
  import { isvalidateIP, checkEmail } from '../../utils/validate.js'
  import { search } from '../../api/info/information.js'


  export default {
    data() {
      return {
        activeName: '',
        isIPResult: true,
        isPortResult: true,
        isMailResult: true,
        isTrue: '0',
        searchIP: {
          key: '',
          status: false,
          isNoResult: false
        },
        searchName: {
          key: '',
          status: false,
          isNoResult: false
        },
        searchEmail: {
          key: '',
          status: false,
          isNoResult: false
        },
        IPform: [],
        nameform: [],
        emailform: [],
        /*IPform: {
            indicator: '',
            itype: '',
            portlist: '',
            protocol: '',
            provider: '',
            reporttime: '',
            confidence: '',
            tags: '',
            description: '',
            cc: '',
            city: '',
            timezone: '',
            latitude: '',
            longitude: ''
        },
        nameform: {
            indicator: '',
            itype: '',
            portlist: '',
            protocol: '',
            provider: '',
            reporttime: '',
            confidence: '',
            tags: '',
            description: '',
            cc: '',
            city: '',
            timezone: '',
            latitude: '',
            longitude: ''
        },
        emailform: {
            indicator: '',
            itype: '',
            portlist: '',
            protocol: '',
            provider: '',
            reporttime: '',
            confidence: '',
            tags: '',
            description: '',
            cc: '',
            city: '',
            timezone: '',
            latitude: '',
            longitude: ''
        }*/

      }
    },
    methods: {
      handleClick(tab, event) {
        this.isTrue = tab.index;
         if (tab.index == '0') {
           this.isIPResult = true;
           this.isPortResult = false;
           this.isMailResult = false;
         } else if (tab.index == '1'){
           this.isIPResult = false;
           this.isPortResult = true;
           this.isMailResult = false;
         }else{
           this.isIPResult = false;
           this.isPortResult = false;
           this.isMailResult = true;
         }
      },
      ipValidate() {
        var value = this.searchIP.key;
        if (!isvalidateIP(value)) {
          this.$message({
            type: 'warning',
            message: 'IP格式不正确'
          });
          return false;
        } else {
          return true
        }

      },
      emailValidate() {
        var value = this.searchEmail.key;
        if (!checkEmail(value)) {
          this.$message({
            type: 'warning',
            message: '邮箱格式不正确'
          });
          return false;
        } else {
          return true
        }

      },
      IPSearch() {

        var state = this.ipValidate();
        if (state) {
          var that = this;
          var param = {
            'key': this.searchIP.key
          }
          search(param).then(res => {
            if (res.result.results != null) {
              that.IPform = res.result.results;
              that.searchIP.status = true;
              that.searchIP.isNoResult = false;
            } else {
              that.searchIP.status = false;
              that.searchIP.isNoResult = true;
            }
          })

        }
      },
      nameSearch() {
        if (this.searchName.key == '') {
          this.$message({
            type: 'warning',
            message: '请输入需要查询域名'
          });
          return false
        }
        var that = this;
        var param = {
          'key': this.searchName.key
        }
        search(param).then(res => {

          if (res.result.results != null) {
            that.nameform = res.result.results;
            that.searchName.status = true;
            that.searchName.isNoResult = false;
          } else {
            that.searchName.status = false;
            that.searchName.isNoResult = true;
          }
        })
      },
      emailSearch() {
        var state = this.emailValidate();
        if (state) {
          var that = this;
          var param = {
            'key': this.searchEmail.key
          }
          search(param).then(res => {

            if (res.result.results != null) {
              that.emailform = res.result.results;
              that.searchEmail.status = true;
              that.searchEmail.isNoResult = false;
            } else {
              that.searchEmail.status = false;
              that.searchEmail.isNoResult = true;
            }
          })
        }
      }
    },
    mounted() {
      this.$refs.threatInfo.style.height = (`${document.documentElement.clientHeight}` -120)+'px';
    }
  }

</script>
<style>

  /* .info .el-form-item{
    margin-bottom:0;
  }
  .info .el-form-item:nth-child(odd){
    background:#eef4fb;
  }
  .info .el-form-item__label{
    line-height: 30px;
  }*/
  .infomation .el-icon-nameInfo, .infomation .el-icon-mailInfo,.infomation .el-icon-ipInfo{
    margin-bottom:-5px;
  }

  .info{
    color: #606266;
    line-height: 30px;
    margin: 0 auto;
    padding: 6px 1%;
    width: 90%;
  }
  .indexOS{
    background:#eef4fb;
  }
  /* .info .el-row .el-col:nth-child(1) {
    text-align: right;
  }
  .info .el-row .el-col:nth-child(2) {
    text-align: left;
    padding:0 2%;
  } */
  .searchResult-y-img{
    position: absolute;right:10px;top:30px;right:30px;width: 12%;
  }
  .searchResult-n{
    text-align:center;padding:30px 0;
  }
  .searchResult-y, .searchResult-n{
    background:#fff;border:1px solid #ccc;margin-top:10px;border-radius: 3px;overflow: auto;
  }
  .searchResult-y{
    height: auto;
    position: relative;
  }
  .t-result1{
    width: 65%;
    margin: 20px auto 30px auto;
    padding-top: 20px;
  }
  .searchResult-y .titlen{
    padding: 20px 20px 20px 44px;font-size: 16px;color: #333;font-weight: 500;
  }
  .searchResult-y .el-form{
    padding:0 30px;
  }
</style>
