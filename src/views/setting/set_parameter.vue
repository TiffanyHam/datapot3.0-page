<template>
    <div class="title" ref="setParamCon">
    	<div class="filter-container">
     	 <el-row :gutter="20">
       	 <el-col :span="22">
          <div class="grid-content">
              <el-form ref="form" :model="form" label-width="20%" style="text-align: left;">
                  <template v-for="item in params">
                      <el-form-item :label="item.nameZh">
                          <el-input v-model="item.value" :label="item.nameEn" style="width:80%"></el-input>
                          <el-button type="text" @click='setParams(item.value, item.nameEn)'>设置</el-button>
                      </el-form-item>
                  </template>
              </el-form>
          		<!-- <el-form ref="form" :model="form" label-width="150px">
                <el-form-item label="活动名称">
                    <el-input v-model="form.name" style="width:90%"></el-input>
                    <el-button type="text">设置</el-button>
                </el-form-item>
  
                </el-form>
                <el-form ref="form" :model="form" label-width="150px">
                  <el-form-item label="打分基数">
                   <el-input v-model="form.name" style="width:90%"></el-input>
                    <el-button type="text">设置</el-button>
                </el-form-item>
                </el-form>
                <el-form ref="form" :model="form" label-width="150px">
                  <el-form-item label="比率">
                    <el-input v-model="form.name" style="width:90%"></el-input>
                    <el-button type="text">设置</el-button>
                </el-form-item>
                </el-form>
                <el-form ref="form" :model="form" label-width="150px">
                  <el-form-item label="查询时间索引">
                    <el-input v-model="form.name" style="width:90%"></el-input>
                    <el-button type="text">设置</el-button>
                </el-form-item>
                </el-form>
                <el-form ref="form" :model="form" label-width="150px">
                  <el-form-item label="查询时间">
                    <el-input v-model="form.name" style="width:90%"></el-input>
                    <el-button type="text">设置</el-button>
                </el-form-item>
                </el-form>
                <el-form ref="form" :model="form" label-width="150px">
                  <el-form-item label="数据来源">
                    <el-input v-model="form.name" style="width:90%"></el-input>
                    <el-button type="text">设置</el-button>
                </el-form-item>
                </el-form>
                <el-form ref="form" :model="form" label-width="150px">
                  <el-form-item label="解析SnortAlert任务">
                    <el-input v-model="form.name" style="width:90%"></el-input>
                    <el-button type="text">设置</el-button>
                </el-form-item>
                </el-form>
                <el-form ref="form" :model="form" label-width="150px">
                  <el-form-item label="可信度指标">
                    <el-input v-model="form.name" style="width:90%"></el-input>
                    <el-button type="text">设置</el-button>
                </el-form-item>
                </el-form> -->
  		  </div>
  		 </el-col>
  		 </el-row>
  		</div>
  	</div>
</template>
<script>
  import { getParams, setParam } from '../../api/setting/set_parameter.js'

  export default {
    data () {
      return {
      	params: [],
        form: {
          
        }
      }
    },
    methods: {
      setParams(value, name) {
          
        this.$confirm('确认要设置该参数吗?', '提示', {
          type: 'warning'
        }).then(() => {
          var that = this;
          var param = {
            'nameEn': name,
            'value': value
          }
          setParam(param).then(res => {
              this.$message({
                type: 'success',
                message: '设置成功!'
              });
              this.getParameter();
          })
        })
      },
      getParameter() {
        var that = this;
        getParams().then(res => {
            that.params = res.result;
        })
      }
    },
    mounted() {
      this.getParameter();
      this.$refs.setParamCon.style.height = (`${document.documentElement.clientHeight}`-125)+"px"
    }

  }
</script>
