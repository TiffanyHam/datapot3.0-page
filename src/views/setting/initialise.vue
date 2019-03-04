<template>
     <div class="title" ref="initialiseCon">
    	<div class="filter-container initialise">
     	 <el-row :gutter="20">
       	 <el-col :span="22">
          <div class="grid-content">
    		<el-form ref="form" :model="form" label-width="100%;" style="text-align:left;">
				<el-form-item label="请选择要同步的数据">
			    <el-checkbox-group v-model="form.type">
			      <el-checkbox label="1" name="type">威胁类型</el-checkbox>
			      <el-checkbox label="2" name="type">Snort规则</el-checkbox>
			      <el-checkbox label="3" name="type">JobConfig</el-checkbox>
			      <el-checkbox label="4" name="type">IP</el-checkbox>
			      <el-checkbox label="5" name="type">威胁分数同步数据库</el-checkbox>
			      <el-checkbox label="6" name="type">威胁分数同步Redis</el-checkbox>
			    </el-checkbox-group>
				</el-form-item>
				<el-form-item>
				  <el-button type="primary" @click="initialise" style="margin-left: 30px;">同步数据</el-button>
				</el-form-item>
		    </el-form>
		  </div>
		</el-col>
		</el-row>
		</div>
    </div>
</template>
<script>
 import { setSysInit } from '../../api/setting/initialise.js'

  export default {
    data () {
      return {
      	form: {
      		type: []
      	}
      }
    },
    methods: {
		initialise() {
			if (this.form.type.length < 1) {
				this.$message({
	                type: 'warning',
	                message: '请选择要同步的数据'
	              });
				return false;
			}
			//var fd = new FormData();
			var fd = "";
			for (var i = 0; i < this.form.type.length; i++) {
				//fd.append("selectId", this.form.type[i]);
				if (i == this.form.type.length-1) {
					fd += this.form.type[i];
				} else {
					fd += this.form.type[i]+",";
				}
			}
			var param = {
				"selectIds": fd
			}
			setSysInit(param).then(res => {
			  this.$message({
                type: 'success',
                message: '数据同步成功'
              })
			}).catch(() => {
			  this.$message({
                type: 'info',
                message: "数据同步失败"
              });
			})
		}

    },
    mounted() {
    	this.$refs.initialiseCon.style.height = (`${document.documentElement.clientHeight}`-125)+"px"
    }

  }
</script>

<style>
.initialise .el-checkbox, .initialise .el-form-item__label{
	display: block;
	float: none;
	text-align: left;
	margin-left: 30px;
}
</style>
