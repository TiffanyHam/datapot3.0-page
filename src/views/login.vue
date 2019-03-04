<template>
  <div class="login-wrap" ref="loginContainer">
    <vue-particles
      color="#fff"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="4"
      linesColor="#fff"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
    <div class="logo">
      <img src="../assets/images/logo.png"/>
    </div>
    <div class="login-box">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
        <div class="marcontent">
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item prop="loginPwd">
          <el-input type="password" v-model="loginForm.loginPwd" placeholder="密码" @keyup.enter.native="submitForm" clearable></el-input>
        </el-form-item>
        <el-form-item prop="loginCode" v-show="isloginCode">
          <el-input v-model="loginForm.loginCode" style="width:180px;float:left;" @keyup.enter.native="submitForm" placeholder="验证码" clearable></el-input>
          <img :src="codeImg" class="loginCode" @click="updateCode" alt="验证码" title="点击换一张">
        </el-form-item>
        </div>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm" @keyup.enter.native="submitForm">登录</el-button>
        </div>
      </el-form>
    </div>

	<div class="records-box">
		<el-row>
		<el-col :span="24"><div class="records-box-infos">版权所有&copy;深圳市众泰兄弟科技发展有限公司&nbsp;&nbsp;&nbsp;&nbsp;版本号：V3.1&nbsp;&nbsp;&nbsp;&nbsp;推荐使用谷歌、火狐浏览器&nbsp;&nbsp;&nbsp;&nbsp;推荐分辨率1920*1080</div></el-col>
		</el-row>
	</div>
  </div>
</template>
<script>
    /*import VueParticles from 'vue-particles'*/
   import { encryptByDES } from '../utils/deleCache.js'
   import { getValidateCode } from '../api/login.js'
   import { getToken, setToken } from '../utils/auth.js'


    export default {
        data() {
            return {
              isloginCode: false,
              cHeight: '',
              checked: false,
              codeImg: '',
              loginForm: {
                userName: '',
                loginPwd: '',
                loginCode: ''
              },
              sendForm: {
                userName: '',
                loginPwd: '',
                loginCode: ''
              },
              loginRules:{
        				userName: [
        				  { required: true, message: '请输入用户名', trigger: 'blur' }
        				],
        				loginPwd: [
        				  { required: true, message: '请输入密码', trigger: 'blur' },
        				  { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        				],
        				/*loginCode: [
        				  { required: true, message: '请输入验证码', trigger: 'blur' },
        				]*/
              }
            }
        },
        methods: {
          changeFixed(h){
            this.$refs.loginContainer.style.height = h+'px';
          },
          updateCode() {
            this.getCodeImg();
          },
          getCodeImg() {
            /* http://192.168.20.141:18075/validatecode64 */
            const that = this;
            getValidateCode('').then(res => {
              const url = 'data:image/png;base64,'+res.result;
              that.codeImg = url;
            })
          },
          submitForm() {
      			this.$refs.loginForm.validate(valid => {
      			 if (valid) {

                  //校验验证码是否输入
                 if (this.isloginCode == true && this.loginForm.loginCode == '') {
                    this.$message({
                        type: 'warning',
                        message: "请输入验证码"
                    })
                    return false
                 }

      				   localStorage.setItem('om_username',this.loginForm.userName);
                 
                 this.sendForm.userName = encryptByDES(this.loginForm.userName);
                 this.sendForm.loginPwd = encryptByDES(this.loginForm.loginPwd);
                 this.sendForm.loginCode = this.loginForm.loginCode;
                 //console.log(this.sendForm.userName);
                 //console.log(this.sendForm.loginPwd);
                 this.$store.dispatch('Login', this.sendForm).then(res => {
                    //this.$router.push({ path: '/' })
                    this.$router.push('/');
                  }).catch((res) => {
                    this.isloginCode = true;
                    this.getCodeImg(); //刷新验证码
                    this.loginForm.loginCode = "";
                  })
      			 }
		        })
          }
        },
        watch: {
          cHeight: function (val) {
            this.changeFixed(val)
          }
        },
        mounted() {
            this.cHeight = document.documentElement.clientHeight
            var that = this;
            window.onresize = function temp() {
              that.cHeight = document.documentElement.clientHeight;
              that.$refs.loginContainer.style.height = cHeight+'px';
            };

            //获取验证码
            //this.getCodeImg();
        }
    }
</script>
<style>
  .login-wrap{
    position: relative;
    width:100%;
    height:100%;
    background:url(../assets/images/bg-login.jpg) no-repeat center center;
    background-size: 100% 100%;
    overflow:hidden;
  }
  .login-wrap .logo{
    margin:10px 0 0 46px;
  }
  .login-box{
    position: absolute;
    top:50%;
    left:50%;
    width:323px;
    min-height:192px;
    height: auto;
    margin:-175px 0 0 -161px;
    /* background:url(../assets/images/bg-login-box.png) no-repeat center; */
    background:rgba(153,153,153,0.15);
    padding-bottom: 42px;
  }
  .marcontent{
    padding:71px 0 0 28px;
    background:url(../assets/images/title-login-box.png) no-repeat center 26px;
  }
  .login-box .el-input{
    width:272px;
  }
  .login-box .el-input__inner{
    height:30px;
    line-height:30px;
    background:#2b373e;
    border:0;
    border:1px solid #939a9f;
    border-radius:0;
    color:#fff;
  }
  .login-box .el-form-item{
    margin-bottom:0;
  }
  .login-box .el-button{
    padding: 8px 82px;
    border-radius:0;
    border:0px;
    background:#4b88a5;
    display: block;
    margin:10px auto 0 auto;
  }
  .records-box{
  	position:absolute;
  	bottom:0;
  	width:100%;
  }
  .records-box-infos{
  	text-align:center;
  	color:rgb(255,255,255);
  	line-height:40px;
  	background:rgba(0,0,0,.8);
    letter-spacing: 1px;
    font-size:12px;
  }
</style>
