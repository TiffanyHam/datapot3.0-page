<template>
<div>
  <div class="title company_ip">
    <div class="filter-container">
      <section class="app-container" ref="panor" style="overflow: auto;">
			<el-row>
				<el-col :span="8">
					<img src="../../assets/images/panorama/datapot.png" width="70" class="fr" style="margin-top:11%;" />
				</el-col>
				<el-col :span="16">
					<div class="dataPotTitle fl">
						<h1>DataPot 网络安全态势感知平台</h1>
						<p>Just A Rather Very Intelligent System</p>
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<div style="width:70%;margin:20px auto;">
						<el-carousel :interval="4000" type="card" height="300px">
					    <el-carousel-item v-for="item in 3" :key="item">
					      <img v-if="item==1" src="../../assets/images/panorama/1.png"/>
					      <img v-if="item==2" src="../../assets/images/panorama/2.png"/>
					      <img v-if="item==3" src="../../assets/images/panorama/3.png"/>
					    </el-carousel-item>
					  </el-carousel>
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-row>
					<el-col :span="24">
						<div class="datapot-link">
							<div class="datapot-a">
							<i class="el-icon-urlInfo2"></i>
							<a :href="screenUrl" target="_blank">点击进入态势感知平台</a>
							</div>
						</div>
					</el-col>
				</el-row>
			</el-row>
      </section>
    </div>

  </div>
  <div>
      <el-row>
        <el-col :span="24">
        <div class="vBb" style="letter-spacing: 1px;">版权所有&copy;深圳市众泰兄弟科技发展有限公司&nbsp;&nbsp;&nbsp;&nbsp;版本号：V3.1&nbsp;&nbsp;&nbsp;&nbsp;推荐使用谷歌、火狐浏览器&nbsp;&nbsp;&nbsp;&nbsp;推荐分辨率1920*1080</div>
        </el-col>
      </el-row>
  </div>
  </div>
</template>

<script>
	import { domain } from '../../request.js'

	export default {
		data() {
			return {
				imgs: [
					'../../assets/images/panorama/1.png',
					'../../assets/images/panorama/2.png',
					'../../assets/images/panorama/3.png'
				],
				screenUrl: domain.screen
			}
		},
		mounted() {
			this.$refs.panor.style.height = (`${document.documentElement.clientHeight}`-150)+'px';
		}
	}

</script>

<style>


</style>
