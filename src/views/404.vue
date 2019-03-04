<template>
    <div class="nfind-bg">
		<div class="nf-img">
			<img src="../assets/images/404/bird.png" class="bird slideRight1">
			<img src="../assets/images/404/clouds.png" style="left:36%;top:15%;" class="slideRight2">
			<img src="../assets/images/404/clouds.png" style="left:20%;top:25%;" class="slideRight3">
			<img src="../assets/images/404/clouds.png" style="left:70%;top:40%;" class="slideLeft">
			<img src="../assets/images/404/parachute.png" class="parachute bounceInUp">
		</div>
		<div class="nf-box">
			<h1>出错啦</h1>
			<p>----------------------------------------</p>
			<router-link to="/login">回到登录页</router-link>
		</div>
    </div>
</template>

<script>
 export default {
        data() {
            return {

            }
        }
   }
</script>

<style>
.nfind-bg{
	width: 100%;
	height: 100%;
	position: relative;
	background-color:#d2f5f1;
}
.nf-img {
	width: 100%;
}
.nf-img img{
	position: absolute;
}
.parachute{
	top:10%;
	left:20%;
}
.bird{
	top:10%;
	left:50%;
}
.nf-box{
	width:300px;
	height:150px;
	line-height: 30px;
	padding:50px 0 0 0;
	text-align: center;
	background-color:#fff;
	color:#289575;
	border:4px solid #c0ece7;
	position: absolute;
	top:30%;
	left:45%;
}
.nf-box h1{
	color:#e94c3c;
}
.bounceInUp{
	 animation:float 4s 1s infinite;
	 -webkit-animation:float 4s 1s infinite;
}
.slideLeft{
	animation:slideLeft 7s 7s both;
	 -webkit-animation:slideLeft 4s 3s both;
}
.slideRight1{
	animation:slideRight 4s 1s both;
	 -webkit-animation:slideRight 4s 3s both;
}
.slideRight2{
	animation:slideRight 5s 3s both;
	 -webkit-animation:slideRight 4s 3s both;
}
.slideRight3{
	animation:slideRight 6s 5s both;
	 -webkit-animation:slideRight 4s 3s both;
}
</style>
