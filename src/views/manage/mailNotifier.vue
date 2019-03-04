<template>
  <div class="title" style="height: 87%;overflow: auto">
    <!--邮件服务器配置-->
    <div class="filter-container">
      <el-row>
        <el-col :span="24" style="padding: 6px 10px;background: #eee;">邮件服务器配置</el-col>
      </el-row>
      <div style="margin:30px;">
        <el-row>
          <el-col :span="8">
            <el-form :label-position="labelPosition" label-width="110px" :model="emailForm" ref="emailForm" :rules="rules">
              <el-form-item label="发送服务器：" prop="server">
                <el-input v-model="emailForm.server" placeholder="请输入服务器地址"></el-input>
              </el-form-item>
              <el-form-item label="邮箱账号：" prop="account">
                <el-input v-model="emailForm.account" placeholder="请输入邮箱账号"></el-input>
              </el-form-item>
              <el-form-item label="邮箱密码：" prop="password">
                <el-input type="password" v-model="emailForm.password" placeholder="请输入邮箱密码"></el-input>
              </el-form-item>
              <el-form-item class="btns">
                <el-button type="primary" @click="sendEmail">提交</el-button>
                <el-button type="info"  @click="resetEmail">重置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>

    </div>
    <!--威胁告警信息-->
    <div class="filter-container">
      <el-row>
        <el-col :span="24" style="padding: 6px 10px;background: #eee;">威胁告警信息</el-col>
      </el-row>
      <div style="margin:30px;">
        <el-row>
          <el-col :span="8">
            <el-form :label-position="labelPosition" label-width="100px" :model="detectForm" ref="detectForm">
              <el-form-item label="接收邮箱：" prop ="emailto">
                <el-row>
                  <el-col :span="23"><el-input v-model="detectForm.emailto" placeholder="请输入邮箱账号"></el-input></el-col>
                  <el-col :span="1" style="font-size:18px;color: #409EFF;font-weight: 800">
                    <i class="el-icon-plus" @click="addEmail"></i>
                  </el-col>
                </el-row>
                <el-row v-for="(item,x) in clients" :key="x">
                  <el-col class="moreEmail">
                    <div v-on:mouseenter="visible(x)" @mouseleave="invisible(x)">
                      <span class="emailItem">{{item.client}}</span>
                      <i class="cir el-icon-close" v-show="activeIndex === x" @click="delEmail(item,x)"></i>
                    </div>
                  </el-col>
                </el-row>
                <!--<el-row v-for="(item,index) in Eamilarr" :key="index">
                  <el-col class="moreEmail">
                    <div v-on:mouseenter="visible(index)" @mouseleave="invisible(index)">
                      <span class="emailItem">{{item}}</span>
                      <i class="cir el-icon-close" v-show="activeIndex === index" @click="delEmail(item,index)"></i>
                    </div>
                  </el-col>
                </el-row>-->
                <!--<el-row v-for="(item,index) in Eamilarr">
                  <el-col class="moreEmail">
                    <span class="emailItem">{{item}}</span>
                    <span class="cir el-icon-close" @click="delEmail"></span>
                  </el-col>

                </el-row>-->
              </el-form-item>
              <el-form-item label="发送频率：" prop="frequency">
                <el-radio-group v-model="detectForm.frequency">
                  <el-radio  v-for="(item,index) in frequent" :label="index">
                    <span v-if="index === '0'">实时</span>
                    <span v-else>{{index}}分钟</span>
                  </el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item class="btns">
                <el-button type="primary" @click="sendDetect">提交</el-button>
                <el-button type="info"  @click="resetDetect">重置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>

    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import axios from 'axios'
  import {checkEmail } from '../../utils/validate.js'
  import {getConstant,getSeverConfirm,getAddEmail,getAllInfo,getDelInfo,getRecive} from '../../api/manage/mailNotifier.js'

  export default {
    data() {

      return {
        activeIndex: -1,
        labelPosition: 'left',
        flag:true,
        seen:false,
        emailForm: {
          server: '',
          account: '',
          password: '',
          id:''
        },
        detectForm: {
          emailto: '',
          frequency: '0',
        },
        frequent:'',
        rules:{
          server: [
            { required: true, message: '服务器地址不能为空！', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          account: [
            { required: true, message: '邮箱账号不能为空！', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '邮箱密码不能为空！', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
        },
        Eamilarr:[],
        clients:[],
        eText:'',
        i:0,
        blackArr: [],
        delClient:[]
      }
    },
    methods:{
      visible:function(x){
        this.activeIndex = x;
      },
      invisible:function(x){
        this.activeIndex = -1;
      },
      //初始数据
      initContents(){
        getAllInfo('').then(res =>{
          let servers = res.result.server
          this.sever = servers.server
          this.acco = servers.account
          this.psd = servers.password
          servers == null ? this.emailForm = [] : this.emailForm = servers;

          this.clients = res.result.client;
          if(res.result.fre != null){
            this.fres = res.result.fre.frequency.toString()
            this.detectForm.frequency = this.fres //字符串类型
          }

        })
      },
      //常量
      initConstant() {
        getConstant('').then(res => {
          this.frequent = res.result.frequency //发送频率
        })
      },
      //添加邮箱
      addEmail(){
        let eText = this.detectForm.emailto;
        let itemLen = this.clients.length;

        if(eText !==''){
          if (!checkEmail(eText)) {
            this.$message.error("请输入正确的邮箱格式！")
          }else{
            if(itemLen < 5){
              this.i++
              let status = false;
              for(let x= 0; x < itemLen; x++){
                if (this.clients[x].client == eText) {//判断输入的邮箱是否有重复
                  status = true;
                }
              }
              if (status == false) {
                this.$set(this.clients,itemLen,{client:eText,id:itemLen,isNew:true});
                this.detectForm.emailto =''
                return true
              } else {
                this.$message.error("邮箱已存在！")
                return false
              }

            }else{
              this.$message.error("最多添加5个邮箱！")
            }
          }
        }else{
          this.$message.error('请输入邮箱账号！')
        }

      },
      //删除邮箱
      delEmail(x){

        for(var i in this.clients){

          if(this.clients[i].client == x.client){

            if (this.clients[i].isNew != true) {
              this.delClient.push(this.clients[i])     //delClient 存储数据库中被删除的数据
            }
            this.clients.splice(i, 1);//删除数组下表为index的1个数组
          }
        }

      },
      //邮件服务器配置（提交）
      sendEmail(){
        this.$refs.emailForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交当前信息吗？', '操作提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: false
            }).then(() => {
              getSeverConfirm(this.emailForm).then(res =>{
                this.$message({
                  type: 'success',
                  message: '成功提交!'
                });
              })

            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交'
              });
            });

          }
        })
      },
      //威胁告警信息（提交）
      sendDetect(){

        let eText = this.detectForm.emailto;
        let itemLen = this.clients.length;
        this.$confirm('确认提交当前信息吗？', '操作提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: false
        }).then(() => {

          if(eText !=='') {
            if (!checkEmail(eText)) {
              this.$message.error("请输入正确的邮箱格式！")
            }else {
              if(itemLen < 5){

                let status = false;
                for(let x= 0; x < itemLen; x++){
                  if (this.clients[x].client == eText) {//判断输入的邮箱是否有重复
                    status = true;
                  }
                }
                if (status == false) {
                  this.$set(this.clients,itemLen,{client:eText,id:itemLen});
                  this.detectForm.emailto =''
                  this.cofirmEmail()
                  return true
                } else {
                  this.$message.error("邮箱已存在！")
                  return false
                }

              }else{
                this.$message.error("最多添加5个邮箱！")
              }
            }
          }else{
            this.cofirmEmail()
          }

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交'
          });
        });
      },
      //提交邮箱
      cofirmEmail(){
        var str = '';
        for (let i in this.clients) {
          if (i == this.clients.length - 1) {
            str += this.clients[i].client;
          } else {
            str += this.clients[i].client + ",";
          }
        }
        let para = {
          type: this.detectForm.frequency,
          emailTos: str
        }
        getRecive(para).then(res => {
          this.delClient = []
          this.$message({
            type: 'success',
            message: '成功提交!'
          });
        })

      },

      //重置
      resetEmail(){
        this.emailForm.server = this.sever
        this.emailForm.account = this.acco
        this.emailForm.password = this.psd
      },
      //重置
      resetDetect(){
        this.detectForm.frequency = this.fres
        this.detectForm.emailto ='';
        var newClients = [];//数据库不存在的需要删除的元素
        for(var y= 0; y < this.clients.length; y++){

          if(!this.clients[y].isNew){    //isNew区分新添加未提交的邮箱
            //this.clients.splice(y, 1)  //新添加的未提交数据库  删除以后  点重置后删除  恢复原状
            //let sId = this.clients[y].id
            //this.clients.splice(this.clients.indexOf(y), 1)
            //this.clients = this.clients.filter(t => t.id != sId)
            //this.$delete(this.clients[y])
            newClients.push(this.clients[y]);
          }
        }
        this.clients = newClients;

        for (let x in this.delClient){
          this.clients.push(this.delClient[x])  //数据库存在的  删除以后  点重置后恢复
        }
        this.delClient = []

      },



    },
    mounted(){
      this.initContents()//初始化列表
      this.initConstant()
    }


  }
</script>
<style>

  .btns .el-form-item__content {
    margin-left: 0px!important;
    margin-top: 10px;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
  .btns .el-button {
    padding: 7px 25px;
  }
  .moreEmail{
    margin: 0 15px;
    position: relative;
  }
  .emailItem{
    margin-right: 50px
  }
  .emailItem:hover{
    color: #409EFF;
  }
  .cir{
    color: #fff;
    border-radius: 50%;
    background: red;
    padding: 2px;
    font-size: 12px;
    position: absolute;
    right: 40px;
    top: 13px;
  }
</style>
