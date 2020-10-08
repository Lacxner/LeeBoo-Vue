<template>
  <div id="card">
  	<header>
		<!-- 头像 -->
		<el-avatar shape="square" size="large" :src="myself.avatar"></el-avatar>
		<!-- 用户名 -->
		<p class="name">{{ myself.name }}</p>
  	</header>
  	<footer>
  		<span style="font-size: 18px">所有操作员</span>
  	</footer>
  </div>
</template>

<script>
export default {
	data () {
		return {
			myself: JSON.parse(localStorage.getItem('user'))
		}
	},
	created() {
	}
}
</script>

<style lang="scss" scoped>
header {
	display: flex;
	align-items: center;
	height: 80px;
}
#card {
	padding: 12px;
	.name {
		display: inline-block;
		padding: 10px;
		font-size: 20px;
	}
	.search {
		background: #26292E;
		height: 30px;
		width: 87%;
		line-height: 30px;
		padding: 0 10px;
		border: 1px solid #3a3a3a;
		border-radius: 4px;
		// 鼠标点击后不会出现蓝色边框
		outline: none;
		color: gray;
	}
}
</style>
