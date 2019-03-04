<template>
  <div id="head" class="head-container">
    <el-row>
      <el-col :span="21">
        <div class="head-top">
          <h1>AIS智能安全分析平台</h1>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="head-top">
          <div class="fr" style="padding-right:10px">
          <el-dropdown @command="handleTags" trigger="click">
            <span class="el-dropdown-link">
              <a href="javascript:;">{{userName}} <i class="el-icon-arrow-down el-icon--right"></i></a>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="update">修改密码</el-dropdown-item>
              <el-dropdown-item command="out">退出登录</el-dropdown-item>
             <!--  <el-dropdown-item command="about">关于我们</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
          </div>
        </div>
      </el-col>
    </el-row>

     <!--修改密码-->
    <el-dialog title="修改密码" :visible.sync="dialogFormPSWVisible"  width="350px">
      <el-form :model="pswForm" :rules="pswRules" ref="pswForm" label-width="80px">
        <el-form-item label="原密码" prop="oldPwd">
           <el-input type="password" v-model="pswForm.oldPwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="pswForm.newPwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="newPwdConfirm">
          <el-input type="password" v-model="pswForm.newPwdConfirm" @keyup.enter.native="updatePswSave"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer"  style="text-align: center">
        <el-button @click="dialogFormPSWVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePswSave" @keyup.enter.native="updatePswSave">确 定</el-button>
      </div>
    </el-dialog>

    

  </div>
</template>

<script>
import { validatepsw } from '../utils/validate.js'
import { updatepassword } from '../api/login.js'
import { encryptByDES } from '../utils/deleCache.js'

export default {
  data () {
    const pswsh = (rule, value, callback) => {
      //var reg = /^[0-9a-zA-Z]{6,15}$/;
      if (!validatepsw(value)) {
        callback(new Error('密码须由字母、数字、下划线组成，长度为6-18个字符'))
      } else {
        callback()
      }

    }
    const pswlen = (rule, value, callback) => {
      var le = value.toString().length;
      if (le < 6 && le > 18) {
        callback(new Error('密码须由字母、数字、下划线组成，长度为6-18个字符'))
      } else {
        callback()
      }
    }
    const opswsame = (rule, value, callback) => {
      var opsw = this.pswForm.oldPwd;
      if (value == opsw) {
        callback(new Error('新密码不能与原密码一致'))
      } else {
        callback()
      }
    }
    const npswsame  = (rule, value, callback) => {
      var npsw = this.pswForm.newPwd;
      if (value !== npsw) {
        callback(new Error('确认密码必须与新密码一致'))
      } else {
        callback()
      }
    }
    return {
        dialogFormPSWVisible: false,
        userName: localStorage.getItem('om_username'),
        flag: true,
        pswForm: {
          oldPwd: '',
          newPwd: '',
          newPwdConfirm: ''
        },
        sengPswForm: {
          oldPwd: '',
          newPwd: '',
          newPwdConfirm: ''
        },
        pswRules: {
            oldPwd: [
              { required: true, message: '请输入密码', trigger: 'blur' }
            ],
            newPwd: [
              { required: true, message: '请输入新密码', trigger: 'blur' },
              { validator: pswsh, message: '密码须由字母、数字、下划线组成，长度为6-18个字符', trigger: 'blur' },
              { validator: pswlen, message: '密码须由字母、数字、下划线组成，长度为6-18个字符', trigger: 'blur' },
              { validator: opswsame, message: '新密码不能与原密码一致', trigger: 'blur' }
            ],
            newPwdConfirm: [
              { required: true, message: '请输入确认密码', trigger: 'blur' },
              { validator: npswsame, message: '新密码输入不一致，请重新输入', trigger: 'blur' },
              { validator: opswsame, message: '新密码输入不一致，请重新输入', trigger: 'blur' }
            ]
        }
    }
  },
  methods: {
    updatePsw() {
      this.dialogFormPSWVisible = true;
      if (this.$refs['pswForm'] !== undefined) {
           this.$refs['pswForm'].resetFields();//重置验证
      }
    },
    updatePswSave() {
      this.$refs.pswForm.validate(valid => {
        if (valid) {
            var that = this;
            that.sengPswForm.oldPwd = encryptByDES(that.pswForm.oldPwd);
            that.sengPswForm.newPwd = encryptByDES(that.pswForm.newPwd);
            that.sengPswForm.newPwdConfirm = encryptByDES(that.pswForm.newPwdConfirm);
            var param = {
                "oldPwd": that.sengPswForm.oldPwd,
                "newPwd": that.sengPswForm.newPwd,
                "newPwdConfirm": that.sengPswForm.newPwdConfirm
              }
            updatepassword(param).then(res => {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                });
                that.dialogFormPSWVisible = false
            }).catch((res) => {
                  var msg = res.msg;
                  this.$message({
                    type: 'warning',
                    message: msg
                  });
            })

          }
      })

    },
    loginOut() {
      //localStorage.setItem('om_username',"");
      //后台登出
      this.$store.dispatch('LogOut','').then(res => {
        this.$router.push('/login');
        //location.reload();
      })
      //前端登出
      this.$store.dispatch('FedLogOut','').then(res => {
        this.$router.push('/login');
      })
    },
    handleTags(command){
      command === 'update' ? this.updatePsw() : this.loginOut();
    }
  }
}

</script>
<style>
.head-top{
  background:rgb(60,71,77);
  height:50px;
  line-height:50px;
  color:rgb(196,196,196);
}
.head-top .el-dropdown{
  color:rgb(196,196,196);
}
.head-top h1{
  font-size:20px;
  color: rgb(224,224,224);
}
</style>
